import React, { useState, useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";
import { updateVisibility } from "../actions/Actions";

const LOADING_TIME = 2000;
const usePageLoad = (dispatch) => {
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        dispatch(updateVisibility(true));
      }, LOADING_TIME * 1.2);
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [dispatch]);
};
const Loader = ({ onLoad }) => {
  const { visibility } = useSelector((state) => state.visibility);
  const dispatch = useDispatch();
  const [fade, setFade] = useState(false);

  usePageLoad(dispatch);

  const closeIntroAnimation = useSpring({
    opacity: visibility ? 0 : 1,
    delay: visibility ? 1000 : 0,
    duration: LOADING_TIME,
    easing: easings.easeOutCubic,
    onRest: () => setFade(true),
  });
  useEffect(() => {
    setTimeout(() => {
      onLoad();
    }, 1000);
  }, [onLoad]);
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
    !fade && (
      <animated.div style={closeIntroAnimation} className="Intro" id="Intro">
        <GrapheneCell
          fade={visibility}
          text="Welcome To My Personal Website"
          subtext="LOADING"
        />
      </animated.div>
    )
  );
};
export default Loader;
