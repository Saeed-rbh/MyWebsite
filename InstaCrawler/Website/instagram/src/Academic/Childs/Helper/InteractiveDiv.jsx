import React, { useEffect, useState, useMemo } from "react";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import {
  useCombinedAnimation,
  calculateAdjustedHeight,
} from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";

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

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const [adjustedTop, setAdjustedTop] = useState(0);
  const { activeHeight, notActiveHeight } = useMemo(() => {
    return calculateAdjustedHeight({
      height: size[0],
      childRef: ParentRef,
    });
  }, [size[0], ParentRef.current]);

  console.log(notActiveHeight, activeHeight);

  const Style = {
    borderRadius: "40px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2] ? "0px" : "500px",
    overflow: activeHeight > window.innerHeight ? "auto" : "hidden",
  };

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + adjustViewport + (!stages[2] ? adjustTop : 0);
    const ModifyTop = 80;

    if (isActive) {
      if (
        newAdjustedTop + activeHeight >
        viewportHeight + scrollTop - ModifyTop
      ) {
        newAdjustedTop =
          Math.max(viewportHeight + scrollTop - activeHeight, scrollTop) -
          ModifyTop;
      }
      if (activeHeight > viewportHeight) {
        newAdjustedTop = scrollTop + ModifyTop;
      }
    }

    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop]);

  const styleHeight = useSpring({
    top: `${adjustedTop}px`,
    height: isActive ? `${activeHeight}px` : `${notActiveHeight}px`,
  });

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
      className={name}
      id={name}
      style={{
        ...Style,
        ...combinedStyle,
        ...styleHeight,
      }}
      {...eventHandlers}
      ref={ref}
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
      <animated.div>{props.children}</animated.div>
    </animated.div>
  );
};

export default React.memo(InteractiveDiv);
