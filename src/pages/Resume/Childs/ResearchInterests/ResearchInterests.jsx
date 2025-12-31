import React, { useEffect, useState } from "react";
import { animated } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";
import useElementSize from "../../Styles/useElementSize";
import { useScrollableRef } from "../../General/ScrollableRefContext";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const {
    id,
    list,
    size,
    title,
    name,
    top,
    adjustViewport,
    adjustTop,
    isActive,
  } = useUtilize(componentName);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { stages, toggle } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollTop } = useScrollPosition(scrollableRef);
  const elementSize = useElementSize("MoreInfoAcademic").width;

  const style = {
    borderRadius: "40px",
    height: stages[2] ? `${size[0] * 2 - 20}px` : `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    // backgroundColor removed
    overflow: "visible",

    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    width: stages[1] ? Math.min(elementSize * 0.97, size[1]) : size[1],
    left: stages[1]
      ? (elementSize - Math.min(elementSize * 0.97, size[1])) / 2
      : 0,
    boxSize: "border-box",
    top: stages[1] ? top : top + adjustTop,
  };

  const Main = {
    padding: stages[2] ? "17px 15px 10px 5px" : "11px 10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: stages[1] ? "space-around" : "flex-start",
    width: "100%",
    height: "100%",
    margin: "7px",
    boxSizing: "border-box",
  };

  const [initial, setInitial] = useState(false);
  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
    isActive,
    initial,
    setInitial,
  });

  return (
    <animated.div
      ref={ref}
      style={{ ...style, ...combinedStyle }}
      className={name}
      id={name}
    >
      <animated.h1 style={{ marginTop: "-10px", marginLeft: "10px" }}>
        {title}
      </animated.h1>
      <animated.div className="RInterests" style={Main}>
        {list.slice(0, stages[2] ? 4 : 3).map((topic) => (
          <a key={topic.label} href={topic.href}>
            {topic.label}
          </a>
        ))}
      </animated.div>
    </animated.div>
  );
};

export default ResearchInterests;
