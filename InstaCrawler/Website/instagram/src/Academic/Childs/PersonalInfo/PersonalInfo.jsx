import React, { useEffect, useMemo, useState } from "react";
import { animated, useSpring, easings } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { size, padding, title, name, ParentRef, top, adjustViewport } =
    useUtilize(componentName);

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);

  const { scrollTop } = useScrollPosition(scollableRef);

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    if (toggle[0] && toggle[1] !== name) {
      setOtherActive(true);
    } else {
      setOtherActive(false);
    }
  }, [toggle, name]);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const startScroll = top - adjustViewport; // Where you want progress to start
  const endScroll = top - adjustViewport + size[0]; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const Style = {
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
    },
    delay: stages[2] && progress && progress !== 0 ? 0 : 500,
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
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "7px",
  };

  const memoizedTitle = useMemo(
    () => <PersonalTitle title={title} size={size} padding={padding} />,
    [title, size, padding]
  );

  return (
    <animated.div
      ref={ParentRef}
      style={{ ...Style, ...StyleAnim, ...StyleAnim2 }}
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
