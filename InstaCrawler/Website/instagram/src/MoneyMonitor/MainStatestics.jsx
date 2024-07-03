import React, { useMemo, useState } from "react";
import { useSprings, animated, useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

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
        savingDesplay: d.savingPercentage === 0 ? "none" : "flex",
        netDesplay: d.netPercentage === 0 ? "none" : "flex",
        savingHeight: `${d.savingPercentage}%`,
        netBottom: d.netPercentage > 0 ? "calc(50% + 10px)" : "none",
        netTop: d.netPercentage < 0 ? "calc(50% + 10px)" : "none",
        netHeight:
          d.netPercentage > 0 ? `${d.netPercentage}%` : `${-d.netPercentage}%`,
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

  const valueSpringIn = useSpring({
    position: "absolute",
    bottom: processedData[mainPageMonth - 1]
      ? processedData[mainPageMonth - 1].incomePercentage >
        processedData[mainPageMonth - 1].savingPercentage
        ? (height - 225 - 85 + 20 - 50) / 2 +
          ((height - 225 - 85 + 20 - 50) *
            processedData[mainPageMonth - 1].incomePercentage) /
            100 +
          38
        : (height - 225 - 85 + 20 - 50) / 2 +
          ((height - 225 - 85 + 20 - 50) *
            processedData[mainPageMonth - 1].savingPercentage) /
            100 +
          38
      : (height - 225 - 85 + 20 - 50) / 2,
  });

  const valueSpringSp = useSpring({
    position: "absolute",
    bottom: processedData[mainPageMonth - 1]
      ? (height - 225 - 85 + 20 - 50) / 2 -
        ((height - 225 - 85 + 20 - 50) *
          processedData[mainPageMonth - 1].spendingPercentage) /
          100 +
        12
      : (height - 225 - 85 + 20 - 50) / 2,
  });

  const data = processedData[mainPageMonth - 1];
  const springGuid = useSprings(
    4,
    [
      {
        width: data
          ? data.incomePercentage < 10
            ? 10
            : data.incomePercentage
          : 10,
        background: "var(--Fc-1)",
        outline: "3px solid var(--Fc-3)",
      },
      {
        width: data ? (data.netPercentage < 10 ? 10 : data.netPercentage) : 10,
        background: "var(--Bc-1)",
        outline: "3px solid var(--Bc-3)",
      },
      {
        width: data
          ? data.savingPercentage < 10
            ? 10
            : data.savingPercentage
          : 10,
        background: "var(--Ac-1)",
        outline: "3px solid var(--Ac-3)",
      },
      {
        width: data
          ? data.spendingPercentage < 10
            ? 10
            : data.spendingPercentage
          : 10,
        background: "var(--Gc-1)",
        outline: "3px solid var(--Gc-3)",
      },
    ].map((item) => ({
      width: item.width,
      background: item.background,
      outline: item.outline,
    }))
  );

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const [currentX, setCurrentX] = useState(0);

  const bind = useDrag(({ down, movement: [mx], cancel, memo = false }) => {
    const newX = currentX + mx;
    if (newX > 0) return setCurrentX(0) && setMainPageMonth(1);
    if (-1 * newX > 31.5 * springs.length)
      return setCurrentX(-31.5 * springs.length);

    if (!down) {
      setCurrentX(newX);
    }
    api.start({ x: down ? newX : newX });
  });

  return (
    <div
      style={{ height: `${height - 225 - 85 + 20}px` }}
      className="MainStatestics"
      {...bind()}
    >
      <div className="MainStatestics-dash"></div>

      <animated.div style={valueSpringIn} className="MainStatestics-dash">
        <h1>
          +
          {processedData[mainPageMonth - 1]
            ? Number(processedData[mainPageMonth - 1].income.toFixed(0))
            : 0}
          $
        </h1>
      </animated.div>

      <animated.div style={valueSpringSp} className="MainStatestics-dash">
        <h1>
          -
          {processedData[mainPageMonth - 1]
            ? Number(processedData[mainPageMonth - 1].spending.toFixed(0))
            : 0}
          $
        </h1>
      </animated.div>

      <div className="MainStatestics-guid">
        <p>
          Income
          <animated.span
            style={{
              width: springGuid[0].width,
              background: springGuid[0].background,
              outline: springGuid[0].outline,
            }}
          ></animated.span>
        </p>
        <p>
          Balance
          <animated.span
            style={{
              width: springGuid[1].width,
              background: springGuid[1].background,
              outline: springGuid[1].outline,
            }}
          ></animated.span>
        </p>
        <p>
          Saving
          <animated.span
            style={{
              width: springGuid[2].width,
              background: springGuid[2].background,
              outline: springGuid[2].outline,
            }}
          ></animated.span>
        </p>
        <p>
          Spending
          <animated.span
            style={{
              width: springGuid[3].width,
              background: springGuid[3].background,
              outline: springGuid[3].outline,
            }}
          ></animated.span>
        </p>
      </div>

      <animated.ul>
        {springs.map((style, index) => (
          <animated.div
            key={index}
            className="MainStatestics-batch"
            style={{
              // opacity: style.opacity,
              opacity: x.to((x) => {
                const threshold = 50 * (index + 1) - 30;
                const distance = -x - threshold;

                const minOpacity = 0.0;
                const maxOpacity = index + 1 === mainPageMonth ? 0.8 : 0.4;
                const fadeDistance = 5;

                // Sigmoid function for smooth transition
                const sigmoid = (x) => 1 / (1 + Math.exp(-x));
                const transition = sigmoid(distance / fadeDistance);

                const opacity =
                  maxOpacity * (1 - transition) + minOpacity * transition;
                return opacity;
              }),
              transform: x.to((x) => `translate3d(${x}px,0,0)`),
              cursor:
                processedData[index].income +
                  processedData[index].spending +
                  processedData[index].saving +
                  processedData[index].net !==
                0
                  ? "pointer"
                  : "default",
            }}
            onClick={() => {
              processedData[index].income +
                processedData[index].spending +
                processedData[index].saving +
                processedData[index].net !==
                0 && setMainPageMonth(index + 1);
            }}
          >
            <li></li>
            <animated.li
              style={{
                height: style.savingHeight,
                display: style.savingDesplay,
              }}
            ></animated.li>
            <animated.li
              style={{
                height: style.netHeight,
                display: style.netDesplay,
                bottom: style.netBottom,
                top: style.netTop,
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
      </animated.ul>
    </div>
  );
};

export default MainStatestics;
