import React from "react";
import { LuCalendarClock } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import TransactionListItem from "./TransactionListItem";

const transactions = [
  {
    description: "Coffee",
    date: "Mar 30",
    time: "08:00 AM",
    amount: "4.50",
  },
  {
    description: "York University",
    date: "Feb 3",
    time: "12:00 PM",
    amount: "12.00",
  },
];

const TransactionListMonthly = ({
  MainIndex,
  swipedIndex,
  handleUnSwipe,
  handleSwipe,
  handleTransactionClick,
}) => {
  const trendStyle = {
    color: "rgba(131, 255, 201, 0.85)",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  return (
    <div className="TransactionList_Monthly">
      <div className="TransactionList_MonthlyTitle">
        <p>
          <LuCalendarClock />
          Feb <span>2024</span>
        </p>
        <h2 style={trendStyle}>
          <span>+20%</span>
          <FaArrowTrendUp />
        </h2>
        <h1>
          Total: <span>$1000</span>
        </h1>
      </div>
      <ul className="TransactionList_TransactionList">
        {transactions.map((transaction, index) => (
          <TransactionListItem
            key={index}
            index={index}
            icon={transaction.icon}
            description={transaction.description}
            date={transaction.date}
            time={transaction.time}
            amount={transaction.amount}
            isSwiped={swipedIndex[1] === index && swipedIndex[0] === MainIndex}
            onSwipe={() => handleSwipe(MainIndex, index)}
            onUnSwipe={handleUnSwipe}
            onClick={(y) => handleTransactionClick(MainIndex, index, y)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TransactionListMonthly;
