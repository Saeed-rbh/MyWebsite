import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
  TbCube,
  TbDownload,
  TbHexagon,
  TbMail,
  TbMicroscope,
  TbNetwork,
} from "react-icons/tb";
import SEO from "../../components/SEO/SEO";
import styles from "./WorkStory.module.css";

// Unique custom SVG icon components for each controlled variable
const PressureIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <circle cx="12" cy="18" r="1.5" />
    <line className={styles.gaugeNeedle} x1="12" y1="18" x2="16" y2="10" />
    <path d="M12 4v2" />
    <path d="M6 8l1.5 1.5" />
    <path d="M18 8l-1.5 1.5" />
  </svg>
);

const GasIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Particle 1: Argon (Heavy monoatomic) */}
    <circle className={styles.particleAr} cx="6" cy="15" r="2.2" />
    <path className={styles.particleArPath} d="M6 15l4.5-3" strokeDasharray="3 3" />

    {/* Particle 2: Nitrogen (Diatomic molecule) */}
    <g className={styles.particleN2}>
      <circle cx="11.5" cy="7.5" r="1.5" />
      <circle cx="14" cy="9" r="1.5" />
      <line x1="11.5" y1="7.5" x2="14" y2="9" />
    </g>

    {/* Particle 3: Helium (Light monoatomic) */}
    <circle className={styles.particleHe1} cx="17.5" cy="15.5" r="1.2" />
    <path className={styles.particleHe1Path} d="M17.5 15.5l-3.5-4.5" strokeDasharray="2 2" />

    {/* Particle 4: Small Helium atom */}
    <circle className={styles.particleHe2} cx="18.5" cy="6.5" r="1" />

    {/* Collision dynamics / thermal energy indicator */}
    <path className={styles.particleCollision} d="M12.5 12l-1.5-1.5M12.5 12l1.5 1.5M12.5 12l1.5-1.5M12.5 12l-1.5 1.5" opacity="0.6" />

    {/* Thermal dispersion wave */}
    <path className={styles.gasWave} d="M3 6c4-2.5 9-2.5 13 0" opacity="0.5" />

    {/* Small ambient gas particles/dots that float around */}
    <circle className={`${styles.ambientDot} ${styles.ad1}`} cx="4" cy="8" r="0.6" />
    <circle className={`${styles.ambientDot} ${styles.ad2}`} cx="8" cy="4.5" r="0.5" />
    <circle className={`${styles.ambientDot} ${styles.ad3}`} cx="10.5" cy="17" r="0.6" />
    <circle className={`${styles.ambientDot} ${styles.ad4}`} cx="14" cy="13.5" r="0.5" />
    <circle className={`${styles.ambientDot} ${styles.ad5}`} cx="20.5" cy="11" r="0.6" />
    <circle className={`${styles.ambientDot} ${styles.ad6}`} cx="15.5" cy="4" r="0.5" />
    <circle className={`${styles.ambientDot} ${styles.ad7}`} cx="21" cy="16.5" r="0.6" />
    <circle className={`${styles.ambientDot} ${styles.ad8}`} cx="7" cy="10" r="0.5" />
  </svg>
);

const ThermalIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path className={styles.flame} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const NozzleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path className={styles.nozzleWave1} d="M15 10c0.8 1 0.8 3 0 4" />
    <path className={styles.nozzleWave2} d="M18 8c1.2 1.5 1.2 4.5 0 6" />
    <path d="M2 6c3 0 5 4 10 4s7-4 10-4" />
    <path d="M2 18c3 0 5-4 10-4s7 4 10 4" />
    <line className={styles.nozzleFlow} x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 3" opacity="0.6" />
  </svg>
);

const FlowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path className={styles.flowStream1} d="M2 6h8c3 0 4 3 6 3h6" />
    <path className={styles.flowStream2} d="M2 12h5c2 0 3 2 5 2h3c2 0 3-4 5-4h2" />
    <path className={styles.flowStream3} d="M2 18h10c3 0 4-3 6-3h6" />
  </svg>
);

const FeedstockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path className={styles.feedstockTop} d="M12 3L20 7L12 11L4 7L12 3Z" />
    <path className={styles.feedstockMid} d="M4 12L12 16L20 12" />
    <path className={styles.feedstockBot} d="M4 17L12 21L20 17" />
    <line className={styles.feedstockLine} x1="12" y1="7" x2="12" y2="14" strokeDasharray="2 2" />
  </svg>
);

const RecoveryIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path className={styles.recoveryArrow1} d="M4.05 11a8 8 0 0 1 7.95-7 8 8 0 0 1 6.08 2.78L20 8M20 4v4h-4" />
    <path className={styles.recoveryArrow2} d="M19.95 13a8 8 0 0 1-7.95 7 8 8 0 0 1-6.08-2.78L4 16M4 20v-4h4" />
  </svg>
);

const QualityIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle className={styles.qualityCircle} cx="12" cy="12" r="9" />
    <path className={styles.qualityCheck} d="M9 12l2 2 4-4" />
  </svg>
);

const chain = [
  "2D Nanomaterials",
  "Process Scale-Up",
  "Metrology & Characterization",
  "Nanoscale Thermal Transport",
  "Computational Modeling",
];

const approachOrbitSteps = [
  {
    number: "01",
    title: "Materials & Processes",
    detail: "Scalable materials and process development.",
    Icon: TbNetwork,
  },
  {
    number: "02",
    title: "Measurement & Metrology",
    detail: "Precision characterization and accuracy.",
    Icon: TbMicroscope,
  },
  {
    number: "03",
    title: "Modeling & Insights",
    detail: "Predict and optimize with computational models.",
    Icon: TbCube,
  },
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
  { id: "precursor", title: "Precursor", detail: "Layered feedstock enters as a powder, preserving the chemistry while preparing it for mechanical separation." },
  { id: "gas", title: "Pressurization", detail: "Compressed nitrogen or argon becomes the process medium, replacing solvent-heavy exfoliation routes." },
  { id: "heated", title: "Heating", detail: "Temperature sets gas density, viscosity, and momentum transfer before the powder reaches the nozzle." },
  { id: "nozzle", title: "Acceleration", detail: "The gas-powder stream is driven through a controlled restriction where velocity and pressure gradients rise sharply." },
  { id: "exfoliation", title: "Exfoliation", detail: "Shear, impact, and rapid expansion separate stacked crystals into usable nanosheet populations." },
  { id: "characterization", title: "METROLOGY", tone: "metrology", detail: "Metrology closes the loop by checking layer count, lateral size, morphology, and defect density." },
];

const variables = [
  { label: "Pressure ratio", Icon: PressureIcon },
  { label: "Gas identity", Icon: GasIcon },
  { label: "Thermal state", Icon: ThermalIcon },
  { label: "Nozzle geometry", Icon: NozzleIcon },
  { label: "Flow regime", Icon: FlowIcon },
  { label: "Feedstock", Icon: FeedstockIcon },
  { label: "Recovery path", Icon: RecoveryIcon },
  { label: "Quality window", Icon: QualityIcon },
];

const characterization = [
  {
    id: "uv-vis",
    name: "UV",
    proof: "Optical response",
    detail: "Batch consistency via excitonic absorption peaks.",
  },
  {
    id: "sem",
    name: "SEM",
    proof: "Surface morphology",
    detail: "Flake population, particle distribution, and agglomeration checks.",
  },
  {
    id: "tem",
    name: "TEM",
    proof: "Lattice structure",
    detail: "Layer contrast, nanosheet edges, and crystalline domains.",
  },
  {
    id: "raman",
    name: "RAMAN",
    proof: "Structural signature",
    detail: "D/G band ratio, layer fingerprinting, defect density analysis.",
  },
  {
    id: "xps",
    name: "XPS",
    proof: "Chemical composition",
    detail: "C1s dominance, minimal oxygen, non-oxidative proof.",
  },
  {
    id: "afm",
    name: "AFM",
    proof: "Topography",
    detail: "Sub-3nm flakes, 1-10 layers, high-resolution height mapping.",
  }
];

const modelingNodes = [
  "Experiment",
  "Simulation",
  "Data",
  "Mechanism",
];

const storySpring = {
  stiffness: 82,
  damping: 30,
  mass: 0.9,
  restDelta: 0.001,
};

const routeTransition = {
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1],
};

const slideTransition = {
  opacity: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  x: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  y: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  scale: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  filter: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
};

const slideMotion = {
  title: {
    future: { x: 0, y: "8vh", scale: 0.985 },
    past: { x: 0, y: "-7vh", scale: 0.985 },
  },
  lead: {
    future: { x: 0, y: "9vh", scale: 0.99 },
    past: { x: 0, y: "-6vh", scale: 0.975 },
  },
  pillarLeft: {
    future: { x: "-5vw", y: "5vh", scale: 0.985 },
    past: { x: "4vw", y: "-5vh", scale: 0.975 },
  },
  pillarRight: {
    future: { x: "5vw", y: "5vh", scale: 0.985 },
    past: { x: "-4vw", y: "-5vh", scale: 0.975 },
  },
  close: {
    future: { x: 0, y: "7vh", scale: 0.96 },
    past: { x: 0, y: "-4vh", scale: 1.015 },
  },
};

const useWorkStoryEffects = (scrollRef) => {
  const rafRef = useRef(null);
  const isMobileRef = useRef(false);
  const parallaxSectionsRef = useRef([]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    const mediaQuery = window.matchMedia("(max-width: 840px)");
    const syncCachedLayout = () => {
      isMobileRef.current = mediaQuery.matches;
      root.style.setProperty("--story-frame-height", `${root.clientHeight}px`);
      parallaxSectionsRef.current = Array.from(root.querySelectorAll("[data-parallax-section]"));
    };

    syncCachedLayout();
    window.addEventListener("resize", syncCachedLayout, { passive: true });
    window.addEventListener("orientationchange", syncCachedLayout, { passive: true });
    window.visualViewport?.addEventListener("resize", syncCachedLayout, { passive: true });
    mediaQuery.addEventListener?.("change", syncCachedLayout);

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
      window.removeEventListener("resize", syncCachedLayout);
      window.removeEventListener("orientationchange", syncCachedLayout);
      window.visualViewport?.removeEventListener("resize", syncCachedLayout);
      mediaQuery.removeEventListener?.("change", syncCachedLayout);
      revealObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root || rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const scrollTop = root.scrollTop;
      const clientHeight = root.clientHeight;
      const maxScroll = root.scrollHeight - clientHeight;
      const progressRatio = maxScroll <= 0 ? 0 : scrollTop / maxScroll;

      const scrollRatio = scrollTop / clientHeight;
      const bgOpacity = scrollRatio <= 0.05
        ? 0.8
        : Math.max(0.2, 0.8 - ((scrollRatio - 0.05) * 1.08));
      root.style.setProperty("--bg-opacity", bgOpacity.toFixed(3));

      if (isMobileRef.current) return;

      root.style.setProperty("--scroll-progress", progressRatio.toFixed(4));
      root.style.setProperty("--scroll-shift", `${scrollTop * -0.05}px`);
      root.style.setProperty("--scroll-shift-alt", `${scrollTop * 0.032}px`);

      const rootRect = root.getBoundingClientRect();
      const viewportCenter = clientHeight / 2;

      parallaxSectionsRef.current.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top - rootRect.top + rect.height / 2;
        const distance = (sectionCenter - viewportCenter) / clientHeight;
        const clamped = Math.max(-1, Math.min(1, distance));
        section.style.setProperty("--section-progress", clamped.toFixed(3));
        section.style.setProperty("--p-ghost", `${clamped * -132}px`);
      });
    });
  };

  return { handleScroll };
};

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

const renderSpotlightWord = (
  word,
  {
    className = "",
    mode = "outline",
  } = {}
) => {
  const isFilled = mode === "filled";

  return (
    <span
      key={word}
      className={className}
      data-spotlight-mode={mode}
      data-text={word}
      onPointerEnter={handlePillarLensEnter}
      onPointerMove={handlePillarLensMove}
      onPointerLeave={handlePillarLensLeave}
    >
      <span className={isFilled ? styles.gapPillarWordFill : styles.gapFocusWordOutline}>
        {word}
      </span>
      <span
        className={isFilled ? styles.gapPillarWordLens : styles.gapFocusWordFill}
        aria-hidden="true"
      >
        {word}
      </span>
    </span>
  );
};

const renderPillarWord = (word) => renderSpotlightWord(word, {
  className: styles.gapPillarWord,
  mode: "filled",
});

const renderFocusWord = (word, className = "") => renderSpotlightWord(word, {
  className: `${styles.gapFocusWord} ${className}`,
  mode: "outline",
});

const renderFilledTitleWord = (word, className = "") => renderSpotlightWord(word, {
  className: `${styles.gapPillarWord} ${styles.spotlightTitleFilledWord} ${className}`,
  mode: "filled",
});

const SpotlightTitle = ({ words, className = "" }) => {
  const isSplit = className.includes(styles.splitLineLayout);
  
  if (isSplit) {
    // Force "From" & "Research" on line 1, and "To" & "Value" on line 2
    return (
      <h2
        className={`${styles.sectionTitleStacked} ${styles.spotlightTitle} ${className}`}
        aria-label={words.join(" ")}
      >
        <span style={{ display: "flex", gap: "0.24em" }}>
          {renderFocusWord(words[0])}
          {renderFocusWord(words[1])}
        </span>
        <span style={{ display: "flex", gap: "0.24em" }}>
          {renderFocusWord(words[2])}
          {renderFocusWord(words[3])}
        </span>
      </h2>
    );
  }
  
  return (
    <h2
      className={`${styles.sectionTitleStacked} ${styles.spotlightTitle} ${className}`}
      aria-label={words.join(" ")}
    >
      {words.map((word) => renderFocusWord(word))}
    </h2>
  );
};

const EvidenceMaterialLetter = ({ letter, index, progress }) => {
  const start = 0.08 + index * 0.035;
  const opacity = useTransform(progress, [start, start + 0.075], [0.2, 1]);
  const y = useTransform(progress, [start, start + 0.075], ["0.08em", "0em"]);

  return (
    <motion.span style={{ opacity, y }}>{letter}</motion.span>
  );
};

const EvidenceProofTitle = ({ progress }) => {
  const materialLetters = "Material".split("");

  return (
    <h2
      className={`${styles.sectionTitleStacked} ${styles.spotlightTitle} ${styles.evidenceProofTitle}`}
      aria-label="Proving the Material"
    >
      {renderFocusWord("Proving")}
      {renderFocusWord("the")}
      <span className={`${styles.gapFocusWord} ${styles.evidenceMaterialWord}`} data-text="Material">
        <span className={styles.gapFocusWordOutline} aria-hidden="true">Material</span>
        <span className={styles.evidenceMaterialLetters} aria-hidden="true">
          {materialLetters.map((letter, index) => (
            <EvidenceMaterialLetter key={`${letter}-${index}`} letter={letter} index={index} progress={progress} />
          ))}
        </span>
      </span>
    </h2>
  );
};
const SystemSpotlightTitle = () => (
  <h2
    className={`${styles.sectionTitleStacked} ${styles.spotlightTitle} ${styles.systemTitle} ${styles.systemFilledTitle}`}
    aria-label="Building The Process"
  >
    {renderFilledTitleWord("Building", styles.spotlightTitleLight)}
    {renderFilledTitleWord("The", styles.spotlightTitleLight)}
    {renderFilledTitleWord("Process", styles.spotlightTitleCopper)}
  </h2>
);

const SectionShell = ({ id, kicker, title, children, className = "", eager = false }) => {
  const sectionRef = useRef(null);
  const [shouldRenderContent, setShouldRenderContent] = useState(eager);

  useEffect(() => {
    if (eager) {
      setShouldRenderContent(true);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderContent(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "85% 0px", threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${styles.section} ${className}`}
      data-parallax-section
      data-reveal
      data-section-ready={shouldRenderContent ? "true" : "false"}
    >
      {kicker && <span className={styles.kicker}>{kicker}</span>}
      {typeof title === 'string' ? <h2>{title}</h2> : title}
      {shouldRenderContent ? children : <div className={styles.sectionPlaceholder} aria-hidden="true" />}
    </section>
  );
};

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

const ConsistencyCheckSvg = () => (
  <svg className={`${styles.grapheneScaleSvg} ${styles.consistencyCheckSvg}`} viewBox="0 0 408 270" aria-hidden="true">
    <defs>
      <radialGradient id="consistencyNodeGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
        <stop offset="34%" stopColor="#ffe2cd" stopOpacity="0.48" />
        <stop offset="72%" stopColor="#d49d81" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#5b2f20" stopOpacity="0.2" />
      </radialGradient>
      <radialGradient id="consistencyDepthGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#d49d81" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
      </radialGradient>
      <linearGradient id="consistencyScanGrad" x1="82" y1="0" x2="326" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d49d81" stopOpacity="0" />
        <stop offset="48%" stopColor="#fffaf2" stopOpacity="0.82" />
        <stop offset="100%" stopColor="#d49d81" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g className={styles.consistencySheet}>

      <g className={styles.consistencySheetBonds}>
        {graphenePatch.bonds.map(([from, to]) => {
          const [x1, y1] = graphenePatch.atoms[from];
          const [x2, y2] = graphenePatch.atoms[to];
          return <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <g className={styles.consistencySheetAtoms}>
        {graphenePatch.atoms.map(([cx, cy], index) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index < 6 ? "5.2" : "4.2"} />
        ))}
      </g>
    </g>

    <g className={styles.consistencyScan}>
      <rect x="76" y="66" width="256" height="4" rx="2" />
      <path d="M82 66 H326" />
    </g>

    <g className={styles.consistencyConfirm}>
      <circle cx="308" cy="70" r="24" />
      <path d="M296 70 L305 79 L322 59" />
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
  const [isPinReady, setIsPinReady] = useState(false);
  const activeIndexRef = useRef(1);
  const pinReadyRef = useRef(false);
  const rafRef = useRef(null);
  const metricsRef = useRef({ isMobile: false, sectionStart: 0, pinDistance: 1 });

  useEffect(() => {
    const root = scrollRef.current;
    const section = sectionRef.current;
    if (!root || !section) return undefined;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const mediaQuery = window.matchMedia("(max-width: 840px)");

    const syncGapMetrics = () => {
      metricsRef.current = {
        isMobile: mediaQuery.matches,
        sectionStart: section.offsetTop,
        pinDistance: Math.max(section.offsetHeight - root.clientHeight, 1),
      };
    };

    const updateGapState = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const { isMobile, sectionStart, pinDistance } = metricsRef.current;
        const scrollTop = root.scrollTop;
        const clientHeight = root.clientHeight;
        const rawProgress = (scrollTop - sectionStart) / pinDistance;
        const latest = clamp(rawProgress, 0, 1);
        const readyOffset = 1;
        const nextPinReady = scrollTop >= sectionStart - readyOffset;

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
          document.getElementById("gap")?.setAttribute("data-active-slide", next);
        }
      });
    };

    const handleMetricChange = () => {
      syncGapMetrics();
      updateGapState();
    };

    section.setAttribute("data-active-slide", activeIndexRef.current);
    syncGapMetrics();
    updateGapState();
    root.addEventListener("scroll", updateGapState, { passive: true });
    window.addEventListener("resize", handleMetricChange, { passive: true });
    window.addEventListener("orientationchange", handleMetricChange, { passive: true });
    window.visualViewport?.addEventListener("resize", handleMetricChange, { passive: true });
    mediaQuery.addEventListener?.("change", handleMetricChange);

    return () => {
      root.removeEventListener("scroll", updateGapState);
      window.removeEventListener("resize", handleMetricChange);
      window.removeEventListener("orientationchange", handleMetricChange);
      window.visualViewport?.removeEventListener("resize", handleMetricChange);
      mediaQuery.removeEventListener?.("change", handleMetricChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef]);

  const getSlideProps = (index, preset = "title") => ({
    initial: { opacity: 0, ...slideMotion[preset].future },
    animate: {
      opacity: isPinReady && activeIndex === index ? 1 : 0,
      ...(activeIndex === index
        ? { x: 0, y: 0, scale: 1 }
        : activeIndex > index
          ? slideMotion[preset].past
          : slideMotion[preset].future),
      filter: isPinReady && activeIndex === index ? "blur(0px)" : "blur(10px)",
      pointerEvents: isPinReady && activeIndex === index ? "auto" : "none"
    },
    transition: slideTransition,
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
              <span className={styles.gapTitleCategory}>2D Nanomaterials</span>
              <span className={styles.gapTitleLight}>GRAPHENE | h-BN | MoS₂</span>
              <span className={styles.gapTitleHeavy}>
                {renderPillarWord("The")}
                {renderPillarWord("Manufacturing")}
                {renderPillarWord("Gap")}
              </span>
              <span className={styles.gapTitleSub}>
                {["Process Engineering", "Materials Characterization", "Scale-Up", "Root Cause Analysis"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
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
                  {renderPillarWord("Industry Need")}
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
            <div className={`${styles.grapheneScaleWrap} ${styles.consistencyCheckWrap}`}>
              {activeIndex === 5 && <ConsistencyCheckSvg />}
            </div>
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
              {renderFocusWord(<>Build <span className={styles.focusArrow}>{">>"}</span></>)}
              {renderFocusWord(<>measure <span className={styles.focusArrow}>{">>"}</span></>)}
              {renderFocusWord("Optimize")}
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

const InteractiveProcessMap = ({ steps }) => {
  const [activeStepId, setActiveStepId] = useState(null);

  return (
    <div className={styles.interactiveProcessWrapper}>
      <div className={styles.processMap}>
        {steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const toneClass = step.tone === "metrology" ? styles.processStepMetrology : "";
          return (
            <div 
              key={step.id} 
              className={`${styles.processStep} ${toneClass} ${isActive ? styles.processStepActive : ''}`} 
              style={{ "--delay": `${index * 80}ms` }}
              onPointerEnter={() => setActiveStepId(step.id)}
              onPointerLeave={() => setActiveStepId(null)}
            >
              <span className={styles.processStepNode} />
              <p>{step.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RamanChart = ({ isActive }) => (
  <svg viewBox="0 0 240 130" style={{ width: "100%", height: "100%" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid lines */}
    <line x1="20" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="20" y1="50" x2="220" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="20" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="20" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <line x1="20" y1="20" x2="20" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <line x1="86.6" y1="20" x2="86.6" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="153.3" y1="20" x2="153.3" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="220" y1="20" x2="220" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

    {/* Spectral line */}
    <path 
      d="M 20,110 Q 30,110 40,108 T 50,103 T 58,80 T 66,106 T 75,108 T 92,108 T 100,20 T 108,108 T 135,108 T 150,108 Q 165,95 178,55 Q 185,55 190,75 Q 198,104 205,108 Q 212,110 220,110" 
      stroke={isActive ? "url(#ramanGlow)" : "rgba(255,255,255,0.4)"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round" 
    />

    <defs>
      <linearGradient id="ramanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f0b07f" />
        <stop offset="50%" stopColor="#d49d81" />
        <stop offset="100%" stopColor="#f0b07f" />
      </linearGradient>
    </defs>
  </svg>
);

const XpsChart = ({ isActive }) => (
  <svg viewBox="0 0 240 130" style={{ width: "100%", height: "100%" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid lines */}
    <line x1="25" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="50" x2="220" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <line x1="25" y1="20" x2="25" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

    {/* XPS Spectral line (White/Grayish to match mockup) */}
    <path 
      d="M 25,108 L 75,108 L 82,108 L 90,30 L 98,108 L 165,108 L 172,108 L 178,92 L 183,108 L 220,108" 
      stroke={isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)"} 
      strokeWidth="1.2" 
      strokeLinecap="round"
      strokeLinejoin="round" 
    />

    {/* C 1s and O 1s Annotations matching mockup */}
    <line x1="90" y1="15" x2="90" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <text x="90" y="10" fill="rgba(255,255,255,0.9)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">C 1s</text>

    <line x1="178" y1="75" x2="178" y2="92" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <text x="178" y="70" fill="rgba(255,255,255,0.9)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">O 1s</text>

    {/* Axes Labels */}
    <text x="12" y="65" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle" transform="rotate(-90 12 65)">Intensity (a.u.)</text>
    <text x="122" y="125" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">Binding energy (eV)</text>

    {/* Axis Ticks */}
    <text x="25" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">1200</text>
    <text x="90" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">800</text>
    <text x="155" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">400</text>
    <text x="220" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">0</text>
  </svg>
);

const SemTemChart = ({ isActive }) => (
  <svg viewBox="0 0 240 130" style={{ width: "100%", height: "100%" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left Side: 3D layered SEM flake */}
    <g opacity={isActive ? "0.95" : "0.55"}>
      {/* Shaded facets to make it look 3D and premium */}
      <path d="M 20,55 L 60,30 L 95,50 L 85,85 L 40,95 Z" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
      <path d="M 20,55 L 60,30 L 60,65 L 40,95 Z" fill="rgba(212, 157, 129, 0.08)" stroke="rgba(212, 157, 129, 0.25)" strokeWidth="0.8" />
      <path d="M 60,30 L 95,50 L 85,85 L 60,65 Z" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
      <path d="M 30,65 L 70,40 L 70,75 L 45,85 Z" fill="rgba(212, 157, 129, 0.1)" stroke="rgba(212, 157, 129, 0.35)" strokeWidth="0.8" />
      <path d="M 40,40 L 75,50 L 65,70 L 50,65 Z" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" />

      {/* SEM Scale bar (1 µm matching mockup) */}
      <line x1="50" y1="112" x2="80" y2="112" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <text x="65" y="106" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">1 µm</text>
    </g>

    {/* Right Side: Simulated Diffraction Pattern (matching mockup) */}
    <g opacity={isActive ? "0.85" : "0.45"}>
      {/* Background box for diffraction pattern */}
      <rect x="130" y="20" width="80" height="80" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      
      {/* Hexagonal dot pattern */}
      <circle cx="170" cy="60" r="3" fill="#ffffff" filter="blur(1px)" />
      <circle cx="170" cy="60" r="1.5" fill="#ffffff" />
      
      <circle cx="150" cy="48" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      <circle cx="190" cy="48" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      <circle cx="150" cy="72" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      <circle cx="190" cy="72" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      <circle cx="170" cy="36" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      <circle cx="170" cy="84" r="1.5" fill="rgba(255,255,255,0.6)" filter="blur(0.5px)" />
      
      <circle cx="130" cy="60" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="210" cy="60" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="150" cy="24" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="190" cy="24" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="150" cy="96" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="190" cy="96" r="1" fill="rgba(255,255,255,0.4)" />

      {/* Diffraction Scale bar (5 1/nm matching mockup) */}
      <line x1="150" y1="112" x2="190" y2="112" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <text x="170" y="106" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">5 1/nm</text>
    </g>
  </svg>
);

const AfmChart = ({ isActive }) => (
  <svg viewBox="0 0 240 130" style={{ width: "100%", height: "100%" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stylized AFM contour scan lines */}
    <g opacity={isActive ? "1" : "0.55"}>
      {/* Background base texture */}
      <rect x="15" y="10" width="170" height="110" fill="rgba(212, 157, 129, 0.015)" rx="4" />

      {/* Contour lines (copper color levels) */}
      {/* Level 1 (deepest layer) */}
      <path 
        d="M 25,45 Q 60,30 110,40 T 170,80 T 130,110 T 60,95 Q 30,75 25,45 Z" 
        fill="rgba(63, 33, 19, 0.25)" 
        stroke="rgba(212,157,129,0.18)" 
        strokeWidth="1" 
      />
      {/* Level 2 */}
      <path 
        d="M 40,55 Q 70,42 105,50 T 150,82 T 120,100 T 65,90 Q 45,75 40,55 Z" 
        fill="rgba(110, 60, 36, 0.35)" 
        stroke="rgba(212,157,129,0.3)" 
        strokeWidth="1" 
      />
      {/* Level 3 */}
      <path 
        d="M 60,65 Q 85,55 110,60 T 135,82 T 110,92 T 75,85 Q 65,75 60,65 Z" 
        fill="rgba(180, 105, 68, 0.45)" 
        stroke="rgba(212,157,129,0.5)" 
        strokeWidth="1" 
      />
      {/* Level 4 (Highest/Thickest point) */}
      <path 
        d="M 80,72 Q 95,65 110,68 T 120,80 T 110,87 T 88,83 Q 82,78 80,72 Z" 
        fill="rgba(242, 165, 110, 0.55)" 
        stroke="rgba(242, 165, 110, 0.8)" 
        strokeWidth="1.2" 
      />

      {/* Scale bar (200 nm matching mockup) */}
      <line x1="140" y1="112" x2="175" y2="112" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      <text x="157.5" y="106" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">200 nm</text>
    </g>

    {/* Color Gradient Scale on the Right (matching mockup text) */}
    <g opacity={isActive ? "0.9" : "0.5"}>
      {/* 10 nm top label */}
      <text x="214" y="20" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="Rubik, sans-serif" alignmentBaseline="middle">10 nm</text>
      
      {/* Scale Gradient Bar */}
      <rect x="200" y="25" width="8" height="80" fill="url(#afmScaleGradient)" rx="1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      
      {/* -10 nm bottom label */}
      <text x="214" y="110" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="Rubik, sans-serif" alignmentBaseline="middle">-10 nm</text>
    </g>

    <defs>
      <linearGradient id="afmScaleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f2a56e" />
        <stop offset="50%" stopColor="#6e3c24" />
        <stop offset="100%" stopColor="#1a0d07" />
      </linearGradient>
    </defs>
  </svg>
);

const UvVisChart = ({ isActive }) => (
  <svg viewBox="0 0 240 130" style={{ width: "100%", height: "100%" }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid lines */}
    <line x1="25" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="50" x2="220" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="80" x2="220" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
    <line x1="25" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <line x1="25" y1="20" x2="25" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

    {/* Spectral line */}
    <path 
      d="M 25,108 Q 50,108 60,70 Q 70,25 80,48 Q 98,90 120,90 Q 155,90 175,102 T 220,108" 
      stroke={isActive ? "url(#uvvisGlow)" : "rgba(255,255,255,0.4)"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round" 
    />

    {/* Axes Labels */}
    <text x="12" y="65" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle" transform="rotate(-90 12 65)">Absorbance (a.u.)</text>
    <text x="122" y="125" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">Wavelength (nm)</text>

    {/* Axis Ticks (300, 500, 700, 900) */}
    <text x="25" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">300</text>
    <text x="90" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">500</text>
    <text x="155" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">700</text>
    <text x="220" y="118" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Rubik, sans-serif" textAnchor="middle">900</text>

    <defs>
      <linearGradient id="uvvisGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f0b07f" />
        <stop offset="100%" stopColor="#d49d81" />
      </linearGradient>
    </defs>
  </svg>
);

const SvgMap = {
  "uv-vis": UvVisChart,
  sem: SemTemChart,
  tem: SemTemChart,
  raman: RamanChart,
  afm: AfmChart,
  xps: XpsChart
};

// SVG Badge Icons matching the declassified print / modern UI layout
const WaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}>
    <path d="M2 12c.5-1.5 1.75-3 3.5-3s3 1.5 3.5 3c.5 1.5 1.75 3 3.5 3s3-1.5 3.5-3c.5-1.5 1.75-3 3.5-3s3 1.5 3.5 3" />
  </svg>
);

const LatticeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="6" cy="6" r="1.2" fill="currentColor" />
    <circle cx="18" cy="6" r="1.2" fill="currentColor" />
    <circle cx="6" cy="18" r="1.2" fill="currentColor" />
    <circle cx="18" cy="18" r="1.2" fill="currentColor" />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="0.8" strokeDasharray="1 1" stroke="currentColor" />
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="0.8" strokeDasharray="1 1" stroke="currentColor" />
    <line x1="6" y1="6" x2="18" y2="6" strokeWidth="0.8" stroke="currentColor" />
    <line x1="18" y1="6" x2="18" y2="18" strokeWidth="0.8" stroke="currentColor" />
    <line x1="18" y1="18" x2="6" y2="18" strokeWidth="0.8" stroke="currentColor" />
    <line x1="6" y1="18" x2="6" y2="6" strokeWidth="0.8" stroke="currentColor" />
  </svg>
);

const RamanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}>
    <path d="M 3,20 L 9,20 Q 11,20 12,5 Q 13,20 15,20 L 21,20" />
  </svg>
);

const ConcentricIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="currentColor" />
  </svg>
);

const XpsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}>
    <path d="M 3,20 L 8,20 Q 9.5,20 10,4 Q 10.5,20 12,20 L 15,20 Q 16.5,20 17,12 Q 17.5,20 19,20 L 21,20" />
  </svg>
);

const BadgeIconMap = {
  "uv-vis": WaveIcon,
  sem: LatticeIcon,
  tem: LatticeIcon,
  raman: RamanIcon,
  afm: ConcentricIcon,
  xps: XpsIcon
};

const EvidenceCard = ({ item, index }) => {
  const ChartComponent = SvgMap[item.id] || UvVisChart;
  const BadgeIcon = BadgeIconMap[item.id] || WaveIcon;

  return (
    <article className={styles.evidenceRailCard} style={{ "--motion-delay": `${index * 86}ms` }}>
      <div className={styles.evidenceRailFigure}>
        <ChartComponent isActive={true} />
      </div>
      <div className={styles.evidenceRailCopy}>
        <span className={styles.evidenceRailIcon} aria-hidden="true">
          <BadgeIcon />
        </span>
        <span className={styles.evidenceRailMeta}>
          <span className={styles.evidenceRailTitle}>{item.name}</span>
          <span className={styles.evidenceRailProof}>{item.proof}</span>
        </span>
        <span className={styles.evidenceRailDetail}>{item.detail}</span>
      </div>
    </article>
  );
};

const EvidenceShowcase = ({ items, scrollRef }) => {
  const sceneRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: sceneRef,
    offset: ["start start", "end end"],
  });
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 28,
    mass: 0.8,
    restDelta: 0.001,
  });
  const firstRailY = useTransform(railProgress, [0, 1], ["3vh", "-30vh"]);
  const secondRailY = useTransform(railProgress, [0, 1], ["3vh", "-46vh"]);
  const backgroundWordY = useTransform(railProgress, [0, 1], ["-8vh", "18vh"]);
  const byId = Object.fromEntries(items.map((item) => [item.id, item]));
  const firstRail = ["uv-vis", "sem", "tem"].map((id) => byId[id]).filter(Boolean);
  const secondRail = ["raman", "xps", "afm"].map((id) => byId[id]).filter(Boolean);

  return (
    <div ref={sceneRef} className={styles.evidenceScrollScene}>
      <div className={styles.evidenceScrollStage}>
        <motion.span className={styles.evidenceBackgroundWord} style={{ y: backgroundWordY }} aria-hidden="true">EVIDENCE</motion.span>
        <div className={styles.evidenceStickyCopy}>
          <span className={styles.kicker}>EVIDENCE</span>
          <EvidenceProofTitle progress={railProgress} />
          <p className={styles.evidenceLeadText}>
            The material is only useful when structure, chemistry, and morphology are verified.
          </p>
        </div>

        <div className={styles.evidenceRails} aria-label="Material evidence methods">
          <motion.div className={`${styles.evidenceRail} ${styles.evidenceRailPrimary}`} style={{ y: firstRailY }}>
            {firstRail.map((item, index) => <EvidenceCard key={item.id} item={item} index={index} />)}
          </motion.div>
          <motion.div className={`${styles.evidenceRail} ${styles.evidenceRailSecondary}`} style={{ y: secondRailY }}>
            {secondRail.map((item, index) => <EvidenceCard key={item.id} item={item} index={index + firstRail.length} />)}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
const ApproachContent = ({ scrollRef }) => {
  const stageRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return undefined;

    let activateTimer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (activateTimer) window.clearTimeout(activateTimer);
        if (entry.isIntersecting) {
          setIsActive(false);
          activateTimer = window.setTimeout(() => setIsActive(true), 80);
        } else {
          setIsActive(false);
        }
      },
      { root, threshold: 0.24, rootMargin: "-6% 0px -12% 0px" }
    );

    observer.observe(stage);
    return () => {
      if (activateTimer) window.clearTimeout(activateTimer);
      observer.disconnect();
    };
  }, [scrollRef]);

  return (
    <div
      ref={stageRef}
      className={`${styles.approachStage} ${isActive ? styles.approachStageActive : ""}`}
    >
      <div className={styles.approachCopy}>
        <div className={styles.approachEyebrow}>
          <span>MY R&amp;D APPROACH</span>
          <i aria-hidden="true" />
        </div>
        <SpotlightTitle words={["From", "Idea", "To", "Impact."]} className={styles.splitLineLayout} />
        <p className={styles.approachLead}>
          I build the process, measure the output,<br />
          and move research toward real-world use.
        </p>
        <div className={styles.heroActions}>
          <Link to="/AcademicCV"><TbDownload aria-hidden="true" /><span>Download Resume</span></Link>
          <a href="mailto:sarabha@yorku.ca"><TbMail aria-hidden="true" /><span>Contact Me</span></a>
        </div>
      </div>

      <div className={styles.approachOrbit} aria-label="R&D framework focus areas">
        <span className={`${styles.orbitRing} ${styles.orbitRingOuter}`} aria-hidden="true" />
        <span className={`${styles.orbitRing} ${styles.orbitRingMiddle}`} aria-hidden="true" />
        <span className={`${styles.orbitRing} ${styles.orbitRingInner}`} aria-hidden="true" />
        <span className={styles.orbitPlanet} aria-hidden="true" />
        {approachOrbitSteps.map(({ number, title, detail, Icon }, index) => (
          <article
            key={number}
            className={`${styles.orbitStep} ${styles[`orbitStep${index + 1}`]}`}
          >
            <span className={styles.orbitIcon} aria-hidden="true"><Icon /></span>
            <span className={styles.orbitCopy}>
              <span className={styles.orbitNumber}>{number}</span>
              <strong>{title}</strong>
              <span>{detail}</span>
            </span>
          </article>
        ))}
      </div>
    </div>
  );
};
const WorkStory = () => {
  const scrollRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const smoothProgress = useSpring(scrollYProgress, storySpring);
  const glowOpacity = useTransform(smoothProgress, [0, 0.12, 1], [0.42, 0.9, 0.68]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { handleScroll } = useWorkStoryEffects(scrollRef);

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
        transition={routeTransition}
      >
        <div className={styles.glowingBg} aria-hidden="true" />
        <div className={styles.progressTrack} aria-hidden="true">
          <motion.span
            style={{
              scaleX: smoothProgress,
              opacity: glowOpacity,
              transformOrigin: "left center",
            }}
          />
        </div>

        <header className={styles.hero} data-reveal>
          <div className={styles.heroFrame}>
            <div className={styles.heroCopy}>
              <HeroGraphene />
              <h1>
                <span>R<span className={styles.regularAmp}>&</span>D JOURNEY</span>
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

          <SectionShell 
            id="process" 
            kicker="The Answer" 
            title={
              <SpotlightTitle words={["Compressible", "Flow", "Exfoliation"]} />
            } 
            className={styles.asymProcess}
          >
            <div className={styles.cfeProcessImage} aria-hidden="true" />
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.lead}>
                  A dry, gas-driven route that converts layered powders into scalable 2D material populations.
                </p>
              </div>
            </div>
            <InteractiveProcessMap steps={processSteps} />
          </SectionShell>

          <SectionShell 
            id="system" 
            className={`${styles.splitSection} ${styles.asymSystem}`}
          >
            <div className={styles.systemCopy}>
              <SystemSpotlightTitle />
              <p className={`${styles.lead} ${styles.systemLead}`}>
                I tune the operating window,<br />
                then connect each variable<br />
                to material output.
              </p>
            </div>
            <div className={styles.variablePanel}>
              <h3>
                <TbHexagon aria-hidden="true" />
                <span>Controlled Variables</span>
              </h3>
              <div className={styles.controlledList}>
                {variables.map(({ label, Icon }, index) => (
                  <span key={label} style={{ "--delay": `${index * 70}ms` }}>
                    <Icon aria-hidden="true" />
                    <em>{label}</em>
                  </span>
                ))}
              </div>
            </div>
          </SectionShell>

          <SectionShell
            id="evidence"
            className={styles.asymEvidence}
            eager
          >
            <EvidenceShowcase items={characterization} scrollRef={scrollRef} />
          </SectionShell>
          <SectionShell 
            id="modeling" 
            kicker="MODELING" 
            title={
              <SpotlightTitle words={["Exposing The", "Mechanism"]} />
            } 
            className={styles.asymModeling}
          >
            <div className={styles.sectionIntro}>
              <p className={styles.lead}>
                Experiments show what changed. Modeling explains why it changed.
              </p>
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

          <SectionShell 
            id="industry" 
            kicker="INDUSTRY" 
            title={
              <SpotlightTitle words={["From", "Research", "To", "Value"]} className={styles.splitLineLayout} />
            } 
            className={styles.asymIndustry}
          >
            <p className={styles.lead}>
              The work shifts from making a material once to making it reliably.
            </p>
            <div className={styles.beforeAfter}>
              <article>
                <span>Before</span>
                <h3>Academic<br />Question</h3>
                <p>Can the material be produced and measured?</p>
              </article>
              <article>
                <span>After</span>
                <h3>Industrial<br />Question</h3>
                <p>
                  Can the process deliver consistent material at usable scale?
                </p>
              </article>
            </div>
          </SectionShell>

          <SectionShell
            id="approach"
            className={styles.asymApproach}
          >
            <ApproachContent scrollRef={scrollRef} />
          </SectionShell>
        </div>
      </motion.main>
    </>
  );
};

export default WorkStory;







