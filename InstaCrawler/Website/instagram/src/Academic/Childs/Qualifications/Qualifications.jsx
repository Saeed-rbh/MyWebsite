// import React from "react";
// import { useSpring, easings } from "react-spring";
// import { useUtilize } from "../../Styles/useUtilize";
// import { useSelector } from "react-redux";
// import useScrollPosition from "../../General/useScrollPosition";
// import InteractiveDiv from "../Helper/InteractiveDiv";
// import QualificationMain from "./QualificationMain";

// function Qualifications() {
//   const componentName = "Qualifications";
//   const utilizeProps = useUtilize(componentName);

//   const { size, top, isActive } = useUtilize(componentName);
//   const { stages, scollableRef, toggle } = useSelector((state) => state.data);
//   const { scrollTop } = useScrollPosition(scollableRef);

//   // Calculate progress between 0 and 30 for smooth transition (0 to 1)
//   const startScroll = top - 60 + 510; // Where you want progress to start
//   const endScroll = top - 60 + size[0] + 510; // Where you want progress to end
//   const progress = Math.min(
//     Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
//     1
//   );

//   const Style = {
//     borderRadius: "40px",
//     cursor: "pointer",
//     filter: "blur(0px)",
//     opacity: "1",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
//     border: "2px solid rgba(212, 157, 129, 0.1)",
//     zIndex: "10",
//     left: stages[2] ? "0px" : "500px",
//     top: stages[2] ? `calc(5vh + ${top + 15 + 510}px)` : `calc(5vh + ${top}px)`,
//     overflow: "hidden",
//   };

//   console.log(toggle[2]);

//   const StyleAnim = useSpring({
//     from: { opacity: 0, scale: 1.1, y: 20 },
//     to: {
//       opacity: stages[2] && progress ? 1 - progress : 1,
//       y: 0,
//       scale: stages[2] && progress ? 1 - (1 - 0.95) * progress : 1,
//       filter: stages[2] && `blur(${5 * progress}px)`,
//     },
//     delay: stages[2] && progress && progress !== 0 ? 0 : 1400,
//     config: {
//       duration: stages[2] && progress && progress !== 0 ? 0 : 500,
//       easing:
//         stages[2] && progress && progress !== 0
//           ? easings.steps(5)
//           : easings.easeInQuad,
//     },
//   });

//   const styleHeight = useSpring({
//     height: stages[2]
//       ? isActive
//         ? `${size[0] + 20 + 250}px`
//         : `${size[0] + 20}px`
//       : toggle[2]
//       ? `${size[0] + 20}px`
//       : isActive
//       ? `${size[0] + 250}px`
//       : `${size[0]}px`,
//   });

//   return (
//     <InteractiveDiv
//       {...utilizeProps}
//       style={{ ...Style, ...StyleAnim, ...styleHeight }}
//     >
//       <QualificationMain
//         ChildRefs={utilizeProps.ChildRefs}
//         styles={utilizeProps.styles}
//         ParentRef={utilizeProps.ParentRef}
//         List={utilizeProps.list}
//         isActive={utilizeProps.isActive}
//         toggle={toggle}
//       />
//     </InteractiveDiv>
//   );
// }

// export default Qualifications;

import React, { useEffect, useState } from "react";
import { useSpring, easings } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";

function Qualifications() {
  const adjustTop = 510;
  const adjustHeight = 250;
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);
  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);

  const { size, top, isActive, adjustViewport } = useUtilize(componentName);
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const startScroll = top - adjustViewport + adjustTop; // Where you want progress to start
  const endScroll = top - adjustViewport + size[0] + adjustTop; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  // Determine viewport dimensions and adjust component position accordingly
  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + adjustTop + adjustViewport;
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
        newAdjustedTop = scrollTop;
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
    border: "2px solid rgba(212, 157, 129, 0.1)",
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

  return (
    <InteractiveDiv
      {...utilizeProps}
      style={{ ...Style, ...StyleAnim, ...styleHeight }}
    >
      <QualificationMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
        toggle={toggle}
      />
    </InteractiveDiv>
  );
}

export default Qualifications;
