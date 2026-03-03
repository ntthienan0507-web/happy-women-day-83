"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---- Flower ----
function Flower3D({ position, petalColor, scale = 1 }: {
  position: [number, number, number]; petalColor: string; scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5 + position[0]) * 0.1;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.015, 0.02, 0.3, 4]} /><meshStandardMaterial color="#228B22" /></mesh>
      {/* Petals */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 0.06, 0.32, Math.sin(i * Math.PI / 3) * 0.06]}
          rotation={[0.5, i * Math.PI / 3, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color={petalColor} emissive={petalColor} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Center */}
      <mesh position={[0, 0.33, 0]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={0.5} /></mesh>
    </group>
  );
}

// ---- Mushroom ----
function Mushroom({ position, color = "#ff4444" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.04, 0.16, 6]} /><meshStandardMaterial color="#ffe4c4" /></mesh>
      <mesh position={[0, 0.18, 0]}><sphereGeometry args={[0.08, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={color} /></mesh>
      {/* Spots */}
      <mesh position={[0.03, 0.22, 0.04]}><sphereGeometry args={[0.015, 4, 4]} /><meshStandardMaterial color="#fff" /></mesh>
      <mesh position={[-0.04, 0.2, -0.02]}><sphereGeometry args={[0.012, 4, 4]} /><meshStandardMaterial color="#fff" /></mesh>
    </group>
  );
}

// ---- Fountain ----
function Fountain() {
  const waterRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    waterRefs.current.forEach((r, i) => {
      if (!r) return;
      const t = s.clock.elapsedTime;
      r.position.y = 0.6 + Math.abs(Math.sin(t * 2 + i * 0.5)) * 0.5;
      r.scale.setScalar(0.8 + Math.sin(t * 3 + i) * 0.2);
      (r.material as THREE.MeshStandardMaterial).opacity = 0.4 + Math.sin(t * 2 + i) * 0.2;
    });
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Basin */}
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.8, 1, 0.3, 16]} /><meshStandardMaterial color="#888" /></mesh>
      {/* Water in basin */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 16]} />
        <meshStandardMaterial color="#4a90d9" emissive="#1a6b8a" emissiveIntensity={0.2} transparent opacity={0.7} />
      </mesh>
      {/* Center pillar */}
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.08, 0.1, 0.6, 8]} /><meshStandardMaterial color="#999" /></mesh>
      {/* Water sprays */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => { waterRefs.current[i] = el; }}
          position={[Math.cos(i * Math.PI / 2) * 0.15, 0.8, Math.sin(i * Math.PI / 2) * 0.15]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.5} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Fairy Lights (string lights) ----
function FairyLights({ from, to, count = 10, color = "#ffd700" }: {
  from: [number, number, number]; to: [number, number, number]; count?: number; color?: string;
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t - Math.sin(t * Math.PI) * 0.4;
      const z = from[2] + (to[2] - from[2]) * t;
      pts.push([x, y, z]);
    }
    return pts;
  }, [from, to, count]);

  return (
    <group>
      {/* Bulbs only - no pointLights */}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Fireflies ----
function Fireflies({ count = 30 }: { count?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  interface FF { pos: THREE.Vector3; offset: THREE.Vector3; speed: number; phase: number; }
  const flies = useMemo<FF[]>(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 16, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 12),
      offset: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    })), [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    flies.forEach((f, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.set(
        f.pos.x + Math.sin(t * f.speed + f.offset.x) * 1.5,
        f.pos.y + Math.sin(t * f.speed * 0.7 + f.offset.y) * 0.5,
        f.pos.z + Math.cos(t * f.speed * 0.8 + f.offset.z) * 1.5,
      );
      const glow = 0.3 + 0.7 * Math.max(0, Math.sin(t * 2 + f.phase));
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * 2;
      m.scale.setScalar(0.015 + glow * 0.015);
    });
  });

  return (
    <group>
      {flies.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#aaff44" emissive="#aaff44" emissiveIntensity={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== FAIRY GARDEN MAP ====================
export default function FairyGarden() {
  const flowerPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; color: string; scale: number }[] = [];
    const colors = ["#ff69b4", "#ff1493", "#ff85a2", "#ffd700", "#e91e63", "#ba68c8", "#ff4081", "#f06292"];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 10;
      positions.push({
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.6 + Math.random() * 0.8,
      });
    }
    return positions;
  }, []);

  return (
    <>
      <color attach="background" args={["#0a0520"]} />
      <fog attach="fog" args={["#0a0520", 10, 25]} />
      <ambientLight intensity={0.2} color="#c084fc" />
      <directionalLight position={[3, 6, 2]} intensity={0.3} color="#e0b0ff" />
      <hemisphereLight args={["#9966ff", "#1a1a2e", 0.25]} />
      <Stars radius={50} depth={30} count={600} factor={4} fade speed={1} />

      {/* Moon */}
      <group position={[5, 8, -12]}>
        <mesh><sphereGeometry args={[0.8, 16, 16]} /><meshStandardMaterial color="#e8d8ff" emissive="#c084fc" emissiveIntensity={0.6} /></mesh>
      </group>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0d1f0d" />
      </mesh>
      {/* Winding path */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
          position={[Math.sin(i * 0.5) * 2, 0, -7 + i]}>
          <circleGeometry args={[0.6, 8]} />
          <meshStandardMaterial color="#6b5b3e" />
        </mesh>
      ))}

      {/* Flowers */}
      {flowerPositions.map((f, i) => <Flower3D key={i} position={f.pos} petalColor={f.color} scale={f.scale} />)}

      {/* Mushrooms */}
      <Mushroom position={[-2, 0, 1]} />
      <Mushroom position={[3, 0, -1]} color="#ff69b4" />
      <Mushroom position={[-4, 0, 3]} color="#ffd700" />
      <Mushroom position={[5, 0, 2]} />
      <Mushroom position={[-1, 0, 5]} color="#ba68c8" />

      {/* Fountain */}
      <Fountain />

      {/* Fairy lights */}
      <FairyLights from={[-4, 2.5, -1]} to={[4, 2.5, -1]} count={12} color="#ffd700" />
      <FairyLights from={[-3, 2.2, 3]} to={[5, 2.2, 3]} count={10} color="#ff69b4" />
      <FairyLights from={[-5, 2.8, -4]} to={[3, 2.8, -5]} count={8} color="#c084fc" />

      {/* Fireflies */}
      <Fireflies count={12} />
    </>
  );
}
