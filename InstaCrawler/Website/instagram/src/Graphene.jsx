import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { motion } from "framer-motion";
import "./Graphene.css";
import TWEEN from "@tweenjs/tween.js";

function Model({ position, opacity }) {
  const gltf = useLoader(GLTFLoader, "/Graphene.gltf");
  const meshRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const minXPosRef = useRef(Infinity);
  const maxXPosRef = useRef(-Infinity);
  const minZPosRef = useRef(Infinity);
  const maxZPosRef = useRef(-Infinity);
  const amplitudeRef = useRef(0.1);
  const minAmplitudeRef = useRef(Infinity);
  const maxAmplitudeRef = useRef(-Infinity);

  useEffect(() => {
    if (meshRef.current) {
      const nodes = getMeshNodes(meshRef.current);

      nodes.forEach((node) => {
        minXPosRef.current = Math.min(minXPosRef.current, node.position.x);
        maxXPosRef.current = Math.max(maxXPosRef.current, node.position.x);
        minZPosRef.current = Math.min(minZPosRef.current, node.position.z);
        maxZPosRef.current = Math.max(maxZPosRef.current, node.position.z);
      });

      nodes.forEach((node) => {
        const color = new THREE.Color();
        node.material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.5,
          metalness: 0.7,
          transparent: true,
          opacity: opacity,
        });
        node.userData.initialPositionY = node.position.y;
        meshRef.current.rotation.x = Math.PI / 3;
        meshRef.current.rotation.z = -Math.PI / 6;
      });
    }
  }, [opacity]);

  useEffect(() => {
    const updateAmplitude = () => {
      const targetAmplitude = Math.random() * 0.3 + 0.01;
      new TWEEN.Tween(amplitudeRef.current)
        .to({ value: targetAmplitude }, 1000)
        .start();
    };

    const amplitudeInterval = setInterval(updateAmplitude, 2000);

    return () => {
      clearInterval(amplitudeInterval);
    };
  }, []);

  useFrame(() => {
    const elapsedTime = clockRef.current.getElapsedTime();
    const cycleDuration = 5;
    const progress = (elapsedTime % cycleDuration) / cycleDuration;

    const waveOffset = progress * Math.PI * 2;
    const waveScale = amplitudeRef.current;

    const nodes = getMeshNodes(meshRef.current);
    nodes.forEach((node) => {
      const rangeX = maxXPosRef.current - minXPosRef.current;
      const rangeZ = maxZPosRef.current - minZPosRef.current;
      const normalizedPositionX =
        (node.position.x - minXPosRef.current) / rangeX;
      const normalizedPositionZ =
        (node.position.z - minZPosRef.current) / rangeZ;

      const displacementX =
        Math.cos(normalizedPositionX * Math.PI + waveOffset) * waveScale;
      const displacementZ =
        Math.sin(normalizedPositionZ * Math.PI + waveOffset) * waveScale;

      node.position.y =
        node.userData.initialPositionY + displacementX + displacementZ;

      minAmplitudeRef.current = Math.min(
        minAmplitudeRef.current,
        node.position.y
      );
      maxAmplitudeRef.current = Math.max(
        maxAmplitudeRef.current,
        node.position.y
      );

      const colorMin = new THREE.Color("#efcfbe");
      const colorMax = new THREE.Color("#d49d81");
      const normalizedAmplitude =
        (node.position.y - minAmplitudeRef.current) /
        (maxAmplitudeRef.current - minAmplitudeRef.current);
      const color = new THREE.Color().lerpColors(
        colorMin,
        colorMax,
        normalizedAmplitude
      );
      node.material.color = color;
    });

    TWEEN.update();
  });

  const getMeshNodes = (object) => {
    const nodes = [];
    object.traverse((node) => {
      if (node.isMesh) {
        nodes.push(node);
      }
    });
    return nodes;
  };

  return gltf ? (
    <group position={position}>
      <primitive object={gltf.scene} ref={meshRef} />
    </group>
  ) : null;
}

function Graphene() {
  return (
    <>
      <div className="GrapheneText">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * 1 }}
          className="GrapheneTitle"
        >
          What Are 2D Materials ?!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * 2 }}
          className="hr-Graphene"
        ></motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * 3 }}
          className="GrapheneDescription"
        >
          Step into the exciting realm of{" "}
          <span className="highlight">2D materials</span>! These marvels, with a
          thickness of just <span className="highlight">one atom</span>, are
          changing the face of technology.
        </motion.p>
        <ul className="GrapheneDescription">
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 4 }}
          >
            Meet <span className="highlight">graphene</span>, stronger than
            steel and exceptional at conducting electricity.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 5 }}
          >
            Discover <span>molybdenum disulfide</span>, with properties perfect
            for semiconductors.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 6 }}
          >
            Uncover how these materials are revolutionizing fields like{" "}
            <span>electronics</span> and <span>energy storage</span>.
          </motion.li>
        </ul>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * 7 }}
          className="GrapheneDescription"
        >
          Delve into the thrilling science behind material physics that's
          pushing boundaries of what we thought was possible!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.1 * 1 }}
        className="Graphene"
      >
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Model position={[0, 0, 0]} opacity={1} />
          </Suspense>
        </Canvas>
      </motion.div>
    </>
  );
}

export default Graphene;
