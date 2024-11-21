// import React, { useEffect, useState } from "react";
// import MoreInfoPapers from "./MoreInfoPapers";
// import PaperData from "./PaperData";
// import RecentPaper from "./RecentPaper";
// import { useUtilize } from "../../Styles/useUtilize";
// import InteractiveDiv from "../Helper/InteractiveDiv";
// import { useSelector } from "react-redux";
// import { useSpring, easings } from "react-spring";
// import useScrollPosition from "../../General/useScrollPosition";
// import { useCombinedAnimation } from "../../Styles/otherStyles";

// const Papers = () => {
//   const componentName = "Published Papers";
//   const utilizeProps = useUtilize(componentName);
//   // const [adjustedTop, setAdjustedTop] = useState(0);
//   // const [adjustedHeight, setAdjustedHeight] = useState(0);

//   const {
//     id,
//     size,
//     top,
//     isActive,
//     adjustViewport,
//     adjustTop,
//     adjustHeight,
//     name,
//   } = useUtilize(componentName);
//   const { stages, scollableRef, toggle } = useSelector((state) => state.data);
//   const { scrollTop } = useScrollPosition(scollableRef);

//   const [adjustedTop, setAdjustedTop] = useState(0);
//   const [adjustedHeight, setAdjustedHeight] = useState(size[0]);
//   useEffect(() => {
//     const { adjustedTop, adjustedHeight } = calculateAdjustedPosition({
//       top: top,
//       adjustViewport: adjustViewport,
//       adjustTop: adjustTop,
//       adjustHeight: adjustHeight,
//       stages: stages,
//       isActive: isActive,
//       height: size[0],
//       scrollTop: scrollTop,
//       childRef: utilizeProps.ParentRef,
//     });
//     setAdjustedTop(adjustedTop);
//     setAdjustedHeight(adjustedHeight);
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
//       style={{ ...Style, ...combinedStyle, ...styleHeight }}
//     >
//       <div>
//         <RecentPaper
//           isActive={utilizeProps.isActive}
//           stages={utilizeProps.stages}
//           list={utilizeProps.list}
//         />
//         <PaperData
//           isActive={utilizeProps.isActive}
//           stages={utilizeProps.stages}
//           size={utilizeProps.size}
//         />
//         <MoreInfoPapers
//           isActive={utilizeProps.isActive}
//           isHovered={utilizeProps.isHovered}
//           ParentRef={utilizeProps.ParentRef}
//           ChildRefs={utilizeProps.ChildRefs}
//           stages={utilizeProps.stages}
//         />
//       </div>
//     </InteractiveDiv>
//   );
// };

// export default Papers;
