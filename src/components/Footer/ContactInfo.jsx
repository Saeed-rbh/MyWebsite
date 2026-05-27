import React, { useRef, useState } from "react";
import { animated } from "react-spring";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import { PopupModal } from "react-calendly";

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
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <div className="contact-1">
      <PopupModal
        url="https://calendly.com/arabha-yorku/30min"
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")}
        pageSettings={{
          backgroundColor: '020201',
          textColor: 'faf9f1',
          primaryColor: 'd49d81'
        }}
      />
      <animated.p
        className="Social-Media"
        style={isMouseHover[1] === "CONTACT" ? contactInfoOpenSpring : {}}
      >
        CONTACT ME
      </animated.p>
      <div className="social">
        <animated.a
          href="https://www.linkedin.com/in/saeedarabha/"
          target="_blank"
          rel="noreferrer"
          ref={Ref_1}
          style={{ ...Style_1, display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => {
            setHoverWA(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
          onMouseLeave={() => {
            setHoverWA(false);
            setMouseHover([!isMouseHover[0], "CONTACT", "WA"]);
          }}
        >
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
          onClick={(e) => { e.preventDefault(); setIsCalendlyOpen(true); }}
          ref={Ref_2}
          style={{ ...Style_2, display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={() => {
            setHoverE(true);
            setMouseHover([!isMouseHover[0], "CONTACT", "E"]);
          }}
          onMouseLeave={() => {
            setHoverE(false);
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
