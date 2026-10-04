import React, { useEffect, useRef } from "react";

// A connected honeycomb lattice with gentle membrane ripples.
const BackgroundLattice = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frameId;
    let lastFrame = 0;
    let activeTime = 0;
    let pointer = { x: 0, y: 0 };
    let targetPointer = { x: 0, y: 0 };

    let bonds = [];
    let atoms = [];

    const buildLattice = () => {
      const radius = width < 640 ? 31 : 43;
      const rowHeight = Math.sqrt(3) * radius;
      const uniqueBonds = new Map();
      const uniqueAtoms = new Map();
      const pointKey = p => `${Math.round(p.x * 100)},${Math.round(p.y * 100)}`;
      for (let column = -3; column < width / (radius * 1.5) + 3; column++) {
        for (let row = -3; row < height / rowHeight + 3; row++) {
          const cx = column * radius * 1.5;
          const cy = (row + (column % 2) / 2) * rowHeight;
          const vertices = Array.from({ length: 6 }, (_, i) => ({
            x: cx + Math.cos(i * Math.PI / 3) * radius,
            y: cy + Math.sin(i * Math.PI / 3) * radius,
          }));
          vertices.forEach((start, i) => {
            const end = vertices[(i + 1) % 6];
            const key = [start, end].map(pointKey).sort().join("|");
            if (!uniqueAtoms.has(pointKey(start))) uniqueAtoms.set(pointKey(start), start);
            if (!uniqueBonds.has(key)) uniqueBonds.set(key, { start, end });
          });
        }
      }
      bonds = [...uniqueBonds.values()];
      atoms = [...uniqueAtoms.values()];
    };

    const membranePoint = (point, time) => {
      // Neighboring bonds share the same displacement, so the lattice stays connected.
      const phase = point.x * .005 + point.y * .006;
      return {
        x: point.x + Math.sin(phase - time * .22) * 2 + pointer.x,
        y: point.y + Math.sin(phase - time * .3) * 5 + pointer.y,
      };
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const atmosphere = ctx.createRadialGradient(width * .85, height * .12, 0, width * .6, height * .4, Math.max(width, height));
      atmosphere.addColorStop(0, "#19130f");
      atmosphere.addColorStop(.45, "#100e0c");
      atmosphere.addColorStop(1, "#100e0c");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = .65;
      const patches = [
        { x: .86 + Math.sin(time * .09) * .06, y: .18 + Math.cos(time * .11) * .09, phase: 0 },
        { x: .10 + Math.cos(time * .08) * .05, y: .62 + Math.sin(time * .10) * .12, phase: 2.1 },
        { x: .72 + Math.sin(time * .07 + 1) * .12, y: .88 + Math.cos(time * .09) * .05, phase: 4.2 },
      ];
      const visibilityAt = (point) => {
        const x = point.x / width;
        const y = point.y / height;
        const distance = Math.hypot((x - .5) / .55, (y - .48) / .62);
        const quietCenter = .12 + .88 * Math.min(1, Math.max(0, (distance - .28) / .65));
        // Soft spatial fades reveal connected patches, rather than the whole grid.
        const reveal = patches.reduce((sum, patch) => {
          const field = Math.exp(-2 * (((x - patch.x) / .23) ** 2 + ((y - patch.y) / .28) ** 2));
          const fade = ((Math.cos(time * .28 + patch.phase) + 1) * .5) ** 2;
          return sum + field * fade;
        }, 0);
        return { reveal: Math.min(1, reveal), quietCenter };
      };
      bonds.forEach(({ start, end }) => {
        const a = membranePoint(start, time);
        const b = membranePoint(end, time);
        const { reveal, quietCenter } = visibilityAt({ x: (start.x + end.x) * .5, y: (start.y + end.y) * .5 });
        ctx.strokeStyle = `rgba(212,157,129,${(.006 + .22 * reveal) * quietCenter})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      atoms.forEach(atom => {
        const point = membranePoint(atom, time);
        const { reveal, quietCenter } = visibilityAt(atom);
        const opacity = (.008 + .42 * reveal) * quietCenter;
        ctx.fillStyle = `rgba(225,174,144,${opacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, width < 640 ? 1.15 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = (now) => {
      frameId = requestAnimationFrame(tick);
      if (now - lastFrame < 1000 / 30) return;
      const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, .1) : 0;
      lastFrame = now;
      activeTime += elapsed;
      pointer.x += (targetPointer.x - pointer.x) * .05;
      pointer.y += (targetPointer.y - pointer.y) * .05;
      draw(activeTime);
    };

    const syncAnimation = () => {
      cancelAnimationFrame(frameId);
      lastFrame = 0;
      if (motionPreference.matches || document.hidden) {
        pointer = { x: 0, y: 0 };
        draw(0);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLattice();
      draw(motionPreference.matches ? 0 : activeTime);
    };
    const movePointer = (event) => {
      if (motionPreference.matches || event.pointerType === "touch") return;
      targetPointer = { x: (event.clientX / width - .5) * 6, y: (event.clientY / height - .5) * 6 };
    };
    const resetPointer = () => { targetPointer = { x: 0, y: 0 }; };

    resize();
    syncAnimation();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", syncAnimation);
    motionPreference.addEventListener("change", syncAnimation);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      document.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", syncAnimation);
      motionPreference.removeEventListener("change", syncAnimation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: -90,
        pointerEvents: "none",
      }}
    />
  );
};

export default BackgroundLattice;
