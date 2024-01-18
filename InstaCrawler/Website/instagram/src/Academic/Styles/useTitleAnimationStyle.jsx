import { useState } from "react";
import { useSpring } from "react-spring";
import { useSelector } from "react-redux";

export const useTitleAnimationStyle = (seqId, fixed) => {
  const { visibility } = useSelector((state) => state.visibility);
  const [animationFinished, setAnimationFinished] = useState(false);

  const CONFIG = [1800, 300, 350];
  const titleStyle = useSpring({
    from: {
      opacity: 0,
      scale: 1.2,
    },
    to: {
      opacity: visibility ? 0.8 : 0,
      scale: visibility ? 1 : 1.2,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: {
      duration: animationFinished ? undefined : CONFIG[2],
    },
    onRest: () => setAnimationFinished(true),
  });
  const MainStyle = useSpring({
    from: {
      opacity: 0,
      y: 5 * seqId,
      scale: 1.1,
    },
    to: {
      opacity: visibility ? 0.8 : 0,
      y: visibility ? 0 : 5 * seqId,
      scale: visibility ? 1 : 1.1,
    },
    delay: animationFinished ? 0 : CONFIG[0] + CONFIG[1] * seqId,
    config: {
      duration: animationFinished ? undefined : CONFIG[2],
    },
    onRest: () => setAnimationFinished(true),
  });
  return { MainStyle, titleStyle };
};
