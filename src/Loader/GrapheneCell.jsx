import React, { useId } from "react";

const GrapheneSVG = ({ points, className }) => {
  const id = useId().replace(/:/g, "");
  const bondGradient = `loader-bond-${id}`;
  const atomGradient = `loader-atom-${id}`;

  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id={bondGradient} x1="35" y1="30" x2="165" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6ddcb" />
          <stop offset="0.48" stopColor="#c97c5c" />
          <stop offset="1" stopColor="#e8b491" />
        </linearGradient>
        <radialGradient id={atomGradient} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fffaf1" />
          <stop offset="0.48" stopColor="#f1c9ad" />
          <stop offset="1" stopColor="#be7255" />
        </radialGradient>
      </defs>
      {points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        return (
          <g key={index} style={{ "--segment-delay": `${index * 70}ms` }}>
            <line className="loader-bondBase" x1={point.x} y1={point.y} x2={next.x} y2={next.y} />
            <line
              className="loader-bond"
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke={`url(#${bondGradient})`}
            />
            <circle className="loader-atomHalo" cx={point.x} cy={point.y} r="10" />
            <circle
              className="loader-atom"
              cx={point.x}
              cy={point.y}
              r="5.8"
              fill={`url(#${atomGradient})`}
            />
          </g>
        );
      })}
    </svg>
  );
};

const GrapheneCell = ({ text, subtext }) => {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return {
      x: 100 + 50 * Math.cos(angle),
      y: 100 + 50 * Math.sin(angle),
    };
  });

  return (
    <div className="GrapheneIntro">
      <div className="loader-grapheneCluster">
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellMain" />
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellTop" />
        <GrapheneSVG points={points} className="loader-grapheneCell loader-grapheneCellBottom" />
      </div>
      <div className="centered-text">
        <p>{text}</p>
        <b className="Intro-b">{subtext}</b>
      </div>
    </div>
  );
};

export default GrapheneCell;
