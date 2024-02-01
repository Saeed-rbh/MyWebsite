/**
 * Custom hook to calculate the width and left position for an element.
 *
 * @param {Object} params - Parameters for the calculation.
 * @returns {Object} - Object containing the calculated left position and width.
 */
const elementWidthCalculator = ({
  elementSizeWidth,
  padding,
  stages,
  widthSplit,
  iniRL,
}) => {
  const initialRelativeLeft =
    iniRL === 0
      ? 0
      : iniRL === 1
      ? 45
      : iniRL === 2
      ? 102
      : iniRL === 3
      ? 160
      : 220;

  const [, leftPadding, , rightPadding] = padding;
  const widthOffset = leftPadding + rightPadding;
  const calculateOffsetWidth = () => {
    const MoreInfoAcademic = document.getElementById("MoreInfoAcademic");
    if ((MoreInfoAcademic && stages[2]) || stages[3]) {
      return MoreInfoAcademic.offsetWidth;
    }
    return [0, 2, 4].includes(iniRL)
      ? 0.38 * elementSizeWidth
      : 0.5 * elementSizeWidth;
  };
  const offsetWidth = calculateOffsetWidth();
  const calculatedWidth = Math.max(offsetWidth - widthOffset, 0);
  const effectiveLeft = calculatedWidth < widthOffset ? 0 : initialRelativeLeft;
  return {
    left: effectiveLeft,
    width: widthSplit
      ? [calculatedWidth / 2 - 25, calculatedWidth]
      : [calculatedWidth, calculatedWidth],
  };
};
export default elementWidthCalculator;
