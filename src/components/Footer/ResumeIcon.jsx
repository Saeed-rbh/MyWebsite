import React from 'react';

const ResumeIcon = ({ isHovered }) => {
    const commonStyle = (delay, duration = 1.2) => ({
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
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                display: 'block',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.5s ease'
            }}
        >
            <path
                d="M12 3.5L4 7.5L12 11.5L20 7.5L12 3.5Z"
                stroke="#ffffff"
                pathLength="1"
                style={commonStyle(0, 1.5)}
            />
            <path
                d="M6 9V14C6 14 12 17.5 12 17.5C12 17.5 18 14 18 9"
                stroke="#ffffff"
                pathLength="1"
                style={commonStyle(0.3, 1.0)}
            />
            <path
                d="M20 7.5V14"
                stroke="#d49d81"
                pathLength="1"
                style={commonStyle(0.6, 0.8)}
            />
        </svg>
    );
};

export default ResumeIcon;
