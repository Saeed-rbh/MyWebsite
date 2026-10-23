import React, { useMemo, useRef, useEffect, useLayoutEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { buildExtendedLattice } from './grapheneLattice.mjs';

// Reuse the original authored GLTF geometry, including its concentric atom/bond detail.
const modelUrls = ['/grapheneNew1.gltf', '/grapheneNew2.gltf', '/grapheneNew3.gltf'];
const pointKey = position => position.map(v => Math.round(v * 10000)).join(',');
function revealShader(shader) {
  shader.vertexShader = 'attribute float aReveal; varying float vReveal;\n' + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace('void main() {', 'void main() { vReveal = aReveal;');
  shader.fragmentShader = 'varying float vReveal;\n' + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.a *= vReveal; if (vReveal < 0.001) discard;');
}
function Extension({ extraColumns, extraRows, index }) {
  // Keep a stable instance pool: only opacity changes during growth, never
  // atom radius, coordinates or bond length. Reversing a slider reverses the fade.
  const lattice = useMemo(() => buildExtendedLattice(6, 6), []);
  const active = useMemo(() => new Set(buildExtendedLattice(extraColumns, extraRows).points.map(p => pointKey(p.position))), [extraColumns, extraRows]);
  const atoms = useRef(), bonds = useRef();
  const { invalidate } = useThree();
  const buffers = useMemo(() => ({ atoms: new Float32Array(lattice.addedAtoms.length), bonds: new Float32Array(lattice.addedBonds.length) }), [lattice]);
  const targets = useMemo(() => ({
    atoms: lattice.addedAtoms.map(p => active.has(pointKey(p.position)) ? 1 : 0),
    bonds: lattice.addedBonds.map(([a, b]) => active.has(pointKey(lattice.points[a].position)) && active.has(pointKey(lattice.points[b].position)) ? 1 : 0)
  }), [active, lattice]);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
    lattice.addedAtoms.forEach(({ position }, i) => {
      dummy.position.set(...position); dummy.updateMatrix(); atoms.current.setMatrixAt(i, dummy.matrix);
    });
    lattice.addedBonds.forEach(([a, b], i) => {
      const start = new THREE.Vector3(...lattice.points[a].position), end = new THREE.Vector3(...lattice.points[b].position);
      const direction = end.clone().sub(start);
      dummy.position.copy(start).add(end).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(up, direction.normalize()); dummy.updateMatrix(); bonds.current.setMatrixAt(i, dummy.matrix);
    });
    for (const mesh of [atoms.current, bonds.current]) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); }
  }, [lattice]);
  useEffect(() => { invalidate(); }, [targets, invalidate]);
  useFrame((_, delta) => {
    let moving = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const name of ['atoms', 'bonds']) {
      const values = buffers[name];
      for (let i = 0; i < values.length; i++) {
        const target = targets[name][i];
        if (Math.abs(values[i] - target) < 0.002 || reduced) values[i] = target;
        else { values[i] = THREE.MathUtils.damp(values[i], target, 9, delta); moving = true; }
      }
      (name === 'atoms' ? atoms : bonds).current.geometry.attributes.aReveal.needsUpdate = true;
    }
    if (moving) invalidate();
  });
  const opacity = index === 0 ? 0.8 : 0.3;
  return <group>
    <instancedMesh ref={atoms} args={[null, null, lattice.addedAtoms.length]}><sphereGeometry args={[0.375, 18, 12]}><instancedBufferAttribute attach="attributes-aReveal" args={[buffers.atoms, 1]} /></sphereGeometry><meshStandardMaterial onBeforeCompile={revealShader} color={index === 0 ? "#dfbba2" : "#aa8975"} metalness={index === 0 ? 0.55 : 0} roughness={index === 0 ? 0.4 : 1} transparent opacity={opacity} depthWrite={false} /></instancedMesh>
    <instancedMesh ref={bonds} args={[null, null, lattice.addedBonds.length]}><cylinderGeometry args={[0.12, 0.12, 1, 10]}><instancedBufferAttribute attach="attributes-aReveal" args={[buffers.bonds, 1]} /></cylinderGeometry><meshStandardMaterial onBeforeCompile={revealShader} color="#aa8975" metalness={index === 0 ? 0.55 : 0} roughness={index === 0 ? 0.4 : 1} transparent opacity={opacity} depthWrite={false} /></instancedMesh>
  </group>;
}
function Layer({ index, separation, single, extraColumns, extraRows }) {
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
        copy.color.set(ring === 1 && index === 0 ? '#efcfbe' : ring <= 2 ? '#aa8975' : '#725746');
        copy.metalness = index === 0 ? 0.55 : 0;
        copy.roughness = index === 0 ? 0.4 : 1;
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
  useEffect(() => {
    // The original outer bond decoration must give way to actual growth bonds.
    scene.traverse(child => { if (child.name === 'round3_bonds') child.visible = extraColumns === 0 && extraRows === 0; });
    invalidate();
  }, [scene, extraColumns, extraRows, invalidate]);
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
    <group position={center}><Extension extraColumns={extraColumns} extraRows={extraRows} index={index} /></group>
  </group>;
}
function ViewControls({ view, extraColumns, extraRows }) {
  const controls = useRef();
  const { camera, invalidate } = useThree();
  useEffect(() => {
    const positions = { perspective: [9, 10, 12], top: [0, 19, 0.01], edge: [0, 0.2, 21] };
    camera.position.set(...positions[view.name]);
    controls.current.target.set(0, 0, 0); controls.current.update(); invalidate();
  }, [view, camera, invalidate]);
  const targetZoom = 1 / (1 + Math.max(extraColumns, extraRows) * 0.18);
  useEffect(() => { invalidate(); }, [targetZoom, invalidate]);
  useFrame((_, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const difference = targetZoom - camera.zoom;
    camera.zoom = reduced || Math.abs(difference) < 0.001 ? targetZoom : THREE.MathUtils.damp(camera.zoom, targetZoom, 7, delta);
    camera.updateProjectionMatrix();
    if (Math.abs(difference) >= 0.001) invalidate();
  });
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
export default function GrapheneExplorer({ separation, single, view, onUnavailable, extraColumns = 0, extraRows = 0 }) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [9, 10, 12], fov: 43 }} gl={{ antialias: true, alpha: true }}
    fallback={<p>3D is unavailable on this device. The model represents stacked carbon honeycombs; one isolated sheet is graphene.</p>}>
    <ContextMonitor onUnavailable={onUnavailable} />
    <ambientLight intensity={1.6} /><directionalLight position={[6, 14, 8]} intensity={3} /><directionalLight position={[-8, 3, -5]} intensity={2} color="#b6d1ed" />
    <Suspense fallback={null}>{[0, 1, 2].map(index => <Layer key={index} index={index} extraRows={extraRows} extraColumns={extraColumns} separation={separation} single={single} />)}</Suspense>
    <ViewControls extraRows={extraRows} extraColumns={extraColumns} view={view} />
  </Canvas>;
}
