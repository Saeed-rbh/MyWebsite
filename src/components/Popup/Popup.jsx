import React, { useEffect, useState, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import styles from './Popup.module.css';

const Popup = ({ isOpen, onClose, title, content }) => {
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

    const transitions = useTransition(isOpen, {
        from: { opacity: 0, transform: 'scale(0.5) translateY(50px)' },
        enter: { opacity: 1, transform: 'scale(1) translateY(0px)' },
        leave: { opacity: 0, transform: 'scale(0.5) translateY(50px)' },
        config: { tension: 200, friction: 15, clamp: true }
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
