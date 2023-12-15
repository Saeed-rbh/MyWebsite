import React from "react";
import { animated, useSpring, easings } from "react-spring";

const PaperData = ({ isActive, skillElementRef }) => {
  const CloseOpenStyleInfo = useSpring({
    top: isActive ? "-40px" : "10px",
    marginLeft: isActive ? "10px" : "45px",
    marginRight: isActive ? "10px" : "45px",
    easing: easings.easeOutCubic,
    duration: 100,
  });
  return (
    <animated.div
      className="Paper-Data"
      style={CloseOpenStyleInfo}
      ref={skillElementRef}
    >
      <div>
        <p>
          #- <span>Papers</span>
        </p>
        <p>11</p>
      </div>
      <div>
        <p>Citations</p>
        <p>207</p>
      </div>
      <div>
        <p>
          H- <span>index</span>
        </p>
        <p>8</p>
      </div>
      <div>
        <p>
          i10- <span>index</span>
        </p>
        <p>7</p>
      </div>
    </animated.div>
  );
};

export default PaperData;
