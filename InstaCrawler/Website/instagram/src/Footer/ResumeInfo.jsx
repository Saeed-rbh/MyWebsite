import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, easings } from "react-spring";
import useDelayedClickEffect from "./useDelayedClickEffect"; // Import custom hook

const ResumeInfo = ({
  handleClickCV,
  resumeClicked,
  MenuHide,
  screenWidth,
}) => {
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
      <p1 className="Social-Media">
        <animated.p>MY RESUME</animated.p>
      </p1>
      <animated.div className="social">
        {!delayedResumeClicked && (
          <Link onClick={handleClickCV} to="/AcademicCV">
            ACADEMIC BACKGROUND
          </Link>
        )}
      </animated.div>
    </animated.div>
  );
};

export default ResumeInfo;