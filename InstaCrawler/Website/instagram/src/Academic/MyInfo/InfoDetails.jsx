// InfoDetails.jsx
import React from "react";
import { animated } from "react-spring";
import { ExternalLink } from "./ExternalLink";
import { ContactInfo } from "./ContactInfo";
import { useAnimatedStyle } from "./useAnimatedStyle"; // Custom hook for animated styles
import BirthdayLink from "../BirthdayLink"; // Importing the BirthdayLink component

export const InfoDetails = ({ style }) => {
  // Apply the custom hook to get animated styles
  const animatedStyle = useAnimatedStyle(style);

  return (
    <animated.div className="InfoDetails" style={animatedStyle}>
      <animated.p>Personal Info</animated.p>
      <div>
        <h1>
          Name:{" "}
          <ExternalLink href="https://www.example.com/">
            Saeed Arabha
          </ExternalLink>
        </h1>
        <BirthdayLink />
      </div>
      <div>
        <ContactInfo label="CA Cell" phone="+14168365851" />
        <ContactInfo label="IR Cell" phone="+989196595351" />
      </div>
    </animated.div>
  );
};

export default InfoDetails;
