import React, { useEffect, useState } from "react";
import MoreInfoPapers from "./MoreInfoPapers";
import PaperData from "./PaperData";
import RecentPaper from "./RecentPaper";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";
import { useSelector } from "react-redux";
import { useSpring, easings } from "react-spring";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";

const Papers = () => {
  const componentName = "Published Papers";
  const utilizeProps = useUtilize(componentName);
  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);

  const {
    id,
    size,
    top,
    isActive,
    adjustViewport,
    adjustTop,
    adjustHeight,
    name,
  } = useUtilize(componentName);
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  // Determine viewport dimensions and adjust component position accordingly
  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + adjustViewport + (!stages[2] ? adjustTop : 0);
    let newAdjustedHeight = size[0] + (isActive ? adjustHeight : 0);
    const ModifyTop = 80;

    if (isActive) {
      if (
        newAdjustedTop + newAdjustedHeight >
        viewportHeight + scrollTop - ModifyTop
      ) {
        // If the component bottom goes out of view, adjust the top position
        newAdjustedTop =
          Math.max(viewportHeight + scrollTop - newAdjustedHeight, scrollTop) -
          ModifyTop;
      }
      if (newAdjustedHeight > viewportHeight) {
        // If the component is taller than the viewport, set the top to current scroll position and allow scrolling
        newAdjustedTop = scrollTop + ModifyTop;
        newAdjustedHeight = viewportHeight;
      }
    }

    setAdjustedTop(newAdjustedTop);
    setAdjustedHeight(newAdjustedHeight);
  }, [isActive, size, top, scrollTop]);

  const Style = {
    borderRadius: "40px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2] ? "0px" : "500px",
    overflow: adjustedHeight > window.innerHeight ? "auto" : "hidden",
  };

  const styleHeight = useSpring({
    top: `${adjustedTop}px`,
    height: stages[2]
      ? isActive
        ? `${adjustedHeight + 20}px`
        : `${adjustedHeight + 20}px`
      : toggle[2]
      ? `${adjustedHeight + 20}px`
      : isActive
      ? `${adjustedHeight}px`
      : `${adjustedHeight}px`,
  });

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
  });
  return (
    <InteractiveDiv
      {...utilizeProps}
      style={{ ...Style, ...combinedStyle, ...styleHeight }}
    >
      <RecentPaper
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
        list={utilizeProps.list}
      />
      <PaperData
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
        size={utilizeProps.size}
      />
      <MoreInfoPapers
        isActive={utilizeProps.isActive}
        isHovered={utilizeProps.isHovered}
        ParentRef={utilizeProps.ParentRef}
        ChildRefs={utilizeProps.ChildRefs}
        stages={utilizeProps.stages}
      />
      <div className="div-"></div>
    </InteractiveDiv>
  );
};

export default Papers;
