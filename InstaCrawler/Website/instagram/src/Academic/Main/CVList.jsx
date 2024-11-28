import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSpring, animated } from "react-spring";
import AnimatedButton from "./Components/AnimatedButton";
import { useSelector } from "react-redux";
import ScrollControls from "./Components/ScrollControls";
import useScrollCalculations from "./Components/useScrollCalculations";
import useScrollHandler from "./Components/useScrollHandler";
import useMenuClick from "./Components/useMenuClick";
import useScrollPosition from "../General/useScrollPosition";

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
      return [interpolateValue(scrollPosition / 200, [20 / 3, 60]), 1, 0, 1];
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

const CVList = ({ isActive }) => {
  const {
    academicData: data,
    toggle,
    scollableRef,
  } = useSelector((state) => state.data);

  const CVListRef = useRef(null);
  const [selected, setSelected] = useState(0);

  const { normalizeScroll, executeSmoothScroll } = useScrollCalculations({
    data,
    CVListRef,
    setSelected,
  });

  console.log("normalizeScroll", normalizeScroll);

  const [cvListElement, setCvListElement] = useState(
    CVListRef ? CVListRef.current : null
  );

  useEffect(() => {
    const cvListElement = CVListRef ? CVListRef.current : null;
    setCvListElement(cvListElement);
  }, [CVListRef]);

  useEffect(() => {
    if (!normalizeScroll) return;
    const [cvListScroll, divScroll] = normalizeScroll;

    if (isActive) {
      const matchingElement = data.find(
        (element) => element.title === toggle[1]
      );
      const newIndex = matchingElement ? matchingElement.seqId : undefined;

      executeSmoothScroll(
        cvListElement,
        cvListScroll[newIndex] - cvListScroll[0],
        "Left",
        newIndex,
        900,
        false
      );
    }
  }, [data, isActive]);

  const { mainStyle, scrollEffect } = MainStyleComponent();

  useScrollHandler({
    scollableRef,
    normalizeScroll,
    selected,
    cvListElement,
    isActive,
    data,
    executeSmoothScroll,
  });
  const menuClicked = useMenuClick({
    normalizeScroll,
    cvListElement,
    scollableRef,
    executeSmoothScroll,
  });

  return (
    <animated.div style={mainStyle}>
      <ScrollControls scrollEffect={scrollEffect} />
      <div ref={CVListRef} className="CVList">
        {data.map((item, index) => (
          <AnimatedButton
            key={item.id}
            index={index}
            item={item}
            isSelected={index === selected}
            onClick={isActive ? undefined : menuClicked}
          />
        ))}
      </div>
    </animated.div>
  );
};

export default CVList;
