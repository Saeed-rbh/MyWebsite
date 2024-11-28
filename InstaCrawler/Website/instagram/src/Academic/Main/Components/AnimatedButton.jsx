import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";

const useAnimationState = (
  isSelected,
  delayConfig,
  index,
  visibility,
  state
) => {
  const [animationFinished, setAnimationFinished] = useState(false);

  const springProps = useSpring({
    from: { opacity: 0, x: state ? 30 : 0, scale: state ? 1.2 : 1 },
    to: {
      opacity: state ? 1 : visibility ? (isSelected ? 0.9 : 0.5) : 0,
      x: visibility ? 0 : state ? 30 : 0,
      scale: visibility ? 1 : state ? 1.2 : 1,
    },
    delay: animationFinished ? 0 : delayConfig[0] + delayConfig[1] * index,
    config: {
      duration: animationFinished ? undefined : delayConfig[2],
    },
    onRest: () => setAnimationFinished(true),
  });

  return springProps;
};

// Custom hook for SpringStyle
const useSpringStyle = (index, isSelected) => {
  const { visibility } = useSelector((state) => state.visibility);
  const delayConfig = [1000, 200, 600];
  return useAnimationState(isSelected, delayConfig, index, visibility, true);
};

// Custom hook for OpacityStyle
const useOpacityStyle = (index, isSelected) => {
  const { visibility } = useSelector((state) => state.visibility);
  const delayConfig = [1300, 200, 600];
  return useAnimationState(isSelected, delayConfig, index, visibility, false);
};

// AnimatedButton component
const AnimatedButton = ({ index, item, isSelected, onClick }) => {
  const springStyle = useSpringStyle(index, isSelected);
  const opacityStyle = useOpacityStyle(index, isSelected);

  const handleClick = useCallback(() => {
    if (!onClick) return;
    onClick(index);
  }, [index, onClick]);

  return (
    <animated.button style={springStyle} onClick={handleClick}>
      <animated.p style={opacityStyle}>{item.title}</animated.p>
    </animated.button>
  );
};

export default React.memo(AnimatedButton);
