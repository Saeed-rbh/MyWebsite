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
  savingTransactions,
  setIsMoreClicked,
}) => {
  const [totalBalance, setTotalBalance] = useState(0);

  const incometotalAmount = incomeTransactions.totalIncome;
  const spendingtotalAmount = spendingTransactions.totalSpending;
  const savingtotalAmount = savingTransactions.totalSaving;
  const SavingPercentage = savingTransactions.percentageChange;

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

  const ColorStyle = {
    color: SavingPercentage > 0 ? "var(--Fc-2)" : "var(--Gc-2) ",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    bottom: "0",
    marginTop: "0",
  };

  return (
    <div className={`MoneyEntry`}>
      <p>
        <h1>
          <span className={`MoneyEntry_Dot`} style={totalStyle}>
            •{" "}
          </span>
          {incomeTransactions.month} <h2>Summary</h2>
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
            transaction={incomeTransactions}
          />
          <MoneyEntryAmount
            type={"Spending"}
            setIsMoreClicked={setIsMoreClicked}
            transaction={spendingTransactions}
          />
        </div>
      </div>
      <ScalableElement
        className={`MoneyEntry_Savings`}
        onClick={() => setIsMoreClicked("Saving")}
      >
        <div className="MoneyEntry_Amount_Gradients"></div>
        <h1>
          <span
            className={`MoneyEntry_Dot`}
            style={{
              background:
                "linear-gradient(165deg, var(--Ec-1) 30%, var(--Ac-2) 100%)",
              height: "2px",
            }}
          ></span>
          <h2 style={{ width: "max-content", marginLeft: "0" }}>
            Save & Invest
          </h2>
        </h1>
        <div className="MoneyEntry_percentage" style={ColorStyle}>
          <h3>{SavingPercentage}%</h3>
          {SavingPercentage < 0 ? <FaArrowTrendDown /> : <FaArrowTrendUp />}
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
          <h1>${savingtotalAmount}</h1>
        </div>
      </ScalableElement>
    </div>
  );
};

export default MoneyEntry;
