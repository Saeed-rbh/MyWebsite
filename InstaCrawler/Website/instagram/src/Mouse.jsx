import "./Mouse.css";
import React, { useState, useEffect } from "react";

const Mouse = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMoveHandler = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  useEffect(() => {
    const handleMouseUp = (event) => {
      setMouseClicked(false);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseClick = (event) => {
      if (event.button === 0) {
        setMouseClicked(true);
      }
    };
    document.addEventListener("mousedown", handleMouseClick);
    return () => {
      document.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);

  const [MouseClicked, setMouseClicked] = useState(false);

  return (
    <div onClick={() => setMouseClicked(!MouseClicked)}>
      <div
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: !MouseClicked ? "30px" : "5px",
          height: !MouseClicked ? "30px" : "5px",
        }}
        className="ring"
      ></div>
      <div
        className="dot"
        style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
      ></div>
    </div>
  );
};

export default Mouse;
