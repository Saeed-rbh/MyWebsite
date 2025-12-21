import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import * as THREE from "three";
import Controls from "./Controls";
import { animated } from "react-spring";
import IntroText from "./IntroText";
// import GrapheneInfo from "./GrapheneInfo";
// import "./Graphene.css";
import useGraphenePageLogic from "./useGraphenePageLogic";
import { useGLTF } from "@react-three/drei";
import SEO from "../../components/SEO/SEO";

const gltfUrl = "/grapheneNew1.gltf";
const gltfUr2 = "/grapheneNew2.gltf";
const gltfUr3 = "/grapheneNew3.gltf";

useGLTF.preload(gltfUrl);
useGLTF.preload(gltfUr2);
useGLTF.preload(gltfUr3);

function Graphene() {
  const initialPosition = new THREE.Vector3(0, 10, 0);

  const {
    screenHeight,
    startAnimation,
    reverseAnimation,
    endAnimation,
    mouseDown,
    handleMouseDown,
    handleMouseUp,
    moveUpStyle,
    sharedModelProps,
  } = useGraphenePageLogic();

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
      <SEO
        title="Saeed Arabha | Graphene Research"
        description="Research on Graphene: From Graphite to Graphene. 3D visualization and analysis."
        name="Saeed Arabha"
        type="article"
      />
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
            <spotLight position={[10, 30, 10]} angle={0.3} penumbra={1} />
            <Model url={gltfUrl} Type={"Layer1"} {...sharedModelProps} />
            <Model url={gltfUr2} Type={"Layer2"} {...sharedModelProps} />
            <Model url={gltfUr3} Type={"Layer3"} {...sharedModelProps} />
            <Controls mouseDown={mouseDown} endAnimation={endAnimation} />
          </Suspense>
        </Canvas>
      </animated.div>
      {/* <GrapheneInfo screenHeight={screenHeight} endAnimation={endAnimation} /> */}
    </animated.div>
  );
}

export default Graphene;
