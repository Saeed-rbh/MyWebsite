import React, { useEffect, useState, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import styles from './Popup.module.css';

const Popup = ({ isOpen, onClose, title, content, originRect }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
            // Reset scroll on open
            setScrollProgress(0);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            const scrollRange = scrollHeight - clientHeight;
            const scrollPercentage = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, Math.round(scrollPercentage))));
        }
    };

    const getAnimationProps = () => {
        if (!originRect) {
            return {
                from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
                enter: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                leave: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' }
            };
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Modal center (screen center)
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;

        // Origin center
        const originX = originRect.left + originRect.width / 2;
        const originY = originRect.top + originRect.height / 2;

        const deltaX = originX - centerX;
        const deltaY = originY - centerY;

        // Approximate final dimensions
        const finalWidth = Math.min(800, windowWidth * 0.9);
        const finalHeight = Math.min(windowHeight * 0.75, windowHeight * 0.9); // CSS max-height: 75vh

        const scaleX = originRect.width / finalWidth;
        const scaleY = originRect.height / finalHeight;
        const startScale = Math.min(scaleX, scaleY); // Keep aspect ratio roughly or just use average

        return {
            from: { opacity: 0, transform: `translate(${deltaX}px, ${deltaY}px) scale(${startScale})` },
            enter: { opacity: 1, transform: 'translate(0px, 0px) scale(1)' },
            leave: { opacity: 0, transform: `translate(${deltaX}px, ${deltaY}px) scale(${startScale})` }
        };
    };

    const animationProps = getAnimationProps();

    const transitions = useTransition(isOpen, {
        from: animationProps.from,
        enter: animationProps.enter,
        leave: animationProps.leave,
        config: { mass: 1, tension: 220, friction: 26, clamp: false } // Gentler bounce
    });

    return transitions(
        (style, item) => item && (
            <animated.div className={styles.overlay} style={{ opacity: style.opacity }} onClick={onClose}>
                <animated.div
                    className={styles.modal}
                    style={{
                        transform: style.transform,
                        opacity: style.opacity
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                    {title && <h2 className={styles.title}>{title}</h2>}

                    {/* Scroll Indicator */}
                    <div className={styles.scrollIndicatorContainer}>
                        <div
                            className={styles.scrollProgressBar}
                            style={{ height: `${scrollProgress}%` }}
                        />
                        {/* Floating Number Indicator */}
                        <div
                            className={styles.scrollNumber}
                            style={{
                                top: `${scrollProgress}%`
                            }}
                        >
                            {scrollProgress}%
                        </div>
                    </div>

                    <div
                        className={styles.content}
                        ref={contentRef}
                        onScroll={handleScroll}
                    >
                        {content}
                    </div>
                </animated.div>
            </animated.div>
        )
    );
};

export default Popup;
