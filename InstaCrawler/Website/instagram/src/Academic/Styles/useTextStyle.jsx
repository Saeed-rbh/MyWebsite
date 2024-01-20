import { useSpring } from "react-spring";
import { useMemo } from "react";

const useTextStyle = (isActive, stages) => {
  const memoizedValues = useMemo(() => {
    // Perform any complex calculation here
    return {
      fontSize: isActive ? "120px" : "100px",
      left: stages[2] ? "5px" : "25px",
      top: stages[2] ? "-20px" : "0px",
    };
  }, [isActive, stages]);

  const fontSize = useSpring({
    background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
    WebkitBackgroundClip: "text",
    fontSize: memoizedValues.fontSize,
    lineHeight: "80px",
    opacity: stages[2] || stages[3] ? 0.05 : isActive ? 0.5 : 0.2,
    left: memoizedValues.left,
    top: memoizedValues.top,
  });

  return fontSize;
};

export default useTextStyle;
