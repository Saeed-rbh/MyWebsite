import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSpring, animated } from "react-spring";
import "./Intro.css";

const Atom = ({ cx, cy, style }) => (
  <circle cx={cx} cy={cy} r="8" fill="white" style={style} />
);
const Bond = ({ x1, y1, x2, y2, style }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="white"
    strokeWidth="2"
    style={style}
  />
);

const GrapheneCell = ({ controls, text, subtext, fade }) => {
  const radius = 50;
  const cx = 100;
  const cy = 100;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2; // 60 degrees = PI/3 radians
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  return (
    <motion.div
      className="GrapheneIntro"
      initial={{ opacity: 0 }}
      animate={controls}
      whileInView={{ opacity: 0.7 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <svg height="200" width="200">
        {points.map((point, i) => (
          <Atom
            key={i}
            cx={point.x}
            cy={point.y}
            style={{
              animation: `fadeIn 2s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0.2,
            }}
          />
        ))}
        {points.map((point, i) => (
          <Bond
            key={i}
            x1={point.x}
            y1={point.y}
            x2={points[(i + 1) % points.length].x}
            y2={points[(i + 1) % points.length].y}
            style={{
              animation: `fadeIn 2s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0.2,
            }}
          />
        ))}
      </svg>
      <div className="centered-text">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={controls}
          whileInView={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 * 6 }}
        >
          {text}
        </motion.p>
        <motion.b
          initial={{ opacity: 0, y: 10 }}
          animate={controls}
          whileInView={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 * 8 }}
          className={`Intro-b ${fade && "Intro-out-b"}`}
        >
          {subtext}
        </motion.b>
      </div>
    </motion.div>
  );
};

const Intro = () => {
  const controls = useAnimation();
  const [fade, setFade] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setFade(true), 4000);
      setTimeout(() => setVisible(false), 6000);
    };
    window.onload = handleLoad;
    return () => {
      window.onload = null;
    };
  }, []);

  useEffect(() => {
    if (fade) controls.start({ opacity: 0, y: -20 });
  }, [fade, controls]);

  const CloseIntro = useSpring({
    opacity: fade ? 0 : 1,
    delay: fade ? 1200 : 0,
  });

  return (
    visible && (
      <animated.div style={CloseIntro} className="Intro">
        <GrapheneCell
          controls={controls}
          text="Welcome To My Personal Website"
          subtext="LOADING"
          fade={fade}
        />
      </animated.div>
    )
  );
};

export default Intro;
