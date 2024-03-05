import React from "react";
import { OrbitControls } from "@react-three/drei";

function Controls() {
  return (
    <OrbitControls enableRotate={true} enablePan={false} enableZoom={false} />
  );
}

export default Controls;
