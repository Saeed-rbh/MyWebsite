// import React from "react";
// import TeachingMain from "./TeachingMain";
// import { useUtilize } from "../../Styles/useUtilize";
// import InteractiveDiv from "../Helper/InteractiveDiv";

// const componentName = "Teaching";

// const Teaching = () => {
//   const utilizeProps = useUtilize(componentName);

//   return (
//     <InteractiveDiv {...utilizeProps}>
//       <TeachingMain
//         ChildRefs={utilizeProps.ChildRefs}
//         styles={utilizeProps.styles}
//         ParentRef={utilizeProps.ParentRef}
//         List={utilizeProps.list}
//         isActive={utilizeProps.isActive}
//         stages={utilizeProps.stages}
//       />
//     </InteractiveDiv>
//   );
// };

// export default Teaching;

import React, { useEffect, useState } from "react";
import TeachingMain from "./TeachingMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";
import { useSelector } from "react-redux";
import { useSpring, easings } from "react-spring";
import useScrollPosition from "../../General/useScrollPosition";
import { useClickOtherFade } from "../../Styles/otherStyles";

const Teaching = () => {
  const componentName = "Teaching";
  const utilizeProps = useUtilize(componentName);
  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);

  const {
    size,
    top,
    isActive,
    adjustViewport,
    adjustTop,
    adjustHeight,
    name,
    title,
  } = useUtilize(componentName);
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
    borderRadius: "35px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    // width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,

    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2]
      ? "calc((100% + 10px - 5px)/2)"
      : `calc(500px + 10px + (100% - ${size[1] + 100}px)/2)`,
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
    width: stages[2]
      ? isActive
        ? "calc((100% - 5px))"
        : "calc((100% - 20px)/2)"
      : isActive
      ? `calc((100% - ${(size[1] + 100) / 5}px)/2)`
      : `calc((100% - 10px - ${size[1] + 100}px)/2)`,
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
      <TeachingMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
      />
    </InteractiveDiv>
  );
};

export default Teaching;
