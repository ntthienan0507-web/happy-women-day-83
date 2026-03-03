"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BloomingFlower from "./BloomingFlower";
import HeartParticles from "./HeartParticles";
import FloatingPetals from "./FloatingPetals";
import BigHeart3D from "./BigHeart3D";

interface Scene3DProps {
  bloomProgress: number;
  scene: "flower" | "heart";
}

export default function Scene3D({ bloomProgress, scene }: Scene3DProps) {
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
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#ff69b4" />
      <pointLight position={[0, -1, 2]} intensity={0.4} color="#ffd700" />

      {scene === "flower" ? (
        <group position={[0, -0.5, 0]}>
          <BloomingFlower bloomProgress={bloomProgress} />
        </group>
      ) : (
        <BigHeart3D />
      )}

      <HeartParticles count={25} />
      <FloatingPetals count={40} />

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
