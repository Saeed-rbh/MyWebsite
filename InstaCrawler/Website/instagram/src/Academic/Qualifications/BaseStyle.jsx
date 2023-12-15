import React from "react";
import { animated } from "react-spring";

function BaseStyle({
  ref,
  children,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <animated.div
      className="Qualifications"
      ref={ref}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </animated.div>
  );
}

export default BaseStyle;
