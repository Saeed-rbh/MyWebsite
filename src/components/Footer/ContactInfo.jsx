import React, { useRef, useState } from "react";
import { animated } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import FooterHoverIcon from "./FooterHoverIcon";

const ContactInfo = ({
  isMouseHover,
  setMouseHover,
  contactInfoOpenSpring,
  onBookCall,
}) => {
  const Ref_1 = useRef(null);
  const Style_1 = useHoverMoveEffect(Ref_1, 50, 0.2);

  const Ref_2 = useRef(null);
  const Style_2 = useHoverMoveEffect(Ref_2, 50, 0.2);
  const [isHoveredLinkedIn, setIsHoveredLinkedIn] = useState(false);

  return (
    <div className="contact-1">
      <div className="social">
        <animated.a
          href="https://www.linkedin.com/in/saeedarabha/"
          target="_blank"
          rel="noreferrer"
          ref={Ref_1}
          style={{ ...Style_1, display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={() => {
            setIsHoveredLinkedIn(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
          onMouseLeave={() => {
            setIsHoveredLinkedIn(false);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
          onFocus={() => setIsHoveredLinkedIn(true)}
          onBlur={() => setIsHoveredLinkedIn(false)}
        >
          <FooterHoverIcon kind="linkedin" isHovered={isHoveredLinkedIn} />
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "WA"
                ? contactInfoOpenSpring
                : {}
            }
          >
            LINKEDIN
          </animated.p>
        </animated.a>
        <animated.button
          type="button"
          onClick={onBookCall}
          ref={Ref_2}
          className="bookCallBtn"
          style={{
            ...Style_2,
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={() => {
            setMouseHover([!isMouseHover[0], "CONTACT", "E"]);
          }}
          onMouseLeave={() => {
            setMouseHover([!isMouseHover[0], "CONTACT", "E"]);
          }}
        >
          <animated.p
            style={
              isMouseHover[1] === "CONTACT" && isMouseHover[2] === "E"
                ? contactInfoOpenSpring
                : {}
            }
          >
            BOOK A CALL
          </animated.p>
        </animated.button>
      </div>
    </div>
  );
};

export default ContactInfo;
