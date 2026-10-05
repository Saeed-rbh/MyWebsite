import { useCallback } from "react";

const useMenuClick = ({
  cvListElement,
  scollableRef,
  executeSmoothScroll,
  data,
  isMobile,
}) => {
  const menuClicked = useCallback(
    (index) => {
      const scrollableDivElement = scollableRef.current;
      const button = cvListElement?.children[index + (isMobile ? 1 : 0)];
      const section = document.getElementById(data[index]?.name);
      if (!button || !section || !scrollableDivElement) {
        return;
      }

      const menuTarget = button.offsetLeft -
        (cvListElement.clientWidth - button.offsetWidth) / 2;
      const sectionTop = section.getBoundingClientRect().top -
        scrollableDivElement.getBoundingClientRect().top +
        scrollableDivElement.scrollTop;
      const sectionTarget = Math.max(0, sectionTop - 100);

      executeSmoothScroll(
        cvListElement,
        menuTarget,
        "Left",
        index,
        400
      );
      executeSmoothScroll(
        scrollableDivElement,
        sectionTarget,
        "Top",
        index,
        500
      );
    },
    [cvListElement, scollableRef, executeSmoothScroll, data, isMobile]
  );

  return menuClicked;
};

export default useMenuClick;
