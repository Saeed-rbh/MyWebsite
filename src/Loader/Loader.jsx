import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";
import { updateVisibility } from "../actions/Actions";

const LOADING_TIME = 1000;

const Loader = () => {
  const dispatch = useDispatch();
  const [entered, setEntered] = useState(false);
  const [fade, setFade] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const academicData = useSelector((state) => state.data.academicData);

  useEffect(() => {
    let secondFrame;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    if (academicData.length > 0) {
      const timer = setTimeout(() => {
        setFade(true);
        dispatch(updateVisibility(true));
      }, reducedMotion ? 0 : LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [academicData, dispatch, reducedMotion]);

  useEffect(() => {
    if (!fade) return undefined;
    const timer = setTimeout(() => setShowLoader(false), reducedMotion ? 0 : 700);
    return () => clearTimeout(timer);
  }, [fade, reducedMotion]);

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
    showLoader && (
      <div className={`Intro${entered ? " Intro--entered" : ""}${fade ? " Intro--exiting" : ""}`} id="Intro" role="status" aria-label="Loading Saeed Arabha's portfolio">
        <GrapheneCell
          text="Saeed Arabha"
          subtext="MATERIALS · RESEARCH · ENGINEERING"
        />
      </div>
    )
  );
};
export default Loader;
