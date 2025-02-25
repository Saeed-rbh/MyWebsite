import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useInitialSetup, useAnimation } from "./hooks.jsx";

function Model({
  url,
  Type,
  reverseAnimation,
  setReverseAnimation,
  animationCompleted,
  setAnimationCompleted,
  startAnimation,
  startRotationAdjustment,
  setStartRotationAdjustment,
  startScaleDown,
  setStartScaleDown,
  setEndAnimation,
  setStartAnimation,
  mouseDown,
  startPositionAdjustment,
  setStartPositionAdjustment,
}) {
  const { scene: originalScene } = useGLTF(url);
  const modelRef = useRef();

  const scene = useMemo(() => originalScene.clone(), [originalScene]);

  useInitialSetup(scene, modelRef, { setStartAnimation }, Type);

  useAnimation(scene, modelRef, {
    reverseAnimation,
    setReverseAnimation,
    animationCompleted,
    setAnimationCompleted,
    startAnimation,
    startRotationAdjustment,
    setStartRotationAdjustment,
    startScaleDown,
    setStartScaleDown,
    setEndAnimation,
    mouseDown,
    Type,
    startPositionAdjustment,
    setStartPositionAdjustment,
  });

  return <primitive object={scene} ref={modelRef} />;
}

export default Model;
