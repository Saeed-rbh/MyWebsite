import React from "react";
import {
  PersonalInfo,
  Affiliation,
  Qualifications,
  ResearchInterests,
  Papers,
  Awards,
  Skills,
  Conference,
  Teaching,
} from "./sectionComponents";

const Sections = ({ renderSection }) => {
  const components = [
    PersonalInfo,
    Affiliation,
    ResearchInterests,
    Qualifications,
    Papers,
    Awards,
    Skills,

    Conference,
    Teaching,
  ];

  return (
    <>
      {components.map((Component) =>
        renderSection(Component, { key: Component.name })
      )}
    </>
  );
};

export default Sections;
