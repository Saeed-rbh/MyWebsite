import React, { useState, useMemo, useEffect } from "react";
import { animated, useSpring, easings } from "react-spring";
import { calculateBackgroundImage, ImageDiv, ContentDiv } from "./Components";
import { useUtilize } from "../../Styles/useUtilize";
import myImage from "../../../../src/Image/AcademicImg.JPG";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useClickOtherFade } from "../../Styles/otherStyles";

export const Affiliation = () => {
  const componentName = "Affiliation";
  const {
    name,
    size,
    title,
    padding,
    top,
    rand,
    isActive,
    ParentRef,
    adjustViewport,
  } = useUtilize(componentName);

  const { stages, scollableRef, toggle } = useSelector((state) => state.data);
  const height = stages ? size[0] - 10 : size[0];
  const { scrollTop } = useScrollPosition(scollableRef);

  const startScroll = top - adjustViewport; // Where you want progress to start
  const endScroll = top - adjustViewport + height; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const [otherActive, setOtherActive] = useState(false);
  useEffect(() => {
    if (toggle[0] && toggle[1] !== name) {
      setOtherActive(true);
    } else {
      setOtherActive(false);
    }
  }, [toggle, name]);

  const openClose = useMemo(() => (isActive ? 2 : 1), [isActive]);
  const [randomStart] = useState(rand);

  // UseSpring hook to animate the background
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

  // useMemo hook to memoize the calculation of the background image
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
    overflow: "visible",
    width: stages[2] ? "calc(100%)" : `${size[1]}px`,
    zIndex: "10",
    left: stages[2] ? "0px" : "35px",
    top: stages[2] ? `calc(5vh + ${top + 15}px)` : `calc(5vh + ${top}px)`,
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, scale: 1.1, y: 20 },
    to: {
      opacity: progress ? 1 - progress : 1,
      y: 0,
      scale: progress ? 1 - (1 - 0.95) * progress : 1,
      filter: `blur(${5 * progress}px)`,
    },
    delay: stages[2] && progress && progress !== 0 ? 0 : 800,
    config: {
      duration: stages[2] && progress && progress !== 0 ? 0 : 500,
      easing:
        stages[2] && progress && progress !== 0
          ? easings.steps(5)
          : easings.easeInQuad,
    },
  });
  const StyleAnim2 = useClickOtherFade(otherActive, progress);
  return (
    <animated.div
      ref={ParentRef}
      style={{
        ...Style,
        ...StyleAnim,
        ...StyleAnim2,
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
