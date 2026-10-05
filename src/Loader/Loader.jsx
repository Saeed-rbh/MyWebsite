import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";
import { updateVisibility } from "../actions/Actions";
import { hasSeenIntro, markIntroSeen } from "./introSession";

const PREPARE_TIME = 750;
const MINIMUM_DISPLAY_TIME = 1150;
const CONTENT_EXIT_TIME = 300;
const EXIT_TIME = 800;

const Loader = ({ routeReady }) => {
  const dispatch = useDispatch();
  const visibility = useSelector((state) => state.ui.visibility);
  const [introSeen] = useState(() => hasSeenIntro() || window.location.pathname !== "/");
  const [entered, setEntered] = useState(false);
  const [retiring, setRetiring] = useState(false);
  const [fade, setFade] = useState(false);
  const [showLoader, setShowLoader] = useState(!introSeen);
  const [minimumElapsed, setMinimumElapsed] = useState(introSeen);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const dataReady = useSelector((state) => state.data.academicData.length > 0);

  useEffect(() => {
    if (introSeen) markIntroSeen();
  }, [introSeen]);

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
    if (introSeen) return undefined;
    const timer = setTimeout(() => setMinimumElapsed(true), reducedMotion ? 0 : MINIMUM_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, [introSeen, reducedMotion]);

  useEffect(() => {
    if (!dataReady || visibility) return undefined;
    const timer = setTimeout(() => dispatch(updateVisibility(true)), reducedMotion || introSeen ? 0 : PREPARE_TIME);
    return () => clearTimeout(timer);
  }, [dataReady, dispatch, introSeen, reducedMotion, visibility]);

  useEffect(() => {
    if (!visibility || !routeReady || !minimumElapsed) return undefined;
    const timer = setTimeout(() => setRetiring(true), reducedMotion ? 0 : 120);
    return () => clearTimeout(timer);
  }, [minimumElapsed, reducedMotion, routeReady, visibility]);

  useEffect(() => {
    if (!retiring) return undefined;
    const timer = setTimeout(() => setFade(true), reducedMotion ? 0 : CONTENT_EXIT_TIME);
    return () => clearTimeout(timer);
  }, [retiring, reducedMotion]);

  useEffect(() => {
    if (!fade) return undefined;
    const timer = setTimeout(() => {
      markIntroSeen();
      setShowLoader(false);
    }, reducedMotion ? 0 : EXIT_TIME + 150);
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
      <div
        className={`Intro${entered ? " Intro--entered" : ""}${retiring ? " Intro--retiring" : ""}${fade ? " Intro--exiting" : ""}`}
        id="Intro"
        role="status"
        aria-label="Loading Saeed Arabha's portfolio"
        onTransitionEnd={(event) => {
          if (fade && event.target === event.currentTarget && event.propertyName === "opacity") {
            markIntroSeen();
            setShowLoader(false);
          }
        }}
      >
        <GrapheneCell
          text="Saeed Arabha"
          subtext="MATERIALS · RESEARCH · ENGINEERING"
        />
      </div>
    )
  );
};
export default Loader;
