import React, { memo } from "react";
import PropTypes from "prop-types";
import { useSpring, animated, easings } from "react-spring";
import { useNavigate } from "react-router-dom";

const DEFAULT_DELAY = 0;
const DEFAULT_DURATION = 400;
const DEFAULT_EASING = easings.easeOutCubic;

const AnimatedOption = memo(
  ({ text, routes, delay = DEFAULT_DELAY, isCross = false }) => {
    const navigate = useNavigate();
    const handleDivClick = (route) => {
      navigate(route);
    };
    const animationProps = useSpring({
      to: {
        opacity: isCross ? 1 : 0,
        transform: isCross ? "translateY(0)" : "translateY(20px)",
      },
      from: {
        opacity: isCross ? 0 : 1,
        transform: isCross ? "translateY(20px)" : "translateY(0)",
      },
      delay,
      config: {
        duration: DEFAULT_DURATION,
        easing: DEFAULT_EASING,
      },
    });
    return (
      <animated.div
        onClick={() => handleDivClick(routes)}
        style={animationProps}
        className="animated-option-wrapper"
      >
        <animated.p className="animated-option">{text}</animated.p>
      </animated.div>
    );
  }
);

AnimatedOption.propTypes = {
  text: PropTypes.string.isRequired,
  delay: PropTypes.number,
  isCross: PropTypes.bool,
};

export default AnimatedOption;
