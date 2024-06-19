import { useEffect, useState } from "react";

export const formatNetTotal = (netTotal) => {
  const floatNetTotal = parseFloat(netTotal);
  if (floatNetTotal > 10000) {
    return floatNetTotal.toFixed(0);
  } else if (floatNetTotal > 1000) {
    return floatNetTotal.toFixed(1);
  } else {
    return floatNetTotal.toFixed(2);
  }
};

export const useWindowHeight = (initialOffset) => {
  const [height, setHeight] = useState(window.innerHeight - initialOffset);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight - initialOffset);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialOffset]);

  return height;
};