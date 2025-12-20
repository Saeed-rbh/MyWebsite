import React, { useEffect } from "react";
import { useSprings, animated } from "react-spring";
import PropTypes from "prop-types";
import useMouseMove from "./useMouseMove";

const SPRING_COUNT = 3;
const INITIAL_SPRING_STATE = {
  from: { opacity: 0, transform: "translateY(-50px)" },
  to: { opacity: 0.2, transform: "translateY(0px)" },
  config: { duration: 1000 },
};
const PHASE_FADE_OUT_UP = "fadeOutUp";
const PHASE_FADE_IN_DOWN = "fadeInDown";

const updateBounceState = (phase, setBounce) => {
  if (phase === PHASE_FADE_OUT_UP) setBounce(true);
  if (phase === PHASE_FADE_IN_DOWN) setBounce(false);
};

const setSpringProperties = (bounce, phase, setLineSprings) => {
  setLineSprings((index) => ({
    transform: bounce ? "translateY(-50px)" : "translateY(0px)",
    opacity: bounce ? 0 : 0.2,
    delay: phase === PHASE_FADE_OUT_UP ? 100 * index : 1000 + 100 * index,
    config: { duration: 300 },
  }));
};

const CapturedMomentsLines = ({ bounce, setBounce, phase }) => {
  const [lineSprings, setLineSprings] = useSprings(
    SPRING_COUNT,
    () => INITIAL_SPRING_STATE
  );

  useEffect(() => {
    updateBounceState(phase, setBounce);
    setSpringProperties(bounce, phase, setLineSprings);
  }, [phase, bounce, setBounce, setLineSprings]);

  const springProps = useMouseMove(50);

  return (
    <animated.div className="CapturedMomentsLines" style={springProps}>
      {lineSprings.map((props, index) => (
        <animated.div
          key={index}
          className="CapturedMomentsLine"
          style={props}
        ></animated.div>
      ))}
    </animated.div>
  );
};

CapturedMomentsLines.propTypes = {
  bounce: PropTypes.bool.isRequired,
  setBounce: PropTypes.func.isRequired,
  phase: PropTypes.string.isRequired,
};

export default CapturedMomentsLines;
