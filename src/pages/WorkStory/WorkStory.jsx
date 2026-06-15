import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/SEO/SEO";
import styles from "./WorkStory.module.css";

const chain = [
  "2D Nanomaterials",
  "Process Scale-Up",
  "Metrology & Characterization",
  "Nanoscale Thermal Transport",
  "Computational Modeling",
];

const navItems = [
  { id: "gap", label: "Gap" },
  { id: "process", label: "CFE" },
  { id: "evidence", label: "Proof" },
  { id: "modeling", label: "Model" },
  { id: "industry", label: "Value" },
  { id: "approach", label: "Approach" },
];

const processSteps = [
  "Precursor powder",
  "High-pressure gas",
  "Heated flow",
  "Nozzle acceleration",
  "Exfoliation",
  "Collection",
  "Characterization",
];

const variables = [
  "Pressure",
  "Gas type",
  "Temperature",
  "Flow behavior",
  "Nozzle condition",
  "Precursor material",
  "Recovery method",
  "Material quality",
];

const characterization = [
  {
    name: "Raman spectroscopy",
    proof: "Defects + layer fingerprints.",
  },
  {
    name: "XPS",
    proof: "Surface chemistry.",
  },
  {
    name: "TEM/STEM",
    proof: "Nanoscale structure.",
  },
  {
    name: "SEM",
    proof: "Morphology + distribution.",
  },
  {
    name: "AFM",
    proof: "Thickness + topography.",
  },
  {
    name: "UV-Vis",
    proof: "Optical response.",
  },
  {
    name: "mIRage-Raman",
    proof: "Sub-micron chemical signal.",
  },
];

const modelingNodes = [
  "Experiment",
  "Simulation",
  "Data Analysis",
  "Process Understanding",
];

const useWorkStoryEffects = (scrollRef) => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const lastProgressRef = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    const syncStoryFrameHeight = () => {
      root.style.setProperty("--story-frame-height", `${root.clientHeight}px`);
    };

    syncStoryFrameHeight();
    window.addEventListener("resize", syncStoryFrameHeight);
    window.addEventListener("orientationchange", syncStoryFrameHeight);
    window.visualViewport?.addEventListener("resize", syncStoryFrameHeight);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            entry.target.classList.remove(styles.fadeOutUp);
            entry.target.classList.remove(styles.fadeOutDown);
          } else {
            entry.target.classList.remove(styles.visible);
            if (entry.boundingClientRect.top < 0) {
              entry.target.classList.add(styles.fadeOutUp);
            } else {
              entry.target.classList.add(styles.fadeOutDown);
            }
          }
        });
      },
      { root, threshold: 0.1, rootMargin: "-5% 0px -5% 0px" }
    );

    root.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    return () => {
      window.removeEventListener("resize", syncStoryFrameHeight);
      window.removeEventListener("orientationchange", syncStoryFrameHeight);
      window.visualViewport?.removeEventListener("resize", syncStoryFrameHeight);
      revealObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const isMobile = window.matchMedia("(max-width: 840px)").matches;
      const maxScroll = root.scrollHeight - root.clientHeight;
      const nextProgress = maxScroll <= 0 ? 0 : (root.scrollTop / maxScroll) * 100;
      const progressRatio = nextProgress / 100;

      if (Math.abs(nextProgress - lastProgressRef.current) > 0.6) {
        lastProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      const scrollRatio = root.scrollTop / root.clientHeight;
      const bgOpacity = scrollRatio <= 0.05
        ? 0.8
        : Math.max(0.2, 0.8 - ((scrollRatio - 0.05) * 1.08));
      root.style.setProperty("--bg-opacity", bgOpacity.toFixed(3));

      if (isMobile) return;

      root.style.setProperty("--scroll-progress", `${progressRatio}`);
      root.style.setProperty("--scroll-shift", `${root.scrollTop * -0.05}px`);
      root.style.setProperty("--scroll-shift-alt", `${root.scrollTop * 0.032}px`);

      const rootRect = root.getBoundingClientRect();
      const viewportCenter = root.clientHeight / 2;

      root.querySelectorAll("[data-parallax-section]").forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top - rootRect.top + rect.height / 2;
        const distance = (sectionCenter - viewportCenter) / root.clientHeight;
        const clamped = Math.max(-1, Math.min(1, distance));
        section.style.setProperty("--section-progress", clamped.toFixed(3));
        section.style.setProperty("--p-ghost", `${clamped * -132}px`);
      });
    });
  };

  return { progress, handleScroll };
};

const SectionShell = ({ id, kicker, title, children, className = "" }) => (
  <section
    id={id}
    className={`${styles.section} ${className}`}
    data-parallax-section
    data-reveal
  >
    {kicker && <span className={styles.kicker}>{kicker}</span>}
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

const GapSvg = () => (
  <svg className={`${styles.animatedSvg} ${styles.gapSvg}`} viewBox="0 0 520 260" aria-hidden="true">
    <path className={styles.svgTrace} d="M30 180 L200 180 L260 70 L320 180 L490 180" />
    <path className={styles.svgTraceSlow} d="M110 120 H410" />
    <path className={styles.svgTraceSlow} d="M260 70 V180" strokeDasharray="6 6" />
    <g className={styles.svgNodes}>
      <circle cx="200" cy="180" r="8" />
      <circle cx="260" cy="70" r="8" />
      <circle cx="320" cy="180" r="8" />
    </g>
    <g className={styles.svgRings}>
      <circle cx="260" cy="70" r="32" />
    </g>
  </svg>
);

const grapheneCells = [
  [0, 0], [1, 0], [-1, 0],
  [0, 1], [-1, 1], [1, -1], [0, -1],
  [2, -1], [1, 1], [-2, 1],
  [-1, -1], [2, 0], [-2, 0], [0, 2],
  [1, -2], [2, -2], [-2, 2], [-1, 2],
  [3, -1], [2, 1],
];

const buildGraphenePatch = () => {
  const size = 28;
  const origin = { x: 188, y: 120 };
  const atoms = [];
  const atomMap = new Map();
  const bondMap = new Map();
  const rings = [];

  const getAtomIndex = (x, y) => {
    const key = `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
    if (!atomMap.has(key)) {
      atomMap.set(key, atoms.length);
      atoms.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
    return atomMap.get(key);
  };

  grapheneCells.forEach(([q, r]) => {
    const cx = origin.x + size * 1.5 * q;
    const cy = origin.y + size * Math.sqrt(3) * (r + q / 2);
    const ring = Array.from({ length: 6 }, (_, index) => {
      const angle = (Math.PI / 180) * (60 * index);
      return getAtomIndex(cx + size * Math.cos(angle), cy + size * Math.sin(angle));
    });

    rings.push(ring);
    ring.forEach((from, index) => {
      const to = ring[(index + 1) % ring.length];
      const key = [from, to].sort((a, b) => a - b).join("-");
      bondMap.set(key, [from, to]);
    });
  });

  const bonds = Array.from(bondMap.values());
  const atomDistances = atoms.map(([x, y]) => Math.hypot(x - origin.x, y - origin.y));
  const maxAtomDistance = Math.max(...atomDistances);
  const atomOrders = atomDistances.map((distance) => distance / maxAtomDistance);
  const bondDistances = bonds.map(([from, to]) => {
    const [x1, y1] = atoms[from];
    const [x2, y2] = atoms[to];
    return Math.hypot((x1 + x2) / 2 - origin.x, (y1 + y2) / 2 - origin.y);
  });
  const maxBondDistance = Math.max(...bondDistances);
  const bondOrders = bondDistances.map((distance) => distance / maxBondDistance);

  return {
    atoms,
    atomOrders,
    bonds,
    bondOrders,
  };
};

const graphenePatch = buildGraphenePatch();

const GrapheneScaleSvg = () => (
  <svg className={styles.grapheneScaleSvg} viewBox="0 0 408 270" aria-hidden="true">
    <defs>
      <radialGradient id="grapheneScaleNodeGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
        <stop offset="40%" stopColor="#ffe2cd" stopOpacity="0.30" />
        <stop offset="100%" stopColor="#d49d81" stopOpacity="0.10" />
      </radialGradient>
    </defs>
    <g className={styles.grapheneScaleBonds}>
      {graphenePatch.bonds.map(([from, to], index) => {
        const [x1, y1] = graphenePatch.atoms[from];
        const [x2, y2] = graphenePatch.atoms[to];
        const order = graphenePatch.bondOrders[index];
        const inStart = order * 0.24;
        const inEnd = inStart + 0.08;
        const outStart = 0.64 + (1 - order) * 0.24;
        const outEnd = outStart + 0.08;
        const keyTimes = `0;${inStart.toFixed(3)};${inEnd.toFixed(3)};${outStart.toFixed(3)};${Math.min(outEnd, 0.98).toFixed(3)};1`;
        return (
          <line
            key={`${from}-${to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            opacity="0"
            strokeDasharray="58"
            strokeDashoffset="58"
          >
            <animate
              attributeName="opacity"
              dur="9.4s"
              repeatCount="indefinite"
              keyTimes={keyTimes}
              values="0;0;0.92;0.92;0;0"
              calcMode="spline"
              keySplines="0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="9.4s"
              repeatCount="indefinite"
              keyTimes={keyTimes}
              values="58;58;0;0;58;58"
              calcMode="spline"
              keySplines="0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1"
            />
          </line>
        );
      })}
    </g>
    <g className={styles.grapheneScaleAtoms}>
      {graphenePatch.atoms.map(([cx, cy], index) => {
        const order = graphenePatch.atomOrders[index];
        const atomRadius = index < 6 ? 5.8 : 4.7;
        const inStart = order * 0.24;
        const inEnd = inStart + 0.08;
        const outStart = 0.64 + (1 - order) * 0.24;
        const outEnd = outStart + 0.08;
        const keyTimes = `0;${inStart.toFixed(3)};${inEnd.toFixed(3)};${outStart.toFixed(3)};${Math.min(outEnd, 0.98).toFixed(3)};1`;
        return (
          <circle
            key={`${cx}-${cy}`}
            className={styles.grapheneScaleAtom}
            cx={cx}
            cy={cy}
            r={atomRadius}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              dur="9.4s"
              repeatCount="indefinite"
              keyTimes={keyTimes}
              values="0;0;1;1;0;0"
              calcMode="spline"
              keySplines="0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1"
            />
            <animate
              attributeName="r"
              dur="9.4s"
              repeatCount="indefinite"
              keyTimes={keyTimes}
              values={`0.4;0.4;${atomRadius};${atomRadius};0.4;0.4`}
              calcMode="spline"
              keySplines="0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1;0.23 1 0.32 1"
            />
          </circle>
        );
      })}
    </g>
  </svg>
);

const FlowSvg = () => (
  <svg className={`${styles.animatedSvg} ${styles.flowSvg}`} viewBox="0 0 520 260" aria-hidden="true">
    <path className={styles.svgTrace} d="M28 132 H138 C180 132, 185 76, 236 76 H360 C421 76, 424 132, 492 132" />
    <path className={styles.svgTraceSlow} d="M28 162 H156 C214 162, 218 210, 286 210 H496" />
    <g className={styles.svgNodes}>
      <circle cx="58" cy="132" r="8" />
      <circle cx="236" cy="76" r="8" />
      <circle cx="360" cy="76" r="8" />
      <circle cx="492" cy="132" r="8" />
      <circle cx="286" cy="210" r="8" />
    </g>
    <g className={styles.svgRings}>
      <circle cx="250" cy="132" r="38" />
      <circle cx="250" cy="132" r="62" />
    </g>
  </svg>
);

const EvidenceSvg = () => (
  <svg className={`${styles.animatedSvg} ${styles.evidenceSvg}`} viewBox="0 0 520 240" aria-hidden="true">
    <path className={styles.svgTrace} d="M30 145 C70 52, 106 52, 142 145 S214 238, 254 145 S326 52, 366 145 S438 238, 490 116" />
    <path className={styles.svgTraceSlow} d="M30 180 H92 L112 126 L134 198 L156 82 L184 180 H490" />
    <g className={styles.svgBars}>
      <rect x="64" y="84" width="10" height="96" />
      <rect x="238" y="46" width="10" height="142" />
      <rect x="420" y="98" width="10" height="82" />
    </g>
  </svg>
);

const ModelingSvg = () => (
  <svg className={`${styles.animatedSvg} ${styles.modelSvg}`} viewBox="0 0 520 300" aria-hidden="true">
    <path className={styles.svgTrace} d="M104 92 L260 54 L424 114 L372 244 L178 238 Z" />
    <path className={styles.svgTraceSlow} d="M104 92 L372 244 M424 114 L178 238 M260 54 L178 238" />
    <g className={styles.svgNodesLarge}>
      <circle cx="104" cy="92" r="17" />
      <circle cx="260" cy="54" r="17" />
      <circle cx="424" cy="114" r="17" />
      <circle cx="372" cy="244" r="17" />
      <circle cx="178" cy="238" r="17" />
    </g>
  </svg>
);

const TypeField = ({ items }) => (
  <div className={styles.typeField} aria-hidden="true">
    {items.map((item, index) => (
      <span key={item} style={{ "--delay": `${index * 90}ms` }}>
        {item}
      </span>
    ))}
  </div>
);

const HeroGraphene = () => (
  <div className={styles.heroGraphene} aria-hidden="true">
    <svg
      className={styles.grapheneSvg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 314 301.41"
    >
      <defs>
        <radialGradient id="glassyNodeGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="40%" stopColor="#ffe2cd" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#d49d81" stopOpacity="0.10" />
        </radialGradient>
      </defs>
      <g>
        <g className={styles.grapheneBonds}>
          <line x1="51" y1="37" x2="40" y2="19" />
          <line x1="128" y1="83" x2="111.1" y2="53.7" />
          <line x1="189" y1="100" x2="205" y2="129" />
          <line x1="127.55" y1="173.85" x2="111.65" y2="145.55" />
          <line x1="51.55" y1="128.54" x2="35.65" y2="100.24" />
          <line x1="35" y1="191" x2="51" y2="219" />
          <line x1="67" y1="228" x2="96" y2="228" />
          <line x1="111" y1="219" x2="128" y2="191" />
          <line x1="36" y1="174" x2="51" y2="145" />
          <line x1="66" y1="136" x2="97" y2="136" />
          <line x1="111" y1="236" x2="127" y2="265" />
          <line x1="143" y1="273" x2="174" y2="273" />
          <line x1="190" y1="266" x2="206" y2="237" />
          <line x1="206" y1="218" x2="190" y2="190" />
          <line x1="174" y1="182" x2="144" y2="182" />
          <line x1="219" y1="227" x2="249" y2="227" />
          <line x1="265" y1="236" x2="281" y2="265" />
          <line x1="265" y1="219" x2="281" y2="191" />
          <line x1="282" y1="173" x2="266" y2="146" />
          <line x1="249" y1="138" x2="220" y2="138" />
          <line x1="187" y1="173" x2="204" y2="146" />
          <line x1="110" y1="128" x2="128" y2="100" />
          <line x1="143" y1="91" x2="174" y2="91" />
          <line x1="35" y1="83" x2="51" y2="54" />
          <line x1="66" y1="46" x2="97" y2="46" />
          <line x1="188" y1="83" x2="206" y2="57" />
          <line x1="112" y1="37" x2="123" y2="19" />
          <line x1="280" y1="100" x2="264" y2="129" />
          <line x1="280" y1="83" x2="266" y2="56" />
          <line x1="251" y1="48" x2="219" y2="48" />
          <line x1="204" y1="39" x2="193" y2="19" />
          <line x1="267" y1="40" x2="279" y2="23" />
          <line x1="295" y1="91" x2="314" y2="91" />
          <line x1="295" y1="183" x2="311" y2="183" />
          <line x1="189" y1="283" x2="197" y2="301" />
          <line x1="127" y1="281" x2="116" y2="297" />
          <line x1="49" y1="234" x2="38" y2="246" />
          <line x1="21" y1="181" y2="181" />
          <line x1="20" y1="91" x2="7" y2="91" />
        </g>
        <g className={styles.grapheneAtoms}>
          <circle cx="30.5" cy="91.5" r="10" style={{ animationDelay: "-1.53s", animationDuration: "5.22s" }} />
          <circle cx="56.5" cy="136.5" r="10" style={{ animationDelay: "-2.81s", animationDuration: "4.34s" }} />
          <circle cx="56.5" cy="45.5" r="10" style={{ animationDelay: "-1.06s", animationDuration: "4.65s" }} />
          <circle cx="106.5" cy="137.5" r="10" style={{ animationDelay: "-2.34s", animationDuration: "4.75s" }} />
          <circle cx="133.5" cy="91.5" r="10" style={{ animationDelay: "-3.13s", animationDuration: "3.35s" }} />
          <circle cx="106.5" cy="45.5" r="10" style={{ animationDelay: "-1.99s", animationDuration: "4.98s" }} />
          <circle cx="34.5" cy="10.5" r="10" style={{ animationDelay: "-0.61s", animationDuration: "5.5s" }} />
          <circle cx="128.5" cy="10.5" r="10" style={{ animationDelay: "-3.73s", animationDuration: "4.73s" }} />
          <circle cx="30.5" cy="182.5" r="10" style={{ animationDelay: "-1.21s", animationDuration: "5.81s" }} />
          <circle cx="133.5" cy="182.5" r="10" style={{ animationDelay: "-1.93s", animationDuration: "4.92s" }} />
          <circle cx="56.5" cy="227.5" r="10" style={{ animationDelay: "-4.17s", animationDuration: "4.81s" }} />
          <circle cx="106.5" cy="227.5" r="10" style={{ animationDelay: "-0.33s", animationDuration: "4.5s" }} />
          <circle cx="183.5" cy="91.5" r="10" style={{ animationDelay: "-3.01s", animationDuration: "4.61s" }} />
          <circle cx="260.5" cy="47.5" r="10" style={{ animationDelay: "-1.58s", animationDuration: "5.18s" }} />
          <circle cx="209.5" cy="47.5" r="10" style={{ animationDelay: "-0.46s", animationDuration: "5.76s" }} />
          <circle cx="132.5" cy="273.5" r="10" style={{ animationDelay: "-4.37s", animationDuration: "4.42s" }} />
          <circle cx="184.5" cy="273.5" r="10" style={{ animationDelay: "-4.92s", animationDuration: "3.01s" }} />
          <circle cx="183.5" cy="182.5" r="10" style={{ animationDelay: "-2.95s", animationDuration: "4.87s" }} />
          <circle cx="209.5" cy="227.5" r="10" style={{ animationDelay: "-3.6s", animationDuration: "4.27s" }} />
          <circle cx="259.5" cy="227.5" r="10" style={{ animationDelay: "-2.49s", animationDuration: "3.01s" }} />
          <circle cx="209.5" cy="137.5" r="10" style={{ animationDelay: "-2.32s", animationDuration: "4.86s" }} />
          <circle cx="285.5" cy="182.5" r="10" style={{ animationDelay: "-0.44s", animationDuration: "5.18s" }} />
          <circle cx="259.5" cy="138.5" r="10" style={{ animationDelay: "-1.86s", animationDuration: "3.66s" }} />
          <circle cx="285.5" cy="91.5" r="10" style={{ animationDelay: "-4.57s", animationDuration: "4.89s" }} />
          <circle cx="285.5" cy="273.5" r="10" style={{ animationDelay: "-2.9s", animationDuration: "5.91s" }} />
        </g>
      </g>
    </svg>
  </div>
);

const GapSection = ({ scrollRef }) => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPinReady, setIsPinReady] = useState(() => (
    typeof window === "undefined" || !window.matchMedia("(max-width: 840px)").matches
  ));
  const activeIndexRef = useRef(1);
  const pinReadyRef = useRef(
    typeof window === "undefined" || !window.matchMedia("(max-width: 840px)").matches
  );

  useEffect(() => {
    const root = scrollRef.current;
    const section = sectionRef.current;
    if (!root || !section) return undefined;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updateGapState = () => {
      const isMobile = window.matchMedia("(max-width: 840px)").matches;
      const sectionStart = section.offsetTop;
      const pinDistance = Math.max(section.offsetHeight - root.clientHeight, 1);
      const rawProgress = (root.scrollTop - sectionStart) / pinDistance;
      const latest = clamp(rawProgress, 0, 1);
      const nextPinReady = !isMobile || root.scrollTop >= sectionStart - 1;

      if (pinReadyRef.current !== nextPinReady) {
        pinReadyRef.current = nextPinReady;
        setIsPinReady(nextPinReady);
      }

      let next = 6;
      if (latest < 0.15) next = 1;
      else if (latest < 0.31) next = 2;
      else if (latest < 0.47) next = 3;
      else if (latest < 0.63) next = 4;
      else if (latest < 0.79) next = 5;

      if (activeIndexRef.current !== next) {
        activeIndexRef.current = next;
        setActiveIndex(next);
      }
    };

    updateGapState();
    root.addEventListener("scroll", updateGapState, { passive: true });
    window.addEventListener("resize", updateGapState);
    window.addEventListener("orientationchange", updateGapState);
    window.visualViewport?.addEventListener("resize", updateGapState);

    return () => {
      root.removeEventListener("scroll", updateGapState);
      window.removeEventListener("resize", updateGapState);
      window.removeEventListener("orientationchange", updateGapState);
      window.visualViewport?.removeEventListener("resize", updateGapState);
    };
  }, [scrollRef]);

  const slideMotion = {
    title: {
      future: "translate3d(0, 8vh, 0) scale(0.985)",
      past: "translate3d(0, -7vh, 0) scale(0.985)",
    },
    lead: {
      future: "translate3d(0, 9vh, 0) scale(0.99)",
      past: "translate3d(0, -6vh, 0) scale(0.975)",
    },
    pillarLeft: {
      future: "translate3d(-5vw, 5vh, 0) scale(0.985)",
      past: "translate3d(4vw, -5vh, 0) scale(0.975)",
    },
    pillarRight: {
      future: "translate3d(5vw, 5vh, 0) scale(0.985)",
      past: "translate3d(-4vw, -5vh, 0) scale(0.975)",
    },
    close: {
      future: "translate3d(0, 7vh, 0) scale(0.96)",
      past: "translate3d(0, -4vh, 0) scale(1.015)",
    },
  };

  const getSlideProps = (index, preset = "title") => ({
    initial: { opacity: 0, transform: slideMotion[preset].future },
    animate: {
      opacity: isPinReady && activeIndex === index ? 1 : 0,
      transform: activeIndex === index
        ? "translate3d(0, 0, 0) scale(1)"
        : activeIndex > index
          ? slideMotion[preset].past
          : slideMotion[preset].future,
      filter: isPinReady && activeIndex === index ? "blur(0px)" : "blur(10px)",
      pointerEvents: isPinReady && activeIndex === index ? "auto" : "none"
    },
    transition: {
      opacity: { duration: 0.46, ease: [0.23, 1, 0.32, 1] },
      transform: { duration: 0.68, ease: [0.23, 1, 0.32, 1] },
      filter: { duration: 0.56, ease: [0.23, 1, 0.32, 1] },
    },
    "aria-hidden": activeIndex !== index
  });

  const slideClassName = (index, preset) =>
    `${styles.storySlide} ${styles[`storySlide${preset[0].toUpperCase()}${preset.slice(1)}`]} ${
      activeIndex === index ? styles.activeStorySlide : ""
    }`;

  const slideProgress = (activeIndex - 1) / 5;
  const atmosphere = [
    { ring: 0.78, halo: 0.9, line: 0.28, svg: 0.16, scale: 1 },
    { ring: 0.62, halo: 0.74, line: 0.18, svg: 0.12, scale: 1.03 },
    { ring: 0.82, halo: 0.94, line: 0.34, svg: 0.18, scale: 1.06 },
    { ring: 0.58, halo: 0.7, line: 0.16, svg: 0.11, scale: 0.98 },
    { ring: 0.74, halo: 0.86, line: 0.3, svg: 0.15, scale: 1.04 },
    { ring: 0.66, halo: 0.8, line: 0.22, svg: 0.13, scale: 1.01 },
  ][activeIndex - 1];

  const handlePillarLensMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--word-lens-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--word-lens-y", `${event.clientY - rect.top}px`);
    target.style.setProperty("--word-lens-opacity", "1");
  };

  const handlePillarLensEnter = (event) => {
    handlePillarLensMove(event);
  };

  const handlePillarLensLeave = (event) => {
    event.currentTarget.style.setProperty("--word-lens-opacity", "0");
  };

  const renderPillarWord = (word) => (
    <span
      key={word}
      className={styles.gapPillarWord}
      data-text={word}
      onPointerEnter={handlePillarLensEnter}
      onPointerMove={handlePillarLensMove}
      onPointerLeave={handlePillarLensLeave}
    >
      <span className={styles.gapPillarWordFill}>{word}</span>
      <span className={styles.gapPillarWordLens} aria-hidden="true">{word}</span>
    </span>
  );

  const renderSkills = (skills) => skills.map((skill) => (
    <span key={skill}>{skill}</span>
  ));

  return (
    <div
      ref={sectionRef}
      className={`${styles.storyPin} ${isPinReady ? styles.storyPinReady : styles.storyPinWaiting}`}
      id="gap"
      data-parallax-section
    >
      <div
        className={styles.storyPinInner}
        style={{
          "--gap-ring-opacity": atmosphere.ring,
          "--gap-halo-opacity": atmosphere.halo,
          "--gap-line-opacity": atmosphere.line,
          "--gap-svg-opacity": atmosphere.svg,
          "--gap-atmosphere-scale": atmosphere.scale,
        }}
      >
        <div className={styles.gapAmbient} aria-hidden="true" />

        <div className={styles.gapSvgContainer}>
          <GapSvg />
        </div>

        <div className={styles.storyProgress} aria-hidden="true">
          <span style={{ transform: `scaleY(${slideProgress})` }} />
        </div>

        <motion.div className={slideClassName(1, "title")} {...getSlideProps(1, "title")}>
          <div className={styles.gapTitleWrapper}>
            <span className={styles.gapTitleAccent}>2D</span>
            <h2 className={styles.gapTitleMain}>
              <span className={styles.gapTitleLight}>Graphene / h-BN / MoS2</span>
              <span className={styles.gapTitleHeavy}>
                <span>The</span>
                <span>Manufacturing</span>
                <span>Gap</span>
              </span>
              <span className={styles.gapTitleSub}>Process Engineering • Materials Characterization • Scale-Up • Root Cause Analysis</span>
            </h2>
          </div>
        </motion.div>

        <motion.div className={slideClassName(2, "lead")} {...getSlideProps(2, "lead")}>
          <div className={styles.gapLeadBlock}>
             <div className={styles.gapLeadData}>
                <span className={styles.dataLabel}>INDUSTRY DEMAND</span>
                <span className={styles.dataValue}>HIGH</span>
             </div>
             <div className={styles.gapLeadText}>
                <span className={styles.gapLeadEyebrow}>Promising materials are restricted by laboratory limitations</span>
                <strong>
                  <span>Industry Need</span>
                  <span>High</span>
                </strong>
                <span className={styles.gapLeadConnector}>Application-ready materials demand</span>
                <em>
                  <span>Scalable Production</span>
                  <span>Defect Control</span>
                  <span>Process Economics</span>
                  <span>Quality Assurance</span>
                </em>
             </div>
          </div>
        </motion.div>

        <motion.div className={slideClassName(3, "pillarLeft")} {...getSlideProps(3, "pillarLeft")}>
          <div className={`${styles.gapPillarBlock} ${styles.staggerLeft}`}>
            <div className={styles.grapheneScaleWrap}>
              {activeIndex === 3 && <GrapheneScaleSvg />}
            </div>
            <div className={styles.pillarContent}>
              <h3 className={styles.gapPillarTitle}>
                <span className={styles.gapPillarIndex}>01</span>
                <span className={styles.gapPillarFrame}>Scale</span>
                {renderPillarWord("Throughput")}
              </h3>
              <p className={styles.gapPillarDesc}>The challenge is not proving exfoliation once.<br/> It is engineering a continuous, reproducible yield of targeted nanomaterials from bulk powder.</p>
              <div className={styles.pillarMetrics}>
                {renderSkills(["Powder Fluidization", "Gas Dynamics", "Process Optimization", "High-Volume Processing"])}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className={slideClassName(4, "pillarRight")} {...getSlideProps(4, "pillarRight")}>
          <div className={`${styles.gapPillarBlock} ${styles.staggerRight}`}>
            <div className={styles.pillarContent}>
              <h3 className={styles.gapPillarTitle}>
                <span className={styles.gapPillarIndex}>02</span>
                <span className={styles.gapPillarFrame}>Cost</span>
                {renderPillarWord("Process")}
                {renderPillarWord("Economics")}
              </h3>
              <p className={styles.gapPillarDesc}>Industry adoption depends entirely on the real production price.<br/> Minimizing solvent load, optimizing energy input, and maximizing recovery dictate true commercial viability.</p>
              <div className={styles.pillarMetrics}>
                {renderSkills(["System Thermodynamics", "Resource Recovery", "High-Pressure Mechanics", "Energy Efficiency"])}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className={slideClassName(5, "pillarLeft")} {...getSlideProps(5, "pillarLeft")}>
          <div className={`${styles.gapPillarBlock} ${styles.staggerLeft}`}>
            <div className={styles.pillarContent}>
              <h3 className={styles.gapPillarTitle}>
                <span className={styles.gapPillarIndex}>03</span>
                <span className={styles.gapPillarFrame}>Consistency</span>
                {renderPillarWord("Exact")}
                {renderPillarWord("Specifications")}
              </h3>
              <p className={styles.gapPillarDesc}>Applications demand a precise material window, not a mystery powder.<br/> Advanced metrology connects fluid parameters directly to consistent morphology and surface chemistry.</p>
              <div className={styles.pillarMetrics}>
                {renderSkills(["Advanced Metrology", "Spectroscopic Analysis", "Defect Mapping", "Statistical Process Control"])}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className={slideClassName(6, "close")} {...getSlideProps(6, "close")}>
          <div className={styles.gapHighlight}>
            <span className={styles.gapHighlightSmall}>My Focus</span>
            <strong>
              <span>Build &gt;&gt;</span>
              <span>measure &gt;&gt;</span>
              <span>Optimize</span>
            </strong>
            <span>
              I develop gas-driven exfoliation routes and build the rigorous metrology workflows required for <em>scalable, on-spec nanomaterial manufacturing</em>.
            </span>
            <span className={styles.gapHighlightMeta}>
              <span>Process Engineering</span>
              <span>Metrology & Characterization</span>
              <span>Technology Commercialization</span>
              <span>Thermal Transport</span>
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const WorkStory = () => {
  const scrollRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { progress, handleScroll } = useWorkStoryEffects(scrollRef);

  return (
    <>
      <SEO
        title="Saeed Arabha | R&D Journey"
        description="A recruiter-focused R&D narrative of Saeed Arabha's materials approach across process development, characterization, modeling, and industrial value."
        name="Saeed Arabha"
        type="website"
      />
      <motion.main
        className={styles.page}
        ref={scrollRef}
        onScroll={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className={styles.glowingBg} aria-hidden="true" />
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <header className={styles.hero} data-reveal>
          <div className={styles.heroFrame}>
            <div className={styles.heroCopy}>
              <HeroGraphene />
              <h1>
                <span>SAEED ARABHA</span>
              </h1>
              <p>Process & Metrology Engineer</p>

              <div className={styles.chain} aria-label="R&D skills">
                {chain.map((item, index) => (
                  <span key={item} style={{ "--delay": `${index * 90}ms` }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <a className={styles.heroScrollCue} href="#gap" aria-label="Scroll to the story">
            <i />
            <span>Scroll</span>
          </a>
        </header>

        <div className={styles.storyGrid}>
          {isMounted && <GapSection scrollRef={scrollRef} />}

          <SectionShell id="process" kicker="Direction" title="Compressible Flow Exfoliation" className={styles.asymProcess}>
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.lead}>
                  A gas-driven route for 2D nanomaterials: graphene, h-BN, and MoS2.
                </p>
                <TypeField items={["ΔP", "FLOW", "TEMP", "NOZZLE", "YIELD"]} />
              </div>
              <FlowSvg />
            </div>
            <div className={styles.processMap}>
              {processSteps.map((step, index) => (
                <div key={step} className={styles.processStep} style={{ "--delay": `${index * 80}ms` }}>
                  <span />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </SectionShell>

          <SectionShell id="system" kicker="System" className={`${styles.splitSection} ${styles.asymSystem}`}>
            <div>
              <h2>Building the Process</h2>
              <p className={styles.lead}>
                High-pressure flow. Rapid acceleration. Particle-gas interaction.
              </p>
            </div>
            <div className={styles.variablePanel}>
              <h3>Process Variables I Investigated</h3>
              <div>
                {variables.map((variable, index) => (
                  <span key={variable} style={{ "--delay": `${index * 70}ms` }}>
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          </SectionShell>

          <SectionShell id="evidence" kicker="Evidence" title="Proving the Material, Not Just Producing It" className={styles.asymEvidence}>
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.lead}>
                  The output has to be measured, not assumed.
                </p>
                <TypeField items={["STRUCTURE", "CHEMISTRY", "MORPHOLOGY", "SIGNAL"]} />
              </div>
              <EvidenceSvg />
            </div>
            <div className={styles.characterGrid}>
              {characterization.map((item, index) => (
                <article key={item.name} style={{ "--delay": `${index * 70}ms` }}>
                  <span>{item.name}</span>
                  <em>{item.proof}</em>
                </article>
              ))}
            </div>
          </SectionShell>

          <SectionShell id="modeling" kicker="Modeling" title="Using Modeling to Understand What Experiments Alone Cannot Show" className={styles.asymModeling}>
            <div className={styles.sectionIntro}>
              <p className={styles.lead}>
                Experiments show the result. Modeling helps expose the mechanism.
              </p>
              <ModelingSvg />
            </div>
            <div className={styles.modelPanel}>
              {modelingNodes.map((node, index) => (
                <React.Fragment key={node}>
                  <span style={{ "--delay": `${index * 100}ms` }}>{node}</span>
                  {index < modelingNodes.length - 1 && <i aria-hidden="true" />}
                </React.Fragment>
              ))}
            </div>
          </SectionShell>

          <SectionShell id="industry" kicker="Industry" title="From Research Question to Industrial Value" className={styles.asymIndustry}>
            <p className={styles.lead}>
              The question changed from “Can it be made?” to “Can it be made reliably?”
            </p>
            <div className={styles.beforeAfter}>
              <article>
                <span>Before</span>
                <h3>Academic question</h3>
                <p>Can we produce and characterize the material?</p>
              </article>
              <article>
                <span>After</span>
                <h3>Industrial question</h3>
                <p>
                  Can the process create consistent, scalable,
                  application-ready material?
                </p>
              </article>
            </div>
          </SectionShell>

          <SectionShell id="approach" kicker="Framework" title="My R&D Approach" className={styles.asymApproach}>
            <div className={styles.finalChain}>
              {chain.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className={styles.lead}>
              Build the process. Prove the material. Understand the mechanism. Connect it to use.
            </p>
            <div className={styles.closeCard}>
              <p>
                Advanced materials, nanomanufacturing, characterization, or process scale-up.
              </p>
              <div className={styles.heroActions}>
                <Link to="/AcademicCV">Download Resume</Link>
                <a href="mailto:sarabha@yorku.ca">Contact Me</a>
                <Link to="/research-progress">View CFE Case Study</Link>
              </div>
            </div>
          </SectionShell>
        </div>
      </motion.main>
    </>
  );
};

export default WorkStory;
