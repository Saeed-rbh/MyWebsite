import { useSpring, easings } from "react-spring";

export const useAnimatedStyle = (data) =>
  useSpring({
    backgroundColor: data.background,
    top: data.top,
    height: data.height,
    width: data.width,
    minWidth: `415px`,
    right: `55%`,
    easing: easings.easeOutCubic,
    padding: `${data.padding[0]}px ${data.padding[1]}px ${data.padding[2]}px ${data.padding[3]}px`,
  });
