import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, easings } from "react-spring";
import { Link } from "react-router-dom";
import { TbHomeMove } from "react-icons/tb";
import { motion } from "framer-motion";
import { updateMenu } from "../actions/Actions";
import HomePage from "../HomePage/HomePage";
import Logo from "./Logo";
import MenuButton from "./MenuButton";

const useScrollOpacity = (isResumeClicked) => {
  const [scrollOpacity, setScrollOpacity] = useState(false);

  useEffect(() => {
    if (isResumeClicked && window.location.pathname === "/AcademicCV") {
      const handleScroll = () => {
        const scrollableDiv = document.getElementById("AcademicCV-M");
        if (scrollableDiv) {
          const scrollPosition = scrollableDiv.scrollTop;
          const maxScroll =
            scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
          const opacity = scrollPosition / maxScroll + 1 > 0.1;
          setScrollOpacity(opacity);
        }
      };

      const scrollableDiv = document.getElementById("AcademicCV-M");
      if (scrollableDiv) {
        scrollableDiv.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (scrollableDiv) {
          scrollableDiv.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [isResumeClicked]);

  return scrollOpacity;
};

const Header = () => {
  const { isMenuOpen } = useSelector((state) => state.isMenuOpen);
  const { visibility } = useSelector((state) => state.visibility);
  const { stages } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const handleButtonClick = useCallback(
    (value) => {
      dispatch(updateMenu(value));
    },
    [dispatch]
  );

  const [isResumeClicked, setIsResumeClicked] = useState(
    window.location.pathname !== "/"
  );

  useEffect(() => {
    const handleUrlChange = () => {
      setIsResumeClicked(window.location.pathname !== "/");
    };

    window.addEventListener("click", handleUrlChange);

    return () => {
      window.removeEventListener("click", handleUrlChange);
    };
  }, []);

  const scrollOpacity = useScrollOpacity(isResumeClicked);

  const contactInfoAnimation1 = useSpring({
    transform: isMenuOpen
      ? `translate3d(0px,${stages[1] ? 0 : 0}px,0)`
      : `translate3d(0px,${stages[1] ? -10 : 0}px,0)`,
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
      ? `translate3d(-80px,${stages[1] ? 25 : 45}px,0)`
      : `translate3d(${stages[1] ? -30 : 0}px,${
          stages[1] ? (isMenuOpen ? 35 : 25) : 45
        }px,0)`,
    // config: { duration: 600 },
  });
  const contactInfoAnimation3 = useSpring({
    opacity: !isResumeClicked ? "1" : "0",
    transform: !isResumeClicked
      ? `translate3d(0px,${
          stages[1] ? (isMenuOpen ? 0 : -10) : isMenuOpen ? 20 : 10
        }px,0`
      : `translate3d(55px,${
          stages[1] ? (isMenuOpen ? 0 : -10) : isMenuOpen ? 20 : 10
        }px,0`,
    // config: { duration: 600 },
  });

  return (
    visibility && (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="HomePage-M-T-H"
        >
          <animated.div
            style={contactInfoAnimation1}
            className="MainHeader"
          ></animated.div>
        </motion.div>
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
          contactInfoAnimation={contactInfoAnimation1}
          isMenuOpen={isMenuOpen}
          handleButtonClick={handleButtonClick}
        />
      </>
    )
  );
};

export default Header;
