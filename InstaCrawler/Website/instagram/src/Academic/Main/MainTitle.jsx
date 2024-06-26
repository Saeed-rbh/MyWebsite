import React, { useMemo, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import { useScroll } from "../General/ScrollProvider";
import useElementSize from "../Styles/useElementSize";

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
  const [x, y, scale] = useMemo(() => {
    if (scrollPosition <= 0) {
      return [
        xDiff[1],
        interpolateValue(scrollPosition, [yDiff[0] / 5, yDiff[1]]),
        scaleDiff[1],
      ];
    } else if (scrollPosition < 1) {
      return [
        interpolateValue(scrollPosition, xDiff),
        interpolateValue(scrollPosition, yDiff),
        interpolateValue(scrollPosition, scaleDiff),
      ];
    }
    return [xDiff[0], yDiff[0], scaleDiff[0]];
  }, [scrollPosition, xDiff, yDiff, scaleDiff]);

  return useSpring({
    from: { opacity: 0, x: xDiff[0], y: yDiff[1], display: "flex" },
    to: {
      opacity: visibility ? 0.7 : 0,
      x: visibility ? x : xDiff[0],
      y,
      scale,
      // paddingLeft: stages[2] ? "5%" : "0%",
    },
    delay: animationFinished ? 0 : 500,
    config: { duration: animationFinished ? undefined : 800 },
    onRest: () => setAnimationFinished(true),
  });
};

// MainTitle component
const MainTitle = ({ duration, initialDelay, delayIncrement }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const scrollPosition = useScroll() / 20;
  const stages = useSelector((state) => state.data.stages);
  const title1Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    xDiff: [-25, 0],
    yDiff: [-22, 0],
    scaleDiff: [0.65, 1],
    stages,
  });
  const title2Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    xDiff: [-55, 0],
    yDiff: [-25, 0],
    scaleDiff: [0.65, 1],
    stages,
  });

  const elementSize = useElementSize("AcademicCV-M");
  const CVHeader = useSpring({
    maxWidth: `${stages[2] || stages[3] ? 620 * 0.95 : elementSize.width}px`,
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
      <animated.p style={title2Style}>Academic CV</animated.p>
    </animated.div>
  );
};

export default React.memo(MainTitle);
