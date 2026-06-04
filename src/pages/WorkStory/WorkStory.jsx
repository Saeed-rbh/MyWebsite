import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import styles from "./WorkStory.module.css";

const chain = ["Materials Scientist", "2D & Advanced Materials", "Characterization", "CFD", "Thermal Management"];

const grapheneModelUrls = ["/grapheneNew1.gltf", "/grapheneNew2.gltf", "/grapheneNew3.gltf"];

grapheneModelUrls.forEach((url) => useGLTF.preload(url));

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
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [progress, setProgress] = useState(0);
  const [showSideNav, setShowSideNav] = useState(false);
  const rafRef = useRef(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            entry.target.classList.remove(styles.visible);
          }
        });
      },
      { root, threshold: 0.18 }
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { root, rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    root.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    navItems.forEach(({ id }) => {
      const section = root.querySelector(`#${id}`);
      if (section) sectionObserver.observe(section);
    });

    setShowSideNav(root.scrollTop > root.clientHeight * 0.7);

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollRef]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const maxScroll = root.scrollHeight - root.clientHeight;
      const nextProgress = maxScroll <= 0 ? 0 : (root.scrollTop / maxScroll) * 100;
      const progressRatio = nextProgress / 100;
      const shouldShowSideNav = root.scrollTop > root.clientHeight * 0.7;

      if (Math.abs(nextProgress - lastProgressRef.current) > 0.6) {
        lastProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      setShowSideNav((current) => (current === shouldShowSideNav ? current : shouldShowSideNav));

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

  return { activeSection, progress, showSideNav, handleScroll };
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

const HeroGrapheneLayer = ({ url, position, rotation, scale, delay = 0 }) => {
  const groupRef = useRef(null);
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.material = new THREE.MeshStandardMaterial({
        color: "#f2d5c5",
        emissive: "#c88d70",
        emissiveIntensity: 0.22,
        roughness: 0.4,
        metalness: 0.12,
      });
    });
    return clone;
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.elapsedTime + delay;
    groupRef.current.rotation.x = rotation[0] + Math.sin(time * 0.38) * 0.08;
    groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.48) * 0.16;
    groupRef.current.rotation.z = rotation[2] + time * 0.1;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
};

const HeroGraphene = () => (
  <div className={styles.heroGraphene} aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.7]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.15} />
        <pointLight position={[0, 2.6, 3.5]} intensity={3.2} color="#f0c1a9" />
        <pointLight position={[-2.4, -1.5, 2.4]} intensity={1.2} color="#d49d81" />
        <group position={[-0.8, -0.55, 0]} rotation={[-0.92, 0.1, -0.18]} scale={0.82}>
          <HeroGrapheneLayer url={grapheneModelUrls[0]} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.62} />
          <HeroGrapheneLayer url={grapheneModelUrls[1]} position={[0.12, 0.08, -0.12]} rotation={[0.02, 0.08, 0.12]} scale={0.62} delay={0.7} />
          <HeroGrapheneLayer url={grapheneModelUrls[2]} position={[-0.1, -0.08, 0.12]} rotation={[-0.02, -0.08, -0.1]} scale={0.62} delay={1.4} />
        </group>
      </Suspense>
    </Canvas>
  </div>
);

const WorkStory = () => {
  const scrollRef = useRef(null);
  const { activeSection, progress, showSideNav, handleScroll } = useWorkStoryEffects(scrollRef);

  const activeIndex = useMemo(
    () => navItems.findIndex((item) => item.id === activeSection),
    [activeSection]
  );

  return (
    <>
      <SEO
        title="Saeed Arabha | R&D Journey"
        description="A recruiter-focused R&D narrative of Saeed Arabha's materials approach across process development, characterization, modeling, and industrial value."
        name="Saeed Arabha"
        type="website"
      />
      <main className={styles.page} ref={scrollRef} onScroll={handleScroll}>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <aside className={`${styles.sideNav} ${showSideNav ? styles.showSideNav : ""}`} aria-label="R&D journey sections">
          <span className={styles.navTitle}>R&D Journey</span>
          {navItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? styles.activeNavItem : ""}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </aside>

        <div className={`${styles.mobileSectionLabel} ${showSideNav ? styles.showMobileSectionLabel : ""}`}>
          <span>{navItems[Math.max(activeIndex, 0)]?.label}</span>
        </div>

        <header className={styles.hero} data-reveal>
          <div className={styles.heroFrame}>
            <div className={styles.heroCopy}>
              <HeroGraphene />
              <h1>
                <span>Material R&D Journey</span>
              </h1>
              <p>Lab to Manufacturing</p>

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
          <SectionShell id="gap" kicker="01 / The gap I noticed" className={styles.asymGap}>
            <div className={styles.textBlock}>
              <p className={styles.lead}>
                Lab-quality nanomaterials often fail at manufacturing scale.
              </p>
            </div>
            <blockquote>
              Can quality survive speed, pressure, and scale?
            </blockquote>
          </SectionShell>

          <SectionShell id="process" kicker="02 / The direction I chose" title="Compressible Flow Exfoliation" className={styles.asymProcess}>
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

          <SectionShell id="system" kicker="03 / The system I built" className={`${styles.splitSection} ${styles.asymSystem}`}>
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

          <SectionShell id="evidence" kicker="04 / The evidence I collected" title="Proving the Material, Not Just Producing It" className={styles.asymEvidence}>
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

          <SectionShell id="modeling" kicker="05 / The modeling layer" title="Using Modeling to Understand What Experiments Alone Cannot Show" className={styles.asymModeling}>
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

          <SectionShell id="industry" kicker="06 / The industry shift" title="From Research Question to Industrial Value" className={styles.asymIndustry}>
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

          <SectionShell id="approach" kicker="07 / Closing framework" title="My R&D Approach" className={styles.asymApproach}>
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
      </main>
    </>
  );
};

export default WorkStory;
