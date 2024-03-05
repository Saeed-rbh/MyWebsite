import React, { useState, useRef } from "react";
import { useSpring, animated } from "react-spring";

const GrapheneInfo = ({ screenHeight, endAnimation }) => {
  const [focused, setFocused] = useState([0, 0]);
  const screenWidth = window.innerWidth;
  const InfoStyle = {
    position: "fixed",
    top: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    left: 0,
    paddingLeft: screenWidth / 2 - 150,
    width: "100%",
    height: 330,
  };

  const TitleStyle = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: endAnimation ? 0.75 : 0,
    },
    config: {
      tension: 70,
      friction: 15,
    },
    // delay: 1100,
  });

  const OutSpecStyles = {
    position: "absolute",
    top: 0,
    height: 300,
    width: 300,
    // borderRadius: 20,
    borderRadius: "50px 50px 20px 50px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  };
  const InSpecStyles = {
    position: "absolute",

    x: 25,
    height: 60,
    width: 220,
    borderRadius: "100px 100px 100px 10px",
    backgroundColor: "rgba(250, 250, 250, 0.1)",
    zIndex: 12,
    backdropFilter: "blur(100px)",
    border: "2px solid rgba(212, 157, 129, 0.8)",
    WebkitBackdropFilter: "blur(100px)",
    isolation: "isolate",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 11,
    color: "#fff",
    fontFamily: `"Poppins", sans-serif`,
    fontWeight: "500",
    padding: "0 15px",
  };

  const specIds = [0, 1, 2, 3, 4];

  const AnimatedSpec = ({ endAnimation, styleIn, styleOut, id, onClick }) => {
    console.log(id, focused[1]);

    const InSpecStyles = useSpring({
      from: {
        opacity: endAnimation ? (id !== focused[1] ? 0.75 : 0.2) : 0,
        scale: id !== focused[1] ? 1 : 0.7,
        marginLeft: id === focused[1] ? (id > focused[1] ? -25 : 25) : 0,
        marginRight: id === focused[1] ? (id > focused[1] ? -25 : 25) : 0,
        left:
          focused[0] > id && id < focused[1] - 1
            ? screenWidth / 2 -
              150 +
              300 * id -
              300 * focused[0] +
              specIds.length * 300
            : screenWidth / 2 - 150 + 300 * id - 300 * focused[0],
      },
      to: {
        opacity:
          (id < focused[1] - 1 || id > focused[1] + 1) &&
          focused[1] - specIds.length + 1 !== id
            ? 0
            : endAnimation
            ? id === focused[1]
              ? 0.75
              : 0.2
            : 0,
        scale: id === focused[1] ? 1 : 0.7,
        marginLeft:
          focused[1] - specIds.length + 1 === id
            ? -25
            : id !== focused[1]
            ? id > focused[1]
              ? -25
              : 25
            : 0,
        marginRight:
          focused[1] - specIds.length + 1 === id
            ? -25
            : id !== focused[1]
            ? id > focused[1]
              ? -25
              : 25
            : 0,
        left:
          focused[1] > id && id < focused[1] - 1
            ? screenWidth / 2 -
              150 +
              300 * id -
              300 * focused[1] +
              specIds.length * 300
            : screenWidth / 2 - 150 + 300 * id - 300 * focused[1],
      },
      config: { tension: 70, friction: 15 },
      key: id,
    });

    const OutSpecStyles = useSpring({
      from: {
        opacity: endAnimation ? (id !== focused[1] ? 0.75 : 0) : 0,

        marginLeft: id === focused[1] ? (id > focused[1] ? -25 : 25) : 0,
        marginRight: id === focused[1] ? (id > focused[1] ? -25 : 25) : 0,
        left:
          focused[0] > id && id < focused[1] - 1
            ? screenWidth / 2 -
              150 +
              300 * id -
              300 * focused[0] +
              specIds.length * 300
            : screenWidth / 2 - 150 + 300 * id - 300 * focused[0],
      },
      to: {
        opacity:
          (id < focused[1] - 1 || id > focused[1] + 1) &&
          focused[1] - specIds.length + 1 !== id
            ? 0
            : endAnimation
            ? id === focused[1]
              ? 0.75
              : 0
            : 0,
        // scale: id === focused[1] ? 1 : 0.7,
        marginLeft:
          focused[1] - specIds.length + 1 === id
            ? -25
            : id !== focused[1]
            ? id > focused[1]
              ? -25
              : 25
            : 0,
        marginRight:
          focused[1] - specIds.length + 1 === id
            ? -25
            : id !== focused[1]
            ? id > focused[1]
              ? -25
              : 25
            : 0,
        left:
          focused[1] > id && id < focused[1] - 1
            ? screenWidth / 2 -
              150 +
              300 * id -
              300 * focused[1] +
              specIds.length * 300
            : screenWidth / 2 - 150 + 300 * id - 300 * focused[1],
      },
      config: { tension: 70, friction: 15 },
      key: id,
      delay: { top: 500 },
    });

    const OutSpecTopStyles = useSpring({
      from: {
        top: endAnimation ? (id !== focused[1] ? 265 : 295) : 295,
        opacity: 0,
      },
      to: {
        top: endAnimation ? (id === focused[1] ? 265 : 295) : 295,
        opacity: endAnimation
          ? id === focused[1]
            ? 0.75
            : 0
          : (id < focused[1] - 1 || id > focused[1] + 1) &&
            focused[1] - specIds.length + 1 !== id
          ? 0
          : endAnimation
          ? id === focused[1]
            ? 0.75
            : 0
          : 0,
      },
      config: { tension: 70, friction: 15 },
      delay: 500,
    });

    return (
      <>
        <animated.div
          style={{ ...OutSpecStyles, ...styleIn, ...OutSpecTopStyles }}
          onClick={() => onClick(id)}
        >
          Graphene good Graphene is good is good is good is good Graphene is
        </animated.div>
        <animated.div
          style={{ ...InSpecStyles, ...styleOut }}
          onClick={() => onClick(id)}
        ></animated.div>
      </>
    );
  };

  const specs = specIds.map((id) => (
    <AnimatedSpec
      key={id}
      id={id}
      endAnimation={endAnimation}
      styleIn={InSpecStyles}
      styleOut={OutSpecStyles}
      onClick={() => focused[1] !== id && setFocused([focused[1], id])}
    />
  ));

  const [direction, setDirection] = useState("");
  let startX, startY, endX, endY;

  // Minimum distance (in pixels) a gesture must span to be considered a swipe
  const minDistance = 50;

  const onTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleGesture();
  };

  const handleGesture = () => {
    const distX = endX - startX;
    const distY = endY - startY;

    if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > minDistance) {
      const swipeDirection = distX > 0 ? "right" : "left";
      setDirection(swipeDirection);
      console.log(`Detected swipe ${swipeDirection}`);

      if (swipeDirection === "left") {
        if (focused[1] < specIds.length - 1) {
          setFocused([focused[1], focused[1] + 1]);
        } else if (focused[1] === specIds.length - 1) {
          setFocused([focused[1], 0]);
        }
      } else if (swipeDirection === "right") {
        if (focused[1] > 0) {
          setFocused([focused[1], focused[1] - 1]);
        } else if (focused[1] === 0) {
          setFocused([focused[1], specIds.length - 1]);
        }
      }
    }
  };

  return (
    <animated.div
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ ...TitleStyle, ...InfoStyle }}
    >
      {specs}
    </animated.div>
  );
};

export default React.memo(GrapheneInfo);
