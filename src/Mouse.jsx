import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useSelector } from "react-redux";
import "./Mouse.css";
import { use } from "react";

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const Mouse = () => {
  const [mouseClicked, setMouseClicked] = useState(false);
  const [hoveringClickableElement, setHoveringClickableElement] =
    useState(false);
  const [hoveringTitle, setHoveringTitle] = useState(false);
  const domTarget = useRef(null);

  const { stages } = useSelector((state) => state.data);

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
        const target = event.target;

        if (target) {
          // Detect if hovering over a title
          const isTitle = target.closest("h1, h2, h3, [class*='Title'], [class*='title']");
          setHoveringTitle(!!isTitle);

          // Detect if hovering over a clickable element
          if (window.getComputedStyle(target).cursor === "pointer") {
            setHoveringClickableElement(true);
          } else {
            setHoveringClickableElement(false);
          }
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
  }, [ringApi, dotApi, hoveringClickableElement, hoveringTitle, mouseClicked]);

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

  const ringStyle = useSpring({
    opacity: hoveringTitle ? 1 : hoveringClickableElement ? 0.5 : 1,
    width: hoveringTitle
      ? "60px"
      : hoveringClickableElement
      ? "50px"
      : !mouseClicked
      ? "30px"
      : "6px",
    height: hoveringTitle
      ? "60px"
      : hoveringClickableElement
      ? "50px"
      : !mouseClicked
      ? "30px"
      : "6px",
    top: hoveringTitle
      ? "-32px"
      : hoveringClickableElement
      ? "-27px"
      : !mouseClicked
      ? "-17px"
      : "-5px",
    left: hoveringTitle
      ? "-32px"
      : hoveringClickableElement
      ? "-27px"
      : !mouseClicked
      ? "-17px"
      : "-5px",
    backgroundColor: hoveringTitle
      ? "rgba(212, 157, 129, 0)"
      : hoveringClickableElement
      ? "rgba(212, 157, 129, 0.1)"
      : "rgba(212, 157, 129, 0)",
  });

  const dotStyle = useSpring({
    opacity: hoveringTitle ? 0 : 1,
    width: hoveringTitle
      ? "0px"
      : hoveringClickableElement
      ? "50px"
      : !mouseClicked
      ? "10px"
      : "12px",
    height: hoveringTitle
      ? "0px"
      : hoveringClickableElement
      ? "50px"
      : !mouseClicked
      ? "10px"
      : "12px",
    top: hoveringTitle
      ? "0px"
      : hoveringClickableElement
      ? "-25px"
      : !mouseClicked
      ? "-5px"
      : "-6px",
    left: hoveringTitle
      ? "0px"
      : hoveringClickableElement
      ? "-25px"
      : !mouseClicked
      ? "-5px"
      : "-6px",
  });

  return (
    <div
      className="container"
      style={{ display: !stages[1] ? "flex" : "none" }}
    >
      <animated.div
        ref={domTarget}
        className="ring"
        style={{
          ...ringStyle,
          transform: to(
            [ringX, ringY],
            (rx, ry) => `translate(${rx}px, ${ry}px)`
          ),
        }}
      ></animated.div>

      <animated.div
        className="dot"
        style={{
          ...dotStyle,
          transform: to(
            [dotX, dotY],
            (dx, dy) => `translate(${dx}px, ${dy}px)`
          ),
          mixBlendMode: hoveringClickableElement ? "darken" : "normal",
        }}
      ></animated.div>
    </div>
  );
};

export default Mouse;
