import React, { useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useElementSize from "../Styles/useElementSize";
import useScrollPosition from "../General/useScrollPosition";

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
  xDiff,
  yDiff,
  scaleDiff,
  stages,
}) => {
  const scroll = scrollPosition / 50;
  const updateVariables = useSelector((state) => state.data);
  const toggle = updateVariables.toggle;

  return useSpring({
    from: { opacity: 0, y: yDiff[1], display: "flex" },
    to: {
      opacity: scroll > 0 || toggle[0] ? 0 : visibility ? 0.7 : 0,
      // x: scroll <= 0 ? xDiff[1] : xDiff[1] - 10,
      y:
        scroll <= 0 || toggle[0]
          ? interpolateValue(scroll, [yDiff[0] / 3, yDiff[1]])
          : scroll > 0
          ? yDiff[1] - 50
          : yDiff[1],
      // scale: scroll > 0 ? 0.9 : 1,
    },
    delay: animationFinished ? 0 : 500,
    config: { duration: animationFinished ? undefined : 800 },
    onRest: () => setAnimationFinished(true),
  });
};

// MainTitle component
const MainTitle = ({ duration, initialDelay, delayIncrement, size }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const { stages, scollableRef } = useSelector((state) => state.data);
  const { scrollPosition } = useScrollPosition(scollableRef);

  const title1Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    // xDiff: [-35, stages[1] ? 0 : 0],
    yDiff: [50, stages[1] ? 90 : 30],
    scaleDiff: [0.9, 1],
    stages,
  });
  const title2Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    // xDiff: [-35, stages[1] ? 0 : 0],
    yDiff: [50, stages[1] ? 85 : 30],
    scaleDiff: [0.9, 1],
    stages,
  });

  const elementSize = useElementSize("AcademicCV-M");
  const CVHeader = useSpring({
    position: "fixed",
    top: 30,
    maxWidth: `${stages[1] || stages[3] ? 620 * 0.95 : elementSize.width}px`,
    left: stages[1] ? "calc((100% + 10px - 5px)/2)" : "0px",
    width: stages[1]
      ? "calc(100% - 5px)"
      : `${Math.max(
          Math.min(elementSize.width * 0.95, size * 2.3),
          size * 2 + 10
        )}px`,
    // left: stages[1] ? "10px" : "0px",
    // left: stages[1] ? "50px" : "30px",
    // top: stages[1] ? "80px" : "50px",
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
      <animated.p style={title2Style}>Academic CV-0</animated.p>
    </animated.div>
  );
};

export default React.memo(MainTitle);
