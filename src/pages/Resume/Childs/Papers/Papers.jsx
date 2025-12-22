import React from "react";
import MoreInfoPapers from "./MoreInfoPapers";
import PaperData from "./PaperData";
import RecentPaper from "./RecentPaper";
import { useUtilize } from "../../Styles/useUtilize";
import InteractiveDiv from "../Helper/InteractiveDiv";

const Papers = () => {
  const componentName = "Published Papers";
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
        size={utilizeProps.size}
        adjustHeight={utilizeProps.adjustHeight}
        list={utilizeProps.list}
      />
      <MoreInfoPapers
        isActive={utilizeProps.isActive}
        isHovered={utilizeProps.isHovered}
        ParentRef={utilizeProps.ParentRef}
        ChildRefs={utilizeProps.ChildRefs}
        stages={utilizeProps.stages}
        list={utilizeProps.list}
      />
    </InteractiveDiv>
  );
};

export default Papers;
