/**
 * Custom hook to determine active and hovered states based on toggle and hover information.
 *
 * @param {Object} data - Data object containing the title to match against.
 * @param {Array} toggleState - Array containing the toggle active state and title.
 * @param {Array} hoverState - Array containing the hover active state and title.
 * @returns {Object} An object containing the `isActive` and `isHovered` boolean flags.
 */
const activeHover = (title, toggleState, hoverState) => {
  const [isToggleActive, toggleTitle] = toggleState;
  const [isHoverActive, hoverTitle] = hoverState;

  const isActive = isToggleActive && toggleTitle === title;
  const isHovered = isHoverActive && hoverTitle === title;
  const otherHovered = isHoverActive && hoverTitle !== title;
  const otherActive = isToggleActive && toggleTitle !== title;

  return { isActive, isHovered, otherActive, otherHovered };
};

export default activeHover;
