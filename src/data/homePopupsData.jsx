import React from "react";


const AnimatedPopupIcon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    style={{ overflow: "visible", display: "inline-block", verticalAlign: "middle", marginRight: "10px", marginTop: "-4px" }}
  >
    <defs>
      <style>
        {`
          .popup-animated-icon {
            fill: transparent;
            stroke: #d49d81;
            stroke-width: 1.5px;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: drawPopupIcon 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          }
          @keyframes drawPopupIcon {
            0%, 10% {
              stroke-dashoffset: 200;
              fill: transparent;
              stroke: #d49d81;
            }
            50%, 70% {
              stroke-dashoffset: 0;
              fill: transparent;
              stroke: #d49d81;
            }
            100% {
              stroke-dashoffset: 0;
              fill: rgba(212, 157, 129, 0.3);
              stroke: #fff;
            }
          }
        `}
      </style>
    </defs>
    <path className="popup-animated-icon" d={d} />
  </svg>
);

export const popupsData = [
  {
    id: "materials-scientist",
    shortTitle: "Materials Scientist",
    keywordMatches: ["materials scientist"],
    hash: "MaterialsScientist",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M10 2v5l-6 11c-.5.9.1 2 1 2h14c.9 0 1.5-1.1 1-2l-6-11V2H10z" /> Materials Scientist</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Think of a chef figuring out how changing a recipe fundamentally alters the texture and flavor of a cake.</strong>
          </p>
          <p className="popup-text">
            That is what a materials scientist does, but at the atomic level, exploring how things are made and how they can be made better. I am a Materials Scientist and researcher working on 2D nanomaterials and scalable materials processing.
          </p>
          <p className="popup-text">
            My background combines materials characterization, computational modeling, and experimental process development. My daily focus revolves around understanding how structure, interfaces, and processing conditions directly affect a material\'s ultimate performance.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Goal 💡</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>The story of my work always leads back to a simple, driving goal: to develop better materials, understand them deeply, and help move them toward practical use.</p>
        </div>
      </div>
    )
  },
  {
    id: "2d-nanomaterials",
    shortTitle: "2D Nanomaterials",
    keywordMatches: ["2d nanomaterials"],
    hash: "2DNanomaterials",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /> 2D Nanomaterials</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Imagine taking a thick book and peeling it down to a few very specific pages to discover that those isolated pages behave completely differently than the whole book.</strong>
          </p>
          <p className="popup-text">
            That is the essence of 2D nanomaterials. In my work, these materials are not merely single atomic layers; they are technically classified as exfoliated nanoplatelets that are approximately 20 layers thick. My specific focus is on graphene, h-BN, and MoS₂.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Global Research 🌍</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>This passion took me to the University of Kassel in Germany as a Mitacs Globalink Research Award Fellow. There, I studied CFE-produced graphene to better understand its morphology, structure, and material quality. It is a journey of uncovering massive technological potential within the smallest imaginable spaces.</p>
        </div>
      </div>
    )
  },
  {
    id: "heat-transfer",
    shortTitle: "Heat Transfer",
    keywordMatches: ["heat transfer"],
    hash: "HeatTransfer",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /> Heat Transfer</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>We all experience heat transfer every day, like the way a hot cup of coffee warms your hands or how a fan keeps your laptop from crashing.</strong>
          </p>
          <p className="popup-text">
            The control of thermal energy is what keeps our modern world running safely. My fascination with this actually started on the ground level during an apprenticeship, gaining hands-on exposure to HVAC systems, thermal systems, and ventilation.
          </p>
          <p className="popup-text">
            Since then, my focus has shifted to the microscopic scale, working on nano-enhanced heat transfer and nanofluids. Through my academic journey, I have published findings on lattice thermal conductivity and the interfacial thermal conductance between nanoparticles and water.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Journey 💡</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>It is a compelling narrative of starting with massive commercial cooling systems and scaling all the way down to understanding how heat moves at the nanoscale.</p>
        </div>
      </div>
    )
  },
  {
    id: "materials-processing",
    shortTitle: "Materials Processing",
    keywordMatches: ["materials processing"],
    hash: "MaterialsProcessing",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-6c-1.1 0-2 .9-2 2v1.1c-.6.2-1.2.6-1.8 1l-.8-.8c-.8-.8-2-.8-2.8 0l-1.4 1.4c-.8.8-.8 2 0 2.8l.8.8c-.4.6-.8 1.2-1 1.8H2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.1c.2.6.6 1.2 1 1.8l-.8.8c-.8.8-.8 2 0-2.8l1.4 1.4c.8.8 2 .8 2.8 0l.8-.8c.6.4 1.2.8 1.8 1V20c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1.1c.6-.2 1.2-.6 1.8-1l.8.8c.8.8 2 .8 2.8 0l1.4-1.4c.8-.8.8-2 0-2.8l-.8-.8c.4-.6.8-1.2 1-1.8H20c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-1.1c-.2-.6-.6-1.2-1-1.8l.8-.8c.8-.8.8-2 0-2.8l-1.4-1.4c-.8-.8-2-.8-2.8 0l-.8.8c-.6-.4-1.2-.8-1.8-1V4c0-1.1-.9-2-2-2h-2z" /> Materials Processing</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Materials processing is the difference between knitting a single sweater by hand and building a factory to make thousands of them perfectly.</strong>
          </p>
          <p className="popup-text">
            A brilliant material is only useful if we can actually make it in large quantities. My background is deeply rooted in experimental process development. During my doctoral research, I meticulously investigated process scale-up variables including gas flow, pressure, temperature, and carrier gas selection to achieve high-throughput nanomaterial production.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Reality 💡</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>For me, the story of a material is never just about what it is, but how we can build it reliably and efficiently for the real world to transition promising lab results into real technologies.</p>
        </div>
      </div>
    )
  },
  {
    id: "compressible-flow-exfoliation",
    shortTitle: "Compressible Flow Exfoliation",
    keywordMatches: ["compressible flow exfoliation", "cfe"],
    hash: "CompressibleFlowExfoliation",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M14 2L9.5 6.5A5.5 5.5 0 0 0 8 13.5l1.5 1.5-4 4-2 2L5 19.5l4-4 1.5 1.5A5.5 5.5 0 0 0 17.5 14.5L22 10V2H14z" /> Compressible Flow Exfoliation (CFE)</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Think of Compressible Flow Exfoliation as using a powerful, highly controlled gust of wind to perfectly separate layers of autumn leaves.</strong>
          </p>
          <p className="popup-text">
            Traditional methods of creating nanomaterials often hit roadblocks when it comes to efficiency. CFE is a gas-driven approach designed to produce 2D materials in a cleaner, faster, and more scalable way.
          </p>
          <p className="popup-text">
            To make this a reality, I developed a high-pressure gas-driven exfoliation setup specifically for producing 2D nanomaterials through CFE.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Impact 💡</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I have evaluated the commercialization pathways for CFE as a scalable industrial production method. It is a story of pushing the boundaries of manufacturing technology to prove that high-quality nanomaterials can be produced on an industrial scale.</p>
        </div>
      </div>
    )
  },
  {
    id: "commercialization",
    shortTitle: "Commercialization",
    keywordMatches: ["commercialization"],
    hash: "Commercialization",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z" /> Commercialization</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Translating a brilliant scientific idea into a product you can actually buy is one of the hardest parts of innovation.</strong>
          </p>
          <p className="popup-text">
            I am constantly asking how advanced materials can move from promising lab results to real technologies. Stepping beyond the lab, I became a Lab2Market Validate and Launch Fellow to explore the true commercial potential of advanced materials research.
          </p>
          <p className="popup-text">
            I conducted over 50 customer discovery interviews to deeply understand industry needs, adoption barriers, and market opportunities.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>The Final Chapter 📖</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>By translating technical research into clearer industry-facing language, I am helping write the final chapter of the scientific process: getting innovations out of the laboratory and into the hands of the industries that need them most.</p>
        </div>
      </div>
    )
  },
  {
    id: "experimental-characterization",
    shortTitle: "Experimental Characterization",
    keywordMatches: ["experimental characterization"],
    hash: "ExperimentalCharacterization",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-1.1 1.1l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z" /> Experimental Characterization</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>You cannot improve what you cannot precisely measure.</strong>
          </p>
          <p className="popup-text">
            Experimental characterization is the process of peering into the atomic structure of a material to understand exactly why it behaves the way it does. My expertise spans a comprehensive suite of advanced techniques, including XPS, TEM/STEM, SEM, AFM, and UV-Vis spectroscopy.
          </p>
          <p className="popup-text">
            By leveraging these tools, I am able to bridge the gap between process development and material performance, directly correlating manufacturing conditions with structural quality, chemical composition, and morphological defects.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Advanced Spectroscopy 💡</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I am an officially certified Main Operator for the state-of-the-art mIRage-Raman system (Photothermal Spectroscopy Corp) at York University, enabling me to conduct highly advanced sub-micron IR and Raman spectroscopy.</p>
        </div>
      </div>
    )
  },
  {
    id: "computational-modeling",
    shortTitle: "Computational Modeling",
    keywordMatches: ["computational modeling"],
    hash: "ComputationalModeling",
    title: <span style={{ display: "flex", alignItems: "center" }}><AnimatedPopupIcon d="M20 16V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v10H2v2h20v-2h-2z" /> Computational Modeling</span>,
    content: (
      <div style={{ textAlign: "left" }}>
        <div className="popup-animate-enter">
          <p className="popup-text" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            <strong>Imagine playing out a highly accurate video game simulation of how materials will act in the real world before physically building anything.</strong>
          </p>
          <p className="popup-text">
            That is computational modeling. It allows us to see the unseen. My background relies heavily on this, using CFD, molecular dynamics, and machine-learning interatomic potentials to connect processing with material quality, thermal transport, and mechanical behavior.
          </p>
        </div>
        <div className="popup-animate-slide-in-right" style={{ marginTop: "1.5rem", padding: "1rem", borderLeft: "4px solid #d49d81", backgroundColor: "rgba(212, 157, 129, 0.1)", borderRadius: "0 8px 8px 0" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff" }}><strong>Digital Lens 🔍</strong></p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc", marginTop: "0.5rem" }}>I have applied multiscale modeling, COMSOL simulations, and Python-based analysis to improve nanomaterial production yield and process understanding. It is like having a digital lens that guides our physical experiments, saving time and unlocking entirely new possibilities in science.</p>
        </div>
      </div>
    )
  }
];

