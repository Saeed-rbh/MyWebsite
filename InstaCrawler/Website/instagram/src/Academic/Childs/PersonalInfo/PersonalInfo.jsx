import React, { useMemo } from "react";
import { animated } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const { id, size, padding, title, name, top, adjustViewport, adjustTop } =
    useUtilize(componentName);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const Style = {
    borderRadius: "40px",
    height: `${size[0]}px`,

    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: stages[1] ? "calc(100% - 5px)" : `${size[1]}px`,
    maxWidth: `${size[1]}px`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[1] ? (!stages[2] ? `${size[1] / 2 + 5}px` : `${0}px`) : "0px",
    top: stages[1]
      ? `calc(5vh + ${top}px)`
      : `calc(5vh + ${top + adjustTop}px)`,
    boxSize: "border-box",
  };

  const Main = {
    padding: "0px 20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    margin: "7px",
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

  const memoizedTitle = useMemo(
    () => <PersonalTitle title={title} size={size} padding={padding} />,
    [title, size, padding]
  );

  return (
    <animated.div
      ref={ref}
      style={{ ...Style, ...combinedStyle }}
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
