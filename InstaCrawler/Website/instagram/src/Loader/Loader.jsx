import React, { useState, useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";
import { updateVisibility } from "../actions/Actions";

const LOADING_TIME = 2000;

const Loader = () => {
  const { visibility } = useSelector((state) => state.visibility);
  const dispatch = useDispatch();
  const [fade, setFade] = useState(false);

  const academicData = useSelector((state) => state.data.academicData);
  useEffect(() => {
    if (academicData.length > 0) {
      setTimeout(() => {
        setFade(true);
      }, LOADING_TIME);
    }
  }, [dispatch, academicData]);

  const closeIntroAnimation = useSpring({
    opacity: fade ? 0 : 1,
    // delay: fade ? 1000 : 0,
    // bottom: fade ? "-100%" : "0%",
    borderRadius: "50px",
    config: { duration: 500 },
    easing: easings.easeOutCubic,
    onRest: () => dispatch(updateVisibility(true)),
  });

  useEffect(() => {
    const updateLayout = () => {
      const element = document.getElementById("Intro");
      if (element) {
        const computedStyle = window.getComputedStyle(document.body);
        const safeAreaInsetBottom = computedStyle.getPropertyValue(
          "--safe-area-inset-bottom"
        );
        element.style.paddingBottom = `calc(${safeAreaInsetBottom} + 20px)`;
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  return (
    !visibility && (
      <animated.div style={closeIntroAnimation} className="Intro" id="Intro">
        <GrapheneCell
          fade={fade}
          text="Welcome To My Personal Website"
          subtext="LOADING"
        />
      </animated.div>
    )
  );
};
export default Loader;
