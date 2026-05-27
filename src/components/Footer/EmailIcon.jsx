import React from 'react';

const EmailIcon = ({ isHovered }) => {
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
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.4s ease'
            }}
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="#ffffff"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0, 1.0)}
            />
            <path
                d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                stroke="#d49d81"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0.3, 0.8)}
            />
        </svg>
    );
};

export default EmailIcon;
