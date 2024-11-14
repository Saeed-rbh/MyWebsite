import React, { useEffect, useState } from "react";
import { animated, useSpring, easings } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const { list, size, title, name, ParentRef, top } = useUtilize(componentName);

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);

  const { scrollTop } = useScrollPosition(scollableRef);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const startScroll = top - 60; // Where you want progress to start
  const endScroll = top - 60 + size[0]; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    if (toggle[0] && toggle[1] !== name) {
      setOtherActive(true);
    } else {
      setOtherActive(false);
    }
  }, [toggle, name]);

  const style = {
    borderRadius: "40px",
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
    top: stages[2] ? `calc(5vh + ${top + 15}px)` : `calc(5vh + ${top}px)`,
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, scale: 1.1, y: 20 },
    to: {
      opacity: progress ? 1 - progress : 1,
      y: 0,
      scale: progress ? 1 - (1 - 0.95) * progress : 1,
      filter: `blur(${5 * progress}px)`,
    },
    delay: stages[2] && progress && progress !== 0 ? 0 : 1100,
    config: {
      duration: stages[2] && progress && progress !== 0 ? 0 : 500,
      easing:
        stages[2] && progress && progress !== 0
          ? easings.steps(5)
          : easings.easeInQuad,
    },
  });
  const StyleAnim2 = useSpring({
    filter:
      otherActive && progress !== 1 ? "blur(10px)" : `blur(${5 * progress}px)`,
  });

  const Main = {
    padding: stages[2] ? "17px 15px 10px 5px" : "17px 10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: stages[2] ? "space-around" : "flex-start",
    width: "100%",
    height: "100%",
    margin: "7px",
    boxSizing: "border-box",
  };

  return (
    <animated.div
      ref={ParentRef}
      style={{ ...style, ...StyleAnim, ...StyleAnim2 }}
      className={name}
      id={name}
    >
      <animated.h1 style={{ marginTop: "-10px", marginLeft: "10px" }}>
        {title}
      </animated.h1>
      <animated.div className="RInterests" style={Main}>
        {list.slice(0, stages[2] ? 4 : 5).map((topic) => (
          <a key={topic.label} href={topic.href}>
            {topic.label}
          </a>
        ))}
      </animated.div>
    </animated.div>
  );
};

export default ResearchInterests;
