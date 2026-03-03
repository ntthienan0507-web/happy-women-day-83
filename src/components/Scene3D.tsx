"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import BloomingFlower from "./BloomingFlower";
import HeartParticles from "./HeartParticles";
import FloatingPetals from "./FloatingPetals";
import BigHeart3D from "./BigHeart3D";

interface Scene3DProps {
  bloomProgress: number;
}

// ---- Burst particles (hearts & petals flying outward) ----
function BurstParticles({ type }: { type: "flower" | "heart" }) {
  const count = 35;
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const heartGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.bezierCurveTo(0, 0.45, -0.15, 0.6, -0.35, 0.6);
    s.bezierCurveTo(-0.7, 0.6, -0.7, 0.225, -0.7, 0.225);
    s.bezierCurveTo(-0.7, 0, -0.35, -0.25, 0, -0.5);
    s.bezierCurveTo(0.35, -0.25, 0.7, 0, 0.7, 0.225);
    s.bezierCurveTo(0.7, 0.225, 0.7, 0.6, 0.35, 0.6);
    s.bezierCurveTo(0.15, 0.6, 0, 0.45, 0, 0.3);
    return new THREE.ShapeGeometry(s, 6);
  }, []);

  const petalGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.1, 0.15, 0.2, 0.3, 0.08, 0.5);
    s.bezierCurveTo(0.02, 0.55, -0.02, 0.55, -0.08, 0.5);
    s.bezierCurveTo(-0.2, 0.3, -0.1, 0.15, 0, 0);
    return new THREE.ShapeGeometry(s, 6);
  }, []);

  interface BP {
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    rotSpeed: THREE.Vector3;
    scale: number;
    life: number;
  }

  const particles = useRef<BP[]>(
    Array.from({ length: count }, () => {
      const dir = new THREE.Vector3().randomDirection();
      const speed = 2 + Math.random() * 5;
      return {
        pos: new THREE.Vector3(0, 0, 0),
        vel: dir.multiplyScalar(speed),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
        scale: 0.06 + Math.random() * 0.12,
        life: 1,
      };
    })
  );

  const colors = useMemo(
    () =>
      type === "heart"
        ? ["#ff1493", "#ff69b4", "#e91e63", "#dc143c", "#ff4081"]
        : ["#ff69b4", "#ffb6c1", "#ffc0cb", "#ff85a2", "#ffd1dc"],
    [type]
  );

  useFrame((_, delta) => {
    particles.current.forEach((p, i) => {
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.vel.y -= delta * 3; // gravity
      p.vel.multiplyScalar(0.99); // drag
      p.life -= delta * 0.5;

      const m = meshRefs.current[i];
      if (m) {
        m.position.copy(p.pos);
        m.rotation.x += p.rotSpeed.x * delta;
        m.rotation.y += p.rotSpeed.y * delta;
        m.rotation.z += p.rotSpeed.z * delta;
        m.scale.setScalar(p.scale * Math.max(0, p.life));
        (m.material as THREE.MeshStandardMaterial).opacity = Math.max(
          0,
          p.life
        );
      }
    });
  });

  const geo = type === "heart" ? heartGeo : petalGeo;

  return (
    <group>
      {particles.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geo}
        >
          <meshStandardMaterial
            color={colors[i % colors.length]}
            emissive={colors[i % colors.length]}
            emissiveIntensity={0.4}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---- Scene cycler: show → grow → burst → switch ----
function SceneCycler({ bloomProgress }: { bloomProgress: number }) {
  const [currentScene, setCurrentScene] = useState<"flower" | "heart">(
    "flower"
  );
  const [showBurst, setShowBurst] = useState(false);
  const [burstType, setBurstType] = useState<"flower" | "heart">("flower");

  const phaseRef = useRef(0); // 0=show, 1=grow, 2=burst
  const clockRef = useRef(0);
  const mainRef = useRef<THREE.Group>(null);
  const baseScale = useRef(1);

  // Timing: 7s show, 1.5s grow, 1.5s burst = 10s total
  useFrame((_, delta) => {
    clockRef.current += delta;

    if (phaseRef.current === 0) {
      // Show phase
      if (mainRef.current) {
        mainRef.current.visible = true;
        // Gentle breathing effect
        const breath = 1 + Math.sin(clockRef.current * 1.5) * 0.03;
        mainRef.current.scale.setScalar(breath);
      }
      if (clockRef.current > 7) {
        phaseRef.current = 1;
        clockRef.current = 0;
        baseScale.current = 1;
      }
    } else if (phaseRef.current === 1) {
      // Grow phase - scale up with easing
      const t = Math.min(clockRef.current / 1.5, 1);
      const eased = t * t * (3 - 2 * t); // smoothstep
      const scale = 1 + eased * 0.8; // grow to 1.8x
      if (mainRef.current) {
        mainRef.current.scale.setScalar(scale);
        // Slight shake at the end
        if (t > 0.7) {
          const shake = (t - 0.7) / 0.3;
          mainRef.current.position.x = Math.sin(clockRef.current * 30) * shake * 0.05;
          mainRef.current.position.y = Math.cos(clockRef.current * 25) * shake * 0.05;
        }
      }
      if (clockRef.current > 1.5) {
        phaseRef.current = 2;
        clockRef.current = 0;
        if (mainRef.current) {
          mainRef.current.visible = false;
          mainRef.current.position.x = 0;
          mainRef.current.position.y = 0;
        }
        setBurstType(currentScene);
        setShowBurst(true);
      }
    } else if (phaseRef.current === 2) {
      // Burst phase - particles flying
      if (clockRef.current > 2) {
        phaseRef.current = 0;
        clockRef.current = 0;
        setShowBurst(false);
        setCurrentScene((prev) =>
          prev === "flower" ? "heart" : "flower"
        );
        if (mainRef.current) {
          mainRef.current.scale.setScalar(1);
        }
      }
    }
  });

  return (
    <>
      <group ref={mainRef}>
        {currentScene === "flower" ? (
          <group position={[0, -0.5, 0]}>
            <BloomingFlower bloomProgress={bloomProgress} />
          </group>
        ) : (
          <BigHeart3D />
        )}
      </group>
      {showBurst && <BurstParticles type={burstType} />}
    </>
  );
}

export default function Scene3D({ bloomProgress }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5f5" />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.5}
        color="#ffb6c1"
      />

      <SceneCycler bloomProgress={bloomProgress} />

      <HeartParticles count={20} />
      <FloatingPetals count={30} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
