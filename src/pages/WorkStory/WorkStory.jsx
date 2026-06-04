import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import styles from "./WorkStory.module.css";


const chain = ["Materials Scientist", "2D & Advanced Materials", "Characterization", "CFD", "Thermal Management"];



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
        {/* Bonds (lines) */}
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
        {/* Atoms (circles) */}
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
                <span>Material R<span className={styles.regularAmp}>&</span>D Journey</span>
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
