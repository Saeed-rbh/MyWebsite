import React from "react";
import { animated, useSpring, easings } from "react-spring";
const PaperData = ({ isActive, stages, size, adjustHeight, list = [] }) => {
  const CloseOpenStyleInfo = useSpring({
    position: "absolute",
    top: isActive
      ? stages[2]
        ? size[0] - 135
        : size[0] - 135
      : stages[2]
        ? size[0] - 70
        : size[0] - 70 + adjustHeight,
    width: "calc(100% - 20px)",
    height: "60px",
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
        <p>{list.length}</p>
      </animated.div>
      <animated.div style={Scale}>
        <p>Latest</p>
        <p>{list[0]?.Year || "—"}</p>
      </animated.div>
      <animated.div style={Scale}>
        <p>Full list</p>
        <p><a href="/journal/" onClick={(event) => event.stopPropagation()}>Journal</a></p>
      </animated.div>
    </animated.div>
  );
};

export default PaperData;
