import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

// Preserve the authored lattice while keeping this explorer focused on its layers.
const modelUrls = ['/grapheneNew1.gltf', '/grapheneNew2.gltf', '/grapheneNew3.gltf'];
const cameraViews = { perspective: [7.8, 8, 10], top: [0, 16, 0.01], edge: [0, 0.2, 17] };

function Layer({ index, separation, single, reducedMotion }) {
  const { scene: original } = useGLTF(modelUrls[index]);
  const group = useRef();
  const visibility = useRef(1);
  const { invalidate } = useThree();
  const { scene, center, scale, materials } = useMemo(() => {
    const scene = original.clone(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3()).negate();
    const materials = [];
    scene.traverse(child => {
      if (!child.isMesh) return;
      const copies = (Array.isArray(child.material) ? child.material : [child.material]).map(material => {
        const copy = material.clone();
        const ring = child.name.includes('round3') ? 3 : child.name.includes('round2') ? 2 : 1;
        copy.color.set(index === 0 ? (ring === 1 ? '#dfb392' : '#b77e59') : index === 1 ? '#a57b5e' : '#825d45');
        copy.metalness = index === 0 ? 0.35 : 0.15;
        copy.roughness = index === 0 ? 0.38 : 0.58;
        copy.transparent = true;
        copy.opacity = ring === 3 ? (index === 0 ? 0.24 : 0.1) : 1;
        copy.userData.baseOpacity = copy.opacity;
        copy.depthWrite = copy.opacity >= 1;
        materials.push(copy);
        return copy;
      });
      child.material = Array.isArray(child.material) ? copies : copies[0];
    });
    return { scene, center: center.toArray(), scale: 10 / Math.max(size.x, size.z), materials };
  }, [original, index]);
  useEffect(() => () => materials.forEach(material => material.dispose()), [materials]);

  const targetY = single && index === 0 ? 0 : (1 - index) * (1.25 + separation * 2);
  const targetVisibility = single && index !== 0 ? 0 : 1;
  useEffect(() => { invalidate(); }, [targetY, targetVisibility, reducedMotion, invalidate]);
  useFrame((_, delta) => {
    const yDifference = targetY - group.current.position.y;
    const opacityDifference = targetVisibility - visibility.current;
    group.current.position.y = reducedMotion || Math.abs(yDifference) < 0.001 ? targetY : THREE.MathUtils.damp(group.current.position.y, targetY, 8, delta);
    visibility.current = reducedMotion || Math.abs(opacityDifference) < 0.001 ? targetVisibility : THREE.MathUtils.damp(visibility.current, targetVisibility, 9, delta);
    group.current.visible = visibility.current > 0.001;
    materials.forEach(material => {
      material.opacity = material.userData.baseOpacity * visibility.current;
      material.depthWrite = material.opacity >= 0.999;
    });
    if (Math.abs(yDifference) >= 0.001 || Math.abs(opacityDifference) >= 0.001) invalidate();
  });
  return <group ref={group} position={[index ? 0.7 : 0, 0, index ? 0.25 : 0]} scale={scale}>
    <primitive object={scene} position={center} dispose={null} />
  </group>;
}

function ViewControls({ view, reducedMotion, onOrbitStart }) {
  const controls = useRef();
  const destination = useRef(new THREE.Vector3());
  const moving = useRef(false);
  const { camera, invalidate } = useThree();
  useEffect(() => {
    if (!cameraViews[view.name]) return;
    destination.current.set(...cameraViews[view.name]);
    moving.current = true;
    invalidate();
  }, [view, reducedMotion, invalidate]);
  useFrame((_, delta) => {
    if (!moving.current) return;
    if (reducedMotion || camera.position.distanceToSquared(destination.current) < 0.0001) {
      camera.position.copy(destination.current);
      moving.current = false;
    } else camera.position.lerp(destination.current, 1 - Math.exp(-7 * delta));
    controls.current.target.set(0, 0, 0);
    controls.current.update();
    if (moving.current) invalidate();
  });
  return <OrbitControls ref={controls} enablePan={false} enableZoom={false} enableDamping={!reducedMotion} dampingFactor={0.1} minPolarAngle={0.01} maxPolarAngle={Math.PI - 0.01} onStart={() => { moving.current = false; onOrbitStart(); }} />;
}

function ReadySignal({ onReady }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
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

export default function GrapheneExplorer({ separation, single, view, onReady, onUnavailable, onOrbitStart }) {
  const reducedMotion = useReducedMotion();
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: cameraViews.perspective, fov: 43 }} gl={{ antialias: true, alpha: true }} fallback={<p>Your browser does not support the 3D canvas.</p>}>
    <ContextMonitor onUnavailable={onUnavailable} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[6, 14, 8]} intensity={2.6} color="#fff0df" />
    <directionalLight position={[-8, 3, -5]} intensity={1.6} color="#c3d5e5" />
    <Suspense fallback={null}>
      {[0, 1, 2].map(index => <Layer key={index} index={index} separation={separation} single={single} reducedMotion={reducedMotion} />)}
      <ReadySignal onReady={onReady} />
    </Suspense>
    <ViewControls view={view} reducedMotion={reducedMotion} onOrbitStart={onOrbitStart} />
  </Canvas>;
}
