import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import styles from "./WorkStory.module.css";

const chain = ["Process", "Structure", "Properties", "Application", "Scale-up"];

const navItems = [
  { id: "gap", label: "The Gap" },
  { id: "process", label: "The Process" },
  { id: "evidence", label: "The Evidence" },
  { id: "modeling", label: "The Modeling" },
  { id: "industry", label: "The Industry Shift" },
  { id: "approach", label: "R&D Approach" },
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
    purpose: "Structural fingerprints, defects, layer-related features",
    proof: "Connects spectra to material quality and structural change.",
  },
  {
    name: "XPS",
    purpose: "Surface chemistry, oxidation, bonding states",
    proof: "Shows whether processing preserved or altered surface chemistry.",
  },
  {
    name: "TEM/STEM",
    purpose: "Nanosheet morphology, lattice features, structural preservation",
    proof: "Confirms nanoscale structure beyond bulk measurements.",
  },
  {
    name: "SEM",
    purpose: "Surface morphology and particle/nanosheet distribution",
    proof: "Reveals output form, distribution, and process consistency.",
  },
  {
    name: "AFM",
    purpose: "Thickness, topography, nanosheet geometry",
    proof: "Measures whether exfoliation produced thin, useful nanosheets.",
  },
  {
    name: "UV-Vis",
    purpose: "Optical response and dispersion-related analysis",
    proof: "Supports dispersion and optical behavior comparisons.",
  },
  {
    name: "mIRage-Raman",
    purpose: "Advanced photothermal and spectroscopic characterization",
    proof: "Adds sub-micron chemical and vibrational insight.",
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

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
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

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [scrollRef]);

  const handleScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    const maxScroll = root.scrollHeight - root.clientHeight;
    setProgress(maxScroll <= 0 ? 0 : (root.scrollTop / maxScroll) * 100);
  };

  return { activeSection, progress, handleScroll };
};

const SectionShell = ({ id, kicker, title, children, className = "" }) => (
  <section id={id} className={`${styles.section} ${className}`} data-reveal>
    {kicker && <span className={styles.kicker}>{kicker}</span>}
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

const HeroKineticSvg = () => (
  <svg className={`${styles.animatedSvg} ${styles.heroSvg}`} viewBox="0 0 420 420" aria-hidden="true">
    <circle className={styles.svgOrbit} cx="210" cy="210" r="150" />
    <circle className={styles.svgOrbitAlt} cx="210" cy="210" r="96" />
    <path className={styles.svgTrace} d="M66 246 C114 116, 269 84, 354 190 S284 376, 122 320" />
    <path className={styles.svgTraceSlow} d="M84 162 C161 64, 312 102, 334 226 C354 340, 182 366, 92 270" />
    <g className={styles.svgNodes}>
      <circle cx="92" cy="270" r="7" />
      <circle cx="174" cy="102" r="7" />
      <circle cx="334" cy="226" r="7" />
      <circle cx="246" cy="336" r="7" />
    </g>
    <text className={styles.svgText} x="118" y="216">PROCESS</text>
    <text className={styles.svgTinyText} x="154" y="242">STRUCTURE / SCALE</text>
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

const WorkStory = () => {
  const scrollRef = useRef(null);
  const { activeSection, progress, handleScroll } = useWorkStoryEffects(scrollRef);

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

        <aside className={styles.sideNav} aria-label="R&D journey sections">
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

        <div className={styles.mobileSectionLabel}>
          <span>{navItems[Math.max(activeIndex, 0)]?.label}</span>
        </div>

        <header className={styles.hero} data-reveal>
          <div className={styles.heroFrame}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Materials R&D Journey</span>
              <h1>From Lab Discovery to Manufacturing Thinking</h1>
              <p>
                I connect advanced materials research with process development,
                characterization, modeling, and commercialization to help move
                nanomaterials toward real industrial use.
              </p>

              <div className={styles.chain} aria-label="R&D chain">
                {chain.map((item, index) => (
                  <span key={item} style={{ "--delay": `${index * 90}ms` }}>
                    {item}
                  </span>
                ))}
              </div>

              <div className={styles.heroActions}>
                <Link to="/research-progress">View CFE Case Study</Link>
                <Link to="/AcademicCV">Download Resume</Link>
                <a href="mailto:sarabha@yorku.ca">Contact Me</a>
              </div>
            </div>
            <HeroKineticSvg />
          </div>
        </header>

        <div className={styles.storyGrid}>
          <SectionShell id="gap" kicker="01 / The gap I noticed" className={styles.asymGap}>
            <div className={styles.textBlock}>
              <p>
                During my PhD, I became interested in a recurring gap in
                advanced materials: many nanomaterials show excellent properties
                in the lab, but the processes used to make them are often too
                slow, expensive, chemically intensive, inconsistent, or difficult
                to scale.
              </p>
              <p>
                Instead of only asking whether a material could be produced, I
                began asking a more engineering-focused question:
              </p>
            </div>
            <blockquote>
              Can the process be made faster, cleaner, more scalable, and still
              produce useful material quality?
            </blockquote>
          </SectionShell>

          <SectionShell id="process" kicker="02 / The direction I chose" title="Compressible Flow Exfoliation" className={styles.asymProcess}>
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.lead}>
                  I focused on Compressible Flow Exfoliation, a gas-driven approach
                  for producing 2D nanomaterials such as graphene, hexagonal boron
                  nitride, and MoS2.
                </p>
                <p>
                  The work required thinking beyond material synthesis. I had to
                  study how pressure, gas flow, temperature, carrier gas selection,
                  nozzle conditions, precursor properties, and recovery methods
                  influence the final material.
                </p>
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
              <p>
                I developed and studied a high-pressure gas-driven exfoliation
                setup designed to produce 2D nanosheets through rapid
                acceleration, shear, and particle-gas interaction.
              </p>
              <p>
                This work combined experimental design, process control,
                material production, and engineering judgment. The goal was not
                only to produce graphene, h-BN, and MoS2, but to understand
                whether the process could become a practical route for scalable
                nanomanufacturing.
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
                  Producing material is only the first step. The next step is
                  proving what was produced, how the process changed it, and whether
                  the output is useful.
                </p>
                <p>
                  I used advanced characterization to evaluate structure, morphology,
                  surface chemistry, defects, optical response, and material
                  preservation.
                </p>
              </div>
              <EvidenceSvg />
            </div>
            <div className={styles.characterGrid}>
              {characterization.map((item, index) => (
                <article key={item.name} style={{ "--delay": `${index * 70}ms` }}>
                  <span>{item.name}</span>
                  <p>{item.purpose}</p>
                  <strong>What it proves</strong>
                  <em>{item.proof}</em>
                </article>
              ))}
            </div>
          </SectionShell>

          <SectionShell id="modeling" kicker="05 / The modeling layer" title="Using Modeling to Understand What Experiments Alone Cannot Show" className={styles.asymModeling}>
            <div className={styles.sectionIntro}>
              <p className={styles.lead}>
                My work also uses computational tools to interpret mechanisms and
                support experimental decisions. I have used COMSOL simulations,
                molecular dynamics, Python-based analysis, and machine-learning
                interatomic potentials to study gas-particle interactions,
                nanoscale behavior, thermal transport, and process-structure
                relationships.
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
              Through Lab2Market Validate, Lab2Market Launch, and Inventor to
              Founder, I began looking at my research not only as a scientific
              project, but as a potential industrial technology.
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
              This is the way I approach advanced materials development. I am
              interested in the full chain: designing the process, validating the
              material, understanding the mechanism, and connecting the result to
              real applications.
            </p>
            <p>
              I bring together hands-on process development, advanced
              characterization, computational modeling, and commercialization
              thinking.
            </p>
            <div className={styles.closeCard}>
              <p>
                If your team is working on advanced materials,
                nanomanufacturing, characterization, or process scale-up, I would
                be happy to connect.
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
