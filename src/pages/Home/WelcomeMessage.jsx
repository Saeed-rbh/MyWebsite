import React from "react";
import { useSpring, animated, easings } from "react-spring";

const getGradientColor = (index, length) => {
  const startColor = { r: 239, g: 239, b: 239, a: 0.11 };
  const endColor = { r: 218, g: 127, b: 81, a: 0.15 };
  const ratio = index / (length - 1);
  const r = Math.floor(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.floor(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.floor(startColor.b + (endColor.b - startColor.b) * ratio);
  const a = (startColor.a + (endColor.a - startColor.a) * ratio).toFixed(2);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const AnimatedLetter = ({ char, MenuHide, delay, color }) => {
  const springProps = useSpring({
    transform:
      MenuHide === 1
        ? "translateX(0px)"
        : MenuHide === 2
          ? "translateX(20px)"
          : "translateX(-20px)",
    opacity: MenuHide === 1 ? 1 : 0,
    easing: easings.easeOutCubic,
    delay: delay,
    duration: 1500,
  });

  return (
    <animated.span style={{ ...springProps, color }}>{char}</animated.span>
  );
};

import styles from "./WelcomeMessage.module.css";

const WelcomeMessage = ({ MenuHide, delay }) => {
  const message = "Hello.";
  const length = message.length;

  return (
    <div className={styles.welcome}>
      {message.split("").map((char, index) => (
        <AnimatedLetter
          key={index}
          char={char}
          MenuHide={MenuHide}
          delay={delay + 200 + index * 100}
          color={getGradientColor(index, length)}
        />
      ))}
    </div>
  );
};

export default WelcomeMessage;
