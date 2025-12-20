import React, { useMemo } from "react";
import { animated, useSpring } from "react-spring";
import RenderComponent from "../General/RenderComponent";
import Sections from "../General/Sections";

const MoreInfoAcademic = ({ lastValue }) => {
  const { renderSection } = RenderComponent();

  const closeOpenStyleBlur = useSpring({
    height: useMemo(() => `${lastValue + 30}px`, [lastValue]),
  });

  return (
    <>
      <animated.div className="MoreInfoBlur" style={closeOpenStyleBlur} />
      <Sections renderSection={renderSection} />
    </>
  );
};
export default React.memo(MoreInfoAcademic);
