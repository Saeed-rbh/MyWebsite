import {
  updateData,
  updateStages,
  updateAcademicElementSize,
} from "../../../actions/Actions";
import useDataModify from "./DataModify";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);
    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

const useUpdateVariable = () => {
  const dispatch = useDispatch();
  const { width, height } = useWindowSize();

  // Calculate stages first (needed by useDataModify)
  const isMobile =
    width < 970 || /iPhone|Android/i.test(navigator.userAgent);
  const isTablet =
    (width >= 768 && width <= 1024) ||
    (window.devicePixelRatio > 1 &&
      Math.max(width, height) >= 1024) ||
    /iPad|Tablet|Kindle/i.test(navigator.userAgent);
  const isVerticalTablet = isTablet && height > width;

  const stages = useMemo(() => [
    false, // Stage 1
    isMobile, // Stage 2
    isMobile && !isTablet && !isVerticalTablet, // Stage 3
    isTablet && isVerticalTablet, // Stage 4
  ], [isMobile, isTablet, isVerticalTablet]);

  // Call useDataModify early with consistent hook order
  const UpdatedData = useDataModify({ stages });

  const academicElementSize = useMemo(
    () => ({
      height: Math.min(height - 70 - 90 - 75, 830),
      width: Math.min(width, 620),
    }),
    [width, height]
  );

  // Dispatch effects
  useEffect(() => {
    dispatch(updateAcademicElementSize(academicElementSize));
  }, [academicElementSize, dispatch]);

  useEffect(() => {
    dispatch(updateStages(stages));
  }, [stages, dispatch]);

  useEffect(() => {
    dispatch(updateData(UpdatedData));
  }, [UpdatedData, dispatch]);
};

export default useUpdateVariable;
