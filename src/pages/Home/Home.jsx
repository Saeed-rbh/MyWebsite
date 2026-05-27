import React, { useEffect, useState } from "react";
import "./Home.css";
import styles from "./Home.module.css";
import SEO from "../../components/SEO/SEO";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import Popup from "../../components/Popup/Popup";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const { currentPage } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });
  const [originRect, setOriginRect] = useState(null);

  const handleWordClick = (word, e) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (e && e.currentTarget) {
      setOriginRect(e.currentTarget.getBoundingClientRect());
    }

    if (normalizedWord.includes("materials scientist")) {
      setPopupContent({
        title: "🧪 Materials Scientist & Researcher",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>How can advanced materials move from promising lab results to real technologies?</strong>
              </p>
              <p className={styles.text}>
                This is the single driving question behind my work. My research bridges the critical gap between experimental process development and computational modeling. Instead of just synthesizing materials, I investigate exactly how processing conditions dictate material quality, thermal transport, and mechanical behavior.
              </p>
            </div>
            
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Core Capabilities</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Advanced Characterization</span>
                <p className={styles.cardText}>Extensive expertise in XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy to connect processing with structural quality.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Multiscale Modeling</span>
                <p className={styles.cardText}>Leveraging Molecular Dynamics (MD), CFD (COMSOL), and machine-learning interatomic potentials to predict material behavior.</p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Fun Fact 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I am an officially certified Main Operator for the mIRage-Raman system (Photothermal Spectroscopy Corp), allowing me to conduct highly advanced sub-micron IR and Raman spectroscopy.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsScientist";
    }

    if (normalizedWord.includes("2d nanomaterials")) {
      setPopupContent({
        title: "⚡ 2D Nanomaterials",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>The foundational building blocks of the future.</strong>
              </p>
              <p className={styles.text}>
                Two-dimensional nanomaterials exhibit extraordinary thermal, electrical, and mechanical properties. My work focuses on the scalable production and integration of Graphene (super-conductivity), hexagonal Boron Nitride (insulation), and Molybdenum Disulfide (semiconductors).
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Industrial Applications</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Nano-Enhanced Composites</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Improving the thermal and mechanical resilience of industrial polymers and coatings.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Thermal Management</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Developing high-performance nanofluids and thermal interface materials for advanced electronics.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Behind the Scenes 🔍</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>The hardest part of 2D material synthesis isn"t making the material—it"s maintaining atomic-level quality and preventing structural defects during high-throughput, industrial-scale production.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
    }

    if (normalizedWord.includes("heat transfer")) {
      setPopupContent({
        title: "🔥 Nano-Enhanced Heat Transfer",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Solving the thermal bottleneck in modern tech.</strong>
              </p>
              <p className={styles.text}>
                As processors get faster and devices get smaller, effective thermal management has become a critical bottleneck. My research addresses this by engineering nanoscale interfaces to enhance thermal conductance and discovering new ways to manipulate heat flow.
              </p>
            </div>
            
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Key Contributions</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Nanofluid Optimization</span>
                <p className={styles.cardText}>Investigated interfacial thermal conductance between nanoparticles (like TiO₂) and base fluids to design superior coolants.</p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Fun Fact 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>In 2023, I published a paper in <em>Scientific Reports</em> detailing how nonreciprocal forces can actually enable <strong>cold-to-hot heat transfer</strong> between nanoparticles, breaking traditional thermodynamic expectations at the nanoscale!</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "HeatTransfer";
    }

    if (normalizedWord.includes("materials processing")) {
      setPopupContent({
        title: "⚙️ Scalable Materials Processing",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>From laboratory synthesis to industrial nanomanufacturing.</strong>
              </p>
              <p className={styles.text}>
                A major hurdle in advanced materials is the "Valley of Death"—transitioning from small-batch lab synthesis to high-throughput manufacturing. I specialize in designing, optimizing, and scaling production processes to ensure lab-quality materials can be mass-produced.
              </p>
            </div>
            
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Process Optimization</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Variable Engineering</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Scaling up production by optimizing gas flow, pressure, temperature, and carrier gas selection.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Yield & Quality Control</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Utilizing multiscale modeling and Python-based data analysis to maximize nanomaterial yield without compromising structural integrity.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Behind the Scenes 🔍</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>My obsession with process optimization started before academia. In 2016, I worked as an HVAC Apprentice in Iran, dealing with massive commercial thermal systems and ventilation. Today, I use those same engineering principles, just on an atomic scale.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsProcessing";
    }

    if (normalizedWord.includes("compressible flow exfoliation")) {
      setPopupContent({
        title: "🚀 Compressible Flow Exfoliation",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>A paradigm shift in 2D material production.</strong>
              </p>
              <p className={styles.text}>
                Compressible Flow Exfoliation (CFE) is a novel, gas-driven approach designed to mass-produce 2D nanomaterials. It is cleaner, faster, and more scalable than traditional liquid-phase or chemical methods.
              </p>
            </div>
            
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>How It Works</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard} style={{ gridColumn: "1 / -1" }}>
                <span className={styles.cardTitle}>Supersonic Fluid Dynamics</span>
                <p className={styles.cardText}>By utilizing high-pressure gas flow and shockwaves, CFE physically shears bulk materials (like graphite) into atomically thin sheets (graphene) instantly, entirely bypassing the need for slow, toxic solvents.</p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Fun Fact 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I developed a high-pressure setup for this process during my PhD, and it earned me a Mitacs Globalink Research Award, allowing me to take the tech to the University of Kassel in Germany as a Visiting Researcher in 2025!</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "CompressibleFlowExfoliation";
    }

    if (normalizedWord.includes("commercialization")) {
      setPopupContent({
        title: "💼 Research Commercialization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Translating technical research into market value.</strong>
              </p>
              <p className={styles.text}>
                Scientific breakthroughs only matter if they can reach the market and solve real problems. I actively explore the commercial potential of advanced materials, focusing on industry needs, adoption barriers, and science-based venture development.
              </p>
            </div>
            
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Industry Engagement</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Strategic Positioning</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Refining value propositions to translate complex technical specifications into clear, industry-facing solutions.
                </p>
              </div>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Behind the Scenes 🔍</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>As a Lab2Market Validate & Launch Fellow (2025-2026), I didn"t just stay in the lab—I conducted over <strong>50 rigorous customer discovery interviews</strong> with stakeholders across manufacturing, composites, and clean technology to figure out exactly what the market demands.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "Commercialization";
    }
  };

rt React, { useEffect, useState } from "react";
import "./Home.css";
import styles from "./Home.module.css";
import SEO from "../../components/SEO/SEO";
import WelcomeMessage from "./WelcomeMessage";
import NameMessage from "./NameMessage";
import MainText from "./MainText";
import HobbyProfession from "./HobbyProfession";
import Popup from "../../components/Popup/Popup";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { visibility } = useSelector((state) => state.ui);
  const { currentPage } = useSelector((state) => state.ui);

  const location = useLocation();
  const [resumeClicked, setResumeClicked] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", content: "" });
  const [originRect, setOriginRect] = useState(null);

  const handleWordClick = (word, e) => {
    const normalizedWord = word.replace(/-/g, " ").toLowerCase();

    if (e && e.currentTarget) {
      setOriginRect(e.currentTarget.getBoundingClientRect());
    }

    if (normalizedWord.includes("materials scientist")) {
      setPopupContent({
        title: "Materials Scientist & Researcher",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Bridging the gap between processing, structure, and performance.</strong>
              </p>
              <p className={styles.text}>
                My research connects experimental process development with deep materials characterization and computational modeling. I investigate how processing conditions dictate material quality, thermal transport, and mechanical behavior.
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Core Capabilities</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Advanced Characterization</span>
                <p className={styles.cardText}>Certified operator for mIRage-Raman. Extensive expertise in XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Multiscale Modeling</span>
                <p className={styles.cardText}>Leveraging Molecular Dynamics (MD), CFD (COMSOL), and machine-learning interatomic potentials to predict material behavior.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsScientist";
    }

    if (normalizedWord.includes("2d nanomaterials")) {
      setPopupContent({
        title: "2D Nanomaterials (Graphene, h-BN, MoS₂)",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>The foundation of next-generation technology.</strong>
              </p>
              <p className={styles.text}>
                Two-dimensional nanomaterials exhibit extraordinary thermal, electrical, and mechanical properties. My work focuses on scalable production and integration of Graphene, hexagonal Boron Nitride (h-BN), and Molybdenum Disulfide (MoS₂).
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Industrial Applications</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Nano-Enhanced Composites</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Improving the thermal and mechanical resilience of industrial polymers and coatings.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Thermal Management</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Developing high-performance nanofluids and thermal interface materials for electronics.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
    }

    if (normalizedWord.includes("heat transfer")) {
      setPopupContent({
        title: "Nano-Enhanced Heat Transfer",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Optimizing thermal pathways at the nanoscale.</strong>
              </p>
              <p className={styles.text}>
                Effective thermal management is a critical bottleneck in modern electronics and energy systems. My research addresses this by engineering nanoscale interfaces to enhance thermal conductance.
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Key Contributions</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Nanofluid Optimization</span>
                <p className={styles.cardText}>Investigating interfacial thermal conductance between nanoparticles (like TiO₂) and base fluids.</p>
              </div>
              <div className={styles.glassCard}>
                <span className={styles.cardTitle}>Nonreciprocal Heat Transfer</span>
                <p className={styles.cardText}>Published findings on enabling cold-to-hot heat transfer between nanoparticles.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "HeatTransfer";
    }

    if (normalizedWord.includes("materials processing")) {
      setPopupContent({
        title: "Scalable Materials Processing",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>From laboratory synthesis to industrial nanomanufacturing.</strong>
              </p>
              <p className={styles.text}>
                A major hurdle in advanced materials is transitioning from small-batch lab synthesis to high-throughput manufacturing. I specialize in designing and optimizing scalable processes.
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Process Optimization</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Variable Engineering</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Scaling up production by optimizing gas flow, pressure, temperature, and carrier gas selection.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Yield & Quality Control</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Utilizing multiscale modeling and Python-based data analysis to maximize nanomaterial yield while preserving structural integrity.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsProcessing";
    }

    if (normalizedWord.includes("compressible flow exfoliation")) {
      setPopupContent({
        title: "Compressible Flow Exfoliation (CFE)",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>A paradigm shift in 2D material production.</strong>
              </p>
              <p className={styles.text}>
                Compressible Flow Exfoliation (CFE) is a novel, gas-driven approach designed to mass-produce 2D nanomaterials in a cleaner, faster, and more scalable way than traditional liquid-phase or chemical methods.
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>How It Works</h3>
            <div className={`${styles.glassGrid} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={styles.glassCard} style={{ gridColumn: "1 / -1" }}>
                <span className={styles.cardTitle}>Supersonic Fluid Dynamics</span>
                <p className={styles.cardText}>By utilizing high-pressure gas flow and shockwaves, CFE physically shears bulk materials (like graphite) into atomically thin sheets (graphene) instantly, without the need for toxic solvents.</p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "CompressibleFlowExfoliation";
    }

    if (normalizedWord.includes("commercialization")) {
      setPopupContent({
        title: "Research Commercialization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                <strong>Translating technical research into market value.</strong>
              </p>
              <p className={styles.text}>
                Scientific breakthroughs only matter if they can reach the market. As a Lab2Market Validate & Launch Fellow, I actively explore the commercial potential of advanced materials.
              </p>
            </div>
            <h3 className={`${styles.miniTitle} ${styles.animateEnter} ${styles.delay2}`}>Industry Engagement</h3>
            <div className={`${styles.timelineList} ${styles.animateEnter} ${styles.delay2}`}>
              <div className={`${styles.timelineItem} ${styles.highlightItem}`}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Customer Discovery</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Conducted 50+ interviews with stakeholders in manufacturing, composites, and clean tech to understand adoption barriers.
                </p>
              </div>
              <div className={styles.timelineItem}>
                <strong style={{ color: "#fff", fontSize: "1.1rem", display: "block", marginBottom: "-5px" }}>Strategic Positioning</strong>
                <p className={styles.text} style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Refined value propositions and business model assumptions to translate complex technical specs into industry-facing solutions.
                </p>
              </div>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "Commercialization";
    }
  };

useEffect(() => {
    if (visibility && location.pathname === "/" && currentPage === "/") {
      setResumeClicked(1);
    } else if (
      visibility &&
      location.pathname === "/" &&
      currentPage === "/AcademicCV"
    ) {
      setResumeClicked(2);
    } else {
      setResumeClicked(3);
    }
  }, [location.pathname, currentPage, visibility]);

  return (
    visibility && (
      <div className={styles.container}>
        <SEO
          title="Saeed Arabha | Home"
          description="Personal website of Saeed Arabha, featuring academic CV, research, and portfolio."
          name="Saeed Arabha"
          type="website"
        />
        <WelcomeMessage MenuHide={resumeClicked} delay={100} />
        <NameMessage MenuHide={resumeClicked} delay={300} />
        <MainText MenuHide={resumeClicked} delay={400} onWordClick={handleWordClick} />
        <HobbyProfession
          MenuHide={resumeClicked}
          delay={resumeClicked === 1 ? 1400 : 200}
        />
        <Popup
          isOpen={popupOpen}
          onClose={() => {
            setPopupOpen(false);
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
          }}
          title={popupContent.title}
          content={popupContent.content}
          originRect={originRect}
        />
      </div>
    )
  );
};
export default HomePage;