import React, { useState, useEffect, useCallback, useRef } from "react";
import { easings, useSpring, useSprings, animated } from "react-spring";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "./Moments.css";
import { useHover } from "./Helper";

const MAX_LEFT = -270;
const MIN_LEFT = 0;
const STEP = 90;
const STEP_ADJUSTMENT = 2;
const N = 4;

const useArrowsVisibility = (isScrollable, position) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    if (isScrollable) {
      setShowLeftArrow(position < MIN_LEFT);
      setShowRightArrow(position > MAX_LEFT);
    }
  }, [isScrollable, position]);

  return { showLeftArrow, showRightArrow };
};

const useMouseDrag = (position, updatePosition) => {
  const [startX, setStartX] = useState(0);

  const handleMouseDown = useCallback(
    (e) => setStartX(e.clientX - position),
    [position]
  );

  const handleMouseUp = () => setStartX(0);

  const handleMouseMove = useCallback(
    (e) => startX && updatePosition(e.clientX - startX),
    [startX, updatePosition]
  );

  return { handleMouseDown, handleMouseUp, handleMouseMove };
};

const Moments = ({ storiesData, currentFolder, handleClickPick }) => {
  const [position, setPosition] = useState(0);
  const [{ left }, setSpringProps] = useSpring(() => ({ left: 0 }));
  const isScrollable = storiesData.length > 5;
  const { showLeftArrow, showRightArrow } = useArrowsVisibility(
    isScrollable,
    position
  );
  const [clickedFolder, setClickedFolder] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  
  const springsM = useSprings(
    storiesData.length,
    storiesData.map((_, index) => ({
      from: { opacity: 0, x: index < 5 ? "-50px" : "0px" },
      to: { opacity: 1, x: "0px" },
      config: { duration: 500 },
      delay: 100 * index,
      easing: easings.easeOutCubic,
    }))
  );

  const springsI = useSprings(
    storiesData.length,
    storiesData.map((_, index) => ({
      from: { opacity: 0, x: index < 5 ? "-20px" : "0px" },
      to: { opacity: 1, x: "0px" },
      config: { duration: 300 },
      easing: easings.easeOutCubic,
    }))
  );

  const springsL = useSpring({
    from: { opacity: 0, x: "-50px" },
    to: {
      opacity: showLeftArrow ? 1 : 0,
      x: "0px",
      width: "50px",
    },
    config: { duration: 300 },
    easing: easings.easeOutCubic,
    delay: 500,
  });

  const springsR = useSpring({
    from: { opacity: 0, x: "-50px" },
    to: {
      opacity: showRightArrow ? 1 : 0,
      x: "0px",
    },
    config: { duration: 300 },
    easing: easings.easeOutCubic,
    delay: 500,
  });

  const updatePosition = useCallback(
    (newPosition) => {
      if (!isScrollable) return;
      newPosition = Math.round(newPosition / STEP) * STEP;
      newPosition = Math.min(Math.max(newPosition, MAX_LEFT), MIN_LEFT);
      setPosition(newPosition);
      setSpringProps({ left: newPosition });
    },
    [isScrollable, setSpringProps]
  );

  const { handleMouseDown, handleMouseUp, handleMouseMove } = useMouseDrag(
    position,
    updatePosition
  );

  const handleArrowClick = (direction) => {
    updatePosition(
      position + (direction === "left" ? STEP - STEP_ADJUSTMENT : -STEP)
    );
  };

  const handleStoryClick = (id) => {
    handleClickPick(id);
    setClickedFolder(id);
    const newPosition = -id * STEP;
    const someWidth = -4 * STEP;
    if (newPosition > position - someWidth) {
      updatePosition(newPosition);
    }
  };

  useEffect(() => {
    setClickedFolder(currentFolder);
  }, [currentFolder]);

  const prevCurrentFolderRef = useRef();
  const prevClickedFolderRef = useRef();
  useEffect(() => {
    const prevCurrentFolder = prevCurrentFolderRef.current;
    const prevClickedFolder = prevClickedFolderRef.current;

    if (
      currentFolder !== prevCurrentFolder ||
      clickedFolder !== prevClickedFolder
    ) {
      const newPosition = -clickedFolder * STEP;
      const someWidth = 4 * STEP;
      if (
        Math.abs(position) > Math.abs(newPosition) ||
        Math.abs(newPosition) > Math.abs(position - someWidth)
      ) {
        if (currentFolder > N && position > -STEP * (currentFolder - 4)) {
          if (position === 0) {
            updatePosition(currentFolder * -STEP);
          } else {
            updatePosition(position - STEP);
          }
        } else if (currentFolder * -STEP > position) {
          updatePosition(currentFolder * -STEP);
        }
      }
    }
    prevCurrentFolderRef.current = currentFolder;
    prevClickedFolderRef.current = clickedFolder;
  }, [currentFolder, clickedFolder, position, updatePosition]);

  return (
    <>
      {isScrollable && (
        <div className="storyRowS">
          <animated.div
            style={springsL}
            className="storyRowBL"
            onClick={() => handleArrowClick("left")}
          >
            <MdKeyboardArrowLeft className="storyRowL" />
            <MdKeyboardArrowLeft className="storyRowL" />
          </animated.div>
          <animated.div
            style={springsR}
            className="storyRowBR"
            onClick={() => handleArrowClick("right")}
          >
            <MdKeyboardArrowRight className="storyRowR" />
            <MdKeyboardArrowRight className="storyRowR" />
          </animated.div>
        </div>
      )}
      <div
        className="storyRow"
        style={{
          width: Math.min(storiesData.length, 5) * STEP - STEP_ADJUSTMENT,
        }}
      >
        <animated.div
          className="storyRowM"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ left }}
        >
          {storiesData.map(({ id, folderName, Images }) => {
            const isSameFolder = id === currentFolder;
            const style = { opacity: isSameFolder ? 1 : 0.5 };
            return (
              <animated.div
                key={id}
                className="storyItem"
                onClick={() => handleStoryClick(id)}
                style={springsM[id]}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="storyCircle">
                  <img
                    src={Images[id]}
                    alt={folderName}
                    draggable="false"
                    style={style}
                  />
                  <animated.div
                    className="storyCircleB"
                    style={{
                      ...springsI[id],
                      opacity: hoveredId === id ? 1 : isSameFolder ? 1 : 0.5,
                      width:
                        hoveredId === id && !isSameFolder ? "55px" : "50px",
                    }}
                  ></animated.div>
                </div>
                <animated.div
                  className="storyTitle"
                  style={{
                    ...springsI[id],
                    opacity: hoveredId === id ? 0.75 : isSameFolder ? 1 : 0.5,
                    marginTop:
                      hoveredId === id && !isSameFolder ? "-15px" : "-20px",
                  }}
                >
                  {folderName}
                </animated.div>
              </animated.div>
            );
          })}
        </animated.div>
      </div>
    </>
  );
};

export default Moments;
