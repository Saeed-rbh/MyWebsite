import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTransition, animated } from "react-spring";
import styles from "./Popup.module.css";

const Popup = ({ isOpen, onClose, topic, originRect, onNext, onPrev, hasNext, hasPrev, nextTitle, prevTitle }) => {
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [canScroll, setCanScroll] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updateMotion);
    return () => preference.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector("button")?.focus());
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === "Tab") {
        const controls = [...(panelRef.current?.querySelectorAll("button, a[href], [tabindex='0']") || [])];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!panelRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          first?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
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
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen]);

  const updateScrollHint = () => {
    const element = contentRef.current;
    if (element) setCanScroll(element.scrollHeight - element.clientHeight - element.scrollTop > 8);
  };

  useEffect(() => {
    if (!isOpen) return;
    const element = contentRef.current;
    if (!element) return;
    element.scrollTop = 0;
    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    updateScrollHint();
    const focusFrame = requestAnimationFrame(() => {
      if (!panelRef.current?.contains(document.activeElement)) element.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(focusFrame);
      observer.disconnect();
    };
  }, [isOpen, topic?.id]);

  const deltaX = originRect ? originRect.left + originRect.width / 2 - window.innerWidth / 2 : 0;
  const deltaY = originRect ? originRect.top + originRect.height / 2 - window.innerHeight / 2 : 0;
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, x: deltaX * .10, y: deltaY * .10 + 12, scale: .96 },
    enter: { opacity: 1, x: 0, y: 0, scale: 1 },
    leave: { opacity: 0, x: 0, y: 12, scale: .985 },
    config: { mass: .8, tension: 235, friction: 28 },
    immediate: reducedMotion,
  });

  return createPortal(transitions((motion, open) => open && topic && (
    <animated.div
      className={styles.overlay}
      data-site-motion-ignore="true"
      style={{ opacity: motion.opacity }}
      onClick={event => { if (event.target === event.currentTarget) closeRef.current(); }}
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      <animated.section
        ref={panelRef}
        className={styles.modal}
        style={motion}
        role="dialog"
        aria-modal="true"
        aria-labelledby="research-topic-title"
      >
        <button className={styles.closeButton} type="button" aria-label="Close research detail" onClick={onClose}>
          <span /><span />
        </button>
        <header className={styles.header}>
          <p className={styles.eyebrow}><span aria-hidden="true" /> RESEARCH IN PRACTICE</p>
          <h2 id="research-topic-title" className={styles.title} aria-live="polite">{topic.title}</h2>
        </header>
        <div className={styles.content} ref={contentRef} onScroll={updateScrollHint} tabIndex={0} aria-label={`${topic.shortTitle} description`}>
          <article key={topic.id} className={styles.article}>
            <p className={styles.lead}>{topic.lead}</p>
            <p className={styles.description}>{topic.description}</p>
            <div className={styles.work}>
              <h3>My work</h3>
              <p>{topic.work}</p>
              <p className={styles.evidence}>{topic.evidence}</p>
            </div>
            <div className={styles.value}>
              <h3>Why it matters</h3>
              <p>{topic.value}</p>
            </div>
          </article>
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerLabel}><span>EXPLORE THE CONNECTIONS</span><span className={styles.scrollHint}>{canScroll ? "Scroll to read more" : ""}</span></div>
          <nav className={styles.navigation} aria-label="Related research topics">
            {hasPrev && prevTitle ? <button type="button" className={styles.previous} onClick={onPrev} aria-label={`Previous topic: ${prevTitle}`}><span>PREVIOUS</span>{prevTitle}</button> : <span />}
            {hasNext && nextTitle ? <button type="button" className={styles.next} onClick={onNext} aria-label={`Next topic: ${nextTitle}`}><span>NEXT</span>{nextTitle}</button> : <a href="mailto:saeedarabha@outlook.com" className={styles.next}><span>CONTINUE THE CONVERSATION</span>Let’s talk about your R&D.</a>}
          </nav>
        </footer>
      </animated.section>
    </animated.div>
  )), document.body);
};

export default Popup;
