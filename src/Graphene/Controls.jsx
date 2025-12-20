import React, { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Controls({ mouseDown }) {
  const { camera } = useThree();
  const [initialPosition, setInitialPosition] = useState(() =>
    camera.position.clone()
  );
  const [initialRotation, setInitialRotation] = useState(() =>
    camera.rotation.clone()
  );
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setInitialPosition(camera.position.clone());
    setInitialRotation(camera.rotation.clone());
  }, []);

  useEffect(() => {
    if (!mouseDown && !resetting) {
      setResetting(true);
    }
  }, [mouseDown, resetting]);

  useFrame(() => {
    if (!mouseDown && resetting) {
      const positionLerpFactor = 0.05; // Smaller value for smoother position interpolation
      const rotationLerpFactor = 0.05; // Smaller value for smoother rotation interpolation

      // Smoothly interpolate position
      camera.position.lerp(initialPosition, positionLerpFactor);

      const targetQuaternion = new THREE.Quaternion().setFromEuler(
        initialRotation
      );

      if (camera.quaternion.dot(targetQuaternion) < 0) {
        targetQuaternion.x = -targetQuaternion.x;
        targetQuaternion.y = -targetQuaternion.y;
        targetQuaternion.z = -targetQuaternion.z;
        targetQuaternion.w = -targetQuaternion.w;
      }

      // Use slerp to interpolate the camera's quaternion towards the target quaternion, ensuring shortest path
      camera.quaternion.slerp(targetQuaternion, rotationLerpFactor);

      // Check if the camera is close enough to the initial position and rotation to stop resetting
      if (
        camera.position.distanceTo(initialPosition) < 0.001 &&
        camera.quaternion.angleTo(targetQuaternion) <
          THREE.MathUtils.degToRad(0.05)
      ) {
        setResetting(false);
      }

      camera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls enableRotate={true} enablePan={false} enableZoom={false} />
  );
}

export default Controls;
