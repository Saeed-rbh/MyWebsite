import React, { useMemo, useState } from "react";
import { animated } from "react-spring";
import { ContactDetails, PersonalTitle, PersonalDetails } from "./ExternalLink";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";
import useElementSize from "../../Styles/useElementSize";
import { useScrollableRef } from "../../General/ScrollableRefContext";

export const PersonalInfo = () => {
  const componentName = "PersonalInfo";
  const {
    id,
    size,
    padding,
    title,
    name,
    top,
    adjustViewport,
    adjustTop,
    isActive,
    list
  } = useUtilize(componentName);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const elementSize = useElementSize("MoreInfoAcademic").width;
  const { stages, toggle } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollTop } = useScrollPosition(scrollableRef);

  const Style = {
    borderRadius: "40px",
    height: `${size[0]}px`,

    cursor: "default",
    filter: "blur(0px)",
    opacity: "1",
    // backgroundColor removed
    overflow: "visible",
    width: stages[1] ? Math.min(elementSize * 0.97, size[1]) : size[1],
    left: stages[1]
      ? (elementSize - Math.min(elementSize * 0.97, size[1])) / 2
      : 0,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    top: stages[1] ? top : top + adjustTop,
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
  const [initial, setInitial] = useState(false);
  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
    isActive,
    initial,
    setInitial,
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
      <PersonalDetails MainStyle={{ ...Main }} info={list ? list[0] : null} />
      <ContactDetails MainStyle={{ ...Main }} info={list ? list[0] : null} />
    </animated.div>
  );
};

export default PersonalInfo;
