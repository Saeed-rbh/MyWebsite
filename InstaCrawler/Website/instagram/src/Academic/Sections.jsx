import React, { useEffect, useState, useRef } from "react";
import PersonalInfo from "./PersonalInfo";
import Affiliation from "./Affiliation";
import Papers from "./Papers";
import Qualifications from "./Qualifications";
import ResearchInterests from "./ResearchInterests";
import Skills from "./Skills";
import Awards from "./Awards";
import Conference from "./Conference";
import Teaching from "./Teaching";
import SectionsData from "./SectionsData";
import useElementSize from "./Styles//useElementSize";

const Sections = ({ CloseOpen, setCloseOpen, MouseHover, setMouseHover }) => {
  const MainElementSize = useElementSize("MoreInfoAcademic");
  const PersonalInfoRef = useRef(null);
  const AffiliationRef = useRef(null);
  const QualificationsRef = useRef(null);
  const SkillsRef = useRef(null);
  const PapersRef = useRef(null);
  const ResearchInterestsRef = useRef(null);
  const AwardsRef = useRef(null);
  const ConferenceRef = useRef(null);

  const sectionProperties = [
    {
      id: 0,
      name: "PersonalInfo",
      title: "Personal Info",
      background: "rgb(0 0 0 / 50%)",
      padding: [20, 20, 18, 20],
      size: [80, 415], // height, minWidth/
      iniRL: 55,
    },
    {
      id: 1,
      name: "Affiliation",
      title: "Affiliation",
      background: "rgb(0 0 0 / 40%)",
      padding: [20, 20, 18, 20],
      size: [100, 270],
      iniRL: 55,
    },
    {
      id: 2,
      name: "Qualifications",
      title: "Qualifications",
      background: "rgb(0 0 0 / 30%)",
      padding: [15, 30, 15, 20],
      size: [160, 415],
      iniRL: 55,
    },
    {
      id: 3,
      name: "Skills",
      title: "Skill & Software",
      background: "rgb(0 0 0 / 20%)",
      padding: [20, 20, 10, 20],
      size: [95, 415],
      iniRL: 55,
      IfCalc: false,
    },
    {
      id: 4,
      name: "ResearchInterests",
      title: "Research Interests",
      background: "rgb(0 0 0 / 40%)",
      padding: [20, 20, 10, 20],
      size: [30, 550],
      iniRL: 48,
    },
    {
      id: 5,
      name: "Papers",
      title: "Published Papers",
      background: "rgb(0 0 0 / 30%)",
      padding: [20, 20, 20, 20],
      size: [170, 550],
      iniRL: 48,
      IfCalc: false,
    },
    {
      id: 6,
      name: "Awards",
      title: "Awards & Certifications",
      background: "rgb(0 0 0 / 30%)",
      padding: [20, 20, 20, 20],
      size: [0, 550],
      iniRL: 48,
      IfCalc: true,
    },
    {
      id: 7,
      name: "Conference",
      title: "Conferences & Workshops",
      background: "rgb(0 0 0 / 30%)",
      padding: [20, 20, 20, 20],
      size: [0, 550],
      iniRL: 48,
      IfCalc: true,
    },
    {
      id: 8,
      name: "Teaching",
      title: "Teaching & work experiences",
      background: "rgb(0 0 0 / 30%)",
      padding: [20, 20, 20, 20],
      size: [0, 550],
      iniRL: 48,
      IfCalc: true,
    },
  ];
  const [Changed_Height, setChanged_Height] = useState([]);
  const Dataini = SectionsData(sectionProperties, null, 0);
  const [Data, setData] = useState(Dataini);

  useEffect(() => {
    const updateData = async () => {
      let updatedData = Data;
      for (const [id, height] of Changed_Height) {
        updatedData = await SectionsData(updatedData, id, height);
      }
      setData(updatedData);
    };
    if (Changed_Height.length > 0) {
      updateData();
    }
  }, [Changed_Height]);

  return (
    <>
      <PersonalInfo
        Data={Data[0]}
        MainElementSize={MainElementSize}
        Ref={PersonalInfoRef}
      />
      <Affiliation
        Data={Data[1]}
        MainElementSize={MainElementSize}
        Ref={AffiliationRef}
      />
      <Qualifications
        Data={Data[2]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={QualificationsRef}
      />
      <Skills
        Data={Data[3]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={SkillsRef}
      />
      <ResearchInterests
        Data={Data[4]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={ResearchInterestsRef}
      />
      <Papers
        Data={Data[5]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={PapersRef}
      />
      <Awards
        Data={Data[6]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={AwardsRef}
        setChanged_Height={setChanged_Height}
      />
      <Conference
        Data={Data[7]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={ConferenceRef}
        setChanged_Height={setChanged_Height}
      />
      <Teaching
        Data={Data[8]}
        CloseOpen={CloseOpen}
        setCloseOpen={setCloseOpen}
        MouseHover={MouseHover}
        setMouseHover={setMouseHover}
        MainElementSize={MainElementSize}
        Ref={ConferenceRef}
        setChanged_Height={setChanged_Height}
      />
    </>
  );
};

export default Sections;
