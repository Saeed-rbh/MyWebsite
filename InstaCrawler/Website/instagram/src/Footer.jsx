import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";

const Footer = ({ isMenuOpen, updateMenu }) => {
  // Redux For Menu Open
  function MenuIcon() {
    const handleButtonClick = (value) => {
      updateMenu(value); // Dispatch the updateMenu action with the provided value
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
    const [currentUrl, setCurrentUrl] = useState(window.location.pathname);
    const [ResumeClicked, setResumeClicked] = useState(() => {
      if (window.location.pathname === "/AcademicCV") {
        return true;
      } else {
        return false;
      }
    });
    useEffect(() => {
      const handleUrlChange = () => {
        const url = window.location.pathname;
        setCurrentUrl(url);
        setResumeClicked(url === "/AcademicCV");
      };
      window.addEventListener("click", handleUrlChange);
      return () => {
        window.removeEventListener("click", handleUrlChange);
      };
    }, [currentUrl]);
    const handleClickCV = () => {
      handleButtonClick(false);
      setResumeClicked(true);
    };
    const [OnMouseH, setOnMouseH] = useState([false, NaN, NaN]);
    const ContactInfoOpen5 = useSpring({
      transform: isMenuOpen ? "translate3d(0,-10px,0)" : "translate3d(0,0px,0)",
      config: {
        duration: 400,
      },
    });
    const ContactInfoOpen7 = useSpring({
      // transform: !OnMouseH[0] ? "scale(1)" : "scale(1.005)",
      // opacity: !OnMouseH[0] ? "0.8" : "1",
    });
    const ContactInfoOpen8 = useSpring({
      opacity: ResumeClicked ? "0" : "1",
      width: "50px",
      transform: !ResumeClicked
        ? screenWidth < 1120
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, 0, 0)"
        : screenWidth < 1120
        ? "translate3d(0, 25px, 0)"
        : "translate3d(0, 25px, 0)",
      config: {
        duration: 300,
        tension: 280,
        friction: 120,
      },
    });
    const ContactInfoOpen9 = useSpring({
      opacity: !ResumeClicked ? "0" : "1",
      width: "50px",
      transform: !ResumeClicked
        ? "translate3d(0,-25px,0) scale(1.2)"
        : "translate3d(0,0px,0) scale(1.2)",
      flex: "0",
      fontSize: "15px",
      config: {
        duration: 400,
        tension: 280,
        friction: 120,
      },
    });
    const objectStyle = {};
    return (
      <div
        className="HomePage-M-T-F"
        style={{
          zIndex: isMenuOpen ? "10" : "10",
        }}
      >
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
          <div
            className="b-hr"
            style={{ display: screenWidth < 1120 ? "none" : "flex" }}
          ></div>
          <animated.div className="resumee" style={ContactInfoOpen8}>
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
                onClick={handleClickCV}
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
          </animated.div>
          <animated.div className="resumee" style={ContactInfoOpen9}>
            <animated.div
              className="social"
              style={OnMouseH[1] === "RESUMEE" ? ContactInfoOpen7 : objectStyle}
            >
              <RiDownloadCloud2Line className="DownloadSvg" />
              <a
                href="https://www.instagram.com/saeed_rbh"
                onMouseEnter={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
                onMouseLeave={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
              >
                Download Pdf Version
              </a>
            </animated.div>
          </animated.div>
        </animated.div>
      </div>
    );
  }

  return <MenuIcon />;
};

const mapStateToProps = (state) => {
  return {
    isMenuOpen: state.menu.isMenuOpen,
  };
};

export default connect(mapStateToProps, { updateMenu })(Footer);
