import React, { useCallback } from "react";
import { useSpring, animated, easings } from "react-spring";

const OpenIcon = ({ isOpen, setIsCross }) => {
  // Common configuration for both springs
  const commonConfig = {
    duration: 400,
    easing: easings.easeOutCubic,
  };

  // Spring properties for the left part of the icon
  const propsL = useSpring({
    to: {
      right: isOpen ? "12px" : "17px",
      width: isOpen ? "15px" : "10px",
      bottom: isOpen ? "18px" : "20px",
    },
    from: {
      right: "17px",
      width: "10px",
      bottom: "20px",
      transform: "rotate(-45deg)",
    },
    config: commonConfig,
  });

  // Spring properties for the right part of the icon
  const propsR = useSpring({
    to: {
      right: isOpen ? "12px" : "11px",
      width: isOpen ? "15px" : "10px",
      bottom: isOpen ? "18px" : "20px",
    },
    from: {
      right: "11px",
      width: "10px",
      bottom: "20px",
      transform: "rotate(45deg)",
    },
    config: commonConfig,
  });

  // Use useCallback for optimized event handling
  const toggleIsCross = useCallback(() => {
    setIsCross((prevIsOpen) => !prevIsOpen);
  }, [setIsCross]);

  return (
    <div className="icon-wrapper" onClick={toggleIsCross}>
      <animated.div style={propsL} className="iconcross"></animated.div>
      <animated.div style={propsR} className="iconcross"></animated.div>
    </div>
  );
};

export default OpenIcon;
