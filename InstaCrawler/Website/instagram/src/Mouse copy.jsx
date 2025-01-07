// import React, { useState, useEffect } from "react";
// import "./Mouse.css";

// const Mouse = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [mouseClicked, setMouseClicked] = useState(false);
//   const [hoveringText, setHoveringText] = useState(false);
//   const [mouseOut, setMouseOut] = useState(false);
//   const [hoveringClickableElement, setHoveringClickableElement] =
//     useState(false);

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       setMouseOut(false);
//       if (window.getComputedStyle(event.target).cursor === "pointer") {
//         setHoveringClickableElement(true);
//         setHoveringText(true);
//       } else {
//         setHoveringClickableElement(false);
//         setHoveringText(false);
//       }
//     };
//     const handleMouseOut = (event) => {
//       setMouseOut(true);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseout", handleMouseOut);
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseout", handleMouseOut);
//     };
//   }, []);
//   useEffect(() => {
//     let animationFrameId = null;
//     let mouseMoveEvent = null;

//     const mouseMoveHandler = (event) => {
//       mouseMoveEvent = event;
//       if (window.getComputedStyle(event.target).cursor === "pointer") {
//         setHoveringClickableElement(true);
//       } else {
//         setHoveringClickableElement(false);
//       }
//     };

//     const animate = () => {
//       if (mouseMoveEvent) {
//         const { clientX, clientY } = mouseMoveEvent;
//         setMousePosition({ x: clientX, y: clientY });
//         mouseMoveEvent = null;
//       }
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();
//     document.addEventListener("mousemove", mouseMoveHandler);

//     return () => {
//       document.removeEventListener("mousemove", mouseMoveHandler);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleMouseUp = () => setMouseClicked(false);
//     const handleMouseDown = (event) =>
//       event.button === 0 && setMouseClicked(true);
//     document.addEventListener("mouseup", handleMouseUp);
//     document.addEventListener("mousedown", handleMouseDown);
//     return () => {
//       document.removeEventListener("mouseup", handleMouseUp);
//       document.removeEventListener("mousedown", handleMouseDown);
//     };
//   }, []);

//   return windowWidth > 520 ? (
//     <div onClick={() => setMouseClicked(!mouseClicked)}>
//       <div
//         className="ring"
//         style={{
//           left: `${mousePosition.x}px`,
//           top: `${mousePosition.y}px`,
//           width: !mouseClicked ? "30px" : "5px",
//           height: !mouseClicked ? "30px" : "5px",
//           opacity: hoveringText || mouseOut ? "0" : "1", // Change opacity based on mouseOut state
//         }}
//       ></div>
//       <div
//         className="dot"
//         style={{
//           left: `${mousePosition.x}px`,
//           top: `${mousePosition.y}px`,
//           width: mouseClicked
//             ? "10px"
//             : hoveringClickableElement
//             ? "35px"
//             : "10px",
//           height: mouseClicked
//             ? "10px"
//             : hoveringClickableElement
//             ? "35px"
//             : "10px",
//           mixBlendMode: hoveringText ? "screen" : "normal",
//           opacity: mouseOut ? "0" : "1", // Change opacity based on mouseOut state
//         }}
//       ></div>
//     </div>
//   ) : null;
// };

// export default Mouse;

import React, { useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import "./MouseFollow.css";

// Utility functions for calculating rotations
const calcX = (y) => `-${(y - window.innerHeight / 2) / 20}`;
const calcY = (x) => `${(x - window.innerWidth / 2) / 20}`;
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const MouseFollow = () => {
  const domTarget = useRef(null);

  const [{ x, y, rotateX, rotateY, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  useEffect(() => {
    const handleMouseMove = (event) => {
      const px = event.clientX;
      const py = event.clientY;

      api.start({
        x: px - window.innerWidth / 2,
        y: py - window.innerHeight / 2,
        rotateX: calcX(py),
        rotateY: calcY(px),
        scale: 1.1,
      });
    };

    if (!isMobile()) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [api]);

  useGesture(
    {
      onDrag: ({ active, offset: [x, y] }) =>
        api.start({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.1 }),
    },
    { domTarget, eventOptions: { passive: false }, enabled: isMobile() }
  );

  return (
    <div className="container">
      <animated.div
        ref={domTarget}
        className="follow-card"
        style={{
          transform: "perspective(600px)",
          x,
          y,
          scale: to([scale], (s) => s),
          rotateX,
          rotateY,
        }}
      >
        <div className="follower-dot" />
      </animated.div>
    </div>
  );
};

export default MouseFollow;
