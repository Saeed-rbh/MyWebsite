import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei"; // For easy 3D text creation

const RotatableText = () => {
  const textRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState([0, 0, 0]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (isDragging) {
      setRotation([
        rotation[0] + event.movementY * 0.01,
        rotation[1] + event.movementX * 0.01,
        rotation[2],
      ]);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.x = rotation[0];
      textRef.current.rotation.y = rotation[1];
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={1}
      color="#f00" // Red
      anchorX="center"
      anchorY="middle"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      Graphene
    </Text>
  );
};
