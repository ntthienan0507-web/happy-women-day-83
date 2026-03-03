"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Center } from "@react-three/drei";
import * as THREE from "three";

// ---- Floating Hearts ----
export function FloatingHearts3D({ count = 30 }: { count?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const s = 1;
    shape.moveTo(0, s * 0.3);
    shape.bezierCurveTo(0, s * 0.45, -s * 0.15, s * 0.6, -s * 0.35, s * 0.6);
    shape.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.7, s * 0.225, -s * 0.7, s * 0.225);
    shape.bezierCurveTo(-s * 0.7, 0, -s * 0.35, -s * 0.25, 0, -s * 0.5);
    shape.bezierCurveTo(s * 0.35, -s * 0.25, s * 0.7, 0, s * 0.7, s * 0.225);
    shape.bezierCurveTo(s * 0.7, s * 0.225, s * 0.7, s * 0.6, s * 0.35, s * 0.6);
    shape.bezierCurveTo(s * 0.15, s * 0.6, 0, s * 0.45, 0, s * 0.3);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
  }, []);

  interface HD { pos: THREE.Vector3; vel: THREE.Vector3; sc: number; rot: number; rs: number; color: THREE.Color; life: number; ml: number; }
  const hearts = useRef<HD[]>(Array.from({ length: count }, () => makeH()));
  function makeH(): HD {
    const cs = ["#ff1493", "#ff69b4", "#ff85a2", "#dc143c", "#e91e63", "#f06292"];
    return {
      pos: new THREE.Vector3((Math.random() - 0.5) * 16, -1 + Math.random(), (Math.random() - 0.5) * 12),
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.2, 0.4 + Math.random() * 0.8, (Math.random() - 0.5) * 0.15),
      sc: 0.025 + Math.random() * 0.05, rot: Math.random() * 6, rs: (Math.random() - 0.5) * 2,
      color: new THREE.Color(cs[Math.floor(Math.random() * cs.length)]), life: Math.random() * 6, ml: 4 + Math.random() * 5,
    };
  }

  useFrame((s, d) => {
    hearts.current.forEach((h, i) => {
      h.life += d;
      if (h.life > h.ml) Object.assign(h, makeH(), { life: 0 });
      h.pos.add(h.vel.clone().multiplyScalar(d));
      h.pos.x += Math.sin(s.clock.elapsedTime + i) * d * 0.15;
      h.rot += h.rs * d;
      const ratio = h.life / h.ml;
      const fade = Math.min(1, ratio * 4) * (ratio > 0.7 ? Math.max(0, 1 - (ratio - 0.7) / 0.3) : 1);
      const m = refs.current[i];
      if (m) { m.position.copy(h.pos); m.rotation.y = h.rot; m.scale.setScalar(h.sc); (m.material as THREE.MeshStandardMaterial).opacity = fade; }
    });
  });

  return (
    <group>
      {hearts.current.map((h, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} geometry={geo}>
          <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={0.4} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ---- Floating 8/3 text ----
export function FloatingText83() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.15;
    ref.current.position.y = 6 + Math.sin(s.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <group ref={ref} position={[0, 6, -6]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Center>
          <group position={[-0.8, 0, 0]}>
            <mesh><torusGeometry args={[0.3, 0.08, 8, 16]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} /></mesh>
            <mesh position={[0, 0.55, 0]}><torusGeometry args={[0.25, 0.08, 8, 16]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} /></mesh>
          </group>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.08, 0.8, 0.08]} /><meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
          </mesh>
          <group position={[0.8, 0, 0]}>
            <mesh position={[0, 0.25, 0]}><torusGeometry args={[0.25, 0.08, 8, 16, Math.PI]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} /></mesh>
            <mesh position={[0, -0.25, 0]}><torusGeometry args={[0.25, 0.08, 8, 16, Math.PI]} /><meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} /></mesh>
          </group>
        </Center>
      </Float>
    </group>
  );
}
