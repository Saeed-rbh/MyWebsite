import { useState, useEffect, useMemo } from "react";
import { useSpring, easings } from "react-spring"; // Or your respective import path
import calculateElementWidth from "./calculateElementWidth"; // Assuming this is an external utility function

/**
 * Custom hook for calculating and returning base styles for an element.
 *
 * @param {Object} data - Data object containing various style parameters.
 * @param {boolean} isActive - Active state of the element.
 * @param {boolean} isHovered - Hover state of the element.
 * @param {Object} mainElementSize - Size of the main element.
 * @param {number} widthOffset - Width offset value.
 * @param {Object} heightVariants - Different height variants.
 * @param {Object} topVariants - Different top position variants.
 * @returns {Object} Spring-based animation styles.
 */

const useBaseStyle = (
  data,
  isActive,
  isHovered,
  mainElementSize,
  widthOffset,
  heightVariants,
  topVariants
) => {
  const { width, iniRL, background, padding, dir } = data;
  const [elementWidth, setElementWidth] = useState(width);

  useEffect(() => {
    if (mainElementSize.width > 0) {
      const newWidth = calculateElementWidth({
        initialRelativeLeft: iniRL,
        elementSizeWidth: mainElementSize.width,
        widthOffset: widthOffset,
        defaultWidth: width,
        direction: dir,
      });
      setElementWidth(newWidth.width);
    }
  }, [mainElementSize.width, iniRL, width, widthOffset, dir]);

  const height = useMemo(() => {
    return isActive
      ? heightVariants.Opened
      : isHovered
      ? heightVariants.Hovered
      : heightVariants.NoAction;
  }, [isActive, isHovered, heightVariants]);

  const top = useMemo(() => {
    return isActive
      ? topVariants.Opened
      : isHovered
      ? topVariants.Hovered
      : topVariants.NoAction;
  }, [isActive, isHovered, topVariants]);

  const baseSpring = useSpring({
    backgroundColor: background,
    overflow: "hidden",
    cursor: isActive ? "default" : "pointer",
    width: `${elementWidth}px`,
    minWidth: width,
    height: `${height}px`,
    top: `${top}px`,
    padding: `${padding[0]}px ${padding[1]}px ${
      isActive ? "80px" : `${padding[2]}px`
    } ${padding[3]}px`,
    left: data.dir === "L" ? `auto` : `${iniRL}%`,
    right: data.dir === "R" ? `auto` : `${iniRL}%`,

    easing: easings.easeOutCubic,
  });

  return baseSpring;
};

export default useBaseStyle;
