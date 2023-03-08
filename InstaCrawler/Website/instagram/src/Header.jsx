import "./HomePage.css";
import HomePage from "./HomePage";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const Header = () => {
  function MenuIcon() {
    const [MenuClicked, setMenuClicked] = useState(false);
    const [MenuHover, setMenuHover] = useState(false);
    const [OnMouseH, setOnMouseH] = useState([false, NaN, NaN]);
    const ChangeSizeT = useSpring({
      width: !MenuClicked ? (!MenuHover ? "30px" : "15px") : "15px",
      transform: MenuClicked
        ? "translateY(6.5px) rotate(45deg)"
        : "translateY(0px) rotate(0deg)",
      height: !MenuClicked ? "2px" : "3px",
    });
    const ChangeSizeB = useSpring({
      width: !MenuClicked ? (MenuHover ? "30px" : "15px") : "15px",
      transform: MenuClicked
        ? "translateY(-6.5px) rotate(-45deg)"
        : "translateY(0px) rotate(0deg)",
      height: !MenuClicked ? "2px" : "3px",
    });
    const MenuOpen = useSpring({
      opacity: !MenuClicked ? "0" : "0.9",
      config: {
        duration: 500,
      },
    });
    const ContactInfoOpen1 = useSpring({
      transform: !MenuClicked
        ? "translate3d(0,20px,0)"
        : "translate3d(0,0px,0)",
      opacity: !MenuClicked ? "0" : "1",
    });
    const ContactInfoOpen2 = useSpring({
      transform: !MenuClicked
        ? "translate3d(0,20px,0)"
        : "translate3d(0,0px,0)",
      opacity: !MenuClicked ? "0" : "1",
    });
    const ContactInfoOpen3 = useSpring({
      transform: !MenuClicked
        ? "translate3d(0,10px,0)"
        : "translate3d(0,0px,0)",
      opacity: !MenuClicked ? "0" : "1",
      config: {
        duration: 200,
        delay: 100,
      },
    });
    const ContactInfoOpen4 = useSpring({
      transform: MenuClicked ? "translate3d(0,10px,0)" : "translate3d(0,0px,0)",
      config: {
        duration: 400,
      },
    });
    const ContactInfoOpen5 = useSpring({
      transform: MenuClicked
        ? "translate3d(0,-10px,0)"
        : "translate3d(0,0px,0)",
      config: {
        duration: 400,
      },
    });
    const ContactInfoOpen7 = useSpring({
      transform: !OnMouseH[0] ? "scale(1)" : "scale(1.05)",
      opacity: !OnMouseH[0] ? "0.8" : "1",
    });
    const objectStyle = {};

    return (
      <div
        className="HomeAround"
        style={{ backdropFilter: MenuClicked ? "blur(10px)" : "blur(0px)" }}
      >
        <animated.div className="MenuInsideN" style={MenuOpen}>
          <animated.div className="ContactInfo" style={ContactInfoOpen1}>
            Contact Information
          </animated.div>
          <div className="ContactInfos">
            <animated.a
              className="ContactInfo-In"
              style={ContactInfoOpen2}
              href="tel:+14168365851"
            >
              <p1>Phone Call</p1>
              <animated.b style={ContactInfoOpen3}>
                <span>CA Cell:</span>+1 &nbsp;(416) 836 5851
              </animated.b>
              <animated.b style={ContactInfoOpen3}>
                <span>IR Cell:</span>+98 (919) 659 5351
              </animated.b>
            </animated.a>
            <animated.a
              style={ContactInfoOpen2}
              className="ContactInfo-In"
              href="mailto: SaeedArabha@outlook.com, Arabha@Yorku.ca"
            >
              <p1>Email</p1>
              <animated.b style={ContactInfoOpen3}>
                Saeedarabha@outlook.com
              </animated.b>
              <animated.b style={ContactInfoOpen3}>Arabha@Yorku.ca</animated.b>
            </animated.a>
            <animated.a
              style={ContactInfoOpen2}
              className="ContactInfo-In"
              href="https://www.instagram.com/saeed_rbh"
            >
              <p1>Social Media</p1>
              <animated.b style={ContactInfoOpen3}>@saeed_rbh</animated.b>
            </animated.a>
            <animated.a
              style={ContactInfoOpen2}
              className="ContactInfo-In"
              href="https://www.researchgate.net/profile/Saeed-Arabha"
            >
              <p1>Research Gate</p1>
              <animated.b style={ContactInfoOpen3}>Saeed Arabha</animated.b>
            </animated.a>
          </div>
        </animated.div>
        <div className="MainHeader">
          <Link
            to="/"
            className="HomePage-M-T-L"
            path="/"
            element={<HomePage />}
          >
            <animated.p style={ContactInfoOpen4}>Saeed</animated.p>
            <animated.b style={ContactInfoOpen4}>Arabha</animated.b>
          </Link>
          <animated.div
            style={ContactInfoOpen4}
            className="HomePage-M-T-R"
            onClick={() => setMenuClicked(!MenuClicked)}
            onMouseEnter={() => setMenuHover(!MenuHover)}
            onMouseLeave={() => setMenuHover(!MenuHover)}
          >
            <animated.div
              className="MenuIcon-T"
              style={ChangeSizeT}
            ></animated.div>
            <animated.div
              className="MenuIcon-B"
              style={ChangeSizeB}
            ></animated.div>
          </animated.div>
        </div>
        <animated.div style={ContactInfoOpen5} className="HomeConsole">
          <div className="contact-1">
            <animated.p
              className="Social-Media"
              style={OnMouseH[1] === "CONTACT" ? ContactInfoOpen7 : objectStyle}
            >
              CONTACT ME
            </animated.p>
            <div className="social">
              <a href="https://wa.me/14168365851">
                <animated.p
                  style={
                    OnMouseH[1] === "CONTACT" && OnMouseH[2] === "WA"
                      ? ContactInfoOpen7
                      : objectStyle
                  }
                  onMouseEnter={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "WA"])
                  }
                  onMouseLeave={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "WA"])
                  }
                >
                  WHATSAPP
                </animated.p>
              </a>
              <a href="mailto: SaeedArabha@outlook.com">
                <animated.p
                  style={
                    OnMouseH[1] === "CONTACT" && OnMouseH[2] === "E"
                      ? ContactInfoOpen7
                      : objectStyle
                  }
                  onMouseEnter={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "E"])
                  }
                  onMouseLeave={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "E"])
                  }
                >
                  E-MAIL
                </animated.p>
              </a>
              <a href="https://www.researchgate.net/profile/Saeed-Arabha">
                <animated.p
                  style={
                    OnMouseH[1] === "CONTACT" && OnMouseH[2] === "RG"
                      ? ContactInfoOpen7
                      : objectStyle
                  }
                  onMouseEnter={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "RG"])
                  }
                  onMouseLeave={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "RG"])
                  }
                >
                  ResearchGate
                </animated.p>
              </a>
              <a href="https://www.instagram.com/saeed_rbh">
                <animated.p
                  style={
                    OnMouseH[1] === "CONTACT" && OnMouseH[2] === "I"
                      ? ContactInfoOpen7
                      : objectStyle
                  }
                  onMouseEnter={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "I"])
                  }
                  onMouseLeave={() =>
                    setOnMouseH([!OnMouseH[0], "CONTACT", "I"])
                  }
                >
                  INSTAGRAM
                </animated.p>
              </a>
            </div>
          </div>
          <div className="b-hr"></div>
          <div className="resumee">
            <p1 class="Social-Media">
              <animated.p
                style={
                  OnMouseH[1] === "RESUMEE" ? ContactInfoOpen7 : objectStyle
                }
              >
                MY RESUMEE
              </animated.p>
            </p1>
            <animated.div
              className="social"
              style={OnMouseH[1] === "RESUMEE" ? ContactInfoOpen7 : objectStyle}
            >
              <Link
                to="/AcademicCV"
                onMouseEnter={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
                onMouseLeave={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
              >
                ACADEMIC BACKGROUND
              </Link>
            </animated.div>
          </div>
        </animated.div>
      </div>
    );
  }

  return (
    <div className="HomePage-M-T">
      <MenuIcon />
    </div>
  );
};
export default Header;
