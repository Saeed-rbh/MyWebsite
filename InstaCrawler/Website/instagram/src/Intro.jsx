import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSpring, animated } from "react-spring";
import "./Intro.css";

const Intro = () => {
  const controls = useAnimation();
  const [fade, setFade] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        // setFade(true);
      }, 2000);
      setTimeout(() => {
        // setVisible(false);
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
        <animated.div style={CloseIntro} className="Intro">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 6 }}
            animate={controls}
          >
            Welcome To My Personal Website
          </motion.p>
          <motion.b
            className={`Intro-b ${fade && "Intro-out-b"}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * 8 }}
            animate={controls}
          >
            --- LOADING ---
          </motion.b>
        </animated.div>
      )}
    </>
  );
};

export default Intro;
