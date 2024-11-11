import React from "react";
import {
  PersonalInfo,
  Affiliation,
  Qualifications,
  Skills,
  ResearchInterests,
  Papers,
  Awards,
  Conference,
  Teaching,
} from "./sectionComponents";

const Sections = ({ renderSection }) => {
  const components = [
    PersonalInfo,
    Affiliation,
    // ResearchInterests,
    // Qualifications,
    // Papers,
    // Skills,
    // Awards,
    // Conference,
    // Teaching,
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
