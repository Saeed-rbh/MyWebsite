import React from "react";
import { animated } from "react-spring";

function AnimatedTextStyle({ children, style }) {
  return (
    <animated.p style={style} className="MoreInfoTitle">
      {children}
    </animated.p>
  );
}

export default AnimatedTextStyle;
