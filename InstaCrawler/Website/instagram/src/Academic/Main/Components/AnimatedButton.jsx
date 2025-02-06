import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";

const useAnimationState = (
  isSelected,
  delayConfig,
  index,
  visibility,
  state,
  resumeClicked
) => {
  const [animationFinished, setAnimationFinished] = useState(false);

  const springProps = useSpring({
    // from: { opacity: 0, x: state ? 30 : 0, scale: state ? 1.2 : 1 },
    // to: {
    opacity:
      resumeClicked === 1
        ? state
          ? 1
          : visibility
          ? isSelected
            ? 0.9
            : 0.5
          : 0
        : 0,
    x:
      resumeClicked === 1
        ? visibility
          ? 0
          : state
          ? 30
          : 0
        : resumeClicked === 2
        ? -10
        : 10,
    scale: resumeClicked === 1 ? (visibility ? 1 : state ? 1.2 : 1) : 1,
    // },
    delay:
      resumeClicked === 1
        ? animationFinished
          ? 0
          : delayConfig[0] + delayConfig[1] * index
        : delayConfig[1] * index,
    config: {
      duration:
        resumeClicked === 1
          ? animationFinished
            ? undefined
            : delayConfig[2]
          : 500,
    },
    onRest: () => setAnimationFinished(true),
  });

  return springProps;
};

// Custom hook for SpringStyle
const useSpringStyle = (index, isSelected, resumeClicked) => {
  const { visibility } = useSelector((state) => state.visibility);
  const delayConfig = [1000, 200, 600];
  return useAnimationState(
    isSelected,
    delayConfig,
    index,
    visibility,
    true,
    resumeClicked
  );
};

// Custom hook for OpacityStyle
const useOpacityStyle = (index, isSelected, resumeClicked) => {
  const { visibility } = useSelector((state) => state.visibility);
  const delayConfig = [1300, 200, 600];
  return useAnimationState(
    isSelected,
    delayConfig,
    index,
    visibility,
    false,
    resumeClicked
  );
};

// AnimatedButton component
const AnimatedButton = ({
  index,
  item,
  isSelected,
  onClick,
  resumeClicked,
}) => {
  const springStyle = useSpringStyle(index, isSelected, resumeClicked);
  const opacityStyle = useOpacityStyle(index, isSelected, resumeClicked);

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
