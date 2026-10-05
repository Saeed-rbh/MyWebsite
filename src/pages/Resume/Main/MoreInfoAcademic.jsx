import React, { useMemo } from "react";
import { animated, useSpring } from "react-spring";
import RenderComponent from "../General/RenderComponent";
import Sections from "../General/Sections";

const MoreInfoAcademic = ({ lastSectionTop }) => {
  const { renderSection } = RenderComponent();

  const closeOpenStyleBlur = useSpring({
    height: useMemo(() => `calc(${Math.max(0, lastSectionTop - 100)}px + 100vh)`, [lastSectionTop]),
  });

  return (
    <>
      <animated.div className="MoreInfoBlur" style={closeOpenStyleBlur} />
      <Sections renderSection={renderSection} />
    </>
  );
};
export default React.memo(MoreInfoAcademic);
