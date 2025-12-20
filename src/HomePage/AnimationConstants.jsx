import { easings } from "react-spring";
const AnimationConstants = (MenuHide, delay) => {
  return {
    opacity: MenuHide === 1 ? 0.9 : 0,
    y: MenuHide === 1 ? 0 : MenuHide === 2 ? -10 : 10,
    config: { duration: 500 },
    delay,
    easing: easings.easeOutCubic,
  };
};
export default AnimationConstants;
