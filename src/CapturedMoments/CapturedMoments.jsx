import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./CapturedMoments.css";
import { useSprings } from "react-spring";
import { round } from "lodash";
import Moments from "./Moments";
import MainText from "./MainText";
import MainImages from "./MainImages";
import useFolderImages from "./useFolderImages";
import {
  useUpdateCartSituation,
  calculateMinWidth,
  calculateMaxWidth,
} from "./Helper";

const DURATION = 500;
const DELAY_MULTIPLIER = 100;
const computeNewValues = (index, phase, currentImageIndex, isFadingIn) => {
  const isIndexInRange =
    index >= currentImageIndex && index <= currentImageIndex + 3;
  const commonConfig = { duration: DURATION };
  const fadeInFadeOutDelay = isIndexInRange ? DELAY_MULTIPLIER * index : 0;

  switch (phase) {
    case "fadeInDown":
      return {
        newY: "50px",
        opacity: 0,
        config: commonConfig,
        delay: fadeInFadeOutDelay,
      };
    case "fadeOutUp":
      return {
        newY: "-50px",
        opacity: 0,
        config: commonConfig,
        delay: fadeInFadeOutDelay,
      };
    case "changeX":
      return {
        newY: "50px",
        opacity: 0,
        config: { duration: 0 },
        delay: 500,
      };
    default:
      return {
        newY: "0px",
        opacity: isIndexInRange ? 1 : 0,
        config: commonConfig,
        delay: isIndexInRange && isFadingIn ? fadeInFadeOutDelay : 0,
      };
  }
};

const CapturedMoments = () => {
  // State and Ref Initialization
  const [folderImages, setFolderImages] = useState([]);
  const [caption, setCaption] = useState("initial");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFolder, setCurrentFolder] = useState(0);
  const [lohi, setLohi] = useState([null, null]);
  const [cartSituation, setCartSituation] = useState("mid");
  const [direction, setDirection] = useState(null);
  const [phase, setPhase] = useState(null);
  const [nextFolder, setNextFolder] = useState(null);
  const allfolderImages = useFolderImages();
  const minWidth = useMemo(calculateMinWidth, []);
  const maxWidth = useMemo(calculateMaxWidth, []);
  useUpdateCartSituation(currentImageIndex, setCartSituation, folderImages);

  // Effects
  const [springs, setSprings] = useSprings(folderImages.length, (index) => ({
    y: "50px",
    opacity: 0,
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
  const handleShow = (dir) => {
    setDirection(dir);
    setPhase("fadeOutUp");
  };
  const handleClickPick = (NewFolder) => {
    if (NewFolder !== currentFolder) {
      setDirection(null);
      setNextFolder(NewFolder);
      setPhase("fadeOutUp");
    }
  };

  // ----------------------------------------------------
  const [isFadingIn, setIsFadingIn] = useState(false);

  const handleOnRest = useCallback(
    (index) => {
      if (index === currentImageIndex + 3) {
        setPhase((prevPhase) => {
          switch (prevPhase) {
            case "fadeOutUp":
              return "changeX";
            case "changeX":
              return "fadeInDown";
            case "fadeInDown":
              return null;
            default:
              return prevPhase;
          }
        });
      }
    },
    [currentImageIndex, setPhase]
  );

  useEffect(() => {
    if (phase === "fadeInDown") {
      setIsFadingIn(true);
    } else if (isFadingIn) {
      setIsFadingIn(false);
    }
  }, [phase, isFadingIn]);

  useEffect(() => {
    if (folderImages.length === 0) return;
    setSprings((index) => {
      const { newY, opacity, config, delay } = computeNewValues(
        index,
        phase,
        currentImageIndex,
        isFadingIn
      );
      return {
        y: newY,
        x: `${maxWidth * currentImageIndex}px`,
        minWidth: index === currentImageIndex + 1 ? minWidth[1] : minWidth[0],
        opacity,
        delay,
        config,
        onRest: () => handleOnRest(index),
      };
    });
  }, [
    setSprings,
    currentImageIndex,
    minWidth,
    maxWidth,
    phase,
    handleOnRest,
    isFadingIn,
    folderImages,
  ]);
  // console.log(currentImageIndex, currentFolder, folderImages.length, direction);
  useEffect(() => {
    if (phase === "changeX") {
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
      } else if (direction === null) {
        setCurrentFolder(nextFolder);
        setCurrentImageIndex(0);
      }
      setPhase("fadeInDown");
    }
  }, [phase]);
  // ----------------------------------------------------

  useEffect(() => {
    setIMGSprings((index) => ({
      transform:
        index === currentImageIndex
          ? "translate(0px, 30px)"
          : index === currentImageIndex + 2
          ? "translate(-30px, 20px)"
          : index === currentImageIndex + 3
          ? "translate(-30px, 40px)"
          : "translate(0px, 2px)",
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

  return (
    <div className="CapturedMoments">
      <Moments
        storiesData={allfolderImages}
        currentFolder={currentFolder}
        handleClickPick={handleClickPick}
      />
      <MainText caption={caption} phase={phase} />
      <MainImages
        springs={springs}
        IMGsprings={IMGsprings}
        IMGBsprings={IMGBsprings}
        folderImages={folderImages}
        cartSituation={cartSituation}
        lohi={lohi}
        currentImageIndex={currentImageIndex}
        handleShow={handleShow}
        setCurrentImageIndex={setCurrentImageIndex}
        phase={phase}
      />
    </div>
  );
};

export default CapturedMoments;
