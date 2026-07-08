import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, useChain, easings, useTransition } from "react-spring";
import { useLocation, useNavigate } from "react-router-dom";
import { TbHomeMove } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";

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
  const normalizedPath = (() => {
    try {
      return decodeURIComponent(location.pathname).toLowerCase();
    } catch {
      return location.pathname.toLowerCase();
    }
  })();

  const { isMenuOpen } = useSelector((state) => state.ui);
  const { visibility } = useSelector((state) => state.ui);
  const { stages } = useSelector((state) => state.data);

  const [isResumeClicked, setIsResumeClicked] = useState(
    location.pathname !== "/"
  );

  useEffect(() => {
    setIsResumeClicked(location.pathname !== "/");
  }, [normalizedPath]);

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
  const [activeGapSlide, setActiveGapSlide] = useState("1");
  useEffect(() => {
    const isRDPage = normalizedPath === "/r&d-portfolio";
    if (!isRDPage) {
      setActiveSection("");
      setActiveGapSlide("1");
      return undefined;
    }
    const sectionIds = ["gap", "process", "system", "evidence", "modeling", "industry", "approach"];
    let rafId = null;
    let scrollContainer = null;

    const updateActiveSection = () => {
      const isRDPage = normalizedPath === "/r&d-portfolio";
      if (!isRDPage) {
        setActiveSection("");
        return;
      }

      const containerRect = scrollContainer?.getBoundingClientRect();
      const containerTop = containerRect?.top ?? 0;
      const containerBottom = containerRect?.bottom ?? window.innerHeight;
      const containerHeight = scrollContainer?.clientHeight ?? window.innerHeight;
      const viewportCenter = containerTop + containerHeight / 2;
      let nextSection = "";
      let gapElement = null;
      let minDistance = Infinity;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        if (id === "gap") gapElement = element;

        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          nextSection = id;
        } else {
          const distance = Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));
          if (!nextSection && distance < minDistance) {
            minDistance = distance;
            if (rect.top < containerBottom && rect.bottom > containerTop) {
              nextSection = id;
            }
          }
        }
      });

      if (nextSection) {
        setActiveSection((current) => (current === nextSection ? current : nextSection));
      } else if (scrollContainer && scrollContainer.scrollTop < 100) {
        setActiveSection("");
      }

      if (nextSection === "gap" && gapElement && scrollContainer) {
        const slideFromStory = gapElement.getAttribute("data-active-slide");
        let next = slideFromStory || "6";

        if (!slideFromStory) {
          const pinDistance = Math.max(gapElement.offsetHeight - scrollContainer.clientHeight, 1);
          const rawProgress = (scrollContainer.scrollTop - gapElement.offsetTop) / pinDistance;
          const latest = Math.min(Math.max(rawProgress, 0), 1);
          next = "6";
          if (latest < 0.15) next = "1";
          else if (latest < 0.31) next = "2";
          else if (latest < 0.47) next = "3";
          else if (latest < 0.63) next = "4";
          else if (latest < 0.79) next = "5";
        }

        setActiveGapSlide((current) => (current === next ? current : next));
      }
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateActiveSection();
      });
    };

    let setupTimer = null;
    let attempts = 0;

    const setup = () => {
      const gapElement = document.getElementById("gap");
      if (!gapElement && normalizedPath === "/r&d-portfolio") {
        attempts++;
        if (attempts < 100) {
          setupTimer = setTimeout(setup, 100);
        }
        return;
      } else if (!gapElement && normalizedPath !== "/r&d-portfolio") {
        // If we are not on WorkStory, we can just use main or window
      }

      scrollContainer = gapElement?.closest('main') || document.querySelector('main[class*="page"]') || document.querySelector("main") || document.documentElement;

      updateActiveSection();
      window.addEventListener("scroll", requestUpdate, { capture: true, passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      window.addEventListener("orientationchange", requestUpdate, { passive: true });
      window.visualViewport?.addEventListener("resize", requestUpdate, { passive: true });
    };

    setup();

    return () => {
      if (setupTimer) clearTimeout(setupTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate, { capture: true });
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
      window.visualViewport?.removeEventListener("resize", requestUpdate);
    };
  }, [normalizedPath]);

  const sectionLabels = {
    gap: "The Gap",
    process: "The Answer",
    system: "The System",
    evidence: "Evidence",
    modeling: "Product",
    industry: "Industry demand",
    approach: "My Approach"
  };

  const gapSubLabels = {
    "1": "The Gap",
    "2": "Industry Demand",
    "3": "Scale",
    "4": "Cost",
    "5": "Consistency",
    "6": "My Focus"
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

  const getPageTitle = () => {
    const path = normalizedPath;
    if (path === "/") return null;
    if (path === "/r&d-portfolio" || path === "/work-story") {
      if (activeSection === "gap") {
        return gapSubLabels[activeGapSlide] || "The Gap";
      }
      return (activeSection && sectionLabels[activeSection]) ? sectionLabels[activeSection] : "R&D journey";
    }
    if (path === "/academiccv") return "Academic CV";
    if (path === "/graphene") return "Graphene";
    if (path === "/research-progress") return "Research Progress";
    
    const formatted = normalizedPath.replace(/^\//, '').replace(/-/g, ' ');
    if (!formatted) return null;
    return formatted.replace(/\b\w/g, l => l.toUpperCase());
  };

  const currentLabel = getPageTitle();
  const isHomePage = location.pathname === "/";

  const containerAnimation = useSpring({
    opacity: 1,
    transform: 'translate3d(0,0px,0)',
    from: { opacity: 0, transform: 'translate3d(0,-30px,0)' },
    config: { tension: 280, friction: 24 },
    delay: 300,
  });

  const labelTransitions = useTransition(currentLabel, {
    key: currentLabel,
    from: { opacity: 0, transform: 'translate3d(-4px,0px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, display: 'none' },
    config: { duration: 150, easing: easings.easeInOutQuad },
  });

  return (
    visibility && (
      <animated.div
        style={containerAnimation}
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
              {isHomePage ? "Home Page" : "Home"}
            </button>
            
            {!isHomePage && currentLabel && (
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
              {!isHomePage && currentLabel && (
                <motion.div
                  key={currentLabel}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
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
      </animated.div>
    )
  );
};

export default Header;
