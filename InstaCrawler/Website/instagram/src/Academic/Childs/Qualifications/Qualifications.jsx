import React, { useEffect, useState, useMemo } from "react";
import { useSpring } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";
import {
  useCombinedAnimation,
  calculateAdjustedHeight,
  calculateAdjustedTop,
} from "../../Styles/otherStyles";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);

  const {
    id,
    size,
    top,
    isActive,
    adjustViewport,
    adjustTop,
    adjustHeight,
    name,
  } = useUtilize(componentName);
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const [adjustedTop, setAdjustedTop] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(size[0]);
  const calculatedHeights = useMemo(() => {
    if (utilizeProps?.ParentRef) {
      return calculateAdjustedHeight({
        height: size[0],
        childRef: utilizeProps.ParentRef,
      });
    }
    return null;
  }, [utilizeProps?.ParentRef?.current, size]);
  useEffect(() => {
    const { activeHeight, notActiveHeight } = calculatedHeights;
    const adjustedTop = calculateAdjustedTop({
      top: top,
      adjustViewport: adjustViewport,
      adjustTop: adjustTop,
      stages: stages,
      isActive: isActive,
      scrollTop: scrollTop,
      newAdjustedHeight: isActive ? activeHeight : notActiveHeight,
    });
    setAdjustedTop(adjustedTop);
    setAdjustedHeight(isActive ? activeHeight : notActiveHeight);
  }, [isActive]);

  const Style = {
    borderRadius: "40px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    left: stages[2] ? "0px" : "500px",
    overflow: adjustedHeight > window.innerHeight ? "auto" : "hidden",
  };

  const styleHeight = useSpring({
    top: `${adjustedTop}px`,
    height: stages[2]
      ? isActive
        ? `${adjustedHeight + 20}px`
        : `${adjustedHeight + 20}px`
      : toggle[2]
      ? `${adjustedHeight + 20}px`
      : isActive
      ? `${adjustedHeight}px`
      : `${adjustedHeight}px`,
  });

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
  });
  return (
    <InteractiveDiv
      {...utilizeProps}
      style={{
        ...Style,
        ...combinedStyle,
        ...styleHeight,
      }}
    >
      <QualificationMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
        toggle={toggle}
      />
    </InteractiveDiv>
  );
}

export default Qualifications;
