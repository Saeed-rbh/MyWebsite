import React, { useRef, useState, useCallback } from "react";
import { animated } from "react-spring";
import NextLast from "./NextLast";
import CapturedMomentsLines from "./CapturedMomentsLines";
import useMouseMove from "./useMouseMove";

const useDragState = () => {
  const [dragging, setDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const dragStart = useRef();

  const resetDragState = () => {
    dragStart.current = null;
    setDragging(false);
    setDragged(false);
  };

  return {
    dragging,
    setDragging,
    dragged,
    setDragged,
    dragStart,
    resetDragState,
  };
};

const MainImages = ({
  springs,
  IMGsprings,
  IMGBsprings,
  folderImages,
  cartSituation,
  lohi,
  handleShow,
  currentImageIndex,
  setCurrentImageIndex,
  phase,
}) => {
  const { dragging, setDragging, dragStart, resetDragState } = useDragState();
  const [bounce, setBounce] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const isWithinBoundary = (direction) =>
    (direction === "right" && currentImageIndex > 0) ||
    (direction === "left" && currentImageIndex < folderImages.length - 4);

  const moveImage = useCallback(
    (direction, delta) => {
      if (isWithinBoundary(direction)) {
        setBounce(true);
        setCurrentImageIndex((prevIndex) => prevIndex + delta);
        resetDragState();
      }
    },
    [setCurrentImageIndex, resetDragState, folderImages.length]
  );

  const handleDragEvents = useDragEvents({
    dragging,
    setDragging,
    dragStart,
    currentImageIndex,
    moveImage,
  });

  const springProps = useMouseMove(50);

  return (
    <>
      <CapturedMomentsLines
        bounce={bounce}
        setBounce={setBounce}
        phase={phase}
      />
      <animated.div
        style={springProps}
        className="CapturedMomentsImages"
        {...handleDragEvents}
      >
        {springs.map((springProps, index) => (
          <ImageContainer
            key={index}
            springProps={springProps}
            imageSrc={folderImages[index]}
            imgSpring={IMGsprings[index]}
            imgBorderSpring={IMGBsprings[index]}
            setHoveredId={() => setHoveredId(index)}
          />
        ))}
      </animated.div>
      <NextLast
        cartSituation={cartSituation}
        handleClickMove={(dir) => moveImage(dir, dir === "right" ? -1 : 1)}
        lohi={lohi}
        handleShow={handleShow}
      />
    </>
  );
};

const ImageContainer = ({
  springProps,
  imageSrc,
  imgSpring,
  imgBorderSpring,
  setHoveredId,
}) => (
  <animated.div
    className="CapturedMomentsImg"
    style={springProps}
    onMouseEnter={setHoveredId}
    onMouseLeave={() => setHoveredId(null)}
  >
    <animated.img src={imageSrc} style={imgSpring || {}} draggable="false" />
    <animated.div
      className="CapturedMomentsborder"
      style={imgBorderSpring || {}}
    ></animated.div>
  </animated.div>
);

const useDragEvents = ({
  dragging,
  setDragging,
  dragStart,
  currentImageIndex,
  moveImage,
}) => {
  const handleMouseDown = useCallback(
    (e) => {
      dragStart.current = e.clientX;
      setDragging(true);
    },
    [setDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setDragging(false), [setDragging]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;

      const dragEnd = e.clientX;
      const dragDistance = dragEnd - dragStart.current;

      const direction = dragDistance > 10 ? "right" : "left";
      const delta = direction === "right" ? -1 : 1;

      moveImage(direction, delta);
    },
    [dragging, dragStart, currentImageIndex, moveImage]
  );

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onMouseMove: handleMouseMove,
  };
};

export default MainImages;
