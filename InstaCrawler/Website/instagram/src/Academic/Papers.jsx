import React from "react";
import { animated } from "react-spring";
import MoreInfoPapers from "./Papers/MoreInfoPapers";
import PaperData from "./Papers/PaperData";
import RecentPaper from "./Papers/RecentPaper";
import { useUtilize } from "./Styles/useUtilize";
import { List } from "./Papers/List";
import { useClickableContent } from "./useClickableContent";

const Papers = ({
  Data,
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  MainElementSize,
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

  const ShowclickableContent = true;
  const clickableContent = useClickableContent(
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    ShowclickableContent
  );

  return (
    <>
      <animated.div
        style={styles.base}
        onClick={handleClickOpen}
        className={name}
        id={name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {clickableContent}
        <animated.h1
          ref={TextRef}
          style={styles.text}
          className="MoreInfoTitle"
        >
          {title}
        </animated.h1>

        <RecentPaper isActive={isActive} />
        <PaperData isActive={isActive} />
        <MoreInfoPapers
          isActive={isActive}
          isHovered={isHovered}
          ParentRef={ParentRef}
          ChildRefs={ChildRefs}
        />

        <div className="div-"></div>
      </animated.div>
    </>
  );
};

export default Papers;
