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
const GrapheneCell = (controls) => {
  const radius = 50;
  const cx = 100;
  const cy = 100;
  const points = Array.from({ length: 6 }).map((_, i) => {
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
      whileInView={{ opacity: 0.3 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      animate={controls}
    >
      <svg height="200" width="200">
        {points.map((point, i) => (
          <Atom
            key={i}
            cx={point.x}
            cy={point.y}
            style={{ animation: `fadeIn 2s ease-in-out ${i * 0.3}s infinite` }}
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
              animation: `fadeIn 2s ease-in-out ${(i + 6) * 0.3}s infinite`,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

const Intro = () => {
  const controls = useAnimation();
  const [fade, setFade] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setFade(true);
      }, 2000);
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };
    window.onload = handleLoad;
    return () => {
      window.onload = null;
    };
  }, []);

  useEffect(() => {
    if (fade) {
      controls.start({ opacity: 0, y: -20 });
    }
  }, [fade, controls]);

  const CloseIntro = useSpring({
    opacity: !fade ? "1" : "0",
    delay: fade ? 1200 : 0,
  });

  return (
    <>
      {visible && (
        <>
          <animated.div style={CloseIntro} className="Intro">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.75, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * 6 }}
              animate={controls}
            >
              Welcome To My Personal Website
            </motion.p>

            <motion.b
              className={`Intro-b ${fade && "Intro-out-b"}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * 8 }}
              animate={controls}
            >
              LOADING
            </motion.b>
            <GrapheneCell />
          </animated.div>
        </>
      )}
    </>
  );
};

export default Intro;
