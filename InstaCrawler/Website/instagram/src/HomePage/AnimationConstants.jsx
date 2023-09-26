import { easings } from "react-spring";
const AnimationConstants = (MenuHide, delay) => {
  return MenuHide
    ? {
        from: { opacity: 0, y: 10 },
        to: { opacity: 0.9, y: 0 },
        config: { duration: 500 },
        delay,
        easing: easings.easeOutCubic,
      }
    : {
        from: { opacity: 0.9, y: 0 },
        to: { opacity: 0, y: 10 },
        config: { duration: 500 },
        delay,
        easing: easings.easeOutCubic,
      };
};
export default AnimationConstants;
