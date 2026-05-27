import React from 'react';

const WhatsAppIcon = ({ isHovered }) => {
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
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                pathLength="1"
                style={commonStyle(0, 1.2)}
            />
            <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                transform="translate(5.5, 5.5) scale(0.55)"
                stroke="#d49d81"
                strokeWidth="2.7"
                fill={isHovered ? "#d49d81" : "transparent"}
                pathLength="1"
                style={{
                    ...commonStyle(0.4, 0.8),
                    transition: isHovered
                        ? `stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, fill 0.6s ease 1s, opacity 0.5s ease`
                        : `stroke-dashoffset 0.8s ease, fill 0.3s ease, opacity 0.3s ease`
                }}
            />
        </svg>
    );
};

export default WhatsAppIcon;
