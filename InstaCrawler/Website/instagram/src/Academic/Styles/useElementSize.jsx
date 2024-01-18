import { useState, useEffect } from "react";

const useElementSize = (elementId) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    maxHeight: 0,
    maxWidth: 0,
  });

  useEffect(() => {
    let intervalId;

    const updateSize = () => {
      const element = document.getElementById(elementId);
      if (element) {
        setSize({
          width: element.offsetWidth,
          height: element.offsetHeight,
          Top: element.offsetTop,
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
  }, [elementId, size.width, size.height, size.maxWidth, size.maxHeight]);

  return size;
};

export default useElementSize;
