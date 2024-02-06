import {
  updateScrollableRef,
  updateData,
  updateStages,
  updateAcademicElementSize,
} from "../../actions/Actions";
import DataModify from "./DataModify";
import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const useUpdateVariable = () => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);

  const { width, height } = useWindowSize();
  const academicElementSize = useMemo(
    () => ({
      height: Math.min(height - 70 - 90 - 75, 830),
      width: Math.min(width, 620),
    }),
    [width, height]
  );
  const handleacademicElementSize = () => {
    dispatch(updateAcademicElementSize(academicElementSize));
  };
  useEffect(() => {
    handleacademicElementSize();
  }, [academicElementSize]);

  const [stages, setStages] = useState([false, false, false, false]);

  const isMobile =
    window.width < 768 || /iPhone|Android/i.test(navigator.userAgent);
  const isTablet =
    (window.width >= 768 && window.width <= 1024) ||
    (window.devicePixelRatio > 1 &&
      Math.max(window.width, window.height) >= 1024) ||
    /iPad|Tablet|Kindle/i.test(navigator.userAgent);
  const isVerticalTablet = isTablet && window.height > window.width;

  useEffect(() => {
    setStages([
      false, // Stage 1
      false, // Stage 2
      isMobile && !isTablet && !isVerticalTablet, // Stage 3
      isTablet && isVerticalTablet, // Stage 4;
    ]);
  }, [isMobile, isTablet, isVerticalTablet]);

  const handleStageUpdate = () => {
    dispatch(updateStages(stages));
  };
  useEffect(() => {
    handleStageUpdate();
  }, [stages]);

  const UpdatedData = DataModify({ stages });

  const handleDataeUpdate = () => {
    dispatch(updateData(UpdatedData));
  };
  useEffect(() => {
    handleDataeUpdate();
  }, [UpdatedData, stages]);

  const handleRefUpdate = () => {
    dispatch(updateScrollableRef(scrollableDivRef));
  };
  useEffect(() => {
    handleRefUpdate();
  }, [scrollableDivRef]);
};
export default useUpdateVariable;
