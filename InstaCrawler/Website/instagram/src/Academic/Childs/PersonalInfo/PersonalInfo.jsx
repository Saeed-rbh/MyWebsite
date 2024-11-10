import React, { useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { size, padding, title, name, ParentRef, top } =
    useUtilize(componentName);
  const stages = useSelector((state) => state.data.stages);

  const Style = {
    borderRadius: "30px",
    height: `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(250, 250, 250, 0.05)",
    overflow: "visible",
    width: stages[2] ? "calc(100% - 5px)" : `${size[1]}px`,
    zIndex: "10",
    left: stages[2] ? "0px" : "35px",
    top: stages[2] ? `calc(5vh + ${top - 40}px)` : `calc(5vh + ${top}px)`,
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, transform: "scale(1.1)  translateY(20px)" },
    to: { opacity: 1, transform: "scale(1)  translateY(0px)" },
    delay: 500,
    config: { duration: 500 },
  });

  const Main = {
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "5px",
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
      style={{ ...Style, ...StyleAnim }}
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
