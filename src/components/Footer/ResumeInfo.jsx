import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, easings } from "react-spring";
import useDelayedClickEffect from "./useDelayedClickEffect";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import ResearchStoryIcon from "./ResearchStoryIcon";

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
  const [isHoveredResearch, setIsHoveredResearch] = useState(false);
  const [isHoveredResume, setIsHoveredResume] = useState(false);
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
        <animated.p>PORTFOLIO</animated.p>
      </div>
      <div className="social">
        {!delayedResumeClicked && (
          <>
            <animated.button
              onClick={handleClickCV}
              style={{ ...Style_1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              ref={Ref_1}
              onMouseEnter={() => setIsHoveredResume(true)}
              onMouseLeave={() => setIsHoveredResume(false)}
            >
              <span>RESUME</span>
            </animated.button>
            <animated.button
              onClick={handleClickResearch}
              style={{ ...Style_2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              ref={Ref_2}
              onMouseEnter={() => setIsHoveredResearch(true)}
              onMouseLeave={() => setIsHoveredResearch(false)}
            >
              <ResearchStoryIcon isHovered={isHoveredResearch} />
              <span>RESEARCH STORY</span>
            </animated.button>
          </>
        )}
      </div>
    </animated.div>
  );
};

export default ResumeInfo;
