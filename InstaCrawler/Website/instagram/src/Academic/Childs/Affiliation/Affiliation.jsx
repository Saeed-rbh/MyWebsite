import React, { useState, useMemo } from "react";
import { animated, useSpring, easings } from "react-spring";
import { calculateBackgroundImage, ImageDiv, ContentDiv } from "./Components";
import { useUtilize } from "../../Styles/useUtilize";
import myImage from "../../../../src/Image/AcademicImg.JPG";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";

export const Affiliation = () => {
  const componentName = "Affiliation";
  const { name, size, title, padding, top, rand, isActive, ParentRef } =
    useUtilize(componentName);

  const { stages, scollableRef } = useSelector((state) => state.data);
  const height = stages ? size[0] - 10 : size[0];
  const { scrollTop } = useScrollPosition(scollableRef);

  const startScroll = 120; // Where you want progress to start
  const endScroll = 120 + height; // Where you want progress to end
  const progress = Math.min(
    Math.max((scrollTop - startScroll) / (endScroll - startScroll), 0),
    1
  );

  const StyleScroll = useSpring({
    opacity: 1 - progress, // Gradually decrease opacity from 1 to 0 as progress increases from 0 to 1
    filter: `blur(${5 * progress}px)`, // Gradually increase blur from 0px to 5px as progress increases
    scale: 1 - (1 - 0.95) * progress, // Gradually decrease scale from 1 to 0.95 as progress increases
  });
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
    border: "2px solid rgba(212, 157, 129, 0.1)",
    top: "-5px",
    width: `${size[1] - height - 5}px`,
    maxWidth: `calc(100% - ${height + 5}px)`,
    left: `${height + 5}px`,
    height: height,
    padding: 15,
    easing: easings.easeOutCubic,
    boxSizing: "border-box",
  });

  const animatedImgDiv = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: "2px solid rgba(212, 157, 129, 0.1)",
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
    easing: easings.easeOutCubic,
    boxSizing: "border-box",
  });

  const Style = {
    borderRadius: "35px",
    height: height,
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "visible",
    width: stages[2] ? "calc(100% - 5px)" : `${size[1]}px`,
    zIndex: "10",
    left: stages[2] ? "0px" : "35px",
    top: stages[2] ? `calc(5vh + ${top - 45}px)` : `calc(5vh + ${top}px)`,
  };

  const StyleAnim = useSpring({
    from: { opacity: 0, transform: "scale(1.1)  translateY(20px)" },
    to: {
      opacity: progress < 1 ? 1 : 0,
      transform: "scale(1)  translateY(0px)",
    },
    delay: 500,
    config: { duration: 500 },
  });

  return (
    <animated.div
      ref={ParentRef}
      style={{
        ...Style,
        ...StyleAnim,
        ...StyleScroll,
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
