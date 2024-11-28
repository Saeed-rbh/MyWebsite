import { useRef, useCallback } from "react";

const easeScroll = (timeElapsed, startPosition, change, duration) => {
  const t = timeElapsed / duration - 1;
  return change * (t * t * t + 1) + startPosition;
};

const useSmoothScroll = () => {
  const isLeftScrolling = useRef(false);

  const startScroll = useCallback(
    (
      element,
      targetPosition,
      duration,
      direction,
      startTime,
      startPosition
    ) => {
      const currentTime = performance.now();
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
        requestAnimationFrame(() =>
          startScroll(
            element,
            targetPosition,
            duration,
            direction,
            startTime,
            startPosition
          )
        );
      } else {
        if (direction === "Left") isLeftScrolling.current = false;
      }
    },
    []
  );

  const smoothScroll = useCallback(
    (element, targetPosition, duration, direction, setSelected, index) => {
      if (!element || duration <= 0) return;
      if (direction === "Left" && isLeftScrolling.current) return;

      const startPosition =
        direction === "Top" ? element.scrollTop : element.scrollLeft;
      console.log(startPosition);

      if (direction === "Left") isLeftScrolling.current = true;

      if (
        direction === "Left" &&
        setSelected &&
        typeof setSelected === "function"
      ) {
        setSelected(index);
      }

      const startTime = performance.now();
      startScroll(
        element,
        targetPosition,
        duration,
        direction,
        startTime,
        startPosition
      );
    },
    [startScroll]
  );

  return smoothScroll;
};

export default useSmoothScroll;
