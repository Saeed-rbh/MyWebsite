import React, { useRef, useCallback } from "react";

const useSectionRefs = () => {
  return {
    PersonalInfo: useRef(null),
    Affiliation: useRef(null),
    Qualifications: useRef(null),
    Skills: useRef(null),
    Papers: useRef(null),
    ResearchInterests: useRef(null),
    Awards: useRef(null),
    Conference: useRef(null),
  };
};

const RenderComponent = () => {
  const sectionRefs = useSectionRefs();

  const renderSection = useCallback(
    (Component, { ...props }) => (
      <Component {...props} elementRef={sectionRefs[Component.name]} />
    ),
    [sectionRefs]
  );

  return { renderSection };
};

export default RenderComponent;
