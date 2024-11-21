// import React, { useEffect, useState, useMemo } from "react";
// import { useSpring } from "react-spring";
// import { useUtilize } from "../../Styles/useUtilize";
// import { useSelector } from "react-redux";
// import useScrollPosition from "../../General/useScrollPosition";
// import InteractiveDiv from "../Helper/InteractiveDiv";
// import QualificationMain from "./QualificationMain";
// import {
//   useCombinedAnimation,
//   calculateAdjustedHeight,
//   calculateAdjustedTop,
// } from "../../Styles/otherStyles";

// function Qualifications() {
//   const componentName = "Qualifications";
//   const utilizeProps = useUtilize(componentName);

//   const { id, size, top, isActive, adjustViewport, adjustTop, name } =
//     useUtilize(componentName);
//   const { stages, scollableRef, toggle } = useSelector((state) => state.data);
//   const { scrollTop } = useScrollPosition(scollableRef);

//   const [adjustedTop, setAdjustedTop] = useState(0);

//   const viewportHeight = useMemo(() => window.innerHeight, []);
//   const { activeHeight, notActiveHeight } = useMemo(() => {
//     if (utilizeProps?.ParentRef) {
//       return calculateAdjustedHeight({
//         height: size[0],
//         childRef: utilizeProps.ParentRef,
//       });
//     }
//     return null;
//   }, [utilizeProps?.ParentRef?.current, size]);
//   useEffect(() => {
//     const adjustedTop = calculateAdjustedTop({
//       top: top,
//       adjustViewport: adjustViewport,
//       adjustTop: adjustTop,
//       stages: stages,
//       isActive: isActive,
//       scrollTop: scrollTop,
//       newAdjustedHeight: isActive ? activeHeight : notActiveHeight,
//       viewportHeight: viewportHeight,
//     });
//     setAdjustedTop(adjustedTop);
//   }, [isActive]);

//   const Style = {
//     borderRadius: "40px",
//     cursor: "pointer",
//     filter: "blur(0px)",
//     opacity: "1",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
//     border: "2px solid rgba(212, 157, 129, 0.2)",
//     zIndex: "10",
//     left: stages[2] ? "0px" : "500px",
//     overflow: activeHeight > window.innerHeight ? "auto" : "hidden",
//   };

//   const styleHeight = useSpring({
//     top: `${adjustedTop}px`,
//     height: stages[2]
//       ? isActive
//         ? `${activeHeight + 20}px`
//         : `${notActiveHeight + 20}px`
//       : toggle[2]
//       ? `${notActiveHeight + 20}px`
//       : isActive
//       ? `${activeHeight}px`
//       : `${notActiveHeight}px`,
//   });

//   const combinedStyle = useCombinedAnimation({
//     top,
//     adjustViewport,
//     size,
//     scrollTop,
//     toggle,
//     name,
//     id,
//   });
//   return (
//     <InteractiveDiv
//       {...utilizeProps}
//       style={{
//         ...Style,
//         ...combinedStyle,
//         ...styleHeight,
//       }}
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

import React, { useEffect, useState, useMemo } from "react";
import { useSpring } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";
import {
  useCombinedAnimation,
  calculateAdjustedHeight,
  calculateAdjustedTop,
} from "../../Styles/otherStyles";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);
  const { id, size, top, isActive, adjustViewport, adjustTop, name } =
    utilizeProps;

  // Redux State
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);

  // Scroll Position
  const { scrollTop } = useScrollPosition(scollableRef);

  // Adjusted Top State
  const [adjustedTop, setAdjustedTop] = useState(0);

  // Memoized Values
  const viewportHeight = useMemo(() => window.innerHeight, []);
  const { activeHeight, notActiveHeight } = useMemo(() => {
    if (utilizeProps?.ParentRef?.current) {
      return calculateAdjustedHeight({
        height: size[0],
        childRef: utilizeProps.ParentRef,
      });
    }
    return { activeHeight: 0, notActiveHeight: 0 };
  }, [utilizeProps?.ParentRef?.current, size]);

  // Adjusted Top Calculation
  useEffect(() => {
    const newAdjustedTop = calculateAdjustedTop({
      top,
      adjustViewport,
      adjustTop,
      stages,
      isActive,
      scrollTop,
      newAdjustedHeight: isActive ? activeHeight : notActiveHeight,
      viewportHeight,
    });
    setAdjustedTop(newAdjustedTop);
  }, [
    isActive,
    top,
    adjustViewport,
    adjustTop,
    stages,
    scrollTop,
    activeHeight,
    notActiveHeight,
    viewportHeight,
  ]);

  // Styles
  const baseStyle = {
    borderRadius: "40px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2] ? "0px" : "500px",
    overflow: activeHeight > viewportHeight ? "auto" : "hidden",
  };

  const springStyle = useSpring({
    top: `${adjustedTop}px`,
    height: stages[2]
      ? `${(isActive ? activeHeight : notActiveHeight) + 20}px`
      : toggle[2]
      ? `${notActiveHeight + 20}px`
      : isActive
      ? `${activeHeight}px`
      : `${notActiveHeight}px`,
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
      style={{
        ...baseStyle,
        ...combinedStyle,
        ...springStyle,
      }}
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
