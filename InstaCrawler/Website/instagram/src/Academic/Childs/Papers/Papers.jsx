import React, { useEffect, useState } from "react";
import MoreInfoPapers from "./MoreInfoPapers";
import PaperData from "./PaperData";
import RecentPaper from "./RecentPaper";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";
import { useSelector } from "react-redux";
import { useSpring, easings } from "react-spring";
import useScrollPosition from "../../General/useScrollPosition";
import { useClickOtherFade } from "../../Styles/otherStyles";

const Papers = () => {
  const componentName = "Published Papers";
  const utilizeProps = useUtilize(componentName);
  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);

  const { size, top, isActive, adjustViewport, adjustTop, adjustHeight, name } =
    useUtilize(componentName);
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const startScroll = top - adjustViewport; // Where you want progress to start
  const endScroll = top - adjustViewport + size[0]; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

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

  const StyleAnim = useSpring({
    from: { opacity: 0, scale: 1.1, y: 20 },
    to: {
      opacity: stages[2] && progress ? 1 - progress : 1,
      y: 0,
      scale: stages[2] && progress ? 1 - (1 - 0.95) * progress : 1,
      filter: stages[2] && `blur(${5 * progress}px)`,
    },
    delay: stages[2] && progress && progress !== 0 ? 0 : 1400,
    config: {
      duration: stages[2] && progress && progress !== 0 ? 0 : 500,
      easing:
        stages[2] && progress && progress !== 0
          ? easings.steps(5)
          : easings.easeInQuad,
    },
  });

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

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    if (toggle[0] && toggle[1] !== name) {
      setOtherActive(true);
    } else {
      setOtherActive(false);
    }
  }, [toggle, name]);
  const StyleAnim2 = useClickOtherFade(otherActive, progress);

  return (
    <InteractiveDiv
      {...utilizeProps}
      style={{ ...Style, ...StyleAnim, ...styleHeight, ...StyleAnim2 }}
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
