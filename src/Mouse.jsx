import React, { useEffect, useRef, useState } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { useSelector } from "react-redux";
import "./Mouse.css";

const CLICKABLE_SELECTOR =
  'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"]';

const isClickable = (target) => {
  if (!(target instanceof Element)) return false;

  const control = target.closest(CLICKABLE_SELECTOR);
  if (target.closest('[inert], :disabled, [aria-disabled="true"]')) {
    return false;
  }

  return Boolean(control) || window.getComputedStyle(target).cursor === "pointer";
};

const Mouse = () => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [hoveringClickableElement, setHoveringClickableElement] = useState(false);
  const frame = useRef(null);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastTarget = useRef(null);
  const isHoveringClickable = useRef(false);
  const { stages } = useSelector((state) => state.data);

  const [{ ringX, ringY }, ringApi] = useSpring(() => ({
    ringX: 0,
    ringY: 0,
    config: { mass: 2, tension: 350, friction: 60 },
  }));

  const [{ dotX, dotY }, dotApi] = useSpring(() => ({
    dotX: 0,
    dotY: 0,
    config: { mass: 3, tension: 170, friction: 50 },
  }));

  useEffect(() => {
    const updateHover = (target) => {
      const clickable = isClickable(target);
      if (clickable !== isHoveringClickable.current) {
        isHoveringClickable.current = clickable;
        setHoveringClickableElement(clickable);
      }
    };

    const handlePointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      lastTarget.current = event.target;

      if (frame.current === null) {
        frame.current = requestAnimationFrame(() => {
          frame.current = null;
          const { x, y } = lastPointer.current;
          updateHover(lastTarget.current);
          ringApi.start({ ringX: x, ringY: y });
          dotApi.start({ dotX: x, dotY: y });
        });
      }
    };

    const handleScroll = () => {
      const { x, y } = lastPointer.current;
      lastTarget.current = document.elementFromPoint(x, y);
      updateHover(lastTarget.current);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button === 0) {
        setMouseClicked(true);
      }
    };
    const handlePointerUp = () => setMouseClicked(false);
    const handlePointerLeave = () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
      lastTarget.current = null;
      updateHover(null);
      setMouseClicked(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [ringApi, dotApi]);

  const ringSize = hoveringClickableElement ? 50 : mouseClicked ? 6 : 30;
  const dotSize = hoveringClickableElement ? 50 : 10;
  const ringStyle = useSpring({
    width: ringSize,
    height: ringSize,
    opacity: hoveringClickableElement ? 0.5 : 1,
    backgroundColor: hoveringClickableElement
      ? "rgba(212, 157, 129, 0.1)"
      : "rgba(212, 157, 129, 0)",
  });
  const dotStyle = useSpring({
    width: dotSize,
    height: dotSize,
    opacity: hoveringClickableElement ? 0.05 : 1,
  });

  return (
    <div
      className="mouse-tracker"
      style={{ display: !stages[1] ? "block" : "none" }}
      aria-hidden="true"
    >
      <animated.div
        className="ring"
        style={{
          ...ringStyle,
          transform: to(
            [ringX, ringY],
            (x, y) => `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
          ),
        }}
      />
      <animated.div
        className="dot"
        style={{
          ...dotStyle,
          transform: to(
            [dotX, dotY],
            (x, y) => `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
          ),
          mixBlendMode: hoveringClickableElement ? "darken" : "normal",
        }}
      />
    </div>
  );
};

export default Mouse;
