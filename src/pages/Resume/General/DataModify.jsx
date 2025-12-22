import { useMemo, useEffect, useState } from "react";
import { sectionProperties } from "./sectionComponents";
import SectionsData from "./SectionsData";
import { useSelector } from "react-redux";

const useSequence = (stages) =>
  useMemo(() => {
    return stages[2] || stages[3] || stages[1]
      ? [0, 1, 2, 4, 5, 3, 6, 7, 8]
      : stages[0]
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
        : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }, [stages]);

const useDataModify = ({ stages, dbData = [] }) => {
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
      // Merge DB data with static properties
      const mergedData = sectionProperties.map(staticSection => {
        const dbSection = dbData.find(s => s.id === staticSection.id);
        if (dbSection) {
          let parsedList = [];
          if (typeof dbSection.list === 'string') {
            try { parsedList = JSON.parse(dbSection.list); } catch (e) { parsedList = []; }
          } else {
            parsedList = dbSection.list || [];
          }
          return {
            ...staticSection,
            title: dbSection.title,
            list: parsedList
          };
        }
        return staticSection;
      });

      const result = SectionsData(
        mergedData,
        mainElementSize,
        sequence,
        stages
      );
      return result;
    }
    return [];
  }, [isMainElementSizeStable, stages, dbData, mainElementSize, sequence]);

  return data;
};

export default useDataModify;
