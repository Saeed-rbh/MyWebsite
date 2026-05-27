import React, { useEffect, useRef } from "react";

/**
 * FooterLattice — a small animated hexagonal graphene lattice
 * rendered on a canvas, decorating the left end of the footer pill.
 * Absolutely positioned so it clips naturally inside the pill's
 * border-radius via overflow: hidden on .HomeConsole.
 */
const FooterLattice = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;

    // Canvas physical size (CSS size set via style)
    const W = 120;
    const H = 60;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Build a flat honeycomb grid of hex centers
    const hexR = 10; // hex circumradius
    const points = [];
    const connections = [];

    const rows = 4;
    const cols = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * hexR * 1.5;
        const py = r * hexR * Math.sqrt(3) + (c % 2 === 1 ? (hexR * Math.sqrt(3)) / 2 : 0);
        // small z-wave for 3D feel
        const pz = Math.sin(c * 0.7) * Math.cos(r * 0.7) * 6;
        points.push({ x: px - (cols * hexR * 1.5) / 2 + hexR, y: py - (rows * hexR * Math.sqrt(3)) / 2, z: pz });
      }
    }

    // Connect nearest neighbours (bond length ≈ hexR)
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > hexR - 1 && d < hexR + 1) {
          connections.push([i, j]);
        }
      }
    }

    let angleX = 0.15;
    let angleY = 0.3;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Slow rotation
      angleX += 0.0003;
      angleY += 0.0002;

      const cx = W * 0.5;
      const cy = H * 0.5;
      const fov = 300;

      // Project 3D → 2D
      const proj = points.map((p) => {
        // Rotate Y
        const x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        const z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        // Rotate X
        const y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        const z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const scale = fov / (fov + z2);
        return { x: cx + x1 * scale, y: cy + y2 * scale, scale };
      });

      // Draw bonds
      connections.forEach(([i, j]) => {
        const p1 = proj[i];
        const p2 = proj[j];
        const meanScale = (p1.scale + p2.scale) / 2;
        const alpha = Math.max(0.06, (meanScale - 0.85) * 0.55);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw nodes
      proj.forEach((p) => {
        const alpha = Math.max(0.08, (p.scale - 0.85) * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.scale * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 157, 129, ${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "120px",
        height: "60px",
        pointerEvents: "none",
        opacity: 1,
        borderRadius: "100px 0 0 100px", // clip left pill end
      }}
    />
  );
};

export default FooterLattice;
