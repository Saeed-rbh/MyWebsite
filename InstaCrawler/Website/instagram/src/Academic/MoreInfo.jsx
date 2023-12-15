import React from "react";
import { useSpring, animated } from "react-spring";
import { MdKeyboardArrowUp } from "react-icons/md";

const MoreInfo = ({ CloseOpen, MouseHover, Show, backgroundColor }) => {
  const adjustedBackgroundColor = backgroundColor.replace(
    /(\d{1,2}|50)%/,
    "80%"
  );
  const isMoreInfoVisible = CloseOpen && Show;
  const isArrowVisible = !CloseOpen && MouseHover;

  // Convert styles to numeric values for animation
  const paddingBottomValue = CloseOpen ? 0 : isArrowVisible ? 20 : 0;
  const marginBottomValue = CloseOpen ? -20 : isArrowVisible ? -15 : -20;
  const translateYValue = CloseOpen ? 0 : isArrowVisible ? -15 : -5;

  // Define the animated styles using numeric values
  const closeOpenStyleMoreInfo = useSpring({
    opacity: isMoreInfoVisible || isArrowVisible ? 1 : 0,
    paddingBottom: paddingBottomValue,
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

  // Construct the gradient style separately
  const gradientBackground = `linear-gradient(to bottom, #00000000 0%, ${adjustedBackgroundColor} ${
    CloseOpen ? 50 : 100
  }%)`;

  return (
    <animated.div
      style={{ ...closeOpenStyleMoreInfo, background: gradientBackground }}
      className="More-Paper-Info"
    >
      <animated.div style={closeOpenStyleMoreInfoArrow}>
        <MdKeyboardArrowUp />
      </animated.div>
      <animated.div style={closeOpenStyleMoreInfoArrow}>
        <MdKeyboardArrowUp />
      </animated.div>
      <animated.p style={closeOpenStyleMoreText}>More Info</animated.p>
    </animated.div>
  );
};

export default MoreInfo;
