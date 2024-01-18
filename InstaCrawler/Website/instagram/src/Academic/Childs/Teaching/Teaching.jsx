import React, { memo } from "react";
import TeachingMain from "./TeachingMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

const componentName = "Teaching";

const Teaching = memo(() => {
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <TeachingMain
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

export default Teaching;
