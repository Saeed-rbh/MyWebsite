import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";

function ChooseTransactionMonth({
  isClicked,
  setIsClicked,
  dataAvailability,
  setWhichMonth,
  whichMonth,
}) {
  const clickAction = useSpring({});

  const clickAction2 = useSpring({});

  const handleMonthClick = (month) => {
    setWhichMonth(month);
    setIsClicked(false);
  };

  return (
    <animated.div className="TransactionList_MonthlyFooter" style={clickAction}>
      <div className="TransactionList_MonthlyNames">
        <h3>
          What <span>Date</span> are you Lookomg for ?
        </h3>
        {Object.entries(dataAvailability).map(([year, monthsData]) => (
          <div key={year} className="TransactionList_MonthlyYear">
            <animated.h1>
              {monthsData[0]}
              <span></span>
            </animated.h1>

            {Object.entries(monthsData[1])
              .reverse()
              .map(([month, value], index) => (
                <animated.p
                  style={{
                    ...clickAction2,
                    background:
                      whichMonth === value[1] ? "var(--Bc-4)" : "var(--Ec-3)",
                  }}
                  onClick={() => handleMonthClick(value[1])}
                  key={index}
                >
                  <span>{month}</span>
                  <span
                    style={{
                      background:
                        whichMonth === value[1]
                          ? "var(--Bc-1)"
                          : value[0]
                          ? "var(--Fc-1)"
                          : "var(--Gc-1)",
                    }}
                  ></span>
                </animated.p>
              ))}
          </div>
        ))}
        {/* {Object.entries(dataAvailability).map((data, index) => (
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
        ))}*/}
      </div>
    </animated.div>
  );
}

export default ChooseTransactionMonth;
