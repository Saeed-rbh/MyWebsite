import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, easings } from "react-spring";
import useDelayedClickEffect from "./useDelayedClickEffect"; // Import custom hook
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";

const ResumeInfo = ({
  handleClickCV,
  handleClickResearch,
  resumeClicked,
  MenuHide,
  screenWidth,
}) => {
  const Ref_1 = useRef(null);
  const Style_1 = useHoverMoveEffect(Ref_1, 50, 0.2);

  const Ref_2 = useRef(null);
  const Style_2 = useHoverMoveEffect(Ref_2, 50, 0.2);

  const [delayedResumeClicked, setDelayedResumeClicked] = useState(true);
  useDelayedClickEffect(setDelayedResumeClicked, resumeClicked, 2000);
  const resumeInfoOpenSpring = useSpring({
    opacity: resumeClicked && MenuHide ? "0" : "1",
    width: "50px",
    transform: !resumeClicked
      ? screenWidth < 1120
        ? "translate3d(0, 0, 0)"
        : "translate3d(0, 0, 0)"
      : screenWidth < 1120
        ? "translate3d(0, 25px, 0)"
        : "translate3d(0, 25px, 0)",
    config: {
      duration: 300,
      easing: easings.easeOutCubic,
    },
  });
  return (
    <animated.div className="resumee" style={resumeInfoOpenSpring}>
      <div className="Social-Media">
        <animated.p>ACADEMIC</animated.p>
      </div>
      <animated.div className="social" style={Style_1} ref={Ref_1}>
        {!delayedResumeClicked && (
          <>
            <button onClick={handleClickCV}>RESUME</button>
            <button onClick={handleClickResearch} style={Style_2} ref={Ref_2}><span>RESEARCH STORY</span></button>
          </>
        )}
      </animated.div>
    </animated.div>
  );
};

export default ResumeInfo;
