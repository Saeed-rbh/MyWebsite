import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import {
  GLTFLoader,
  PerspectiveCamera,
} from "three/examples/jsm/loaders/GLTFLoader";
import "./Graphene.css";

function Model() {
  const gltf = useLoader(GLTFLoader, "/Graphene.gltf");
  const mesh = useRef();

  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.PI / 3; // 45 degrees
      mesh.current.rotation.z = -Math.PI / 6; // 45 degrees
    }
  }, []);

  return gltf ? <primitive object={gltf.scene} ref={mesh} /> : null;
}

function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 4; // Adjust this value to zoom
  }, [camera]);

  return null;
}

function Graphene() {
  return (
    <div className="Graphene">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model position={[-5, 0, 0]} />
          <Model position={[5, 0, 0]} />
          <Camera />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Graphene;


