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
  const availability = {};

  // Populate availability with true for months with data
  data.forEach((item) => {
    const timestamp = item.Timestamp;

    // Split timestamp into parts
    const parts = timestamp.split(" ")[0].split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    const date = new Date(year, month - 1, day); // Month is zero-indexed in Date
    const monthName = months[date.getMonth()];
    const yearMonthKey = `${year}-${monthName}`;
    availability[yearMonthKey] = true;
  });

  // Determine the date range from the first transaction to the current date
  const firstTransactionDate = new Date(data[0].Timestamp);
  const currentDate = new Date(); // Current date
  const currentMonth = new Date(currentDate);
  let counter = 1;

  // Populate months with no data as null
  while (currentMonth >= firstTransactionDate) {
    const year = currentMonth.getFullYear();
    const monthName = months[currentMonth.getMonth()];
    const yearMonthKey = `${year}-${monthName}`;
    if (!(yearMonthKey in availability)) {
      availability[yearMonthKey] = [null, counter];
    } else {
      availability[yearMonthKey] = [availability[yearMonthKey], counter];
      counter++;
    }
    currentMonth.setMonth(currentMonth.getMonth() - 1);
  }

  for (const key in availability) {
    if (Array.isArray(availability[key])) {
      continue;
    }
    availability[key] = [availability[key], counter];
  }

  return availability;
};

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
};
const filterTransactionsByCategory = (transactions, category) =>
  transactions.filter((transaction) => transaction.Category === category);
const getSelectedMonthData = (transactionsByMonth, whichMonth) => {
  const entries = Object.entries(transactionsByMonth);
  return entries[entries.length - whichMonth][1];
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
  };
};
