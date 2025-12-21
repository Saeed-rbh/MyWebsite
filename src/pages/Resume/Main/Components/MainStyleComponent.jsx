import { useMemo, useCallback } from "react";
import { useSpring } from "react-spring";
import useScrollPosition from "../../General/useScrollPosition";
import { useSelector } from "react-redux";
import { useScrollableRef } from "../../General/ScrollableRefContext";

const MainStyleComponent = () => {
  // Interpolates between two values based on scroll position
  const { stages } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollPosition } = useScrollPosition(scrollableRef);

  const interpolateValue = useCallback((value, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * value;
  }, []);

  // Computes the style effect based on scroll position
  const scrollEffect = useMemo(() => {
    if (scrollPosition / 60 < 0)
      return [interpolateValue(scrollPosition / 60, [20 / 3, 60]), 1, 0, 1];
    if (scrollPosition / 40 < 1) {
      return [
        interpolateValue(scrollPosition / 40, [20, 60]),
        interpolateValue(scrollPosition / 40, [0.9, 1]),
        interpolateValue(scrollPosition / 40, [-10, 0]),
        interpolateValue(scrollPosition / 40, [0, 1]),
      ];
    }
    return [20, 0.9, -10, 0];
  }, [scrollPosition, interpolateValue]);

  const mainStyle = useSpring({
    position: "fixed",
    height: 55,
    top: 0,
    width: stages[1] ? "95%" : "100%",
    // paddingLeft: stages[1] ? "5%" : "0%",
    display: "flex",
    y: scrollEffect[0],
    zIndex: 22,
    overflow: "hidden",
    maxWidth: `${stages[1] || stages[3] ? 620 * 0.95 : 0}px`,
  });
  return { mainStyle, scrollEffect };
};

export default MainStyleComponent;
