import React from "react";
import { useSprings, animated } from "react-spring";
import { ScalableElement, useCustomSpring } from "./tools";
import { CiSearch, CiCalendarDate } from "react-icons/ci";

const TransactionFilter = ({
  sortby,
  setSortby,
  isMoreClicked,
  isScrollingDown,
  setIsCalendarClicked,
  isCalendarClicked,
}) => {
  const sortItems = ["All", "Daily", "Monthly"];

  const [springs] = useSprings(
    sortItems.length,
    (index) => ({
      background: sortby === sortItems[index] ? "var(--Bc-2)" : "var(--Ac-3)",
      color: sortby === sortItems[index] ? "var(--Bc-1)" : "var(--Ac-1)",
      fontWeight: sortby === sortItems[index] ? "600" : "200",
      border:
        sortby === sortItems[index]
          ? "1px solid var(--Bc-2)"
          : "1px solid var(--Ac-3)",
    }),
    [sortby]
  );

  const springProps = useCustomSpring(isMoreClicked, 3, isScrollingDown, true);

  return (
    <animated.div className="TransactionList_Menu" style={springProps}>
      <p>
        <h3>Filter</h3> Transactions
      </p>
      {springs.map((props, index) => (
        <ScalableElement
          as="h1"
          key={sortItems[index]}
          style={{ ...props, background: "var(--Ec-2)" }}
          onClick={() => setSortby(sortItems[index])}
        >
          <animated.div
            style={{ ...props, opacity: 0.4 }}
            className="CirleColor"
          ></animated.div>
          {sortItems[index]}
        </ScalableElement>
      ))}
      <ScalableElement as="h2">
        <animated.div className="CirleColor"></animated.div>
        <CiSearch />
      </ScalableElement>
      <ScalableElement
        as="h2"
        onClick={() => setIsCalendarClicked(!isCalendarClicked)}
      >
        <animated.div className="CirleColor"></animated.div>
        <CiCalendarDate />
      </ScalableElement>
      <p></p>
    </animated.div>
  );
};

export default TransactionFilter;