"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---- Cherry Blossom Tree ----
function SakuraTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leavesRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.6, 6]} />
        <meshStandardMaterial color="#5C3317" roughness={0.9} />
      </mesh>
      {/* Branches */}
      <mesh position={[0.3, 1.4, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.02, 0.04, 0.6, 4]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[-0.25, 1.3, 0.1]} rotation={[0.2, 0, 0.5]}>
        <cylinderGeometry args={[0.02, 0.04, 0.5, 4]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      {/* Blossom clusters */}
      <group ref={leavesRef}>
        {[
          [0, 1.8, 0], [0.4, 1.7, 0.1], [-0.3, 1.65, -0.1],
          [0.2, 1.95, -0.15], [-0.15, 1.9, 0.2], [0.1, 2.0, 0],
          [0.5, 1.6, -0.1], [-0.4, 1.55, 0.15],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <sphereGeometry args={[0.25 + Math.random() * 0.15, 8, 8]} />
            <meshStandardMaterial
              color={["#ffb7c5", "#ffc0cb", "#ff91a4", "#ffa6c9"][i % 4]}
              emissive="#ff69b4"
              emissiveIntensity={0.1}
              transparent opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---- Pond ----
function Pond() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.08 + Math.sin(s.clock.elapsedTime * 0.8) * 0.04;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3]}>
      <circleGeometry args={[3, 32]} />
      <meshStandardMaterial color="#2a6b8a" emissive="#1a5070" emissiveIntensity={0.1} transparent opacity={0.8} roughness={0.1} metalness={0.4} />
    </mesh>
  );
}

// ---- Bridge ----
function Bridge() {
  return (
    <group position={[0, 0.15, -3]} rotation={[0, 0.3, 0]}>
      {/* Bridge deck */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Arch */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Rails */}
      {[-0.2, 0.2].map((z) => (
        <group key={z}>
          {[-0.5, 0, 0.5].map((x) => (
            <mesh key={x} position={[x, 0.3, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
              <meshStandardMaterial color="#A0522D" />
            </mesh>
          ))}
          <mesh position={[0, 0.45, z]}>
            <boxGeometry args={[1.2, 0.03, 0.03]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---- Stone Lantern ----
function StoneLantern({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (lightRef.current) lightRef.current.intensity = 0.8 + Math.sin(s.clock.elapsedTime * 2 + position[0]) * 0.3;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.06, 0.08, 0.3, 6]} /><meshStandardMaterial color="#888" /></mesh>
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.15, 0.12, 0.15]} /><meshStandardMaterial color="#999" /></mesh>
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.1, 0.1, 0.1]} /><meshStandardMaterial color="#ffdd57" emissive="#ffaa00" emissiveIntensity={1} transparent opacity={0.8} /></mesh>
      <mesh position={[0, 0.48, 0]}><coneGeometry args={[0.12, 0.1, 4]} /><meshStandardMaterial color="#777" /></mesh>
      <pointLight ref={lightRef} position={[0, 0.35, 0]} color="#ffaa44" intensity={0.8} distance={3} />
    </group>
  );
}

// ---- Bench ----
function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.8, 0.04, 0.25]} /><meshStandardMaterial color="#8B4513" /></mesh>
      <mesh position={[0, 0.35, -0.1]}><boxGeometry args={[0.8, 0.25, 0.04]} /><meshStandardMaterial color="#8B4513" /></mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}><boxGeometry args={[0.04, 0.2, 0.25]} /><meshStandardMaterial color="#5C3317" /></mesh>
      ))}
    </group>
  );
}

// ---- Falling petals ----
function FallingPetals({ count = 80 }: { count?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.06, 0.1, 0.12, 0.2, 0.05, 0.3);
    s.bezierCurveTo(0, 0.33, -0.05, 0.3, -0.05, 0.3);
    s.bezierCurveTo(-0.12, 0.2, -0.06, 0.1, 0, 0);
    return new THREE.ShapeGeometry(s, 4);
  }, []);

  interface PD { pos: THREE.Vector3; vel: THREE.Vector3; rot: THREE.Euler; rs: THREE.Vector3; sc: number; }
  const petals = useMemo<PD[]>(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 24, Math.random() * 8 + 2, (Math.random() - 0.5) * 16),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.3, -(0.3 + Math.random() * 0.5), (Math.random() - 0.5) * 0.2),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      rs: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2),
      sc: 0.2 + Math.random() * 0.35,
    })), [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    petals.forEach((p, i) => {
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.pos.x += Math.sin(t * 0.8 + i) * delta * 0.4;
      if (p.pos.y < -0.5) { p.pos.y = 8 + Math.random() * 3; p.pos.x = (Math.random() - 0.5) * 24; }
      p.rot.x += p.rs.x * delta;
      p.rot.y += p.rs.y * delta;
      const m = refs.current[i];
      if (m) { m.position.copy(p.pos); m.rotation.copy(p.rot); m.scale.setScalar(p.sc); }
    });
  });

  const colors = ["#ffb7c5", "#ffc0cb", "#ff91a4", "#ffa6c9", "#ffd1dc", "#fff0f5"];
  return (
    <group>
      {petals.map((p, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} geometry={geo}>
          <meshStandardMaterial color={colors[i % colors.length]} side={THREE.DoubleSide} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== SAKURA PARK MAP ====================
export default function SakuraPark() {
  return (
    <>
      <color attach="background" args={["#1a0a20"]} />
      <fog attach="fog" args={["#1a0a20", 10, 28]} />
      <ambientLight intensity={0.25} color="#dda0dd" />
      <directionalLight position={[3, 6, 2]} intensity={0.5} color="#ffb6c1" />
      <hemisphereLight args={["#ff69b4", "#1a1a2e", 0.2]} />
      <Stars radius={50} depth={30} count={1800} factor={3} fade speed={0.8} />

      {/* Moon */}
      <group position={[-6, 9, -14]}>
        <mesh><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#fffde8" emissive="#fffde8" emissiveIntensity={0.4} /></mesh>
        <pointLight color="#fffde8" intensity={1.5} distance={25} />
      </group>

      {/* Ground - grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]}>
        <planeGeometry args={[2, 30]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, -1]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Sakura trees */}
      <SakuraTree position={[-3, 0, 0]} scale={1.2} />
      <SakuraTree position={[3, 0, -1]} scale={1} />
      <SakuraTree position={[-5, 0, 4]} scale={1.3} />
      <SakuraTree position={[5, 0, 5]} scale={1.1} />
      <SakuraTree position={[-7, 0, -4]} scale={0.9} />
      <SakuraTree position={[7, 0, -3]} scale={1.2} />
      <SakuraTree position={[-2, 0, -6]} scale={1.4} />
      <SakuraTree position={[4, 0, -7]} scale={1} />
      <SakuraTree position={[0, 0, 7]} scale={1.1} />
      <SakuraTree position={[-8, 0, 7]} scale={1.3} />
      <SakuraTree position={[9, 0, 2]} scale={0.8} />

      <Pond />
      <Bridge />

      {/* Lanterns */}
      <StoneLantern position={[-1.5, 0, 1]} />
      <StoneLantern position={[1.5, 0, 1]} />
      <StoneLantern position={[-1.5, 0, 3]} />
      <StoneLantern position={[1.5, 0, 3]} />

      {/* Benches */}
      <Bench position={[-2.5, 0, 2]} rotation={Math.PI / 2} />
      <Bench position={[2.5, 0, 2]} rotation={-Math.PI / 2} />

      <FallingPetals count={80} />
    </>
  );
}
