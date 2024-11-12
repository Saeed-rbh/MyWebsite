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
    if (scrollPosition / 70 < 0)
      return [interpolateValue(scrollPosition / 20, [0 / 3, 20]), 1, 0, 1];
    if (scrollPosition / 70 < 1) {
      return [
        interpolateValue(scrollPosition / 70, [0, 20]),
        interpolateValue(scrollPosition / 70, [0.9, 1]),
        interpolateValue(scrollPosition / 70, [-10, 0]),
        interpolateValue(scrollPosition / 70, [0, 1]),
      ];
    }
    return [0, 0.9, -10, 0];
  }, [scrollPosition, interpolateValue]);

  const mainStyle = useSpring({
    position: "relative",
    height: 70,
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
