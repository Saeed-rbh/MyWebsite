import React, { useMemo } from "react";
import CloseIcon from "./CloseIcon";
import MoreInfo from "./MoreInfo";
import OpenIcon from "./OpenIcon";

export const useClickableContent = (
  isClickable,
  isActive,
  handleClickClose,
  isHovered,
  background,
  stages,
  seqId,
  widthSplit
) => {
  const ClickableContent = useMemo(() => {
    if (!isClickable) return null;

    return (
      <>
        <CloseIcon
          isOpen={true}
          Test={"Close"}
          CloseOpen={isActive}
          handleClickClose={handleClickClose}
          backgroundColor={background}
        />
        {!stages[2] && (
          <MoreInfo
            CloseOpen={isActive}
            MouseHover={isHovered}
            Show={false}
            backgroundColor={background}
            Stages={stages}
          />
        )}
        {(stages[2] || stages[3]) && (
          <OpenIcon
            isOpen={true}
            CloseOpen={isActive}
            handleClickClose={handleClickClose}
            backgroundColor={background}
            seqId={seqId}
            widthSplit={widthSplit}
          />
        )}
      </>
    );
  }, [
    isClickable,
    isActive,
    handleClickClose,
    isHovered,
    background,
    stages,
    seqId,
  ]);

  return ClickableContent;
};
