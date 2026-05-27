import React, { useEffect, useRef } from "react";

const BackgroundLattice = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // High-DPI setup
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- Throttled mouse: update target on events, lerp in render loop ---
    let mouseTarget = { x: null, y: null };
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouseTarget.x = e.clientX;
      mouseTarget.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseTarget.x = null;
      mouseTarget.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // --- Particles: fewer, with staggered spawn ---
    const particleCount = width < 768 ? 14 : 25;
    const SPAWN_INTERVAL = 220; // ms between each dot appearing
    const FADE_DURATION = 1200; // ms to fade in fully
    const startTime = performance.now();

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.055,
        vy: (Math.random() - 0.5) * 0.055,
        radius: 1.8,
        spawnAt: i * SPAWN_INTERVAL, // stagger each dot
        opacity: 0,
      });
    }

    // --- 3D Graphene Lattice (right side, desktop only) ---
    const hexRadius = width < 1400 ? 38 : 46;
    const points = [];
    const connections = [];
    const rows = 5;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let px = c * hexRadius * 1.5;
        let py = r * hexRadius * Math.sqrt(3);
        if (c % 2 === 1) py += (hexRadius * Math.sqrt(3)) / 2;
        px -= ((cols - 1) * hexRadius * 1.5) / 2;
        py -= ((rows - 1) * hexRadius * Math.sqrt(3)) / 2;
        const pz = Math.sin(c * 0.5) * Math.cos(r * 0.5) * 15;
        points.push({ x: px, y: py, z: pz });
      }
    }
    // Pre-compute connections once
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > hexRadius - 2 && d < hexRadius + 2) connections.push([i, j]);
      }
    }
    let angleX = 0.22;
    let angleY = 0.35;

    // --- Connection distance threshold (use squared to avoid sqrt) ---
    const CONNECT_DIST = 190;
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
    const MOUSE_DIST = 220;
    const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST;

    // Alternate frame flag — draw connections every other frame
    let frameCount = 0;

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      frameCount++;

      // Smooth mouse position (lerp) — no jank from direct event writes
      if (mouseTarget.x !== null) {
        if (mouse.x === null) { mouse.x = mouseTarget.x; mouse.y = mouseTarget.y; }
        mouse.x += (mouseTarget.x - mouse.x) * 0.12;
        mouse.y += (mouseTarget.y - mouse.y) * 0.12;
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      ctx.clearRect(0, 0, width, height);

      // --- Active particles (only those whose spawn time has arrived) ---
      const active = [];
      particles.forEach((p) => {
        if (elapsed < p.spawnAt) return; // not yet born

        // Fade in opacity
        const age = elapsed - p.spawnAt;
        p.opacity = Math.min(0.45, (age / FADE_DURATION) * 0.45);

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        active.push(p);
      });

      // Draw dots
      active.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 157, 129, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines — every other frame to cut work in half
      if (frameCount % 2 === 0) {
        for (let i = 0; i < active.length; i++) {
          for (let j = i + 1; j < active.length; j++) {
            const dx = active[i].x - active[j].x;
            const dy = active[i].y - active[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < CONNECT_DIST_SQ) {
              const pairOpacity = Math.min(active[i].opacity, active[j].opacity);
              const alpha = (1 - Math.sqrt(distSq) / CONNECT_DIST) * 0.10 * (pairOpacity / 0.45);
              ctx.beginPath();
              ctx.moveTo(active[i].x, active[i].y);
              ctx.lineTo(active[j].x, active[j].y);
              ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      // Mouse lines — only when cursor is on screen
      if (mouse.x !== null) {
        active.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_DIST_SQ) {
            const alpha = (1 - Math.sqrt(distSq) / MOUSE_DIST) * 0.07 * (p.opacity / 0.45);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }

      // --- 3D Graphene Lattice (desktop only) ---
      if (width >= 1120) {
        angleX += 0.00015;
        angleY += 0.0001;

        const latX = width * 0.77;
        const latY = height * 0.46;

        const projected = points.map((p) => {
          const x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
          const z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
          const y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
          const z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);
          const scale = 500 / (500 + z2);
          return { x: latX + x1 * scale, y: latY + y2 * scale, scale };
        });

        connections.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];
          const meanScale = (p1.scale + p2.scale) / 2;
          const alpha = Math.max(0.04, (meanScale - 0.8) * 0.27);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        });

        projected.forEach((p) => {
          const alpha = Math.max(0.06, (p.scale - 0.8) * 0.28);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.scale * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 157, 129, ${alpha})`;
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -90,
        pointerEvents: "none",
      }}
    />
  );
};

export default BackgroundLattice;
