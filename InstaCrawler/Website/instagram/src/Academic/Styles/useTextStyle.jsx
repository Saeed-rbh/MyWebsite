import { useSpring } from "react-spring";
import { useState, useEffect } from "react";

/**
 * Custom hook to calculate and return text styles based on the active state and component dimensions.
 *
 * @param {Object} data - Data object containing dimensions and padding information.
 * @param {boolean} isActive - Active state for style adjustment.
 * @param {React.RefObject} textRef - Reference to the text element.
 * @returns {Object} Spring-based animation styles for text.
 */
const useTextStyle = (data, isActive, textRef, ParentRef) => {
  const [maxFontSize, setMaxFontSize] = useState(110);
  const [lineHeightFactor, setLineHeightFactor] = useState(1);
  useEffect(() => {
    if (
      textRef.current &&
      ParentRef.current.offsetWidth - data.padding[3] <
        textRef.current.offsetWidth
    ) {
      setTimeout(() => {
        const scaleFactor = 110;
        const newFontSize =
          ((ParentRef.current.offsetWidth - data.padding[3]) /
            textRef.current.offsetWidth) *
          scaleFactor;
        setMaxFontSize(newFontSize);
        setLineHeightFactor(70 / newFontSize);
      }, 500);
    }
  }, [data.width, data.padding, textRef, ParentRef]);
  const scaleFactorActive = 0.9;
  const calculateFontSize = () =>
    isActive ? maxFontSize * scaleFactorActive : maxFontSize;

  const calculateLineHeight = () =>
    isActive ? maxFontSize * scaleFactorActive * lineHeightFactor : maxFontSize;

  const fontSize = useSpring({
    background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
    webkitBackgroundClip: "text",
    fontSize: `${calculateFontSize()}px`,
    lineHeight: `${calculateLineHeight()}px`,
    opacity: isActive ? 0.5 : 0.2,
    left: "25px",
  });

  return fontSize;
};

export default useTextStyle;
