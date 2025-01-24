import React, { useEffect, useState, useMemo } from "react";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import {
  useCombinedAnimation,
  ScalableElement,
} from "../../Styles/otherStyles";
import useElementSize from "../../Styles/useElementSize";

const InteractiveDiv = (props) => {
  const {
    id,
    explanation,
    title,
    name,
    background,
    isActive,
    isHovered,
    isClickable,
    TextRef,
    handleClickClose,
    handleMouseUp,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    seqId,
    widthSplit,
    openType,
    size,
    ParentRef,
    top,
    adjustViewport,
    adjustTop,
    adjustHeight,
  } = props;

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const clickableContent = useClickableContent(
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    stages,
    seqId,
    widthSplit,
    openType
  );

  const [scale, setScale] = useState(1);
  const [initial, setInitial] = useState(false);

  const additionalHandleMouseDown = (event) => {
    !isActive && setScale(0.95);
  };

  const combinedHandleMouseDown = (event) => {
    handleMouseDown(event);
    additionalHandleMouseDown(event);
  };

  const additionalHandleMouseUp = (event) => {
    setScale(1);
  };
  const combinedHandleMouseUp = (event) => {
    handleMouseUp(event);
    additionalHandleMouseUp(event);
  };

  const eventHandlers = {
    onMouseUp: combinedHandleMouseUp,
    onMouseDown: combinedHandleMouseDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: combinedHandleMouseDown,
    onTouchEnd: combinedHandleMouseUp,
  };

  const h1Style = useSpring({
    position: "absolute",
    opacity: 0.15,
    fontSize: 100,
    top: isActive ? -50 : -55,
    left: isActive ? -5 : -10,
  });

  const [adjustedTop, setAdjustedTop] = useState(
    top + (!stages[1] ? adjustTop : !stages[2] ? -60 : 0)
  );
  const element = document.getElementById("MoreInfoAcademic");
  const elementSize = useElementSize("MoreInfoAcademic").width;
  const windowHeight = useElementSize("AcademicCV-M").height;
  const marginTop =
    !stages[1] && !stages[2] && windowHeight > 640
      ? (windowHeight - 640) / 2
      : 0;

  const { activeHeight, notActiveHeight, fullView } = useMemo(() => {
    let fullView = false;
    const viewportHeight = element ? element.clientHeight : window.innerHeight;

    let activeHeight = size[0];
    if (ParentRef?.current?.scrollHeight) {
      const parentScrollHeight = ParentRef.current.scrollHeight;

      if (viewportHeight > parentScrollHeight) {
        activeHeight = parentScrollHeight + ParentRef.current.offsetTop + 25;
      } else {
        activeHeight = viewportHeight - 50 - marginTop;
        fullView = true;
      }
    }
    const notActiveHeight = size[0];
    return { activeHeight, notActiveHeight, fullView };
  }, [size, ParentRef?.current, element, isActive]);

  const Style = {
    cursor: "pointer",
    filter: "blur(0px)",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    scale: scale,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    marginBottom: stages[1] ? "10px" : "0px",
    overflow: "hidden",
  };

  useEffect(() => {
    if (!initial) return;
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + (!stages[1] ? adjustTop : !stages[2] ? -60 : 0);
    const ModifyTop = 60;

    console.log("loaded", initial);

    if (isActive) {
      if (!fullView) {
        newAdjustedTop = Math.max(
          Math.min(
            -(activeHeight - (viewportHeight + scrollTop - ModifyTop)),
            newAdjustedTop
          ) -
            marginTop * 1.2,
          scrollTop + ModifyTop
        );
      } else {
        newAdjustedTop = scrollTop + 1.2 * ModifyTop;
      }
    }

    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop, stages, activeHeight]);

  const styleHeight = useSpring({
    width: stages[1]
      ? !isActive && (name === "Teaching" || name === "Awards")
        ? Math.min(elementSize * 0.97, size[1]) / 2 - 5
        : Math.min(elementSize * 0.97, size[1])
      : name === "Skills"
      ? size[1]
      : !isActive && (name === "Teaching" || name === "Awards")
      ? Math.min(elementSize - size[1] - 20, size[1] * 1.5) / 2 - 5
      : Math.min(elementSize - size[1] - 20, size[1] * 1.5),
    left: stages[1]
      ? name === "Awards" && !isActive
        ? (elementSize - Math.min(elementSize * 0.97, size[1])) / 2 +
          Math.min(elementSize * 0.97, size[1]) / 2 +
          5
        : (elementSize - Math.min(elementSize * 0.97, size[1])) / 2
      : name === "Skills"
      ? 0
      : name === "Awards" && !isActive
      ? size[1] +
        15 +
        Math.min(elementSize - size[1] - 20, size[1] * 1.5) / 2 +
        5
      : size[1] + 15,
    borderRadius: isActive ? 40 : Math.max(Math.ceil(size[0] / 4.75), 35),
    top: `${adjustedTop}px`,
    height: isActive
      ? `${activeHeight}px`
      : stages[1]
      ? `${notActiveHeight}px`
      : `${notActiveHeight + adjustHeight}px`,
  });

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    isActive,
    initial,
    setInitial,
  });

  return (
    <animated.div
      className={name}
      id={name}
      style={{
        ...Style,
        ...combinedStyle,
        ...styleHeight,
      }}
      {...eventHandlers}
    >
      {clickableContent}
      <TitleText
        isActive={isActive}
        title={title}
        explanation={explanation}
        widthSplit={widthSplit}
        name={name}
        size={size}
        stages={stages}
      />
      <animated.h1 style={h1Style} ref={TextRef}>
        {title}
      </animated.h1>
      {props.children}
    </animated.div>
  );
};

export default React.memo(InteractiveDiv);
