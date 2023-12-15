// Affiliation.js
import React from "react";
import { animated } from "react-spring";
import { ExternalLink } from "./ExternalLink";
import { useAnimatedStyle } from "./useAnimatedStyle"; // Import the custom hook for animated styles

export const Affiliation = ({ style }) => {
  const animatedStyle = useAnimatedStyle(style);
  return (
    <animated.div className="Affiliation" style={animatedStyle}>
      <animated.p>Affiliation</animated.p>
      <h1>
        PhD,{" "}
        <ExternalLink href="https://www.picssl.ca/">PICSSL Lab</ExternalLink>
      </h1>
      <h1>Lassonde School of Engineering</h1>
      <h1>
        <ExternalLink href="https://www.yorku.ca/">
          York University
        </ExternalLink>{" "}
        Toronto, Canada
      </h1>
    </animated.div>
  );
};

export default Affiliation;
