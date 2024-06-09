import React, { useRef, useState } from "react";
import { CiSearch, CiCalendarDate } from "react-icons/ci";
import TransactionListMonthly from "./TransactionListMonthly";
import TransactionModification from "./TransactionModification";
import { useSpring, animated } from "@react-spring/web";

const transactions = [
  {
    date: "Mar",
  },
  {
    date: "Feb",
  },
];

const TransactionList = () => {
  const monthlyMainRef = useRef(null);

  const [swipedIndex, setSwipedIndex] = useState([null, null]);
  const [transactionClick, setTransactionClick] = useState([null, null, null]);
  const [transactionClickAnim, settransactionClickAnim] = useState(false);

  const handleSwipe = (MainIndex, index) => {
    setSwipedIndex([MainIndex, index]);
  };

  const handleUnSwipe = () => {
    setSwipedIndex([null, null]);
  };

  const handleTransactionClick = (MainIndex, index, y) => {
    setTransactionClick([MainIndex, index, y]);
    settransactionClickAnim(true);
  };

  const handleTransactionUnClick = () => {
    setTransactionClick([null, null, null]);
  };

  const summaryStiles = [
    {
      width: "40%",
    },
    { width: "35%" },
    { width: "15%" },
    { width: "10%" },
  ];

  const ManuStyle = [
    {
      color: "rgb(255 190 158 / 75%)",
      fontSize: "0.8rem",
      fontWeight: "600",
      backgroundColor: "rgba(255, 190, 158, 0.10)",
    },
    { color: "#fff5efab" },
    { color: "#fff5efab" },
  ];

  const ClickBlurStyle = useSpring({
    from: {
      filter: transactionClickAnim ? "blur(0px)" : "blur(10px)",
      opacity: transactionClickAnim ? "1" : "0.7",
      scale: transactionClickAnim ? 1 : 0.9,
    },
    to: {
      filter: transactionClickAnim ? "blur(10px)" : "blur(0px)",
      opacity: transactionClickAnim ? "0.7" : "1",
      scale: transactionClickAnim ? 0.9 : 1,
    },
  });

  return (
    <div className="TransactionList_Main">
      {transactionClick[0] !== null && (
        <TransactionModification
          transactionClick={transactionClick}
          handleTransactionUnClick={handleTransactionUnClick}
          settransactionClickAnim={settransactionClickAnim}
          transactionClickAnim={transactionClickAnim}
        />
      )}
      <animated.div className="TransactionList_Wall" style={ClickBlurStyle}>
        <div className="TransactionList_TopLine"></div>
        <div className="TransactionList_Title">
          <p>
            <span>My</span> Income <span>Summary</span>
          </p>
          <h1>
            Total: <span>$1000</span>
          </h1>
        </div>
        <div className="TransactionList_SummaryAmount">
          <li style={summaryStiles[0]}>$1000</li>
          <li style={summaryStiles[1]}>$200</li>
          <li style={summaryStiles[2]}>$100</li>
          <li style={summaryStiles[3]}>$250</li>
        </div>
        <div className="TransactionList_SummaryLines">
          <li style={summaryStiles[0]}></li>
          <li style={summaryStiles[1]}></li>
          <li style={summaryStiles[2]}></li>
          <li style={summaryStiles[3]}></li>
        </div>
        <div className="TransactionList_SummaryNames">
          <li style={summaryStiles[0]}>
            <span>•</span>Grocery
          </li>
          <li style={summaryStiles[1]}>
            <span>•</span>Job
          </li>
          <li style={summaryStiles[2]}>
            <span>•</span>Bill
          </li>
          <li style={summaryStiles[3]}>
            <span>•</span>Other
          </li>
        </div>
        <div className="TransactionList_Menu">
          <p>
            Filter Transactions <span></span>
          </p>
          <h1 style={ManuStyle[0]}>All</h1>
          <h1 style={ManuStyle[1]}>Daily</h1>
          <h1 style={ManuStyle[2]}>Monthly</h1>
          <h2>
            <CiSearch />
          </h2>
          <h2>
            <CiCalendarDate />
          </h2>
          <p>
            <span></span>
          </p>
        </div>
        <div
          className="TransactionList_MonthlyMain"
          onScroll={swipedIndex[0] !== null ? handleUnSwipe : null}
          ref={monthlyMainRef}
        >
          {transactions.map((child, index) => (
            <TransactionListMonthly
              key={index}
              MainIndex={index}
              swipedIndex={swipedIndex}
              handleUnSwipe={handleUnSwipe}
              handleSwipe={handleSwipe}
              handleTransactionClick={handleTransactionClick}
            />
          ))}
        </div>
      </animated.div>
    </div>
  );
};

export default TransactionList;
