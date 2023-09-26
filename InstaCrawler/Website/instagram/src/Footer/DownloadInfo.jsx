import React, { useState } from "react";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { useSpring, animated, easings } from "react-spring";
import useDelayedClickEffect from "./useDelayedClickEffect"; // Import custom hook

const DownloadInfo = ({ resumeClicked }) => {
  const [delayedResumeClicked, setDelayedResumeClicked] = useState(true);
  useDelayedClickEffect(setDelayedResumeClicked, !resumeClicked, 2000);

  const downloadInfoOpenSpring = useSpring({
    opacity: !resumeClicked ? "0" : "1",
    width: "50px",
    transform: !resumeClicked
      ? "translate3d(0,-15px,0) scale(1.2)"
      : "translate3d(0,0px,0) scale(1.2)",
    flex: "0",
    fontSize: "15px",
    config: {
      duration: 400,
      easing: easings.easeOutCubic,
    },
  });
  return (
    <animated.div className="resumee" style={downloadInfoOpenSpring}>
      <animated.div className="social">
        <RiDownloadCloud2Line className="DownloadSvg" />
        {!delayedResumeClicked && (
          <a href="https://www.instagram.com/saeed_rbh">Download PDF Version</a>
        )}
      </animated.div>
    </animated.div>
  );
};

export default DownloadInfo;
