import React from "react";
import { animated } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const { list, title, name, ParentRef, styles, titleStyle, MainStyle } =
    useUtilize(componentName);

  return (
    <animated.div
      ref={ParentRef}
      style={styles.base}
      className={name}
      id={name}
    >
      <animated.h1
        style={{ ...titleStyle, marginTop: "-10px", marginLeft: "10px" }}
      >
        {title}
      </animated.h1>
      <animated.div style={MainStyle} className="RInterests">
        {list.map((topic) => (
          <a key={topic.label} href={topic.href}>
            {topic.label}
          </a>
        ))}
      </animated.div>
    </animated.div>
  );
};

export default ResearchInterests;
