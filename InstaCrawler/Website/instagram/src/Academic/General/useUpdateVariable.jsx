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

  const stages = useMemo(
    () => [
      elementSize.height < 680 && elementSize.height > 560,
      elementSize.height < 560,
      elementSize.width < 1050,
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
