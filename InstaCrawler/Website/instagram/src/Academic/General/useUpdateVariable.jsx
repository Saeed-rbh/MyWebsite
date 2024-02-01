import {
  updateScrollableRef,
  updateData,
  updateStages,
} from "../../actions/Actions";
import DataModify from "./DataAdjustment";
import { useEffect, useState, useRef } from "react";
import useElementSize from "../Styles/useElementSize";
import { useDispatch } from "react-redux";

const useUpdateVariable = ({ elementSize }) => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const mainElementSize = useElementSize("MoreInfoAcademic");

  const [stages, setStages] = useState([false, false, false, false]);

  const isMobile =
    elementSize.width < 768 || /iPhone|Android/i.test(navigator.userAgent);
  const isTablet =
    (elementSize.width >= 768 && elementSize.width <= 1024) ||
    (window.devicePixelRatio > 1 &&
      Math.max(elementSize.width, elementSize.height) >= 1024) ||
    /iPad|Tablet|Kindle/i.test(navigator.userAgent);
  const isVerticalTablet = isTablet && elementSize.height > elementSize.width;

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

  const UpdatedData = DataModify({ stages, mainElementSize });

  const handleDataeUpdate = () => {
    // console.log("UpdatedData");
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
