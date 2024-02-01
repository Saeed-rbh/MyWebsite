import React from "react";
import MoreInfoPapers from "./MoreInfoPapers";
import PaperData from "./PaperData";
import RecentPaper from "./RecentPaper";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

const componentName = "Papers";

const Papers = () => {
  const utilizeProps = useUtilize(componentName);

  return (
    <InteractiveDiv {...utilizeProps}>
      <RecentPaper
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
        list={utilizeProps.list}
      />
      <PaperData
        isActive={utilizeProps.isActive}
        stages={utilizeProps.stages}
      />
      <MoreInfoPapers
        isActive={utilizeProps.isActive}
        isHovered={utilizeProps.isHovered}
        ParentRef={utilizeProps.ParentRef}
        ChildRefs={utilizeProps.ChildRefs}
        stages={utilizeProps.stages}
      />
      <div className="div-"></div>
    </InteractiveDiv>
  );
};

export default Papers;
