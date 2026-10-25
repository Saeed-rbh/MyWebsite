import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./PageTransition.css";

// Canonical paths keep redirects and trailing-slash corrections in one transition.
export function canonicalPath(path) {
  try { path = decodeURIComponent(path); } catch { /* Keep malformed paths usable. */ }
  path = path.toLowerCase().replace(/\/$/, "") || "/";
  return ({ "/commercialization": "/venture", "/work-story": "/r&d-portfolio" })[path] || path;
}

export function pageIdentity(path) {
  const page = canonicalPath(path);
  if (page.startsWith("/journal/")) return ["Research notes", "A closer look at the paper"];
  return ({
    "/": ["Home", "Saeed Arabha · Materials, research, engineering"],
    "/r&d-portfolio": ["R&D portfolio", "Process, evidence, application"],
    "/venture": ["Venture", "From materials research to market"],
    "/journal": ["Journal", "Papers and research explained"],
    "/academiccv": ["Academic CV", "Experience, publications, skills"],
    "/simulate-atoms": ["Atomic simulation", "Following atoms, one step at a time"],
    "/graphene": ["Graphene", "Exploring materials at the nanoscale"],
    "/mafia": ["Mafia", "Let the game begin"],
  })[page] || ["Saeed Arabha", "Materials · Research · Engineering"];
}

// Matching cubic paths let Motion interpolate the edge itself, like a stretching sheet.
const TOP_FLAT = "M 0 100 C 24 100 76 100 100 100 L 100 101 L 0 101 Z";
const TOP_SWELL = "M 0 100 C 20 -18 65 -30 100 100 L 100 101 L 0 101 Z";
const TOP_SETTLE = "M 0 100 C 30 22 80 40 100 100 L 100 101 L 0 101 Z";
const BOTTOM_FLAT = "M 0 0 C 24 0 76 0 100 0 L 100 -1 L 0 -1 Z";
const BOTTOM_SWELL = "M 0 0 C 18 112 72 130 100 0 L 100 -1 L 0 -1 Z";
const BOTTOM_SETTLE = "M 0 0 C 28 58 82 36 100 0 L 100 -1 L 0 -1 Z";

const isPrivate = (path) => /^\/(admin|login)(\/|$)/i.test(path);
const CONTENT_REST = { opacity: 1, y: 0, scale: 1 };
const CONTENT_ENTER = { opacity: 0, y: 42, scale: 0.986 };
const EASE_ENTER = [0.22, 1, 0.36, 1];

export default function PageTransition({ children, onInitialReady }) {
  const location = useLocation();
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const content = useAnimationControls();
  const curtain = useAnimationControls();
  const leadingEdge = useAnimationControls();
  const trailingEdge = useAnimationControls();
  const words = useAnimationControls();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState(() => pageIdentity(location.pathname));
  const displayed = useRef(location);
  const readyWaiter = useRef(null);
  const readyKey = useRef(null);
  const transitioning = useRef(false);
  const generation = useRef(0);
  const currentPhase = useRef("idle");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const onReady = useCallback(() => {
    readyKey.current = displayLocation.key;
    onInitialReady(true);
    if (readyWaiter.current?.key === displayLocation.key) readyWaiter.current.resolve();
  }, [displayLocation.key, onInitialReady]);

  useEffect(() => {
    const run = ++generation.current;
    let cancelled = false;
    let entranceTimer;
    let releaseEntrance;
    const active = () => !cancelled && generation.current === run;
    const changePhase = (nextPhase) => {
      currentPhase.current = nextPhase;
      setPhase(nextPhase);
    };
    const commit = () => {
      displayed.current = location;
      setDisplayLocation(location);
    };

    async function transition() {
      const samePage = canonicalPath(displayed.current.pathname) === canonicalPath(location.pathname);
      if (reducedMotion || isPrivate(location.pathname) || isPrivate(displayed.current.pathname) || (samePage && !transitioning.current)) {
        commit();
        content.set(CONTENT_REST);
        curtain.set({ y: "110%" });
        transitioning.current = false;
        changePhase("idle");
        setBusy(false);
        return;
      }
      setLabel(pageIdentity(location.pathname));
      transitioning.current = true;
      setBusy(true);
      const alreadyCovered = currentPhase.current === "covered";
      // Let the current page visibly recede before the black sheet arrives.
      // A redirect while covered keeps the curtain shut instead of replaying the exit.
      if (currentPhase.current !== "covered" && currentPhase.current !== "revealing") {
        changePhase("exiting");
        await content.start({
          opacity: 0, y: -26, scale: 0.976,
          transition: { duration: 0.34, ease: [0.4, 0, 0.7, 1] },
        });
        if (!active()) return;
      }
      words.set({ opacity: 0, y: 24 });
      leadingEdge.set({ d: TOP_FLAT });
      trailingEdge.set({ d: BOTTOM_FLAT });
      if (!alreadyCovered) {
        changePhase("covering");
        await Promise.all([
          leadingEdge.start({
            d: [TOP_FLAT, TOP_SWELL, TOP_SETTLE, TOP_FLAT],
            transition: { duration: 0.68, times: [0, 0.36, 0.72, 1], ease: "easeInOut" },
          }),
          curtain.start({ y: "0%", transition: { duration: 0.68, ease: [0.65, 0, 0.25, 1] } }),
        ]);
      }
      if (!active()) return;
      changePhase("covered");
      content.set(CONTENT_ENTER);
      // Commit only behind the opaque curtain. Suspense's readiness signal gates reveal.
      const ready = new Promise((resolve) => {
        readyWaiter.current = { key: location.key, resolve };
        if (readyKey.current === location.key) resolve();
      });
      commit();
      await Promise.all([
        ready,
        words.start({ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }),
      ]);
      if (!active()) return;
      readyWaiter.current = null;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      changePhase("revealing");
      words.start({ opacity: 0, y: -30, transition: { duration: 0.3 } });
      await Promise.all([
        (async () => {
          // Start late enough to see the entrance, and let it settle after the sheet clears.
          await new Promise((resolve) => {
            releaseEntrance = resolve;
            entranceTimer = window.setTimeout(resolve, 460);
          });
          if (!active()) return;
          changePhase("entering");
          await content.start({
            ...CONTENT_REST,
            transition: { duration: 0.86, ease: EASE_ENTER },
          });
        })(),
        trailingEdge.start({
          d: [BOTTOM_FLAT, BOTTOM_SWELL, BOTTOM_SETTLE, BOTTOM_FLAT],
          transition: { duration: 0.92, times: [0, 0.3, 0.68, 1], ease: "easeInOut" },
        }),
        curtain.start({ y: "-100%", transition: { duration: 0.92, ease: [0.65, 0, 0.25, 1] } }),
      ]);
      if (!active()) return;
      transitioning.current = false;
      changePhase("idle");
      setBusy(false);
      curtain.set({ y: "110%" });
    }
    transition();
    return () => {
      cancelled = true;
      window.clearTimeout(entranceTimer);
      releaseEntrance?.();
      readyWaiter.current?.resolve();
      readyWaiter.current = null;
      content.stop();
      curtain.stop();
      leadingEdge.stop();
      trailingEdge.stop();
      words.stop();
    };
  }, [location, reducedMotion, content, curtain, leadingEdge, trailingEdge, words]);

  useEffect(() => {
    if (!busy) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preventScroll = (event) => event.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [busy]);

  return <>
    <motion.div className="PageTransitionContent" initial={false} animate={content}
      data-transition-phase={phase} inert={busy ? true : undefined} aria-busy={busy}>
      <Routes location={displayLocation}>
        <Route path="*" element={children(onReady)} />
      </Routes>
    </motion.div>
    <div className="PageTransition" data-active={busy} aria-hidden="true" data-site-motion-ignore="true">
      <motion.div className="PageTransitionCurtain" initial={{ y: "110%" }} animate={curtain}>
        <svg className="PageTransitionCurve PageTransitionCurve--top" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path initial={{ d: TOP_FLAT }} animate={leadingEdge} />
        </svg>
        <motion.div className="PageTransitionWords" initial={{ opacity: 0 }} animate={words}>
          <div className="PageTransitionTitle"><span className="PageTransitionDot" />{label[0]}</div>
          <p>{label[1]}</p>
        </motion.div>
        <svg className="PageTransitionCurve PageTransitionCurve--bottom" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path initial={{ d: BOTTOM_FLAT }} animate={trailingEdge} />
        </svg>
      </motion.div>
    </div>
  </>;
}
