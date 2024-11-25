import React, { useMemo } from "react";
import { animated, easings, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useElementSize from "./Styles/useElementSize";
import CVList from "./Main/CVList";
import MainTitle from "./Main/MainTitle";
import MoreInfoAcademic from "./Main/MoreInfoAcademic";
import "./AcademicCV.css";
import { ScrollProvider } from "./General/ScrollProvider";
import useScrollPosition from "./General/useScrollPosition";

const AcademicCV = () => {
  const EXTRA_SPACE = 30;
  const elementSize = useElementSize("AcademicCV-M");

  const {
    academicData: data,
    stages,
    toggle,
    scollableRef,
  } = useSelector((state) => state.data);

  const scrollPosition = useScrollPosition(scollableRef);
  const conditionData = data.length > 0;
  const conditionStage = stages.length > 0 && elementSize.width > 10;

  const lastValue = useMemo(() => {
    const lastElement = data.length ? data[data.length - 1] : null;

    return lastElement
      ? lastElement.top + lastElement.height + EXTRA_SPACE
      : 1000;
  }, [data]);

  const moreAcademicInfoStyle = useSpring({
    width: stages[1]
      ? "calc(100% - 10px)"
      : `${Math.max(
          Math.min(elementSize.width * 0.95, data[0].size[1] * 2.3),
          data[0].size[1] * 2 + 10
        )}px`,
    boxSizing: "border-box",
    top: -35,
    height: "100%",

    overflowY: useMemo(
      () =>
        toggle[0]
          ? "hidden"
          : conditionStage && (stages[1] || stages[3])
          ? "auto"
          : "visible",
      [conditionStage, stages, toggle]
    ),
    easing: easings.easeOutCubic,
  });

  return (
    <ScrollProvider scrollPosition={scrollPosition}>
      {conditionData && (
        <div
          id="AcademicCV-M"
          className="AcademicCV-M"
          style={{ height: `${window.innerHeight - 35}px` }}
        >
          <animated.div
            style={moreAcademicInfoStyle}
            ref={scollableRef}
            id="MoreInfoAcademic"
            className="MoreInfoAcademic"
          >
            {conditionStage && (
              <>
                <MainTitle size={data[0].size[1]} />
                {(stages[1] || stages[3]) && <CVList isActive={toggle[0]} />}
              </>
            )}
            {conditionStage && <MoreInfoAcademic lastValue={lastValue} />}
          </animated.div>
        </div>
      )}
    </ScrollProvider>
  );
};

export default AcademicCV;
