import { useDispatch } from "react-redux";
import {
  updateScrollableRef,
  updateData,
  updateStages,
} from "../../actions/Actions";
import DataModify from "./DataAdjustment";
import { useEffect, useMemo, useRef } from "react";
import useElementSize from "../Styles/useElementSize";

const useUpdateVariable = ({ elementSize }) => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const mainElementSize = useElementSize("MoreInfoAcademic");

  const isMobile =
    elementSize.width < 768 || /iPhone|Android/i.test(navigator.userAgent);
  const isTablet =
    (elementSize.width >= 768 && elementSize.width <= 1024) ||
    (window.devicePixelRatio > 1 &&
      Math.max(elementSize.width, elementSize.height) >= 1024) ||
    /iPad|Tablet|Kindle/i.test(navigator.userAgent);
  const isVerticalTablet = isTablet && elementSize.height > elementSize.width;
  const isHorizentalTablet = isTablet && elementSize.height < elementSize.width;

  const stages = useMemo(
    () => [
      elementSize.height < 680 && elementSize.height > 560,
      elementSize.height < 560,
      isMobile,
      isTablet && isVerticalTablet,
    ],
    [elementSize.height, elementSize.width]
  );

  const handleStageUpdate = () => {
    dispatch(updateStages(stages));
  };
  useEffect(() => {
    handleStageUpdate();
  }, [stages]);

  const UpdatedData = DataModify({ stages, mainElementSize });
  const handleDataeUpdate = () => {
    dispatch(updateData(UpdatedData));
  };
  useEffect(() => {
    handleDataeUpdate();
  }, [UpdatedData]);

  const handleRefUpdate = () => {
    dispatch(updateScrollableRef(scrollableDivRef));
  };
  useEffect(() => {
    handleRefUpdate();
  }, [scrollableDivRef]);
};
export default useUpdateVariable;
