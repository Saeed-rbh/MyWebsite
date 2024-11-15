import React, { useState, useCallback } from "react";
import PaperItem from "./PaperItem";
import { List } from "./List";
import { animated, useSpring, easings } from "react-spring";

const MoreInfoPapers = ({
  isActive,
  isHovered,
  ChildRefs,
  ParentRef,
  stages,
}) => {
  const CloseOpenStylePapers = useSpring({
    top: isActive
      ? stages[2]
        ? "160px"
        : "160px"
      : isHovered
      ? "220px"
      : "300px",
    opacity: isActive ? "1" : isHovered ? "0.5" : "0",
    easing: easings.easeOutCubic,
  });

  const [infoClicked, setInfoClicked] = useState(
    Array(List.length).fill(false)
  );
  const handleToggle = useCallback(
    (index) => {
      const newInfoClicked = [...infoClicked];
      newInfoClicked[index] = !newInfoClicked[index];
      setInfoClicked(newInfoClicked);
    },
    [infoClicked]
  );

  return (
    <animated.div
      ref={ParentRef}
      className="MoreInfoPapers"
      style={CloseOpenStylePapers}
    >
      {List.map((paper, index) => (
        <PaperItem
          key={paper.id}
          paper={paper}
          ChildRefs={ChildRefs.current[index]}
          isOpen={infoClicked[index]}
          handleToggle={() => handleToggle(index)}
          loadPaper={NaN}
          Openclose={isActive}
        />
      ))}
    </animated.div>
  );
};

export default MoreInfoPapers;
