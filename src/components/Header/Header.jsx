import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, easings } from "react-spring";
import { useLocation, useNavigate } from "react-router-dom";
import { TbHomeMove } from "react-icons/tb";
import { motion } from "framer-motion";
import { updateMenu } from "../../actions/Actions";
import HomePage from "../../pages/Home/Home";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import { updateCurrentPage } from "../../actions/Actions";

const useScrollOpacity = (isResumeClicked) => {
  const [scrollOpacity, setScrollOpacity] = useState(false);

  useEffect(() => {
    if (isResumeClicked && window.location.pathname === "/AcademicCV") {
      const scrollableDiv = document.getElementById("AcademicCV-M");
      if (!scrollableDiv) return;

      const handleScroll = () => {
        const scrollPosition = scrollableDiv.scrollTop;
        const maxScroll =
          scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
        setScrollOpacity(scrollPosition / maxScroll + 1 > 0.1);
      };

      scrollableDiv.addEventListener("scroll", handleScroll);
      return () => scrollableDiv.removeEventListener("scroll", handleScroll);
    }
  }, [isResumeClicked]);

  return scrollOpacity;
};

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isMenuOpen } = useSelector((state) => state.ui);
  const { visibility } = useSelector((state) => state.ui);
  const { stages } = useSelector((state) => state.data);

  const [isResumeClicked, setIsResumeClicked] = useState(
    location.pathname !== "/"
  );

  useEffect(() => {
    setIsResumeClicked(location.pathname !== "/");
  }, [location.pathname]);

  useEffect(() => {
    const handleUrlChange = () =>
      setIsResumeClicked(window.location.pathname !== "/");
    window.addEventListener("click", handleUrlChange);
    return () => window.removeEventListener("click", handleUrlChange);
  }, []);

  const handleButtonClick = useCallback(
    (value) => dispatch(updateMenu(value)),
    [dispatch]
  );
  const scrollOpacity = useScrollOpacity(isResumeClicked);
  const MainRef = useRef(null);
  const MainStyle = useHoverMoveEffect(MainRef, 100, 0.2);

  const HomeRef = useRef(null);
  const HomeStyle = useHoverMoveEffect(HomeRef, 100, 0.2);

  const MenuRef = useRef(null);
  const MenuStyle = useHoverMoveEffect(MenuRef, 100, 0.2);

  const contactInfoAnimation1 = useSpring({
    transform: `translate3d(0px,${isMenuOpen ? (stages[1] ? 0 : 10) : stages[1] ? -20 : 0
      }px,0)`,
    backgroundColor:
      isResumeClicked && scrollOpacity
        ? `rgba(0, 0, 0, 1)`
        : `rgba(0, 0, 0, 0)`,
    easing: easings.easeOutCubic,
    config: { duration: 500, delay: 5 },
  });

  const contactInfoAnimation2 = useSpring({
    display: "flex",
    opacity: isResumeClicked ? "1" : "0",
    transform: `translate3d(${isResumeClicked ? (stages[1] ? -30 : 0) : -80
      }px,${stages[1] ? (isMenuOpen ? 35 : 10) : isMenuOpen ? 45 : 35}px,0)`,
    config: { duration: 500 },
    delay: 5,
  });

  const contactInfoAnimation3 = useSpring({
    opacity: isResumeClicked ? "0" : "1",
    transform: `translate3d(${isResumeClicked ? 55 : 0}px,${stages[1] ? (isMenuOpen ? -5 : -25) : isMenuOpen ? 15 : 0
      }px,0)`,
    config: { duration: 500 },
    delay: 5,
  });

  const navigate = useNavigate();

  const handleHomeClcik = () => {
    dispatch(updateCurrentPage("/"));
    handleButtonClick(false);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    visibility && (
      <motion.div
        key={visibility ? "visible" : "hidden"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="HomePage-M-T-H"
      >
        <animated.div style={contactInfoAnimation1} className="MainHeader" />

        <animated.div className="HomePage-M-T-L">
          <animated.div
            className="HomePage-M-T-B"
            style={{ ...HomeStyle, ...contactInfoAnimation2 }}
            ref={HomeRef}
          >
            <TbHomeMove />
            <button onClick={handleHomeClcik}>Home Page</button>
          </animated.div>
          <animated.div style={contactInfoAnimation3}>
            <animated.div ref={MainRef} style={MainStyle}>
              <button onClick={handleHomeClcik} element={<HomePage />}>
                <Logo className="Logo" size="20" />
                <p>Saeed</p>
                <b>Arabha</b>
              </button>
            </animated.div>
          </animated.div>
        </animated.div>
        <MenuButton
          contactInfoAnimation={contactInfoAnimation1}
          MenuRef={MenuRef}
          MenuStyle={MenuStyle}
          isMenuOpen={isMenuOpen}
          handleButtonClick={handleButtonClick}
        />
      </motion.div>
    )
  );
};

export default Header;
