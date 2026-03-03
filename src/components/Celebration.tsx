"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---- Explosion of flowers + hearts + confetti ----
export default function Celebration({ origin }: { origin: [number, number, number] }) {
  const [particles] = useState(() => {
    const arr: {
      pos: THREE.Vector3; vel: THREE.Vector3; color: THREE.Color; size: number;
      rotSpeed: THREE.Vector3; type: "heart" | "flower" | "confetti" | "star";
      life: number;
    }[] = [];

    const colors = [
      "#ff1493", "#ff69b4", "#ff85a2", "#ffd700", "#ff4500",
      "#c084fc", "#06d6a0", "#ffffff", "#fbbf24", "#e91e63",
      "#f472b6", "#a78bfa", "#fb923c", "#f43f5e",
    ];

    // Big explosion - 200 particles!
    for (let i = 0; i < 200; i++) {
      const dir = new THREE.Vector3().randomDirection();
      const speed = 1.5 + Math.random() * 5;
      const types: ("heart" | "flower" | "confetti" | "star")[] = ["heart", "flower", "confetti", "star"];
      arr.push({
        pos: new THREE.Vector3(origin[0], origin[1] + 1, origin[2]),
        vel: dir.multiplyScalar(speed),
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
        size: 0.03 + Math.random() * 0.08,
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        type: types[Math.floor(Math.random() * types.length)],
        life: 1,
      });
    }
    return arr;
  });

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Geometries
  const heartGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3); s.bezierCurveTo(0, 0.45, -0.15, 0.6, -0.35, 0.6);
    s.bezierCurveTo(-0.7, 0.6, -0.7, 0.225, -0.7, 0.225);
    s.bezierCurveTo(-0.7, 0, -0.35, -0.25, 0, -0.5);
    s.bezierCurveTo(0.35, -0.25, 0.7, 0, 0.7, 0.225);
    s.bezierCurveTo(0.7, 0.225, 0.7, 0.6, 0.35, 0.6);
    s.bezierCurveTo(0.15, 0.6, 0, 0.45, 0, 0.3);
    return new THREE.ShapeGeometry(s, 6);
  }, []);

  const flowerGeo = useMemo(() => {
    const s = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = i % 2 === 0 ? 0.5 : 0.25;
      if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    s.closePath();
    return new THREE.ShapeGeometry(s, 4);
  }, []);

  useFrame((_, delta) => {
    particles.forEach((p, i) => {
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.vel.y -= delta * 3; // gravity
      p.vel.multiplyScalar(0.995); // drag
      p.life -= delta * 0.2;

      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.pos);
        mesh.rotation.x += p.rotSpeed.x * delta;
        mesh.rotation.y += p.rotSpeed.y * delta;
        mesh.rotation.z += p.rotSpeed.z * delta;
        mesh.scale.setScalar(p.size * Math.max(0, p.life));
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, p.life);
      }
    });
  });

  return (
    <group>
      {particles.map((p, i) => {
        const geo = p.type === "heart" ? heartGeo :
                    p.type === "flower" ? flowerGeo :
                    undefined;
        return (
          <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} geometry={geo}>
            {p.type === "confetti" ? (
              <boxGeometry args={[1, 1, 0.1]} />
            ) : p.type === "star" ? (
              <octahedronGeometry args={[0.5, 0]} />
            ) : null}
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.5}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      {/* Explosion light */}
      <pointLight position={[origin[0], origin[1] + 2, origin[2]]} color="#ffd700" intensity={5} distance={10} />
      <pointLight position={[origin[0], origin[1] + 1, origin[2]]} color="#ff69b4" intensity={3} distance={8} />
    </group>
  );
}
