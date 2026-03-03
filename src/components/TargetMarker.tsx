"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Center } from "@react-three/drei";
import * as THREE from "three";

// ---- The 8/3 target the player needs to reach ----
export default function TargetMarker({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pillarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3;
    }
    if (pillarRef.current) {
      (pillarRef.current.material as THREE.MeshStandardMaterial).opacity = 0.15 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Light pillar beacon */}
      <mesh ref={pillarRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.3, 6, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Ground ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner glow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ff69b4" emissiveIntensity={0.3} transparent opacity={0.15} />
      </mesh>

      {/* Floating 8/3 */}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef} position={[0, 1.5, 0]}>
          <Center>
            {/* 8 */}
            <group position={[-0.5, 0, 0]}>
              <mesh><torusGeometry args={[0.2, 0.06, 8, 16]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.8} /></mesh>
              <mesh position={[0, 0.36, 0]}><torusGeometry args={[0.16, 0.06, 8, 16]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.8} /></mesh>
            </group>
            {/* / */}
            <mesh position={[0, 0.15, 0]} rotation={[0, 0, -0.45]}>
              <boxGeometry args={[0.06, 0.55, 0.06]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
            </mesh>
            {/* 3 */}
            <group position={[0.5, 0, 0]}>
              <mesh position={[0, 0.16, 0]}><torusGeometry args={[0.16, 0.06, 8, 16, Math.PI]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.8} /></mesh>
              <mesh position={[0, -0.16, 0]}><torusGeometry args={[0.16, 0.06, 8, 16, Math.PI]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.8} /></mesh>
            </group>
          </Center>
        </group>
      </Float>

      {/* Point light */}
      <pointLight color="#ffd700" intensity={2} distance={6} position={[0, 1.5, 0]} />
      <pointLight color="#ff69b4" intensity={1} distance={4} position={[0, 0.5, 0]} />
    </group>
  );
}

// ---- Arrow compass pointing to target ----
export function DirectionArrow({
  playerPos,
  targetPos,
}: {
  playerPos: React.RefObject<THREE.Vector3>;
  targetPos: [number, number, number];
}) {
  const arrowRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!arrowRef.current || !playerPos.current) return;
    const dx = targetPos[0] - playerPos.current.x;
    const dz = targetPos[2] - playerPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);

    // Position arrow above player
    arrowRef.current.position.set(playerPos.current.x, 1.8, playerPos.current.z);
    arrowRef.current.rotation.y = angle;

    // Scale based on distance
    if (textRef.current) {
      const mat = textRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = dist > 1.5 ? 0.8 : 0;
    }
  });

  return (
    <group ref={arrowRef}>
      {/* Arrow body */}
      <mesh ref={textRef} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 4]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
