import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styled from "@emotion/styled";

// --- Data ---
const timelineData = [
  {
    category: "Chapter 1",
    title: "The Physics of Interfaces (Nanofluids)",
    intro: "Between 2018 and 2022, my work focused on the \"Kapitza conductance\"—the thermal resistance between a solid nanoparticle and the liquid surrounding it. This phase was defined by discovering how atomic ordering and electrostatics drive heat transfer.",
    links: [
      {
        year: "2018",
        paperTitle: "Importance of nanolayer formation in nanofluid properties: Equilibrium molecular dynamic simulations for Ag-water nanofluid",
        finding: "Nanofluids cannot be modeled as simple two-component mixtures. The ordered liquid \"nanolayer\" around particles causes the base fluid to contract, significantly altering bulk density and viscosity."
      },
      {
        year: "2019",
        paperTitle: "Thermal transport at a nanoparticle-water interface: A molecular dynamics and continuum modeling study",
        finding: "Heat dissipation from a hot nanoparticle into water occurs in ultrafast timescales (<5 ps). A continuum solid-like model effectively captures this behavior, bridging the gap between atomic simulations and macroscopic heat transfer models."
      },
      {
        year: "2022",
        paperTitle: "Interfacial thermal conductance between TiO2 nanoparticle and water: A molecular dynamics study",
        finding: "Titanium Dioxide (TiO₂) nanoparticles exhibit ~10x higher interfacial thermal conductance than metal nanoparticles (Au, Ag, Pt). This is driven by strong electrostatic interactions between the charged Ti/O atoms and water, which pull the liquid molecules much closer than van der Waals forces can."
      }
    ],
    images: [1, 2, 3, 4],
    overview: {
      summary: "This chapter established the fundamental physics governing heat transfer at nanoscale interfaces. By revealing the critical role of atomic ordering and electrostatic forces, this work provided the foundation for engineering better nanofluids and understanding energy transport in complex systems.",
      impact: "These discoveries enable precise control of thermal properties in next-generation cooling systems and energy storage devices."
    }
  },
  {
    category: "Chapter 2",
    title: "Engineering Material Topology (2D Materials)",
    intro: "Having understood the interface, I turned my attention to the materials themselves. Between 2020 and 2021, my research explored how geometry affects performance: \"Can we tune a material's properties simply by changing its shape?\"",
    links: [
      {
        year: "2020",
        paperTitle: "Effect of planar torsional deformation on the thermal conductivity of 2D nanomaterials",
        finding: "Applying torsional stress (twisting) to 2D materials like Graphene and MoS₂ induces wrinkles that scatter phonons. This proves that thermal conductivity can be mechanically \"throttled\" or tuned by controlling the material's deformation."
      },
      {
        year: "2020",
        paperTitle: "Engineered porous borophene with tunable anisotropic properties",
        finding: "Borophene is naturally anisotropic, conducting heat differently along different axes. By introducing engineered pores (holes), we successfully transformed it into a \"quasi-isotropic\" material, making its thermal and mechanical behavior predictable in all directions—critical for flexible electronics."
      },
      {
        year: "2021",
        paperTitle: "Elucidation of thermo-mechanical properties of silicon nanowires",
        finding: "As silicon nanowires scale down (10-45 nm length), their thermal conductivity drops drastically compared to bulk silicon (~1-5 W/m⋅K). Furthermore, their mechanical strength degrades significantly at higher temperatures, establishing clear design limits for silicon-based NEMS."
      }
    ],
    images: [1, 2, 3, 4],
    overview: {
      summary: "This chapter demonstrated that material properties are not fixed—they can be dynamically tuned through geometric engineering. By controlling shape, stress, and topology, we unlocked new pathways for creating adaptive materials with on-demand performance.",
      impact: "This work enables the design of flexible electronics and responsive nanoscale devices that adapt to their environment."
    }
  },
  {
    category: "Chapter 3",
    title: "The AI Era (Machine Learning)",
    intro: "As material complexity increased, classical simulation became a bottleneck. Since 2021, my work has integrated Artificial Intelligence into materials science to accurately predict properties before synthesis.",
    links: [
      {
        year: "2021",
        paperTitle: "Recent advances in lattice thermal conductivity calculation using machine-learning interatomic potentials",
        finding: "This perspective paper established that Machine Learning Interatomic Potentials (MLIPs) are the future of thermal transport simulations, offering a pathway to achieve near-quantum accuracy (DFT level) at a fraction of the computational cost."
      },
      {
        year: "2021",
        paperTitle: "Thermo-mechanical properties of nitrogenated holey graphene (C₂N): A comparison of machine-learning-based and classical interatomic potentials",
        finding: "Validated that passively fitted ML potentials can accurately predict the thermal and mechanical properties of complex, porous structures like C₂N, outperforming traditional empirical potentials (like Tersoff) in accuracy."
      },
      {
        year: "2023",
        paperTitle: "Lattice thermal conductivity and Young's modulus of XN₄ (X = Be, Mg and Pt) 2D materials using machine learning interatomic potentials",
        finding: "Characterized the novel nitrogen-rich XN₄ family for the first time using ML. We predicted these materials are mechanically stiff and thermally conductive, particularly in the \"armchair\" direction, identifying them as promising candidates for high-performance nanodevices."
      }
    ],
    images: [1, 2, 3, 4],
    overview: {
      summary: "This chapter marked the transition from traditional simulation to AI-driven discovery. By leveraging machine learning, we can now predict material properties with quantum-level accuracy in a fraction of the time, accelerating the pace of materials innovation.",
      impact: "Machine learning is revolutionizing materials science, enabling rapid screening of millions of candidate materials for next-generation technologies."
    }
  },
  {
    category: "Chapter 4",
    title: "Scalable Nanomanufacturing",
    intro: "My most recent focus addresses the critical challenge of bringing 2D materials from the lab to the factory, investigating the fluid dynamics of mass production.",
    links: [
      {
        year: "2022",
        paperTitle: "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
        finding: "In the Compressible Flow Exfoliation (CFE) process, \"sliding\" graphene layers apart is energetically more efficient than pulling them vertically. Lighter gases (like Helium) facilitate this sliding mechanism more effectively than heavier gases (like Argon), providing a direct recipe for optimizing industrial production."
      }
    ],
    images: [1, 2, 3, 4],
    overview: {
      summary: "This chapter bridges the gap between laboratory discovery and industrial reality. By understanding the fluid dynamics of nanomanufacturing, we're paving the way for mass production of 2D materials, bringing these revolutionary materials from research labs to real-world applications.",
      impact: "This work is critical for commercializing 2D materials and making advanced nanotechnology accessible at scale."
    }
  },
];

// --- Styled Components ---

const PageContainer = styled.div`
  background-color: transparent;
  height: 100vh; 
  width: 100vw;
  color: #fff;
  font-family: "Inter", sans-serif;
  overflow-y: auto; 
  overflow-x: hidden;
  position: relative;
  scroll-behavior: smooth;
  
  /* Custom scrollbar for premium feel */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ParallaxHeader = styled(motion.div)`
  height: 100vh; 
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  text-align: center;
  background: transparent;
  padding: 0 20px;
  position: relative;
  z-index: 10;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem; 
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 1200px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.div)`
  font-size: 1.2rem;
  color: #a0a0a0;
  max-width: 900px; 
  line-height: 2; 
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem; 
`;

const Word = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

const HighlightWrapper = styled(motion.span)`
  position: relative;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
  padding: 2px 8px;
`;

const HighlightBg = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(to right, rgb(255 255 255 / 14%) 0%, rgb(245 159 115 / 18%) 100%);
  border-radius: 20px;
  z-index: 0;
`;

const HighlightText = styled.span`
  position: relative;
  z-index: 1;
  color: #fff;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: #007bff; 
  transform-origin: 0%;
  z-index: 1000;
`;

const TimelineContainer = styled(motion.div)`
  position: relative;
  max-width: 1200px;
  width: 100%;
  margin: -100px auto 0; 
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  z-index: 5;
`;

const ActiveLine = styled(motion.div)`
  position: absolute;
  left: 50%;
  width: 3px;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.6) 0%, 
    rgba(255, 100, 0, 0.4) 50%,
    rgba(255, 255, 255, 0.6) 100%);
  transform: translateX(-50%);
  z-index: 1;
  transform-origin: top;
  box-shadow: 0 0 10px rgba(255, 100, 0, 0.3);

  ${props => props.isTop && `
    top: 0;
    height: 0%; 
    max-height: calc(${props.isFirst ? "60px" : "190px"} - 25px); 
  `}
  
  ${props => props.isBottom && `
    top: calc(${props.isFirst ? "60px" : "190px"} + 25px); 
    height: 0%; 
    max-height: calc(100% - (${props.isFirst ? "60px" : "190px"} + 25px));
  `}

  @media (max-width: 768px) {
    left: 20px;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isEven ? "flex-end" : "flex-start")};
  padding-top: ${(props) => (props.isFirst ? "20px" : "150px")};
  padding-bottom: 250px; 
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 50px;
  }
`;

const SpineContainer = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none; 
`;

const Dot = styled(motion.div)`
  position: absolute;
  left: calc(50% - 16px);
  top: calc(${(props) => (props.isFirst ? "60px" : "190px")} - 16px);
  width: 24px;
  height: 24px;
  background: radial-gradient(circle, rgba(255, 100, 0, 0.8) 0%, rgba(255, 100, 0, 0.2) 70%);
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  z-index: 10;
  box-shadow: 
    0 0 20px rgba(255, 100, 0, 0.6),
    0 0 40px rgba(255, 100, 0, 0.3),
    inset 0 0 10px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    left: 14px;
  }
`;

const ContentCard = styled(motion.div)`
  width: 45%;
  padding: 20px 30px;
  text-align: left; /* Always left aligned as requested */
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    padding: 10px 0 10px 40px;
  }
`;

// ===  NEW CHAPTER-BASED SCROLL STORY COMPONENTS ===

const ChapterSection = styled(motion.div)`
  min-height: 400vh;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ChapterIntro = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 10%;
  position: sticky;
  top: 0;
  z-index: 5;
  
  @media (max-width: 768px) {
    padding: 0 5%;
  }
`;

const LargeChapterTitle = styled(motion.h1)`
  font-size: 6rem;
  font-weight: 900;
  margin: 0;
  margin-bottom: 20px;
  text-transform: uppercase;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.4;
  font-family: "DM Serif Display", serif;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const LargeChapterSubtitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 300;
  color: #fff;
  margin: 0 0 40px 0;
  max-width: 800px;
  font-family: "Poppins", sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const IntroDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: #ddd;
  line-height: 1.8;
  max-width: 700px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChapterHeader = styled(motion.div)`
  position: sticky;
  top: 20px;
  z-index: 20;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 10px 20px;
  }
`;

const SmallChapterTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  font-family: "Poppins", sans-serif;
  
  span {
    color: #ff5500;
    margin-right: 10px;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChapterPapersContainer = styled.div`
  min-height: 200vh;
  position: relative;
  width: 100%;
  padding: 100px 0;
`;

const ChapterOverview = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 10%;
  position: relative;
  z-index: 5;
  
  @media (max-width: 768px) {
    padding: 0 5%;
  }
`;

const OverviewTitle = styled(motion.h3)`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 30px 0;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "DM Serif Display", serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const OverviewContent = styled(motion.div)`
  max-width: 800px;
  
  p {
    font-size: 1.3rem;
    color: #ddd;
    line-height: 1.8;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  .impact {
    font-size: 1.1rem;
    color: #ff5500;
    font-style: italic;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

/* APPLIED USER STYLES BELOW */


const CategoryHeader = styled.h2`
  /* .css-1jshfss */
  font-size: 4.2rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
  margin-bottom: -10px;
  text-transform: uppercase;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.3;
  font-family: "DM Serif Display", serif;
`;

const ItemTitle = styled.h3`
  /* .css-ofb8ea */
  margin: 0 0 20px 0;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 28px;
  text-align: left;
  font-weight: 100;
`;

const Description = styled.div`
  /* .css-h0dcd1 */
  color: #ddd;
  line-height: 1.6;
  white-space: pre-wrap;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  text-align: left;
  font-weight: 400;
`;

const PaperContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Increased gap */
`;

const PaperItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-color: rgba(255, 100, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const PaperHeader = styled.div`
  /* .css-1x7rpue */
  margin-bottom: 5px;
  line-height: 1.4;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  text-align: left;
  font-weight: 400;
  color: #fff;
  display: flex;
  flex-direction: column; /* Stacked layout */
  align-items: unset;
`;

const PaperYear = styled.span`
  /* .css-1hbxnkp */
  font-family: "DM Serif Display", serif;
  font-weight: 900;
  color: #ff5500;
  font-size: 2.4rem;
  margin-right: 10px;
  flex-shrink: 0;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: -28px;
  opacity: 0.5;
  margin-bottom: -15px;
`;

const PaperBody = styled.div`
  display: flex;
  flex-direction: row;
`;

const VerticalLineContainer = styled.div`
  width: 20px; 
  display: flex;
  justify-content: center; 
  flex-shrink: 0;
`;

const VerticalLine = styled.div`
  width: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-top: 5px; 
`;

const FindingText = styled.div`
  /* .css-1ijrtpw */
  color: #ccc;
  line-height: 1.3;
  padding-left: 10px;
  white-space: pre-wrap;
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  text-align: left;
  font-weight: 100;
  margin-top: 5px;
`;

const Square = styled(motion.div)`
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
  transition: all 0.3s ease;
`;

const InfographicCard = styled(motion.div)`
  position: absolute;
  top: 15%;
  ${(props) => (props.isEven ? "left: 5%;" : "right: 5%;")}
  width: 40%; 
  aspect-ratio: 16 / 9; 
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.25);
  z-index: 2; 
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;

  @media (max-width: 768px) {
    display: none; 
  }
`;

const InfoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
`;

const FloatingBlob = styled(motion.div)`
  position: fixed;
  border-radius: 50%;
  background: ${props => props.color || 'radial-gradient(circle, rgba(255, 100, 0, 0.15) 0%, rgba(255, 100, 0, 0) 70%)'};
  filter: blur(80px);
  opacity: ${props => props.opacity || 0.3};
  pointer-events: none;
  z-index: 0;
`;

const BackgroundLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
`;

// --- Animation Variants ---
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

// Animated Wrappers
const InnerContent = styled(motion.div)`
  width: 100%;
`;
const AnimatedCategoryHeader = motion(CategoryHeader);
const AnimatedItemTitle = motion(ItemTitle);
const AnimatedDescription = motion(Description);
const AnimatedPaperItem = motion(PaperItem);

// --- Components ---

function TimelineNode({ data, index, isFirst, isLast, containerRef }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  // DIFFERENTIAL PARALLAX ANIMATIONS:
  const textY = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const infoY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const layer1Y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const spineY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.9, 1, 1, 0.9]);

  const topHeightFixed = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "100%"]);
  const bottomHeightFixed = useTransform(scrollYProgress, [0.5, 0.7], ["0%", "100%"]);

  return (
    <TimelineItem isEven={isEven} isFirst={isFirst} ref={ref}>

      {/* 1. LAYER 1 (Bottom Bun): Deepest Squares */}
      <Square
        style={{
          y: layer1Y,
          width: '280px', height: '280px',
          top: '-10%',
          [isEven ? 'left' : 'right']: '2%',
          opacity: 0.5,
          zIndex: 0
        }}
      />
      <Square
        style={{
          y: layer1Y,
          width: '200px', height: '200px',
          bottom: '0%',
          [isEven ? 'left' : 'right']: '15%',
          opacity: 0.6,
          zIndex: 0
        }}
      />

      {/* 2. LAYER 2 (Meat): Main Infographic */}
      <InfographicCard
        isEven={isEven}
        style={{ opacity, scale, y: infoY }}
      >
        <InfoImage src="/images/research_graphs/infographic_main.png" alt="Key Finding" />
      </InfographicCard>

      {/* 3. LAYER 3 (Top Bun): Fore-Squares */}
      <Square
        style={{
          y: layer3Y,
          width: '150px', height: '150px',
          top: '40%',
          [isEven ? 'left' : 'right']: '35%',
          opacity: 0.7,
          zIndex: 3
        }}
      />
      <Square
        style={{
          y: layer3Y,
          width: '120px', height: '120px',
          bottom: '20%',
          [isEven ? 'left' : 'right']: '0%',
          opacity: 0.8,
          zIndex: 3
        }}
      />

      {/* SPINE */}
      <SpineContainer style={{ y: spineY, zIndex: 5 }}>
        {!isFirst && <ActiveLine isTop isFirst={isFirst} style={{ height: topHeightFixed }} />}
        {!isLast && <ActiveLine isBottom isFirst={isFirst} style={{ height: bottomHeightFixed }} />}
        <Dot
          isFirst={isFirst}
          style={{
            scale: useSpring(scale, { stiffness: 300, damping: 20 }),
            opacity
          }}
        />
      </SpineContainer>

      {/* 4. LAYER 4 (Garnish): Text */}
      <ContentCard
        isEven={isEven}
        style={{ opacity, scale, y: textY, zIndex: 10 }}
      >
        <InnerContent
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contentVariants}
        >
          <AnimatedCategoryHeader variants={itemVariants}>
            {data.category}
          </AnimatedCategoryHeader>

          <AnimatedItemTitle variants={itemVariants}>
            {data.title}
          </AnimatedItemTitle>

          {/* Render Intro text if present */}
          {data.intro && (
            <AnimatedDescription variants={itemVariants} style={{ marginBottom: '20px' }}>
              {data.intro}
            </AnimatedDescription>
          )}

          {/* Structured Papers List */}
          {data.links ? (
            <PaperContainer>
              {data.links.map((link, i) => (
                <AnimatedPaperItem key={i} variants={itemVariants}>
                  <PaperHeader>
                    <PaperYear>{link.year}</PaperYear>
                    {link.paperTitle}
                  </PaperHeader>
                  <PaperBody>
                    <VerticalLineContainer>
                      <VerticalLine />
                    </VerticalLineContainer>
                    <FindingText>{link.finding}</FindingText>
                  </PaperBody>
                </AnimatedPaperItem>
              ))}
            </PaperContainer>
          ) : (
            /* Fallback for regular text descriptions */
            <AnimatedDescription variants={itemVariants}>
              {data.description}
            </AnimatedDescription>
          )}
        </InnerContent>
      </ContentCard>

    </TimelineItem>
  );
}

// NEW CHAPTER-BASED SCROLL STORY COMPONENT
function ChapterNode({ data, index, containerRef }) {
  const chapterRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  // Stage 1: Intro (0-0.25) - Large centered title
  const introOpacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  // Stage 2: Header (0.2-0.85) - Sticky small header
  const headerY = useTransform(scrollYProgress, [0.15, 0.25], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.8, 0.85], [0, 1, 1, 0]);

  // Stage 4: Overview (0.75-0.9)
  const overviewOpacity = useTransform(scrollYProgress, [0.7, 0.8, 0.85, 0.95], [0, 1, 1, 0]);
  const overviewY = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

  // Stage 5: Fade out entire chapter (0.9-1.0)
  const chapterOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <ChapterSection ref={chapterRef} style={{ opacity: chapterOpacity }}>

      {/* Stage 1: Centered Large Intro */}
      <ChapterIntro
        style={{
          opacity: introOpacity,
          scale: introScale
        }}
      >
        <LargeChapterTitle
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 0.4, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {data.category}
        </LargeChapterTitle>

        <LargeChapterSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {data.title}
        </LargeChapterSubtitle>

        <IntroDescription
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {data.intro}
        </IntroDescription>
      </ChapterIntro>

      {/* Stage 2: Sticky Header */}
      <ChapterHeader
        style={{
          y: headerY,
          opacity: headerOpacity
        }}
      >
        <SmallChapterTitle>
          <span>{data.category}</span>
          {data.title}
        </SmallChapterTitle>
      </ChapterHeader>

      {/* Stage 3: Papers Container - Alternating Left/Right */}
      <ChapterPapersContainer>
        <TimelineContainer style={{ margin: 0, padding: "40px 20px" }}>
          {data.links && data.links.map((paper, i) => {
            const isLeft = i % 2 === 0;
            const startProgress = 0.25 + (i / data.links.length) * 0.45;
            const endProgress = startProgress + 0.08;

            const paperOpacity = useTransform(
              scrollYProgress,
              [startProgress, endProgress],
              [0, 1]
            );

            const paperX = useTransform(
              scrollYProgress,
              [startProgress, endProgress],
              [isLeft ? -100 : 100, 0]
            );

            const paperY = useTransform(
              scrollYProgress,
              [startProgress, endProgress],
              [50, 0]
            );

            return (
              <TimelineItem
                key={i}
                isEven={isLeft}
                style={{
                  paddingTop: i === 0 ? "20px" : "100px",
                  paddingBottom: "100px"
                }}
              >
                {/* Timeline Dot */}
                <SpineContainer style={{ zIndex: 5 }}>
                  <Dot
                    isFirst={i === 0}
                    style={{
                      scale: useSpring(useTransform(paperOpacity, [0, 1], [0.8, 1]), { stiffness: 300, damping: 20 }),
                      opacity: paperOpacity
                    }}
                  />
                  {i < data.links.length - 1 && (
                    <ActiveLine
                      isBottom
                      isFirst={i === 0}
                      style={{
                        height: useTransform(paperOpacity, [0, 1], ["0%", "100%"])
                      }}
                    />
                  )}
                </SpineContainer>

                {/* Paper Card */}
                <ContentCard
                  isEven={isLeft}
                  style={{
                    opacity: paperOpacity,
                    x: paperX,
                    y: paperY,
                    zIndex: 10
                  }}
                >
                  <AnimatedPaperItem>
                    <PaperHeader>
                      <PaperYear>{paper.year}</PaperYear>
                      {paper.paperTitle}
                    </PaperHeader>
                    <PaperBody>
                      <VerticalLineContainer>
                        <VerticalLine />
                      </VerticalLineContainer>
                      <FindingText>{paper.finding}</FindingText>
                    </PaperBody>
                  </AnimatedPaperItem>
                </ContentCard>
              </TimelineItem>
            );
          })}
        </TimelineContainer>
      </ChapterPapersContainer>

      {/* Stage 4: Chapter Overview */}
      {data.overview && (
        <ChapterOverview
          style={{
            opacity: overviewOpacity,
            y: overviewY
          }}
        >
          <OverviewTitle>
            {data.category} Complete
          </OverviewTitle>
          <OverviewContent>
            <p>{data.overview.summary}</p>
            <p className="impact">{data.overview.impact}</p>
          </OverviewContent>
        </ChapterOverview>
      )}

    </ChapterSection>
  );
}


function ResearchProgress() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ container: containerRef });
  const { scrollYProgress } = useScroll({ container: containerRef });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  const headerY = useTransform(scrollY, [0, 400], [0, -200]);
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const timelineOpacity = useTransform(scrollY, [0, 200], [0, 1]);

  const titleY = useTransform(scrollY, [0, 500], [0, -200]);
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, -200]);
  const subtitleOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.5 } }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 12, stiffness: 100 } }
  };

  const bgVariants = {
    hidden: { width: "0%", opacity: 0 },
    visible: { width: "100%", opacity: 1, transition: { delay: 0.4, duration: 0.4, ease: "easeOut" } }
  };

  const sentence = [
    { text: "My", type: "text" }, { text: "research", type: "text" }, { text: "journey", type: "text" },
    { text: "has", type: "text" }, { text: "evolved", type: "text" }, { text: "from", type: "text" },
    { text: "understanding", type: "text" }, { text: "fundamental", type: "text" },
    { text: "fluid interfaces", type: "highlight" },
    { text: "to", type: "text" },
    { text: "engineering", type: "text" },
    { text: "2D materials", type: "highlight" },
    { text: ",", type: "text" },
    { text: "and", type: "text" }, { text: "finally", type: "text" }, { text: "to", type: "text" },
    { text: "predicting", type: "text" }, { text: "properties", type: "text" }, { text: "with", type: "text" },
    { text: "AI", type: "highlight" },
    { text: "and", type: "text" },
    { text: "optimizing", type: "text" },
    { text: "mass production", type: "highlight" },
    { text: ".", type: "text" }, { text: "This", type: "text" }, { text: "timeline", type: "text" },
    { text: "highlights", type: "text" }, { text: "the", type: "text" }, { text: "progression", type: "text" },
    { text: "from", type: "text" }, { text: "theoretical", type: "text" }, { text: "observation", type: "text" },
    { text: "to", type: "text" }, { text: "practical", type: "text" }, { text: "application", type: "text" },
    { text: ".", type: "text" }
  ];

  return (
    <PageContainer ref={containerRef}>
      {/* Floating Background Blobs for Depth */}
      <BackgroundLayer>
        <FloatingBlob
          style={{
            width: '600px',
            height: '600px',
            top: '10%',
            left: '5%',
            y: useTransform(scrollY, [0, 2000], [0, -300]),
          }}
          color="radial-gradient(circle, rgba(255, 100, 0, 0.12) 0%, rgba(255, 100, 0, 0) 70%)"
          opacity={0.4}
        />
        <FloatingBlob
          style={{
            width: '500px',
            height: '500px',
            top: '40%',
            right: '10%',
            y: useTransform(scrollY, [0, 2000], [0, -200]),
          }}
          color="radial-gradient(circle, rgba(100, 150, 255, 0.1) 0%, rgba(100, 150, 255, 0) 70%)"
          opacity={0.3}
        />
        <FloatingBlob
          style={{
            width: '400px',
            height: '400px',
            bottom: '20%',
            left: '50%',
            y: useTransform(scrollY, [0, 2000], [0, -150]),
          }}
          color="radial-gradient(circle, rgba(255, 200, 100, 0.08) 0%, rgba(255, 200, 100, 0) 70%)"
          opacity={0.35}
        />
      </BackgroundLayer>

      <ProgressBar style={{ scaleX }} />

      <ParallaxHeader style={{ y: headerY, opacity: headerOpacity }}>
        <Title
          style={{ y: titleY, opacity: titleOpacity }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Simulation, Engineering, and Manufacturing at the Nanoscale
        </Title>
        <Subtitle
          style={{ y: subtitleY, opacity: subtitleOpacity }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sentence.map((word, index) => {
            if (word.type === "highlight") {
              return (
                <HighlightWrapper key={index} variants={wordVariants}>
                  <HighlightBg variants={bgVariants} />
                  <HighlightText>{word.text}</HighlightText>
                </HighlightWrapper>
              );
            }
            return (
              <Word key={index} variants={wordVariants}>
                {word.text}
              </Word>
            );
          })}
        </Subtitle>
      </ParallaxHeader>

      <TimelineContainer style={{ opacity: timelineOpacity }}>
        {timelineData.map((item, index) => (
          <ChapterNode
            key={index}
            data={item}
            index={index}
            containerRef={containerRef}
          />
        ))}
      </TimelineContainer>
    </PageContainer>
  );
}

export default ResearchProgress;
