import React, { memo, useMemo } from "react";
import { animated, useSpring } from "react-spring";
import RenderComponent from "../General/RenderComponent";
import { useSelector } from "react-redux";
import Sections from "../General/Sections";

const MoreInfoAcademic = memo(
  ({ stages, conditionStage, toggle, lastValue }) => {
    const { renderSection } = RenderComponent();
    const hover = useSelector((state) => state.data.hover);

    const closeOpenStyleBlur = useSpring({
      opacity: useMemo(
        () =>
          conditionStage ? (toggle[0] || (hover[0] && !stages[2]) ? 1 : 0) : 0,
        [conditionStage, toggle, hover, stages]
      ),
      height: useMemo(() => `${lastValue + 20}px`, [lastValue]),
    });

    return (
      <>
        <animated.div
          className="MoreInfoBlur"
          style={{
            ...closeOpenStyleBlur,
            zIndex: toggle[0] ? 20 : 5,
          }}
        />
        <Sections renderSection={renderSection} />
      </>
    );
  }
);

export default MoreInfoAcademic;
