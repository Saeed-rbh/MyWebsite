import { useMemo, useCallback } from "react";
import { useSpring } from "react-spring";
import { useScroll } from "../../General/ScrollProvider";
import { useSelector } from "react-redux";

const MainStyleComponent = () => {
  // Interpolates between two values based on scroll position
  const scrollPosition = useScroll() / 20;

  const interpolateValue = useCallback((value, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * value;
  }, []);

  // Computes the style effect based on scroll position
  const scrollEffect = useMemo(() => {
    if (scrollPosition < 0)
      return [interpolateValue(scrollPosition, [0 / 3, 20]), 1, 0, 1];
    if (scrollPosition < 1) {
      return [
        interpolateValue(scrollPosition, [0, 20]),
        interpolateValue(scrollPosition, [0.9, 1]),
        interpolateValue(scrollPosition, [-10, 0]),
        interpolateValue(scrollPosition, [0, 1]),
      ];
    }
    return [0, 0.9, -10, 0];
  }, [scrollPosition, interpolateValue]);

  const stages = useSelector((state) => state.data.stages);

  const mainStyle = useSpring({
    position: "relative",
    height: 70,
    width: stages[2] ? "90%" : "100%",
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
