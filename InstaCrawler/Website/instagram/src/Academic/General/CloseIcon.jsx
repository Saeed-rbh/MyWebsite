import React from "react";
import { easings, useSpring, animated } from "react-spring";

const CloseIcon = ({
  isOpen,
  Test,
  CloseOpen,
  handleClickClose,
  backgroundColor,
}) => {
  const commonConfig = {
    duration: 400,
    easing: easings.easeOutCubic,
  };

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

  const [Textprop, setTextprop] = useSpring(() => ({
    left: "-10px",
    opacity: "0",
  }));

  const [IconProp, setIconProp] = useSpring(() => ({
    backgroundColor: backgroundColor,
    width: 60,
    height: 60,
    borderRadius: 35,
  }));

  const [IconCross, setIconCross] = useSpring(() => ({
    right: "5px",
    top: "-5px",
    width: 60,
    height: 60,
  }));

  const handleMouseOver = () => {
    // setTextprop({ left: "12px", opacity: "1" });
    // setIconProp({ width: "80px" });
    // setIconCross({ right: "32px" });
  };

  const handleMouseLeave = () => {
    // setTextprop({ left: "-10px", opacity: "0" });
    // setIconProp({ width: "50px" });
    // setIconCross({ right: "0px" });
  };

  const CloseOpenStyleClose = useSpring({
    opacity: CloseOpen ? "1" : "0",
    scale: CloseOpen ? "1" : "0",
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
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
        <animated.h3 style={Textprop}>{Test}</animated.h3>
      </animated.div>
    </animated.div>
  );
};
export default CloseIcon;
