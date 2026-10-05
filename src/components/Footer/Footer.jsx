import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";

import { useSelector } from "react-redux";
import "../../pages/Home/Home.css";
import "./Footer.css";
import ContactInfo from "./ContactInfo";
import ResumeInfo from "./ResumeInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateMenu, updateCurrentPage } from "../../actions/Actions";
import FooterLattice from "./FooterLattice";
import FooterHoverIcon from "./FooterHoverIcon";
import { PopupModal } from "react-calendly";

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isMenuOpen } = useSelector((state) => state.ui);
  const { visibility } = useSelector((state) => state.ui);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updateMotion);
    return () => preference.removeEventListener("change", updateMotion);
  }, []);
  const mobileFooter = screenWidth <= 640;
  const separateContactPill = screenWidth >= 940;
  const footerWidth = mobileFooter
    ? Math.min(520, screenWidth - 36)
    : separateContactPill ? 600 : Math.min(820, screenWidth - 24);
  const footerHeight = mobileFooter ? 56 : 60;
  const introComplete = useRef(false);
  const [isMouseHover, setMouseHover] = useState([false, null, null]);
  const [isHoveredJournal, setIsHoveredJournal] = useState(false);

  const navigateTo = (path) => {
    dispatch(updateCurrentPage(path));
    dispatch(updateMenu(false));
    navigate(path);
  };
  const handleClickCV = () => navigateTo("/AcademicCV");
  const handleClickResearch = () => navigateTo("/R&D-Portfolio");

  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("calendly-open-bg", isCalendlyOpen);
    return () => document.body.classList.remove("calendly-open-bg");
  }, [isCalendlyOpen]);
  const contactInfoOpenSpring = useSpring({
    from: { opacity: 0, y: 18, width: 72, height: 38 },
    opacity: 1,
    y: 0,
    width: footerWidth,
    height: footerHeight,
    config: { mass: .85, tension: 240, friction: 28 },
    delay: introComplete.current || reducedMotion ? 0 : 950,
    onRest: () => { introComplete.current = true; },
    immediate: reducedMotion,
  });

  const TextOpenSpring = useSpring({
    from: { opacity: 0, y: 7 },
    opacity: 1,
    y: 0,
    config: { mass: .8, tension: 180, friction: 25 },
    delay: introComplete.current || reducedMotion ? 0 : 1320,
    immediate: reducedMotion,
  });

  const actionPillSpring = useSpring({
    from: { separation: 0 },
    separation: separateContactPill ? 1 : 0,
    config: { mass: 1, tension: 220, friction: 20 },
    delay: introComplete.current || reducedMotion ? 0 : 1500,
    immediate: reducedMotion,
  });

  return (
    visibility && (
      <div className="HomePage-M-T-F HomeLandingFooter" inert={isMenuOpen ? true : undefined}>
        <PopupModal
          url="https://calendly.com/arabha-yorku/30min"
          onModalClose={() => setIsCalendlyOpen(false)}
          open={isCalendlyOpen}
          rootElement={document.getElementById("root")}
          pageSettings={{
            backgroundColor: "020201",
            textColor: "faf9f1",
            primaryColor: "d49d81",
          }}
        />
        <animated.div
          style={{
            ...contactInfoOpenSpring,
            "--footer-pill-width": contactInfoOpenSpring.width.to(value => `${value}px`),
            "--footer-pill-height": contactInfoOpenSpring.height.to(value => `${value}px`),
          }}
          className="HomeConsole"
        >
          <FooterLattice />
          <animated.div style={{ ...TextOpenSpring, "--footer-content-width": `${footerWidth - (mobileFooter ? 6 : separateContactPill ? 48 : 24)}px` }} className="home-footer-content">
            <ResumeInfo
              handleClickCV={handleClickCV}
              handleClickResearch={handleClickResearch}
              resumeClicked={false}
              MenuHide={visibility}
              screenWidth={screenWidth}
            />
            <Link
              className="footer-journal-link"
              to="/journal/"
              onClick={() => { dispatch(updateCurrentPage("/journal/")); dispatch(updateMenu(false)); }}
              onMouseEnter={() => setIsHoveredJournal(true)}
              onMouseLeave={() => setIsHoveredJournal(false)}
              onFocus={() => setIsHoveredJournal(true)}
              onBlur={() => setIsHoveredJournal(false)}
            >
              <FooterHoverIcon kind="journal" isHovered={isHoveredJournal} />
              <span>JOURNAL</span>
            </Link>
            <ContactInfo
              isMouseHover={isMouseHover}
              setMouseHover={setMouseHover}
              onBookCall={() => setIsCalendlyOpen(true)}
            />

          </animated.div>
        </animated.div>
        {separateContactPill && (
          <>
            <animated.span
              className="footer-liquid-bridge"
              aria-hidden="true"
              style={{
                left: contactInfoOpenSpring.width.to(width => `calc(50% + ${(width - 250) / 2}px)`),
                opacity: actionPillSpring.separation.to(value => Math.max(0, Math.sin(Math.PI * Math.min(1, value))) * .42),
                transform: actionPillSpring.separation.to(value => `translateY(-50%) scaleX(${Math.max(0, 1 - value) * 1.2})`),
              }}
            />
            <animated.div
              className="HomeConsole footer-action-pill"
              style={{
                opacity: actionPillSpring.separation.to(value => Math.min(1, value * 1.7)),
                transform: actionPillSpring.separation.to(value => `translate3d(${-46 * (1 - value)}px, 0, 0) scale(${.82 + .18 * value}, ${.78 + .22 * value})`),
              }}
            >
              <button type="button" onClick={() => setIsCalendlyOpen(true)}>BOOK A CALL</button>
              <span className="footer-action-divider" aria-hidden="true" />
              <a href="mailto:saeedarabha@outlook.com">EMAIL ME</a>
            </animated.div>
          </>
        )}
      </div>
    )
  );
};

export default Footer;
