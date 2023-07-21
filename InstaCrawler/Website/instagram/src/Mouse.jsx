import React, { useState, useEffect } from "react";
import "./Mouse.css";

const Mouse = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [hoveringText, setHoveringText] = useState(false);
  const [mouseOut, setMouseOut] = useState(false);
  const [hoveringClickableElement, setHoveringClickableElement] =
    useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouseOut(false);
      if (window.getComputedStyle(event.target).cursor === "pointer") {
        setHoveringClickableElement(true);
        setHoveringText(true);
      } else {
        setHoveringClickableElement(false);
        setHoveringText(false);
      }
    };
    const handleMouseOut = (event) => {
      setMouseOut(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);
  useEffect(() => {
    let animationFrameId = null;
    let mouseMoveEvent = null;

    const mouseMoveHandler = (event) => {
      mouseMoveEvent = event;
      if (window.getComputedStyle(event.target).cursor === "pointer") {
        setHoveringClickableElement(true);
      } else {
        setHoveringClickableElement(false);
      }
    };

    const animate = () => {
      if (mouseMoveEvent) {
        const { clientX, clientY } = mouseMoveEvent;
        setMousePosition({ x: clientX, y: clientY });
        mouseMoveEvent = null;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => setMouseClicked(false);
    const handleMouseDown = (event) =>
      event.button === 0 && setMouseClicked(true);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return windowWidth > 520 ? (
    <div onClick={() => setMouseClicked(!mouseClicked)}>
      <div
        className="ring"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: !mouseClicked ? "30px" : "5px",
          height: !mouseClicked ? "30px" : "5px",
          opacity: hoveringText || mouseOut ? "0" : "1", // Change opacity based on mouseOut state
        }}
      ></div>
      <div
        className="dot"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: mouseClicked
            ? "10px"
            : hoveringClickableElement
            ? "35px"
            : "10px",
          height: mouseClicked
            ? "10px"
            : hoveringClickableElement
            ? "35px"
            : "10px",
          mixBlendMode: hoveringText ? "screen" : "normal",
          opacity: mouseOut ? "0" : "1", // Change opacity based on mouseOut state
        }}
      ></div>
    </div>
  ) : null;
};

export default Mouse;
