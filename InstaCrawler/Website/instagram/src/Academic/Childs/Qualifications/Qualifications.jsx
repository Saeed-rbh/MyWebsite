import React from "react";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);
  const { toggle } = useSelector((state) => state.data);

  return (
    <InteractiveDiv {...utilizeProps}>
      <QualificationMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
        toggle={toggle}
      />
    </InteractiveDiv>
  );
}

export default Qualifications;
