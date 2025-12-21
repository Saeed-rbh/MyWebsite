import React, { useState, useRef, useMemo } from "react";
import { useSpring, animated } from "react-spring";
import { HiArrowNarrowRight, HiArrowNarrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useScrollableRef } from "../../General/ScrollableRefContext";

const commonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 12,
};

const Arrow = ({ direction, style }) => {
  const Icon = direction === "left" ? HiArrowNarrowLeft : HiArrowNarrowRight;
  return (
    <animated.div style={style}>
      <Icon />
    </animated.div>
  );
};

const ScrollControls = ({ scrollEffect, resumeClicked }) => {
  const { visibility } = useSelector((state) => state.ui);
  const [animationFinished, setAnimationFinished] = useState(false);
  const scrollEndRef = useRef(false);
  const { stages } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollPosition } = useScrollPosition(scrollableRef);

  const titleStyle = useSpring({
    // from: { opacity: 0, y: 10 },
    // to: {
    opacity: resumeClicked === 1 ? (scrollPosition <= 0 ? 0.8 : 0) : 0,
    y:
      resumeClicked === 1
        ? scrollPosition <= 0
          ? -2
          : -15
        : resumeClicked === 2
          ? -10
          : 10,
    width: stages[2] ? "98%" : "100%",
    // },
    delay: resumeClicked === 1 ? (animationFinished ? 0 : 700) : 0,
    onRest: () => setAnimationFinished(true),
  });

  const textStyle = useSpring({
    // from: { opacity: 0, y: 10 },
    // to: {
    opacity: resumeClicked === 1 ? (visibility ? scrollEffect[3] : 0) : 0,
    y:
      resumeClicked === 1
        ? visibility
          ? 0
          : 10
        : resumeClicked === 2
          ? -10
          : 10,
    margin: 0,
    // },
    delay: resumeClicked === 1 ? (animationFinished ? 0 : 500) : 500,
    onRest: () => setAnimationFinished(true),
  });

  const lineStyle = useSpring({
    from: { width: 0 },
    to: {
      opacity: visibility ? scrollEffect[3] : 0,
      width: visibility ? 18 : 0,
    },
    delay: animationFinished ? 0 : 700,
    onRest: () => setAnimationFinished(true),
  });

  const arrowStyleLeft = useMemo(
    () => ({
      ...commonStyle,
      opacity: scrollEndRef.current ? 1 : 0,
      x: scrollEndRef.current ? 0 : -10,
    }),
    []
  );

  const arrowStyleRight = useMemo(
    () => ({
      ...commonStyle,
      opacity: !scrollEndRef.current ? 1 : 0,
      x: !scrollEndRef.current ? 3 : 10,
    }),
    []
  );

  return (
    <animated.div style={titleStyle} className="CVListP">
      <animated.p style={textStyle}>
        Easy Access Menu <animated.span style={lineStyle} />
      </animated.p>

      <h1>
        <Arrow
          direction="left"
          isVisible={scrollEndRef.current}
          style={arrowStyleLeft}
        />
        <animated.div style={{ ...commonStyle, fontSize: 10, opacity: 1 }}>
          {" "}
          scroll
        </animated.div>
        <Arrow
          direction="right"
          isVisible={!scrollEndRef.current}
          style={arrowStyleRight}
        />
      </h1>
    </animated.div>
  );
};

export default React.memo(ScrollControls);
