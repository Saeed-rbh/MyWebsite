import React from "react";
import { useUtilize } from "../../Styles/useUtilize";
import SkillsMain from "./SkillsMain";
import InteractiveDiv from "../Helper/InteractiveDiv";

const componentName = "Skills";

const Skills = () => {
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <SkillsMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        title={utilizeProps.title}
        stages={utilizeProps.stages}
      />
    </InteractiveDiv>
  );
};

export default Skills;
