"use client";
import React from "react";
import AwardsMain from "./AwardsMain";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";
import { Drawer } from "vaul";

const Awards = () => {
  const componentName = "Awards";
  const utilizeProps = useUtilize(componentName);

  return (
    <>
      <InteractiveDiv {...utilizeProps}>
        <AwardsMain
          ChildRefs={utilizeProps.ChildRefs}
          styles={utilizeProps.styles}
          ParentRef={utilizeProps.ParentRef}
          List={utilizeProps.list}
          isActive={utilizeProps.isActive}
          stages={utilizeProps.stages}
          size={utilizeProps.size}
        />{" "}
      </InteractiveDiv>
    </>
  );
};

export default Awards;
