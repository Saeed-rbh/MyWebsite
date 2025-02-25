import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useInitialSetup = (
  scene,
  modelRef,
  { setStartAnimation },
  Type
) => {
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

        if (Type === "Layer1") {
          modelRef.current.position.set(0, 1, 0);
        } else if (Type === "Layer2") {
          modelRef.current.position.set(1.5, -0.5, 0.35);
        } else {
          modelRef.current.position.set(1.5, -2, 0.5);
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

// export const useAnimation = (
//   scene,
//   modelRef,
//   {
//     reverseAnimation,
//     setReverseAnimation,
//     animationCompleted,
//     setAnimationCompleted,
//     startAnimation,
//     startRotationAdjustment,
//     setStartRotationAdjustment,
//     setStartScaleDown,
//     setEndAnimation,
//     mouseDown,
//   }
// ) => {
//   useFrame(() => {
//     if (!startAnimation) return;
//     let allMeshesFullyVisible = true;

//     scene.traverse((child) => {
//       if (child.isMesh && child.visible) {
//         if (!animationCompleted) {
//           const originalPosition = child.userData.originalPosition;
//           const lerpRate = child.name !== "Graphene1" ? 0.05 : 0.025;
//           child.position.lerp(originalPosition, lerpRate);

//           const maxOpacity =
//             child.name === "round1_atoms"
//               ? 0.8
//               : child.name === "round1_balls"
//               ? 0.3
//               : child.name === "round2_atoms"
//               ? child.name === "round2_balls"
//                 ? 0.4
//                 : 0.2
//               : 0.05;
//           const opacityRate =
//             child.name === "Graphene1"
//               ? 0.5
//               : child.name === "Graphene2"
//               ? 0.2
//               : 0.1;

//           if (child.material.opacity < maxOpacity) {
//             child.material.opacity += opacityRate;
//             allMeshesFullyVisible = false;
//           }

//           if (
//             child.name === "Graphene3" &&
//             Math.abs(child.position.y - originalPosition.y) < 0.01 &&
//             Math.abs(child.material.opacity - maxOpacity) < 0.01
//           ) {
//             setAnimationCompleted(true);
//           }
//         } else if (reverseAnimation) {
//           // Reverse animation logic
//           const endPositions = {
//             Graphene1: new THREE.Vector3(0, 0, 0),
//             Graphene2: new THREE.Vector3(0.7, 0.7, 0.7),
//             Graphene3: new THREE.Vector3(0.7, 0.7, 0.7),
//           };

//           if (child.material.opacity > 0) {
//             child.position.lerp(endPositions[child.name], 0.1);
//             if (child.name !== "Graphene1") {
//               child.material.opacity -= 0.01;
//               allMeshesFullyVisible = false;
//             }
//           }
//         }

//         child.material.needsUpdate = true;
//       }
//     });

//     if (!animationCompleted && allMeshesFullyVisible) {
//       setTimeout(() => setReverseAnimation(true), 2000);
//       setTimeout(() => setStartRotationAdjustment(true), 2000);
//       setTimeout(() => setEndAnimation(true), 4000);
//     }

//     if (startRotationAdjustment) {
//       const currentRotationZ = modelRef.current.rotation.z;
//       const currentRotationY = modelRef.current.rotation.y;

//       if (
//         Math.abs(currentRotationZ) > 0.001 ||
//         Math.abs(currentRotationY) > 0.001
//       ) {
//         modelRef.current.rotation.z = THREE.MathUtils.lerp(
//           currentRotationZ,
//           0,
//           0.05
//         );
//         modelRef.current.rotation.y = THREE.MathUtils.lerp(
//           currentRotationY,
//           0,
//           0.05
//         );
//       }

//       setStartRotationAdjustment(false);
//     }
//   });
// };

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
    mouseDown,
    Type,
    startPositionAdjustment,
    setStartPositionAdjustment,
  }
) => {
  useFrame(() => {
    if (!startAnimation) return;
    let allMeshesFullyVisible = true;

    scene.traverse((child) => {
      if (child.isMesh && child.visible) {
        if (!animationCompleted) {
          const originalPosition = child.userData.originalPosition;
          const lerpRate = child.name !== "Graphene1" ? 0.05 : 0.025;
          child.position.lerp(originalPosition, lerpRate);
          child.material.color = new THREE.Color("#efcfbe");

          //

          let maxOpacity = 1;

          if (Type === "Layer1") {
            if (child.name === "round1_bonds") {
              child.material.color.set("#efcfbe"); // Light brown
              maxOpacity = 1;
            } else if (child.name === "round2_bonds") {
              child.material.color.set("#7d6e63"); // Dark brown
              maxOpacity = 0.5;
            } else if (child.name === "round3_bonds") {
              child.material.color.set("#4c4037"); // Darker brown
              maxOpacity = 0.25;
            }
          } else if (Type === "Layer2") {
            if (child.name === "round1_bonds") {
              child.material.color.set("#efcfbe"); // Light brown
            } else if (child.name === "round2_bonds") {
              child.material.color.set("#7d6e63"); // Dark brown
            } else if (child.name === "round3_bonds") {
              child.material.color.set("#4c4037"); // Darker brown
            }
            maxOpacity =
              child.name === "round1_atoms"
                ? 0.2
                : child.name === "round1_balls"
                ? 0.5
                : child.name === "round2_atoms"
                ? child.name === "round2_balls"
                  ? 0.5
                  : 0.2
                : 0.025;
          } else {
            if (child.name === "round1_bonds") {
              child.material.color.set("#efcfbe"); // Light brown
            } else if (child.name === "round2_bonds") {
              child.material.color.set("#7d6e63"); // Dark brown
            } else if (child.name === "round3_bonds") {
              child.material.color.set("#4c4037"); // Darker brown
            }
            maxOpacity =
              child.name === "round1_atoms"
                ? 0.1
                : child.name === "round1_balls"
                ? 0.5
                : child.name === "round2_atoms"
                ? child.name === "round2_balls"
                  ? 0.05
                  : 0.1
                : 0.0125;
          }

          // child.material.opacity = maxOpacity;
          // child.material.transparent = true; // Ensure transparency is enabled

          if (child.material.opacity < maxOpacity) {
            child.material.opacity += 0.01;
            child.material.transparent = true;
            allMeshesFullyVisible = true;
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
      setTimeout(() => setStartPositionAdjustment(true), 2000);
      // setTimeout(() => setStartRotationAdjustment(true), 4000);
      setTimeout(() => setEndAnimation(true), 6000);
    }

    if (startPositionAdjustment) {
      const currentPositionX = modelRef.current.position.x;
      const currentPositionZ = modelRef.current.position.z;
      const currentPositionY = modelRef.current.position.y;

      if (
        Math.abs(currentPositionX) > 0.001 ||
        Math.abs(currentPositionZ) > 0.001
      ) {
        modelRef.current.position.x = THREE.MathUtils.lerp(
          currentPositionX,
          0,
          0.05
        );
        modelRef.current.position.z = THREE.MathUtils.lerp(
          currentPositionZ,
          0,
          0.05
        );
        modelRef.current.position.y = THREE.MathUtils.lerp(
          currentPositionY,
          1,
          0.05
        );
        setStartPositionAdjustment(false);
      }
    }
    if (startRotationAdjustment) {
      const currentRotationZ = modelRef.current.rotation.z;
      const currentRotationY = modelRef.current.rotation.y;
      if (
        Math.abs(currentRotationZ) > 0.001 ||
        Math.abs(currentRotationY) > 0.001
      ) {
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
        setStartRotationAdjustment(false);
      }
    }
  });
};
