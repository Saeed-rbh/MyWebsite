import React from "react";
import { useSpring, animated } from "react-spring";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { formatNetTotal } from "./tools";

const MoneyEntryAmount = ({ type, transaction, setIsMoreClicked }) => {
  const amountStyle = {
    background:
      type === "Income"
        ? "linear-gradient(165deg, var(--Fc-4) 30%, var(--Fc-4) 100%)"
        : "linear-gradient(165deg, var(--Gc-4) 30%, var(--Gc-4) 100%)",

    border:
      type === "Income" ? `1px solid var(--Fc-3)` : `2px solid var(--Gc-3)`,

    boxShadow:
      type === "Income"
        ? `5px 5px 10px 0px var(--Fc-4)`
        : `11px 25px 42px -4px var(--Gc-4)`,
  };

  const gradientStyle = {
    background:
      type === "Income"
        ? "linear-gradient(165deg, var(--Ec-1) 30%, var(--Fc-2) 100%)"
        : "linear-gradient(165deg, var(--Ec-1) 30%, var(--Gc-2) 100%)",
  };

  const ColorStyle = {
    color: type === "Income" ? "var(--Fc-2)" : "var(--Gc-2) ",
  };

  const [isScaled, setIsScaled] = React.useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const scaleStyle = useSpring({
    scale: isScaled ? 0.9 : 1,
  });

  // const trendStyle = {
  //   color:
  //     (!!transaction.percentageChange &&
  //       type === "Income" &&
  //       transaction.percentageChange < 0) ||
  //     (!!transaction.percentageChange &&
  //       type === "Spending" &&
  //       transaction.percentageChange > 0)
  //       ? "var(--Gc-1)"
  //       : "var(--Fc-1)",
  //   fontSize: "0.8rem",
  //   fontWeight: "600",
  // };

  return (
    <animated.div
      className="MoneyEntry_Amount"
      style={{ ...amountStyle, ...scaleStyle }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={() => setIsMoreClicked(type)}
    >
      <div className="MoneyEntry_Amount_Gradient" style={gradientStyle}></div>

      <p>
        <span className={`MoneyEntry_Dot`} style={gradientStyle}></span>
        {type}
      </p>

      <div style={ColorStyle} className={`MoneyEntry_type_Open`}>
        {type === "Income" ? <GoArrowDownLeft /> : <GoArrowUpRight />}
      </div>
      <div className="MoneyEntry_Balance">
        <h2>Total Amount:</h2>
        <h1>${formatNetTotal(transaction.netTotal)}</h1>
      </div>
      {/* {!!transaction.percentageChange && (
        <div className="MoneyEntry_percentage" style={trendStyle}>
          <h3>
            {type === "Income"
              ? transaction.percentageChange
              : -1 * transaction.percentageChange}
            %
          </h3>
          {(type === "Income" && transaction.percentageChange < 0) ||
          (type === "Spending" && transaction.percentageChange > 0) ? (
            <FaArrowTrendDown />
          ) : (
            <FaArrowTrendUp />
          )}
        </div>
      )} */}
    </animated.div>
  );
};

export default MoneyEntryAmount;
