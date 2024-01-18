import React, { memo } from "react";
import { useUtilize } from "../../Styles/useUtilize";
import ConferanceMain from "./ConferanceMain";
import InteractiveDiv from "../Helper/InteractiveDiv";

const componentName = "Conference";

const Conference = memo(() => {
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <ConferanceMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
      />
    </InteractiveDiv>
  );
});

export default Conference;
