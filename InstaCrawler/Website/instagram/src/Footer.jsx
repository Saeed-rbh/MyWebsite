import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";
import { motion } from "framer-motion";

const Footer = ({ isMenuOpen, updateMenu }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [resumeClicked, setResumeClicked] = useState(
    window.location.pathname === "/AcademicCV"
  );
  const [isMouseHover, setMouseHover] = useState([false, NaN, NaN]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    const handleUrlChange = () => {
      const url = window.location.pathname;
      setResumeClicked(url === "/AcademicCV");
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleUrlChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);

  const handleButtonClick = (value) => {
    updateMenu(value);
  };

  const handleClickCV = () => {
    handleButtonClick(false);
    setResumeClicked(true);
  };

  const contactInfoOpenSpring = useSpring({
    transform: isMenuOpen ? "translate3d(0,-10px,0)" : "translate3d(0,0px,0)",
    config: {
      duration: 400,
    },
  });

  const resumeInfoOpenSpring = useSpring({
    opacity: resumeClicked ? "0" : "1",
    width: "50px",
    transform: !resumeClicked
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

  const downloadInfoOpenSpring = useSpring({
    opacity: !resumeClicked ? "0" : "1",
    width: "50px",
    transform: !resumeClicked
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="HomePage-M-T-F"
    >
      <animated.div style={contactInfoOpenSpring} className="HomeConsole">
        <div className="contact-1">
          <animated.p
            className="Social-Media"
            style={
              isMouseHover[1] === "CONTACT"
                ? contactInfoOpenSpring
                : objectStyle
            }
          >
            CONTACT ME
          </animated.p>
          <div className="social">
            <a href="https://wa.me/14168365851">
              <animated.p
                style={
                  isMouseHover[1] === "CONTACT" && isMouseHover[2] === "WA"
                    ? contactInfoOpenSpring
                    : objectStyle
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
            <a href="mailto: SaeedArabha@outlook.com">
              <animated.p
                style={
                  isMouseHover[1] === "CONTACT" && isMouseHover[2] === "E"
                    ? contactInfoOpenSpring
                    : objectStyle
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
                    : objectStyle
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
                    : objectStyle
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
        <div
          className="b-hr"
          style={{ display: screenWidth < 1120 ? "none" : "flex" }}
        ></div>
        <animated.div className="resumee" style={resumeInfoOpenSpring}>
          <p1 className="Social-Media">
            <animated.p
            // style={
            //   isMouseHover[1] === "RESUMEE"
            //     ? contactInfoOpenSpring
            //     : objectStyle
            // }
            >
              MY RESUME
            </animated.p>
          </p1>
          <animated.div
            className="social"
            // style={
            //   isMouseHover[1] === "RESUMEE"
            //     ? contactInfoOpenSpring
            //     : objectStyle
            // }
          >
            <Link
              onClick={handleClickCV}
              to="/AcademicCV"
              onMouseEnter={() =>
                setMouseHover([!isMouseHover[0], "RESUMEE", "AB"])
              }
              onMouseLeave={() =>
                setMouseHover([!isMouseHover[0], "RESUMEE", "AB"])
              }
            >
              ACADEMIC BACKGROUND
            </Link>
          </animated.div>
        </animated.div>
        <animated.div className="resumee" style={downloadInfoOpenSpring}>
          <animated.div
            className="social"
            // style={
            //   isMouseHover[1] === "RESUMEE"
            //     ? contactInfoOpenSpring
            //     : objectStyle
            // }
          >
            <RiDownloadCloud2Line className="DownloadSvg" />
            <a
              href="https://www.instagram.com/saeed_rbh"
              onMouseEnter={() =>
                setMouseHover([!isMouseHover[0], "RESUMEE", "AB"])
              }
              onMouseLeave={() =>
                setMouseHover([!isMouseHover[0], "RESUMEE", "AB"])
              }
            >
              Download PDF Version
            </a>
          </animated.div>
        </animated.div>
      </animated.div>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    isMenuOpen: state.menu.isMenuOpen,
  };
};

export default connect(mapStateToProps, { updateMenu })(Footer);
