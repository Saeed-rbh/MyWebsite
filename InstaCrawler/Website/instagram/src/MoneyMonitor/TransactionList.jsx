import React, { useEffect, useRef, useState } from "react";
import { CiSearch, CiCalendarDate } from "react-icons/ci";
import TransactionListMonthly from "./TransactionListMonthly";
import TransactionModification from "./TransactionModification";
import { useSprings, useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const useCustomSpring = (isMoreClicked, delay, isScrollingDown, scrollAble) => {
  return useSpring({
    opacity: !!isMoreClicked ? (isScrollingDown && scrollAble ? 0 : 1) : 0,
    y: !!isMoreClicked ? (isScrollingDown && scrollAble ? -50 : 0) : 50,
    delay: !!isMoreClicked
      ? isScrollingDown !== null
        ? 0
        : 100 + 50 * delay
      : 0,
  });
};

const TransactionList = ({
  isMoreClicked,
  setIsMoreClicked,
  Transactions,
  dataAvailability,
  setWhichMonth,
  whichMonth,
}) => {
  const [sortby, setSortby] = useState("All");
  const sortItems = ["All", "Daily", "Monthly"];
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

  console.log(labelDistribution);

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

  const summaryStiles = [
    useSpring({
      width:
        labelDistribution.length > 0 && !!labelDistribution[0]
          ? labelDistribution[0].percentage + "%"
          : "0%",
    }),
    useSpring({
      width:
        labelDistribution.length > 0 && !!labelDistribution[1]
          ? labelDistribution[1].percentage + "%"
          : "0%",
    }),
    useSpring({
      width:
        labelDistribution.length > 0 && !!labelDistribution[2]
          ? labelDistribution[2].percentage + "%"
          : "0%",
    }),
    useSpring({
      width:
        labelDistribution.length > 2 &&
        !!labelDistribution[0] &&
        !!labelDistribution[1] &&
        !!labelDistribution[2]
          ? 100 -
            (labelDistribution[0]?.percentage || 0) -
            (labelDistribution[1]?.percentage || 0) -
            (labelDistribution[2]?.percentage || 0) +
            "%"
          : "0%",
    }),
  ];

  const [isAnimationEnds, setIsAnimationEnds] = useState(false);
  useEffect(() => {
    isMoreClicked && setIsAnimationEnds(true);
  }, [isMoreClicked]);

  const [Open_TransactionList, api] = useSpring(() => ({
    scale: 0.9,
    opacity: 0,
    height: "calc(0vh - 65px)",
  }));

  useEffect(() => {
    isAnimationEnds &&
      api.start({
        scale: !!isMoreClicked ? 1 : 0.9,
        opacity: !isMoreClicked ? 0 : 1,
        height: !!isMoreClicked ? "calc(100vh - 65px)" : "calc(0vh - 65px)",
        // config: {
        //   easing: easings.steps(5),
        // },
        onRest: () => {
          !isMoreClicked && setIsAnimationEnds(false);
        },
      });
  }, [isMoreClicked, isAnimationEnds, api]);

  const bind = useDrag(({ movement: [, y], memo = false, last, velocity }) => {
    if (!isMoreClicked) return memo;

    const newHeight = Math.max(y + 65, 65);
    const isQuickDrag = velocity[1] > 0.1;

    if (y > 0) {
      if (last) {
        if (
          window.innerHeight - newHeight < window.innerHeight / 2.2 ||
          isQuickDrag
        ) {
          api.start({
            // config: {
            //   easing: easings.easeInOutCubic,
            // },
            height: "calc(0vh - 65px)",
          });
          setIsMoreClicked(null);
        } else {
          api.start({
            // config: {
            //   easing: easings.easeInOutCubic,
            // },
            height: `calc(100vh - 80px)`,
          });
        }
      } else {
        api.start({
          // config: {
          //   easing: easings.easeInOutCubic,
          // },
          height: `calc(100vh - ${newHeight}px)`,
        });
      }
    }
    return memo;
  });

  const colorStyle = {
    color: isMoreClicked === "Income" ? "var(--Fc-1)" : "var(--Gc-1)",
  };

  const [springs] = useSprings(
    sortItems.length,
    (index) => ({
      background: sortby === sortItems[index] ? "var(--Bc-2)" : "var(--Ac-3)",
      color: sortby === sortItems[index] ? "var(--Bc-1)" : "var(--Ac-2)",
      fontWeight: sortby === sortItems[index] ? "600" : "200",
      border:
        sortby === sortItems[index]
          ? "1px solid var(--Bc-2)"
          : "1px solid var(--Ac-3)",
    }),
    [sortby]
  );

  const lastScrollTopRef = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(null);

  const handleScroll = () => {
    const currentScrollTop = monthlyMainRef.current.scrollTop;

    if (currentScrollTop > lastScrollTopRef.current) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }

    lastScrollTopRef.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
  };

  const springProps1 = useCustomSpring(
    isMoreClicked,
    1,
    isScrollingDown,
    false
  );
  const springProps2 = useCustomSpring(isMoreClicked, 2, isScrollingDown, true);
  const springProps3 = useCustomSpring(isMoreClicked, 3, isScrollingDown, true);
  const springProps4 = useSpring({
    y: isScrollingDown ? -160 : 0,
  });
  const ClickBlurStyle = useSpring({
    from: {
      filter: transactionClickAnim ? "blur(0px)" : "blur(10px)",
      opacity: transactionClickAnim ? "1" : "0.7",
      scale: transactionClickAnim ? 1 : 0.9,
      height: "calc(100vh + 90px)",
    },
    to: {
      filter: transactionClickAnim ? "blur(10px)" : "blur(0px)",
      opacity: transactionClickAnim ? "0.7" : "1",
      scale: transactionClickAnim ? 0.9 : 1,
      height: "calc(100vh + 90px)",
    },
  });

  useEffect(() => {
    if (monthlyMainRef.current) {
      monthlyMainRef.current.scrollTop = 0;
    }
  }, [whichMonth]);

  return (
    <>
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
              {!!labelDistribution[0] && (
                <animated.li style={summaryStiles[0]}>
                  $
                  {labelDistribution.length > 0
                    ? (
                        (labelDistribution[0].percentage * totalAmount) /
                        100
                      ).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {!!labelDistribution[1] && (
                <animated.li style={summaryStiles[1]}>
                  $
                  {labelDistribution.length > 0
                    ? (
                        (labelDistribution[1].percentage * totalAmount) /
                        100
                      ).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {!!labelDistribution[2] && (
                <animated.li style={summaryStiles[2]}>
                  $
                  {labelDistribution.length > 0
                    ? (
                        (labelDistribution[2].percentage * totalAmount) /
                        100
                      ).toFixed(0)
                    : 0}
                </animated.li>
              )}
              {!!labelDistribution[0] &&
                !!labelDistribution[1] &&
                !!labelDistribution[2] && (
                  <animated.li style={summaryStiles[3]}>
                    $
                    {labelDistribution.length > 0
                      ? (
                          ((100 -
                            labelDistribution[0].percentage -
                            labelDistribution[1].percentage -
                            labelDistribution[2].percentage) *
                            totalAmount) /
                          100
                        ).toFixed(0)
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
              {!!labelDistribution[0] && (
                <animated.li>
                  <span>•</span>
                  {labelDistribution.length > 0
                    ? labelDistribution[0].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              {!!labelDistribution[1] && (
                <animated.li>
                  <span>•</span>
                  {labelDistribution.length > 0
                    ? labelDistribution[1].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              {!!labelDistribution[2] && (
                <animated.li>
                  <span>•</span>
                  {labelDistribution.length > 0
                    ? labelDistribution[2].category.split(" ")[0]
                    : ""}
                </animated.li>
              )}
              <animated.li>
                <span>•</span>Other
              </animated.li>
            </animated.div>
            <animated.div className="TransactionList_Menu" style={springProps3}>
              <p>
                Filter Transactions <span></span>
              </p>
              {springs.map((props, index) => (
                <animated.h1
                  key={sortItems[index]}
                  style={{ ...props, background: "var(--Ec-4)" }}
                  onClick={() => setSortby(sortItems[index])}
                >
                  <animated.div
                    style={{ ...props, opacity: 0.7 }}
                    className="CirleColor"
                  ></animated.div>
                  {sortItems[index]}
                </animated.h1>
              ))}
              <h2>
                <animated.div className="CirleColor"></animated.div>
                <CiSearch />
              </h2>
              <h2>
                <animated.div className="CirleColor"></animated.div>
                <CiCalendarDate />
              </h2>
              <p>
                <span></span>
              </p>
            </animated.div>
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
