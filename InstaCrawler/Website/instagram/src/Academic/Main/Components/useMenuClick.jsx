import { useCallback } from "react";

const useMenuClick = ({
  normalizeScroll,
  cvListElement,
  scollableRef,
  executeSmoothScroll,
}) => {
  const menuClicked = useCallback(
    (index) => {
      if (!normalizeScroll) return;
      const scrollableDivElement = scollableRef.current;
      if (!cvListElement || !scrollableDivElement) {
        return;
      }
      const [cvListScroll, divScroll] = normalizeScroll;

      executeSmoothScroll(
        cvListElement,
        cvListScroll[index] - cvListScroll[0],
        "Left",
        index,
        1000
      );
      executeSmoothScroll(
        scrollableDivElement,
        divScroll[index] - divScroll[0],
        "Top",
        index,
        1000
      );
    },
    [normalizeScroll, cvListElement, scollableRef, executeSmoothScroll]
  );

  return menuClicked;
};

export default useMenuClick;
