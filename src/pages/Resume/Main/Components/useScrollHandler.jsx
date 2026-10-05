import { useEffect, useRef, useCallback } from "react";

const useScrollHandler = ({
  scollableRef,
  selected,
  cvListElement,
  isActive,
  data,
  executeSmoothScroll,
  isMobile,
}) => {
  const lastIndexRef = useRef(-1);
  const calculateScroll = useCallback(() => {
    const panel = scollableRef.current;
    if (!panel || !cvListElement || isActive) return;

    const threshold = panel.getBoundingClientRect().top + 120;
    let newIndex = 0;
    data.forEach((section, index) => {
      const element = document.getElementById(section.name);
      if (element && element.getBoundingClientRect().top <= threshold) {
        newIndex = index;
      }
    });

    if (newIndex === lastIndexRef.current || newIndex === selected) return;
    lastIndexRef.current = newIndex;
    const button = cvListElement.children[newIndex + (isMobile ? 1 : 0)];
    if (!button) return;
    const target = button.offsetLeft -
      (cvListElement.clientWidth - button.offsetWidth) / 2;
    executeSmoothScroll(cvListElement, target, "Left", newIndex, 300);
  }, [scollableRef, selected, cvListElement, isActive, data, executeSmoothScroll, isMobile]);
  const scrollTimeoutRef = useRef(null);
  useEffect(() => {
    const div = scollableRef.current;
    if (!div) return;
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        calculateScroll();
      }, 50);
    };
    div.addEventListener("scroll", handleScroll);
    return () => {
      div.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scollableRef, calculateScroll]);
};

export default useScrollHandler;
