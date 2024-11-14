import React from "react";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";
import { animated, useSpring, easings } from "react-spring";

const InteractiveDiv = (props) => {
  const {
    explanation,
    stages,
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
    MainStyle,
    seqId,
    widthSplit,
    style,
  } = props;

  const clickableContent = useClickableContent(
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    stages,
    seqId,
    widthSplit
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
    opacity: 0.2,
    fontSize: 100,
    top: -55,
    left: -10,
  });

  return (
    <animated.div
      className={name}
      id={name}
      style={{ ...style }}
      {...eventHandlers}
    >
      {clickableContent}
      <TitleText
        isActive={isActive}
        title={title}
        explanation={explanation}
        widthSplit={widthSplit}
      />
      <animated.h1 style={h1Style} ref={TextRef}>
        {title}
      </animated.h1>
      <animated.div style={MainStyle}>{props.children}</animated.div>
    </animated.div>
  );
};

export default React.memo(InteractiveDiv);
