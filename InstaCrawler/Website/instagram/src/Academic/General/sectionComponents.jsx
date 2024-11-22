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
    size: [130, 450],
    top: 100 - 5,
    adjustTop: 5,
    adjustViewport: -40,
    adjustHeight: 0,
    fixed: true,
    Rand: Math.random(),
    list: [],
  },
  {
    id: 1,
    name: "Affiliation",
    title: "Affiliation",
    background: "rgb(0 0 0 / 40%)",
    size: [130, 450],
    fixed: true,
    top: 250 - 5,
    adjustTop: 5,
    adjustHeight: 0,
    adjustViewport: -40,
    Rand: Math.random(),
    list: [],
    isCalc: false,
  },
  {
    id: 2,
    name: "ResearchInterests",
    title: "Research Interests",
    background: "rgb(0 0 0 / 40%)",
    size: [75, 450],
    fixed: true,
    top: 380 - 5,
    adjustTop: 5,
    adjustHeight: 0,
    adjustViewport: -40,
    Rand: Math.random(),
    list: ResearchInterestsList,
    isCalc: false,
  },
  {
    id: 3,
    name: "Skills",
    explanation: "Achieved proficiency in various technical skills",
    title: "Skill & Software",
    background: "rgb(0 0 0 / 20%)",
    size: [140, 450],
    top: 500 + 480,
    adjustTop: -480,
    adjustHeight: -10,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: SkillsList,
    isCalc: false,
    // 55 + 465
  },
  {
    id: 4,
    name: "Qualifications",
    explanation: "Achieved educational credentials",
    title: "Qualifications",
    background: "rgb(0 0 0 / 30%)",
    size: [190, 450],
    top: 45 + 510,
    adjustTop: -510,
    adjustHeight: -20,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: QualificationsList,
    isCalc: false,
  },

  {
    id: 5,
    name: "Published Papers",
    explanation: "Peer-reviewed research contributions",
    title: "Published Papers",
    background: "rgb(0 0 0 / 30%)",
    size: [210, 450],
    top: 225 + 535,
    adjustTop: -535,
    adjustHeight: -20,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: PapersList,
    isCalc: false,
    // 175 + 585 = 760 - 245 = 515
  },

  {
    id: 6,
    name: "Conference",
    explanation: "Participation in Scholarly Conferences and Workshops",
    title: "Workshops & Conferences",
    background: "rgb(0 0 0 / 30%)",
    size: [120, 450],
    top: 425 + 710,
    adjustTop: -710,
    adjustHeight: -20,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: ConferenceList,
    isCalc: true,
  },
  {
    id: 7,
    name: "Awards",
    explanation: "Acknowledgement of  Professional Achievement",
    title: "Awards & Certifications",
    background: "rgb(0 0 0 / 30%)",
    size: [100, 450],
    top: 535 + 730,
    adjustTop: -730,
    adjustHeight: -5,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: AwardsList,
    isCalc: false,
    // 540 - 465 = 75 - 810 = -735
  },

  {
    id: 8,
    name: "Teaching",
    explanation: "Involvement in Teaching and Professional Work Experiences",
    title: "Teach & work experiences",
    background: "rgb(0 0 0 / 30%)",
    size: [100, 450],
    top: 535 + 730,
    adjustTop: -730,
    adjustHeight: -5,
    adjustViewport: -40,
    fixed: false,
    Rand: Math.random(),
    list: TeachingList,
    isCalc: true,
  },
];
