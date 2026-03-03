"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Petal({
  index,
  totalPetals,
  layer,
  bloomProgress,
}: {
  index: number;
  totalPetals: number;
  layer: number;
  bloomProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / totalPetals) * Math.PI * 2;
  const layerOffset = layer * 0.15;
  const layerDelay = layer * 0.15;

  const petalShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.3, 0.35, 0.6, 0.15, 1.0);
    shape.bezierCurveTo(0.05, 1.15, -0.05, 1.15, -0.15, 1.0);
    shape.bezierCurveTo(-0.35, 0.6, -0.15, 0.3, 0, 0);
    return shape;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(petalShape, 16);
    return geo;
  }, [petalShape]);

  const adjustedProgress = Math.max(0, Math.min(1, (bloomProgress - layerDelay) / (1 - layerDelay)));
  const smoothProgress = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress);

  const openAngle = smoothProgress * (0.6 + layer * 0.25);

  const color = useMemo(() => {
    const colors = [
      new THREE.Color("#ff1493"), // deep pink
      new THREE.Color("#ff69b4"), // hot pink
      new THREE.Color("#ff85a2"), // light pink
      new THREE.Color("#ffb6c1"), // lighter pink
    ];
    return colors[layer % colors.length];
  }, [layer]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = angle;
    meshRef.current.rotation.x = -openAngle;
    meshRef.current.position.y = layerOffset;
    meshRef.current.scale.setScalar(0.3 + smoothProgress * 0.7);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function FlowerCenter({ bloomProgress }: { bloomProgress: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = 0.1 + bloomProgress * 0.15;
    ref.current.scale.setScalar(scale);
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={ref} position={[0, 0.05, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#ffd700" roughness={0.6} />
    </mesh>
  );
}

function Stem() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(
        new THREE.Vector3(
          Math.sin(t * 0.3) * 0.05,
          -t * 3,
          Math.cos(t * 0.2) * 0.03
        )
      );
    }
    return pts;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.04, 8, false]} />
      <meshStandardMaterial color="#228B22" roughness={0.8} />
    </mesh>
  );
}

function Leaf({ side }: { side: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.3 * side, 0.2, 0.5 * side, 0.5, 0.1 * side, 0.8);
    s.bezierCurveTo(0, 0.6, 0, 0.3, 0, 0);
    return s;
  }, [side]);

  return (
    <mesh
      position={[0.05 * side, -1.5 - Math.random() * 0.5, 0]}
      rotation={[0, 0, side * -0.3]}
    >
      <shapeGeometry args={[shape, 12]} />
      <meshStandardMaterial
        color="#2d8b2d"
        side={THREE.DoubleSide}
        roughness={0.7}
      />
    </mesh>
  );
}

export default function BloomingFlower({
  bloomProgress,
}: {
  bloomProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  const layers = [
    { petals: 5, layer: 3 },
    { petals: 7, layer: 2 },
    { petals: 8, layer: 1 },
    { petals: 10, layer: 0 },
  ];

  return (
    <group ref={groupRef}>
      {layers.map((layerConfig) =>
        Array.from({ length: layerConfig.petals }).map((_, i) => (
          <Petal
            key={`${layerConfig.layer}-${i}`}
            index={i}
            totalPetals={layerConfig.petals}
            layer={layerConfig.layer}
            bloomProgress={bloomProgress}
          />
        ))
      )}
      <FlowerCenter bloomProgress={bloomProgress} />
      <Stem />
      <Leaf side={1} />
      <Leaf side={-1} />
    </group>
  );
}
