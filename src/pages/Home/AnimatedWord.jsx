import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated, easings } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import styles from "./AnimatedWord.module.css";

const AnimatedWord = ({
  word,
  index,
  animateFrom,
  animateTo,
  MenuHide,
  length,
  onClick,
}) => {
  let isSpecialWord = false;
  let displayWord = word;
  let punctuation = "";

  if (word.startsWith("<") || word.startsWith("$(")) {
    const match = word.match(/^([<$].*?>|\$\([^)]+\))(.*)$/);
    if (match) {
      isSpecialWord = true;
      const tagContent = match[1];
      punctuation = match[2];

      if (tagContent.startsWith("<") && tagContent.endsWith(">")) {
        displayWord = tagContent.slice(1, -1).replace(/-/g, " ");
      } else if (tagContent.startsWith("$(") && tagContent.endsWith(")")) {
        displayWord = tagContent.slice(2, -1);
      }
    }
  }

  const hoverRef = useRef(null);
  const hoverStyle = useHoverMoveEffect(hoverRef, 15, 0.25);

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
  const textStyle = {
    verticalAlign: "middle",
    display: "inline-block",
  };
  return (
    <>
      {isSpecialWord ? (
        <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          <animated.div
            ref={hoverRef}
            className={styles.specialBackground}
            style={{ ...hoverStyle }}
            onClick={(e) => onClick && onClick(displayWord, e)}
          >
            <div className={styles.innerBackground} style={{ width: bgWidth }}></div>
            <animated.span
              className={styles.specialWordText}
              style={{ ...wordSpring, ...textStyle }}
            >
              {displayWord}
            </animated.span>
          </animated.div>
          {punctuation && (
            <animated.span style={{ ...wordSpring, ...textStyle, verticalAlign: "middle" }}>
              {punctuation}
            </animated.span>
          )}
        </span>
      ) : (
        <animated.span style={{ ...wordSpring, ...textStyle }}>
          {displayWord}
        </animated.span>
      )}{" "}
    </>
  );
};

export default AnimatedWord;
