import React, { useState } from "react";
import { easings, useSpring, animated } from "react-spring";
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { useSelector } from "react-redux";

const OpenIcon = ({
  isOpen,
  Test,
  CloseOpen,
  handleClickClose,
  backgroundColor,
  seqId,
  widthSplit,
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
    scale: "1.3",
    y: 2,
    color: `rgb(255 193 161 / ${!CloseOpen ? 60 : 0}%)`,
    opacity: !CloseOpen ? "1" : "0",
  }));

  const [IconCross, setIconCross] = useSpring(() => ({
    right: "0px",
  }));

  const handleMouseOver = () => {
    setTextprop({ left: "12px", opacity: "1" });
    setIconProp({ width: "80px" });
    setIconCross({ right: "32px" });
  };

  const handleMouseLeave = () => {
    setTextprop({ left: "-10px", opacity: "0" });
    setIconProp({ width: "50px" });
    setIconCross({ right: "0px" });
  };

  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const CONFIG = [2200, 200, 600];

  const textStyle = useSpring({
    position: "absolute",
    top: -11,
    margin: "0 auto",
    fontSize: 8,
    width: "max-content",
    left: 85,
    color: "#fff",
    opacity: 0.5,
  });

  const CloseOpenStyleClose = useSpring({
    from: { opacity: 0, scale: 0 },
    to: {
      opacity: visibility ? (!CloseOpen ? 1 : 0) : 0,
      scale: visibility ? (!CloseOpen ? 1 : 0) : 0,
      position: "absolute",
      bottom: widthSplit ? 0 : 10,
      right: widthSplit ? -10 : 10,
      width: widthSplit ? 500 : 60,
      height: widthSplit ? 25 : 60,
      borderRadius: widthSplit ? 0 : 35,
      backgroundColor: backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: {
      duration: animationFinished ? undefined : CONFIG[2],
    },
    onRest: () => setAnimationFinished(true),
  });

  return (
    <animated.div
      style={CloseOpenStyleClose}
      onClick={() => handleClickClose()}
    >
      <animated.div
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        style={{ ...IconProp }}
      >
        {!widthSplit && <CgArrowsExpandUpLeft />}
        {widthSplit && (
          <animated.h3 style={textStyle}>Click for More</animated.h3>
        )}
      </animated.div>
    </animated.div>
  );
};
export default OpenIcon;
