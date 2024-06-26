import React from "react";
import { useSpring, animated } from "@react-spring/web";

function ChooseTransactionMonth({
  isClicked,
  setIsClicked,
  dataAvailability,
  setWhichMonth,
  whichMonth,
}) {
  const clickAction = useSpring({
    height: isClicked ? 75 : 0,
    paddingTop: isClicked ? 15 : 0,
  });

  const clickAction2 = useSpring({
    opacity: isClicked ? 1 : 0,
    y: isClicked ? 0 : -70,
  });

  const handleMonthClick = (month) => {
    setWhichMonth(month);
    setIsClicked(false);
  };

  return (
    <animated.div className="TransactionList_MonthlyFooter" style={clickAction}>
      <animated.h1 style={clickAction2}>
        Select <span>Month</span>:
      </animated.h1>

      {dataAvailability.map((data, index) => (
        <animated.p
          style={{
            ...clickAction2,
            background:
              whichMonth === data[1][1] ? "var(--Bc-4)" : "var(--Ac-4)",
          }}
          onClick={() => handleMonthClick(data[1][1])}
          key={index}
        >
          <span>{data[0].split("-")[0].slice(2, 4)} </span>
          <h2></h2>
          <span>{data[0].split("-")[1]}</span>
          <span
            style={{
              background:
                whichMonth === data[1][1]
                  ? "var(--Bc-1)"
                  : data[1][0]
                  ? "var(--Fc-1)"
                  : "var(--Gc-1)",
            }}
          ></span>
        </animated.p>
      ))}
    </animated.div>
  );
}

export default ChooseTransactionMonth;
