import React from "react";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";

import styles from "./NameMessage.module.css";

const NameMessage = ({ MenuHide, delay }) => {
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  return (
    <animated.b style={springProps} className={styles.nameContainer}>
      I'm Saeed Arabha
      <animated.div style={springProps} className={styles.separator}></animated.div>
    </animated.b>
  );
};

export default NameMessage;
