import React from "react";

const FooterHoverIcon = ({ kind, isHovered }) => {
  const draw = (delay) => ({
    strokeDasharray: 1,
    strokeDashoffset: isHovered ? 0 : 1,
    opacity: isHovered ? 1 : 0,
    transition: `stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, opacity 0.5s ease`,
  });

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{
        display: "block",
        flex: "0 0 24px",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.5s ease",
      }}
    >
      {kind === "cv" ? (
        <>
          <path d="M6 3.5h8.5L19 8v12H6z" pathLength="1" style={draw(0)} />
          <path d="M14.5 3.5V8H19" pathLength="1" style={draw(0.25)} />
          <path d="M9 11h6M9 14h7M9 17h5" pathLength="1" style={draw(0.5)} />
        </>
      ) : kind === "journal" ? (
        <>
          <path d="M6 3.5h8l4 4V20H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" pathLength="1" style={draw(0)} />
          <path d="M14 3.5V8h4" pathLength="1" style={draw(0.25)} />
          <path d="M8 11.5h6M8 14.5h6M8 17.5h4" pathLength="1" style={draw(0.5)} />
        </>
      ) : (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" pathLength="1" style={draw(0)} />
          <path d="M8 10.5V17M12 17v-6.5M12 13.5c0-2 1-3.2 2.8-3.2 1.7 0 2.7 1.2 2.7 3.2V17" pathLength="1" style={draw(0.3)} />
          <circle cx="8" cy="7.5" r=".8" fill="currentColor" stroke="none" style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.6s ease 0.8s",
          }} />
        </>
      )}
    </svg>
  );
};

export default FooterHoverIcon;
