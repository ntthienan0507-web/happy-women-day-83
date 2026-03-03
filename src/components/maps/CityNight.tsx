"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---- Building ----
function Building({ position, width, height, depth, color }: {
  position: [number, number, number]; width: number; height: number; depth: number; color: string;
}) {
  const wins = useMemo(() => {
    const arr: { x: number; y: number; color: string; speed: number }[] = [];
    const cols = Math.floor(width / 0.5);
    const rows = Math.floor(height / 0.6);
    const wColors = ["#ffdd57", "#ffe488", "#ffa500", "#87ceeb", "#ff69b4"];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (Math.random() > 0.3)
          arr.push({ x: -width / 2 + 0.3 + c * 0.5, y: 0.4 + r * 0.6, color: wColors[Math.floor(Math.random() * 5)], speed: 1 + Math.random() * 3 });
    return arr;
  }, [width, height]);

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {wins.map((w, i) => <WinLight key={i} x={w.x} y={w.y} color={w.color} speed={w.speed} dz={depth / 2 + 0.01} />)}
    </group>
  );
}

function WinLight({ x, y, color, speed, dz }: { x: number; y: number; color: string; speed: number; dz: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(s.clock.elapsedTime * speed) * 0.5; });
  return (
    <mesh ref={ref} position={[x, y, dz]}>
      <planeGeometry args={[0.3, 0.35]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
    </mesh>
  );
}

// ---- Lamp ----
function Lamp({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((s) => { if (ref.current) ref.current.intensity = 1.5 + Math.sin(s.clock.elapsedTime * 2 + position[0]) * 0.3; });
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.04, 0.06, 2, 6]} /><meshStandardMaterial color="#555" metalness={0.6} /></mesh>
      <mesh position={[0, 2.1, 0]}><coneGeometry args={[0.15, 0.12, 8]} /><meshStandardMaterial color="#444" /></mesh>
      <mesh position={[0, 2.02, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#ffdd57" emissive="#ffdd57" emissiveIntensity={2} /></mesh>
      <pointLight ref={ref} position={[0, 1.9, 0]} color="#ffdd57" intensity={1.5} distance={5} />
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.8, 16]} /><meshStandardMaterial color="#ffdd57" transparent opacity={0.06} /></mesh>
    </group>
  );
}

// ---- Moon ----
function Moon() {
  return (
    <group position={[8, 10, -12]}>
      <mesh><sphereGeometry args={[1.2, 16, 16]} /><meshStandardMaterial color="#fffde8" emissive="#fffde8" emissiveIntensity={0.4} /></mesh>
      <pointLight color="#fffde8" intensity={1.5} distance={30} />
    </group>
  );
}

// ==================== CITY NIGHT MAP ====================
export default function CityNight() {
  const buildings = useMemo(() => {
    const bldgs: { pos: [number, number, number]; w: number; h: number; d: number; c: string }[] = [];
    const colors = ["#1a1a2e", "#16213e", "#1b1b3a", "#1e1e3f", "#252547"];
    for (let i = -12; i <= 12; i += 1.8) {
      bldgs.push({ pos: [i + (Math.random() - 0.5), 0, -6 - Math.random() * 4], w: 0.8 + Math.random() * 1.5, h: 2 + Math.random() * 5, d: 0.8 + Math.random(), c: colors[Math.floor(Math.random() * 5)] });
    }
    for (let i = -12; i <= 12; i += 2.2) {
      bldgs.push({ pos: [i + (Math.random() - 0.5), 0, 6 + Math.random() * 3], w: 0.8 + Math.random(), h: 1.5 + Math.random() * 3, d: 0.6 + Math.random() * 0.8, c: colors[Math.floor(Math.random() * 5)] });
    }
    // Side buildings
    for (let i = -6; i <= 6; i += 2) {
      bldgs.push({ pos: [-13 - Math.random() * 2, 0, i], w: 0.8 + Math.random(), h: 2 + Math.random() * 3, d: 0.8 + Math.random(), c: colors[Math.floor(Math.random() * 5)] });
      bldgs.push({ pos: [13 + Math.random() * 2, 0, i], w: 0.8 + Math.random(), h: 2 + Math.random() * 3, d: 0.8 + Math.random(), c: colors[Math.floor(Math.random() * 5)] });
    }
    return bldgs;
  }, []);

  return (
    <>
      <color attach="background" args={["#0a0a2e"]} />
      <fog attach="fog" args={["#0a0a2e", 10, 30]} />
      <ambientLight intensity={0.12} color="#8888cc" />
      <hemisphereLight args={["#1a1a4e", "#1e1e2e", 0.3]} />
      <Stars radius={50} depth={30} count={2500} factor={3} fade speed={1} />
      <Moon />

      {buildings.map((b, i) => <Building key={i} position={b.pos} width={b.w} height={b.h} depth={b.d} color={b.c} />)}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1e1e2e" />
      </mesh>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 6]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>

      {/* Lamp posts */}
      {[-8, -4, 0, 4, 8].map((x) => <Lamp key={`f${x}`} position={[x, 0, 3]} />)}
      {[-8, -4, 0, 4, 8].map((x) => <Lamp key={`b${x}`} position={[x, 0, -3]} />)}
    </>
  );
}
