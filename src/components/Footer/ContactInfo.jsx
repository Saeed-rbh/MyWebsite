import React, { useRef, useState } from "react";
import { animated } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import WhatsAppIcon from "./WhatsAppIcon";
import EmailIcon from "./EmailIcon";
import ResearchGateIcon from "./ResearchGateIcon";

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

  const [hoverWA, setHoverWA] = useState(false);
  const [hoverE, setHoverE] = useState(false);
  const [hoverRG, setHoverRG] = useState(false);

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
          style={{ ...Style_1, display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={() => {
            setHoverWA(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
          onMouseLeave={() => {
            setHoverWA(false);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
        >
          <WhatsAppIcon isHovered={hoverWA} />
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "WA"
                ? contactInfoOpenSpring
                : {}
            }
          >
            WHATSAPP
          </animated.p>
        </animated.a>
        <animated.a
          href="mailto:SaeedArabha@outlook.com"
          ref={Ref_2}
          style={{ ...Style_2, display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={() => {
            setHoverE(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "E"]);
          }}
          onMouseLeave={() => {
            setHoverE(false);
            setMouseHover([!isMouseHover[0], "CONTACT", "E"]);
          }}
        >
          <EmailIcon isHovered={hoverE} />
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "E"
                ? contactInfoOpenSpring
                : {}
            }
          >
            E-MAIL
          </animated.p>
        </animated.a>
        <animated.a
          href="https://www.researchgate.net/profile/Saeed-Arabha"
          ref={Ref_3}
          style={{ ...Style_3, display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={() => {
            setHoverRG(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "RG"]);
          }}
          onMouseLeave={() => {
            setHoverRG(false);
            setMouseHover([!isMouseHover[0], "CONTACT", "RG"]);
          }}
        >
          <ResearchGateIcon isHovered={hoverRG} />
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "RG"
                ? contactInfoOpenSpring
                : {}
            }
          >
            ResearchGate
          </animated.p>
        </animated.a>
      </div>
    </div>
  );
};

export default ContactInfo;
