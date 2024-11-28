import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useSmoothScroll from "./useSmoothScroll";

const useScrollCalculations = ({ data, CVListRef, setSelected }) => {
  const [normalizeScroll, setNormalizeScroll] = useState(null);

  const calculateScrollPositions = useCallback(() => {
    const cvList = CVListRef.current;
    if (!cvList || !data || data.length === 0) return;

    const children = Array.from(cvList.children);
    if (children.length === 0) return;

    const positions = children.map(
      (child) =>
        child.getBoundingClientRect().left +
        cvList.scrollLeft -
        cvList.getBoundingClientRect().left
    );
    const sectionTops = data.map((section) => section.top);

    const calculatedNormalizeScroll = positions.map(
      (pos, index) =>
        (sectionTops[index] - sectionTops[0]) / (pos - positions[0])
    );

    calculatedNormalizeScroll[0] = 0;
    return [positions, sectionTops, calculatedNormalizeScroll];
  }, [data, CVListRef]);

  useEffect(() => {
    setNormalizeScroll(calculateScrollPositions());
  }, [calculateScrollPositions]);

  const smoothScroll = useSmoothScroll();

  const executeSmoothScroll = useCallback(
    (element, offset, axis, index, duration) => {
      smoothScroll(element, offset, duration, axis, setSelected, index);
    },
    [smoothScroll, setSelected]
  );

  return { normalizeScroll, executeSmoothScroll };
};

useScrollCalculations.propTypes = {
  data: PropTypes.array.isRequired,
  CVListRef: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default useScrollCalculations;
