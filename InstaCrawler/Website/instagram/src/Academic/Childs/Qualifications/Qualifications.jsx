// import React, { useEffect, useState } from "react";
// import { useSpring } from "react-spring";
// import { useUtilize } from "../../Styles/useUtilize";
// import { useSelector } from "react-redux";
// import useScrollPosition from "../../General/useScrollPosition";
// import InteractiveDiv from "../Helper/InteractiveDiv";
// import QualificationMain from "./QualificationMain";
// import { useCombinedAnimation } from "../../Styles/otherStyles";

// function Qualifications() {
//   const componentName = "Qualifications";
//   const utilizeProps = useUtilize(componentName);
//   const [adjustedTop, setAdjustedTop] = useState(0);
//   const [adjustedHeight, setAdjustedHeight] = useState(0);

//   const { id, size, top, isActive, adjustViewport, adjustTop, name } =
//     useUtilize(componentName);
//   const { stages, scollableRef, toggle } = useSelector((state) => state.data);
//   const { scrollTop } = useScrollPosition(scollableRef);

//   const [childHeight, setChildHeight] = useState(size[0]);
//   useEffect(() => {
//     if (
//       utilizeProps.ParentRef.current &&
//       utilizeProps.ParentRef.current.scrollHeight
//     ) {
//       setChildHeight(utilizeProps.ParentRef.current.scrollHeight - 20);
//     }
//   }, []);

//   useEffect(() => {
//     const viewportHeight = window.innerHeight;
//     let newAdjustedTop = top + adjustViewport + (!stages[2] ? adjustTop : 0);
//     let newAdjustedHeight = isActive ? childHeight : size[0];
//     const ModifyTop = 100;

//     if (isActive) {
//       if (
//         newAdjustedTop + newAdjustedHeight >
//         viewportHeight + scrollTop - ModifyTop
//       ) {
//         newAdjustedTop =
//           Math.max(viewportHeight + scrollTop - newAdjustedHeight, scrollTop) -
//           ModifyTop;
//       }
//       if (newAdjustedHeight > viewportHeight) {
//         newAdjustedTop = scrollTop;
//         newAdjustedHeight = viewportHeight;
//       }
//     }
//     setAdjustedTop(newAdjustedTop);
//     setAdjustedHeight(newAdjustedHeight);
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
//     overflow: adjustedHeight > window.innerHeight ? "auto" : "hidden",
//   };

//   const styleHeight = useSpring({
//     top: `${adjustedTop}px`,
//     height: stages[2]
//       ? isActive
//         ? `${adjustedHeight + 20}px`
//         : `${adjustedHeight + 20}px`
//       : toggle[2]
//       ? `${adjustedHeight + 20}px`
//       : isActive
//       ? `${adjustedHeight}px`
//       : `${adjustedHeight}px`,
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

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSpring } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import throttle from "lodash/throttle";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);
  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);
  const adjustedTopRef = useRef(0);
  const adjustedHeightRef = useRef(0);

  const { id, size, top, isActive, adjustViewport, adjustTop, name } =
    utilizeProps;
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const [childHeight, setChildHeight] = useState(size[0]);
  useEffect(() => {
    if (
      utilizeProps.ParentRef.current &&
      utilizeProps.ParentRef.current.scrollHeight
    ) {
      setChildHeight(utilizeProps.ParentRef.current.scrollHeight - 20);
    }
  }, [utilizeProps.ParentRef]);

  const viewportHeight = window.innerHeight;

  const calculateAdjustedValues = useMemo(
    () =>
      throttle(() => {
        let newAdjustedTop =
          top + adjustViewport + (!stages[2] ? adjustTop : 0);
        let newAdjustedHeight = isActive ? childHeight : size[0];
        const ModifyTop = 100;

        if (isActive) {
          if (
            newAdjustedTop + newAdjustedHeight >
            viewportHeight + scrollTop - ModifyTop
          ) {
            newAdjustedTop =
              Math.max(
                viewportHeight + scrollTop - newAdjustedHeight,
                scrollTop
              ) - ModifyTop;
          }
          if (newAdjustedHeight > viewportHeight) {
            newAdjustedTop = scrollTop;
            newAdjustedHeight = viewportHeight;
          }
        }

        adjustedTopRef.current = newAdjustedTop;
        adjustedHeightRef.current = newAdjustedHeight;

        setAdjustedTop(newAdjustedTop);
        setAdjustedHeight(newAdjustedHeight);
      }, 100), // throttling to limit execution to once per 100ms
    [
      top,
      adjustViewport,
      adjustTop,
      childHeight,
      isActive,
      stages,
      viewportHeight,
      scrollTop,
    ]
  );

  useEffect(() => {
    calculateAdjustedValues();
  }, [isActive, calculateAdjustedValues]);

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
    overflow: adjustedHeight > viewportHeight ? "auto" : "hidden",
  };

  const styleHeight = useSpring({
    top: `${adjustedTopRef.current}px`,
    height: stages[2]
      ? isActive
        ? `${adjustedHeightRef.current + 20}px`
        : `${adjustedHeightRef.current + 20}px`
      : toggle[2]
      ? `${adjustedHeightRef.current + 20}px`
      : isActive
      ? `${adjustedHeightRef.current}px`
      : `${adjustedHeightRef.current}px`,
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
        ...Style,
        ...combinedStyle,
        ...styleHeight,
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
