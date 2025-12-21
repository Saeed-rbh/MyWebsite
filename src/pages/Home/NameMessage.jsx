import React from "react";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";

const NameMessage = ({ MenuHide, delay }) => {
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  return (
    <animated.b style={springProps}>
      I'm Saeed Arabha
      <animated.div style={springProps} className="b-hr"></animated.div>
    </animated.b>
  );
};

export default NameMessage;
