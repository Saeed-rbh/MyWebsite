import React, { useState, useMemo } from "react";
import { animated, useSpring, easings } from "react-spring";
import { calculateBackgroundImage, ImageDiv, ContentDiv } from "./Components";
import { useUtilize } from "../../Styles/useUtilize";
import myImage from "../../../../src/Image/AcademicImg.jpeg";

export const Affiliation = () => {
  const componentName = "Affiliation";
  const { name, size, title, padding, rand, isActive, ParentRef } =
    useUtilize(componentName);

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
    top: "-5px",
    width: 280,
    left: `${100 + 40}px`,
    height: 100,
    padding: 15,
    easing: easings.easeOutCubic,
  });

  const animatedImgDiv = useSpring({
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    display: "flex",
    borderRadius: "40px",
    top: "-5px",
    height: 100,
    padding: 15,
    width: 100,
    minWidth: 100,
    left: "0%",
    easing: easings.easeOutCubic,
  });

  const styles = {
    borderRadius: "40px",
    height: "90px",
    top: "260px",
    cursor: "pointer",
    filter: "blur(0px)",
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    overflow: "visible",
    width: "440px",
    padding: "20px 20px 18px",
    zIndex: 10,
    backgroundImage: "none",
    transform: "none",
    left: "35px",
  };

  return (
    <animated.div
      ref={ParentRef}
      style={{
        ...styles,
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
      />
    </animated.div>
  );
};

export default Affiliation;
