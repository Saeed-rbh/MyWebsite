import React from "react";
import { LuCalendarClock } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import TransactionListItem from "./TransactionListItem";
import { useSpring, animated, config } from "react-spring";

const TransactionListMonthly = ({
  MainIndex,
  swipedIndex,
  handleUnSwipe,
  handleSwipe,
  handleTransactionClick,
  isMoreClicked,
  transactions,
  netTotal,
  percentageChange,
  month,
  year,
  sortby,
  dataAvailability,
  setWhichMonth,
  whichMonth,
}) => {
  const filteredTransactions =
    sortby === "All"
      ? transactions
      : transactions.filter((transaction) => transaction.Type === sortby);

  const delay = 300 + 20 * MainIndex;
  const style = useSpring({
    from: {
      opacity: !isMoreClicked ? 1 : 0,
      y: !isMoreClicked ? 0 : 50,
    },
    to: {
      opacity: isMoreClicked ? 1 : 0,
      y: isMoreClicked ? 0 : 50,
    },
    delay: isMoreClicked ? delay : 1000,
    config: config.slow,
  });

  const trendStyle = {
    color: percentageChange > 0 ? "var(--Fc-1)" : "var(--Gc-1)",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  return (
    <animated.div className="TransactionList_Monthly" style={style}>
      <div className="TransactionList_MonthlyTitle">
        <p>
          <LuCalendarClock />
          {month} <span>{year}</span>
        </p>
        <h2 style={trendStyle}>
          <span>{percentageChange}%</span>
          {percentageChange < 0 ? <FaArrowTrendDown /> : <FaArrowTrendUp />}
        </h2>
        {/* <h1>
          Total:{" "}
          <span
            style={{ color: isMoreClicked ? "var(--Fc-1)" : "var(--Gc-1)" }}
          >
            ${netTotal.toFixed(2)}
          </span>
        </h1> */}
      </div>
      <ul className="TransactionList_TransactionList">
        {filteredTransactions.map((transaction, index) => (
          <TransactionListItem
            key={index}
            index={index}
            icon={transaction.icon}
            description={transaction.Reason}
            type={transaction.Type}
            time={transaction.Timestamp}
            amount={transaction.Amount}
            isSwiped={swipedIndex[1] === index && swipedIndex[0] === MainIndex}
            onSwipe={() => handleSwipe(MainIndex, index)}
            onUnSwipe={handleUnSwipe}
            onClick={(y) => handleTransactionClick(MainIndex, index, y)}
          />
        ))}
      </ul>
      {
        <div className="TransactionList_MonthlyFooter">
          <h1>
            What <span>Month</span> are you looking for ?
          </h1>
          {dataAvailability.map((data, index) => (
            <p
              style={{
                background:
                  whichMonth === data[1][1] ? "var(--Bc-4)" : "var(--Ac-4)",
              }}
              onClick={() => setWhichMonth(data[1][1])}
              key={index}
            >
              <span>{data[0].split("-")[1]}</span>
              <span>{data[0].split("-")[0]}</span>
              <span
                style={{
                  background:
                    whichMonth === data[1][1]
                      ? "var(--Bc-1)"
                      : data[1][0]
                      ? "var(--Fc-1)"
                      : "var(--Gc-2)",
                }}
              ></span>
            </p>
          ))}
        </div>
      }
    </animated.div>
  );
};

export default TransactionListMonthly;
