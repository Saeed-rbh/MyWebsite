import React from "react";
import { useSpring, animated } from "react-spring";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { formatNetTotal } from "./tools";

const MoneyEntryAmount = ({ type, transaction, setIsMoreClicked }) => {
  const amountStyle = {
    background:
      type === "Income"
        ? "linear-gradient(165deg, var(--Fc-4) 30%, var(--Fc-4) 100%)"
        : type === "Spending"
        ? "linear-gradient(165deg, var(--Gc-4) 30%, var(--Gc-4) 100%)"
        : type === "Save & Invest"
        ? "linear-gradient(165deg, var(--Ac-4) 30%, var(--Ac-4) 100%)"
        : "linear-gradient(165deg, var(--Bc-4) 30%, var(--Gc-4) 100%)",

    border:
      type === "Income"
        ? `1px solid var(--Fc-3)`
        : type === "Spending"
        ? `1px solid var(--Gc-3)`
        : type === "Save & Invest"
        ? `1px solid var(--Ac-3)`
        : `1px solid var(--Bc-3)`,

    // boxShadow:
    //   type === "Income"
    //     ? `5px 5px 10px 0px var(--Fc-4)`
    //     : `11px 25px 42px -4px var(--Gc-4)`,
  };

  const gradientStyle = {
    background:
      type === "Income"
        ? "linear-gradient(165deg, var(--Ec-1) 30%, var(--Fc-2) 100%)"
        : type === "Spending"
        ? "linear-gradient(165deg, var(--Ec-1) 30%, var(--Gc-2) 100%)"
        : type === "Save & Invest"
        ? "linear-gradient(165deg, var(--Ec-1) 30%, var(--Ac-2) 100%)"
        : "linear-gradient(165deg, var(--Ec-1) 30%, var(--Bc-2) 100%)",
  };

  const ColorStyle = {
    color:
      type === "Income"
        ? "var(--Fc-2)"
        : type === "Spending"
        ? "var(--Gc-2)"
        : type === "Save & Invest"
        ? "var(--Ac-2)"
        : "var(--Bc-2)",
  };

  const [isScaled, setIsScaled] = React.useState(false);

  const handleMouseDown = () => {
    setIsScaled(true);
  };

  const handleMouseUp = () => {
    setIsScaled(false);
  };

  const widthFactor =
    type === "Save & Invest" ? 1.12 : type === "Balance" ? 0.88 : 1;
  const heightFactor =
    type === "Save & Invest" || type === "Balance" ? 0.95 : 0.95;
  const scaleStyle = useSpring({
    scale: isScaled ? 0.9 : 1,
    width: ((390 - 10) / 2) * widthFactor,
    height: ((390 - 20) / 2 / 1.6) * heightFactor,
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
      <div
        className="MoneyEntry_Balance"
        style={{
          flexDirection:
            type === "Save & Invest" || type === "Balance" ? "row" : "column",
          alignItems:
            type === "Save & Invest" || type === "Balance"
              ? "baseline"
              : "flex-start",
          height:
            type === "Save & Invest" || type === "Balance" ? "30px" : "50px",
        }}
      >
        <h2
          style={{
            marginRight:
              type === "Save & Invest" || type === "Balance" ? "5px" : "0",
          }}
        >
          {type === "Save & Invest" || type === "Balance"
            ? "Total"
            : "Total Amount"}
          :
        </h2>
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
