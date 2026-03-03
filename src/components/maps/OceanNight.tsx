"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---- Static Ocean Floor ----
function OceanFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a2a4a" roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

// ---- Water Surface (transparent, above) ----
function WaterSurface() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.y = 0.6 + Math.sin(s.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.6, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1a5a8a" transparent opacity={0.35} roughness={0.1} metalness={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ---- Coral ----
function Coral({ position, color = "#ff4060" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2;
        const h = 0.3 + Math.random() * 0.3;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.08, h / 2, Math.sin(angle) * 0.08]} rotation={[Math.sin(angle) * 0.3, 0, Math.cos(angle) * 0.3]}>
            <cylinderGeometry args={[0.015, 0.04, h, 4]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---- Seaweed ----
function Seaweed({ position }: { position: [number, number, number] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const count = 3 + Math.floor(Math.random() * 3);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((r, i) => {
      if (!r) return;
      r.rotation.z = Math.sin(t * 1.2 + position[0] + i * 0.5) * 0.2;
      r.rotation.x = Math.sin(t * 0.8 + i) * 0.1;
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}
          position={[(i - count / 2) * 0.06, 0.25 + Math.random() * 0.2, 0]}>
          <cylinderGeometry args={[0.008, 0.015, 0.5 + Math.random() * 0.3, 4]} />
          <meshStandardMaterial color="#1a8a3a" emissive="#0a5a2a" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Jellyfish ----
function Jellyfish({ position, color = "#c084fc" }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = baseY + Math.sin(t * 0.6 + position[0]) * 0.3;
    ref.current.position.x = position[0] + Math.sin(t * 0.3 + position[2]) * 0.5;
    // Pulsing
    const pulse = 1 + Math.sin(t * 2) * 0.1;
    ref.current.scale.set(pulse, 1 / pulse, pulse);
  });

  return (
    <group ref={ref} position={position}>
      {/* Bell */}
      <mesh>
        <sphereGeometry args={[0.15, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 0.08, -0.15, Math.sin(i * Math.PI / 3) * 0.08]}>
          <cylinderGeometry args={[0.005, 0.003, 0.3 + Math.random() * 0.2, 3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Fish school ----
function FishSchool({ center, count = 8, color = "#ffa500" }: {
  center: [number, number, number]; count?: number; color?: string;
}) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  interface FD { offset: THREE.Vector3; speed: number; phase: number; }
  const fish = useMemo<FD[]>(() =>
    Array.from({ length: count }, () => ({
      offset: new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 1.5),
      speed: 0.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
    })), [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    fish.forEach((f, i) => {
      const m = refs.current[i];
      if (!m) return;
      const x = center[0] + f.offset.x + Math.sin(t * f.speed + f.phase) * 2;
      const y = center[1] + f.offset.y + Math.sin(t * 0.5 + f.phase) * 0.2;
      const z = center[2] + f.offset.z + Math.cos(t * f.speed + f.phase) * 2;
      m.position.set(x, y, z);
      m.rotation.y = Math.atan2(
        Math.cos(t * f.speed + f.phase) * 2,
        -Math.sin(t * f.speed + f.phase) * 2
      ) - Math.PI / 2;
    });
  });

  return (
    <group>
      {fish.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} scale={0.06}>
          <coneGeometry args={[0.4, 1.2, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Treasure Chest ----
function TreasureChest({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.16, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.32, 0.04, 0.22]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      {/* Gold glow */}
      <mesh position={[0, 0.12, 0.11]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// ---- Bubbles ----
function Bubbles({ count = 40 }: { count?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  interface BD { pos: THREE.Vector3; speed: number; wobble: number; size: number; }
  const bubbles = useRef<BD[]>(
    Array.from({ length: count }, () => makeBubble())
  );

  function makeBubble(): BD {
    return {
      pos: new THREE.Vector3((Math.random() - 0.5) * 20, -0.3 + Math.random() * 0.3, (Math.random() - 0.5) * 16),
      speed: 0.2 + Math.random() * 0.6,
      wobble: Math.random() * 10,
      size: 0.02 + Math.random() * 0.05,
    };
  }

  useFrame((s, d) => {
    const t = s.clock.elapsedTime;
    bubbles.current.forEach((b, i) => {
      b.pos.y += b.speed * d;
      b.pos.x += Math.sin(t + b.wobble) * d * 0.2;
      if (b.pos.y > 0.7) Object.assign(b, makeBubble());
      const m = refs.current[i];
      if (m) {
        m.position.copy(b.pos);
        m.scale.setScalar(b.size);
      }
    });
  });

  return (
    <group>
      {bubbles.current.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#88ccff" emissive="#44aaff" emissiveIntensity={0.3} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Light Rays ----
function LightRays() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    refs.current.forEach((r, i) => {
      if (!r) return;
      (r.material as THREE.MeshStandardMaterial).opacity = 0.03 + Math.sin(s.clock.elapsedTime * 0.3 + i * 0.8) * 0.02;
    });
  });

  return (
    <group>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}
          position={[-6 + i * 3, 0.3, -3]}
          rotation={[0, 0, 0.1 + i * 0.05]}>
          <planeGeometry args={[0.5, 3]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== OCEAN NIGHT MAP ====================
export default function OceanNight() {
  const coralPositions = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = [];
    const colors = ["#ff4060", "#ff69b4", "#c084fc", "#ffa500", "#06d6a0", "#ff6b81"];
    for (let i = 0; i < 10; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 20, -0.25, (Math.random() - 0.5) * 16],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return arr;
  }, []);

  return (
    <>
      <color attach="background" args={["#020a18"]} />
      <fog attach="fog" args={["#020a18", 6, 20]} />
      <ambientLight intensity={0.15} color="#4488cc" />
      <directionalLight position={[2, 3, 0]} intensity={0.2} color="#88bbff" />
      <hemisphereLight args={["#1a3a5e", "#020a18", 0.3]} />

      {/* Faint stars visible through water surface */}
      <Stars radius={50} depth={20} count={300} factor={2} fade speed={0.3} />

      {/* Ocean environment */}
      <OceanFloor />
      <WaterSurface />
      <LightRays />
      <Bubbles count={15} />

      {/* Ground for walking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a2a4a" transparent opacity={0.9} />
      </mesh>

      {/* Corals */}
      {coralPositions.map((c, i) => <Coral key={i} position={c.pos} color={c.color} />)}

      {/* Seaweed patches */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Seaweed key={i} position={[(Math.random() - 0.5) * 18, -0.28, (Math.random() - 0.5) * 14]} />
      ))}

      {/* Jellyfish */}
      <Jellyfish position={[-3, 0.1, -2]} color="#c084fc" />
      <Jellyfish position={[4, 0.2, -4]} color="#ff69b4" />
      <Jellyfish position={[-5, 0, 3]} color="#06d6a0" />

      {/* Fish */}
      <FishSchool center={[3, 0, 2]} count={5} color="#ffa500" />
      <FishSchool center={[-4, 0.1, -3]} count={4} color="#ff69b4" />

      {/* Treasure */}
      <TreasureChest position={[5, -0.25, -5]} />
      <TreasureChest position={[-6, -0.25, 4]} />
    </>
  );
}
