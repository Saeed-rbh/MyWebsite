import React, { useEffect, useState, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import styles from './Popup.module.css';

const Popup = ({ isOpen, onClose, title, content, originRect, onNext, onPrev, hasNext, hasPrev, nextTitle, prevTitle }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef(null);

    const [isExiting, setIsExiting] = useState(false);
    const [activeData, setActiveData] = useState({
        title: null,
        content: null,
        prevTitle: null,
        nextTitle: null,
        hasPrev: false,
        hasNext: false
    });

    useEffect(() => {
        if (isOpen) {
            if (activeData.title && (title !== activeData.title || content !== activeData.content)) {
                setIsExiting(true);
                const timer = setTimeout(() => {
                    setActiveData({ title, content, prevTitle, nextTitle, hasPrev, hasNext });
                    setIsExiting(false);
                    setScrollProgress(0);
                    if (contentRef.current) {
                        contentRef.current.scrollTop = 0;
                    }
                }, 250);
                return () => clearTimeout(timer);
            } else {
                setActiveData({ title, content, prevTitle, nextTitle, hasPrev, hasNext });
            }
        } else {
            setActiveData({
                title: null,
                content: null,
                prevTitle: null,
                nextTitle: null,
                hasPrev: false,
                hasNext: false
            });
        }
    }, [isOpen, title, content, prevTitle, nextTitle, hasPrev, hasNext]);

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
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                    </button>
                    {activeData.title && <h2 className={`${styles.title} ${isExiting ? styles.titleExit : styles.titleAnimate}`}>{activeData.title}</h2>}
 
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
                         className={`${styles.content} ${isExiting ? "popup-content-exiting" : ""}`}
                         ref={contentRef}
                         onScroll={handleScroll}
                     >
                         {activeData.content}
                                                 <div className={styles.navigationButtons} style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                             {activeData.hasPrev && activeData.prevTitle ? (
                                 <button onClick={onPrev} style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#d49d81", padding: "0.6rem 1.2rem", borderRadius: "30px", cursor: "pointer", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }} onMouseOver={e => e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e => e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>
                                     <span>&larr;</span> {activeData.prevTitle}
                                 </button>
                             ) : <div></div>}
                             {activeData.hasNext && activeData.nextTitle ? (
                                 <button onClick={onNext} style={{ background: "rgba(212, 157, 129, 0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(212, 157, 129, 0.3)", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "30px", cursor: "pointer", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }} onMouseOver={e => { e.currentTarget.style.background="rgba(212, 157, 129, 0.25)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(212,157,129,0.2)"; }} onMouseOut={e => { e.currentTarget.style.background="rgba(212, 157, 129, 0.15)"; e.currentTarget.style.boxShadow="none"; }}>
                                     {activeData.nextTitle} <span>&rarr;</span>
                                 </button>
                             ) : <div></div>}
                         </div>
                     </div>
                </animated.div>
            </animated.div>
        )
    );
};

export default Popup;
