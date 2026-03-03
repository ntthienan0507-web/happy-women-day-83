"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const x = 0,
    y = 0;
  shape.moveTo(x, y + 0.3);
  shape.bezierCurveTo(x, y + 0.45, x - 0.15, y + 0.6, x - 0.35, y + 0.6);
  shape.bezierCurveTo(x - 0.7, y + 0.6, x - 0.7, y + 0.225, x - 0.7, y + 0.225);
  shape.bezierCurveTo(x - 0.7, y, x - 0.35, y - 0.25, x, y - 0.5);
  shape.bezierCurveTo(x + 0.35, y - 0.25, x + 0.7, y, x + 0.7, y + 0.225);
  shape.bezierCurveTo(x + 0.7, y + 0.225, x + 0.7, y + 0.6, x + 0.35, y + 0.6);
  shape.bezierCurveTo(x + 0.15, y + 0.6, x, y + 0.45, x, y + 0.3);
  return shape;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: THREE.Color;
}

export default function HeartParticles({ count = 30 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const heartGeometry = useMemo(() => {
    const shape = createHeartShape();
    return new THREE.ShapeGeometry(shape, 12);
  }, []);

  const particles = useRef<Particle[]>(
    Array.from({ length: count }).map(() => createParticle())
  );

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  function createParticle(): Particle {
    const colors = [
      new THREE.Color("#ff1493"),
      new THREE.Color("#ff69b4"),
      new THREE.Color("#ff85a2"),
      new THREE.Color("#dc143c"),
      new THREE.Color("#ff4500"),
      new THREE.Color("#ff6b81"),
    ];
    const maxLife = 3 + Math.random() * 5;
    return {
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        -4 + Math.random() * 2,
        (Math.random() - 0.5) * 6
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        0.3 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.1
      ),
      scale: 0.05 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.6 + Math.random() * 0.4,
      life: Math.random() * maxLife,
      maxLife,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  useFrame((_, delta) => {
    particles.current.forEach((p, i) => {
      p.life += delta;
      if (p.life >= p.maxLife) {
        Object.assign(p, createParticle());
        p.life = 0;
      }

      p.position.add(p.velocity.clone().multiplyScalar(delta));
      p.velocity.x += Math.sin(p.life * 2) * delta * 0.1;
      p.rotation += p.rotationSpeed * delta;

      const lifeRatio = p.life / p.maxLife;
      const fadeIn = Math.min(1, lifeRatio * 5);
      const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
      const currentOpacity = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.position);
        mesh.rotation.z = p.rotation;
        mesh.scale.setScalar(p.scale);
        (mesh.material as THREE.MeshStandardMaterial).opacity = currentOpacity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={heartGeometry}
        >
          <meshStandardMaterial
            color={p.color}
            transparent
            opacity={p.opacity}
            side={THREE.DoubleSide}
            emissive={p.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
