const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const groupTransactionsByMonth = (transactions) => {
  const groupedTransactions = {};

  transactions.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  transactions.forEach((transaction) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(transaction.Timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits
    const key = `${year}-${month}`;

    if (!groupedTransactions[key]) {
      groupedTransactions[key] = {
        transactions: [],
        totalSpending: 0,
        totalIncome: 0,
        totalSaving: 0,
        netTotal: 0,
        month: months[date.getMonth()],
        year: year,
        percentageChange: null,
        labelDistribution: {},
      };
    }

    groupedTransactions[key].transactions.push(transaction);

    if (transaction.Category === "Spending") {
      groupedTransactions[key].totalSpending += transaction.Amount;
    } else if (transaction.Category === "Income") {
      groupedTransactions[key].totalIncome += transaction.Amount;
    } else if (transaction.Category === "Save&Invest") {
      groupedTransactions[key].totalSaving += transaction.Amount;
    }

    // Update net total
    groupedTransactions[key].netTotal =
      groupedTransactions[key].totalIncome +
      groupedTransactions[key].totalSpending +
      groupedTransactions[key].totalSaving;

    // Count label occurrences
    const label = transaction.Label;
    if (label) {
      if (groupedTransactions[key].labelDistribution[label]) {
        groupedTransactions[key].labelDistribution[label] += transaction.Amount;
      } else {
        groupedTransactions[key].labelDistribution[label] = transaction.Amount;
      }
    }
  });

  // Determine top labels and sort by percentage (with stability)
  Object.keys(groupedTransactions).forEach((key) => {
    const totalAmount = groupedTransactions[key].netTotal;
    const labels = groupedTransactions[key].labelDistribution;

    // Calculate percentages and prepare for sorting
    const labelPercentages = Object.keys(labels).map((label) => {
      return {
        label,
        percentage: (labels[label] / totalAmount) * 100,
      };
    });

    // Sort labels by percentage descending, with stability by label name
    labelPercentages.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage; // Sort by percentage descending
      } else {
        return a.label.localeCompare(b.label); // Maintain stability by label name
      }
    });

    // Reconstruct label distribution with sorted percentages
    const sortedLabelDistribution = {};
    labelPercentages.forEach((item) => {
      sortedLabelDistribution[item.label] = item.percentage.toFixed(2);
    });

    // Assign sorted label distribution back to groupedTransactions
    groupedTransactions[key].labelDistribution = sortedLabelDistribution;
  });

  const sortedGroupedTransactions = Object.entries(groupedTransactions).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  let previousNetTotal = null;
  sortedGroupedTransactions.forEach(([key, value], index) => {
    const currentNetTotal = value.netTotal;
    if (index > 0 && previousNetTotal !== null) {
      const percentageChange =
        ((currentNetTotal - previousNetTotal) / Math.abs(previousNetTotal)) *
        100;
      groupedTransactions[key].percentageChange = parseInt(
        percentageChange.toFixed(0)
      );
    }
    previousNetTotal = currentNetTotal;
  });

  return Object.fromEntries(sortedGroupedTransactions);
};

const getMonthDataAvailability = (data) => {
  const availability = {};

  // Populate availability with true for months with data
  data.forEach((item) => {
    const timestamp = item.Timestamp;
    const [year, month, day] = timestamp.split(" ")[0].split("-").map(Number);

    const date = new Date(year, month - 1, day); // Month is zero-indexed in Date
    const monthName = monthsNames[date.getMonth()];

    if (!availability[year]) {
      availability[year] = {};
    }

    availability[year][monthName] = true;
  });

  // Determine the date range from the first transaction to the current date
  const firstTransactionDate = new Date(data[0].Timestamp);
  const currentDate = new Date();
  const currentMonth = new Date(currentDate);
  let counter = 1;

  // Populate months with no data as null
  while (currentMonth >= firstTransactionDate) {
    const year = currentMonth.getFullYear();
    const monthName = monthsNames[currentMonth.getMonth()];

    if (!availability[year]) {
      availability[year] = {};
    }

    if (!(monthName in availability[year])) {
      availability[year][monthName] = [null, counter];
    } else {
      availability[year][monthName] = [availability[year][monthName], counter];
      counter++;
    }

    currentMonth.setMonth(currentMonth.getMonth() - 1);
  }

  // Assign counter for months without data
  for (const year in availability) {
    for (const monthName in availability[year]) {
      if (!Array.isArray(availability[year][monthName])) {
        availability[year][monthName] = [
          availability[year][monthName],
          counter,
        ];
      }
    }
  }

  return availability;
};

const getNetAmounts = (income, spending, saving) => {
  // Find the latest month from available data
  const incomeMonths = Object.keys(income);
  const spendingMonths = Object.keys(spending);
  const savingMonths = Object.keys(saving);

  const allMonths = [...incomeMonths, ...spendingMonths, ...savingMonths];
  const latestMonth = allMonths.reduce((latest, month) => {
    if (!latest || new Date(month) < new Date(latest)) {
      return month;
    }
    return latest;
  }, null);

  // Get current calendar month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed

  // Generate an array of months from the latest month to the current month
  const months = [];
  const [latestYear, latestMonthNum] = latestMonth.split("-").map(Number);
  let tempDate = new Date(latestYear, latestMonthNum - 1);

  while (
    tempDate.getFullYear() < currentYear ||
    (tempDate.getFullYear() === currentYear &&
      tempDate.getMonth() <= currentMonth - 1)
  ) {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth() + 1;
    months.push(`${year}-${month.toString().padStart(2, "0")}`);

    // Increment the month, taking care of year transition if needed
    if (tempDate.getMonth() === 11) {
      tempDate.setFullYear(tempDate.getFullYear() + 1);
      tempDate.setMonth(0); // January (0-indexed)
    } else {
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
  }

  // Fill in the data for each month
  const result = months.reduce((acc, month) => {
    const incomeTotal = Number(income[month]?.netTotal.toFixed(2)) || 0;
    const spendingTotal = Number(spending[month]?.netTotal.toFixed(2)) || 0; // Round and convert to number
    const savingTotal = Number(saving[month]?.netTotal.toFixed(2)) || 0; // Round and convert to number
    const netTotal = Number((incomeTotal - spendingTotal).toFixed(2));
    acc[month] = {
      income: incomeTotal,
      spending: spendingTotal,
      saving: savingTotal,
      net: netTotal,
      month: monthsNames[Number(month.split("-")[1]) - 1],
    };
    return acc;
  }, {});

  return result;
};

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
};
const filterTransactionsByCategory = (transactions, category) =>
  transactions.filter((transaction) => transaction.Category === category);
const getSelectedMonthData = (transactionsByMonth, whichMonth) => {
  const entries = Object.entries(transactionsByMonth);
  return !!entries[entries.length - whichMonth]
    ? entries[entries.length - whichMonth][1]
    : null;
};

export const fetchTransactions = async ({ whichMonth }) => {
  const transactions = await fetchJson("/transactions_sorted.json");

  const spending = filterTransactionsByCategory(transactions, "Spending");
  const income = filterTransactionsByCategory(transactions, "Income");
  const saving = filterTransactionsByCategory(transactions, "Save&Invest");

  const spendingTransactions = groupTransactionsByMonth(spending);
  const incomeTransactions = groupTransactionsByMonth(income);
  const savingTransactions = groupTransactionsByMonth(saving);

  const incomeAvailability = Object.entries(
    getMonthDataAvailability(income)
  ).reverse();
  const spendingAvailability = Object.entries(
    getMonthDataAvailability(spending)
  ).reverse();
  const savingAvailability = Object.entries(
    getMonthDataAvailability(saving)
  ).reverse();

  const netAmounts = getNetAmounts(
    incomeTransactions,
    spendingTransactions,
    savingTransactions
  );

  const selectedIncome = getSelectedMonthData(incomeTransactions, whichMonth);

  const selectedspending = getSelectedMonthData(
    spendingTransactions,
    whichMonth
  );
  const selectedsaving = getSelectedMonthData(savingTransactions, whichMonth);

  return {
    selectedIncome,
    selectedspending,
    selectedsaving,
    incomeAvailability,
    spendingAvailability,
    savingAvailability,
    netAmounts,
  };
};
