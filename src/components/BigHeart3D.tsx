"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BigHeart3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;
    heartShape.moveTo(x, y + 0.5);
    heartShape.bezierCurveTo(x, y + 0.75, x - 0.25, y + 1.0, x - 0.6, y + 1.0);
    heartShape.bezierCurveTo(x - 1.15, y + 1.0, x - 1.15, y + 0.375, x - 1.15, y + 0.375);
    heartShape.bezierCurveTo(x - 1.15, y, x - 0.6, y - 0.4, x, y - 0.85);
    heartShape.bezierCurveTo(x + 0.6, y - 0.4, x + 1.15, y, x + 1.15, y + 0.375);
    heartShape.bezierCurveTo(x + 1.15, y + 0.375, x + 1.15, y + 1.0, x + 0.6, y + 1.0);
    heartShape.bezierCurveTo(x + 0.25, y + 1.0, x, y + 0.75, x, y + 0.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };

    return new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Heartbeat effect
    const heartbeat =
      1 + Math.sin(t * 4) * 0.05 + Math.sin(t * 8) * 0.02;
    meshRef.current.scale.setScalar(heartbeat * 0.8);
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -1]}>
      <meshStandardMaterial
        color="#e91e63"
        emissive="#e91e63"
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
