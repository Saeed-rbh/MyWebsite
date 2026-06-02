import React, { useEffect } from "react";
import { useSpring, animated, easings } from "react-spring";

const Atom = ({ cx, cy, index }) => (
  <circle className="loader-atom" cx={cx} cy={cy} r="8" style={{ "--delay": `${index * 0.12}s` }} />
);
const Bond = ({ x1, y1, x2, y2, index }) => (
  <line
    className="loader-bond"
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    strokeWidth="2"
    style={{ "--delay": `${index * 0.12}s` }}
  />
);
const GrapheneSVG = ({ points, className }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    aria-hidden="true"
  >
    {points.map((point, i) => (
      <Atom
        key={`atom-${i}`}
        cx={point.x}
        cy={point.y}
        index={i}
      />
    ))}
    {points.map((point, i) => (
      <Bond
        key={`bond-${i}`}
        x1={point.x}
        y1={point.y}
        x2={points[(i + 1) % points.length].x}
        y2={points[(i + 1) % points.length].y}
        index={i}
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
      setSpringProps({ opacity: 1, y: 0 });
    }
  }, [setSpringProps, fade]);

  useEffect(() => {
    if (fade) {
      setSpringProps({ opacity: 0, y: 20, delay: 100 });
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
      <div className="loader-grapheneCluster">
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellMain" />
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellTop" />
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellBottom" />
      </div>
      <div className="centered-text">
        <p>{text}</p>
        <b className="Intro-b">{subtext}</b>
        <div className="loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </animated.div>
  );
};

export default GrapheneCell;
