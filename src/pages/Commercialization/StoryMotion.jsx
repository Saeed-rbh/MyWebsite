import React, { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

export function InterviewCount({ root, className }) {
  const ref = useRef(null);
  const visible = useInView(ref, { root, once: true, amount: 0.7 });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!visible || reduce || !ref.current) return;
    const control = animate(0, 40, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: value => { if (ref.current) ref.current.textContent = `${Math.round(value)}+`; },
    });
    return () => control.stop();
  }, [visible, reduce]);
  return <strong className={className} aria-label="More than 40 customer interviews"><span aria-hidden="true" ref={ref}>40+</span></strong>;
}

// Scroll position drives both entry and exit. Content stays mounted and can
// replay naturally when the reader scrolls back, without hiding its section.
export function ScrollFade({ root, as = 'div', stagger = 0, children, style, ...props }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: root,
    target: ref,
    offset: ['start 96%', 'end 4%'],
  });
  const entryEnd = 0.14 + Math.min(stagger, 4) * 0.025;
  const alpha = useTransform(scrollYProgress, [0, entryEnd, 0.84, 1], [0, 1, 1, 0]);
  const travel = useTransform(scrollYProgress, [0, entryEnd, 0.84, 1], [30, 0, 0, -20]);
  const opacity = useSpring(alpha, { stiffness: 180, damping: 30, mass: 0.45 });
  const y = useSpring(travel, { stiffness: 140, damping: 26, mass: 0.55 });
  const Tag = motion[as];
  return <Tag ref={ref} data-scroll-fade="true" style={{ ...style, opacity: reduce ? 1 : opacity, y: reduce ? 0 : y }} {...props}>{children}</Tag>;
}
