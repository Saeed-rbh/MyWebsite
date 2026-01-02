import { useEffect, useRef, useCallback } from "react";

const useScrollHandler = ({
  scollableRef,
  normalizeScroll,
  selected,
  cvListElement,
  isActive,
  data,
  executeSmoothScroll,
}) => {
  const lastIndexRef = useRef(-1);
  const calculateScroll = useCallback(
    ({ normalizeScroll, cvListElement }) => {
      if (!normalizeScroll || !normalizeScroll[0] || !normalizeScroll[0].length)
        return;
      const scrollDownPosition = scollableRef.current.scrollTop;
      const sectionTops = data.map(
        (section) => section.top + section.height - data[0].top
      );
      const GreaterThanScroll = sectionTops.map(
        (Tops) => Tops * 0.8 <= scrollDownPosition - 80
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
            300 // Faster duration (was 500)
          );
      }
    },
    [selected, isActive, data, executeSmoothScroll, scollableRef]
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
      }, 50); // Faster check (was 150)
    };
    div.addEventListener("scroll", handleScroll);
    return () => {
      div.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [cvListElement, scollableRef, normalizeScroll, calculateScroll]);
};

export default useScrollHandler;
