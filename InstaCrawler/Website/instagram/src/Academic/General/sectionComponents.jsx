import { List as QualificationsList } from "../Childs/Qualifications/List";
import { List as AwardsList } from "../Childs/Awards/List";
import { List as ConferenceList } from "../Childs/Conference/List";
import { List as PapersList } from "../Childs/Papers/List";
import { List as ResearchInterestsList } from "../Childs/ResearchInterests/List";
import { List as SkillsList } from "../Childs/Skills/List";
import { List as TeachingList } from "../Childs/Teaching/List";

// sectionComponents.jsx
export { default as PersonalInfo } from "../Childs/PersonalInfo/PersonalInfo";
export { default as Affiliation } from "../Childs/Affiliation/Affiliation";
export { default as Qualifications } from "../Childs/Qualifications/Qualifications";
export { default as Skills } from "../Childs/Skills/Skills";
export { default as ResearchInterests } from "../Childs/ResearchInterests/ResearchInterests";
export { default as Papers } from "../Childs/Papers/Papers";
export { default as Awards } from "../Childs/Awards/Awards";
export { default as Conference } from "../Childs/Conference/Conference";
export { default as Teaching } from "../Childs/Teaching/Teaching";

export const sectionProperties = [
  {
    id: 0,
    name: "PersonalInfo",
    title: "Personal Info",
    background: "rgb(0 0 0 / 50%)",
    padding: [25, 0, 23, 0],
    size: [130, 450],
    top: 110,
    fixed: true,
    Rand: Math.random(),
    list: [],
  },
  {
    id: 1,
    name: "Affiliation",
    title: "Affiliation",
    background: "rgb(0 0 0 / 40%)",
    padding: [20, 20, 18, 20],
    size: [130, 450],
    fixed: true,
    top: 260,
    Rand: Math.random(),
    list: [],
    isCalc: false,
  },
  {
    id: 2,
    name: "Qualifications",
    explanation: "Achieved educational credentials",
    title: "Qualifications",
    background: "rgb(0 0 0 / 30%)",
    padding: [15, 30, 15, 20],
    size: [170, 415],
    fixed: false,
    Rand: Math.random(),
    list: QualificationsList,
    isCalc: false,
  },
  {
    id: 3,
    name: "Skills",
    explanation: "Achieved proficiency in various technical skills",
    title: "Skill & Software",
    background: "rgb(0 0 0 / 20%)",
    padding: [20, 20, 10, 20],
    size: [100, 415],
    fixed: false,
    Rand: Math.random(),
    list: SkillsList,
    isCalc: false,
  },
  {
    id: 4,
    name: "ResearchInterests",
    title: "Research Interests",
    background: "rgb(0 0 0 / 40%)",
    padding: [25, 20, 18, 20],
    size: [130, 450],
    fixed: true,
    top: 395,
    Rand: Math.random(),
    list: ResearchInterestsList,
    isCalc: false,
  },
  {
    id: 5,
    name: "Papers",
    explanation: "Peer-reviewed research contributions",
    title: "Published Papers",
    background: "rgb(0 0 0 / 30%)",
    padding: [20, 20, 0, 20],
    size: [180, 550],
    fixed: false,
    Rand: Math.random(),
    list: PapersList,
    isCalc: false,
  },
  {
    id: 6,
    name: "Awards",
    explanation: "Acknowledgement of  Professional Achievement",
    title: "Awards & Certifications",
    background: "rgb(0 0 0 / 30%)",
    padding: [20, 20, 30, 20],
    size: [0, 550],
    fixed: false,
    Rand: Math.random(),
    list: AwardsList,
    isCalc: true,
  },
  {
    id: 7,
    name: "Conference",
    explanation: "Participation in Scholarly Conferences and Workshops",
    title: "Workshops & Conferences",
    background: "rgb(0 0 0 / 30%)",
    padding: [20, 20, 20, 20],
    size: [0, 550],
    fixed: false,
    Rand: Math.random(),
    list: ConferenceList,
    isCalc: true,
  },
  {
    id: 8,
    name: "Teaching",
    explanation: "Involvement in Teaching and Professional Work Experiences",
    title: "Teaching & work experiences",
    background: "rgb(0 0 0 / 30%)",
    padding: [20, 20, 20, 20],
    size: [0, 550],
    fixed: false,
    Rand: Math.random(),
    list: TeachingList,
    isCalc: true,
  },
];
