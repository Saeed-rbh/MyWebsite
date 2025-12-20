import React, { useEffect, useState } from "react";
import { easings, useSprings, animated } from "react-spring";
import GradientColor from "./GradientColor";
import useMouseMove from "./useMouseMove";

const DELAY_MULTIPLIER = 50;
const DURATION = 300;
const FADE_IN_DOWN = "fadeInDown";
const FADE_OUT_UP = "fadeOutUp";
const CHANGE_X = "changeX";

const computeNewValues = (index, phase, charLength) => {
  const commonConfig = { duration: DURATION };
  const delay = ((4 * DELAY_MULTIPLIER) / charLength) * index;

  switch (phase) {
    case FADE_IN_DOWN:
      return { y: "40px", opacity: 0, config: commonConfig };
    case FADE_OUT_UP:
      return {
        y: "-40px",
        opacity: 0,
        config: commonConfig,
        delay: 100 + delay,
      };
    case CHANGE_X:
      return { y: "40px", opacity: 0, config: { duration: 0 }, delay: 500 };
    default:
      return {
        y: "0px",
        opacity: 0.9,
        config: commonConfig,
        delay: 400 + delay,
      };
  }
};

const MainText = ({ caption, phase }) => {
  const [characters, setCharacters] = useState([]);
  const springProps = useMouseMove(30);

  const [springs, setSprings] = useSprings(characters.length, (index) => {
    const delay = ((4 * DELAY_MULTIPLIER) / characters.length) * index;
    return { y: "40px", opacity: 0, config: { delay } };
  });

  useEffect(() => {
    if (caption) {
      setCharacters(caption.split(""));
    }
  }, [caption]);

  useEffect(() => {
    if (characters.length === 0) return;
    const updateSprings = (index) => {
      const config = computeNewValues(index, phase, characters.length);
      return {
        ...config,
        color: GradientColor(index, characters.length),
        easing: easings.easeOutCubic,
      };
    };
    setSprings(updateSprings);
  }, [phase, characters.length, setSprings]);

  return (
    <animated.p style={springProps}>
      {springs.map((props, index) => (
        <animated.span style={props} key={index}>
          {characters[index]}
        </animated.span>
      ))}
    </animated.p>
  );
};

export default MainText;
