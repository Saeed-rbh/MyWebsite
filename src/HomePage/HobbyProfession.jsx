import React from "react";
import { useSpring, animated } from "react-spring";
import AnimationConstants from "./AnimationConstants";

const HobbyProfession = ({ MenuHide, delay }) => {
  const springProps = useSpring(AnimationConstants(MenuHide, delay));
  return (
    <animated.div style={springProps} className="fav">
      <div className="pro">
        <p>MASTER IN</p>
        <p>Mechanical Engineering</p>
      </div>
      <div className="pro">
        <p>HOBBY</p>
        <p>Coding - Watching Movies</p>
      </div>
    </animated.div>
  );
};
export default HobbyProfession;
