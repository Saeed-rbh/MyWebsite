import React, { memo } from "react";
import AwardsMain from "./AwardsMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

const componentName = "Awards";

const Awards = memo(() => {
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <AwardsMain
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

export default Awards;
