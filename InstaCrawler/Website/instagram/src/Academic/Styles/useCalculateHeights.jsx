import { useState, useCallback, useMemo, useEffect } from "react";

// Constants for height offsets
const HEIGHT_OFFSETS = {
  Opened: 0,
  NoAction: 5,
  Hovered: 60,
  thirdDataTop: 20,
  full: 50,
};

/**
 * Custom hook to calculate heights and top positions for elements based on refs and data.
 *
 * @param {Object} params - Parameters including refs, main element size, data, and setChangedHeight function.
 * @returns {Object} Calculated heights and top positions.
 */
function useCalculateHeights({
  ParentRef,
  ChildRefs,
  mainElementSize,
  data,
  setChangedHeight,
}) {
  const [heights, setHeights] = useState({
    Opened: 0,
    NoAction: 0,
    Hovered: 0,
  });
  const [skillElementHeight, setSkillElementHeight] = useState(0);

  // Function to calculate heights of elements
  const calculateHeights = useCallback(() => {
    if (ParentRef.current && ChildRefs.current) {
      const totalSkillElementHeight = ChildRefs.current.reduce(
        (total, ref) => total + (ref.current ? ref.current.clientHeight : 0),
        0
      );

      setSkillElementHeight(totalSkillElementHeight);

      const firstHeight = ChildRefs.current[0]?.current?.clientHeight || 0;
      const secondHeight = ChildRefs.current[1]?.current?.clientHeight || 0;
      const isOpenHeightExceeding =
        totalSkillElementHeight + HEIGHT_OFFSETS.Opened >
        mainElementSize.height - HEIGHT_OFFSETS.full;
      setHeights({
        Opened: isOpenHeightExceeding
          ? mainElementSize.height - HEIGHT_OFFSETS.full
          : totalSkillElementHeight,
        NoAction: data.IfCalc
          ? firstHeight + HEIGHT_OFFSETS.NoAction
          : data.height,
        Hovered: data.IfCalc
          ? firstHeight + HEIGHT_OFFSETS.Hovered
          : data.height + HEIGHT_OFFSETS.Hovered,
      });
    }
  }, [ParentRef, ChildRefs, mainElementSize, data]);

  // Calculating top positions
  const tops = useMemo(
    () => ({
      Opened:
        skillElementHeight + HEIGHT_OFFSETS.Opened < mainElementSize.height
          ? Math.min(
              mainElementSize.height - heights.Opened - HEIGHT_OFFSETS.full,
              data.top - heights.Opened / 2
            )
          : 0,
      NoAction: data.top,
      Hovered: data.top - HEIGHT_OFFSETS.thirdDataTop,
    }),
    [skillElementHeight, heights, mainElementSize, data.top]
  );

  // Effect for recalculating heights
  useEffect(() => {
    calculateHeights();
  }, [calculateHeights]);

  // Effect for updating changed height
  useEffect(() => {
    if (setChangedHeight && data.height !== heights.NoAction) {
      setChangedHeight((prevHistory) => [
        ...prevHistory,
        [data.id, heights.NoAction],
      ]);
    }
  }, [heights.NoAction, data.height, data.id, setChangedHeight]);

  return { heights, tops };
}

export default useCalculateHeights;
