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
    const background = "#6f3c2221";

    return (
      <>
        <CloseIcon
          isOpen={true}
          Test={"Close"}
          CloseOpen={isActive}
          handleClickClose={handleClickClose}
          backgroundColor={background}
        />

        <MoreInfo
          CloseOpen={isActive}
          MouseHover={isHovered}
          Show={false}
          backgroundColor={background}
          Stages={stages}
        />

        <OpenIcon
          isOpen={true}
          CloseOpen={isActive}
          handleClickClose={handleClickClose}
          backgroundColor={background}
          seqId={seqId}
          widthSplit={widthSplit}
        />
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
