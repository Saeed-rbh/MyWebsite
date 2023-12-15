import React from "react";
import OpenIcon from "./OpenIcon";
import MoreInfo from "./MoreInfo";

export const useClickableContent = (
  isClickable,
  isActive,
  handleClickClose,
  isHovered,
  background,
  Show
) => {
  const ClickableContent = isClickable ? (
    <>
      <OpenIcon
        isOpen={true}
        Test={"Close"}
        CloseOpen={isActive}
        handleClickClose={handleClickClose}
        backgroundColor={background}
      />
      <MoreInfo
        CloseOpen={isActive}
        MouseHover={isHovered}
        Show={Show}
        backgroundColor={background}
      />
    </>
  ) : null;

  return ClickableContent;
};
