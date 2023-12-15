import { useSpring, easings } from "react-spring";

/**
 * Custom hook for generating spring-based styles for titles.
 *
 * @param {boolean} isActive - Determines the style state of the title.
 * @returns {Object} Spring-based animation styles.
 */
const useTitleStyle = (isActive) => {
  const ACTIVE_Y = 50;
  const INACTIVE_Y = 15;

  return useSpring({
    y: isActive ? ACTIVE_Y : INACTIVE_Y,
    easing: easings.easeOutCubic,
  });
};

export default useTitleStyle;
