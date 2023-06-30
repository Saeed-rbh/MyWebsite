import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./Graphene.css";
import { motion } from "framer-motion";

import * as THREE from "three"; // Add this to import THREE

function Model({ position, opacity }) {
  const gltf = useLoader(GLTFLoader, "/Graphene.gltf");
  const mesh = useRef();

  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.PI / 3;
      mesh.current.rotation.z = -Math.PI / 6;

      mesh.current.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                uniform float time; // Add this line
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    pos.z = pos.z + sin(pos.x + time) * 0.1; // This line creates the wave effect
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
                }
            `,
            fragmentShader: `
              varying vec2 vUv;
              void main() {
                gl_FragColor = vec4(vUv ,0. ,1.); // Just colors the model based on UVs for demonstration purposes
              }
            `,
            uniforms: {
              time: { value: 0 },
            },
            transparent: true,
            opacity: opacity,
          });

          // Animation
          const animate = () => {
            requestAnimationFrame(animate);

            // Update time uniform to keep the wave moving
            node.material.uniforms.time.value += 0.01;
          };

          animate();
        }
      });
    }
  }, [opacity]);

  return gltf ? (
    <primitive object={gltf.scene} position={position} ref={mesh} />
  ) : null;
}

function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 4;
    camera.near = 0.1;
    camera.far = 100;
  }, [camera]);

  return null;
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
        </motion.p>{" "}
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
          <span class="highlight">2D materials</span>! These marvels, with a
          thickness of just <span class="highlight">one atom</span>, are
          changing the face of technology.
        </motion.p>
        <ul className="GrapheneDescription">
          <motion.li
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * 4 }}
          >
            Meet <span class="highlight">graphene</span>, stronger than steel
            and exceptional at conducting electricity.
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
            <span>electronics</span> and <span> energy storage</span>.
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
            <Camera />
          </Suspense>
        </Canvas>
      </motion.div>
    </>
  );
}

export default Graphene;
