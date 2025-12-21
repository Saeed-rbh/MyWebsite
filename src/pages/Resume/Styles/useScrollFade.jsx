import { useState, useEffect } from "react";
import { useScrollableRef } from "../General/ScrollableRefContext";

const useScrollFade = (data, isActive, otherActive) => {
  const [opacity, setOpacity] = useState(1);
  const scollableRef = useScrollableRef();

  const calculateOpacity = () => {
    if (scollableRef.current) {
      const div = scollableRef.current;
      const scrollPosition = div.scrollTop;

      const scrollDiv = scollableRef.current.getBoundingClientRect();
      const scrollDivTH = scrollDiv.height;
      const scrollDivEnd = scrollDivTH + scrollPosition;

      const fadeStart = data.top;
      const fadeEnd = (data.top + data.height) * 1.1;

      let newOpacity = 1; // Default opacity

      if (
        scrollDivEnd >= fadeStart &&
        scrollPosition > 10 &&
        scrollDivEnd < fadeEnd
      ) {
        // Increasing opacity
        newOpacity = ((scrollDivEnd - fadeStart) / (fadeEnd - fadeStart)) * 2;
        newOpacity = Math.min(newOpacity, 1); // Ensure opacity doesn't exceed 1
      }

      if (scrollPosition >= fadeStart && scrollPosition > 10) {
        newOpacity = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
        newOpacity = Math.max(newOpacity, 0); // Ensure opacity doesn't go below 0
      }

      if (fadeStart > scrollDivEnd && scrollPosition > 10) {
        newOpacity = 0;
      }

      if (isActive || otherActive) {
        newOpacity = 1;
      }
      return newOpacity;
    }
    return 1;
  };

  const handleDivScroll = () => {
    setOpacity(calculateOpacity());
  };

  useEffect(() => {
    // Directly access the current property of the ref
    const div = scollableRef.current;
    if (div) {
      div.addEventListener("scroll", handleDivScroll);
    }
    return () => {
      // Again, directly access the current property of the ref for cleanup
      if (scollableRef.current) {
        scollableRef.current.removeEventListener("scroll", handleDivScroll);
      }
    };
    // Add the dependencies for useEffect
  }, [scollableRef, data.top, data.height, isActive, otherActive]);

  return opacity;
};

export default useScrollFade;
