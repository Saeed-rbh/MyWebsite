import React, { useCallback, useRef, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateToggle, updateHover } from "../../actions/Actions";

export const useUtilize = (componentName) => {
  const data = useSelector(
    (state) =>
      state.data.academicData.find(
        (item) => item.name === componentName || item.title === componentName
      ),
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
    id,
    explanation,
    height,
    top,
    size,
    padding,
    list,
    title,
    name,
    background,
    seqId,
    widthSplit,
    adjustTop,
    adjustHeight,
    adjustViewport,
    // openType,
  } = data;

  const isActive = useMemo(() => {
    return toggle[0] && toggle[1] === name;
  }, [toggle, name]);

  const isHovered = useMemo(
    () => hover[1] === title && hover[0] && !stages[2],
    [hover, title, stages]
  );

  const ParentRef = useRef(null);
  const TextRef = useRef(null);
  const isClickable = useMemo(() => list.length > 2, [list]);
  const ChildRefs = useRef(list.map(() => React.createRef()));

  const handleClickClose = useCallback(() => {
    setToggle([false, name, false]);
  }, [setToggle, name]);

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
          !toggle[0] && setToggle([true, name, false]);
        } else {
          setToggle([false, name, false]);
        }
      } else {
        !toggle[0] && setToggle([true, name, false]);
      }
    },
    [touchStartPos, toggle, setToggle, name, isClickable]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (event.touches && !toggle[0] && isClickable) {
        setTouchStartPos({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
      }
      !toggle[0] && setToggle([false, name, true]);
    },
    [toggle, setToggle, name, isClickable]
  );

  const handleMouseEnter = useCallback(() => {
    if (!toggle[0] && isClickable) {
      setHover([true, title]);
    }
  }, [toggle, setHover, title, isClickable]);

  const handleMouseLeave = useCallback(() => {
    setHover([false, title]);
  }, [setHover, title]);

  return {
    id,
    list,
    seqId,
    explanation,
    height,
    top,
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
    adjustViewport,
    // openType,
  };
};
