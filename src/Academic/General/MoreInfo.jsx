import React from "react";
import { useSpring, animated } from "react-spring";
import { MdKeyboardArrowUp } from "react-icons/md";

const MoreInfo = ({ CloseOpen, MouseHover, Show, backgroundColor, Stages }) => {
  const isMoreInfoVisible = CloseOpen && Show;
  const isArrowVisible = !CloseOpen && MouseHover;

  // Convert styles to numeric values for animation
  const paddingBottomValue = CloseOpen
    ? 0
    : isArrowVisible
    ? Stages[2]
      ? 10
      : 20
    : 0;
  const marginBottomValue = CloseOpen ? -20 : isArrowVisible ? -15 : -20;
  const translateYValue = CloseOpen ? 0 : isArrowVisible ? -15 : -5;

  const closeOpenStyleMoreInfo = useSpring({
    opacity: isMoreInfoVisible || isArrowVisible ? 1 : 0,
    paddingBottom: paddingBottomValue,
    height: 50,
  });

  const closeOpenStyleMoreInfoArrow = useSpring({
    display: "flex",
    flexDirection: "column",
    opacity: isArrowVisible ? 1 : 0,

    marginBottom: marginBottomValue,
    transform: `translateY(${translateYValue}px)`,
  });

  const closeOpenStyleMoreText = useSpring({
    opacity: isMoreInfoVisible ? 0 : isArrowVisible ? 1 : 0,
    margin: 0,
    color: "#d49d81cb",
  });

  const gradientBackground = `linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(17 18 22) 100%)
  }%)`;

  const Title = Stages[2] ? "Click for More Info" : "More Info";

  return (
    <animated.div
      style={{
        ...closeOpenStyleMoreInfo,
        background: gradientBackground,
        zIndex: 100,
      }}
      className="More-Paper-Info"
    >
      <animated.div style={closeOpenStyleMoreInfoArrow}>
        <MdKeyboardArrowUp />
      </animated.div>
      <animated.div style={closeOpenStyleMoreInfoArrow}>
        <MdKeyboardArrowUp />
      </animated.div>
      <animated.p style={closeOpenStyleMoreText}>{Title}</animated.p>
    </animated.div>
  );
};

export default MoreInfo;
