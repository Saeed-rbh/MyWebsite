import { delay } from "lodash";
import React, { useMemo } from "react";
import { useSprings, animated, useSpring } from "react-spring";

// Constants
const PERCENTAGE_FACTOR = 40;
const MIN_PERCENTAGE = 10;
const FALLBACK_COLOR = "var(--Ac-2)";

// Utility function to calculate percentage
const calculatePercentage = (value, max) => (value / max) * PERCENTAGE_FACTOR;

const MainStatestics = ({
  height,
  netAmounts,
  mainPageMonth,
  setMainPageMonth,
}) => {
  const netSeries = useMemo(
    () => Object.entries(netAmounts).reverse(),
    [netAmounts]
  );

  const last6MonthsData = useMemo(
    () => netSeries.map(([, value]) => value),
    [netSeries]
  );

  const maxValues = useMemo(() => {
    const allValues = last6MonthsData.reduce(
      (acc, d) => ({
        maxIncome: Math.max(acc.maxIncome, d.income),
        maxNet: Math.max(acc.maxNet, d.net),
        maxSaving: Math.max(acc.maxSaving, d.saving),
        maxSpending: Math.max(acc.maxSpending, d.spending),
      }),
      { maxIncome: 0, maxNet: 0, maxSaving: 0, maxSpending: 0 }
    );
    return Math.max(
      allValues.maxIncome,
      allValues.maxNet,
      allValues.maxSaving,
      allValues.maxSpending
    );
  }, [last6MonthsData]);

  console.log(maxValues);

  const processedData = useMemo(
    () =>
      last6MonthsData.map((d) => ({
        ...d,
        incomePercentage: calculatePercentage(d.income, maxValues),
        netPercentage: calculatePercentage(d.net, maxValues),
        savingPercentage: calculatePercentage(d.saving, maxValues),
        spendingPercentage: calculatePercentage(d.spending, maxValues),
      })),
    [last6MonthsData, maxValues]
  );

  const springs = useSprings(
    processedData.length,
    processedData.map((d, index) => ({
      from: {
        savingHeight: "0%",
        netHeight: "0%",
        spendingHeight: "0%",
        incomeHeight: "0%",
      },
      to: {
        savingHeight: `${d.savingPercentage}%`,
        netHeight: `${d.netPercentage}%`,
        spendingHeight: `${
          d.spendingPercentage === 0 ? MIN_PERCENTAGE : d.spendingPercentage
        }%`,
        spendingBg: d.spendingPercentage === 0 ? FALLBACK_COLOR : null,
        incomeHeight: `${
          d.incomePercentage === 0 ? MIN_PERCENTAGE : d.incomePercentage
        }%`,
        incomeBg: d.incomePercentage === 0 ? FALLBACK_COLOR : null,
        opacity: index + 1 === mainPageMonth ? 0.8 : 0.4,
      },
      delay: index * 50,
    }))
  );

  console.log(
    processedData[mainPageMonth - 1]
      ? Number(processedData[mainPageMonth - 1].income.toFixed(0))
      : 0
  );

  const valueSpringIn = useSpring({
    position: "absolute",
    bottom: processedData[mainPageMonth - 1]
      ? (height - 225 - 85) / 2 +
        ((height - 225 - 85) *
          processedData[mainPageMonth - 1].incomePercentage) /
          100 +
        10
      : (height - 225 - 85) / 2,
  });

  const valueSpringSp = useSpring({
    position: "absolute",
    bottom: processedData[mainPageMonth - 1]
      ? (height - 225 - 85) / 2 -
        ((height - 225 - 85) *
          processedData[mainPageMonth - 1].spendingPercentage) /
          100 -
        10
      : (height - 225 - 85) / 2,
  });

  return (
    <div
      style={{ height: `${height - 225 - 85}px` }}
      className="MainStatestics"
    >
      <div className="MainStatestics-dash"></div>

      <animated.div style={valueSpringIn} className="MainStatestics-dash">
        <h1>
          +
          {processedData[mainPageMonth - 1]
            ? Number(processedData[mainPageMonth - 1].income.toFixed(1))
            : 0}
          $
        </h1>
      </animated.div>

      <animated.div style={valueSpringSp} className="MainStatestics-dash">
        <h1>
          -
          {processedData[mainPageMonth - 1]
            ? Number(processedData[mainPageMonth - 1].spending.toFixed(1))
            : 0}
          $
        </h1>
      </animated.div>

      <div className="MainStatestics-guid">
        <p>
          <span style={{ color: `var(--Fc-1)` }}>•</span> Income
        </p>
        <p>
          <span style={{ color: `var(--Bc-1)` }}>•</span> Balance
        </p>
        <p>
          <span style={{ color: `var(--Ac-1)` }}>•</span> Saving
        </p>
        <p>
          <span style={{ color: `var(--Gc-1)` }}>•</span> Spending
        </p>
      </div>

      <ul>
        {springs.map((style, index) => (
          <animated.div
            key={index}
            className="MainStatestics-batch"
            style={{ opacity: style.opacity }}
            onClick={() => setMainPageMonth(index + 1)}
          >
            <li></li>
            <animated.li
              style={{
                height: style.savingHeight,
              }}
            ></animated.li>
            <animated.li
              style={{
                height: style.netHeight,
              }}
            ></animated.li>
            <animated.li
              style={{
                height: style.spendingHeight,
                background: style.spendingBg,
              }}
            ></animated.li>
            <animated.li
              style={{
                height: style.incomeHeight,
                background: style.incomeBg,
              }}
            ></animated.li>
            <li>{processedData[index].month}</li>
          </animated.div>
        ))}
      </ul>
    </div>
  );
};

export default MainStatestics;
