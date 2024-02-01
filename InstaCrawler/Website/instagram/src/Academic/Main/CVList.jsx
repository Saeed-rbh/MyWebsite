import React, { useRef, useState, useEffect } from "react";
import { animated } from "react-spring";
import AnimatedButton from "./Components/AnimatedButton";
import { useSelector } from "react-redux";
import ScrollControls from "./Components/ScrollControls";
import useScrollCalculations from "./Components/useScrollCalculations";
import useScrollHandler from "./Components/useScrollHandler";
import useMenuClick from "./Components/useMenuClick";
import MainStyleComponent from "./Components/MainStyleComponent";

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
