import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useInitialSetup = (scene, modelRef, { setStartAnimation }) => {
  const initialScale = useMemo(() => new THREE.Vector3(0.7, 0.7, 0.7), []);

  const initialPositions = useMemo(
    () => ({
      Graphene1: new THREE.Vector3(1, 1, 1),
      Graphene2: new THREE.Vector3(1, 1, 1),
      Graphene3: new THREE.Vector3(1, 1, 1),
    }),
    []
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.userData.originalPosition = child.position.clone();
        if (initialPositions[child.name]) {
          child.position.copy(initialPositions[child.name]);
        }
        child.material.opacity = 0;
        child.material.transparent = true;
        child.material.metalness = 0.7;
        child.material.roughness = 0.7;
        child.material.color = new THREE.Color("#efcfbe");

        if (child.name === "Graphene1") {
          child.material.color = new THREE.Color("#efcfbe");
        } else if (child.name === "Graphene2") {
          child.material.color = new THREE.Color("#ccae9d");
        } else if (child.name === "Graphene3") {
          child.material.color = new THREE.Color("#ccae9d");
        }

        child.material.needsUpdate = true;
      }
    });

    scene.rotation.z = 30 * (Math.PI / 180);
    scene.rotation.y = -30 * (Math.PI / 180);
    modelRef.current.scale.copy(initialScale);

    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [scene, initialScale, initialPositions, setStartAnimation, modelRef]);
};

export const useAnimation = (
  scene,
  modelRef,
  {
    reverseAnimation,
    setReverseAnimation,
    animationCompleted,
    setAnimationCompleted,
    startAnimation,
    startRotationAdjustment,
    setStartRotationAdjustment,
    setStartScaleDown,
    setEndAnimation,
  }
) => {
  useFrame(() => {
    if (!startAnimation) return;
    let allMeshesFullyVisible = true;

    scene.traverse((child) => {
      if (child.isMesh && child.visible) {
        if (!animationCompleted) {
          // Forward animation logic
          const originalPosition = child.userData.originalPosition;
          const lerpRate = child.name !== "Graphene1" ? 0.05 : 0.025;
          child.position.lerp(originalPosition, lerpRate);

          const maxOpacity =
            child.name === "round1_atoms"
              ? 0.8
              : child.name === "round1_balls"
              ? 0.3
              : child.name === "round2_atoms"
              ? child.name === "round2_balls"
                ? 0.4
                : 0.2
              : 0.05;
          const opacityRate =
            child.name === "Graphene1"
              ? 0.05
              : child.name === "Graphene2"
              ? 0.02
              : 0.01;

          if (child.material.opacity < maxOpacity) {
            child.material.opacity += opacityRate;
            allMeshesFullyVisible = false;
          }

          if (
            child.name === "Graphene3" &&
            Math.abs(child.position.y - originalPosition.y) < 0.01 &&
            Math.abs(child.material.opacity - maxOpacity) < 0.01
          ) {
            setAnimationCompleted(true);
          }
        } else if (reverseAnimation) {
          // Reverse animation logic
          const endPositions = {
            Graphene1: new THREE.Vector3(0, 0, 0),
            Graphene2: new THREE.Vector3(0.7, 0.7, 0.7),
            Graphene3: new THREE.Vector3(0.7, 0.7, 0.7),
          };

          if (child.material.opacity > 0) {
            child.position.lerp(endPositions[child.name], 0.1);
            if (child.name !== "Graphene1") {
              child.material.opacity -= 0.01;
              allMeshesFullyVisible = false;
            }
          }
        }

        child.material.needsUpdate = true;
      }
    });

    if (!animationCompleted && allMeshesFullyVisible) {
      setTimeout(() => setReverseAnimation(true), 2000);
      setTimeout(() => setStartRotationAdjustment(true), 2000);
      setTimeout(() => setEndAnimation(true), 4000);
    }

    if (startRotationAdjustment) {
      const currentRotationZ = modelRef.current.rotation.z;
      const currentRotationY = modelRef.current.rotation.y;

      if (currentRotationZ !== 0 || currentRotationY !== 0) {
        modelRef.current.rotation.z = THREE.MathUtils.lerp(
          currentRotationZ,
          0,
          0.05
        );
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          currentRotationY,
          0,
          0.05
        );
      }

      setStartRotationAdjustment(false);
    }
  });
};
