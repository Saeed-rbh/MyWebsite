import React, { useState, useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import { setVisible, selectVisibility } from "../visibilitySlice";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";

const LOADING_TIME = 4;
const usePageLoad = (dispatch) => {
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        dispatch(setVisible(false));
      }, LOADING_TIME * 1.2);
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [dispatch]);
};
const Loader = ({ onLoad }) => {
  const dispatch = useDispatch();
  const visible = useSelector(selectVisibility);
  const [fade, setFade] = useState(false);

  usePageLoad(dispatch);
  useEffect(() => {
    setTimeout(() => {
      setFade(true);
    }, LOADING_TIME);
  }, []);
  const closeIntroAnimation = useSpring({
    opacity: fade ? 0 : 1,
    delay: fade ? 1000 : 0,
    duration: 600,
    easing: easings.easeOutCubic,
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
    visible && (
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
