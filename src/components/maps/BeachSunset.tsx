"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---- Palm Tree ----
function PalmTree({ position }: { position: [number, number, number] }) {
  const leavesRef = useRef<THREE.Group>(null);
  useFrame((s) => { if (leavesRef.current) leavesRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5 + position[0]) * 0.1; });

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 2.4, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {/* Coconuts */}
      <mesh position={[0.1, 2.3, 0.05]}><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#5C4033" /></mesh>
      <mesh position={[-0.08, 2.25, -0.05]}><sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#5C4033" /></mesh>
      {/* Leaves */}
      <group ref={leavesRef} position={[0, 2.4, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 0.8, -0.1, Math.sin(i * Math.PI / 3) * 0.8]}
            rotation={[0.6, i * Math.PI / 3, 0.3]}>
            <planeGeometry args={[0.3, 1.2]} />
            <meshStandardMaterial color="#2d8b2d" side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---- Ocean ----
function Ocean() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.15 + Math.sin(s.clock.elapsedTime * 0.5) * 0.05;
    ref.current.position.y = -0.1 + Math.sin(s.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -10]}>
      <planeGeometry args={[50, 20, 32, 32]} />
      <meshStandardMaterial color="#1a6b8a" emissive="#0077be" emissiveIntensity={0.15} transparent opacity={0.85} roughness={0.2} metalness={0.3} />
    </mesh>
  );
}

// ---- Wave Lines ----
function Waves() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    refs.current.forEach((r, i) => {
      if (!r) return;
      r.position.z = -1.5 - i * 0.8 + Math.sin(s.clock.elapsedTime * 0.6 + i * 0.5) * 0.3;
      r.position.y = 0.01 + Math.sin(s.clock.elapsedTime * 0.8 + i) * 0.02;
      (r.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(s.clock.elapsedTime + i) * 0.15;
    });
  });

  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2 - i * 0.8]}>
          <planeGeometry args={[40, 0.15]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Sun/Sunset ----
function Sun() {
  return (
    <group position={[0, 3, -18]}>
      <mesh><sphereGeometry args={[2, 16, 16]} /><meshStandardMaterial color="#ff6b35" emissive="#ff4500" emissiveIntensity={1} /></mesh>
      <pointLight color="#ff6b35" intensity={3} distance={40} />
    </group>
  );
}

// ---- Seashells ----
function Seashells() {
  const shells = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      pos: [(Math.random() - 0.5) * 20, 0.02, Math.random() * 4 - 1] as [number, number, number],
      rot: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.04,
      color: ["#fff5e6", "#ffe4c4", "#ffd1a4", "#fff"][Math.floor(Math.random() * 4)],
    })), []);

  return (
    <group>
      {shells.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, s.rot]} scale={s.scale}>
          <torusGeometry args={[1, 0.4, 4, 8, Math.PI]} />
          <meshStandardMaterial color={s.color} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Beach Umbrella ----
function Umbrella({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.03, 0.03, 1.6, 6]} /><meshStandardMaterial color="#8B4513" /></mesh>
      <mesh position={[0, 1.6, 0]}><coneGeometry args={[0.8, 0.4, 8]} /><meshStandardMaterial color="#ff1493" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 1.62, 0]}><coneGeometry args={[0.78, 0.38, 8]} /><meshStandardMaterial color="#ff69b4" side={THREE.DoubleSide} /></mesh>
    </group>
  );
}

// ==================== BEACH MAP ====================
export default function BeachSunset() {
  return (
    <>
      <color attach="background" args={["#1a0a2e"]} />
      <fog attach="fog" args={["#2d1b40", 12, 35]} />
      <ambientLight intensity={0.3} color="#ffc8a0" />
      <directionalLight position={[0, 5, -15]} intensity={0.8} color="#ff8c50" />
      <hemisphereLight args={["#ff6b35", "#1e1e2e", 0.3]} />
      <Stars radius={50} depth={30} count={1500} factor={3} fade speed={0.5} />

      <Sun />
      <Ocean />
      <Waves />

      {/* Sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 3]}>
        <planeGeometry args={[40, 14]} />
        <meshStandardMaterial color="#e8d5a3" />
      </mesh>
      {/* Wet sand near water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
        <planeGeometry args={[40, 3]} />
        <meshStandardMaterial color="#c4a875" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Palm trees */}
      <PalmTree position={[-6, 0, 5]} />
      <PalmTree position={[-3, 0, 7]} />
      <PalmTree position={[5, 0, 6]} />
      <PalmTree position={[8, 0, 5]} />
      <PalmTree position={[-9, 0, 8]} />
      <PalmTree position={[11, 0, 7]} />

      {/* Umbrellas */}
      <Umbrella position={[-2, 0, 3]} />
      <Umbrella position={[4, 0, 4]} />

      <Seashells />
    </>
  );
}
