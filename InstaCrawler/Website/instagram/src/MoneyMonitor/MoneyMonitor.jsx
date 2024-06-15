import React, { useEffect, useState } from "react";
import "./MoneyMonitor.css";
import MenuButton from "../Header/MenuButton.jsx";
import MoneyEntry from "./MoneyEntry.jsx";
import TransactionList from "./TransactionList.jsx";
import { animated, useSpring, config } from "react-spring";
import { fetchTransactions } from "./transactionService";

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
    }

    // Update net total
    groupedTransactions[key].netTotal =
      groupedTransactions[key].totalIncome +
      groupedTransactions[key].totalSpending;

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

  // Convert the object to an array of [key, value] pairs and sort by key
  const sortedGroupedTransactions = Object.entries(groupedTransactions).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  // Calculate percentage change
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

  // Convert back to an object
  return Object.fromEntries(sortedGroupedTransactions);
};

const ScalableHeading = ({ children }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const style = useSpring({
    scale: isScaled ? 0.85 : 1,
  });

  return (
    <animated.h1
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </animated.h1>
  );
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
const MoneyMonitor = () => {
  const [spendingTransactions, setSpendingTransactions] = useState([]);
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [incomeAvailablity, setIncomeAvailablity] = useState([]);
  const [spendingAvailablity, setSpendingAvailablity] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await fetchTransactions();
      const spending = transactions.filter(
        (transaction) => transaction.Category === "Spending"
      );
      const income = transactions.filter(
        (transaction) => transaction.Category === "Income"
      );
      setSpendingTransactions(groupTransactionsByMonth(spending));
      setIncomeTransactions(groupTransactionsByMonth(income));
      setIncomeAvailablity(
        Object.entries(getMonthDataAvailability(income)).reverse()
      );
      setSpendingAvailablity(
        Object.entries(getMonthDataAvailability(spending)).reverse()
      );
    };

    getTransactions();
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  const amountStyle = {
    color:
      totalBalance > 0 ? "rgba(131, 255, 201, 0.85)" : "rgb(255 102 102 / 85%)",
  };

  const [isMoreClicked, setIsMoreClicked] = useState(null);
  const scaleStyle = useSpring({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    scale: !!isMoreClicked ? 0.9 : 1,
    filter: !!isMoreClicked ? "blur(20px)" : "blur(0px)",
    config: config.slow,
  });

  console.log(
    Object.entries(incomeTransactions).length,
    Object.entries(spendingTransactions).length
  );

  return (
    <div className="MoneyMonitor_Main">
      {(Object.entries(incomeTransactions).length > 0 ||
        Object.entries(spendingTransactions).length > 0) && (
        <TransactionList
          Transactions={
            isMoreClicked === "Income"
              ? incomeTransactions
              : isMoreClicked === "Spending"
              ? spendingTransactions
              : []
          }
          isMoreClicked={isMoreClicked}
          setIsMoreClicked={setIsMoreClicked}
          dataAvailablity={
            isMoreClicked === "Income"
              ? incomeAvailablity
              : isMoreClicked === "Spending"
              ? spendingAvailablity
              : []
          }
        />
      )}
      <div className="MoneyMonitor_Parent">
        <div className="MoneyMonitor_header">
          <div className="MoneyMonitor_User">
            <div className="MoneyMonitor_Logo">
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
                alt="MoneyMonitor Logo"
              />
            </div>
            <p>
              <span>Money Monitor</span>
              <span>965896521</span>
            </p>
          </div>
          <MenuButton
            handleButtonClick={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
          />
        </div>
        <animated.div style={scaleStyle}>
          <div className="MoneyMonitor_Intro">
            <div className="MoneyMonitor_title">
              <span>
                Your{" "}
                <img
                  src={`${process.env.PUBLIC_URL}/MoneyMonitor.jpg`}
                  alt="MoneyMonitor Logo"
                />
                Transactions
              </span>
              <span>Dashboard</span>
            </div>
          </div>
          <div className="MoneyMonitor_Menu">
            <p>
              Add Transaction <span></span>
            </p>
            <ScalableHeading>
              <span>Income</span> Transactions
            </ScalableHeading>
            <ScalableHeading>
              <span>Spending</span> Transactions
            </ScalableHeading>
            <ScalableHeading>
              <span>Savings</span>
            </ScalableHeading>
            <p>
              <span></span>
            </p>
          </div>
          {(Object.entries(incomeTransactions).length > 0 ||
            Object.entries(spendingTransactions).length > 0) && (
            <MoneyEntry
              setTotalExpense={setTotalExpense}
              setTotalIncome={setTotalIncome}
              setIsMoreClicked={setIsMoreClicked}
              spendingTransactions={spendingTransactions}
              incomeTransactions={incomeTransactions}
            />
          )}
        </animated.div>
      </div>
    </div>
  );
};
export default MoneyMonitor;
