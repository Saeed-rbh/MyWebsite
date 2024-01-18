import React, { memo } from "react";
import { animated } from "react-spring";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";

const InteractiveDiv = memo((props) => {
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
    styles,
    titleStyle,
    handleClickClose,
    handleMouseUp,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    MainStyle,
    seqId,
  } = props;

  const clickableContent = useClickableContent(
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    stages,
    seqId
  );

  const eventHandlers = {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleMouseUp,
  };

  return (
    <animated.div
      className={name}
      id={name}
      style={styles.base}
      {...eventHandlers}
    >
      {clickableContent}
      <TitleText
        isActive={isActive}
        title={title}
        explanation={explanation}
        titleStyle={titleStyle}
      />
      <animated.h1 ref={TextRef} style={styles.text}>
        {title}
      </animated.h1>
      <animated.div style={MainStyle}>{props.children}</animated.div>
    </animated.div>
  );
});

export default InteractiveDiv;
