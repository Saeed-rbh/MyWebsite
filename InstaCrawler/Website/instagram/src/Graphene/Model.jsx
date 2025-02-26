// import React, { useRef, useMemo } from "react";
// import { useGLTF, OrbitControls } from "@react-three/drei";
// import { useInitialSetup, useAnimation } from "./hooks.jsx";
// import * as THREE from "three";

// function Model({
//   url,
//   Type,
//   reverseAnimation,
//   setReverseAnimation,
//   animationCompleted,
//   setAnimationCompleted,
//   startAnimation,
//   startRotationAdjustment,
//   setStartRotationAdjustment,
//   startScaleDown,
//   setStartScaleDown,
//   setEndAnimation,
//   endAnimation,
//   setStartAnimation,
//   mouseDown,
//   startPositionAdjustment,
//   setStartPositionAdjustment,
// }) {
//   const { scene: originalScene } = useGLTF(url);
//   const modelRef = useRef();

//   const scene = useMemo(() => originalScene.clone(), [originalScene]);

//   useInitialSetup(scene, modelRef, { setStartAnimation }, Type, endAnimation);

//   useAnimation(scene, modelRef, {
//     reverseAnimation,
//     setReverseAnimation,
//     animationCompleted,
//     setAnimationCompleted,
//     startAnimation,
//     startRotationAdjustment,
//     setStartRotationAdjustment,
//     startScaleDown,
//     setStartScaleDown,
//     setEndAnimation,
//     endAnimation,
//     mouseDown,
//     Type,
//     startPositionAdjustment,
//     setStartPositionAdjustment,
//   });

//   if (startRotationAdjustment && endAnimation) {
//     const currentRotationZ = modelRef.current.rotation.z;
//     const currentRotationY = modelRef.current.rotation.y;
//     if (
//       Math.abs(currentRotationZ) > 0.001 ||
//       Math.abs(currentRotationY) > 0.001
//     ) {
//       modelRef.current.rotation.z = THREE.MathUtils.lerp(
//         currentRotationZ,
//         0,
//         0.05
//       );
//       modelRef.current.rotation.y = THREE.MathUtils.lerp(
//         currentRotationY,
//         0,
//         0.05
//       );
//       if (Type === "Layer2" || Type === "Layer3") {
//         modelRef.current.visible = false;
//       }

//       setStartRotationAdjustment(false);
//     }
//   }

//   return <primitive object={scene} ref={modelRef} />;
// }

// export default Model;

import React, { useRef, useMemo } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useInitialSetup, useAnimation } from "./hooks.jsx";
import * as THREE from "three";

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
  endAnimation,
  setStartAnimation,
  mouseDown,
  startPositionAdjustment,
  setStartPositionAdjustment,
}) {
  const { scene: originalScene } = useGLTF(url);
  const modelRef = useRef();
  const { camera, gl } = useThree(); // Get camera and renderer

  const scene = useMemo(() => originalScene.clone(), [originalScene]);

  useInitialSetup(scene, modelRef, { setStartAnimation }, Type, endAnimation);

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
    endAnimation,
    mouseDown,
    Type,
    startPositionAdjustment,
    setStartPositionAdjustment,
  });

  return (
    <>
      <primitive object={scene} ref={modelRef} />
      <OrbitControls
        enableZoom={false}
        enableRotate={true}
        maxAzimuthAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 2.5}
        rotateSpeed={0.1}
        args={[camera, gl.domElement]}
      />
    </>
  );
}

export default Model;
