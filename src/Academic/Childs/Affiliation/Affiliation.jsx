import React, { useState, useMemo, useEffect } from "react";
import { animated, useSpring, easings } from "react-spring";
import { calculateBackgroundImage, ImageDiv, ContentDiv } from "./Components";
import { useUtilize } from "../../Styles/useUtilize";
import myImage from "../../../../src/Image/AcademicImg.JPG?url";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";
import useElementSize from "../../Styles/useElementSize";

export const Affiliation = () => {
  const componentName = "Affiliation";
  const {
    id,
    name,
    size,
    title,
    padding,
    top,
    rand,
    isActive,
    adjustViewport,
    adjustTop,
  } = useUtilize(componentName);

  const elementSize = useElementSize("MoreInfoAcademic").width;

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const height = stages ? size[0] - 10 : size[0];
  const { scrollTop } = useScrollPosition(scollableRef);

  const openClose = useMemo(() => (isActive ? 2 : 1), [isActive]);
  const [randomStart] = useState(rand);

  const { backgroundAnim } = useSpring({
    from: { backgroundAnim: 0 },
    to: async (next) => {
      while (true) {
        await next({
          backgroundAnim: 1,
          config: { duration: 7000 - 1000 * randomStart },
        });
        await next({
          backgroundAnim: 0,
          config: { duration: 7000 - 1000 * randomStart },
        });
      }
    },
    delay: 1000 * randomStart,
  });

  const backgroundImage = useMemo(
    () =>
      backgroundAnim.interpolate((value) =>
        calculateBackgroundImage(value, randomStart, openClose)
      ),
    [backgroundAnim, randomStart, openClose]
  );

  const animatedStyle = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage,
    border: "2px solid rgba(212, 157, 129, 0.2)",
    top: "-5px",
    width: `${size[1] - height - 5}px`,
    maxWidth: `calc(100% - ${height + 5}px)`,
    left: `${height + 5}px`,
    height: height,
    padding: 15,
    boxSizing: "border-box",
    config: {
      easing: easings.easeOutCubic,
    },
  });

  const animatedImgDiv = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: "2px solid rgba(212, 157, 129, 0.2)",
    position: "absolute",
    display: "flex",
    borderRadius: "40px",
    alignItems: "center",
    justifyContent: "center",
    top: "-5px",
    height: height,
    padding: 15,
    width: height,
    minWidth: height,
    left: "0%",
    boxSizing: "border-box",
    config: {
      easing: easings.easeOutCubic,
    },
  });

  const Style = {
    borderRadius: "35px",
    height: height,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: stages[1] ? Math.min(elementSize * 0.97, size[1]) : size[1],
    left: stages[1]
      ? (elementSize - Math.min(elementSize * 0.97, size[1])) / 2
      : 0,

    overflow: "visible",
    zIndex: "10",
    boxSize: "border-box",
    top: stages[1] ? top : top + adjustTop,
  };

  const [initial, setInitial] = useState(false);
  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
    isActive,
    initial,
    setInitial,
  });

  return (
    <animated.div
      ref={ref}
      style={{
        ...Style,
        ...combinedStyle,
        backgroundColor: "rgba(0, 0, 0, 0)",
        backgroundImage: "none",
      }}
      className={name}
      id={name}
    >
      <ImageDiv
        animatedStyle={animatedImgDiv}
        imageSrc={myImage}
        height={height}
      />
      <ContentDiv
        animatedStyle={animatedStyle}
        name={name}
        size={size}
        title={title}
        padding={padding}
        height={height}
      />
    </animated.div>
  );
};

export default Affiliation;
