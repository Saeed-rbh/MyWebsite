import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { HiArrowNarrowRight, HiArrowNarrowLeft } from "react-icons/hi";
import { useSpring, animated, easings } from "react-spring";
import AnimatedButton from "./AnimatedButton";
import useSmoothScroll from "./useSmoothScroll";
import { useSelector } from "react-redux";
import { useScroll } from "../General/ScrollProvider";

const CVList = ({ isActive }) => {
  const {
    academicData: data,
    toggle,
    scollableRef,
  } = useSelector((state) => state.data);

  const [normalizeScroll, setNormalizeScroll] = useState(null);
  useEffect(() => {
    const cvList = CVListRef.current;
    if (!cvList || !data || data.length === 0) {
      return;
    }
    const children = Array.from(cvList.children);
    if (children.length === 0) {
      return;
    }
    const positions = children.map((child) => {
      const rect = child.getBoundingClientRect();
      return (
        rect.left + cvList.scrollLeft - cvList.getBoundingClientRect().left
      );
    });
    const sectionTops = data.map((section) => section.top);
    const calculatedNormalizeScroll = positions.map(
      (pos, index) =>
        (sectionTops[index] - sectionTops[0]) / (pos - positions[0])
    );
    calculatedNormalizeScroll[0] = 0;
    setNormalizeScroll([positions, sectionTops, calculatedNormalizeScroll]);
  }, [data]);

  const smoothScroll = useSmoothScroll();

  const executeSmoothScroll = (element, offset, axis, index, duration) => {
    smoothScroll(element, offset, duration, axis, setSelected, index);
  };

  const CVListRef = useRef(null);
  const scrollEndRef = useRef(false);
  const [selected, setSelected] = useState(0);

  const [cvListElement, setCvListElement] = useState(
    CVListRef ? CVListRef.current : null
  );
  useEffect(() => {
    const cvListElement = CVListRef ? CVListRef.current : null;
    setCvListElement(cvListElement);
  }, [CVListRef]);

  const menuClicked = useCallback(
    (index) => () => {
      if (!normalizeScroll) return;
      const scrollableDivElement = scollableRef.current;
      if (!cvListElement || !scrollableDivElement) {
        return;
      }
      const [cvListScroll, divScroll] = normalizeScroll;

      executeSmoothScroll(
        cvListElement,
        cvListScroll[index] - cvListScroll[0],
        "Left",
        index,
        1000
      );
      executeSmoothScroll(
        scrollableDivElement,
        divScroll[index] - divScroll[0],
        "Top",
        index,
        1000
      );
    },

    [isActive, normalizeScroll, smoothScroll]
  );

  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
  };

  const arrowStyleLeft = useSpring({
    ...commonStyle,
    opacity: scrollEndRef.current ? 1 : 0,
    x: scrollEndRef.current ? 0 : -10,
    easing: easings.easeOutCubic,
  });

  const arrowStyleRight = useSpring({
    from: {
      opacity: 0,
      x: -5,
    },
    to: {
      ...commonStyle,
      opacity: !scrollEndRef.current ? 1 : 0,
      x: !scrollEndRef.current ? 3 : 10,
    },
    easing: easings.easeOutCubic,
  });

  const arrowCentre = useSpring({
    from: { opacity: 0, x: -5 },
    to: {
      ...commonStyle,
      fontSize: 10,
      opacity: 1,
      x: !scrollEndRef.current ? 0 : 5,
    },
    easing: easings.easeOutCubic,
  });

  const lastIndexRef = useRef(-1);
  const calculateScroll = useCallback(
    ({ normalizeScroll, cvListElement }) => {
      if (!normalizeScroll || !normalizeScroll[0] || !normalizeScroll[0].length)
        return;

      const scrollDownPosition = scollableRef.current.scrollTop;
      const sectionTops = data.map(
        (section) =>
          section.top +
          section.height +
          section.padding[0] +
          section.padding[2] -
          data[0].top
      );

      const GreaterThanScroll = sectionTops.map(
        (Tops) => Tops * 0.8 <= scrollDownPosition
      );

      const highestTrueIndex = GreaterThanScroll.reduce(
        (maxIndex, currentValue, currentIndex) =>
          currentValue ? currentIndex : maxIndex,
        -1
      );

      const newIndex = highestTrueIndex + 1;

      if (
        newIndex >= 0 &&
        newIndex < normalizeScroll[0].length &&
        newIndex !== lastIndexRef.current
      ) {
        lastIndexRef.current = newIndex;
        const [cvListScroll, divScroll] = normalizeScroll;

        newIndex !== selected &&
          !isActive &&
          executeSmoothScroll(
            cvListElement,
            cvListScroll[newIndex] - cvListScroll[0],
            "Left",
            newIndex,
            500
          );
      }
    },
    [selected, isActive]
  );

  const scrollTimeoutRef = useRef(null);
  useEffect(() => {
    const div = scollableRef.current;
    if (!div || !normalizeScroll) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        calculateScroll({ normalizeScroll, cvListElement });
      }, 150);
    };
    div.addEventListener("scroll", handleScroll);
    return () => {
      div.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scollableRef, normalizeScroll, calculateScroll]);

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

  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);

  const titleStyle = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: visibility ? 0.7 : 0, y: visibility ? -12 : 10 },
    delay: animationFinished ? 0 : 700,
    config: {
      duration: animationFinished ? undefined : 300,
    },
    onRest: () => setAnimationFinished(true),
  });

  const scrollPosition = useScroll() / 20;
  const interpolateValue = (scrollPosition, [endValue, startValue]) => {
    return startValue + (endValue - startValue) * scrollPosition;
  };
  const scrollEffect = useMemo(() => {
    if (scrollPosition <= 0) {
      return [interpolateValue(scrollPosition, [-7, 0]), 1, 0, 1];
    } else if (scrollPosition < 1) {
      return [
        interpolateValue(scrollPosition, [-45, 0]),
        interpolateValue(scrollPosition, [0.9, 1]),
        interpolateValue(scrollPosition, [-10, 0]),
        interpolateValue(scrollPosition, [0, 1]),
      ];
    } else if (scrollPosition <= 0) {
      return [0, 1, 0, 1];
    }
    return [-45, 0.9, -10, 0];
  }, [scrollPosition]);

  const lineStyle = useSpring({
    from: { width: 0 },
    to: {
      opacity: visibility ? scrollEffect[3] : 0,
      width: visibility ? 18 : 0,
    },
    delay: animationFinished ? 0 : 700,
    config: {
      duration: animationFinished ? undefined : 500,
    },
    onRest: () => setAnimationFinished(true),
  });

  const textStyle = useSpring({
    from: {
      opacity: 0,
      y: 10,
    },
    to: { opacity: visibility ? scrollEffect[3] : 0, y: visibility ? 0 : 10 },
    delay: animationFinished ? 0 : 500,
    config: {
      duration: animationFinished ? undefined : 100,
    },
    onRest: () => setAnimationFinished(true),
  });

  const mainStyle = useSpring({
    position: "absolute",
    height: 65,
    width: "100%",
    top: 150,
    display: "flex",
    y: scrollEffect[0],
    zIndex: 22,
    overflow: "hidden",
  });

  return (
    <animated.div style={mainStyle}>
      <animated.div style={titleStyle} className="CVListP">
        <animated.p style={textStyle}>Easy Access Menu</animated.p>{" "}
        <animated.span style={lineStyle}></animated.span>
        <h1>
          <animated.div style={arrowStyleLeft}>
            <HiArrowNarrowLeft />
          </animated.div>
          <animated.div style={arrowCentre}> scroll</animated.div>
          <animated.div style={arrowStyleRight}>
            <HiArrowNarrowRight />
          </animated.div>
        </h1>
      </animated.div>
      <div ref={CVListRef} className="CVList">
        {data.map((item, index) => (
          <AnimatedButton
            key={item.id}
            index={index}
            item={item}
            isSelected={index === selected}
            onClick={menuClicked(index)}
          />
        ))}
      </div>
    </animated.div>
  );
};

export default React.memo(CVList);
