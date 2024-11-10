import React, { useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { size, padding, title, name, ParentRef, top } =
    useUtilize(componentName);

  const { stages, scollableRef } = useSelector((state) => state.data);

  const scrollPosition = useScrollPosition(scollableRef);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const progress = Math.min(Math.max(scrollPosition / 20, 0), 1);

  const Style = {
    borderRadius: "30px",
    height: `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: stages[2] ? "calc(100% - 5px)" : `${size[1]}px`,
    border: "2px solid rgba(212, 157, 129, 0.1)",
    zIndex: "10",
    left: stages[2] ? "0px" : "35px",
    top: stages[2] ? `calc(5vh + ${top - 45}px)` : `calc(5vh + ${top}px)`,
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, transform: "scale(1.1)  translateY(20px)" },
    to: {
      opacity: progress < 1 ? 1 : 0,
      transform: "scale(1)  translateY(0px)",
    },
    delay: 500,
    config: { duration: 500 },
  });

  const StyleScroll = useSpring({
    opacity: 1 - progress, // Gradually decrease opacity from 1 to 0
    filter: `blur(${5 * progress}px)`, // Gradually increase blur from 0px to 5px
    scale: 1 - (1 - 0.95) * progress, // Gradually decrease scale from 1 to 0.95
  });

  const Main = {
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "7px",
  };

  const MainAnim = useSpring({
    from: { opacity: 0, transform: "scale(1.1)  translateY(10px)" },
    to: { opacity: 1, transform: "scale(1)  translateY(0px)" },
    delay: 500,
    config: { duration: 500 },
  });

  const memoizedTitle = useMemo(
    () => <PersonalTitle title={title} size={size} padding={padding} />,
    [title, size, padding]
  );

  return (
    <animated.div
      ref={ParentRef}
      style={{ ...Style, ...StyleAnim, ...StyleScroll }}
      className={name}
      id={name}
    >
      {memoizedTitle}
      <PersonalDetails MainStyle={{ ...Main, ...MainAnim }} />
      <ContactDetails MainStyle={{ ...Main, ...MainAnim }} />
    </animated.div>
  );
};

export default PersonalInfo;
