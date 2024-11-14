import React from "react";
import { useSpring, easings } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import InteractiveDiv from "../Helper/InteractiveDiv";
import QualificationMain from "./QualificationMain";

function Qualifications() {
  const componentName = "Qualifications";
  const utilizeProps = useUtilize(componentName);

  const { size, top } = useUtilize(componentName);

  const { stages, scollableRef } = useSelector((state) => state.data);

  const { scrollTop } = useScrollPosition(scollableRef);

  // Calculate progress between 0 and 30 for smooth transition (0 to 1)
  const startScroll = top - 60 + 520; // Where you want progress to start
  const endScroll = top - 60 + size[0] + 520; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const Style = {
    borderRadius: "40px",
    height: stages[2] ? `${size[0] + 20}px` : `${size[0]}px`,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[2] ? "calc(100% - 5px)" : `calc(100% - ${size[1] + 100}px)`,
    border: "2px solid rgba(212, 157, 129, 0.1)",
    zIndex: "10",
    left: stages[2] ? "0px" : "500px",
    top: stages[2] ? `calc(5vh + ${top + 15 + 520}px)` : `calc(5vh + ${top}px)`,
    overflow: "hidden",
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, scale: 1.1, y: 20 },
    to: {
      opacity: stages[2] && progress ? 1 - progress : 1,
      y: 0,
      scale: stages[2] && progress ? 1 - (1 - 0.95) * progress : 1,
      filter: stages[2] && `blur(${5 * progress}px)`,
    },
    delay: stages[2] && progress && progress !== 0 ? 0 : 500,
    config: {
      duration: stages[2] && progress && progress !== 0 ? 0 : 500,
      easing:
        stages[2] && progress && progress !== 0
          ? easings.steps(5)
          : easings.easeInQuad,
    },
  });

  return (
    <InteractiveDiv {...utilizeProps} style={{ ...Style, ...StyleAnim }}>
      <QualificationMain
        ChildRefs={utilizeProps.ChildRefs}
        styles={utilizeProps.styles}
        ParentRef={utilizeProps.ParentRef}
        List={utilizeProps.list}
        isActive={utilizeProps.isActive}
      />
    </InteractiveDiv>
  );
}

export default Qualifications;
