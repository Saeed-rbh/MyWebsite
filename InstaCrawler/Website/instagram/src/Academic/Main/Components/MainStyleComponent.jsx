import { useMemo, useCallback } from "react";
import { useSpring } from "react-spring";
import useScrollPosition from "../../General/useScrollPosition";
import { useSelector } from "react-redux";

const MainStyleComponent = () => {
  // Interpolates between two values based on scroll position
  const { stages, scollableRef } = useSelector((state) => state.data);
  const { scrollPosition } = useScrollPosition(scollableRef);

  const interpolateValue = useCallback((value, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * value;
  }, []);

  // Computes the style effect based on scroll position
  const scrollEffect = useMemo(() => {
    if (scrollPosition / 60 < 0)
      return [interpolateValue(scrollPosition / 60, [10 / 3, 20]), 1, 0, 1];
    if (scrollPosition / 40 < 1) {
      return [
        interpolateValue(scrollPosition / 40, [20, 60]),
        interpolateValue(scrollPosition / 40, [0.9, 1]),
        interpolateValue(scrollPosition / 40, [-10, 0]),
        interpolateValue(scrollPosition / 40, [0, 1]),
      ];
    }
    return [10, 0.9, -10, 0];
  }, [scrollPosition, interpolateValue]);

  const mainStyle = useSpring({
    position: "fixed",
    height: 70,
    top: 0,
    width: stages[2] ? "95%" : "100%",
    // paddingLeft: stages[2] ? "5%" : "0%",
    display: "flex",
    y: scrollEffect[0],
    zIndex: 22,
    overflow: "hidden",
    maxWidth: `${stages[2] || stages[3] ? 620 * 0.95 : 0}px`,
  });
  return { mainStyle, scrollEffect };
};

export default MainStyleComponent;
