import React from "react";
import { animated } from "react-spring";
import { List } from "./Skills/List";
import { useUtilize } from "./Styles/useUtilize";
import { useClickableContent } from "./useClickableContent";
import SkillsMain from "./Skills/SkillsMain";

const Skills = ({
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  Data,
  MainElementSize,
  Ref,
}) => {
  const setChanged_Height = null;

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
      <SkillsMain
        ChildRefs={ChildRefs}
        styles={styles}
        ParentRef={ParentRef}
        List={List}
        Data={Data}
        CloseOpen={CloseOpen}
        MouseHover={MouseHover}
      />
    </animated.div>
  );
};

export default Skills;
