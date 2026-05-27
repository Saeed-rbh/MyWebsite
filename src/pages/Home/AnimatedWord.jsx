import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSpring, animated, easings } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";

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

  const hoverRef = useRef(null);
  const hoverStyle = useHoverMoveEffect(hoverRef, 15, 0.25);
  const [isHovered, setIsHovered] = useState(false);

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
    padding: "0px 10px 2px",
    borderRadius: "20px",
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    borderBottom: isHovered
      ? "2px solid rgba(212, 157, 129, 0.65)"
      : "2px solid rgba(212, 157, 129, 0.31)",
    boxShadow: isHovered
      ? "0 0 18px rgba(212, 157, 129, 0.32), 0 4px 12px rgba(212, 157, 129, 0.18)"
      : "rgba(212, 157, 129, 0) 0px 4px 6px -4px",
    transform: isHovered ? "scale(1.035)" : "scale(1)",
    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
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
        <animated.div
          ref={hoverRef}
          style={{ ...specialBackground, cursor: "pointer", ...hoverStyle }}
          onClick={(e) => onClick && onClick(displayWord, e)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={innerBackground}></div>
          <animated.span style={{ ...wordSpring, ...textStyle }}>
            {displayWord}
          </animated.span>
        </animated.div>
      ) : (
        <animated.span style={{ ...wordSpring, ...textStyle }}>
          {displayWord}
        </animated.span>
      )}{" "}
    </>
  );
};

export default AnimatedWord;
