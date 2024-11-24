import React, { useEffect, useState } from "react";
import { animated } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const { id, list, size, title, name, top, adjustViewport, adjustTop } =
    useUtilize(componentName);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);

  const { scrollTop } = useScrollPosition(scollableRef);

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    setOtherActive(toggle[0] && toggle[1] !== name);
  }, [toggle, name]);

  const style = {
    borderRadius: "40px",
    height: stages[2] ? `${size[0] * 2 - 20}px` : `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: stages[1] ? "calc(100% - 5px)" : `${size[1]}px`,
    maxWidth: `${size[1]}px`,

    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[1]
      ? !stages[2]
        ? `${size[1] / 2 + 5}px`
        : `${(window.innerWidth - size[1]) / 2 + 5}px`
      : "0px",
    boxSize: "border-box",
    top: stages[1]
      ? `calc(5vh + ${top}px)`
      : `calc(5vh + ${top + adjustTop}px)`,
  };

  const Main = {
    padding: stages[2] ? "17px 15px 10px 5px" : "11px 10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: stages[1] ? "space-around" : "flex-start",
    width: "100%",
    height: "100%",
    margin: "7px",
    boxSizing: "border-box",
  };

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
  });

  return (
    <animated.div
      ref={ref}
      style={{ ...style, ...combinedStyle }}
      className={name}
      id={name}
    >
      <animated.h1 style={{ marginTop: "-10px", marginLeft: "10px" }}>
        {title}
      </animated.h1>
      <animated.div className="RInterests" style={Main}>
        {list.slice(0, stages[2] ? 4 : 3).map((topic) => (
          <a key={topic.label} href={topic.href}>
            {topic.label}
          </a>
        ))}
      </animated.div>
    </animated.div>
  );
};

export default ResearchInterests;
