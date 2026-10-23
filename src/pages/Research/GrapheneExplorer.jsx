import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Reuse the original authored GLTF geometry, including its concentric atom/bond detail.
const modelUrls = ['/grapheneNew1.gltf', '/grapheneNew2.gltf', '/grapheneNew3.gltf'];
function Layer({ index, separation, single }) {
  const { scene: original } = useGLTF(modelUrls[index]);
  const group = useRef();
  const { invalidate } = useThree();
  const { scene, center, scale } = useMemo(() => {
    const scene = original.clone(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3()).negate();
    scene.traverse(child => {
      if (!child.isMesh) return;
      const materials = (Array.isArray(child.material) ? child.material : [child.material]).map(material => {
        const copy = material.clone();
        const ring = child.name.includes('round3') ? 3 : child.name.includes('round2') ? 2 : 1;
        copy.color.set(ring === 1 ? '#efcfbe' : ring === 2 ? '#aa8975' : '#725746');
        copy.metalness = 0.55; copy.roughness = 0.4;
        copy.transparent = true;
        copy.opacity = index === 0 ? (ring === 1 ? 1 : ring === 2 ? 0.5 : 0.25) : (ring === 1 ? 0.4 : ring === 2 ? 0.18 : 0.07);
        copy.depthWrite = copy.opacity >= 1;
        return copy;
      });
      child.material = Array.isArray(child.material) ? materials : materials[0];
    });
    return { scene, center: center.toArray(), scale: 10 / Math.max(size.x, size.z) };
  }, [original, index]);
  useEffect(() => () => scene.traverse(child => {
    if (child.isMesh) (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => material.dispose());
  }), [scene]);
  const target = single ? 0 : (1 - index) * (1.25 + separation * 2);
  useEffect(() => { invalidate(); }, [target, invalidate]);
  useFrame((_, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const difference = target - group.current.position.y;
    group.current.position.y = reduced || Math.abs(difference) < 0.001 ? target : THREE.MathUtils.damp(group.current.position.y, target, 8, delta);
    if (Math.abs(difference) >= 0.001) invalidate();
  });
  return <group ref={group} visible={!single || index === 0} position={[index ? 0.7 : 0, 0, index ? 0.25 : 0]} scale={scale}>
    <primitive object={scene} position={center} dispose={null} />
  </group>;
}
function ViewControls({ view }) {
  const controls = useRef();
  const { camera, invalidate } = useThree();
  useEffect(() => {
    const positions = { perspective: [13, 12, 16], top: [0, 24, 0.01], edge: [0, 0.2, 25] };
    camera.position.set(...positions[view.name]);
    controls.current.target.set(0, 0, 0); controls.current.update(); invalidate();
  }, [view, camera, invalidate]);
  return <OrbitControls ref={controls} enablePan={false} enableZoom={false} minPolarAngle={0.01} maxPolarAngle={Math.PI - 0.01} />;
}
function ContextMonitor({ onUnavailable }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onUnavailable);
    return () => canvas.removeEventListener('webglcontextlost', onUnavailable);
  }, [gl, onUnavailable]);
  return null;
}
export default function GrapheneExplorer({ separation, single, view, onUnavailable }) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [13, 12, 16], fov: 43 }} gl={{ antialias: true, alpha: true }}
    fallback={<p>3D is unavailable on this device. The model represents stacked carbon honeycombs; one isolated sheet is graphene.</p>}>
    <ContextMonitor onUnavailable={onUnavailable} />
    <ambientLight intensity={1.6} /><directionalLight position={[6, 14, 8]} intensity={3} /><directionalLight position={[-8, 3, -5]} intensity={2} color="#b6d1ed" />
    <Suspense fallback={null}>{[0, 1, 2].map(index => <Layer key={index} index={index} separation={separation} single={single} />)}</Suspense>
    <ViewControls view={view} />
  </Canvas>;
}
