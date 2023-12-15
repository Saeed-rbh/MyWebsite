import React from "react";
import { easings, useSpring, animated } from "react-spring";

const OpenIcon = ({
  isOpen,
  Test,
  CloseOpen,
  handleClickClose,
  backgroundColor,
}) => {
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

  // Define the spring for the mouseover event
  const [Textprop, setTextprop] = useSpring(() => ({
    left: "-10px",
    opacity: "0",
  }));

  // Define the spring for the mouseleave event
  const [IconProp, setIconProp] = useSpring(() => ({
    width: "50px",
    backgroundColor: backgroundColor,
  }));

  const [IconCross, setIconCross] = useSpring(() => ({
    right: "0px",
  }));

  // Handlers for mouse events
  const handleMouseOver = () => {
    setTextprop({ left: "12px", opacity: "1" }); // Scale up when mouse enters
    setIconProp({ width: "80px" });
    setIconCross({ right: "32px" });
  };

  const handleMouseLeave = () => {
    setTextprop({ left: "-10px", opacity: "0" }); // Scale down to original size when mouse leaves
    setIconProp({ width: "50px" });
    setIconCross({ right: "0px" });
  };

  const CloseOpenStyleClose = useSpring({
    opacity: CloseOpen ? "1" : "0",
    scale: CloseOpen ? 1 : 0,
  });

  return (
    <animated.div
      className="MoreInfoClose"
      style={CloseOpenStyleClose}
      onClick={() => handleClickClose()}
    >
      <animated.div
        className="icon-wrapper"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        style={IconProp}
      >
        <animated.div style={IconCross} className="icon-wrapper-in">
          <animated.div style={propsL} className="iconcross"></animated.div>
          <animated.div style={propsR} className="iconcross"></animated.div>
        </animated.div>
        <animated.p style={Textprop}>{Test}</animated.p>
      </animated.div>
    </animated.div>
  );
};
export default OpenIcon;
