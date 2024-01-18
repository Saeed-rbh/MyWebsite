/**
 * Custom hook to calculate the width and left position for an element.
 *
 * @param {Object} params - Parameters for the calculation.
 * @returns {Object} - Object containing the calculated left position and width.
 */
const elementWidthCalculator = ({
  initialRelativeLeft,
  elementSizeWidth,
  widthOffset,
  defaultWidth,
  iniRL,
  stages,
}) => {
  const calculateOffsetWidth = () => {
    if (stages[2]) {
      return 0.87 * elementSizeWidth;
    }
    return [0, 2, 4].includes(iniRL)
      ? 0.38 * elementSizeWidth
      : 0.5 * elementSizeWidth;
  };

  const offsetWidth = calculateOffsetWidth();
  const calculatedWidth = Math.max(offsetWidth - widthOffset, 0);
  const effectiveLeft =
    calculatedWidth < defaultWidth ? 0 : initialRelativeLeft;

  return { left: effectiveLeft, width: calculatedWidth };
};
export default elementWidthCalculator;
