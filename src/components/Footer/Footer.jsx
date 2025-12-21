import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

import { useSelector } from "react-redux";
import "../../pages/Home/Home.css";
import ContactInfo from "./ContactInfo";
import ResumeInfo from "./ResumeInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateMenu, updateCurrentPage } from "../../actions/Actions";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isMenuOpen } = useSelector((state) => state.ui);
  const { visibility } = useSelector((state) => state.ui);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [resumeClicked, setResumeClicked] = useState(
    window.location.pathname === "/AcademicCV"
  );
  const [isMouseHover, setMouseHover] = useState([false, null, null]);
  const [disapear, setDisapear] = useState(resumeClicked ? false : true);

  useEffect(() => {
    if (location.pathname === "/") {
      setResumeClicked(false);
    } else {
      setResumeClicked(true);
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   const handleResize = () => setScreenWidth(window.innerWidth);
  //   const handleUrlChange = () =>
  //     setResumeClicked(window.location.pathname === "/AcademicCV");

  //   window.addEventListener("resize", handleResize);
  //   window.addEventListener("click", handleUrlChange);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     window.removeEventListener("click", handleUrlChange);
  //   };
  // }, []);
  const handleButtonClick = (value) => updateMenu(value);
  const handleClickCV = () => {
    dispatch(updateCurrentPage("/AcademicCV"));

    handleButtonClick(false);

    setTimeout(() => {
      navigate("/AcademicCV");
    }, 1000);
    setResumeClicked(true);
  };

  useEffect(() => {
    if (!disapear) {
      setDisapear(true);
    } else if (resumeClicked) {
      setTimeout(() => {
        setDisapear(false);
      }, 1000);
    }
  }, [resumeClicked]);

  const [width, setWidth] = useState(window.innerWidth * 0.9);
  useEffect(() => {
    const updateWidth = () => {
      const calculatedWidth = window.innerWidth * 0.9;
      setWidth(calculatedWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const [isDone, setIsDone] = useState(false);
  const [step, setStep] = useState(0);
  const contactInfoOpenSpring = useSpring({
    from: { opacity: 0, width: "5px", height: "5px", y: 100 },
    to:
      step === 0
        ? { y: 0, opacity: 1 }
        : step === 1
          ? { width: "70px", height: "80px" }
          : step === 2
            ? { width: "60px", height: "60px" }
            : step === 3
              ? {
                opacity: resumeClicked ? 0 : 1,
                width: `${width}px`,
                height: "60px",
                y: isMenuOpen ? -10 : resumeClicked ? 10 : 0,
              }
              : {},
    config:
      step === 0
        ? { tension: 280, friction: 120, duration: 300 }
        : step === 1
          ? { tension: 280, friction: 120, duration: 500 }
          : step === 2
            ? { tension: 280, friction: 120, duration: 500 }
            : step === 3
              ? { tension: 280, friction: 120, duration: isDone ? 300 : 600 }
              : {},
    onRest: () => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        if (!isDone) {
          setIsDone(true);
        }
      }
    },
  });

  useEffect(() => {
    if (step === 0) {
      setStep(1);
    }
  }, [step]);

  const TextOpenSpring = useSpring({
    from: { opacity: !isDone ? 0 : 1, y: !isDone ? 0 : 5 },
    to: {
      opacity: isDone ? 1 : 0,
      y: isDone ? 0 : 5,
      width: width,
      display: "flex",
      height: "-webkit-fill-available",
      alignItems: "center",
      justifyContent: "center",
    },
    config: { tension: 280, friction: 120, duration: 300, delay: 100 },
  });

  return (
    visibility &&
    disapear && (
      <div className="HomePage-M-T-F">
        <animated.div style={contactInfoOpenSpring} className="HomeConsole">
          <animated.div style={TextOpenSpring}>
            <ContactInfo
              isMouseHover={isMouseHover}
              setMouseHover={setMouseHover}
            />
            <div
              className="b-hr-2"
              style={{ display: screenWidth < 1120 ? "none" : "flex" }}
            ></div>
            <ResumeInfo
              handleClickCV={handleClickCV}
              resumeClicked={resumeClicked}
              MenuHide={visibility}
              screenWidth={screenWidth}
            />
          </animated.div>
        </animated.div>
      </div>
    )
  );
};

export default Footer;
