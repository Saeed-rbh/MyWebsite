import { useState, useMemo } from "react";
import { useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useScrollFade from "./useScrollFade";

const useBaseStyle = (
  data,
  isActive,
  isHovered,
  otherActive,
  heights,
  tops,
  widths,
  stages
) => {
  const { visibility } = useSelector((state) => state.visibility);
  const { toggle, hover } = useSelector((state) => state.data);

  const [animationFinished, setAnimationFinished] = useState(false);

  const isClicked = useMemo(
    () => toggle[0] && toggle[1] === data.title,
    [toggle, data.title]
  );
  const zIndex = useMemo(
    () => (isClicked || isHovered ? "20" : "10"),
    [isClicked, isHovered]
  );
  const cursorStyle = useMemo(
    () => (isActive ? "none" : "pointer"),
    [isActive]
  );

  const blurValue = useMemo(() => {
    if (toggle[0] && !isActive) return "blur(10px)";
    if (hover[0] && !stages[2] && !isHovered) return "blur(5px)";
    return "blur(0px)";
  }, [toggle, hover, stages, isActive, isHovered]);

  const opacity = useScrollFade(data, isActive, otherActive);
  const isTrigger = useMemo(
    () => toggle[2] && toggle[1] === data.title,
    [toggle, data.title]
  );

  const combinedStyles = useMemo(() => {
    const height =
      isActive && !isTrigger
        ? heights.Opened
        : isHovered && !stages[2]
        ? heights.Hovered
        : heights.NoAction;
    const top = isActive
      ? tops.Opened
      : isHovered && !stages[2]
      ? tops.Hovered
      : tops.NoAction;
    const scale = visibility ? (otherActive ? 0.9 : 1) : 1.5;
    const opacityValue = isActive ? 1 : visibility ? opacity : 0;

    return {
      height: `${height}px`,
      top: `${top}px`,
      cursor: cursorStyle,
      Filter: blurValue,
      WebkitFilter: blurValue,
      scale,
      opacity: opacityValue,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      overflow: data.fixed ? "visible" : "hidden",
      width: `${widths}px`,
      padding: `${data.padding[0]}px ${data.padding[1]}px ${
        isActive ? "80px" : `${data.padding[2]}px`
      } ${data.padding[3]}px`,
    };
  }, [
    isActive,
    isHovered,
    heights,
    tops,
    stages,
    cursorStyle,
    blurValue,
    visibility,
    otherActive,
    data,
    opacity,
    widths,
    isTrigger,
  ]);

  const baseStyles = useSpring({
    ...combinedStyles,
    from: { opacity: 0, scale: 1.5 },
    delay: animationFinished ? 0 : 1200 + 200 * data.seqId,
    config: { duration: animationFinished ? undefined : 800 },
    onRest: () => setAnimationFinished(true),
  });

  return { ...baseStyles, zIndex };
};

export default useBaseStyle;
