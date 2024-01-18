import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";

const SpringStyle = ({ index, isSelected }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const CONFIG = [1000, 200, 600];
  return useSpring({
    from: { opacity: 0, x: 30, scale: 1.2 },
    to: {
      opacity: visibility ? (isSelected ? 0.8 : 0.4) : 0,
      x: visibility ? 0 : 30,
      scale: visibility ? 1 : 1.2,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * index,
    config: {
      duration: animationFinished ? undefined : CONFIG[2],
    },
    onRest: () => setAnimationFinished(true),
  });
};

const OpacityStyle = ({ index, isSelected }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);
  const CONFIG = [1300, 200, 600];
  return useSpring({
    from: { opacity: 0 },
    to: {
      opacity: visibility ? 1 : 0,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * index,
    config: {
      duration: animationFinished ? undefined : CONFIG[2],
    },
    onRest: () => setAnimationFinished(true),
  });
};

const AnimatedButton = ({
  index,
  item,
  isSelected,
  onClick,
  duration,
  initialDelay,
  delayIncrement,
}) => {
  const springStyle = SpringStyle({
    index,
    isSelected,
    duration,
    initialDelay,
    delayIncrement,
  });

  const opacityStyle = OpacityStyle({
    index,
    isSelected,
    duration,
    initialDelay,
    delayIncrement,
  });

  return (
    <animated.button style={springStyle} onClick={onClick}>
      <animated.p style={opacityStyle}>{item.title}</animated.p>
    </animated.button>
  );
};

export default React.memo(AnimatedButton);
