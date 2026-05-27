import React from 'react';

const ResearchStoryIcon = ({ isHovered }) => {
    const commonStyle = (delay) => ({
        strokeDasharray: 1,
        strokeDashoffset: isHovered ? 0 : 1,
        transition: `stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, opacity 0.5s ease`,
        opacity: isHovered ? 1 : 0,
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
            style={{
                display: 'block',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.5s ease'
            }}
        >
            {/* Central Hexagon */}
            <path
                d="M12 4 L16.33 6.5 L16.33 11.5 L12 14 L7.67 11.5 L7.67 6.5 Z"
                pathLength="1"
                style={commonStyle(0)}
            />
            {/* Bottom Right Hexagon */}
            <path
                d="M16.33 11.5 L20.66 14 L20.66 19 L16.33 21.5 L12 19 L12 14 Z"
                pathLength="1"
                style={commonStyle(0.3)}
            />
            {/* Bottom Left Hexagon */}
            <path
                d="M7.67 11.5 L12 14 L12 19 L7.67 21.5 L3.34 19 L3.34 14 Z"
                pathLength="1"
                style={commonStyle(0.6)}
            />

            {/* Nodes / Carbon atoms that appear at the vertices */}
            <g style={{
                opacity: isHovered ? 1 : 0,
                transition: isHovered ? 'opacity 0.6s ease 1s, transform 0.6s ease 1s' : 'opacity 0.3s ease, transform 0.3s ease',
                transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                transformOrigin: 'center',
                fill: 'currentColor'
            }}>
                <circle cx="12" cy="4" r="1.5" stroke="none" />
                <circle cx="16.33" cy="6.5" r="1.5" stroke="none" />
                <circle cx="16.33" cy="11.5" r="1.5" stroke="none" />
                <circle cx="12" cy="14" r="1.5" stroke="none" />
                <circle cx="7.67" cy="11.5" r="1.5" stroke="none" />
                <circle cx="7.67" cy="6.5" r="1.5" stroke="none" />

                <circle cx="20.66" cy="14" r="1.5" stroke="none" />
                <circle cx="20.66" cy="19" r="1.5" stroke="none" />
                <circle cx="16.33" cy="21.5" r="1.5" stroke="none" />
                <circle cx="12" cy="19" r="1.5" stroke="none" />

                <circle cx="7.67" cy="21.5" r="1.5" stroke="none" />
                <circle cx="3.34" cy="19" r="1.5" stroke="none" />
                <circle cx="3.34" cy="14" r="1.5" stroke="none" />
            </g>
        </svg>
    );
};

export default ResearchStoryIcon;
