/**
 * Custom hook to determine active and hovered states based on toggle and hover information.
 *
 * @param {Object} data - Data object containing the title to match against.
 * @param {Array} toggleState - Array containing the toggle active state and title.
 * @param {Array} hoverState - Array containing the hover active state and title.
 * @returns {Object} An object containing the `isActive` and `isHovered` boolean flags.
 */
const useActiveHover = (data, toggleState, hoverState) => {
  const [isToggleActive, toggleTitle] = toggleState;
  const [isHoverActive, hoverTitle] = hoverState;

  const isActive = isToggleActive && toggleTitle === data.title;
  const isHovered = isHoverActive && hoverTitle === data.title;

  return { isActive, isHovered };
};

export default useActiveHover;
