/**
 * Calculates the width and left position for an element based on its relative position, size, and offset.
 *
 * @param {number} initialRelativeLeft - The initial relative left position in percentage.
 * @param {number} elementSizeWidth - The width of the main element.
 * @param {number} widthOffset - The offset to be applied to the width.
 * @param {number} defaultWidth - The default width of the element.
 * @param {string} direction - The default direction of the element.
 * @returns {Object} An object containing the calculated left position and width.
 */
const calculateElementWidth = ({
  initialRelativeLeft,
  elementSizeWidth,
  widthOffset,
  defaultWidth,
  direction,
}) => {
  const offsetWidth =
    direction === "L"
      ? ((96 - initialRelativeLeft) / 100) * elementSizeWidth
      : (initialRelativeLeft / 100) * elementSizeWidth;

  const calculatedWidth = offsetWidth - widthOffset;
  const effectiveWidth = Math.max(calculatedWidth, defaultWidth);

  const effectiveLeft =
    calculatedWidth < defaultWidth ? 0 : initialRelativeLeft;

  return {
    left: effectiveLeft,
    width: effectiveWidth,
  };
};

export default calculateElementWidth;
