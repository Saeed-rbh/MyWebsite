import React, { useMemo } from "react";
import { animated } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const {
    size,
    padding,
    title,
    name,
    ParentRef,
    styles,
    titleStyle,
    MainStyle,
  } = useUtilize(componentName);

  const memoizedTitle = useMemo(
    () => (
      <PersonalTitle
        title={title}
        size={size}
        padding={padding}
        style={titleStyle}
      />
    ),
    [title, size, padding, titleStyle]
  );

  return (
    <animated.div
      ref={ParentRef}
      style={styles.base}
      className={name}
      id={name}
    >
      {memoizedTitle}
      <PersonalDetails MainStyle={MainStyle} />
      <ContactDetails MainStyle={MainStyle} />
    </animated.div>
  );
};

export default PersonalInfo;
