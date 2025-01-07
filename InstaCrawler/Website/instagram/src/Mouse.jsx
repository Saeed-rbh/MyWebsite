import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import "./Mouse.css";

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const Mouse = () => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [hoveringClickableElement, setHoveringClickableElement] =
    useState(false);
  const domTarget = useRef(null);

  const [{ ringX, ringY }, ringApi] = useSpring(() => ({
    ringX: 0,
    ringY: 0,
    config: { mass: 2, tension: 350, friction: 60 },
  }));

  const [{ dotX, dotY }, dotApi] = useSpring(() => ({
    dotX: 0,
    dotY: 0,
    config: { mass: 3, tension: 170, friction: 50 },
  }));

  useEffect(() => {
    if (!isMobile()) {
      const handleMouseMove = (event) => {
        const px = event.clientX;
        const py = event.clientY;

        if (window.getComputedStyle(event.target).cursor === "pointer") {
          setHoveringClickableElement(true);
        } else {
          setHoveringClickableElement(false);
        }

        ringApi.start({
          ringX: px,
          ringY: py,
        });

        dotApi.start({
          dotX: px,
          dotY: py,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [ringApi, dotApi, hoveringClickableElement, mouseClicked]);

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setMouseClicked(true);
    }
  };

  const handleMouseUp = () => {
    setMouseClicked(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="container">
      <animated.div
        ref={domTarget}
        className="ring"
        style={{
          transform: to(
            [ringX, ringY],
            (rx, ry) => `translate(${rx}px, ${ry}px)`
          ),
          width: !mouseClicked ? "30px" : "6px",
          height: !mouseClicked ? "30px" : "6px",
          top: !mouseClicked ? "-17px" : "-5px",
          left: !mouseClicked ? "-17px" : "-5px",
          // backgroundColor: hoveringClickableElement
          //   ? "rgba(255, 0, 0, 0.5)"
          //   : "rgba(0, 0, 0, 0.2)",
        }}
      ></animated.div>

      <animated.div
        className="dot"
        style={{
          transform: to(
            [dotX, dotY],
            (dx, dy) => `translate(${dx}px, ${dy}px)`
          ),
          width: !mouseClicked ? "10px" : "12px",
          height: !mouseClicked ? "10px" : "12px",
          top: !mouseClicked ? "-5px" : "-6px",
          left: !mouseClicked ? "-5px" : "-6px",
        }}
      ></animated.div>
    </div>
  );
};

export default Mouse;
