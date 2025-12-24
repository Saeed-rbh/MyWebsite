import React, { useMemo, useEffect } from "react";
import { animated, easings, useSpring } from "react-spring";
import { useSelector } from "react-redux";
import useElementSize from "./Styles/useElementSize";
import CVList from "./Main/CVList";
import MainTitle from "./Main/MainTitle";
import MoreInfoAcademic from "./Main/MoreInfoAcademic";
import "./AcademicCV.css";
import { ScrollProvider } from "./General/ScrollProvider";
import useScrollPosition from "./General/useScrollPosition";
import { useDispatch } from "react-redux";
import { updateCurrentPage } from "../../actions/Actions";
import { ScrollableRefProvider, useScrollableRef } from "./General/ScrollableRefContext";
import SEO from "../../components/SEO/SEO";

// Inner component that uses the scrollable ref
const AcademicCVContent = () => {
  const EXTRA_SPACE = 30;
  const elementSize = useElementSize("AcademicCV-M");
  const dispatch = useDispatch();
  const scrollableRef = useScrollableRef();

  useEffect(() => {
    dispatch(updateCurrentPage("/AcademicCV"));
  }, [dispatch]);

  const {
    academicData: data,
    stages,
    toggle,
  } = useSelector((state) => state.data);

  const scrollPosition = useScrollPosition(scrollableRef);
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
      ? elementSize.width - 10
      : Math.max(
        Math.min(elementSize.width * 0.95, data[0]?.size[1] * 2.3),
        data[0]?.size[1] * 2 + 10
      ),
    boxSizing: "border-box",
    top: -65,
    height: "100%",
    scale:
      !stages[1] && !stages[2] && elementSize.height > 640
        ? Math.min(elementSize.height / 640, 1.1)
        : 1,
    marginTop:
      !stages[1] && !stages[2] && elementSize.height > 640
        ? (elementSize.height - 640) / 2
        : 0,
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
            ref={scrollableRef}
            style={moreAcademicInfoStyle}
            id="MoreInfoAcademic"
            className="MoreInfoAcademic"
          >
            {conditionStage && (
              <>
                <MainTitle size={data[0]?.size[1]} />
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

// Wrapper component that provides the ref context
const AcademicCV = () => {
  return (
    <ScrollableRefProvider>
      <SEO
        title="Saeed Arabha | Academic CV"
        description="Academic Curriculum Vitae of Saeed Arabha. Education, Research Interests, and Publications."
        name="Saeed Arabha"
        type="article"
      />
      <AcademicCVContent />
    </ScrollableRefProvider>
  );
};

export default AcademicCV;
