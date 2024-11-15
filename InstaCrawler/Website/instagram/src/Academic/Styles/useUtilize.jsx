import React, { useCallback, useRef, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateToggle, updateHover } from "../../actions/Actions";
import { useStyles } from "./useStyles";
import { useTitleAnimationStyle } from "./otherStyles";

export const useUtilize = (componentName) => {
  const data = useSelector(
    (state) =>
      state.data.academicData.find((item) => item.name === componentName),
    shallowEqual
  );

  const updateVariables = useSelector((state) => state.data);
  const stages = updateVariables.stages;
  const toggle = updateVariables.toggle;
  const hover = updateVariables.hover;

  const dispatch = useDispatch();
  const setToggle = useCallback(
    (newToggle) => {
      dispatch(updateToggle(newToggle));
    },
    [dispatch]
  );
  const setHover = useCallback(
    (newHover) => {
      dispatch(updateHover(newHover));
    },
    [dispatch]
  );

  const {
    explanation,
    height,
    top,
    rand,
    size,
    padding,
    list,
    title,
    name,
    fixed,
    background,
    seqId,
    widthSplit,
    adjustTop,
    adjustHeight,
    adjustViewport,
  } = data;

  const isActive = useMemo(() => {
    return toggle[0] && toggle[1] === title;
  }, [toggle, title]);

  const isHovered = useMemo(
    () => hover[1] === title && hover[0] && !stages[2],
    [hover, title, stages]
  );

  const ParentRef = useRef(null);
  const TextRef = useRef(null);
  const isClickable = useMemo(() => list.length > 2, [list]);
  const ChildRefs = useRef(list.map(() => React.createRef()));

  const handleClickClose = useCallback(() => {
    setToggle([false, title, false]);
  }, [setToggle, title]);

  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const handleMouseUp = useCallback(
    (event) => {
      if (event.changedTouches && !toggle[0] && isClickable) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const dx = touchEndX - touchStartPos.x;
        const dy = touchEndY - touchStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scrollThreshold = 10;

        if (distance < scrollThreshold) {
          setToggle([true, title, false]);
        } else {
          setToggle([false, title, false]);
        }
      } else {
        setToggle([true, title, false]);
      }
    },
    [touchStartPos, toggle, setToggle, title, isClickable]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (event.touches && !toggle[0] && isClickable) {
        setTouchStartPos({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
      }
      !toggle[0] && setToggle([false, title, true]);
    },
    [toggle, setToggle, title, isClickable]
  );

  const handleMouseEnter = useCallback(() => {
    if (!toggle[0] && isClickable) {
      setHover([true, title]);
    }
  }, [toggle, setHover, title, isClickable]);

  const handleMouseLeave = useCallback(() => {
    setHover([false, title]);
  }, [setHover, title]);

  const styles = useStyles(toggle, data, hover, ChildRefs, stages);
  const { MainStyle, titleStyle } = useTitleAnimationStyle(seqId, fixed);

  return {
    list,
    seqId,
    explanation,
    height,
    top,
    rand,
    size,
    adjustTop,
    adjustHeight,
    padding,
    stages,
    title,
    name,
    toggle,
    background,
    isActive,
    isHovered,
    isClickable,
    ParentRef,
    TextRef,
    ChildRefs,
    widthSplit,
    handleClickClose,
    handleMouseUp,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    styles,
    titleStyle,
    MainStyle,
    adjustViewport,
  };
};
