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
        title: "🧪 Materials Scientist",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Think of a chef figuring out how changing a recipe fundamentally alters the texture and flavor of a cake.</strong>
              </p>
              <p className={styles.text}>
                That is what a materials scientist does, but at the atomic level, exploring how things are made and how they can be made better. I am a Materials Scientist and researcher working on 2D nanomaterials and scalable materials processing.
              </p>
              <p className={styles.text}>
                My background combines materials characterization, computational modeling, and experimental process development. My daily focus revolves around understanding how structure, interfaces, and processing conditions directly affect a material's ultimate performance.
              </p>
            </div>
            
            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Goal 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>The story of my work always leads back to a simple, driving goal: to develop better materials, understand them deeply, and help move them toward practical use.</p>
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
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Imagine taking a thick book and peeling it down to a few very specific pages to discover that those isolated pages behave completely differently than the whole book.</strong>
              </p>
              <p className={styles.text}>
                That is the essence of 2D nanomaterials. In my work, these materials are not merely single atomic layers; they are technically classified as exfoliated nanoplatelets that are approximately 20 layers thick. My specific focus is on graphene, h-BN, and MoS₂.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Global Research 🌍</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>This passion took me to the University of Kassel in Germany as a Mitacs Globalink Research Award Fellow. There, I studied CFE-produced graphene to better understand its morphology, structure, and material quality. It is a journey of uncovering massive technological potential within the smallest imaginable spaces.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "2DNanomaterials";
    }

    if (normalizedWord.includes("heat transfer")) {
      setPopupContent({
        title: "🔥 Heat Transfer",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>We all experience heat transfer every day, like the way a hot cup of coffee warms your hands or how a fan keeps your laptop from crashing.</strong>
              </p>
              <p className={styles.text}>
                The control of thermal energy is what keeps our modern world running safely. My fascination with this actually started on the ground level during an apprenticeship, gaining hands-on exposure to HVAC systems, thermal systems, and ventilation.
              </p>
              <p className={styles.text}>
                Since then, my focus has shifted to the microscopic scale, working on nano-enhanced heat transfer and nanofluids. Through my academic journey, I have published findings on lattice thermal conductivity and the interfacial thermal conductance between nanoparticles and water.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Journey 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>It is a compelling narrative of starting with massive commercial cooling systems and scaling all the way down to understanding how heat moves at the nanoscale.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "HeatTransfer";
    }

    if (normalizedWord.includes("materials processing")) {
      setPopupContent({
        title: "⚙️ Materials Processing",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Materials processing is the difference between knitting a single sweater by hand and building a factory to make thousands of them perfectly.</strong>
              </p>
              <p className={styles.text}>
                A brilliant material is only useful if we can actually make it in large quantities. My background is deeply rooted in experimental process development. During my doctoral research, I meticulously investigated process scale-up variables including gas flow, pressure, temperature, and carrier gas selection to achieve high-throughput nanomaterial production.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Reality 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>For me, the story of a material is never just about what it is, but how we can build it reliably and efficiently for the real world to transition promising lab results into real technologies.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "MaterialsProcessing";
    }

    if (normalizedWord.includes("compressible flow exfoliation")) {
      setPopupContent({
        title: "🚀 Compressible Flow Exfoliation (CFE)",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Think of Compressible Flow Exfoliation as using a powerful, highly controlled gust of wind to perfectly separate layers of autumn leaves.</strong>
              </p>
              <p className={styles.text}>
                Traditional methods of creating nanomaterials often hit roadblocks when it comes to efficiency. CFE is a gas-driven approach designed to produce 2D materials in a cleaner, faster, and more scalable way.
              </p>
              <p className={styles.text}>
                To make this a reality, I developed a high-pressure gas-driven exfoliation setup specifically for producing 2D nanomaterials through CFE.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Impact 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I have evaluated the commercialization pathways for CFE as a scalable industrial production method. It is a story of pushing the boundaries of manufacturing technology to prove that high-quality nanomaterials can be produced on an industrial scale.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "CompressibleFlowExfoliation";
    }

    if (normalizedWord.includes("commercialization")) {
      setPopupContent({
        title: "💼 Commercialization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Translating a brilliant scientific idea into a product you can actually buy is one of the hardest parts of innovation.</strong>
              </p>
              <p className={styles.text}>
                I am constantly asking how advanced materials can move from promising lab results to real technologies. Stepping beyond the lab, I became a Lab2Market Validate and Launch Fellow to explore the true commercial potential of advanced materials research.
              </p>
              <p className={styles.text}>
                I conducted over 50 customer discovery interviews to deeply understand industry needs, adoption barriers, and market opportunities.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Final Chapter 📖</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>By translating technical research into clearer industry-facing language, I am helping write the final chapter of the scientific process: getting innovations out of the laboratory and into the hands of the industries that need them most.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "Commercialization";
    }

    if (normalizedWord.includes("experimental characterization")) {
      setPopupContent({
        title: "🔬 Experimental Characterization",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>You cannot improve what you cannot precisely measure.</strong>
              </p>
              <p className={styles.text}>
                Experimental characterization is the process of peering into the atomic structure of a material to understand exactly why it behaves the way it does. My expertise spans a comprehensive suite of advanced techniques, including XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy.
              </p>
              <p className={styles.text}>
                By leveraging these tools, I am able to bridge the gap between process development and material performance, directly correlating manufacturing conditions with structural quality, chemical composition, and morphological defects.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Advanced Spectroscopy 💡</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I am an officially certified Main Operator for the state-of-the-art mIRage-Raman system (Photothermal Spectroscopy Corp) at York University, enabling me to conduct highly advanced sub-micron IR and Raman spectroscopy.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "ExperimentalCharacterization";
    }

    if (normalizedWord.includes("computational modeling")) {
      setPopupContent({
        title: "💻 Computational Modeling",
        content: (
          <div style={{ textAlign: "left" }}>
            <div className={`${styles.animateEnter} ${styles.delay1}`}>
              <p className={styles.text} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                <strong>Imagine playing out a highly accurate video game simulation of how materials will act in the real world before physically building anything.</strong>
              </p>
              <p className={styles.text}>
                That is computational modeling. It allows us to see the unseen. My background relies heavily on this, using CFD, molecular dynamics, and machine-learning interatomic potentials to connect processing with material quality, thermal transport, and mechanical behavior.
              </p>
            </div>

            <div className={`${styles.animateEnter} ${styles.delay3}`} style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Digital Lens 🔍</strong></p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I have applied multiscale modeling, COMSOL simulations, and Python-based analysis to improve nanomaterial production yield and process understanding. It is like having a digital lens that guides our physical experiments, saving time and unlocking entirely new possibilities in science.</p>
            </div>
          </div>
        )
      });
      setPopupOpen(true);
      window.location.hash = "ComputationalModeling";
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