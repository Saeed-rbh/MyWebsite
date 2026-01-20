import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styled from "@emotion/styled";

// Import the existing data
import { timelineData } from "./timelineData";

// PageContainer with smooth scroll
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

// Chapter Section - 400vh for scroll story
const ChapterSection = styled(motion.div)`
  min-height: 400vh;
  position: relative;
  width: 100%;
  padding-top: 100vh;
`;

// Title Container - will shrink and stick
const TitleContainer = styled(motion.div)`
  position: sticky;
  top: 20px;
  z-index: 100;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 10%;
  pointer-events: none;
`;

const ChapterTitle = styled(motion.h1)`
  font-size: 6rem;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.4;
  font-family: "DM Serif Display", serif;
  line-height: 1;
  transform-origin: center top;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ChapterSubtitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 300;
  color: #fff;
  margin: 20px 0;
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

// Papers Container
const PapersContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 200px 20px;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${(props) => (props.isLeft ? "flex-start" : "flex-end")};
  padding: 100px 0;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 50px;
  }
`;

const PaperCard = styled(motion.div)`
  width: 45%;
  padding: 20px 30px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-color: rgba(255, 100, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PaperYear = styled.span`
  font-family: "DM Serif Display", serif;
  font-weight: 900;
  font-size: 2.4rem;
  background: linear-gradient(to right, #faf5f3a2 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.5;
  display: block;
  margin-bottom: 10px;
`;

const PaperTitle = styled.div`
  color: #fff;
  font-size: 15px;
  font-family: "Poppins", sans-serif;
  margin-bottom: 15px;
`;

const Finding = styled.div`
  color: #ccc;
  font-size: 15px;
  line-height: 1.6;
  font-family: "Poppins", sans-serif;
  font-weight: 100;
  padding-left: 15px;
  border-left: 2px solid rgba(255, 255, 255, 0.3);
`;

// Timeline Dot
const Dot = styled(motion.div)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background: radial-gradient(circle, rgba(255, 100, 0, 0.8) 0%, rgba(255, 100, 0, 0.2) 70%);
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%z;
  box-shadow: 
    0 0 20px rgba(255, 100, 0, 0.6),
    0 0 40px rgba(255, 100, 0, 0.3);
    
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

// Overview Section
const OverviewSection = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 10%;
  margin-top: 200px;
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

const OverviewText = styled.div`
  max-width: 800px;
  
  p {
    font-size: 1.3rem;
    color: #ddd;
    line-height: 1.8;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
  }
  
  .impact {
    font-size: 1.1rem;
    color: #ff5500;
    font-style: italic;
  }
`;

// Simplified ChapterNode Component
function ChapterNode({ data, index, containerRef }) {
    const chapterRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: chapterRef,
        container: containerRef,
        offset: ["start end", "end start"]
    });

    // Title shrinks and stays sticky
    const titleScale = useTransform(scrollYProgress, [0.05, 0.2], [1, 0.35]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 0.4]);

    // Description fades out as title shrinks  
    const descOpacity = useTransform(scrollYProgress, [0.05, 0.2], [1, 0]);

    // Overview appears and STAYS
    const overviewOpacity = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);
    const overviewY = useTransform(scrollYProgress, [0.65, 0.75], [50, 0]);

    // Entire chapter fades only at the very end
    const chapterOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

    return (
        <ChapterSection ref={chapterRef} style={{ opacity: chapterOpacity }}>

            {/* Single title that shrinks and stays sticky */}
            <TitleContainer>
                <ChapterTitle style={{ scale: titleScale, opacity: titleOpacity }}>
                    {data.category}
                </ChapterTitle>

                <ChapterSubtitle style={{ opacity: descOpacity }}>
                    {data.title}
                </ChapterSubtitle>

                <IntroDescription style={{ opacity: descOpacity }}>
                    {data.intro}
                </IntroDescription>
            </TitleContainer>

            {/* Papers that appear and STAY */}
            <PapersContainer>
                {data.links && data.links.map((paper, i) => {
                    const isLeft = i % 2 === 0;
                    const startProgress = 0.2 + (i / data.links.length) * 0.4;
                    const endProgress = startProgress + 0.1;

                    // Opacity goes 0 → 1 and STAYS at 1
                    const paperOpacity = useTransform(
                        scrollYProgress,
                        [startProgress, endProgress, 1],
                        [0, 1, 1]
                    );

                    const paperX = useTransform(
                        scrollYProgress,
                        [startProgress, endProgress],
                        [isLeft ? -100 : 100, 0]
                    );

                    return (
                        <TimelineItem key={i} isLeft={isLeft}>
                            <Dot style={{ opacity: paperOpacity }} />

                            <PaperCard
                                style={{
                                    opacity: paperOpacity,
                                    x: paperX
                                }}
                            >
                                <PaperYear>{paper.year}</PaperYear>
                                <PaperTitle>{paper.paperTitle}</PaperTitle>
                                <Finding>{paper.finding}</Finding>
                            </PaperCard>
                        </TimelineItem>
                    );
                })}
            </PapersContainer>

            {/* Overview that appears and STAYS */}
            {data.overview && (
                <OverviewSection
                    style={{
                        opacity: overviewOpacity,
                        y: overviewY
                    }}
                >
                    <OverviewTitle>{data.category} Complete</OverviewTitle>
                    <OverviewText>
                        <p>{data.overview.summary}</p>
                        <p className="impact">{data.overview.impact}</p>
                    </OverviewText>
                </OverviewSection>
            )}

        </ChapterSection>
    );
}

// Main Component
function ResearchProgress() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100, damping: 30, restDelta: 0.001
    });

    return (
        <PageContainer ref={containerRef}>
            <ProgressBar style={{ scaleX }} />

            {timelineData.map((item, index) => (
                <ChapterNode
                    key={index}
                    data={item}
                    index={index}
                    containerRef={containerRef}
                />
            ))}
        </PageContainer>
    );
}

export default ResearchProgress;
