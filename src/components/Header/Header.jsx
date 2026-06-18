import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, easings } from "react-spring";
import { useLocation, useNavigate } from "react-router-dom";
import { TbHomeMove } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { updateMenu } from "../../actions/Actions";
import HomePage from "../../pages/Home/Home";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import useHoverMoveEffect from "../../Helper/useHoverMoveEffect";
import { updateCurrentPage } from "../../actions/Actions";

const useScrollOpacity = (isResumeClicked) => {
  const [scrollOpacity, setScrollOpacity] = useState(false);

  useEffect(() => {
    if (isResumeClicked && window.location.pathname.toLowerCase() === "/academiccv") {
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

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const isRDPage = location.pathname.toLowerCase() === "/r&d-portfolio";
    if (isRDPage) {
      const sectionIds = ["gap", "process", "system", "evidence", "modeling", "industry", "approach"];
      
      const setupObserver = () => {
        const scrollContainer = document.querySelector('main');
        
        const observerOptions = {
          root: scrollContainer || null,
          rootMargin: "-45% 0px -45% 0px",
          threshold: 0
        };

        const observerCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sectionIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            observer.observe(element);
          }
        });

        // Set initial active section
        const currentActive = sectionIds.find(id => {
          const rect = document.getElementById(id)?.getBoundingClientRect();
          return rect && rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
        });
        if (currentActive) {
          setActiveSection(currentActive);
        }

        return observer;
      };

      // Set a small delay to ensure the DOM has rendered
      let observer;
      const timer = setTimeout(() => {
        observer = setupObserver();
      }, 500);

      return () => {
        clearTimeout(timer);
        if (observer) {
          observer.disconnect();
        }
      };
    } else {
      setActiveSection("");
    }
  }, [location.pathname]);

  const sectionLabels = {
    gap: "GAP",
    process: "CFE",
    system: "SYSTEM",
    evidence: "PROOF",
    modeling: "MODEL",
    industry: "VALUE",
    approach: "APPROACH"
  };

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

  const isRDPage = location.pathname.toLowerCase() === "/r&d-portfolio";
  const currentLabel = (isRDPage && activeSection && sectionLabels[activeSection]) 
    ? sectionLabels[activeSection] 
    : (isRDPage ? "R&D" : null);

  return (
    visibility && (
      <motion.div
        key={visibility ? "visible" : "hidden"}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.3 }}
        className="HomePage-M-T-H"
      >
        <animated.div style={contactInfoAnimation1} className="MainHeader" />

        <animated.div className="HomePage-M-T-L">
          <animated.div
            className="HomePage-M-T-B"
            style={{ ...HomeStyle, ...contactInfoAnimation2, display: "flex", alignItems: "center", gap: "2px" }}
            ref={HomeRef}
          >
            <TbHomeMove style={{ display: "block", marginRight: "12px" }} />
            <button 
              onClick={handleHomeClcik} 
              style={{ 
                display: "inline-block",
                padding: 0, 
                background: "none",
                border: "none",
                cursor: "pointer",
                lineHeight: "normal",
                fontFamily: "Rubik, sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                color: "#faf9f1"
              }}
            >
              {isRDPage ? "Home" : "Home Page"}
            </button>
            
            {isRDPage && currentLabel && (
              <span style={{ 
                margin: "0 16px 0 16px", 
                opacity: 0.4, 
                userSelect: "none", 
                fontFamily: "Rubik, sans-serif",
                fontSize: "13px",
                lineHeight: "normal",
                color: "#faf9f1"
              }}>/</span>
            )}
            
            <AnimatePresence mode="wait">
              {isRDPage && currentLabel && (
                <motion.div
                  key={currentLabel}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <span style={{ 
                    fontWeight: 300, 
                    letterSpacing: "0.05em", 
                    color: "#d49d81", 
                    fontSize: "12px",
                    fontFamily: "Rubik, sans-serif",
                    lineHeight: "normal",
                    textShadow: "0 0 8px rgba(212, 157, 129, 0.25)"
                  }}>
                    {currentLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </animated.div>
          
          <animated.div style={contactInfoAnimation3}>
            <animated.div ref={MainRef} style={MainStyle}>
              <button onClick={handleHomeClcik}>
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
