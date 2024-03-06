import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model from "./Model";
import * as THREE from "three";
import Controls from "./Controls";
import { useSpring, animated } from "react-spring";
import IntroText from "./IntroText";
import GrapheneInfo from "./GrapheneInfo";
import "../Graphene.css";

function Graphene() {
  const gltfUrl = "/grapheneNew2.gltf";
  const initialPosition = new THREE.Vector3(0, 10, 0);
  const initialRotation = new THREE.Euler(0, 0, 0);

  const [endAnimation, setEndAnimation] = useState(false);
  const [reverseAnimation, setReverseAnimation] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [startRotationAdjustment, setStartRotationAdjustment] = useState(false);
  const [startScaleDown, setStartScaleDown] = useState(false);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const moveUpStyle = useSpring({
    from: {
      y: +screenHeight / 2 - screenWidth / 2 - 65,
      height: "500px",
      width: "500px",
      scale: 1,
      opacity: 0,
    },
    to: {
      opacity: 1,
      y: endAnimation ? -80 : +screenHeight / 2 - screenWidth / 2 - 65,
      scale: endAnimation ? 0.8 : 1,
    },
    config: {
      tension: 70,
      friction: 15,
    },
  });

  const [mouseDown, setMouseDown] = useState(false);
  const handleMouseDown = () => {
    setMouseDown(true);
  };
  const handleMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <animated.div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <IntroText
        screenHeight={screenHeight}
        startAnimation={startAnimation}
        reverseAnimation={reverseAnimation}
        endAnimation={endAnimation}
        mouseDown={mouseDown}
      />
      <animated.div
        style={moveUpStyle}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Canvas
          camera={{
            position: initialPosition.toArray(),
            up: [0, 0, -1],
            fov: 50,
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} />
            <Model
              url={gltfUrl}
              setEndAnimation={setEndAnimation}
              reverseAnimation={reverseAnimation}
              setReverseAnimation={setReverseAnimation}
              animationCompleted={animationCompleted}
              setAnimationCompleted={setAnimationCompleted}
              startAnimation={startAnimation}
              setStartAnimation={setStartAnimation}
              startRotationAdjustment={startRotationAdjustment}
              setStartRotationAdjustment={setStartRotationAdjustment}
              startScaleDown={startScaleDown}
              setStartScaleDown={setStartScaleDown}
            />
            <Controls
              initialPosition={initialPosition}
              initialRotation={initialRotation}
            />
          </Suspense>
        </Canvas>
      </animated.div>
      <GrapheneInfo screenHeight={screenHeight} endAnimation={endAnimation} />
    </animated.div>
  );
}

export default Graphene;
