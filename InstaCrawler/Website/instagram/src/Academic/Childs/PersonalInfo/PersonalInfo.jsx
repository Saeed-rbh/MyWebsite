import React, { useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { size, padding, title, name, ParentRef } = useUtilize(componentName);

  const Style = {
    borderRadius: "40px",
    height: 100,
    padding: 15,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: window.innerWidth <= 768 ? "calc(100% - 30px)" : "420px",
    zIndex: "10",
    left: window.innerWidth <= 768 ? "0" : "35px",
    top: window.innerWidth <= 768 ? "calc(5vh + 100px)" : "calc(5vh + 150px)",
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
