import React from "react";
import { animated } from "react-spring";
import { useClickableContent } from "./useClickableContent";
import { List } from "./Awards/List";
import AwardsMain from "./Awards/AwardsMain";
import { useUtilize } from "./Styles/useUtilize";

const Awards = ({
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  Data,
  MainElementSize,
  setChanged_Height,
}) => {
  const {
    title,
    name,
    background,
    isActive,
    isHovered,
    isClickable,
    ParentRef,
    TextRef,
    ChildRefs,
    styles,
    handleClickClose,
    handleClickOpen,
    handleMouseEnter,
    handleMouseLeave,
  } = useUtilize(
    CloseOpen,
    setCloseOpen,
    MouseHover,
    setMouseHover,
    List,
    Data,
    MainElementSize,
    setChanged_Height
  );

  const ShowclickableContent = false;
  const clickableContent = useClickableContent(
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    ShowclickableContent
  );

  return (
    <animated.div
      style={styles.base}
      onClick={handleClickOpen}
      className={name}
      id={name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {clickableContent}
      <animated.h1 ref={TextRef} style={styles.text}>
        {title}
      </animated.h1>
      <AwardsMain
        ChildRefs={ChildRefs}
        styles={styles}
        ParentRef={ParentRef}
        List={List}
      />
    </animated.div>
  );
};

export default Awards;
