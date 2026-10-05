import React, { useEffect, useRef, useState } from "react";
import { animated, easings, useTransition } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { updateMenu, updateCurrentPage } from "../../actions/Actions";
import ContactItem from "./ContactItem";
import WordReveal from "./WordReveal";
import styles from "./Menu.module.css";

const destinations = [
  { path: "/", title: "Home", detail: "The introduction" },
  { path: "/R&D-Portfolio", title: "R&D portfolio", detail: "Process, evidence, application" },
  { path: "/journal/", title: "Journal", detail: "Papers and research explained" },
  { path: "/AcademicCV", title: "Academic CV", detail: "Experience, publications, skills" },
];

const fluidCircle = (progress, origin, viewport) => {
  const amount = Math.min(1, Math.max(0, progress));
  const cx = origin.x * viewport.width;
  const cy = origin.y * viewport.height;
  const radius = Math.hypot(Math.max(cx, viewport.width - cx), Math.max(cy, viewport.height - cy)) * 1.06 * amount;
  // The click-centered circle develops a gentle wave, then settles flat beyond the viewport.
  const ripple = Math.sin(amount * Math.PI) * .075;
  const points = Array.from({ length: 120 }, (_, index) => {
    const angle = index / 120 * Math.PI * 2;
    const wave = 1 + ripple * (Math.sin(angle * 3 - amount * 5) + .45 * Math.sin(angle * 2 + amount * 4));
    return `${(cx + Math.cos(angle) * radius * wave).toFixed(2)}px ${(cy + Math.sin(angle) * radius * wave).toFixed(2)}px`;
  });
  return `polygon(${points.join(", ")})`;
};

const Menu = () => {
  const { isMenuOpen, menuOrigin } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();
  const panelRef = useRef(null);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const close = () => dispatch(updateMenu(false));

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updateMotion);
    return () => preference.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const opener = document.activeElement;
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector("nav a")?.focus({ preventScroll: true }));
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch(updateMenu(false));
      } else if (event.key === "Tab") {
        const focusable = [...(panelRef.current?.querySelectorAll("a[href], button") || [])];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      opener?.focus();
    };
  }, [isMenuOpen, dispatch]);

  const transitions = useTransition(isMenuOpen, {
    from: { reveal: 0 },
    enter: { reveal: 1 },
    leave: { reveal: 0 },
    config: { duration: isMenuOpen ? 1050 : 650, easing: easings.easeInOutCubic },
    immediate: reducedMotion,
  });

  return transitions((motion, open) => open && (
    <animated.div
      ref={panelRef}
      className={styles.overlay}
      data-state={isMenuOpen ? "open" : "closing"}
      style={{
        "--menu-origin-x": `${menuOrigin.x * 100}%`,
        "--menu-origin-y": `${menuOrigin.y * 100}%`,
        clipPath: motion.reveal.to(value => fluidCircle(value, menuOrigin, viewport)),
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-menu-title"
      aria-hidden={!isMenuOpen}
      inert={!isMenuOpen ? true : undefined}
    >
      <div className={styles.topbar}>
        <button className={styles.close} type="button" onClick={close} aria-label="Close navigation">
          <span /><span />
        </button>
      </div>
      <div className={styles.layout}>
        <section className={styles.navigation}>
          <p className={styles.eyebrow}>EXPLORE</p>
          <h2 id="portfolio-menu-title"><span className={styles.headingLine}><WordReveal text="The work." delay={400} /></span><span className={styles.headingLine}><em><WordReveal text="The thinking." delay={520} /></em></span></h2>
          <nav aria-label="Portfolio navigation">
            {destinations.map((destination, index) => (
              <Link
                key={destination.path}
                to={destination.path}
                className={styles.destination}
                style={{ "--item-delay": `${350 + index * 100}ms` }}
                aria-current={location.pathname.toLowerCase() === destination.path.toLowerCase() ? "page" : undefined}
                onClick={() => {
                  dispatch(updateCurrentPage(destination.path));
                  close();
                }}
              >
                <span className={styles.destinationTitle}><WordReveal text={destination.title} delay={580 + index * 100} /></span>
                <span className={styles.destinationDetail}><WordReveal text={destination.detail} delay={700 + index * 100} /></span>
              </Link>
            ))}
          </nav>
        </section>
        <ContactItem />
      </div>
      <p className={styles.note}>A materials question. A research opportunity. A conversation.</p>
    </animated.div>
  ));
};

export default Menu;
