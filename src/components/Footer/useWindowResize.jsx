import { useState, useEffect } from "react";

const useWindowResize = () => {
  const [isCross, setIsCross] = useState(window.innerWidth > 767);

  useEffect(() => {
    const handleResize = () => {
      setIsCross(window.innerWidth > 767);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [isCross, setIsCross]; // Return both state and setter
};

export default useWindowResize;
