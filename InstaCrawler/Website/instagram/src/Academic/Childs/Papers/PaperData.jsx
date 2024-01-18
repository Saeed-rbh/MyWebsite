import React from "react";
import { animated, useSpring, easings } from "react-spring";

const PaperData = ({ isActive, skillElementRef, stages }) => {
  const CloseOpenStyleInfo = useSpring({
    bottom: isActive
      ? stages[2]
        ? "60px"
        : "40px"
      : stages[2]
      ? "-10px"
      : "-10px",
    width: isActive
      ? "calc(100% - 95px)"
      : stages[2]
      ? "calc(100% - 45px)"
      : "100%",
    marginLeft: isActive ? "10px" : stages[2] ? "0px" : "45px",
    marginRight: isActive ? "10px" : stages[2] ? "-10px" : "45px",
    paddingLeft: isActive ? "30px" : stages[2] ? "5px" : "30px",
    paddingRight: isActive ? "30px" : stages[2] ? "50px" : "30px",
    paddingTop: isActive ? "8px" : stages[2] ? "10px" : "5px",
    paddingBottom: isActive ? "8px" : stages[2] ? "10px" : "5px",
    easing: easings.easeOutCubic,
    duration: 100,
  });

  const Scale = useSpring({
    scale: stages[2] ? 0.95 : 1,
    easing: easings.easeOutCubic,
  });
  return (
    <animated.div
      className="Paper-Data"
      style={CloseOpenStyleInfo}
      ref={skillElementRef}
    >
      <animated.div style={Scale}>
        <p>
          #- <span>Papers</span>
        </p>
        <p>11</p>
      </animated.div>
      <animated.div style={Scale}>
        <p>Citations</p>
        <p>207</p>
      </animated.div>
      <animated.div style={Scale}>
        <p>
          H- <span>index</span>
        </p>
        <p>8</p>
      </animated.div>
      <animated.div style={Scale}>
        <p>
          i10- <span>index</span>
        </p>
        <p>7</p>
      </animated.div>
    </animated.div>
  );
};

export default PaperData;
