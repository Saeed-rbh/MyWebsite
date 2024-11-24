import React, { useEffect, useState, useMemo } from "react";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import {
  useCombinedAnimation,
  usecalculateAdjustedHeight,
} from "../../Styles/otherStyles";

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

  const eventHandlers = {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleMouseUp,
  };

  const h1Style = useSpring({
    position: "absolute",
    opacity: 0.15,
    fontSize: 100,
    top: isActive ? -50 : -55,
    left: isActive ? -5 : -10,
  });

  const [adjustedTop, setAdjustedTop] = useState(0);
  const { activeHeight, notActiveHeight, fullView } = useMemo(() => {
    return usecalculateAdjustedHeight({
      height: size[0],
      childRef: ParentRef,
    });
  }, [size[0], ParentRef.current]);

  const Style = {
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[1]
      ? name === "Teaching" || name === "Awards"
        ? "calc((100% - 20px)/2)"
        : "calc(100% - 5px)"
      : name === "Skills"
      ? `${size[1]}px`
      : name === "Teaching" || name === "Awards"
      ? `calc((100% - ${size[1] + 20}px) / 2 - 5px)`
      : `calc(100% - ${size[1] + 20}px)`,
    minWidth: stages[1]
      ? name === "Teaching" || name === "Awards"
        ? `calc((100% - ${size[1] + 20}px) / 2 - 5px)`
        : `calc(100% - ${size[1] + 20}px)`
      : name === "Teaching" || name === "Awards"
      ? `${size[1] / 2 - 10}px`
      : `${size[1]}px`,
    maxWidth: stages[1]
      ? name === "Teaching" || name === "Awards"
        ? `${size[1] / 2 - 10}px`
        : `${size[1]}px`
      : "calc(100% - 5px)",
    border: "2px solid rgba(212, 157, 129, 0.2)",
    marginBottom: stages[1] ? "10px" : "0px",
    left: stages[1]
      ? name === "Awards"
        ? "calc((100% + 10px - 5px)/2)"
        : !stages[2]
        ? `${size[1] / 2 + 5}px`
        : `${0}px`
      : name === "Skills"
      ? "0px"
      : name === "Awards"
      ? `calc((100% - ${size[1] + 20}px ) / 2 + 465px + 5px)`
      : "465px",
    overflow: "hidden",
  };

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + (!stages[1] ? adjustTop : !stages[2] ? -60 : 0);
    const ModifyTop = 60;

    if (isActive) {
      if (!fullView) {
        newAdjustedTop = Math.max(
          Math.min(
            -(activeHeight - (viewportHeight + scrollTop - ModifyTop)),
            newAdjustedTop
          ),
          scrollTop + ModifyTop
        );
      } else {
        newAdjustedTop = scrollTop + 1.2 * ModifyTop;
      }
    }

    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop, stages]);

  const styleHeight = useSpring({
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
      />
      <animated.h1 style={h1Style} ref={TextRef}>
        {title}
      </animated.h1>
      <animated.div>{props.children}</animated.div>
    </animated.div>
  );
};

export default React.memo(InteractiveDiv);
