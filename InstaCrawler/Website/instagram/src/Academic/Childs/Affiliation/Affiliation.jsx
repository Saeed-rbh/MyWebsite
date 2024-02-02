import React, { useState, useMemo } from "react";
import { animated, useSpring, easings } from "react-spring";
import { calculateBackgroundImage, ImageDiv, ContentDiv } from "./Components";
import { useUtilize } from "../../Styles/useUtilize";
import myImage from "../../../../src/Image/AcademicImg.jpeg";
import useElementSize from "../../Styles/useElementSize";

export const Affiliation = () => {
  const mainElementSize = useElementSize("MoreInfoAcademic");
  const componentName = "Affiliation";
  const {
    name,
    size,
    title,
    padding,
    height,
    rand,
    stages,
    isActive,
    ParentRef,
    styles,
    titleStyle,
    MainStyle,
  } = useUtilize(componentName);

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

  const [, leftPadding, , rightPadding] = padding;
  const widthOffset = leftPadding + rightPadding;

  const calculateWidth = (stages, mainElementSize, height) => {
    return stages[2] || stages[3]
      ? `${mainElementSize.width - widthOffset - height - 50}px`
      : `${0.38 * mainElementSize.width - height - 40}px`;
  };

  const calculatePadding = (padding) => {
    return `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`;
  };

  const animatedStyle = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backgroundImage,
    top: "-5px",
    width: useMemo(
      () => calculateWidth(stages, mainElementSize, height),
      [stages, mainElementSize, height]
    ),
    height: height,
    left: `${height + 50}px`,
    easing: easings.easeOutCubic,
    padding: useMemo(() => calculatePadding(padding), [padding]),
  });

  const animatedImgDiv = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    display: "flex",
    borderRadius: "40px",
    top: "-5px",
    height: height,
    width: `${height}px`,
    minWidth: height,
    left: "0%",
    easing: easings.easeOutCubic,
    padding: useMemo(() => calculatePadding(padding), [padding]),
  });

  return (
    <animated.div
      ref={ParentRef}
      style={{
        ...styles.base,
        backgroundColor: "rgba(0, 0, 0, 0)",
        backgroundImage: "none",
      }}
      className={name}
      id={name}
    >
      <ImageDiv animatedStyle={animatedImgDiv} imageSrc={myImage} />
      <ContentDiv
        animatedStyle={animatedStyle}
        name={name}
        size={size}
        title={title}
        padding={padding}
        titleStyle={titleStyle}
        MainStyle={MainStyle}
      />
    </animated.div>
  );
};

export default Affiliation;
