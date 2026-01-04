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
import { useLocation } from "react-router-dom";
import { useScrollableRef } from "../General/ScrollableRefContext";
import useElementSize from "../Styles/useElementSize";
import cvData from "../../../data/cvData.json";
import DownloadButton from "./DownloadButton";

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
    position: stages[1] ? "sticky" : "fixed",
    height: 55,
    top: stages[1] ? 0 : 0,
    width: stages[1] ? "100%" : "100%",
    // paddingLeft: stages[1] ? "5%" : "0%",
    display: "flex",
    y: scrollEffect[0],
    zIndex: 100,
    overflow: "hidden",
    maxWidth: `${stages[1] || stages[3] ? 620 * 0.95 : 0}px`,
  });
  return { mainStyle, scrollEffect };
};

const CVList = ({ isActive }) => {
  const {
    academicData: data,
    toggle,
  } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const elementSize = useElementSize("AcademicCV-M");
  const isMobile = elementSize.width <= 768;

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
    // const [cvListScroll, divScroll, _, widths] = normalizeScroll; // We don't need these for the target calculation anymore if we use DOM directly

    if (isActive) {
      const matchingElement = data.find(
        (element) => element.name === toggle[1]
      );
      const newIndex = matchingElement ? matchingElement.seqId : undefined;

      if (newIndex !== undefined) {
        // Direct DOM measurement for absolute accuracy
        const targetIndex = isMobile ? newIndex + 1 : newIndex;
        const cvList = CVListRef.current;

        if (cvList && cvList.children[targetIndex]) {
          const targetElement = cvList.children[targetIndex];
          const containerWidth = cvList.clientWidth;
          const itemWidth = targetElement.offsetWidth;
          const itemLeft = targetElement.offsetLeft;

          // Calculate center position:
          // We want the center of the item (itemLeft + itemWidth/2) 
          // to be at the center of the container (containerWidth/2).
          // Required ScrollLeft = (ItemCenter) - (ContainerCenter)
          // = (itemLeft + itemWidth/2) - (containerWidth/2)

          const centerOffset = (containerWidth / 2) - (itemWidth / 2);
          const targetScroll = itemLeft - centerOffset;

          executeSmoothScroll(
            cvListElement,
            targetScroll,
            "Left",
            newIndex,
            300,
            false
          );
        }
      }
    }
  }, [data, isActive]);

  const { mainStyle, scrollEffect } = MainStyleComponent();

  useScrollHandler({
    scollableRef: scrollableRef,
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
    scollableRef: scrollableRef,
    executeSmoothScroll,
  });

  const { currentPage } = useSelector((state) => state.ui);
  const location = useLocation();
  const { visibility } = useSelector((state) => state.ui);
  const [resumeClicked, setResumeClicked] = useState(0);
  useEffect(() => {
    if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname.toLowerCase() === "/academiccv" &&
      currentPage === "/"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  return (
    <animated.div style={mainStyle}>
      <ScrollControls
        scrollEffect={scrollEffect}
        resumeClicked={resumeClicked}
      />
      <div ref={CVListRef} className="CVList">
        {isMobile && (
          <animated.div
            style={useSpring({
              opacity: resumeClicked === 1 ? (visibility ? 1 : 0) : 0,
              x: resumeClicked === 1 ? (visibility ? 0 : 30) : 10,
              config: { duration: 500 },
              delay: resumeClicked === 1 ? 1000 : 0,
            })}
          >
            <DownloadButton cvData={cvData} isMobile={true} />
          </animated.div>
        )}
        {data.map((item, index) => (
          <AnimatedButton
            key={item.id}
            index={index}
            item={item}
            isSelected={index === selected}
            onClick={isActive ? undefined : menuClicked}
            resumeClicked={resumeClicked}
          />
        ))}
      </div>
    </animated.div>
  );
};

export default CVList;
