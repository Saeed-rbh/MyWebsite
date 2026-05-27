import React from 'react';

const ResearchGateIcon = ({ isHovered }) => {
    const commonStyle = (delay, duration = 1.0) => ({
        strokeDasharray: 1,
        strokeDashoffset: isHovered ? 0 : 1,
        transition: `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, opacity 0.5s ease`,
        opacity: isHovered ? 1 : 0,
    });

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                display: 'block',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.4s ease'
            }}
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="#ffffff"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0, 1.2)}
            />
            <path
                d="M9 16V8H12.5C13.8807 8 15 9.11929 15 10.5C15 11.8807 13.8807 13 12.5 13H9"
                stroke="#ffffff"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0.3, 1.0)}
            />
            <path
                d="M12.5 13L15 16"
                stroke="#d49d81"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0.6, 0.8)}
            />
        </svg>
    );
};

export default ResearchGateIcon;
