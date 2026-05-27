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

    // Handle high DPI screens for razor-sharp lines
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

    // Track mouse position coordinates globally
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // 1. Drifting Backdrop Nodes configuration
    const particleCount = width < 768 ? 20 : 40;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        radius: 1.8,
      });
    }

    // 2. 3D Graphene Lattice Configuration (Watermark on Right)
    const hexRadius = width < 1400 ? 38 : 46;
    const points = [];
    const connections = [];

    // Generate honeycomb graphene nodes in 3D (5 rows, 6 columns of hexagons)
    const rows = 5;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let px = c * hexRadius * 1.5;
        let py = r * hexRadius * Math.sqrt(3);
        if (c % 2 === 1) {
          py += (hexRadius * Math.sqrt(3)) / 2;
        }

        // Center around (0,0) in 3D space
        px -= ((cols - 1) * hexRadius * 1.5) / 2;
        py -= ((rows - 1) * hexRadius * Math.sqrt(3)) / 2;

        // Give it minor Z-depth curves to simulate molecular wave
        const pz = Math.sin(c * 0.5) * Math.cos(r * 0.5) * 15;

        points.push({ x: px, y: py, z: pz });
      }
    }

    // Compute hexagonal connections
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Allow tiny floating point tolerance for connection length
        if (d > hexRadius - 2 && d < hexRadius + 2) {
          connections.push([i, j]);
        }
      }
    }

    // 3D rotation angles
    let angleX = 0.22;
    let angleY = 0.35;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- Draw Drifting Backdrop Nodes ---
      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node points
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 157, 129, 0.45)";
        ctx.fill();
      });

      // Draw drifting connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw subtle connections to cursor
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 240) {
            const alpha = (1 - dist / 240) * 0.09;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(212, 157, 129, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      }

      // --- Draw 3D Graphene Lattice (Right Side Watermark) ---
      // Only display on desktop viewports to maintain perfect layout balance
      if (width >= 1120) {
        // Slow constant rotations
        angleX += 0.00015;
        angleY += 0.0001;

        // Position lattice on the right 75% column, centered vertically
        const latX = width * 0.77;
        const latY = height * 0.46;

        // Project 3D points
        const projected = points.map((p) => {
          // Rotate around Y axis
          const x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
          const z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);

          // Rotate around X axis
          const y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
          const z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

          // Perspective scaling
          const fov = 500;
          const scale = fov / (fov + z2);
          const projX = latX + x1 * scale;
          const projY = latY + y2 * scale;

          return { x: projX, y: projY, scale };
        });

        // Draw connections (bonds)
        connections.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];

          // Fade bonds based on depth (Z scale)
          const meanScale = (p1.scale + p2.scale) / 2;
          const alpha = Math.max(0.04, (meanScale - 0.8) * 0.18);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(212, 157, 129, ${alpha * 1.5})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        });

        // Draw lattice carbon node points
        projected.forEach((p) => {
          const size = p.scale * 2.5;
          const alpha = Math.max(0.06, (p.scale - 0.8) * 0.28);

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
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
        zIndex: -90, // Sit on top of MainBackground (-100) but below content
        pointerEvents: "none",
      }}
    />
  );
};

export default BackgroundLattice;
