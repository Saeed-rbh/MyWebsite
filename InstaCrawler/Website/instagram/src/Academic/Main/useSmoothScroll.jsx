import { useRef, useCallback } from "react";

/**
 * Easing function for smooth scrolling.
 * @param {number} time - Current time
 * @param {number} start - Start position
 * @param {number} change - Change in position
 * @param {number} duration - Duration of scroll
 * @returns {number} The calculated position
 */
const easeScroll = (time, start, change, duration) => {
  let t = time / duration - 1;
  return change * (t * t * t + 1) + start;
};

/**
 * Custom hook for smooth scrolling.
 * @returns {Function} The smoothScroll function.
 */
const useSmoothScroll = () => {
  const isLeftScrolling = useRef(false);

  const smoothScroll = useCallback(
    (element, targetPosition, duration, direction, setSelected, index) => {
      if (!element || duration <= 0) return;
      if (direction === "Left" && isLeftScrolling.current) return;

      const startPosition =
        direction === "Top" ? element.scrollTop : element.scrollLeft;
      if (direction === "Left") isLeftScrolling.current = true;

      if (
        direction === "Left" &&
        setSelected &&
        typeof setSelected === "function"
      ) {
        setSelected(index);
      }

      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeScroll(
          timeElapsed,
          startPosition,
          targetPosition - startPosition,
          duration
        );
        if (direction === "Top") {
          element.scrollTop = run;
        } else if (direction === "Left") {
          element.scrollLeft = run;
        }
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          if (direction === "Left") isLeftScrolling.current = false;
        }
      };

      requestAnimationFrame(animation);
    },
    []
  );

  return smoothScroll;
};

export default useSmoothScroll;
