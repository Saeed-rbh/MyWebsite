import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { animated, useSpring } from "react-spring";

const articles = [
  { path: "/Graphene", title: "Graphene" },
  { path: "/simulate-atoms", title: "Atomistic simulation" },
];

export default function ArticlesMenu({ onNavigate, reducedMotion = false }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const { pathname } = useLocation();
  const active = articles.some(article => article.path.toLowerCase() === pathname.toLowerCase().replace(/\/$/, ""));
  const pillMotion = useSpring({
    opacity: open ? 1 : 0,
    y: open ? 0 : 18,
    scaleX: open ? 1 : .62,
    scaleY: open ? 1 : .5,
    blur: open ? 0 : 6,
    config: open
      ? { mass: .8, tension: 310, friction: 25 }
      : { mass: .7, tension: 340, friction: 30, clamp: true },
    immediate: reducedMotion,
  });

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div
      ref={root}
      className="footer-articles"
      onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={event => {
        // Touch pointers leave after lifting a finger, before the link's click.
        // Only mouse hover should dismiss the panel here.
        if (event.pointerType === "mouse" && !root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={event => {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="footer-articles-trigger"
        aria-expanded={open}
        aria-controls="footer-article-links"
        aria-current={active ? "true" : undefined}
        data-active={active || undefined}
        onClick={() => setOpen(value => !value)}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => root.current?.querySelector("nav a")?.focus());
          }
        }}
      >
        <span className="footer-page-label">ARTICLES</span>
      </button>
      <animated.nav
        id="footer-article-links"
        className="footer-articles-panel"
        aria-label="Articles"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        data-open={open}
        style={{
          opacity: pillMotion.opacity,
          "--articles-y": pillMotion.y.to(value => `${value}px`),
          "--articles-scale-x": pillMotion.scaleX,
          "--articles-scale-y": pillMotion.scaleY,
          filter: pillMotion.blur.to(value => `blur(${value}px)`),
        }}
      >
        {articles.map(article => (
          <NavLink key={article.path} to={article.path} onClick={() => { setOpen(false); onNavigate(article.path); }}>
            <span>{article.title}</span>
          </NavLink>
        ))}
      </animated.nav>
    </div>
  );
}
