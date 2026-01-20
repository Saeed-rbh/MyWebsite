import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated, easings } from "react-spring";
import useDelayedClickEffect from "./useDelayedClickEffect"; // Import custom hook
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";

const ResearchInfo = ({
    handleClickResearch,
    researchClicked,
    MenuHide,
    screenWidth,
}) => {
    const Ref_1 = useRef(null);
    const Style_1 = useHoverMoveEffect(Ref_1, 50, 0.2);

    const [delayedResearchClicked, setDelayedResearchClicked] = useState(true);
    useDelayedClickEffect(setDelayedResearchClicked, researchClicked, 2000);

    const researchInfoOpenSpring = useSpring({
        opacity: researchClicked && MenuHide ? "0" : "1",
        width: "50px",
        transform: !researchClicked
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
        <animated.div className="resumee" style={researchInfoOpenSpring}>
            <div className="Social-Media">
                <animated.p>RESEARCH</animated.p>
            </div>
            <animated.div className="social" style={Style_1} ref={Ref_1}>
                {!delayedResearchClicked && (
                    <button onClick={handleClickResearch}>RESEARCH PROGRESS</button>
                )}
            </animated.div>
        </animated.div>
    );
};

export default ResearchInfo;
