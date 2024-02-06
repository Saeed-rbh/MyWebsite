import React, { useRef, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";

const calculateWidth = (titleRef, explanationRef, mainRef) => {
  const titleWidth = titleRef.current?.offsetWidth || 0;
  const explanationWidth = explanationRef.current?.offsetWidth || 0;
  const mainWidth = mainRef.current?.offsetWidth || 0;
  return [titleWidth, explanationWidth, mainWidth];
};

const TitleText = ({ isActive, title, explanation, widthSplit }) => {
  const titleRef = useRef(null);
  const explanationRef = useRef(null);
  const mainRef = useRef(null);
  const stages = useSelector((state) => state.data.stages);
  const [width, setWidth] = useState([0, 0, 0]);

  useEffect(() => {
    setWidth(calculateWidth(titleRef, explanationRef, mainRef));
  }, [titleRef, explanationRef, mainRef.current?.offsetWidth, stages]);

  const widthSplitFactor = widthSplit ? 1.6 : 1;
  const factor = Math.min((width[2] / width[0]) * 0.7, 1.5) * widthSplitFactor;

  const mainStyle = useSpring({
    top: isActive ? 25 : 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "baseline",
  });

  const otherTitleStyle1 = useSpring({
    position: "absolute",
    width: widthSplit ? "50vw" : "max-content",
    // maxWidth: isActive ? "80%" : "100%",
    top: isActive ? -5 - (factor - 1) * 7 : -5,
    fontSize: isActive ? 20 * factor : 20,
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
