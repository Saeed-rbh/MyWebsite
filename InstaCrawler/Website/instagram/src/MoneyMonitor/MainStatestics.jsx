import React, { useEffect, useMemo, useState } from "react";
import { useSprings, animated, useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { ScalableElement } from "./tools";

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
    () => netSeries.map(([Date, value]) => value),
    [netSeries]
  );

  const MonthsData = useMemo(
    () => netSeries.map(([Date, value]) => Date.split("-")[0]),
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
      last6MonthsData.map((d, index) => ({
        ...d,
        incomePercentage: calculatePercentage(d.income, maxValues),
        netPercentage: calculatePercentage(d.net, maxValues),
        savingPercentage: calculatePercentage(d.saving, maxValues),
        spendingPercentage: calculatePercentage(d.spending, maxValues),
        year: MonthsData[index],
      })),
    [last6MonthsData, maxValues, MonthsData]
  );

  useEffect(() => {
    processedData.length > 0 &&
      processedData[mainPageMonth].income +
        processedData[mainPageMonth].spending +
        processedData[mainPageMonth].saving +
        processedData[mainPageMonth].net ===
        0 &&
      setMainPageMonth(mainPageMonth + 1);
  }, [processedData]);

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
    y: processedData[mainPageMonth]
      ? processedData[mainPageMonth].incomePercentage >
        processedData[mainPageMonth].savingPercentage
        ? -1 *
            (height - 225 - 85 + 20 + 10 - 50) *
            0.01 *
            processedData[mainPageMonth].incomePercentage -
          25
        : -1 *
            (height - 225 - 85 + 20 + 10 - 50) *
            0.01 *
            processedData[mainPageMonth].savingPercentage -
          25
      : 0,
  });

  // console.log(0.01 * processedData[mainPageMonth].spendingPercentage);
  const valueSpringSp = useSpring({
    position: "absolute",
    y: processedData[mainPageMonth]
      ? (height - 225 - 85 + 20 + 10 - 50) *
          0.01 *
          1.1 *
          processedData[mainPageMonth].spendingPercentage +
        15
      : 0,
  });

  const data = processedData[mainPageMonth];
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

  console.log(processedData[0]);

  return (
    <div
      style={{ height: `${height - 225 - 85 + 20 + 10 + 10}px` }}
      className="MainStatestics"
      {...bind()}
    >
      <h3>
        <span className="MoneyEntry_Dot" style={{ color: "var(--Bc-1)" }}>
          •
        </span>
        <span>Insight</span> Dashboard
      </h3>
      {/* <ScalableElement as="div" className="MainStatestics-arrowN">
        <animated.div
          style={{ opacity: 0.4 }}
          className="CirleColor"
        ></animated.div>
        <MdKeyboardArrowRight />
      </ScalableElement>
      <ScalableElement as="div" className="MainStatestics-arrowL">
        <animated.div
          style={{ opacity: 0.4 }}
          className="CirleColor"
        ></animated.div>
        <MdKeyboardArrowLeft />
      </ScalableElement> */}
      {/* <ScalableElement as="div" className="MainStatestics-arrowC">
        {" "}
        <animated.div
          style={{ opacity: 0.4 }}
          className="CirleColor"
        ></animated.div>
        Current Month
      </ScalableElement> */}

      <div className="MainStatestics-Graph">
        <div
          className="MainStatestics-dash"
          style={{ marginLeft: "20px", width: "calc(100% - 100px)" }}
        ></div>
        <animated.div style={valueSpringIn} className="MainStatestics-dash">
          <h1>
            +
            {processedData[mainPageMonth]
              ? Number(processedData[mainPageMonth].income.toFixed(0))
              : 0}
            $
          </h1>
        </animated.div>

        <animated.div style={valueSpringSp} className="MainStatestics-dash">
          <h1>
            -
            {processedData[mainPageMonth]
              ? Number(processedData[mainPageMonth].spending.toFixed(0))
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
                opacity: x.to((x) => {
                  const threshold = 50 * (index + 1) - 30;
                  const distance = -x - threshold;

                  const minOpacity = 0.0;
                  const maxOpacity = index === mainPageMonth ? 0.8 : 0.4;
                  const fadeDistance = 5;

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
                  0 && setMainPageMonth(index);
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
              <li>
                {processedData[index].month}{" "}
                <span>{processedData[index].year}</span>
              </li>
            </animated.div>
          ))}
        </animated.ul>
      </div>
    </div>
  );
};

export default MainStatestics;
