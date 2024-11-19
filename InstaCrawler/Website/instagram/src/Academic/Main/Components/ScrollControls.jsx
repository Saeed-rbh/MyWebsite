import React, { useState, useRef, useMemo } from "react";
import { useSpring, animated } from "react-spring";
import { HiArrowNarrowRight, HiArrowNarrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";

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

const ScrollControls = ({ scrollEffect }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const scrollEndRef = useRef(false);
  const { stages, scollableRef } = useSelector((state) => state.data);
  const { scrollPosition } = useScrollPosition(scollableRef);

  const titleStyle = useSpring({
    from: { opacity: 0, y: 10 },
    to: {
      opacity: scrollPosition <= 0 ? 0.8 : 0,
      y: scrollPosition <= 0 ? -2 : -15,
      width: stages[2] ? "98%" : "100%",
    },
    delay: animationFinished ? 0 : 700,
    onRest: () => setAnimationFinished(true),
  });

  const textStyle = useSpring({
    from: { opacity: 0, y: 10 },
    to: {
      opacity: visibility ? scrollEffect[3] : 0,
      y: visibility ? 0 : 10,
      margin: 0,
    },
    delay: animationFinished ? 0 : 500,
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
