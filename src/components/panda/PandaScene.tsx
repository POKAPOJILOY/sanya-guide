"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";

function PandaModel({
  running,
  onReady,
}: {
  running: boolean;
  onReady: () => void;
}) {
  const { scene } = useGLTF("/models/panda-bao.glb");
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const [hovered, setHovered] = useState(false);
  const target = useRef({ rx: 0, ry: 0 });
  const spring = useRef(1);
  const runningRef = useRef(running);
  runningRef.current = running;

  // нормализация: модель произвольного масштаба -> высота ~2.1, «ноги» на y=0
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2.1 / (size.y || 1);
    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [scene]);

  const head = useMemo(() => {
    let found: THREE.Object3D | null = null;
    scene.traverse((o) => {
      if (!found && /head|голова/i.test(o.name)) found = o;
    });
    return found;
  }, [scene]);

  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    onReady();
  }, [scene, onReady]);

  // голова следует за курсором (только точный указатель, не тач)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.ry = THREE.MathUtils.clamp(nx * 0.45, -0.5, 0.5);
      target.current.rx = THREE.MathUtils.clamp(ny * 0.2, -0.25, 0.25);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (running) invalidate();
  }, [running, invalidate]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !runningRef.current) return;
    const t = state.clock.elapsedTime;
    // breathing: амплитуда ~2°, период ~3 с
    const breathe = Math.sin((t * Math.PI * 2) / 3) * THREE.MathUtils.degToRad(2);
    g.rotation.z = breathe * 0.35;
    // hover-пружинка: scale 1 -> 1.04 -> 1
    spring.current = THREE.MathUtils.damp(
      spring.current,
      hovered ? 1.04 : 1,
      8,
      delta
    );
    g.scale.setScalar(scale * spring.current);
    const follower = head ?? g;
    follower.rotation.x = THREE.MathUtils.damp(
      follower.rotation.x,
      target.current.rx + (head ? 0 : breathe),
      4,
      delta
    );
    follower.rotation.y = THREE.MathUtils.damp(
      follower.rotation.y,
      target.current.ry,
      4,
      delta
    );
    invalidate();
  });

  return (
    <group
      ref={group}
      scale={scale}
      position={offset}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

export default function PandaScene({
  running,
  onReady,
}: {
  running: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      frameloop="demand"
      shadows
      camera={{ position: [0, 1.35, 4.6], fov: 36 }}
      onCreated={({ gl, camera }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.lookAt(0, 1.0, 0);
      }}
    >
      <hemisphereLight args={["#FFF7F9", "#FFDCE8", 0.95]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.15}
        color="#FFE8D6"
        castShadow
      />
      <Suspense fallback={null}>
        <PandaModel running={running} onReady={onReady} />
        <ContactShadows
          position={[0, 0, 0]}
          scale={5}
          blur={2.6}
          opacity={0.32}
          color="#D63D7C"
        />
      </Suspense>
    </Canvas>
  );
}
