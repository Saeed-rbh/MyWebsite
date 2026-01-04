import React from "react";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";
import { useSelector } from "react-redux";

import styles from "./HobbyProfession.module.css";

const HobbyProfession = ({ MenuHide, delay }) => {
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  const { academicData } = useSelector((state) => state.data);

  const homeSection = academicData.find(s => s.name === 'Home');
  const homeData = homeSection?.list?.[0] || {};

  return (
    <animated.div style={springProps} className={styles.fav}>
      <div className={styles.pro}>
        <p>{homeData.degreeLabel || "MASTER IN"}</p>
        <p>{homeData.degree || "Mechanical Engineering"}</p>
      </div>
      <div className={styles.pro}>
        <p>{homeData.hobbyLabel || "HOBBY"}</p>
        <p>{homeData.hobby || "Coding - Watching Movies"}</p>
      </div>
    </animated.div>
  );
};
export default HobbyProfession;
