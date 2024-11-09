import React, { useMemo } from "react";
import { animated } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { size, padding, title, name, ParentRef } = useUtilize(componentName);

  const Style1 = {
    borderRadius: "40px",
    height: 100,
    padding: 15,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: "420px",
    zIndex: "10",
    transform: "none",
    left: "35px",
    top: "100px",
  };

  const MainStyle = {
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "5px",
  };

  const memoizedTitle = useMemo(
    () => <PersonalTitle title={title} size={size} padding={padding} />,
    [title, size, padding]
  );

  return (
    <animated.div ref={ParentRef} style={Style1} className={name} id={name}>
      {memoizedTitle}
      <PersonalDetails MainStyle={MainStyle} />
      <ContactDetails MainStyle={MainStyle} />
    </animated.div>
  );
};

export default PersonalInfo;
