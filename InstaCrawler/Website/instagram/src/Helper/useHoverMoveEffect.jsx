import { useEffect, useState } from "react";
import { useSpring } from "react-spring";

const useHoverMoveEffect = (ref, distanceThreshold = 100, moveFactor = 0.2) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const linkCenterX = rect.left + rect.width / 2;
      const linkCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(event.clientX - linkCenterX, 2) +
          Math.pow(event.clientY - linkCenterY, 2)
      );

      if (distance <= distanceThreshold) {
        setOffset({
          x: (event.clientX - linkCenterX) * moveFactor,
          y: (event.clientY - linkCenterY) * moveFactor,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref, distanceThreshold, moveFactor]);

  return useSpring({
    x: offset.x,
    y: offset.y,
  });
};
export default useHoverMoveEffect;
