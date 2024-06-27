import React, { useEffect, useRef, useState } from "react";
import TransactionListMonthly from "./TransactionListMonthly";
import TransactionModification from "./TransactionModification";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import TransactionFilter from "./transactionFilter";
import { useCustomSpring } from "./tools";
import ChooseTransactionMonth from "./ChooseTransactionMonth";
import MoreOpen from "./MoreOpen";

const TransactionList = ({
  isMoreClicked,
  setIsMoreClicked,
  Transactions,
  dataAvailability,
  setWhichMonth,
  whichMonth,
}) => {
  const [sortby, setSortby] = useState("All");
  const [isCalendarClicked, setIsCalendarClicked] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");
  const [labelDistribution, setLabelDistribution] = useState([]);

  useEffect(() => {
    if (Transactions.length !== 0) {
      setTotalAmount(Transactions.netTotal);
      setCurrentMonth(Transactions.month);
      const distribution = Transactions.labelDistribution;
      const sortedData = Object.entries(distribution)
        .map(([category, percentage]) => ({
          category,
          percentage: parseFloat(percentage),
        }))
        .sort((a, b) => b.percentage - a.percentage);
      setLabelDistribution(sortedData);
    }
  }, [Transactions, whichMonth]);

  const monthlyMainRef = useRef(null);

  const [swipedIndex, setSwipedIndex] = useState([null, null]);
  const [transactionClick, setTransactionClick] = useState([null, null, null]);
  const [transactionClickAnim, settransactionClickAnim] = useState(false);

  const handleSwipe = (MainIndex, index) => {
    setSwipedIndex([MainIndex, index]);
  };

  const handleUnSwipe = () => {
    setSwipedIndex([null, null]);
  };

  const handleTransactionClick = (MainIndex, index, y) => {
    setTransactionClick([MainIndex, index, y]);
    settransactionClickAnim(true);
  };

  const handleTransactionUnClick = () => {
    setTransactionClick([null, null, null]);
  };

  const SummaryWidth = [
    labelDistribution.length > 0 &&
    !!labelDistribution[0] &&
    labelDistribution[0].percentage > 15
      ? labelDistribution[0].percentage
      : 0,
    labelDistribution.length > 0 &&
    !!labelDistribution[1] &&
    labelDistribution[1].percentage > 15
      ? labelDistribution[1].percentage
      : 0,
    labelDistribution.length > 0 &&
    !!labelDistribution[2] &&
    labelDistribution[2].percentage > 15
      ? labelDistribution[2].percentage
      : 0,
    labelDistribution.length > 2 &&
    !!labelDistribution[0] &&
    !!labelDistribution[1] &&
    !!labelDistribution[2]
      ? 100 -
        (labelDistribution[0]?.percentage > 15
          ? labelDistribution[0].percentage
          : 0) -
        (labelDistribution[1]?.percentage > 15
          ? labelDistribution[1].percentage
          : 0) -
        (labelDistribution[2]?.percentage > 15
          ? labelDistribution[2].percentage
          : 0)
      : 0,
  ];

  const summaryStiles = [
    useSpring({
      width: SummaryWidth[0] + "%",
      color: "var(--Cc-2)",
    }),
    useSpring({
      width: SummaryWidth[1] + "%",
      color: "var(--Dc-2)",
    }),
    useSpring({
      width: SummaryWidth[2] + "%",
      color: "var(--Bc-2)",
    }),
    useSpring({
      width: SummaryWidth[3] + "%",
      color: "var(--Ac-1)",
    }),
  ];

  const [isAnimationEnds, setIsAnimationEnds] = useState(false);
  useEffect(() => {
    isMoreClicked && setIsAnimationEnds(true);
  }, [isMoreClicked]);

  const [Open_TransactionList, api] = useSpring(() => ({
    scale: isCalendarClicked ? 0.9 : 1,
    opacity: 0,
    height: "calc(0vh - 100px)",
  }));

  const isOpenRef = React.useRef(isMoreClicked);

  React.useEffect(() => {
    isOpenRef.current = isMoreClicked;
  }, [isMoreClicked]);

  const handleOnRest = () => {
    !isOpenRef.current && setIsAnimationEnds(false);
    !isOpenRef.current && setIsCalendarClicked(false);
  };

  useEffect(() => {
    isAnimationEnds &&
      api.start({
        scale: isCalendarClicked ? 0.9 : !!isMoreClicked ? 1 : 0.9,
        opacity: !isMoreClicked ? 0 : 1,
        height: !!isMoreClicked ? "calc(100vh - 100px)" : "calc(0vh - 100px)",
        filter: isCalendarClicked ? "blur(10px)" : "blur(0px)",
        onRest: () => {
          handleOnRest();
        },
      });
  }, [
    isMoreClicked,
    isAnimationEnds,
    api,
    setIsCalendarClicked,
    isCalendarClicked,
  ]);

  const bind = useDrag(
    ({
      movement: [, y],
      memo = false,
      last,
      velocity,
      event,
      initial: [, initialY],
    }) => {
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      if (!isMoreClicked) return memo;
      if (clientY - y > 250 || y < 0) return memo;

      const newHeight = Math.max(y + 100, 100);
      const isQuickDragDown = velocity[1] > 0.01 && y > initialY;
      const isQuickDragUp = velocity[1] > 0.1 && y < initialY;

      if (y > 0) {
        if (last) {
          if (isQuickDragUp) {
            api.start({
              height: `calc(100vh - 80px)`,
              config: config.slow,
            });
          } else if (isQuickDragDown) {
            api.start({
              height: "calc(10vh  - 80px)",
              config: config.slow,
            });
            setIsMoreClicked(null);
          } else if (
            window.innerHeight - newHeight <
            window.innerHeight / 2.2
          ) {
            api.start({
              height: "calc(10vh  - 80px)",
            });
            setIsMoreClicked(null);
          } else {
            api.start({
              height: `calc(100vh - 80px)`,
            });
          }
        } else {
          api.start({
            height: `calc(100vh - ${newHeight}px)`,
          });
        }
      }
      return memo;
    }
  );

  const colorStyle = {
    color: isMoreClicked === "Income" ? "var(--Fc-1)" : "var(--Gc-1)",
  };

  const [isScrollingDown, setIsScrollingDown] = useState(null);

  const springProps1 = useCustomSpring(
    isMoreClicked,
    1,
    isScrollingDown,
    false
  );
  const springProps2 = useCustomSpring(isMoreClicked, 2, isScrollingDown, true);
  const springProps4 = useSpring({
    y: isScrollingDown ? -160 : 0,
  });
  const ClickBlurStyle = useSpring({
    from: {
      filter: transactionClickAnim ? "blur(0px)" : "blur(10px)",
      opacity: transactionClickAnim ? "1" : "0.7",
      scale: transactionClickAnim ? 1 : 0.9,
      height: "calc(100vh - 50px))",
    },
    to: {
      filter: transactionClickAnim ? "blur(10px)" : "blur(0px)",
      opacity: transactionClickAnim ? "0.7" : "1",
      scale: transactionClickAnim ? 0.9 : 1,
      height: "calc(100vh - 50px))",
    },
  });

  useEffect(() => {
    if (monthlyMainRef.current) {
      monthlyMainRef.current.scrollTop = 0;
    }
  }, [whichMonth]);

  const calendarFeed = () => {
    return (
      <ChooseTransactionMonth
        dataAvailability={dataAvailability}
        setWhichMonth={setWhichMonth}
        whichMonth={whichMonth}
        isClicked={isCalendarClicked}
        setIsClicked={setIsCalendarClicked}
      />
    );
  };

  return (
    <>
      <MoreOpen
        isClicked={isCalendarClicked}
        setIsClicked={setIsCalendarClicked}
        feed={calendarFeed}
      />
      {isAnimationEnds && (
        <animated.div
          className="TransactionList_Main"
          style={Open_TransactionList}
          {...bind()}
        >
          {transactionClick[0] !== null && (
            <TransactionModification
              transactionClick={transactionClick}
              handleTransactionUnClick={handleTransactionUnClick}
              settransactionClickAnim={settransactionClickAnim}
              transactionClickAnim={transactionClickAnim}
            />
          )}
          <animated.div className="TransactionList_Wall" style={ClickBlurStyle}>
            <div className="TransactionList_TopLine"></div>
            <animated.div
              className="TransactionList_Title"
              style={springProps1}
            >
              <p onClick={() => setIsMoreClicked(null)}>
                {currentMonth} <span>{isMoreClicked}</span>
              </p>
              <h1>
                <span></span> Balance:{" "}
                <span style={colorStyle}>
                  ${Math.abs(totalAmount).toFixed(2)}
                </span>
              </h1>
            </animated.div>
            <animated.div
              className="TransactionList_SummaryAmount"
              style={springProps2}
            >
              {SummaryWidth[0] > 0 && (
                <animated.li style={summaryStiles[0]}>
                  $
                  {labelDistribution.length > 0
                    ? ((SummaryWidth[0] * totalAmount) / 100).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {SummaryWidth[1] > 0 && (
                <animated.li style={summaryStiles[1]}>
                  $
                  {labelDistribution.length > 0
                    ? ((SummaryWidth[1] * totalAmount) / 100).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {SummaryWidth[2] > 0 && (
                <animated.li style={summaryStiles[2]}>
                  $
                  {labelDistribution.length > 0
                    ? ((SummaryWidth[2] * totalAmount) / 100).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {SummaryWidth[3] > 0 && (
                <animated.li style={summaryStiles[3]}>
                  $
                  {labelDistribution.length > 0
                    ? ((SummaryWidth[3] * totalAmount) / 100).toFixed(0)
                    : 0}
                </animated.li>
              )}
            </animated.div>
            <animated.div
              className="TransactionList_SummaryLines"
              style={springProps2}
            >
              <animated.li style={summaryStiles[0]}></animated.li>
              <animated.li style={summaryStiles[1]}></animated.li>
              <animated.li style={summaryStiles[2]}></animated.li>
              <animated.li style={summaryStiles[3]}></animated.li>
            </animated.div>
            <animated.div
              className="TransactionList_SummaryNames"
              style={springProps2}
            >
              {SummaryWidth[0] > 0 && (
                <animated.li>
                  <animated.span
                    style={{ ...summaryStiles[0], width: "fit-content" }}
                  >
                    •
                  </animated.span>
                  {labelDistribution.length > 0
                    ? labelDistribution[0].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              {SummaryWidth[1] > 0 && (
                <animated.li>
                  <animated.span
                    style={{ ...summaryStiles[1], width: "fit-content" }}
                  >
                    •
                  </animated.span>
                  {labelDistribution.length > 0
                    ? labelDistribution[1].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              {SummaryWidth[2] > 0 && (
                <animated.li>
                  <animated.span
                    style={{ ...summaryStiles[2], width: "fit-content" }}
                  >
                    •
                  </animated.span>
                  {labelDistribution.length > 0
                    ? labelDistribution[2].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              {SummaryWidth[3] > 0 && (
                <animated.li>
                  <animated.span
                    style={{ ...summaryStiles[3], width: "fit-content" }}
                  >
                    •
                  </animated.span>
                  Other
                </animated.li>
              )}
            </animated.div>
            <TransactionFilter
              sortby={sortby}
              setSortby={setSortby}
              isMoreClicked={isMoreClicked}
              isScrollingDown={isScrollingDown}
              setIsCalendarClicked={setIsCalendarClicked}
              isCalendarClicked={isCalendarClicked}
            />

            <animated.div
              className="TransactionList_MonthlyMain"
              // onScroll={(event) =>
              //   handleScroll(event) && swipedIndex[0] !== null
              //     ? handleUnSwipe
              //     : null
              // }
              ref={monthlyMainRef}
              style={springProps4}
            >
              {Transactions.length !== 0 && (
                <TransactionListMonthly
                  swipedIndex={swipedIndex}
                  handleUnSwipe={handleUnSwipe}
                  handleSwipe={handleSwipe}
                  handleTransactionClick={handleTransactionClick}
                  useCustomSpring={useCustomSpring}
                  isMoreClicked={isMoreClicked}
                  transactions={Transactions.transactions}
                  netTotal={Transactions.netTotal}
                  percentageChange={Transactions.percentageChange}
                  month={Transactions.month}
                  year={Transactions.year}
                  sortby={sortby}
                  dataAvailability={dataAvailability}
                  setWhichMonth={setWhichMonth}
                  whichMonth={whichMonth}
                />
              )}
            </animated.div>
          </animated.div>
        </animated.div>
      )}
    </>
  );
};

export default TransactionList;
