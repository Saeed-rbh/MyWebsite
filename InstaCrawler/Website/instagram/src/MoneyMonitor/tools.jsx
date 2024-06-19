import { useEffect, useState, useCallback } from "react";
import { useSpring, animated } from "react-spring";

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

export const ScalableElement = ({
  as: Component = "h1",
  children,
  className,
  onClick,
  key,
  style,
}) => {
  const [isScaled, setIsScaled] = useState(false);

  const handleMouseDown = useCallback(() => setIsScaled(true), []);
  const handleMouseUp = useCallback(() => setIsScaled(false), []);

  const style_2 = useSpring({
    scale: isScaled ? 0.9 : 1,
  });

  const AnimatedComponent = animated(Component);

  return (
    <AnimatedComponent
      key={key}
      className={className}
      style={{ ...style, ...style_2 }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </AnimatedComponent>
  );
};
