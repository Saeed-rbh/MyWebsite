import React, { useState, useCallback } from "react";
import PaperItem from "./PaperItem";
import { animated, useSpring, easings } from "react-spring";

const MoreInfoPapers = ({
  isActive,
  isHovered,
  ChildRefs,
  ParentRef,
  stages,
  list = []
}) => {
  const CloseOpenStylePapers = useSpring({
    overflow: "auto",
    top: 0,
    marginTop: isActive
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
    Array(list.length).fill(false)
  );

  React.useEffect(() => {
    setInfoClicked(Array(list.length).fill(false));
  }, [list.length]);

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
      {list.map((paper, index) => (
        <PaperItem
          key={paper.id || index}
          paper={paper}
          ChildRefs={ChildRefs && ChildRefs.current ? ChildRefs.current[index] : null}
          isOpen={infoClicked[index]}
          handleToggle={() => handleToggle(index)}
          loadPaper={NaN}
          Openclose={isActive}
          stages={stages}
        />
      ))}
    </animated.div>
  );
};

export default MoreInfoPapers;
