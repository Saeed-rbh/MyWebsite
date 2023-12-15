/**
 * Custom hook for calculating general data like width offset and z-index value.
 *
 * @param {Object} data - Data object containing style parameters.
 * @param {Array} toggleState - Array containing toggle state and title.
 * @param {Array} hoverState - Array containing hover state and title.
 * @returns {Object} Object containing calculated widthOffset and zIndexValue.
 */
const useGeneralData = (data, toggleState, hoverState) => {
  const PADDING_OFFSET_FACTOR = 50;
  const ACTIVE_Z_INDEX = "20";
  const DEFAULT_Z_INDEX = "10";

  const [isToggleActive, toggleTitle] = toggleState;
  const [isHoverActive, hoverTitle] = hoverState;

  const [leftPadding, , , rightPadding] = data.padding;

  const widthOffset = leftPadding + rightPadding - PADDING_OFFSET_FACTOR;

  const isTitleMatched = hoverTitle === data.title;

  const zIndexValue =
    isTitleMatched && (isToggleActive || isHoverActive)
      ? ACTIVE_Z_INDEX
      : DEFAULT_Z_INDEX;

  return { widthOffset, zIndexValue };
};

export default useGeneralData;
