import { useState, useEffect } from "react";

const useElementSize = (elementId) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let intervalId;

    const updateSize = () => {
      const element = document.getElementById(elementId);
      if (element) {
        setSize({
          width: element.offsetWidth,
          height: element.offsetHeight,
        });
      }
    };

    const checkElementAndSetSize = () => {
      const element = document.getElementById(elementId);
      if (element) {
        clearInterval(intervalId);
        updateSize();
        window.addEventListener("resize", updateSize);
      }
    };

    intervalId = setInterval(checkElementAndSetSize, 100);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", updateSize);
    };
  }, [elementId]);
  return size;
};

export default useElementSize;
