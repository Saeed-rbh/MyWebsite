// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { animated, useSpring, easings } from "react-spring";
// import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
// import { useUtilize } from "../../Styles/useUtilize";
// import { useSelector } from "react-redux";
// import useScrollPosition from "../../General/useScrollPosition";
// import { useClickOtherFade } from "../../Styles/otherStyles";

// export const PersonalInfo = () => {
//   const Loaded = useRef(false);
//   const componentName = "PersonalInfo";
//   const {
//     size,
//     padding,
//     title,
//     name,
//     ParentRef,
//     top,
//     adjustViewport,
//     adjustTop,
//   } = useUtilize(componentName);

//   const { stages, scollableRef, toggle } = useSelector((state) => state.data);

//   const { scrollTop } = useScrollPosition(scollableRef);

//   const [otherActive, setOtherActive] = useState(false);
//   useEffect(() => {
//     if (toggle[0] && toggle[1] !== name) {
//       setOtherActive(true);
//     } else {
//       setOtherActive(false);
//     }
//   }, [toggle, name]);

//   // Calculate progress between 0 and 30 for smooth transition (0 to 1)
//   const startScroll = top - adjustViewport; // Where you want progress to start
//   const endScroll = top - adjustViewport + size[0]; // Where you want progress to end
//   const progress = Math.min(
//     Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
//     1
//   );

//   const Style = {
//     borderRadius: "40px",
//     height: `${size[0]}px`,
//     cursor: "pointer",
//     filter: "blur(0px)",
//     opacity: "1",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     overflow: "visible",
//     width: stages[2] ? "calc(100% - 5px)" : `${size[1]}px`,
//     border: "2px solid rgba(212, 157, 129, 0.2)",
//     zIndex: "10",
//     left: stages[2] ? "0px" : "35px",
//     top: stages[2]
//       ? `calc(5vh + ${top + 15}px)`
//       : `calc(5vh + ${top + adjustTop}px)`,
//   };

//   const StyleAnim = useSpring({
//     from: { opacity: 0, scale: 1.1, y: 20 },
//     to: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//     },
//     delay: 500,
//     config: {
//       duration: 500,
//       easing: easings.easeInQuad,
//     },
//     onRest: () => {
//       Loaded.current = true;
//     },
//   });

//   const StyleAnim3 = useSpring({
//     opacity: 1 - progress,
//     y: 0,
//     scale: 1 - (1 - 0.95) * progress,
//   });

//   console.log("Loaded", Loaded.current);

//   const StyleAnim2 = useClickOtherFade(otherActive, progress);

//   const Main = {
//     padding: "0px 20px",
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     width: "100%",
//     margin: "7px",
//   };

//   const memoizedTitle = useMemo(
//     () => <PersonalTitle title={title} size={size} padding={padding} />,
//     [title, size, padding]
//   );

//   return (
//     <animated.div
//       ref={ParentRef}
//       style={{ ...Style, ...StyleAnim, ...StyleAnim2, Loaded.current&&...StyleAnim3 }}
//       className={name}
//       id={name}
//     >
//       {memoizedTitle}
//       <PersonalDetails MainStyle={{ ...Main }} />
//       <ContactDetails MainStyle={{ ...Main }} />
//     </animated.div>
//   );
// };

// export default PersonalInfo;

import React, { useMemo } from "react";
import { animated } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const {
    id,
    size,
    padding,
    title,
    name,
    ParentRef,
    top,
    adjustViewport,
    adjustTop,
  } = useUtilize(componentName);

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const Style = {
    borderRadius: "40px",
    height: `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: stages[2] ? "calc(100% - 5px)" : `${size[1]}px`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2] ? "0px" : "35px",
    top: stages[2]
      ? `calc(5vh + ${top + 15}px)`
      : `calc(5vh + ${top + adjustTop}px)`,
  };

  const Main = {
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "7px",
  };

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
  });

  const memoizedTitle = useMemo(
    () => <PersonalTitle title={title} size={size} padding={padding} />,
    [title, size, padding]
  );

  return (
    <animated.div
      ref={ParentRef}
      style={{ ...Style, ...combinedStyle }}
      className={name}
      id={name}
    >
      {memoizedTitle}
      <PersonalDetails MainStyle={{ ...Main }} />
      <ContactDetails MainStyle={{ ...Main }} />
    </animated.div>
  );
};

export default PersonalInfo;
