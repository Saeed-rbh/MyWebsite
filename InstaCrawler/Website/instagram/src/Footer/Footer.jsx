import React, { useState, useEffect } from "react";
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
  const [isCross, setIsCross] = useWindowResize();
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
  const contactInfoOpenSpring = useSpring({
    transform: isMenuOpen ? "translate3d(0,-10px,0)" : "translate3d(0,0px,0)",
    config: {
      duration: 400,
      easing: easings.easeOutCubic,
    },
  });
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="HomePage-M-T-F"
      >
        <RotatingSphere isCross={isCross} />
        <animated.div style={contactInfoOpenSpring} className="HomeConsole">
          <ContactInfo
            isMouseHover={isMouseHover}
            setMouseHover={setMouseHover}
            contactInfoOpenSpring={contactInfoOpenSpring}
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
        <animated.div style={contactInfoOpenSpring} className="FooterOptions">
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
        </animated.div>
      </motion.div>
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
