"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PetalData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  rotSpeed: THREE.Vector3;
  swayOffset: number;
  swaySpeed: number;
  scale: number;
  color: THREE.Color;
}

export default function FloatingPetals({ count = 50 }: { count?: number }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.1, 0.15, 0.2, 0.3, 0.08, 0.5);
    shape.bezierCurveTo(0.02, 0.55, -0.02, 0.55, -0.08, 0.5);
    shape.bezierCurveTo(-0.2, 0.3, -0.1, 0.15, 0, 0);
    return new THREE.ShapeGeometry(shape, 8);
  }, []);

  const petals = useMemo<PetalData[]>(() => {
    const colors = [
      new THREE.Color("#ffb6c1"),
      new THREE.Color("#ff69b4"),
      new THREE.Color("#ffc0cb"),
      new THREE.Color("#ff85a2"),
      new THREE.Color("#ffd1dc"),
      new THREE.Color("#fff0f5"),
    ];

    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        Math.random() * 12 - 2,
        (Math.random() - 0.5) * 8
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      speed: 0.2 + Math.random() * 0.5,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 1.5,
      scale: 0.15 + Math.random() * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    petals.forEach((p, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      p.position.y -= p.speed * delta;
      p.position.x += Math.sin(time * p.swaySpeed + p.swayOffset) * delta * 0.5;

      if (p.position.y < -4) {
        p.position.y = 8;
        p.position.x = (Math.random() - 0.5) * 16;
      }

      mesh.position.copy(p.position);
      mesh.rotation.x += p.rotSpeed.x * delta;
      mesh.rotation.y += p.rotSpeed.y * delta;
      mesh.rotation.z += p.rotSpeed.z * delta;
      mesh.scale.setScalar(p.scale);
    });
  });

  return (
    <group>
      {petals.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={petalGeo}
        >
          <meshStandardMaterial
            color={p.color}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
