import React, { useState, useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";

const AnimatedWord = ({
  word,
  index,
  animateFrom,
  animateTo,
  MenuHide,
  length,
  onClick,
}) => {
  const isSpecialWord = word.startsWith("<") && word.endsWith(">");
  let displayWord = isSpecialWord ? word.slice(1, -1) : word;
  if (isSpecialWord) {
    displayWord = displayWord.replace(/-/g, " ");
  }

  const [bgWidth, setBgWidth] = useState("0px");
  useEffect(() => {
    if (MenuHide === 1) {
      const timer = setTimeout(
        () => setBgWidth(`${displayWord.length * 10}px`),
        index * 30
      );
      return () => clearTimeout(timer);
    } else {
      setBgWidth(`${0}px`);
    }
  }, [MenuHide, index, displayWord]);
  const wordSpring = useSpring({
    from: {
      color: animateFrom,
      transform: MenuHide === 1 ? "translateY(5px)" : "translateY(0px)",
      opacity: MenuHide === 1 ? 0 : 1,
    },
    to: {
      color: animateTo,
      transform:
        MenuHide === 1
          ? "translateY(0px)"
          : MenuHide === 2
            ? "translateY(-5px)"
            : "translateY(5px)",
      opacity: MenuHide === 1 ? 1 : 0,
    },
    easing: easings.easeOutCubic,
    delay: MenuHide === 1 ? index * 25 : (length - index) * 25,
  });
  const specialBackground = {
    position: "relative",
    padding: "0 10px 2px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };
  const innerBackground = {
    width: bgWidth,
    height: "100%",
    position: "absolute",
    left: "0",
    borderRadius: "20px",
    background:
      "linear-gradient(to right, rgb(255 255 255 / 14%) 0%, rgb(245 159 115 / 18%) 100%)",
    transition: "width 1s ease-in-out",
  };
  const textStyle = {
    verticalAlign: "middle",
    display: "inline-block",
  };
  return (
    <>
      {isSpecialWord ? (
        <div
          style={{ ...specialBackground, cursor: "pointer" }}
          onClick={(e) => onClick && onClick(displayWord, e)}
        >
          <div style={innerBackground}></div>
          <animated.span style={{ ...wordSpring, ...textStyle }}>
            {displayWord}
          </animated.span>
        </div>
      ) : (
        <animated.span style={{ ...wordSpring, ...textStyle }}>
          {displayWord}
        </animated.span>
      )}{" "}
    </>
  );
};

export default AnimatedWord;
