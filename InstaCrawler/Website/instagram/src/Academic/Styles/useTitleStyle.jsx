import { useSpring } from "react-spring";

/**
 * Custom hook for generating spring-based styles for titles.
 *
 * @param {boolean} isActive - Determines the style state of the title.
 * @returns {Object} Spring-based animation styles.
 */
const useTitleStyle = (isActive, Stages) => {
  const ACTIVE_Y = 0;
  const INACTIVE_Y = Stages[2] ? 100 : 15;

  return useSpring({
    marginTop: isActive ? ACTIVE_Y : INACTIVE_Y,
    opacity: isActive ? 1 : 0,
  });
};

export default useTitleStyle;
