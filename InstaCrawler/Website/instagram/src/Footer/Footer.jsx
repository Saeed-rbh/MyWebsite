import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated, easings } from "react-spring";
import { connect } from "react-redux";
import { updateMenu } from "../Menu/menuActions";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { selectVisibility } from "../visibilitySlice";
import { useSelector } from "react-redux";
import "../HomePage/HomePage.css";
import RotatingSphere from "./RotatingSphere";
import PersonalOptions from "./PersonalOptions";
import OpenIcon from "./OpenIcon";
import useWindowResize from "./useWindowResize";
import ContactInfo from "./ContactInfo";
import ResumeInfo from "./ResumeInfo";
import DownloadInfo from "./DownloadInfo";

const Footer = ({ isMenuOpen, updateMenu }) => {
  const [isCross, setIsCross] = useState(false);
  const [isCrossWindow, setisCrossWindow] = useWindowResize();
  const MenuHide = !useSelector(selectVisibility);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [resumeClicked, setResumeClicked] = useState(
    window.location.pathname === "/AcademicCV"
  );
  const [isMouseHover, setMouseHover] = useState([false, null, null]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    const handleUrlChange = () =>
      setResumeClicked(window.location.pathname === "/AcademicCV");

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleUrlChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);
  const handleButtonClick = (value) => updateMenu(value);
  const handleClickCV = () => {
    handleButtonClick(false);
    setResumeClicked(true);
  };
  ///////////////////////
  const [width, setWidth] = useState(window.innerWidth * 0.9 - 70);
  useEffect(() => {
    const updateWidth = () => {
      const calculatedWidth = window.innerWidth * 0.9 - 70;
      setWidth(calculatedWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const isDone = useRef(false);
  const [step, setStep] = useState(0);
  const contactInfoOpenSpring = useSpring({
    from: { opacity: 0, width: "5px", height: "5px", y: 100 },
    to:
      step === 0
        ? { y: 0, opacity: 1 }
        : step === 1
        ? { width: "70px", height: "70px" }
        : step === 2
        ? { width: "50px", height: "50px" }
        : step === 3
        ? {
            width: `${width}px`,
            height: "50px",
            marginRight: "70px",
            y: isMenuOpen ? -10 : 0,
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
        ? { tension: 280, friction: 120, duration: isDone.current ? 300 : 600 }
        : {},
    onRest: () => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        if (!isDone.current) {
          isDone.current = true;
          setTimeout(() => {
            setIsCross(isCrossWindow);
          }, 500);
        }
      }
    },
  });

  useEffect(() => {
    if (step === 0) {
      setStep(1);
    }
  }, []);

  ///////////////////////
  const crossOpenSpring = useSpring({
    from: {
      opacity: 0,
      width: `${window.innerWidth * 0.15}px`,
      height: "5px",
      y: 20,
      x: width / 2.35,
    },
    to:
      step === 3
        ? {
            opacity: 1,
            x: width / 2.35,
            y: isMenuOpen ? -10 : 0,
            height: "50px",
          }
        : {},
    config:
      step === 3
        ? { tension: 280, friction: 120, duration: isDone.current ? 300 : 600 }
        : {},
    delay: isDone.current ? 0 : 1000,
  });

  const TextOpenSpring = useSpring({
    from: { opacity: isDone.current ? 0 : 1 },
    to: { opacity: isDone.current ? 1 : 0, width: width, display: "flex" },
    config: { tension: 280, friction: 120, duration: 300 },
  });
  //////////////////////////////
  const personalOptionsArray = [
    {
      title: "My World",
      options: ["Captured Moments !"],
      routes: ["/CapturedMoments"],
    },
    {
      title: "Academic Content",
      options: ["What is Graphene ?!"],
      routes: ["/Graphene"],
    },
  ];
  const totalElements = personalOptionsArray.reduce(
    (acc, item) => acc + item.options.length + 1,
    0
  );
  const maxDelay = (totalElements - 1) * 100;
  let globalIndex = 0;
  return (
    MenuHide && (
      <div className="HomePage-M-T-F">
        {/* <RotatingSphere isCross={isCross} /> */}
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
              MenuHide={MenuHide}
              screenWidth={screenWidth}
            />
            <DownloadInfo resumeClicked={resumeClicked} />
          </animated.div>
        </animated.div>
        {/* <animated.div className="FooterOptions" style={crossOpenSpring}>
          {personalOptionsArray.map((item, index) => {
            const startDelay = globalIndex;
            globalIndex += item.options.length + 1;

            return (
              <PersonalOptions
                key={index}
                title={item.title}
                options={item.options}
                routes={item.routes}
                globalIndex={startDelay}
                maxDelay={maxDelay}
                isCross={isCross}
              />
            );
          })}
          <OpenIcon isOpen={isCross} setIsCross={setIsCross} />
        </animated.div>{" "} */}
      </div>
    )
  );
};
Footer.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  updateMenu: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isMenuOpen: state.menu.isMenuOpen,
});
export default connect(mapStateToProps, { updateMenu })(Footer);
