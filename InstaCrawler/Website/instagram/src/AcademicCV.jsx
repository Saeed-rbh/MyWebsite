import "./AcademicCV.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { RiDownloadCloudFill } from "react-icons/ri";
import { SiGooglescholar } from "react-icons/si";
import { HiArrowSmRight } from "react-icons/hi";
import { BsArrowDownShort } from 'react-icons/bs';

const AcademicCV = () => {
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
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const [InfoClicked, setInfoClicked] = useState([false, 0]);
  const OpenInfoMain = useSpring({
    marginBottom: !InfoClicked[0] ? "5px" : "55px",
  });
  const OpenNothing = useSpring({
    marginBottom: "5px",
  });
  const OpenInfo = useSpring({
    transform: !InfoClicked[0] ? "translateY(-40px)" : "translateY(0px)",
    opacity: !InfoClicked[0] ? "0.5" : "1",
  });
  const Nothing = useSpring({
    transform: "translateY(-40px)",
    opacity: "0.5",
  });
  const Papers = ListOfPapers.map((Paper) => (
    <animated.div
      className="PaperAcademic"
      onClick={() => setInfoClicked([!InfoClicked[0], Paper.id])}
      style={InfoClicked[1] === Paper.id ? OpenInfoMain : OpenNothing}
    >
      <div className="PaperData">
        {" "}
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
      </div>

      <div className="MoreInfo">
        <animated.p
          style={InfoClicked[1] === Paper.id ? OpenInfo : Nothing}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(Paper.link)}
        >
          Online Version
          <SiGooglescholar />
        </animated.p>
        <animated.p
          style={InfoClicked[1] === Paper.id ? OpenInfo : Nothing}
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
    <div className="MyInfo">
      <p1>PhD, PICSSL Lab</p1>
      <p2>Date of birth: 15.02.1995</p2>
      <p1>Lassonde School of Engineering</p1>
      <p2>CA Cell: +1 (416) 836 5851</p2>
      <p1>York University, Toronto, Canada</p1>
      <p2>IR Cell:+98 (919) 659 5351</p2>
    </div>
  );
  const ResearchInterests = (
    <div className="ResearchInterests">
      <p1>Research Interests:</p1>
      <div className="RInterests">
        <p>Atomistic Modeling</p>
        <p>2D Materials</p>
        <p>Heat transfer,</p>
        <p>Statistical Mechanics</p>
      </div>
    </div>
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
  return (
    <>
      <div className="AcademicCV-M">
        <div className="AcademicCV-L">
          <div className="paper-head">
            <div className="paper-circle"></div>
            <div className="paper-line"></div>
            <p>Published Papers</p>
          </div>
          {Papers}
        </div>
        <div className="AcademicCV-R-Par">
          <div className="AcademicCV-R">
            {MyInfo}
            {ResearchInterests}
            <div className="ResearchInterests">
              <p1>Qualifications:</p1>
              {Qualifications}
            </div>
            <div className="ResearchInterests">
              <p1>Qualifications:</p1>
              {Qualifications}
            </div>
          </div>
          <div className="AcademicCV-R-op"> </div>
          <div className="AcademicCV-R-op-l"> 
          <p>Scroll Down </p>
          <BsArrowDownShort />
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicCV;
