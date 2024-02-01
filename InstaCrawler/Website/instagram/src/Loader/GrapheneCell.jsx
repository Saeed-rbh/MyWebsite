import React, { memo, useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";

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
const GrapheneSVG = ({ points }) => (
  <svg height="200" width="200">
    {points.map((point, i) => (
      <Atom
        key={`atom-${i}`}
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
        key={`bond-${i}`}
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
);
const GrapheneCell = ({ text, subtext, fade }) => {
  const radius = 50;
  const cx = 100;
  const cy = 100;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const [springProps, setSpringProps] = useSpring(() => ({
    opacity: 0,
    y: 20,
    duration: 1000,
    easing: easings.easeOutCubic,
    delay: 200,
  }));

  useEffect(() => {
    if (!fade) {
      setSpringProps({ opacity: 0.7, y: 0 });
    }
  }, [setSpringProps, fade]);

  useEffect(() => {
    if (fade) {
      setSpringProps({ opacity: 0, y: -20, delay: 600 });
    }
  }, [setSpringProps, fade]);

  return (
    <animated.div
      className="GrapheneIntro"
      style={{
        opacity: springProps.opacity,
        transform: springProps.y.interpolate(
          (y) => `translate3d(0, ${y}px, 0)`
        ),
      }}
    >
      <GrapheneSVG points={points} />
      <div className="centered-text">
        <p>{text}</p>
        <b className="Intro-b">{subtext}</b>
      </div>
    </animated.div>
  );
};

export default GrapheneCell;
