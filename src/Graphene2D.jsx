import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";

const GrapheneUnit = () => {
  const atomRadius = 0.1; // Radius of each atom
  const bondWidth = 0.05; // Width of each bond

  const atomPositions = [
    [0, 0, 0],
    [1.42, 0, 0],
    [0.71, 1.23, 0],
  ];

  const bondIndices = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];

  return (
    <group>
      {atomPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereBufferGeometry args={[atomRadius, 16, 16]} />
          <meshBasicMaterial color={0x000000} />
        </mesh>
      ))}

      {bondIndices.map(([start, end], index) => (
        <line key={index}>
          <bufferGeometry
            attach="geometry"
            vertices={[atomPositions[start], atomPositions[end]]}
          />
          <lineBasicMaterial
            attach="material"
            color={0x000000}
            linewidth={bondWidth}
          />
        </line>
      ))}
    </group>
  );
};

const Graphene2D = () => {
  const rows = 10;
  const columns = 10;
  const spacing = 2.2; // Spacing between unit cells

  const units = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const x = j * spacing;
      const y = i * spacing;

      units.push(<GrapheneUnit key={`${i}-${j}`} position={[x, y, 0]} />);
    }
  }

  return (
    <Canvas style={{ height: "400px", width: "400px" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group
        position={[
          (-spacing * (columns - 1)) / 2,
          (-spacing * (rows - 1)) / 2,
          0,
        ]}
      >
        {units}
      </group>
    </Canvas>
  );
};

export default Graphene2D;
