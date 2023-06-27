import "./AcademicCV.css";
import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { RiDownloadCloudFill } from "react-icons/ri";
import { SiGooglescholar } from "react-icons/si";
import { HiArrowSmRight } from "react-icons/hi";
import { BsArrowDownShort } from "react-icons/bs";
import { BsCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

const AcademicCV = () => {
  const scrollableDivRef = useRef(null);
  useEffect(() => {
    scrollableDivRef.current.scrollTop = -1500;
  }, []);

  const [scrollOpacityT, setScrollOpacityT] = useState(0);
  const [scrollOpacityB, setScrollOpacityB] = useState(5);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollableDiv.scrollTop;
      const maxScroll = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      const opacityT = (scrollPosition / maxScroll) * 5;
      setScrollOpacityT(opacityT);
      const opacityB = (1 - scrollPosition / maxScroll) * 5;
      setScrollOpacityB(opacityB);
    };
    const scrollableDiv = document.getElementById("scrollableDiv");
    scrollableDiv.addEventListener("scroll", handleScroll);
    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const ListOfPapers = [
    {
      id: 1,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
    {
      id: 2,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
    {
      id: 3,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
  ];
  const ListOfQualifications = [
    {
      id: 1,
      title: "PhD in Mechanical Engineering",
      Date: "2021 – NOW",
      Location: "York University, Toronto ON, Canada",
      Thesis: "Compressible Flow Exfoliation of 2D Materials",
      Supervisor: "R. Rizvi , C. Jian",
    },
    {
      id: 2,
      title: "PhD in Mechanical Engineering",
      Date: "2021 – NOW",
      Location: "York University, Toronto ON, Canada",
      Thesis: "Compressible Flow Exfoliation of 2D Materials",
      Supervisor: "R. Rizvi , C. Jian",
    },
    {
      id: 3,
      title: "PhD in Mechanical Engineering",
      Date: "2021 – NOW",
      Location: "York University, Toronto ON, Canada",
      Thesis: "Compressible Flow Exfoliation of 2D Materials",
      Supervisor: "R. Rizvi , C. Jian",
    },
  ];
  const ListOfSkills = [
    {
      id: 1,
      skill: "Coding (Python, C++, JS, Matlab)",
    },
    {
      id: 2,
      skill: "LAMMPS Molecular Dynamics Simulator",
    },
    {
      id: 3,
      skill: "COMSOL Multiphysics, CATIA",
    },
    {
      id: 4,
      skill: "PhD in Mechanical Engineering",
    },
  ];
  const ListOfAwards = [
    {
      id: 1,
      Award:
        "Ranked 1st Among the BS Mechanical Engineering Alumni”, IK International University.",
    },
    {
      id: 2,
      Award:
        "Visiting the 'Condensed Matter and Statistical Physics of the Abdus Salam International Centre for Theoretical Physics (ICTP)' and collaboration with E. Roldan and A. Hassanali on a research project on 'inverse heat flux between nanoparticles', from 21 October to 18 November 2019, Trieste, Italy.",
    },
  ];
  const ListOfConferences = [
    {
      id: 1,
      Conference:
        '"Workshop on Molecular Dynamics and its Applications to Biological Systems:", online workshop, September 2020, ICTP, Trieste, Italy.',
    },
    {
      id: 2,
      Conference:
        '"Joint QLS-CMSP Virtual Summer Retreat on Heat, Water, Noise, and Life", online conference, Jul 2020, ICTP, Trieste, Italy.',
    },
  ];
  const ListOfTeachings = [
    {
      id: 1,
      Teaching:
        "Research Assistant in Advanced Simulation and Computing Lab, Mechanical Engineering Department, IK International University, September 2015 – 2020.",
    },
    {
      id: 2,
      Teaching:
        "Teacher Assistant in Heat transfer, Fluid Mechanics І, CFD, Mechanical Engineering Department, IK International University, 2017 – 2018, Qazvin, Iran.",
    },
  ];
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const [InfoClicked, setInfoClicked] = useState(
    Array.from({ length: ListOfPapers.length }, (_, i) => false)
  );
  const InfoClickedRef = useRef(InfoClicked);
  const handleInfoClicked = (index) => {
    const newArray = [...InfoClickedRef.current];
    newArray[index] = !InfoClickedRef.current[index];
    InfoClickedRef.current = newArray;
  };
  const OpenInfoMain = useSpring({
    marginBottom: !InfoClickedRef.current ? "0px" : "40px",
  });
  const OpenNothing = useSpring({
    marginBottom: "0px",
  });
  const OpenInfo = useSpring({
    transform: !InfoClickedRef.current
      ? "translateY(-40px)"
      : "translateY(0px)",
    opacity: !InfoClickedRef.current ? "0.5" : "1",
  });
  const Nothing = useSpring({
    transform: "translateY(-40px)",
    opacity: "0.5",
  });
  const Papers = ListOfPapers.map((Paper) => (
    <animated.div
      className="PaperAcademic"
      onClick={() => setInfoClicked([handleInfoClicked(Paper.id - 1)])}
      style={InfoClickedRef.current[Paper.id - 1] ? OpenInfoMain : OpenNothing}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * Paper.id }}
        className="PaperData"
      >
        <p1>{Paper.title}</p1>
        <div className="paper-details">
          <p1>The Journal of Physical Chemistry C</p1>
          <div>
            <p2>
              Read more
              <HiArrowSmRight />
            </p2>
          </div>
        </div>
      </motion.div>

      <div className="MoreInfo">
        <animated.p
          style={InfoClickedRef.current[Paper.id - 1] ? OpenInfo : Nothing}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(Paper.link)}
        >
          Online Version
          <SiGooglescholar />
        </animated.p>
        <animated.p
          style={InfoClickedRef.current[Paper.id - 1] ? OpenInfo : Nothing}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(Paper.pdf)}
        >
          Download PDF
          <RiDownloadCloudFill />
        </animated.p>
      </div>
    </animated.div>
  ));
  const MyInfo = (
    <motion.div
      className="MyInfo"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p1>PhD, PICSSL Lab</p1>
      <p2>Date of birth: 15.02.1995</p2>
      <p1>Lassonde School of Engineering</p1>
      <p2>CA Cell: +1 (416) 836 5851</p2>
      <p1>York University, Toronto, Canada</p1>
      <p2>IR Cell:+98 (919) 659 5351</p2>
    </motion.div>
  );
  const ResearchInterests = (
    <motion.div
      className="ResearchInterests"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p1>Research Interests:</p1>
      <div className="RInterests">
        <p>Atomistic Modeling</p>
        <p>2D Materials</p>
        <p>Heat transfer,</p>
        <p>Statistical Mechanics</p>
      </div>
    </motion.div>
  );
  const Qualifications = ListOfQualifications.map((Qualif) => (
    <div className="Quali">
      <div className="Quali-Title">
        <p>{Qualif.title}</p>
        <p2>{Qualif.Date}</p2>
      </div>
      <p2>{Qualif.Location}</p2>
      <p2>
        <span>Thesis:</span>
        {Qualif.Thesis}
      </p2>
      <p2>
        <span>Supervisor & Advisor:</span>
        {Qualif.Supervisor}
      </p2>
    </div>
  ));
  const QualificationsMain = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ResearchInterests"
    >
      <p1>Qualifications:</p1>
      {Qualifications}
    </motion.div>
  );
  const SkillSoftware = ListOfSkills.map((Skill) => (
    <div className="Skill-Title">
      <p>{Skill.skill}</p>
    </div>
  ));
  const SkillSoftwareMain = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ResearchInterests"
    >
      <p1>Skill & Software:</p1>
      <div className="Skill">{SkillSoftware}</div>
    </motion.div>
  );
  const Awards = ListOfAwards.map((Awards) => (
    <div className="Awards-Title">
      <p>
        <BsCircleFill />
        {Awards.Award}
      </p>
    </div>
  ));
  const AwardsMain = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ResearchInterests"
    >
      <p1>Awards & Certifications:</p1>
      <div className="Awards">{Awards}</div>
    </motion.div>
  );
  const Conferences = ListOfConferences.map((Conferences) => (
    <div className="Awards-Title">
      <p>
        <BsCircleFill />
        {Conferences.Conference}
      </p>
    </div>
  ));
  const ConferencesMain = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ResearchInterests"
    >
      <p1>Conferences and Workshops Attended:</p1>
      <div className="Awards">{Conferences}</div>
    </motion.div>
  );
  const Teachings = ListOfTeachings.map((Teachings) => (
    <div className="Awards-Title">
      <p>
        <BsCircleFill />
        {Teachings.Teaching}
      </p>
    </div>
  ));
  const TeachingsMain = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ResearchInterests"
    >
      <p1>Teaching and work experiences:</p1>
      <div className="Awards">{Teachings}</div>
    </motion.div>
  );

  return (
    <>
      <div ref={scrollableDivRef} id="AcademicCV-M" className="AcademicCV-M">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="AcademicCV-L"
        >
          <div className="paper-head">
            <div className="paper-circle"></div>
            <div className="paper-line"></div>
            <p>Published Papers</p>
          </div>
          {Papers}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="AcademicCV-R-Par"
        >
          <motion.div
            id="scrollableDiv"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="AcademicCV-R"
          >
            {MyInfo}
            {ResearchInterests}
            {QualificationsMain}
            {SkillSoftwareMain}
            {AwardsMain}
            {ConferencesMain}
            {TeachingsMain}
          </motion.div>
          <div
            className="AcademicCV-R-op-down"
            style={{
              opacity: scrollOpacityB,
              transition: "opacity 0.1s ease-in-out",
            }}
          ></div>
          <div
            className="AcademicCV-R-op-up"
            style={{
              opacity: scrollOpacityT,
              transition: "opacity 0.1s ease-in-out",
            }}
          ></div>
          <div className="AcademicCV-R-op-l">
            <p>Scroll Down </p>
            <BsArrowDownShort />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AcademicCV;
