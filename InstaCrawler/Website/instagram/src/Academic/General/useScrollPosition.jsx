import { useState, useEffect } from "react";

const useScrollPosition = (ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollTop = element.scrollTop;
      if (scrollTop < 40) {
        setScrollPosition(scrollTop);
      }
    };

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  return scrollPosition;
};

export default useScrollPosition;
