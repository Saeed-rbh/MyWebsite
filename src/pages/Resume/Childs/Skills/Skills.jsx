import React from "react";
import SkillsMain from "./SkillsMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

const Skills = () => {
  const componentName = "Skill & Software";
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
        isActive={utilizeProps.isActive}
      />
    </InteractiveDiv>
  );
};

export default Skills;
