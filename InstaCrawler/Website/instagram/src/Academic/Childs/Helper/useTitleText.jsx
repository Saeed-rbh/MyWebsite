import React, { useRef, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

const TitleText = ({ isActive, title, explanation, titleStyle }) => {
  const titleRef = useRef(null);
  const explanationRef = useRef(null);
  const mainRef = useRef(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Extract offsetWidth values for better readability
    const titleWidth = titleRef.current?.offsetWidth;
    const explanationWidth = explanationRef.current?.offsetWidth;
    const mainWidth = mainRef.current?.offsetWidth;

    if (titleWidth && explanationWidth && mainWidth) {
      // If both title and explanation are present, set an array of their widths
      setWidth([titleWidth, explanationWidth, mainWidth]);
    }
  }, [titleRef, explanationRef, mainRef.current?.offsetWidth]); // Empty dependency array ensures this effect runs once after initial render

  const factor = Math.min((width[2] / width[0]) * 0.7, 1.5);

  const mainStyle = useSpring({
    top: isActive ? "25px" : "20px",
    width: "100%",
    justifyContent: "center",
    alignItems: "baseline",
  });
  const otherTitleStyle = useSpring({
    position: "absolute",
    width: "max-content",
    maxWidth: isActive ? "80%" : "100%",
    top: isActive ? -5 - (factor - 1) * 7 : -5,
    fontSize: isActive ? 20 * factor : 20,
    left: width[2] - width[1] ? (isActive ? 20 : (width[2] - width[0]) / 2) : 0,
  });
  const explanationStyle = useSpring({
    position: "absolute",
    width: "max-content",
    maxWidth: isActive ? "80%" : "100%",
    fontSize: 11,
    top: isActive ? 20 + (factor - 1) * 7 : 20,
    left: width[2] - width[1] ? (isActive ? 20 : (width[2] - width[1]) / 2) : 0,
  });

  return (
    <animated.div ref={mainRef} style={mainStyle} className="SecondTitle">
      <animated.h2 style={{ ...titleStyle, ...otherTitleStyle }} ref={titleRef}>
        {title}
      </animated.h2>
      <animated.span
        style={{ ...titleStyle, ...explanationStyle }}
        ref={explanationRef}
      >
        {explanation}
      </animated.span>
    </animated.div>
  );
};

export default TitleText;
