import React, { useState, useEffect, useCallback, useMemo } from "react";
import { animated, easings, useSpring } from "react-spring";
import { useSelector, useDispatch } from "react-redux";
import useUpdateVariable from "./General/useUpdateVariable";
import useElementSize from "./Styles/useElementSize";
import CVList from "./Main/CVList";
import MainTitle from "./Main/MainTitle";
import MoreInfoAcademic from "./Main/MoreInfoAcademic";
import "./AcademicCV.css";
import { updateVisibility } from "../actions/Actions";
import { ScrollProvider } from "./General/ScrollProvider";
import useScrollPosition from "./General/useScrollPosition";

const AcademicCV = () => {
  const minScale = 0.9;
  const maxScale = 2;
  const minHeight = 650;
  const maxHeight = 1500;
  const EXTRA_SPACE = 30;

  const elementSize = useElementSize("AcademicCV-M");
  const [scale, setScale] = useState(1);
  const [mainMaxHeight, setMainMaxHeight] = useState(maxHeight);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateVisibility(false));
  }, []);

  useUpdateVariable({ elementSize });
  const {
    academicData: data,
    stages,
    toggle,
    scollableRef,
  } = useSelector((state) => state.data);
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(updateVisibility(true));
    }, 1000);
    return () => clearTimeout(timer);
  }, [data, dispatch]);

  const scrollPosition = useScrollPosition(scollableRef);

  const conditionData = data.length > 0;
  const conditionStage = stages.length > 0;

  const updateScaleAndMaxHeight = useCallback(() => {
    const aspectRatio = elementSize.height / elementSize.width < 0.55;
    let newScale = minScale;
    if (!stages[2]) {
      if (aspectRatio) {
        newScale =
          elementSize.height >= minHeight && elementSize.height <= maxHeight
            ? minScale +
              ((maxScale - minScale) / (maxHeight - minHeight)) *
                (elementSize.height - minHeight)
            : elementSize.height < minHeight
            ? minScale
            : maxScale;
      }
    } else {
      newScale = 0.95;
    }
    setScale(newScale);

    let newMaxHeight = 610;
    if (stages[2] || stages[3]) {
      newMaxHeight = elementSize.height;
    } else if (stages[1]) {
      newMaxHeight = 290;
    } else if (stages[0]) {
      newMaxHeight = 480;
    }
    setMainMaxHeight(newMaxHeight);
  }, [elementSize, stages]);

  useEffect(() => {
    updateScaleAndMaxHeight();
  }, [updateScaleAndMaxHeight]);

  const lastValue = useMemo(() => {
    const lastElement = data.length ? data[data.length - 1] : null;
    return lastElement
      ? lastElement.top + lastElement.height + EXTRA_SPACE
      : 1000;
  }, [data]);

  const interpolateValue = (scrollPosition, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * scrollPosition;
  };

  const scrollEffect = useMemo(() => {
    if (scrollPosition <= 0) {
      return 0;
    } else if (scrollPosition < 1) {
      return interpolateValue(scrollPosition / 20, [-45, 0]);
    }
    return -45;
  }, [scrollPosition]);
  const moreAcademicInfoStyle = useSpring({
    transform: `scale(${stages[3] ? 1 : scale})`,
    maxHeight: `${mainMaxHeight}px`,
    maxWidth: `${stages[2] || stages[3] ? 620 : elementSize.width}px`,
    top: useMemo(
      () =>
        conditionStage
          ? stages[2]
            ? -10 + scrollEffect
            : stages[3]
            ? 10 + scrollEffect
            : 0
          : 0,
      [stages, conditionStage, scrollEffect]
    ),
    height: useMemo(
      () => `calc(100% - ${stages[2] && conditionStage ? 80 : 0}px)`,
      [stages, conditionStage]
    ),
    overflow: useMemo(
      () =>
        toggle[0]
          ? "hidden"
          : conditionStage && (stages[2] || stages[3])
          ? "auto"
          : "visible",
      [conditionStage, stages, toggle]
    ),
    easing: easings.easeOutCubic,
  });

  return (
    <ScrollProvider scrollPosition={scrollPosition}>
      {conditionStage && (
        <div id="AcademicCV-M" className="AcademicCV-M">
          {conditionData && (
            <>
              <MainTitle />
              {(stages[2] || stages[3]) && <CVList isActive={toggle[0]} />}
            </>
          )}
          <animated.div
            style={moreAcademicInfoStyle}
            ref={scollableRef}
            id="MoreInfoAcademic"
            className="MoreInfoAcademic"
          >
            {conditionData && (
              <MoreInfoAcademic
                stages={stages}
                conditionStage={conditionStage}
                toggle={toggle}
                lastValue={lastValue}
              />
            )}
          </animated.div>
        </div>
      )}
    </ScrollProvider>
  );
};

export default AcademicCV;
