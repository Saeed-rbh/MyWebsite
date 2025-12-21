import { useMemo, useEffect, useState } from "react";
import useElementSize from "../../Styles/useElementSize";
import useScrollPosition from "../../General/useScrollPosition";

const usePrecomputeInteractiveDiv = ({
  size,
  ParentRef,
  isActive,
  top,
  stages,
  adjustTop,
  adjustHeight,
}) => {
  const [adjustedTop, setAdjustedTop] = useState(0);
  const element = document.getElementById("MoreInfoAcademic");
  const elementSize = useElementSize("MoreInfoAcademic").width;
  const windowHeight = useElementSize("AcademicCV-M").height;
  const { scrollTop } = useScrollPosition(null);

  const marginTop =
    !stages[1] && !stages[2] && windowHeight > 640
      ? (windowHeight - 640) / 2
      : 0;

  const { activeHeight, notActiveHeight, fullView } = useMemo(() => {
    let fullView = false;
    const viewportHeight = element ? element.clientHeight : window.innerHeight;

    let activeHeight = size[0];
    if (ParentRef?.current?.scrollHeight) {
      const parentScrollHeight = ParentRef.current.scrollHeight;

      if (viewportHeight > parentScrollHeight) {
        activeHeight = parentScrollHeight + ParentRef.current.offsetTop + 25;
      } else {
        activeHeight = viewportHeight - 50 - marginTop;
        fullView = true;
      }
    }
    const notActiveHeight = size[0];

    return { activeHeight, notActiveHeight, fullView };
  }, [size, ParentRef?.current, element, isActive]);

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    let newAdjustedTop = top + (!stages[1] ? adjustTop : !stages[2] ? -60 : 0);
    const ModifyTop = 60;

    if (isActive) {
      if (!fullView) {
        newAdjustedTop = Math.max(
          Math.min(
            -(activeHeight - (viewportHeight + scrollTop - ModifyTop)),
            newAdjustedTop
          ) -
            marginTop * 1.2,
          scrollTop + ModifyTop
        );
      } else {
        newAdjustedTop = scrollTop + 1.2 * ModifyTop;
      }
    }

    setAdjustedTop(newAdjustedTop);
  }, [isActive, size, top, scrollTop, stages, activeHeight]);

  return {
    adjustedTop,
    activeHeight,
    notActiveHeight,
    fullView,
    elementSize,
  };
};

export default usePrecomputeInteractiveDiv;
