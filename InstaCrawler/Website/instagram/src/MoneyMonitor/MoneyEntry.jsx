import React, { useEffect, useState, useRef } from "react";
import MoneyEntryAmount from "./MoneyEntryAmount.jsx";
import { useSpring, animated } from "react-spring";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const ScalableElement = ({ children, className, onClick }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const style = useSpring({
    scale: isScaled ? 0.9 : 1,
  });

  return (
    <animated.div
      className={className}
      style={style}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </animated.div>
  );
};

const MoneyEntry = ({
  setTotalExpense,
  setTotalIncome,
  spendingTransactions,
  incomeTransactions,
  setIsMoreClicked,
}) => {
  const incomeentries = Object.entries(incomeTransactions);
  const incomelastEntry = incomeentries[incomeentries.length - 1];
  const incometotalAmount = incomelastEntry[1].totalIncome;

  const spendingentries = Object.entries(spendingTransactions);
  const spendinglastEntry = spendingentries[spendingentries.length - 1];
  const spendingtotalAmount = spendinglastEntry[1].totalSpending;
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalExpense(spendingtotalAmount);
    setTotalIncome(incometotalAmount);
    setTotalBalance(incometotalAmount - spendingtotalAmount);
  }, [spendingtotalAmount, incometotalAmount]);

  const totalStyle = {
    color:
      totalBalance > 0 ? "rgba(131, 255, 201, 0.85)" : "rgb(255 102 102 / 85%)",
  };
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 0.9;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const gradientStyle = {};

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && Transactions.length > 3) {
  //     container.addEventListener("mousedown", handleMouseDown);
  //     container.addEventListener("mouseleave", handleMouseLeave);
  //     container.addEventListener("mouseup", handleMouseUp);
  //     container.addEventListener("mousemove", handleMouseMove);
  //   }
  //   return () => {
  //     if (container) {
  //       container.removeEventListener("mousedown", handleMouseDown);
  //       container.removeEventListener("mouseleave", handleMouseLeave);
  //       container.removeEventListener("mouseup", handleMouseUp);
  //       container.removeEventListener("mousemove", handleMouseMove);
  //     }
  //   };
  // }, [Transactions.length, containerRef.current]);

  return (
    <div className={`MoneyEntry`}>
      <p>
        <h1>
          <span className={`MoneyEntry_Dot`} style={totalStyle}>
            •{" "}
          </span>
          {incomelastEntry[1].month} <h2>Summary</h2>
        </h1>
        <h1 className={`MoneyEntry_total`} style={totalStyle}>
          {" "}
          <span className={`MoneyEntry_totalTitle`}>Balance: </span> $
          {totalBalance.toFixed(2)}
        </h1>
      </p>
      <div className={`MoneyEntry_Data`}>
        <div
          className={`MoneyEntry_AmountBase`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <MoneyEntryAmount
            type={"Income"}
            setIsMoreClicked={setIsMoreClicked}
            transaction={incomelastEntry[1]}
          />
          <MoneyEntryAmount
            type={"Spending"}
            setIsMoreClicked={setIsMoreClicked}
            transaction={spendinglastEntry[1]}
          />
        </div>
      </div>
      <ScalableElement
        className={`MoneyEntry_Savings`}
        onClick={() => setIsMoreClicked("Saving")}
      >
        <div className="MoneyEntry_Amount_Gradients"></div>
        <h1>
          <span className={`MoneyEntry_Dot`}></span>
          Saving
        </h1>
        <div
          className="MoneyEntry_percentage"
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            bottom: "0",
            marginTop: "0",
          }}
        >
          <h3>50%</h3>
          <FaArrowTrendDown />
        </div>
        <div
          className="MoneyEntry_Balance"
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            bottom: "0",
            marginTop: "0",
            right: "0",
          }}
        >
          <h2 style={{ marginRight: "5px" }}>Total:</h2>
          <h1>$1500.2</h1>
        </div>
      </ScalableElement>
    </div>
  );
};

export default MoneyEntry;
