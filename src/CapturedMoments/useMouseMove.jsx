import { useState, useEffect, useCallback } from "react";
import { useSpring } from "react-spring";

const DEFAULT_CONFIG = { tension: 100, friction: 30 };
const INITIAL_POSITION = { x: 0, y: 0 };

const useMouseMove = (weight) => {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [springProps, setSpringProps] = useSpring(() => ({
    x: "0px",
    y: "0px",
    config: DEFAULT_CONFIG,
  }));
  const updatePosition = useCallback((event) => {
    requestAnimationFrame(() => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    });
  }, []);

  useEffect(() => {
    const attachEvent = () => {
      window.addEventListener("mousemove", updatePosition);
    };

    const detachEvent = () => {
      window.removeEventListener("mousemove", updatePosition);
    };

    attachEvent();
    return detachEvent;
  }, [setPosition, updatePosition]);

  useEffect(() => {
    const { x, y } = position;
    const dx = x - window.innerWidth / 2;
    const dy = y - window.innerHeight / 2;

    setSpringProps({
      x: `${-dx / weight}px`,
      y: `${-dy / weight}px`,
    });
  }, [position, weight, setSpringProps]);

  return springProps;
};

export default useMouseMove;
