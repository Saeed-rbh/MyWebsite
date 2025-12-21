import React, { useRef } from "react";
import { animated } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";

const ContactInfo = ({
  isMouseHover,
  setMouseHover,
  contactInfoOpenSpring,
}) => {
  const Ref_1 = useRef(null);
  const Style_1 = useHoverMoveEffect(Ref_1, 50, 0.2);

  const Ref_2 = useRef(null);
  const Style_2 = useHoverMoveEffect(Ref_2, 50, 0.2);

  const Ref_3 = useRef(null);
  const Style_3 = useHoverMoveEffect(Ref_3, 50, 0.2);

  const Ref_4 = useRef(null);
  const Style_4 = useHoverMoveEffect(Ref_4, 50, 0.2);

  return (
    <div className="contact-1">
      <animated.p
        className="Social-Media"
        style={isMouseHover[1] === "CONTACT" ? contactInfoOpenSpring : {}}
      >
        CONTACT ME
      </animated.p>
      <div className="social">
        <animated.a
          href="https://wa.me/14168365851"
          ref={Ref_1}
          style={Style_1}
        >
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
        </animated.a>
        <animated.a
          href="mailto:SaeedArabha@outlook.com"
          ref={Ref_2}
          style={Style_2}
        >
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
        </animated.a>
        <animated.a
          href="https://www.researchgate.net/profile/Saeed-Arabha"
          ref={Ref_3}
          style={Style_3}
        >
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
        </animated.a>
        <animated.a
          href="https://www.instagram.com/saeed_rbh"
          ref={Ref_4}
          style={Style_4}
        >
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
        </animated.a>
      </div>
    </div>
  );
};

export default ContactInfo;
