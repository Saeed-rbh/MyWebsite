import { useState, useEffect } from "react";

const useScrollPosition = (ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const element = ref?.current;

    if (!element) return;

    const handleScroll = () => {
      const currentScrollTop = element.scrollTop;
      setScrollTop(currentScrollTop);
      if (currentScrollTop < 40) {
        setScrollPosition(currentScrollTop);
      }
    };

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  return { scrollPosition, scrollTop };
};

export default useScrollPosition;
