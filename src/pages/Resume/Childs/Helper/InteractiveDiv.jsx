import React, { useEffect, useState, useMemo } from "react";
import TitleText from "./useTitleText";
import { useClickableContent } from "../../General/useClickableContent";
import { animated, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import {
  useCombinedAnimation,
} from "../../Styles/otherStyles";
import useElementSize from "../../Styles/useElementSize";
import { useScrollableRef } from "../../General/ScrollableRefContext";
import { useBentoLayout } from "../../Styles/useBentoLayout";

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
    // column prop is passed via props (from useUtilize -> Sections -> RenderComponent)
  } = props;

  // DEBUG: Check values
  // console.log(`[InteractiveDiv] ${name}: col=${props.column}, stages=${JSON.stringify(stages)}`);

  const { stages, toggle } = useSelector((state) => state.data);
  const scollableRef = useScrollableRef();
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
    opacity: 0.1,
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

  const ModifyTop = 90; // Define locally or import constant

  const { activeHeight, notActiveHeight, fullView } = useMemo(() => {
    let fullView = false;
    const viewportHeight = element ? element.clientHeight : window.innerHeight;

    let activeHeight = size[0];
    if (ParentRef?.current?.scrollHeight) {
      // Enforce 10px from bottom rule: Total Height = Viewport - (ModifyTop + 10) (top) - 10px (bottom)
      const calculatedHeight = viewportHeight - (ModifyTop + 10) - 10;
      activeHeight = calculatedHeight > 150 ? calculatedHeight : Math.max(150, viewportHeight - ModifyTop - 10);
      fullView = true;
    }
    const notActiveHeight = size[0];
    return { activeHeight, notActiveHeight, fullView };
  }, [size, ParentRef?.current, element, isActive, marginTop]); // Added marginTop

  // Calculate dynamic blur
  // Starts blurring when component is 50px from the top (offset by menu height approx)
  const blurThreshold = top - 50;
  const scrollDiff = scrollTop - blurThreshold;
  const blurValue = Math.min(5, Math.max(0, scrollDiff / 5));

  // Calculate dynamic opacity (fades out as blur increases)
  // Reaches 0.5 opacity at 25px scroll (synced with max blur)
  const opacityValue = Math.max(0.5, Math.min(1, 1 - scrollDiff / 50));

  const Style = {
    cursor: "pointer",
    // filter removed - handled by combinedStyle
    // backgroundColor removed
    scale: scale,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    marginBottom: stages[1] ? "10px" : "0px",
    overflow: "hidden",
    zIndex: isActive ? 11 : 10,
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
    isActive,
    initial,
    setInitial,
    scrollBlur: blurValue,
    scrollOpacity: opacityValue,
  });

  useEffect(() => {
    if (!initial) return;
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + (!stages[1] ? adjustTop : !stages[2] ? -60 : 0);

    if (isActive) {
      // Align to just below the header (ModifyTop) + 10px padding
      newAdjustedTop = scrollTop + ModifyTop + 10;
    }

    console.log("InteractiveDiv Debug:", { name, isActive, fullView, activeHeight, newAdjustedTop });
    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop, stages, activeHeight, fullView, name]); // Added fullView

  // NEW: Calculate dynamic top/height strings
  const dynamicHeight = isActive
    ? `${activeHeight}px`
    : stages[1]
      ? `${notActiveHeight}px`
      : `${notActiveHeight + adjustHeight}px`;

  const dynamicTop = `${adjustedTop}px`;

  // NEW: Use useBentoLayout for positioning (x, y, w, h)
  const styleHeight = useBentoLayout({
    isActive,
    stages,
    column: props.column,
    size,
    elementSize,
    name,
    top: dynamicTop,
    height: dynamicHeight,
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
