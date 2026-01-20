import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { useWheel, useDrag } from "@use-gesture/react";
import Header from "../../components/Header/Header";

// --- Data ---
const timelineData = [
  {
    category: "Chapter 1",
    title: "The Physics of Interfaces (Nanofluids)",
    intro: "Between 2018 and 2022, my work focused on the \"Kapitza conductance\"—the thermal resistance between a solid nanoparticle and the liquid surrounding it. This phase was defined by discovering how atomic ordering and electrostatics drive heat transfer.",
    links: [
      {
        year: "2018",
        paperTitle: "Importance of nanolayer formation in nanofluid properties",
        finding: "Nanofluids cannot be modeled as simple two-component mixtures. The ordered liquid \"nanolayer\" around particles causes the base fluid to contract, significantly altering bulk density and viscosity."
      },
      {
        year: "2019",
        paperTitle: "Thermal transport at a nanoparticle-water interface",
        finding: "Heat dissipation from a hot nanoparticle into water occurs in ultrafast timescales (<5 ps). A continuum solid-like model effectively captures this behavior."
      },
      {
        year: "2022",
        paperTitle: "Interfacial thermal conductance between TiO2 nanoparticle and water",
        finding: "Titanium Dioxide (TiO₂) nanoparticles exhibit ~10x higher interfacial thermal conductance than metal nanoparticles. This is driven by strong electrostatic interactions."
      }
    ],
  },
  {
    category: "Chapter 2",
    title: "Engineering Material Topology (2D Materials)",
    intro: "Having understood the interface, I turned my attention to the materials themselves. Between 2020 and 2021, my research explored how geometry affects performance.",
    links: [
      {
        year: "2020",
        paperTitle: "Effect of planar torsional deformation on thermal conductivity",
        finding: "Applying torsional stress (twisting) to 2D materials like Graphene induces wrinkles that scatter phonons. Thermal conductivity can be mechanically \"throttled\"."
      },
      {
        year: "2020",
        paperTitle: "Engineered porous borophene with tunable anisotropic properties",
        finding: "By introducing engineered pores (holes), we successfully transformed naturally anisotropic Borophene into a \"quasi-isotropic\" material."
      },
      {
        year: "2021",
        paperTitle: "Elucidation of thermo-mechanical properties of silicon nanowires",
        finding: "As silicon nanowires scale down (10-45 nm), thermal conductivity drops drastically. Mechanical strength degrades at higher temperatures."
      }
    ],
  },
  {
    category: "Chapter 3",
    title: "The AI Era (Machine Learning)",
    intro: "As material complexity increased, classical simulation became a bottleneck. Since 2021, my work has integrated Artificial Intelligence into materials science.",
    links: [
      {
        year: "2021",
        paperTitle: "Recent advances in lattice thermal conductivity using MLIPs",
        finding: "Established that Machine Learning Interatomic Potentials (MLIPs) offer a pathway to achieve near-quantum accuracy at a fraction of the computational cost."
      },
      {
        year: "2021",
        paperTitle: "Thermo-mechanical properties of nitrogenated holey graphene (C₂N)",
        finding: "Validated that passively fitted ML potentials can accurately predict properties of complex, porous structures like C₂N."
      },
      {
        year: "2023",
        paperTitle: "Lattice thermal conductivity of XN₄ using MLIPs",
        finding: "Characterized the novel nitrogen-rich XN₄ family for the first time using ML, identifying them as promising candidates for high-performance nanodevices."
      }
    ],
  },
  {
    category: "Chapter 4",
    title: "Scalable Nanomanufacturing",
    intro: "My most recent focus addresses the critical challenge of bringing 2D materials from the lab to the factory, investigating fluid dynamics.",
    links: [
      {
        year: "2022",
        paperTitle: "Interactions of Gas Particles with Graphene during CFE",
        finding: "In Compressible Flow Exfoliation (CFE), \"sliding\" graphene layers apart is more efficient. Lighter gases like Helium facilitate this better than heavier gases."
      }
    ],
  },
];

// --- Styled Components ---

const PageContainer = styled.div`
  background-color: transparent;
  height: 100vh;
  width: 100vw;
  color: #fff;
  font-family: "Inter", sans-serif;
  overflow: hidden; /* NO SCROLL BAR */
  position: relative;
  touch-action: none; /* Prevent default touch scrolling */
`;

const SlideContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
`;

// -- Header Styles --
const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 1200px;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.div)`
  font-size: 1.3rem;
  color: #a0a0a0;
  max-width: 900px;
  line-height: 1.8;
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
  padding: 0 6px;
`;

const HighlightBg = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, rgb(255 255 255 / 10%) 0%, rgb(212 157 129 / 20%) 100%);
  border-radius: 4px;
  z-index: 0;
`;

const HighlightText = styled.span`
  position: relative;
  z-index: 1;
  color: #fff;
  font-weight: 600;
`;

// -- Chapter Styles --
const ChapterLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  height: 100%; /* Occupy full height */
  gap: 60px;

  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: center;
    gap: 30px;
  }
`;

const TextColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
`;

const VisualColumn = styled.div`
  flex: 1;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 1024px) {
    display: none; /* Hide visual on smaller screens for focus */
  }
`;

const CategoryLabel = styled(motion.h4)`
  font-family: "DM Serif Display", serif;
  font-size: 5rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.05);
  position: absolute;
  top: -60px;
  left: -20px;
  z-index: 0;
  pointer-events: none;
`;

const ChapterTitle = styled(motion.h2)`
  font-family: "Poppins", sans-serif;
  font-size: 2.8rem;
  font-weight: 200;
  color: #fff;
  margin-bottom: 20px;
  z-index: 1;
  position: relative;
`;

const ChapterIntro = styled(motion.p)`
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
`;

const PapersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
`;

const PaperItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-left-color: #d49d81;
  }
`;

const PaperHeader = styled.div`
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 6px;
  display: flex;
  align-items: baseline;
`;

const PaperYear = styled.span`
  font-weight: 800;
  color: #d49d81;
  margin-right: 10px;
  flex-shrink: 0;
`;

const PaperFinding = styled.div`
  font-size: 0.9rem;
  color: #888;
  font-weight: 300;
  line-height: 1.4;
`;

// -- Visual Elements --
const GlassCard = styled(motion.div)`
  width: 90%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

const IndicatorContainer = styled.div`
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;

  @media (max-width: 768px) {
    right: 10px;
  }
`;

const IndicatorDot = styled.div`
  width: ${props => props.isActive ? "10px" : "6px"};
  height: ${props => props.isActive ? "10px" : "6px"};
  background-color: ${props => props.isActive ? "#d49d81" : "rgba(255,255,255,0.3)"};
  border-radius: 50%;
  transition: all 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.5);
    background-color: #fff;
  }
`;

// --- Variants ---

const slideVariants = {
  enter: (direction) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)",
    zIndex: 2 // Incoming is on top
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: 2,
    transition: {
      y: { type: "spring", stiffness: 100, damping: 20 }, // Smoother spring
      opacity: { duration: 0.8, ease: "circOut" },
      scale: { duration: 0.8, ease: "circOut" }
    }
  },
  exit: (direction) => ({
    // Parallax Effect: Exiting element moves LESS (50%) than incoming, creating depth
    y: direction < 0 ? "50%" : "-50%",
    opacity: 0,
    scale: 0.9, // Recedes into background
    filter: "blur(12px)",
    zIndex: 1, // Goes behind
    transition: {
      y: { type: "spring", stiffness: 100, damping: 20 },
      opacity: { duration: 0.6, ease: "easeIn" },
      scale: { duration: 0.6 }
    }
  })
};

const textStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

// --- Components ---



const GrapheneCanvas = () => {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    const frontCanvas = frontRef.current;
    const backCanvas = backRef.current;
    if (!frontCanvas || !backCanvas) return;

    const ctxFront = frontCanvas.getContext('2d');
    const ctxBack = backCanvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      frontCanvas.width = width;
      frontCanvas.height = height;
      backCanvas.width = width;
      backCanvas.height = height;
    };
    setSize();

    const mouse = { x: null, y: null, radius: 250 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const handleResize = () => {
      setSize();
    };
    window.addEventListener('resize', handleResize);

    // Flake Class
    class Flake {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        // Depth: 0 (far) to 1 (close)
        this.depth = Math.random();

        // Random drift velocity
        const speedMultiplier = this.depth * 0.5 + 0.2;
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;

        // Rotation
        this.angle = Math.random() * Math.PI * 2;
        this.vAngle = (Math.random() - 0.5) * 0.005;

        // Visual properties
        this.baseSize = 40;
        this.scale = this.depth * 1.3 + 0.2; // 0.2x to 1.5x scale (Much wider range)
        this.opacity = this.depth * 0.8 + 0.1; // 0.1 to 0.9 opacity (Much wider range)
      }

      update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.vAngle;

        // Wrap around screen
        const margin = 100 * this.scale;
        if (this.x < -margin) this.x = width + margin;
        if (this.x > width + margin) this.x = -margin;
        if (this.y < -margin) this.y = height + margin;
        if (this.y > height + 100) this.y = -margin;

        // Mouse Repulsion
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const depthFactor = this.depth * 2;
            this.x -= (dx / dist) * force * 2 * depthFactor;
            this.y -= (dy / dist) * force * 2 * depthFactor;
          }
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);

        const sides = 6;
        const radius = this.baseSize;
        const color = `rgba(212, 157, 129, ${this.opacity})`;

        // 1. Draw Bonds (Lines)
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const theta = i * 2 * Math.PI / sides;
          const px = radius * Math.cos(theta);
          const py = radius * Math.sin(theta);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // 2. Draw Atoms (Circles)
        for (let i = 0; i < sides; i++) {
          const theta = i * 2 * Math.PI / sides;
          const px = radius * Math.cos(theta);
          const py = radius * Math.sin(theta);

          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Atom Class (Single floating particles)
    class Atom extends Flake {
      constructor() {
        super();
        this.baseSize = 6; // Just the atom size
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        const color = `rgba(212, 157, 129, ${this.opacity * 0.3})`; // Reduced opacity to 30%

        ctx.beginPath();
        ctx.arc(0, 0, this.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
      }
    }

    const flakes = [];
    const flakeCount = 15;
    const atomCount = 20;

    for (let i = 0; i < flakeCount; i++) {
      flakes.push(new Flake());
    }
    for (let i = 0; i < atomCount; i++) {
      flakes.push(new Atom());
    }

    const animate = () => {
      ctxFront.clearRect(0, 0, width, height);
      ctxBack.clearRect(0, 0, width, height);

      // 1. Update & Sort
      flakes.forEach(f => f.update());
      flakes.sort((a, b) => a.depth - b.depth);

      // 2. Draw Connections (Atoms only)
      const atoms = flakes.filter(f => f instanceof Atom);
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i];
          const b = atoms[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = 200 * ((a.scale + b.scale) / 2); // Connect distance scales with size

          if (dist < threshold) {
            const avgDepth = (a.depth + b.depth) / 2;
            // Draw on the layer that matches their average depth
            const ctx = avgDepth < 0.5 ? ctxBack : ctxFront;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            // Opacity fades with distance
            const opacity = (1 - dist / threshold) * 0.4 * (a.opacity + b.opacity) / 2;
            ctx.strokeStyle = `rgba(212, 157, 129, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Particles
      flakes.forEach(flake => {
        if (flake.depth < 0.5) {
          flake.draw(ctxBack);
        } else {
          flake.draw(ctxFront);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Blurred Back Layer (Performance Optimized) */}
      <canvas
        ref={backRef}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none',
          filter: 'blur(6px)', // Reduced blur per feedback
          opacity: 0.8
        }}
      />
      {/* Sharp Front Layer */}
      <canvas
        ref={frontRef}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none',
          filter: 'blur(4px)' // Foreground blur
        }}
      />
    </>
  );
};

// --- Components ---

const IntroSlide = () => {
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
    { text: ".", type: "text" },
  ];

  return (
    <HeaderContent>
      <Title
        initial={{ opacity: 0, y: -50, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Simulation, Engineering, and Manufacturing at the Nanoscale
      </Title>

      <Subtitle
        initial="hidden"
        animate="visible"
        variants={textStagger}
      >
        {sentence.map((word, i) => (
          <React.Fragment key={i}>
            {word.type === "highlight" ? (
              <HighlightWrapper variants={fadeInUp}>
                <HighlightBg layoutId="highlight" />
                <HighlightText>{word.text}</HighlightText>
              </HighlightWrapper>
            ) : (
              <Word variants={fadeInUp}>{word.text}</Word>
            )}
          </React.Fragment>
        ))}
      </Subtitle>

      <motion.div
        style={{ marginTop: 50, color: "#fff", opacity: 0.5, fontSize: "0.9rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        Scroll / Swipe to Explore
      </motion.div>
    </HeaderContent>
  );
};

const ChapterSlide = ({ data }) => {
  return (
    <ChapterLayout>
      <TextColumn>
        <CategoryLabel
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {data.category}
        </CategoryLabel>

        <motion.div variants={textStagger} initial="hidden" animate="visible">
          <ChapterTitle variants={fadeInUp}>{data.title}</ChapterTitle>
          <ChapterIntro variants={fadeInUp}>{data.intro}</ChapterIntro>

          <PapersList>
            {data.links?.map((link, i) => (
              <PaperItem key={i} variants={fadeInUp}>
                <PaperHeader>
                  <PaperYear>{link.year}</PaperYear>
                  {link.paperTitle}
                </PaperHeader>
                <PaperFinding>{link.finding}</PaperFinding>
              </PaperItem>
            ))}
          </PapersList>
        </motion.div>
      </TextColumn>

      <VisualColumn>
        <GlassCard
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
        >
          <img
            src="/images/research_graphs/infographic_main.png"
            alt="Research Visualization"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "30px", opacity: 0.8 }}
          />
        </GlassCard>
      </VisualColumn>
    </ChapterLayout>
  );
};

// --- Main Page Component ---

export default function ResearchProgress() {
  const [activeSection, setActiveSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const isAnimating = useRef(false);
  const totalSections = timelineData.length + 1; // 1 Intro + Chapters

  // Debounced navigation handler
  const changeSection = useCallback((newDir) => {
    if (isAnimating.current) return;

    const nextSection = activeSection + newDir;

    if (nextSection >= 0 && nextSection < totalSections) {
      isAnimating.current = true;
      setDirection(newDir);
      setActiveSection(nextSection);

      // Unlock animation after delay matching the transition duration
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    }
  }, [activeSection, totalSections]);

  // Gestures
  useWheel(({ delta: [, dy] }) => {
    if (Math.abs(dy) > 30) {
      changeSection(dy > 0 ? 1 : -1);
    }
  }, { target: window, eventOptions: { passive: false } });

  useDrag(({ swipe: [, sy] }) => {
    if (sy !== 0) {
      changeSection(sy > 0 ? -1 : 1); // Swipe Down = Previous (dir -1), Swipe Up = Next (dir 1)
    }
  }, { target: window });

  return (
    <PageContainer>
      <Header />
      <AnimatePresence>
        {activeSection === 0 && (
          <motion.div
            key="particles"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1 }}
          >
            <GrapheneCanvas />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation Indicators */}
      <IndicatorContainer>
        {Array.from({ length: totalSections }).map((_, i) => (
          <IndicatorDot
            key={i}
            isActive={i === activeSection}
            onClick={() => {
              if (isAnimating.current || i === activeSection) return;
              const dir = i > activeSection ? 1 : -1;
              setDirection(dir);
              setActiveSection(i);
            }}
          />
        ))}
      </IndicatorContainer>

      <AnimatePresence initial={false} custom={direction}>
        <SlideContainer
          key={activeSection}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {activeSection === 0 ? (
            <IntroSlide />
          ) : (
            <ChapterSlide data={timelineData[activeSection - 1]} />
          )}
        </SlideContainer>
      </AnimatePresence>
    </PageContainer>
  );
}
