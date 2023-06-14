import "./HomePage.css";
import HomePage from "./HomePage";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { TbHomeMove } from "react-icons/tb";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";

const Header = ({ isMenuOpen, updateMenu }) => {
  const handleButtonClick = (value) => {
    updateMenu(value);
  };
  useEffect(() => {}, [isMenuOpen]);
  function MenuIcon() {
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
    const [MenuHover, setMenuHover] = useState(false);
    const handleClickMenu = () => {
      handleButtonClick(false);
      setResumeClicked(false);
    };
    const MenuIconClicked = () => {
      handleButtonClick(!isMenuOpen);
      console.log(isMenuOpen);
    };
    const [OnMouseH, setOnMouseH] = useState([false, NaN, NaN]);
    const ChangeSizeT = useSpring({
      width: !isMenuOpen ? (!MenuHover ? "30px" : "15px") : "15px",
      transform: isMenuOpen
        ? "translateY(6.5px) rotate(45deg)"
        : "translateY(0px) rotate(0deg)",
      height: !isMenuOpen ? "2px" : "3px",
    });
    const ChangeSizeB = useSpring({
      width: !isMenuOpen ? (MenuHover ? "30px" : "15px") : "15px",
      transform: isMenuOpen
        ? "translateY(-6.5px) rotate(-45deg)"
        : "translateY(0px) rotate(0deg)",
      height: !isMenuOpen ? "2px" : "3px",
    });
    const ContactInfoOpen4 = useSpring({
      transform: isMenuOpen ? "translate3d(0,10px,0)" : "translate3d(0,0px,0)",
      config: {
        duration: 400,
      },
    });

    const ContactInfoOpen10 = useSpring({
      marginTop: !isMenuOpen ? "0px" : "20px",
      display: "flex",
      alignItems: "center",
      opacity: !ResumeClicked ? "0" : "1",
      transform: !ResumeClicked
        ? "translate3d(-80px,0,0)"
        : "translate3d(5px,0,0)",
      config: {
        duration: 400,
        tension: 280,
        friction: 120,
      },
    });
    const ContactInfoOpen11 = useSpring({
      transform: !ResumeClicked
        ? "translate3d(-100px,0,0)"
        : "translate3d(40px,0,0)",
      config: {
        duration: 400,
        tension: 280,
        friction: 120,
      },
    });
    const ContactInfoOpen12 = useSpring({
      opacity: !ResumeClicked ? "0" : "1",
      color: "#d49d81",
      transform: !ResumeClicked
        ? "translate3d(-80px,-1px,0)"
        : !isMenuOpen
        ? "translate3d(27px,-1px,0)"
        : "translate3d(27px,10px,0)",
      config: {
        duration: 400,
        tension: 280,
        friction: 120,
      },
    });
    return (
      <div className="HomePage-M-T-H">
        <div className="MainHeader">
          <animated.div className="HomePage-M-T-L">
            <animated.div style={ContactInfoOpen10}>
              <TbHomeMove />
              <Link
                onClick={handleClickMenu}
                to="/"
                path="/"
                href="https://www.instagram.com/saeed_rbh"
                onMouseEnter={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
                onMouseLeave={() =>
                  setOnMouseH([!OnMouseH[0], "RESUMEE", "AB"])
                }
              >
                Home Page
              </Link>
            </animated.div>
            <animated.div style={ContactInfoOpen12}>|</animated.div>
            <animated.div
              style={ContactInfoOpen10}
              className="b-hr"
            ></animated.div>
            <animated.div style={ContactInfoOpen11}>
              <Link
                onClick={handleClickMenu}
                to="/"
                path="/"
                element={<HomePage />}
              >
                <animated.p style={ContactInfoOpen4}>Saeed</animated.p>
                <animated.b style={ContactInfoOpen4}>Arabha</animated.b>
              </Link>
            </animated.div>
          </animated.div>
          <animated.div
            style={ContactInfoOpen4}
            className="HomePage-M-T-R"
            onClick={MenuIconClicked}
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
export default connect(mapStateToProps, { updateMenu })(Header);
