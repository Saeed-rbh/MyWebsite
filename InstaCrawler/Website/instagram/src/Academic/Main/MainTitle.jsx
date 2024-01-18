import React, { useMemo, useState, memo } from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import { useScroll } from "../General/ScrollProvider";

// AnimatedSpan component for individual letters
const AnimatedSpan = memo(({ letter, delay, duration }) => {
  const animationProps = useSpring({
    from: { opacity: 0, x: -10 },
    to: { opacity: 0.2, x: 0 },
    config: { duration },
    delay,
  });

  return <animated.span style={animationProps}>{letter}</animated.span>;
});

AnimatedSpan.propTypes = {
  letter: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
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
    from: { opacity: 0, x: xDiff[0], y: yDiff[0], display: "flex" },
    to: {
      opacity: visibility ? 0.7 : 0,
      x: visibility ? x : xDiff[0],
      y,
      scale,
    },
    delay: animationFinished ? 0 : 500,
    config: { duration: animationFinished ? undefined : 400 },
    onRest: () => setAnimationFinished(true),
  });
};

// MainTitle component
const MainTitle = ({ duration, initialDelay, delayIncrement }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const scrollPosition = useScroll() / 20;

  const title1Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    xDiff: [-25, 0],
    yDiff: [-22, 0],
    scaleDiff: [0.65, 1],
  });
  const title2Style = useTitleAnimation({
    scrollPosition,
    visibility,
    animationFinished,
    setAnimationFinished,
    xDiff: [-55, 0],
    yDiff: [-25, 0],
    scaleDiff: [0.65, 1],
  });

  return (
    <div className="CVHeader">
      <animated.div style={title1Style}>
        <AnimatedSpan letter="M" delay={initialDelay} duration={duration} />
        <AnimatedSpan
          letter="Y"
          delay={initialDelay + delayIncrement}
          duration={duration}
        />
      </animated.div>
      <animated.p style={title2Style}>Academic CV</animated.p>
    </div>
  );
};

MainTitle.propTypes = {
  duration: PropTypes.number.isRequired,
  initialDelay: PropTypes.number.isRequired,
  delayIncrement: PropTypes.number.isRequired,
};

export default memo(MainTitle);
