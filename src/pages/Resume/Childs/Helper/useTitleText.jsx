import React, { useRef, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useElementSize from "../../Styles/useElementSize";

const calculateWidth = (titleRef, explanationRef, mainRef) => {
  const titleWidth = titleRef.current?.offsetWidth || 0;
  const explanationWidth = explanationRef.current?.offsetWidth || 0;
  const mainWidth = mainRef.current?.offsetWidth || 0;
  return [titleWidth, explanationWidth, mainWidth];
};

const TitleText = ({
  isActive,
  title,
  explanation,
  widthSplit,
  name,
  stages,
}) => {
  const titleRef = useRef(null);
  const explanationRef = useRef(null);
  const mainRef = useRef(null);

  const [width, setWidth] = useState([0, 0, 0]);

  useEffect(() => {
    // Function to update widths
    const updateWidths = () => {
      setWidth([
        titleRef.current?.offsetWidth || 0,
        explanationRef.current?.offsetWidth || 0,
        mainRef.current?.offsetWidth || 0,
      ]);
    };

    // Create a new ResizeObserver instance to monitor the elements
    const resizeObserver = new ResizeObserver(() => {
      updateWidths();
    });

    // Observe the target elements
    if (titleRef.current) resizeObserver.observe(titleRef.current);
    if (explanationRef.current) resizeObserver.observe(explanationRef.current);
    if (mainRef.current) resizeObserver.observe(mainRef.current);

    // Update widths initially
    updateWidths();

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const mainStyle = useSpring({
    top: isActive ? 25 : 15,
    width:
      (name === "Teaching" || name === "Awards") && !stages[1] ? "80%" : "100%",
    justifyContent: "center",
    alignItems: "baseline",
  });

  const otherTitleStyle1 = useSpring({
    position: "absolute",
    whiteSpace: "pre-line", // Allow \n to create line breaks
    fontSize: isActive
      ? name === "Awards"
        ? 20
        : name === "Qualifications"
          ? 30
          : name === "Conference"
            ? 22
            : name === "Teaching"
              ? 5
              : 30
      : name === "Teaching" || name === "Awards"
        ? 20
        : 22,
    width: "max-content", // Allow full title width
    top: isActive ? -10 : -5,
    opacity: !isActive || !widthSplit ? 1 : 0,
    left:
      name === "Teaching" || name === "Awards"
        ? 20
        : isActive
          ? 20
          : (width[2] - width[0]) / 2,
  });
  const otherTitleStyle2 = useSpring({
    position: "absolute",
    width: "70vw",
    left: isActive ? 20 : (width[2] - width[0]) / 2,
    top: isActive ? -5 : 0,
    opacity: isActive ? 1 : 0,
    // fontSize: isActive ? 25 : 20,
    textWrap: "nowrap",
  });

  const explanationStyle = useSpring({
    position: "absolute",
    width: "max-content",
    // fontSize: 11,
    maxWidth: isActive ? "80%" : "100%",
    top: isActive ? 20 : 20,
    opacity: isActive || !widthSplit ? 1 : 0,
    left: widthSplit
      ? 25
      : width[2] - width[1]
        ? isActive
          ? 20
          : (width[2] - width[1]) / 2
        : 0,
  });
  return (
    <animated.div ref={mainRef} style={mainStyle} className="SecondTitle">
      <animated.h2 style={{ ...otherTitleStyle1 }} ref={titleRef}>
        {title}
      </animated.h2>
      {widthSplit && (
        <animated.h2 style={{ ...otherTitleStyle2 }} ref={titleRef}>
          {title}
        </animated.h2>
      )}
      <animated.span style={{ ...explanationStyle }} ref={explanationRef}>
        {explanation}
      </animated.span>
    </animated.div>
  );
};

export default React.memo(TitleText);
