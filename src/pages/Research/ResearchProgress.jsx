import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styled from "@emotion/styled";

// --- Data ---
const timelineData = [
  {
    year: "2013",
    title: "Initial Curiosity",
    description:
      "Started exploring the world of physics and material science. First encounters with basic research principals.",
  },
  {
    year: "2015",
    title: "Undergraduate Research",
    description:
      "Joined the university lab. Worked on synthesizing basic nanomaterials and understanding their properties.",
  },
  {
    year: "2017",
    title: "First Publication",
    description:
      "Published my first paper on the synthesis of graphene oxide. A major milestone in my academic career.",
  },
  {
    year: "2019",
    title: "Master's Degree",
    description:
      "Completed Master's thesis focusing on 2D material applications in energy storage.",
  },
  {
    year: "2021",
    title: "PhD Journey Begins",
    description:
      "Started PhD research. Diving deep into quantum mechanical effects in low-dimensional systems.",
  },
  {
    year: "2023",
    title: "Breakthrough Discovery",
    description:
      "Observed a novel phenomenon in twisted bilayer graphene. Presented findings at an international conference.",
  },
  {
    year: "Now",
    title: "Current Focus",
    description:
      "Continuing to push the boundaries of what is known. Exploring next-generation electronics and quantum computing applications.",
  },
];

// --- Styled Components ---

const PageContainer = styled.div`
  background-color: transparent;
  height: 100vh; /* Fixed height for scroll container */
  width: 100vw;
  color: #fff;
  font-family: "Inter", sans-serif;
  overflow-y: auto; /* Scrollable vertically */
  overflow-x: hidden;
  position: relative; /* Context for children */
`;

const Header = styled.div`
  padding: 120px 20px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: transparent;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #a0a0a0;
  max-width: 600px;
  line-height: 1.6;
  padding: 0 20px;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: #007bff; // Or a gradient
  transform-origin: 0%;
  z-index: 1000;
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
`;

const ActiveLine = styled(motion.div)`
  position: absolute;
  left: 50%;
  width: 2px;
  background: rgba(255, 255, 255, 0.5); /* Reduced opacity */
  transform: translateX(-50%);
  z-index: 1;
  transform-origin: top; 

  /* Logic for gaps: Increased to 25px as requested */
  ${props => props.isTop && `
    top: 0;
    height: 0%; 
    max-height: calc(50% - 25px); 
  `}
  
  ${props => props.isBottom && `
    top: calc(50% + 25px); 
    height: 0%; 
    max-height: calc(50% - 25px);
  `}

  @media (max-width: 768px) {
    left: 20px;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isEven ? "flex-end" : "flex-start")};
  padding: 80px 0; 
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 50px;
  }
`;

const Dot = styled(motion.div)`
  position: absolute;
  /* User requested specific calc centering: 28px (20+8) / 2 = 14px */
  left: calc(50% - 14px);
  top: calc(50% - 14px);
  width: 20px;
  height: 20px;
  background-color: transparent; 
  border: 4px solid rgba(255, 255, 255, 0.5); /* Reduced opacity */
  border-radius: 50%;
  /* Removed transform: translate as we are using calc */
  z-index: 10;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

const ContentCard = styled(motion.div)`
  width: 40%;
  padding: 10px 30px;
  text-align: ${(props) => (props.isEven ? "left" : "right")};

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    padding: 10px 0 10px 40px;
  }
`;

const Year = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  margin: 0;
  line-height: 1;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #fff;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #ccc;
  line-height: 1.5;
`;

// --- Components ---

function TimelineNode({ data, index, isFirst, isLast, containerRef }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);

  // Scroll progress for this specific node
  // Updated Offset and layoutEffect to ensure proper ref reading
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start center", "end center"], // Trigger when item passes center
    layoutEffect: false
  });

  // Animations:
  // Opacity for the card fade-in
  const opacity = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  // Line filling animation:
  // Fixed range to 0->1 for full fill duration across the view
  const topHeightFixed = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const bottomHeightFixed = useTransform(scrollYProgress, [0.5, 1], ["0%", "100%"]);

  return (
    <TimelineItem isEven={isEven} ref={ref}>
      {/* Top Lines (Upper Segment) */}
      {!isFirst && (
        <ActiveLine isTop style={{ height: topHeightFixed }} />
      )}

      {/* Bottom Lines (Lower Segment) */}
      {!isLast && (
        <ActiveLine isBottom style={{ height: bottomHeightFixed }} />
      )}

      {/* Dot */}
      <Dot
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      />

      {/* Content */}
      <ContentCard
        isEven={isEven}
        style={{ opacity, scale, y }}
      >
        <Year>{data.year}</Year>
        <ItemTitle>{data.title}</ItemTitle>
        <Description>{data.description}</Description>
      </ContentCard>
    </TimelineItem>
  );
}

function ResearchProgress() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef }); // Use container scroll

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <PageContainer ref={containerRef}>
      <ProgressBar style={{ scaleX }} />

      <Header>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Research Journey
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A timeline of my exploration, discoveries, and academic milestones from 2013 to the present.
        </Subtitle>
      </Header>

      <TimelineContainer>
        {/* Global lines removed in favor of per-node segments */}
        {timelineData.map((item, index) => (
          <TimelineNode
            key={index}
            data={item}
            index={index}
            isFirst={index === 0}
            isLast={index === timelineData.length - 1}
            containerRef={containerRef}
          />
        ))}
      </TimelineContainer>
    </PageContainer>
  );
}

export default ResearchProgress;
