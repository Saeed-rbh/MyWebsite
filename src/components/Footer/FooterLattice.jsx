import React, { useEffect, useRef, useState } from "react";

/**
 * FooterLattice — uses the exact same graphene benzene-ring style
 * from the Research Story page (Flake class): a hexagonal ring with
 * 6 carbon atoms at vertices + bond lines, slowly rotating.
 * Rendered on a canvas clipped into the left end of the footer pill.
 * Fully responsive: scales down on mobile to prevent overlapping with text.
 */
const FooterLattice = () => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;

    const W = isMobile ? 60 : 110;
    const H = 60;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Single large ring centered in canvas, plus two small ghost rings
    const rings = isMobile
      ? [
          // Single smaller ring centered on mobile, lower opacity for premium look
          { x: W * 0.45, y: H * 0.5, radius: 11, opacity: 0.35, angle: 0, vAngle: 0.004 },
        ]
      : [
          // Main ring — centered, full opacity
          { x: W * 0.42, y: H * 0.5, radius: 18, opacity: 0.55, angle: 0, vAngle: 0.004 },
          // Small ghost ring — upper right
          { x: W * 0.82, y: H * 0.22, radius: 9, opacity: 0.2, angle: 1.0, vAngle: 0.006 },
          // Small ghost ring — lower left, partially off-screen
          { x: W * 0.08, y: H * 0.78, radius: 8, opacity: 0.15, angle: 2.5, vAngle: 0.005 },
        ];

    const drawRing = (r) => {
      const sides = 6;
      const color = `rgba(212, 157, 129, ${r.opacity})`;

      // Bond hexagon outline
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const theta = r.angle + (i * 2 * Math.PI) / sides;
        const px = r.x + r.radius * Math.cos(theta);
        const py = r.y + r.radius * Math.sin(theta);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Carbon atoms at each vertex
      for (let i = 0; i < sides; i++) {
        const theta = r.angle + (i * 2 * Math.PI) / sides;
        const px = r.x + r.radius * Math.cos(theta);
        const py = r.y + r.radius * Math.sin(theta);
        ctx.beginPath();
        ctx.arc(px, py, r.radius * 0.13, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      rings.forEach((r) => {
        r.angle += r.vAngle;
        drawRing(r);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: isMobile ? "60px" : "110px",
        height: "60px",
        pointerEvents: "none",
        borderRadius: "100px 0 0 100px",
      }}
    />
  );
};

export default FooterLattice;
