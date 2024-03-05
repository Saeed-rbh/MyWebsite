// Import React and the animated component
import React from "react";
import { useSpring, animated } from "react-spring";

// Define the IntroText component
const IntroText = ({
  screenHeight,
  startAnimation,
  reverseAnimation,
  endAnimation,
}) => {
  const FromStyle1 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: startAnimation ? (reverseAnimation ? -10 : 0) : 20,
      opacity: startAnimation ? (reverseAnimation ? 0 : 0.5) : 0,
      scale: startAnimation ? (reverseAnimation ? 0.7 : 1) : 1.1,
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
      y: startAnimation ? (reverseAnimation ? -10 : 0) : 20,
      opacity: startAnimation ? (reverseAnimation ? 0 : 0.5) : 0,
      scale: startAnimation ? (reverseAnimation ? 0.7 : 1) : 1.1,
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
      y: reverseAnimation ? (endAnimation ? -screenHeight / 2 + 300 : 0) : 20,
      opacity: reverseAnimation ? (endAnimation ? 0 : 0.75) : 0,
      scale: reverseAnimation ? (endAnimation ? 1 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: endAnimation ? 0 : 200,
  });
  const ToStyle2 = useSpring({
    from: { y: 20, opacity: 0, scale: 1.1 },
    to: {
      y: reverseAnimation ? (endAnimation ? -screenHeight / 2 + 300 : 0) : 20,
      opacity: reverseAnimation ? (endAnimation ? 0 : 0.75) : 0,
      scale: reverseAnimation ? (endAnimation ? 1 : 1) : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: endAnimation ? 0 : 500,
  });

  const TitleStyle1 = useSpring({
    from: {
      y: -screenHeight / 2 + 275,
      opacity: 0,
      scale: 1.1,
      fontSize: "30px",
      fontWeight: "700",
      filter: "contrast(0.7) brightness(0.8)",
    },
    to: {
      opacity: endAnimation ? 0.65 : 0,
      scale: endAnimation ? 1 : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 500,
  });
  const TitleStyle2 = useSpring({
    from: {
      y: -screenHeight / 2 + 275,
      opacity: 0,
      scale: 1.1,
      fontSize: "30px",
      fontWeight: "700",
      filter: "contrast(0.7) brightness(0.8)",
    },
    to: {
      opacity: endAnimation ? 0.65 : 0,
      scale: endAnimation ? 1 : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 800,
  });
  const TitleStyle3 = useSpring({
    from: {
      y: -screenHeight / 2 + 275,
      opacity: 0,
      scale: 1.1,
      fontSize: "35px",
    },
    to: {
      opacity: endAnimation ? 0.85 : 0,
      scale: endAnimation ? 1 : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 1100,
  });
  const TitleStyle4 = useSpring({
    from: {
      y: -screenHeight / 2 + 275,
      opacity: 0,
      scale: 1.1,
      fontSize: "30px",
      fontWeight: "700",
      filter: "contrast(0.7) brightness(0.8)",
    },
    to: {
      opacity: endAnimation ? 0.65 : 0,
      scale: endAnimation ? 1 : 1.1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    delay: 1100,
  });

  return (
    <>
      <animated.p
        className="grapheneFromStyle"
        style={{ top: screenHeight / 2 - 235 }}
      >
        <animated.span style={FromStyle1}>From {"  "}</animated.span>
        {"  "}
        <animated.span style={FromStyle2}>Graphite</animated.span>
      </animated.p>
      <animated.p
        className="grapheneFromStyle"
        style={{ top: screenHeight / 2 - 235 }}
      >
        <animated.span style={ToStyle1}>To</animated.span>{" "}
        <animated.span style={ToStyle2}>Graphene</animated.span>
      </animated.p>
      <animated.p
        className="grapheneFromStyle"
        style={{ top: screenHeight / 2 - 235 }}
      >
        <animated.span style={TitleStyle1}>What </animated.span>{" "}
        <animated.span style={TitleStyle2}>is</animated.span>{" "}
        <animated.span style={TitleStyle3}>Graphene</animated.span>{" "}
        <animated.span style={TitleStyle4}>?!</animated.span>{" "}
      </animated.p>
    </>
  );
};

// Export the IntroText component
export default IntroText;
