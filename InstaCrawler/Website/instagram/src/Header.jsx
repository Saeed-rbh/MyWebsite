import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenu } from "./menuActions";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";
import HomePage from "./HomePage";
import Logo from "./Logo";
import { TbHomeMove } from "react-icons/tb";
import { motion } from "framer-motion";

const Header = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);
  const handleButtonClick = useCallback(
    (value) => {
      dispatch(updateMenu(value));
    },
    [dispatch]
  );
  const [isMouseHovered, setIsMouseHovered] = useState([false, NaN, NaN]);
  const [isResumeClicked, setIsResumeClicked] = useState(
    window.location.pathname === "/AcademicCV"
  );
  useEffect(() => {
    const handleUrlChange = () => {
      const url = window.location.pathname;
      setIsResumeClicked(url === "/AcademicCV");
    };
    window.addEventListener("click", handleUrlChange);
    return () => {
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);
  const [scrollOpacity, setScrollOpacityT] = useState(false);
  useEffect(() => {
    if (isResumeClicked) {
      const handleScroll = () => {
        const scrollPosition = scrollableDiv.scrollTop;
        const maxScroll =
          scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
        const opacityT = scrollPosition / maxScroll + 1 > 0.1;
        setScrollOpacityT(opacityT);
      };
      const scrollableDiv = document.getElementById("AcademicCV-M");
      scrollableDiv.addEventListener("scroll", handleScroll);
      return () => {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isResumeClicked]);
  const [isMenuIconHovered, setIsMenuIconHovered] = useState(false);
  const topBarAnimation = useSpring({
    width: !isMenuOpen ? (!isMenuIconHovered ? "30px" : "15px") : "15px",
    transform: isMenuOpen
      ? "translateY(6.5px) rotate(45deg)"
      : "translateY(0px) rotate(0deg)",
    height: !isMenuOpen ? "2px" : "3px",
  });
  const bottomBarAnimation = useSpring({
    width: !isMenuOpen ? (isMenuIconHovered ? "30px" : "15px") : "15px",
    transform: isMenuOpen
      ? "translateY(-6.5px) rotate(-45deg)"
      : "translateY(0px) rotate(0deg)",
    height: !isMenuOpen ? "2px" : "3px",
  });
  const contactInfoAnimation1 = useSpring({
    transform: isMenuOpen ? "translate3d(0,10px,0)" : "translate3d(0,0px,0)",
    backgroundColor:
      isResumeClicked && scrollOpacity
        ? `rgba(0, 0, 0, 1)`
        : `rgba(0, 0, 0, 0)`,
    config: {
      duration: 400,
    },
  });
  const contactInfoAnimation2 = useSpring({
    display: "flex",
    opacity: !isResumeClicked ? "0" : "1",
    transform: !isResumeClicked
      ? "translate3d(-80px,0,0)"
      : "translate3d(0px,0,0)",
    config: {
      duration: 400,
      tension: 280,
      friction: 120,
    },
  });
  const contactInfoAnimation3 = useSpring({
    opacity: !isResumeClicked ? "1" : "0",
    transform: !isResumeClicked
      ? "translate3d(-110px,0,0)"
      : "translate3d(15px,0,0)",
    config: {
      duration: 400,
      tension: 280,
      friction: 120,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);
  const MenuIcon = () => {
    return (
      <motion.div
        initial={isLoading && { opacity: 0, y: 10 }}
        animate={isLoading && { opacity: 1, y: 0 }}
        transition={isLoading && { duration: 0.6 }}
        className="HomePage-M-T-H"
      >
        <animated.div style={contactInfoAnimation1} className="MainHeader">
          <animated.div className="HomePage-M-T-L">
            <animated.div
              className="HomePage-M-T-B"
              style={contactInfoAnimation2}
            >
              <TbHomeMove />
              <Link
                onClick={() => handleButtonClick(false)}
                to="/"
                path="/"
                href="https://www.instagram.com/saeed_rbh"
                onMouseEnter={() =>
                  setIsMouseHovered([!isMouseHovered[0], "RESUMEE", "AB"])
                }
                onMouseLeave={() =>
                  setIsMouseHovered([!isMouseHovered[0], "RESUMEE", "AB"])
                }
              >
                Home Page
              </Link>
            </animated.div>
            <animated.div style={contactInfoAnimation3}>
              <Link
                onClick={() => handleButtonClick(false)}
                to="/"
                path="/"
                element={<HomePage />}
              >
                <Logo className="Logo" size="20" />
                <p>Saeed</p>
                <b>Arabha</b>
              </Link>
            </animated.div>
          </animated.div>
          <div
            className="HomePage-M-T-R"
            onClick={() => handleButtonClick(!isMenuOpen)}
            onMouseEnter={() => setIsMenuIconHovered(true)}
            onMouseLeave={() => setIsMenuIconHovered(false)}
          >
            <animated.div
              className="MenuIcon-T"
              style={topBarAnimation}
            ></animated.div>
            <animated.div
              className="MenuIcon-B"
              style={bottomBarAnimation}
            ></animated.div>
          </div>
        </animated.div>
      </motion.div>
    );
  };
  return <MenuIcon />;
};

export default Header;
