import React from "react";
import { animated, useSpring, easings } from "react-spring";

const PaperData = ({ isActive, stages, size, adjustHeight }) => {
  const CloseOpenStyleInfo = useSpring({
    position: "absolute",
    top: isActive
      ? stages[2]
        ? size[0] - 135
        : size[0] - 110
      : stages[2]
      ? size[0] - 70
      : size[0] - 70 + adjustHeight,
    width: "calc(100% - 20px)",
    height: "60px",
    // width: isActive
    //   ? "calc(100% - 95px)"
    //   : stages[2] || stages[3]
    //   ? "calc(100% - 45px)"
    //   : "100%",
    marginLeft: isActive ? "10px" : stages[2] ? "10px" : "10px",
    marginRight: isActive ? "10px" : stages[2] ? "10px" : "10px",
    paddingLeft: isActive ? "30px" : stages[2] ? "20px" : "20px",
    paddingRight: isActive ? "30px" : stages[2] ? "50px" : "50px",
    paddingTop: isActive ? "8px" : stages[2] ? "10px" : "10px",
    paddingBottom: isActive ? "8px" : stages[2] || stages[3] ? "10px" : "5px",
    boxSizing: "border-box",
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
      // ref={skillElementRef}
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
      {/* <animated.div style={Scale}>
        <p>
          i10- <span>index</span>
        </p>
        <p>7</p>
      </animated.div> */}
    </animated.div>
  );
};

export default PaperData;
