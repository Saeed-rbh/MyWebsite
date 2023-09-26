import React from "react";
import { animated } from "react-spring";

const ContactInfo = ({
  isMouseHover,
  setMouseHover,
  contactInfoOpenSpring,
}) => {
  return (
    <div className="contact-1">
      <animated.p
        className="Social-Media"
        style={isMouseHover[1] === "CONTACT" ? contactInfoOpenSpring : {}}
      >
        CONTACT ME
      </animated.p>
      <div className="social">
        <a href="https://wa.me/14168365851">
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "WA"
                ? contactInfoOpenSpring
                : {}
            }
            onMouseEnter={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "WA"])
            }
            onMouseLeave={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "WA"])
            }
          >
            WHATSAPP
          </animated.p>
        </a>
        <a href="mailto:SaeedArabha@outlook.com">
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "E"
                ? contactInfoOpenSpring
                : {}
            }
            onMouseEnter={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "E"])
            }
            onMouseLeave={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "E"])
            }
          >
            E-MAIL
          </animated.p>
        </a>
        <a href="https://www.researchgate.net/profile/Saeed-Arabha">
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "RG"
                ? contactInfoOpenSpring
                : {}
            }
            onMouseEnter={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "RG"])
            }
            onMouseLeave={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "RG"])
            }
          >
            ResearchGate
          </animated.p>
        </a>
        <a href="https://www.instagram.com/saeed_rbh">
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "I"
                ? contactInfoOpenSpring
                : {}
            }
            onMouseEnter={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "I"])
            }
            onMouseLeave={() =>
              setMouseHover([!isMouseHover[0], "CONTACT", "I"])
            }
          >
            INSTAGRAM
          </animated.p>
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
