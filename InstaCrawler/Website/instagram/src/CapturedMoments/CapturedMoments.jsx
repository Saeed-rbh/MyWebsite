import React, { useEffect, useState, useMemo, useRef } from "react";
import "./CapturedMoments.css";
import { useSprings, animated } from "react-spring";
import { round } from "lodash";
import NextLast from "./NextLast";

const CapturedMoments = () => {
  // State and Ref Initialization
  const [allfolderImages, setAllFolderImages] = useState([]);
  const [folderImages, setFolderImages] = useState([]);
  const [caption, setCaption] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dragStart = useRef();
  const [dragging, setDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [draggOrientation, setDraggOrientation] = useState(null);
  const [bounce, setBounce] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(0);
  const [lohi, setLohi] = useState([null, null]);

  // Constants
  const calculateMinWidth = () => [(300 * 120) / 200 - 30, (300 * 120) / 200];
  const calculateMaxWidth = () => -(((300 * 120) / 200) * 4 - 120) / 4;
  const minWidth = useMemo(calculateMinWidth, []);
  const maxWidth = useMemo(calculateMaxWidth, []);
  // Custom functions to reduce redundancy
  const resetDragState = () => {
    dragStart.current = null;
    setDragging(false);
    setDragged(false);
  };
  // Effects
  useEffect(() => {
    // Function to load images from the 'Instagram' folder
    const loadImages = () => {
      const imageContext = require.context(
        "./Instagram",
        true,
        /\.(jpg|jpeg|png)$/
      );
      const allImages = [];
      let idCounter = 0;
      const folderNames = new Set();

      imageContext.keys().forEach((item) => {
        const [_, folderName, imageName] = item.split("/");
        folderNames.add(folderName);

        let folderObj = allImages.find((obj) => obj.folderName === folderName);
        if (!folderObj) {
          folderObj = {
            id: idCounter++,
            folderName,
            Images: [],
          };
          allImages.push(folderObj);
        }

        folderObj.Images.push(imageContext(item));
      });

      // Save to state or do something else with the data
      setAllFolderImages(allImages);
    };

    loadImages();
  }, []);

  const [springs, setSprings] = useSprings(folderImages.length, (index) => ({
    transform: `translate3d(0px, 0, 0)`,
    opacity:
      index >= currentImageIndex && index <= currentImageIndex + 3 ? 1 : 0,
    minWidth: index === currentImageIndex + 1 ? minWidth[1] : minWidth[0],
    config: {
      duration: 500,
      tension: 280,
      friction: 60,
      delay: 100 * index,
    },
  }));
  const [IMGsprings, setIMGSprings] = useSprings(
    folderImages.length,
    (index) => ({
      transform:
        index === currentImageIndex
          ? "translate(0px, 30px)"
          : index === currentImageIndex + 2
          ? "translate(-30px, 20px)"
          : index === currentImageIndex + 3
          ? "translate(-30px, 40px)"
          : "translate(0px, 0px)",
      config: {
        duration: 500,
        tension: 280,
        friction: 60,
        delay: 100 * index,
      },
    })
  );
  const [IMGBsprings, setIMGBSprings] = useSprings(
    folderImages.length,
    (index) => ({
      transform:
        index === round(currentImageIndex)
          ? "translate(25px, -300px)"
          : index === round(currentImageIndex + 2)
          ? "translate(-50px, -260px)"
          : index === currentImageIndex + 3
          ? "translate(-50px, -280px)"
          : "translate(40px, -290px)",
      config: {
        duration: 500,
        tension: 280,
        friction: 60,
        delay: 100 * index,
      },
    })
  );
  const [LineSprings, setLineSprings] = useSprings(3, () => ({
    transform: "translateY(0px)",
    config: { duration: 500 },
  }));
  useEffect(() => {
    setSprings((index) => ({
      from: {
        transform:
          draggOrientation === "right"
            ? `translate3d(${maxWidth * (currentImageIndex + 1)}px, 0, 0)`
            : `translate3d(${maxWidth * (currentImageIndex - 1)}px, 0, 0)`,
      },
      to: {
        transform: `translate3d(${maxWidth * currentImageIndex}px, 0, 0)`,
        minWidth: index === currentImageIndex + 1 ? minWidth[1] : minWidth[0],
        opacity:
          index >= currentImageIndex && index <= currentImageIndex + 3 ? 1 : 0,
      },
      config: {
        duration: 500,
        tension: 280,
        friction: 60,
        delay: 100 * index,
      },
    }));
  }, [setSprings, currentImageIndex, minWidth, maxWidth, draggOrientation]);
  useEffect(() => {
    setIMGSprings((index) => ({
      transform:
        index === currentImageIndex
          ? "translate(0px, 30px)"
          : index === currentImageIndex + 2
          ? "translate(-30px, 20px)"
          : index === currentImageIndex + 3
          ? "translate(-30px, 40px)"
          : "translate(0px, 0px)",
      config: {
        duration: 500,
        tension: 280,
        friction: 60,
        delay: 100 * index,
      },
    }));
  }, [setIMGSprings, currentImageIndex]);
  useEffect(() => {
    setIMGBSprings((index) => ({
      transform:
        index === currentImageIndex
          ? "translate(25px, -300px)"
          : index === currentImageIndex + 2
          ? "translate(-50px, -260px)"
          : index === currentImageIndex + 3
          ? "translate(-50px, -280px)"
          : "translate(40px, -290px)",
      config: {
        duration: 500,
        tension: 280,
        friction: 60,
        delay: 100 * index,
      },
    }));
  }, [setIMGBSprings, currentImageIndex]);
  useEffect(() => {
    if (bounce) {
      setLineSprings((index) => ({
        from: { transform: "translateY(0px)", opacity: 0.2 },
        to: { transform: "translateY(50px)", opacity: 0 },
        reset: true,
        reverse: bounce,
        onRest: () => setBounce(false),
        config: { duration: 1000 },
        delay: 100 * index,
      }));
    }
  }, [bounce, setLineSprings]);
  useEffect(() => {
    if (allfolderImages.length === 0) return;
    setCaption(allfolderImages[currentFolder].folderName);
    setFolderImages(allfolderImages[currentFolder].Images);
    setLohi([
      allfolderImages[
        currentFolder === 0 ? allfolderImages.length - 1 : currentFolder - 1
      ].folderName,
      allfolderImages[
        currentFolder === allfolderImages.length - 1 ? 0 : currentFolder + 1
      ].folderName,
    ]);
  }, [allfolderImages, currentFolder]);
  // Event Handlers
  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
    setDragging(true);
  };
  const handleMouseUp = () => {
    setDragging(false);
  };
  const handleMouseMove = (e) => {
    if (dragging && !dragged) {
      const dragEnd = e.clientX;
      const dragDistance = dragEnd - dragStart.current;

      if (dragDistance > 10 && currentImageIndex > 0) {
        setBounce(true);
        setCurrentImageIndex((prevIndex) => prevIndex - 1);
        setDraggOrientation("right");
        resetDragState();
      } else if (
        dragDistance < -10 &&
        currentImageIndex < folderImages.length - 4
      ) {
        setBounce(true);
        setDraggOrientation("left");
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
        resetDragState();
      }
    }
  };
  const handleClickMove = (direction) => {
    if (direction === "right" && currentImageIndex > 0) {
      setBounce(true);
      setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // assuming 0 is the lowest index
      setDraggOrientation(direction);
      resetDragState();
    } else if (
      direction === "left" &&
      currentImageIndex < folderImages.length - 4
    ) {
      setBounce(true);
      setCurrentImageIndex((prevIndex) => prevIndex + 1); // You might want to limit this based on your max index
      setDraggOrientation(direction);
      resetDragState();
    }
  };
  const handleShow = (direction) => {
    if (direction === "lo") {
      setCurrentImageIndex(folderImages.length - 4);
      setCurrentFolder(
        currentFolder === 0 ? allfolderImages.length - 1 : currentFolder - 1
      );
    } else if (direction === "hi") {
      setCurrentFolder(
        currentFolder === allfolderImages.length - 1 ? 0 : currentFolder + 1
      );
      setCurrentImageIndex(0);
    }
  };
  return (
    <div className="CapturedMoments">
      <animated.p className="CapturedMomentsTitle">{caption}</animated.p>
      <div className="CapturedMomentsLines">
        {LineSprings.map((props, index) => (
          <animated.div
            key={index}
            className="CapturedMomentsLine"
            style={props}
          ></animated.div>
        ))}
      </div>
      <div
        className="CapturedMomentsImages"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {springs.map((springProps, index) => (
          <animated.div
            className="CapturedMomentsImg"
            key={index}
            style={springProps}
          >
            <animated.img
              src={folderImages[index]}
              style={IMGsprings[index] || {}}
              draggable="false"
            />
            <animated.div
              key={index}
              className="CapturedMomentsborder"
              style={IMGBsprings[index] || {}}
            ></animated.div>
          </animated.div>
        ))}
      </div>
      <NextLast
        ImageSituation={
          (currentImageIndex === 0 && "lo") ||
          (currentImageIndex === folderImages.length - 4 && "hi") ||
          "mid"
        }
        handleClickMove={handleClickMove}
        lohi={lohi}
        handleShow={handleShow}
      />
    </div>
  );
};

export default CapturedMoments;
