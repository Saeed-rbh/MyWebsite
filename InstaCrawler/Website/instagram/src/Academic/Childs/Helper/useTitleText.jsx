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
  size,
}) => {
  const titleRef = useRef(null);
  const explanationRef = useRef(null);
  const mainRef = useRef(null);
  const stages = useSelector((state) => state.data.stages);
  const [width, setWidth] = useState([0, 0, 0]);

  const elementSize = useElementSize("MoreInfoAcademic").width;

  useEffect(() => {
    const titleWidth = titleRef.current?.offsetWidth;
    const explanationWidth = explanationRef.current?.offsetWidth;
    const widthMain = stages[1]
      ? !isActive && (name === "Teaching" || name === "Awards")
        ? Math.min(elementSize * 0.95, size[1]) / 2 - 5
        : Math.min(elementSize * 0.95, size[1])
      : name === "Skills"
      ? size[1]
      : !isActive && (name === "Teaching" || name === "Awards")
      ? Math.min(elementSize - size[1] - 20, size[1] * 1.5) / 2 - 5
      : Math.min(elementSize - size[1] - 20, size[1] * 1.5);

    setWidth([titleWidth, explanationWidth, widthMain]);
  }, [
    titleRef.current?.offsetWidth,
    explanationRef.current?.offsetWidth,
    mainRef.current?.offsetWidth,
    elementSize,
    isActive,
  ]);

  const [fontSize, setFontSize] = useState(20); // Start with a default font size

  useEffect(() => {
    function fitTextToParent() {
      const titleElement = titleRef.current;

      if (!titleElement) return;

      let maxFontSize = 30; // Maximum font size to test
      let minFontSize = 20; // Minimum font size to test
      let testFontSize = maxFontSize;

      // Binary search to find the maximum fitting font size
      while (minFontSize <= maxFontSize) {
        titleElement.style.fontSize = `${testFontSize}px`;

        // Check if the text overflows the available width
        if (titleElement.scrollWidth > size[1]) {
          // Text overflows, reduce font size
          maxFontSize = testFontSize - 1;
        } else {
          // Text fits, increase font size
          minFontSize = testFontSize + 1;
        }

        testFontSize = Math.floor((maxFontSize + minFontSize) / 2);
      }

      setFontSize(maxFontSize); // Set the highest fitting font size
    }

    fitTextToParent();
    window.addEventListener("resize", fitTextToParent);

    return () => window.removeEventListener("resize", fitTextToParent);
  }, []);

  const factor = 1.5;

  const mainStyle = useSpring({
    top: isActive ? 25 : 15,
    width: name === "Teaching" || name === "Awards" ? "80%" : "100%",
    justifyContent: "center",
    alignItems: "baseline",
  });

  const otherTitleStyle1 = useSpring({
    position: "absolute",
    width: widthSplit ? "100%" : "max-content",
    // maxWidth: isActive ? "80%" : "100%",
    top: isActive ? -5 - (factor - 1) * 7 : -5,
    fontSize: isActive ? fontSize : 20,
    opacity: !isActive || !widthSplit ? 1 : 0,
    left: widthSplit
      ? 25
      : width[2] - width[1]
      ? isActive
        ? 20
        : (width[2] - width[0]) / 2
      : 0,
  });
  const otherTitleStyle2 = useSpring({
    position: "absolute",
    width: "70vw",
    top: isActive ? -5 - (factor - 1) * 7 : -5,
    opacity: isActive ? 1 : 0,
    fontSize: isActive ? 20 * factor : 20,
    textWrap: "nowrap",
    left: widthSplit
      ? 25
      : width[2] - width[1]
      ? isActive
        ? 20
        : (width[2] - width[0]) / 2
      : 0,
  });

  const explanationStyle = useSpring({
    position: "absolute",
    width: "max-content",
    fontSize: 11,
    maxWidth: isActive ? "80%" : "100%",
    top: isActive ? 20 + (factor - 1) * 7 : 20,
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
