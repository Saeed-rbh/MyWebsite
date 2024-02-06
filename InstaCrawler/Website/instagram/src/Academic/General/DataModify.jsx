import { useMemo, useEffect, useState } from "react";
import { sectionProperties } from "./sectionComponents";
import SectionsData from "./SectionsData";
import { useSelector } from "react-redux";

const useSequence = (stages) =>
  useMemo(() => {
    return stages[2] || stages[3]
      ? [0, 1, 4, 2, 5, 3, 8, 6, 7]
      : stages[1]
      ? [0, 1, 4, 5, 2, 8, 3, 7, 6]
      : stages[0]
      ? [0, 1, 2, 4, 3, 5, 6, 7, 8]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }, [stages]);

const DataModify = ({ stages }) => {
  const [isMainElementSizeStable, setIsMainElementSizeStable] = useState(false);
  const stabilityDelay = 500;

  const mainElementSize = useSelector(
    (state) => state.data.academicElementSize
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMainElementSizeStable(true);
    }, stabilityDelay);
    return () => clearTimeout(timeoutId);
  }, [mainElementSize]);

  const sequence = useSequence(stages);

  const data = useMemo(() => {
    if (isMainElementSizeStable && mainElementSize.height > 0) {
      const result = SectionsData(
        sectionProperties,
        mainElementSize,
        sequence,
        stages
      );
      return result;
    }
    return [];
  }, [isMainElementSizeStable, stages]);

  return data;
};

export default DataModify;
