import { useSpring } from "react-spring";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

// Hook for second text style
export const useSecondTextStyle = (isActive, stages) => {
  const ACTIVE_Y = 25;
  const INACTIVE_Y = stages[2] ? 20 : 15;

  return useSpring({
    top: isActive ? ACTIVE_Y : INACTIVE_Y,
  });
};

// Static style definition for linear gradient
const gradientStyle = {
  background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
  WebkitBackgroundClip: "text",
  lineHeight: "80px",
};

// Hook for text style
export const useTextStyle = (isActive, stages) => {
  const memoizedValues = useMemo(() => {
    return {
      fontSize: isActive ? 120 : 100,
      left: stages[2] ? 5 : 25,
      top: stages[2] ? -20 : 0,
    };
  }, [isActive, stages]);

  const textStyle = useSpring({
    ...gradientStyle,
    fontSize: memoizedValues.fontSize,
    opacity: stages[2] || stages[3] ? 0.05 : isActive ? 0.5 : 0.2,
    left: memoizedValues.left,
    top: memoizedValues.top,
  });

  return textStyle;
};

// Hook for title animation style
export const useTitleAnimationStyle = (seqId) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);

  const CONFIG = [1800, 300, 350]; // [Initial delay, Incremental delay, Duration]

  const titleStyle = useSpring({
    from: { opacity: 0, scale: 1.2 },
    to: { opacity: visibility ? 0.8 : 0, scale: visibility ? 1 : 1.2 },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: { duration: animationFinished ? undefined : CONFIG[2] },
    onRest: () => setAnimationFinished(true),
  });

  const MainStyle = useSpring({
    from: { opacity: 0, y: 5 * seqId, scale: 1.1 },
    to: {
      opacity: visibility ? 0.8 : 0,
      y: visibility ? 0 : 5 * seqId,
      scale: visibility ? 1 : 1.1,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: { duration: animationFinished ? undefined : CONFIG[2] },
    onRest: () => setAnimationFinished(true),
  });

  return { MainStyle, titleStyle };
};

// Hook for title style
export const useTitleStyle = (isActive, stages) => {
  const ACTIVE_Y = 0;
  const INACTIVE_Y = stages[2] ? 100 : 15;
  return useSpring({
    marginTop: isActive ? ACTIVE_Y : INACTIVE_Y,
  });
};

export const useTitleWidthStyle = (isActive, widths, widthSplit) => {
  return useSpring({
    width: widthSplit ? widths[1] : undefined,
    opacity: isActive || !widthSplit ? 1 : 0,
  });
};

export const useMoreStyle = (isActive, fixed, stages) => {
  const ACTIVE_Y = 50;
  const INACTIVE_Y = stages && stages[2] ? 40 : 35;
  const FIXED_Y = 0;

  const transformValue = useMemo(() => {
    let translateY = fixed ? FIXED_Y : isActive ? ACTIVE_Y : INACTIVE_Y;
    return `translate3d(0, ${translateY}px, 0)`;
  }, [isActive, fixed, INACTIVE_Y]);

  return useSpring({
    transform: transformValue,
    marginRight: !isActive ? 48 : 0,
    paddingRight: !isActive ? 0 : 15,
  });
};

export const useClickOtherFade = (otherActive, progress) => {
  return useSpring({
    filter:
      otherActive && progress !== 1 ? "blur(20px)" : `blur(${5 * progress}px)`,
  });
};
