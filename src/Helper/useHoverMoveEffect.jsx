import { useEffect } from "react";
import { useSpring } from "react-spring";

const MAX_OFFSET = 12;
const BOUNDS_TTL_MS = 250;
const SPRING_CONFIG = { mass: 0.8, tension: 240, friction: 24, precision: 0.01 };

const useHoverMoveEffect = (ref, distanceThreshold = 100, moveFactor = 0.2) => {
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: SPRING_CONFIG,
  }));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointer = null;
    let bounds = null;
    let measuredElement = null;
    let measuredAt = 0;
    let targetX = 0;
    let targetY = 0;

    const moveTo = (x, y) => {
      if (Math.abs(x - targetX) < 0.05 && Math.abs(y - targetY) < 0.05) return;
      targetX = x;
      targetY = y;
      api.start({ x, y });
    };

    const measure = () => {
      const element = ref.current;
      if (!element) {
        measuredElement = null;
        bounds = null;
        return null;
      }

      const now = performance.now();
      if (element !== measuredElement || !bounds || now - measuredAt > BOUNDS_TTL_MS) {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) {
          bounds = null;
          return null;
        }

        // Remove the spring offset so the element never chases its own movement.
        const x = style.x.get();
        const y = style.y.get();
        bounds = {
          left: rect.left - x,
          right: rect.right - x,
          top: rect.top - y,
          bottom: rect.bottom - y,
          centerX: rect.left + rect.width / 2 - x,
          centerY: rect.top + rect.height / 2 - y,
        };
        measuredElement = element;
        measuredAt = now;
      }

      return bounds;
    };

    const update = () => {
      frame = 0;
      if (!pointer || reducedMotion.matches || distanceThreshold <= 0) {
        moveTo(0, 0);
        return;
      }

      const rect = measure();
      if (!rect) {
        moveTo(0, 0);
        return;
      }

      const outsideX = Math.max(rect.left - pointer.x, 0, pointer.x - rect.right);
      const outsideY = Math.max(rect.top - pointer.y, 0, pointer.y - rect.bottom);
      const distance = Math.hypot(outsideX, outsideY);
      if (distance >= distanceThreshold) {
        moveTo(0, 0);
        return;
      }

      const proximity = distance / distanceThreshold;
      const influence = 1 - proximity * proximity * (3 - 2 * proximity);
      const pullX = (pointer.x - rect.centerX) * moveFactor;
      const pullY = (pointer.y - rect.centerY) * moveFactor;
      const pullLength = Math.hypot(pullX, pullY);
      const limit = pullLength > MAX_OFFSET ? MAX_OFFSET / pullLength : 1;
      moveTo(pullX * limit * influence, pullY * limit * influence);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resetPointer = () => {
      pointer = null;
      moveTo(0, 0);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch") {
        resetPointer();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onPointerOut = (event) => {
      if (!event.relatedTarget) resetPointer();
    };

    const onLayoutChange = () => {
      bounds = null;
      if (pointer) schedule();
    };

    const onReducedMotionChange = () => {
      if (!reducedMotion.matches) return;
      pointer = null;
      targetX = 0;
      targetY = 0;
      api.start({ x: 0, y: 0, immediate: true });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("resize", onLayoutChange, { passive: true });
    window.addEventListener("scroll", onLayoutChange, { capture: true, passive: true });
    window.addEventListener("blur", resetPointer);
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
      window.removeEventListener("blur", resetPointer);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
    };
  }, [api, distanceThreshold, moveFactor, ref, style.x, style.y]);

  return style;
};

export default useHoverMoveEffect;
