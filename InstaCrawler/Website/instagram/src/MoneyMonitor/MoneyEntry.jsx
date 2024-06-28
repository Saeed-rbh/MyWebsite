import React, { useState, useCallback } from "react";
import MoneyEntryAmount from "./MoneyEntryAmount.jsx";
import { useSpring, animated } from "react-spring";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { formatNetTotal } from "./tools";

const ScalableElement = ({ children, className, onClick }) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = useCallback(() => setIsScaled(true), []);
  const handleMouseUp = useCallback(() => setIsScaled(false), []);

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
  spendingTransactions,
  incomeTransactions,
  savingTransactions,
  setIsMoreClicked,
  mainNetAmounts,
}) => {
  const savingtotalAmount = savingTransactions.totalSaving;
  const savingPercentage = savingTransactions.percentageChange
    ? savingTransactions.percentageChange
    : 0;

  const totalStyle = {
    color:
      mainNetAmounts.net > 0
        ? "rgba(131, 255, 201, 0.85)"
        : "rgb(255 102 102 / 85%)",
  };

  const colorStyle = {
    color: savingPercentage > 0 ? "var(--Fc-2)" : "var(--Gc-2)",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    bottom: "0",
    marginTop: "0",
  };

  return (
    <div className="MoneyEntry">
      <div className="MoneyEntry_Title">
        <h1>
          <span className="MoneyEntry_Dot" style={totalStyle}>
            •{" "}
          </span>
          <span>{incomeTransactions.month}</span> Summary
        </h1>
        <h1 className="MoneyEntry_total" style={totalStyle}>
          <span className="MoneyEntry_totalTitle">Balance: </span> $
          {mainNetAmounts.net}
        </h1>
      </div>
      <div className="MoneyEntry_Data">
        <div className="MoneyEntry_AmountBase">
          <MoneyEntryAmount
            type="Income"
            setIsMoreClicked={setIsMoreClicked}
            transaction={incomeTransactions}
          />
          <MoneyEntryAmount
            type="Spending"
            setIsMoreClicked={setIsMoreClicked}
            transaction={spendingTransactions}
          />
        </div>
      </div>
      <ScalableElement
        className="MoneyEntry_Savings"
        onClick={() => setIsMoreClicked("Saving")}
      >
        <div className="MoneyEntry_Amount_Gradients"></div>
        <h1>
          <span
            className="MoneyEntry_Dot"
            style={{
              background:
                "linear-gradient(165deg, var(--Ec-1) 30%, var(--Ac-2) 100%)",
              height: "2px",
            }}
          ></span>
          <span style={{ width: "max-content", marginLeft: "0" }}>
            Save & Invest
          </span>
        </h1>
        {!!savingPercentage && (
          <div className="MoneyEntry_percentage" style={colorStyle}>
            <h3>{savingPercentage}%</h3>
            {savingPercentage < 0 ? <FaArrowTrendDown /> : <FaArrowTrendUp />}
          </div>
        )}
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
          <h1>${formatNetTotal(savingtotalAmount)}</h1>
        </div>
      </ScalableElement>
    </div>
  );
};

export default MoneyEntry;
