import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useElementSize from "../Styles/useElementSize";
import useScrollPosition from "../General/useScrollPosition";
import { useLocation } from "react-router-dom";
import { useScrollableRef } from "../General/ScrollableRefContext";

// AnimatedSpan component for individual letters
const AnimatedSpan = ({ letter, delay, duration }) => {
  const animationProps = useSpring({
    from: { opacity: 0, x: -10 },
    to: { opacity: 0.2, x: 0 },
    config: { duration },
    delay,
  });

  return <animated.span style={animationProps}>{letter}</animated.span>;
};

// Helper function to interpolate values
const interpolateValue = (scrollPosition, [endValue, startValue]) => {
  return startValue + (endValue - startValue) * scrollPosition;
};

// Custom hook for title animation
const useTitleAnimation = ({
  scrollPosition,
  visibility,
  animationFinished,
  setAnimationFinished,
  yDiff,
}) => {
  const scroll = scrollPosition / 50;
  const updateVariables = useSelector((state) => state.data);
  const toggle = updateVariables.toggle;

  const { currentPage } = useSelector((state) => state.ui);
  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  useEffect(() => {
    if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  return useSpring({
    // from: { opacity: 0, y: yDiff[1], display: "flex" },
    // to: {
    display: "flex",
    opacity:
      resumeClicked === 1
        ? scroll > 0 || toggle[0]
          ? 0
          : visibility
            ? 0.7
            : 0
        : 0,
    // x: scroll <= 0 ? xDiff[1] : xDiff[1] - 10,
    y:
      resumeClicked === 1
        ? scroll <= 0 || toggle[0]
          ? interpolateValue(scrollPosition / 150, [yDiff[0] / 3, yDiff[1]])
          : scroll > 0
            ? yDiff[1] - 50
            : yDiff[1]
        : yDiff[1] - 20,
    // scale: scroll > 0 ? 0.9 : 1,
    // },
    delay: animationFinished ? 0 : 500,
    config: {
      duration: resumeClicked === 2 ? 500 : animationFinished ? undefined : 800,
    },
    onRest: () => setAnimationFinished(true),
  });
};

import cvData from "../../../data/cvData.json";
import DownloadButton from "./DownloadButton";

// MainTitle component
const MainTitle = ({ duration, initialDelay, delayIncrement, size }) => {
  const { visibility } = useSelector((state) => state.ui);
  const [animationFinished, setAnimationFinished] = useState(false);
  const { stages } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollPosition } = useScrollPosition(scrollableRef);

  const title1Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    // xDiff: [-35, stages[1] ? 0 : 0],
    yDiff: [50, stages[1] ? 0 : 55],
    scaleDiff: [0.9, 1],
    stages,
  });
  const title2Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    // xDiff: [-35, stages[1] ? 0 : 0],
    yDiff: [50, stages[1] ? 0 : 55],
    scaleDiff: [0.9, 1],
    stages,
  });

  const elementSizeMain = useElementSize("AcademicCV-M").width;
  const elementSize = useElementSize("MoreInfoAcademic");
  const CVHeader = useSpring({
    marginTop: stages[1] ? 70 : 0,
    position: stages[1] ? "relative" : "fixed",
    top: 0,
    zIndex: 1,
    maxWidth: `${stages[1] || stages[3] ? 620 * 0.95 : elementSize.width}px`,
    left: stages[1]
      ? 0
      : 20, //(elementSizeMain - elementSize.width) / 2 + 10,
    width: stages[1]
      ? elementSize.width - 5
      : Math.max(Math.min(elementSize.width * 0.95, size * 2.3), size * 2 + 10),
  });

  return (
    <animated.div style={CVHeader} className="CVHeader">
      <animated.div style={title1Style}>
        <AnimatedSpan letter="M" delay={initialDelay} duration={duration} />
        <AnimatedSpan
          letter="Y"
          delay={initialDelay + delayIncrement}
          duration={duration}
        />
      </animated.div>
      <animated.p style={title2Style}>
        Academic CV
        {elementSizeMain > 768 && <DownloadButton cvData={cvData} />}
      </animated.p>
    </animated.div>
  );
};

export default React.memo(MainTitle);
