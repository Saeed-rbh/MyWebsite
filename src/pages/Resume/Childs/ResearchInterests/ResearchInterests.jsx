import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { useUtilize } from "../../Styles/useUtilize";
import { useSelector } from "react-redux";
import useScrollPosition from "../../General/useScrollPosition";
import { useCombinedAnimation } from "../../Styles/otherStyles";
import { useInView } from "react-intersection-observer";
import useElementSize from "../../Styles/useElementSize";
import { useScrollableRef } from "../../General/ScrollableRefContext";

const ResearchInterests = () => {
  const componentName = "ResearchInterests";
  const {
    id,
    list,
    size,
    title,
    name,
    top,
    adjustViewport,
    adjustTop,
    isActive,
  } = useUtilize(componentName);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const { stages, toggle } = useSelector((state) => state.data);
  const scrollableRef = useScrollableRef();
  const { scrollTop } = useScrollPosition(scrollableRef);
  const elementSize = useElementSize("MoreInfoAcademic").width;

  // Duplicate list to create seamless loop effect (4 sets to cover wide screens)
  const extendedList = [...list, ...list, ...list, ...list];

  // Continuous scroll animation
  const scrollAnimation = useSpring({
    from: { transform: "translateX(0%)" },
    to: { transform: "translateX(-25%)" }, // Move 1 set length (1/4 of total)
    loop: true,
    config: { duration: 50000, easing: (t) => t }, // Linear easing, very slow speed
  });

  const style = {
    borderRadius: "40px",
    height: `${size[0]}px`, // Always single row height
    cursor: "default",
    filter: "blur(0px)",
    opacity: "1",
    overflow: "visible", // Show title (which has negative margin)
    // Mask div below handles content clipping
    border: "2px solid rgba(212, 157, 129, 0.2)",
    zIndex: "10",
    width: stages[1] ? Math.min(elementSize * 0.97, size[1]) : size[1],
    left: stages[1]
      ? (elementSize - Math.min(elementSize * 0.97, size[1])) / 2
      : 0,
    boxSize: "border-box",
    top: stages[1] ? top : top + adjustTop,
  };

  const Main = {
    padding: "11px 10px", // Consistent single-row padding
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap", // Force single line
    alignItems: "center",
    width: "fit-content", // Allow container to expand with content
    height: "100%",
    margin: "0", // Reset margin for precise scrolling
    boxSizing: "border-box",
    whiteSpace: "nowrap", // Keep items in one line
  };

  const [initial, setInitial] = useState(false);
  const combinedStyle = useCombinedAnimation({
    top,
    adjustViewport,
    size,
    scrollTop,
    toggle,
    name,
    id,
    inView,
    isActive,
    initial,
    setInitial,
  });

  // Pause animation on hover
  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = useSpring({
    pause: isHovered,
  });

  return (
    <animated.div
      ref={ref}
      style={{ ...style, ...combinedStyle }}
      className={name}
      id={name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <animated.h1 style={{ marginTop: "-13px", marginLeft: "25px", position: "absolute", zIndex: 20 }}>
        {title}
      </animated.h1>

      {/* Scroll Container Mask */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>

        {/* Scrolling Content */}
        <animated.div
          className="RInterests"
          style={{
            ...Main,
            ...scrollAnimation,
            // Merge pause logic if possible, or just rely on CSS hover pause if simplicity preferred.
            // React-spring play/pause control is complex with loop=true. 
            // For simplicity, we'll keep it running or use a keyframe approach if needed.
            // But let's stick to the basic infinite loop first. 
          }}
        >
          {extendedList.map((topic, index) => (
            <a
              key={`${topic.label}-${index}`}
              href={topic.href}
              style={{
                margin: "0 5px", // Tighter spacing
                padding: "10px 20px", // Increased internal padding
                display: "inline-block",
                flexShrink: 0, // Prevent shrinking
              }}
            >
              {topic.label}
            </a>
          ))}
        </animated.div>
      </div>
    </animated.div>
  );
};

export default ResearchInterests;
