import React from "react";
import { animated } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const { list, title, name, ParentRef } = useUtilize(componentName);

  const styles = {
    borderRadius: "40px",
    height: 100,
    padding: "18px 15px 12px 15px",
    top: "400px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: "420px",
    zIndex: 10,
    transform: "none",
    left: 35,
    justifyContent: "center",
  };
  return (
    <animated.div ref={ParentRef} style={styles} className={name} id={name}>
      <animated.h1 style={{ marginTop: "-10px", marginLeft: "10px" }}>
        {title}
      </animated.h1>
      <animated.div className="RInterests">
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
