import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animated, easings, useTransition } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { updateMenu, updateCurrentPage } from "../../actions/Actions";
import ContactItem from "./ContactItem";
import WordReveal from "./WordReveal";
import styles from "./Menu.module.css";

// Keep new destinations with their subject so the menu grows by section.
const destinationGroups = [
  {
    title: "Overview",
    items: [
      { path: "/", title: "Home", detail: "The introduction" },
      { path: "/AcademicCV", title: "Academic CV", detail: "Experience, publications, skills" },
    ],
  },
  {
    title: "Work",
    items: [
      { path: "/R&D-Portfolio", title: "R&D portfolio", detail: "Process, evidence, application" },
      { path: "/venture", title: "Venture", detail: "From materials research to market" },
    ],
  },
  {
    title: "Research",
    items: [
      { path: "/simulate-atoms", title: "Atomic simulation", detail: "Explore materials at the atomic scale" },
      { path: "/Graphene", title: "Graphene", detail: "Structure, properties, and simulation" },
      { path: "/journal/", title: "Journal", detail: "Papers and research explained" },
    ],
  },
];

const isCurrentDestination = (pathname, path) => {
  const normalize = (value) => value.toLowerCase().replace(/\/+$/, "") || "/";
  const current = normalize(pathname);
  const destination = normalize(path);
  return current === destination || (destination !== "/" && current.startsWith(`${destination}/`));
};

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
  const contentRef = useRef(null);
  const [contentScale, setContentScale] = useState(1);

  useLayoutEffect(() => {
    if (!isMenuOpen) return;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    const fitContent = () => {
      const style = getComputedStyle(panel);
      const available = panel.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setContentScale(Math.min(1, Math.max(0, available) / Math.max(content.offsetHeight, 1)));
    };
    fitContent();
    const observer = new ResizeObserver(fitContent);
    observer.observe(panel);
    observer.observe(content);
    return () => observer.disconnect();
  }, [isMenuOpen]);
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
        const toggle = document.getElementById("portfolio-menu-toggle");
        const focusable = [toggle, ...(panelRef.current?.querySelectorAll("a[href], button") || [])].filter(Boolean);
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
      id="portfolio-menu-panel"
      ref={panelRef}
      className={styles.overlay}
      data-state={isMenuOpen ? "open" : "closing"}
      style={{
        "--menu-origin-x": `${menuOrigin.x * 100}%`,
        "--menu-origin-y": `${menuOrigin.y * 100}%`,
        clipPath: motion.reveal.to(value => fluidCircle(value, menuOrigin, viewport)),
      }}
      aria-hidden={!isMenuOpen}
      inert={!isMenuOpen ? true : undefined}
    >
      <div ref={contentRef} className={styles.content} style={{ transform: `scale(${contentScale})` }}>
      <div className={styles.layout}>
        <section className={styles.navigation}>
          <p className={styles.eyebrow}><WordReveal text="EXPLORE" delay={300} /></p>
          <h2 id="portfolio-menu-title"><span className={styles.headingLine}><WordReveal text="The work." delay={400} /></span><span className={styles.headingLine}><em><WordReveal text="The thinking." delay={520} /></em></span></h2>
          <nav className={styles.destinationGroups} aria-label="Portfolio navigation">
            {destinationGroups.map((group, groupIndex) => (
              <section className={styles.destinationGroup} style={{ "--divider-delay": `${460 + groupIndex * 80}ms` }} key={group.title} aria-labelledby={`menu-group-${groupIndex}`}>
                <h3 className={styles.groupTitle} id={`menu-group-${groupIndex}`}><WordReveal text={group.title} delay={460 + groupIndex * 80} /></h3>
                <ul className={styles.destinationList}>
                  {group.items.map((destination, index) => (
                    <li key={destination.path}>
                      <Link
                        to={destination.path}
                        className={styles.destination}
                        style={{ "--item-delay": `${580 + groupIndex * 80 + Math.min(index, 4) * 60}ms` }}
                        aria-current={isCurrentDestination(location.pathname, destination.path) ? "page" : undefined}
                        onClick={() => {
                          dispatch(updateCurrentPage(destination.path));
                          close();
                        }}
                      >
                        <span className={styles.destinationTitle}><WordReveal text={destination.title} delay={580 + groupIndex * 80 + Math.min(index, 4) * 60} /></span>
                        <span className={styles.destinationDetail}><WordReveal text={destination.detail} delay={700 + groupIndex * 80 + Math.min(index, 4) * 60} /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </section>
        <ContactItem />
      </div>
      <p className={styles.note}><WordReveal text="A materials question. A research opportunity. A conversation." delay={700} /></p>
      </div>
    </animated.div>
  ));
};

export default Menu;
