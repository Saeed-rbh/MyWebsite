import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, easings } from "react-spring";
import { Link } from "react-router-dom";
import { TbHomeMove } from "react-icons/tb";
import { selectVisibility } from "../visibilitySlice";
import { motion } from "framer-motion";
import { updateMenu } from "../Menu/menuActions";
import HomePage from "../HomePage/HomePage";
import Logo from "./Logo";
import MenuButton from "./MenuButton";

const useScrollOpacity = (isResumeClicked) => {
  const [scrollOpacity, setScrollOpacity] = useState(false);

  useEffect(() => {
    if (isResumeClicked) {
      const handleScroll = () => {
        const scrollableDiv = document.getElementById("AcademicCV-M");
        const scrollPosition = scrollableDiv.scrollTop;
        const maxScroll =
          scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
        const opacity = scrollPosition / maxScroll + 1 > 0.1;
        setScrollOpacity(opacity);
      };

      const scrollableDiv = document.getElementById("AcademicCV-M");
      scrollableDiv.addEventListener("scroll", handleScroll);

      return () => {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isResumeClicked]);

  return scrollOpacity;
};

const Header = () => {
  const MenuHide = !useSelector(selectVisibility);
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);

  const handleButtonClick = useCallback(
    (value) => {
      dispatch(updateMenu(value));
    },
    [dispatch]
  );

  const [isResumeClicked, setIsResumeClicked] = useState(
    window.location.pathname === "/AcademicCV"
  );

  useEffect(() => {
    const handleUrlChange = () => {
      setIsResumeClicked(window.location.pathname === "/AcademicCV");
    };

    window.addEventListener("click", handleUrlChange);

    return () => {
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);

  const scrollOpacity = useScrollOpacity(isResumeClicked);

  const contactInfoAnimation1 = useSpring({
    transform: isMenuOpen ? "translate3d(0,10px,0)" : "translate3d(0,0px,0)",
    backgroundColor:
      isResumeClicked && scrollOpacity
        ? `rgba(0, 0, 0, 1)`
        : `rgba(0, 0, 0, 0)`,
    easing: easings.easeOutCubic,
  });
  const contactInfoAnimation2 = useSpring({
    display: "flex",
    opacity: !isResumeClicked ? "0" : "1",
    transform: !isResumeClicked
      ? "translate3d(-80px,0,0)"
      : "translate3d(0px,0,0)",

    easing: easings.easeOutCubic,
  });
  const contactInfoAnimation3 = useSpring({
    opacity: !isResumeClicked ? "1" : "0",
    transform: !isResumeClicked
      ? "translate3d(-110px,0,0)"
      : "translate3d(15px,0,0)",

    easing: easings.easeOutCubic,
  });

  return (
    MenuHide && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="HomePage-M-T-H"
      >
        <animated.div style={contactInfoAnimation1} className="MainHeader">
          <animated.div className="HomePage-M-T-L">
            <animated.div
              className="HomePage-M-T-B"
              style={contactInfoAnimation2}
            >
              <TbHomeMove />
              <Link onClick={() => handleButtonClick(false)} to="/">
                Home Page
              </Link>
            </animated.div>
            <animated.div style={contactInfoAnimation3}>
              <Link
                onClick={() => handleButtonClick(false)}
                to="/"
                element={<HomePage />}
              >
                <Logo className="Logo" size="20" />
                <p>Saeed</p>
                <b>Arabha</b>
              </Link>
            </animated.div>
          </animated.div>
          <MenuButton
            isMenuOpen={isMenuOpen}
            handleButtonClick={handleButtonClick}
          />
        </animated.div>
      </motion.div>
    )
  );
};

export default Header;
