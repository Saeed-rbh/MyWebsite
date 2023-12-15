import React, { useCallback, useRef } from "react";
import { useStyles } from "./useStyles";

export const useUtilize = (
  CloseOpen,
  setCloseOpen,
  MouseHover,
  setMouseHover,
  List,
  Data,
  MainElementSize,
  setChanged_Height
) => {
  const { title, name, background } = Data;

  const isActive = CloseOpen[1] === title && CloseOpen[0];
  const isHovered = MouseHover[1] === title && MouseHover[0];
  const isClickable = List.length > 2;

  const ParentRef = useRef(null);
  const TextRef = useRef(null);
  const ChildRefs = useRef(List.map(() => React.createRef()));

  const handleClickClose = useCallback(() => {
    setCloseOpen([false, title]);
  }, [setCloseOpen, title]);

  const handleClickOpen = useCallback(() => {
    if (!CloseOpen[0] && isClickable) {
      setCloseOpen([true, title]);
    }
  }, [CloseOpen, setCloseOpen, title, isClickable]);

  const handleMouseEnter = useCallback(() => {
    if (!CloseOpen[0] && isClickable) {
      setMouseHover([true, title]);
    }
  }, [CloseOpen, setMouseHover, title, isClickable]);

  const handleMouseLeave = useCallback(() => {
    setMouseHover([false, title]);
  }, [setMouseHover, title]);

  // Assuming useStyles is a custom hook or function you have defined elsewhere
  const styles = useStyles(
    CloseOpen,
    Data,
    MouseHover,
    ChildRefs,
    ParentRef,
    MainElementSize,
    setChanged_Height,
    TextRef
  );

  return {
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
  };
};
