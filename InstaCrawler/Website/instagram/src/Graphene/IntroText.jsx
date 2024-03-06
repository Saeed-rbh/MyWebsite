// Import React and the animated component
import React from "react";
import { useSpring, animated } from "react-spring";

const IntroText = ({
  screenHeight,
  startAnimation,
  reverseAnimation,
  endAnimation,
  mouseDown,
}) => {
  const screenWidth = window.innerWidth;
  const FromStyle1 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: startAnimation
        ? reverseAnimation
          ? +screenHeight / 2 - screenWidth / 2 - 65 + 40
          : +screenHeight / 2 - screenWidth / 2 - 65 + 20
        : +screenHeight / 2 - screenWidth / 2 - 65,
      opacity: startAnimation ? (reverseAnimation ? 0 : 0.5) : 0,
      scale: startAnimation ? (reverseAnimation ? 0.9 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 200,
  });
  const FromStyle2 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: startAnimation
        ? reverseAnimation
          ? +screenHeight / 2 - screenWidth / 2 - 65 + 40
          : +screenHeight / 2 - screenWidth / 2 - 65 + 20
        : +screenHeight / 2 - screenWidth / 2 - 65,
      opacity: startAnimation ? (reverseAnimation ? 0 : 0.5) : 0,
      scale: startAnimation ? (reverseAnimation ? 0.9 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 500,
  });

  const ToStyle1 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: reverseAnimation
        ? endAnimation
          ? +screenHeight / 2 - screenWidth / 2 - 65
          : +screenHeight / 2 - screenWidth / 2 - 65 + 20
        : +screenHeight / 2 - screenWidth / 2 - 65,
      opacity: reverseAnimation ? (endAnimation ? 0 : 0.5) : 0,
      scale: reverseAnimation ? (endAnimation ? 0.9 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: endAnimation ? 0 : 500,
  });
  const ToStyle2 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: reverseAnimation
        ? endAnimation
          ? +screenHeight / 2 - screenWidth / 2 - 65
          : +screenHeight / 2 - screenWidth / 2 - 65 + 20
        : +screenHeight / 2 - screenWidth / 2 - 65,
      opacity: reverseAnimation ? (endAnimation ? 0 : 0.75) : 0,
      scale: reverseAnimation ? (endAnimation ? 0.9 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: endAnimation ? 0 : 800,
  });

  console.log(100 - Math.round(screenHeight / 40));
  const TitleStyle = useSpring({
    from: {
      y: 120,
      opacity: 0,
      scale: 1.1,
      fontSize: `${10 + Math.floor(screenHeight / 16)}px`,
    },
    to: {
      y: endAnimation ? 100 - Math.round(screenHeight / 40) : 120,
      opacity: endAnimation ? (mouseDown ? 0.1 : 0.4) : 0,
      scale: endAnimation ? (mouseDown ? 1.1 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 0,
  });

  return (
    <>
      <animated.p className="grapheneFromStyle">
        <animated.span style={FromStyle1}>From {"  "}</animated.span>
        {"  "}
        <animated.span style={FromStyle2}>Graphite</animated.span>
      </animated.p>
      <animated.p className="grapheneFromStyle">
        <animated.span style={ToStyle1}>To</animated.span>{" "}
        <animated.span style={ToStyle2}>Graphene</animated.span>
      </animated.p>
      <animated.p className="grapheneFromStyle">
        <animated.span style={TitleStyle}>Graphene</animated.span>{" "}
      </animated.p>
    </>
  );
};

// Export the IntroText component
export default IntroText;
