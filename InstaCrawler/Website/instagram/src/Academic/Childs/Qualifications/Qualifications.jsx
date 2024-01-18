import React from "react";
import QualificationMain from "./QualificationMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <QualificationMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
      />
    </InteractiveDiv>
  );
}

export default Qualifications;
