import { useMemo } from "react";
import { useScroll } from "../../General/ScrollProvider";

const useScrollEffect = () => {
  const scrollPosition = useScroll() / 20;

  const interpolateValue = (scrollPosition, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * scrollPosition;
  };

  const scrollEffect = useMemo(() => {
    if (scrollPosition <= 0) {
      return [interpolateValue(scrollPosition, [-7, 0]), 1, 0, 1];
    } else if (scrollPosition < 1) {
      return [
        interpolateValue(scrollPosition, [-45, 0]),
        interpolateValue(scrollPosition, [0.9, 1]),
        interpolateValue(scrollPosition, [-10, 0]),
        interpolateValue(scrollPosition, [0, 1]),
      ];
    } else if (scrollPosition <= 0) {
      return [0, 1, 0, 1];
    }
    return [-45, 0.9, -10, 0];
  }, [scrollPosition]);

  return scrollEffect;
};

export default useScrollEffect;
