import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useInitialSetup, useAnimation } from "./hooks.jsx";

function Model({
  url,
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
}) {
  const { scene: originalScene } = useGLTF(url);
  const modelRef = useRef();

  const scene = useMemo(() => originalScene.clone(), [originalScene]);

  useInitialSetup(scene, modelRef, { setStartAnimation });

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
  });

  return <primitive object={scene} ref={modelRef} />;
}

export default Model;
