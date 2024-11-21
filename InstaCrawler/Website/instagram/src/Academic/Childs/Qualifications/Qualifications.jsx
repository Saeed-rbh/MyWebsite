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
} from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);
  const ModifyTop = 100;
  const viewportHeight = window.innerHeight;

  const { id, size, top, isActive, adjustViewport, adjustTop, name } =
    useUtilize(componentName);
  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const { scrollTop } = useScrollPosition(scollableRef);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const [adjustedTop, setAdjustedTop] = useState(0);

  const { activeHeight, notActiveHeight } = useMemo(() => {
    return calculateAdjustedHeight({
      height: size[0],
      childRef: utilizeProps.ParentRef,
    });
  }, [size[0], utilizeProps.ParentRef.current]);

  console.log(notActiveHeight, activeHeight);

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
    overflow: activeHeight > window.innerHeight ? "auto" : "hidden",
  };

  // Determine viewport dimensions and adjust component position accordingly
  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + adjustViewport + (!stages[2] ? adjustTop : 0);
    const ModifyTop = 80;

    if (isActive) {
      if (
        newAdjustedTop + activeHeight >
        viewportHeight + scrollTop - ModifyTop
      ) {
        // If the component bottom goes out of view, adjust the top position
        newAdjustedTop =
          Math.max(viewportHeight + scrollTop - activeHeight, scrollTop) -
          ModifyTop;
      }
      if (activeHeight > viewportHeight) {
        // If the component is taller than the viewport, set the top to current scroll position and allow scrolling
        newAdjustedTop = scrollTop + ModifyTop;
      }
    }

    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop]);

  const styleHeight = useSpring({
    top: `${adjustedTop}px`,
    height: isActive ? `${activeHeight}px` : `${notActiveHeight}px`,
  });

  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
  });

  return (
    <InteractiveDiv
      {...utilizeProps}
      style={{
        ...Style,
        ...combinedStyle,
        ...styleHeight,
      }}
      ref={ref}
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
