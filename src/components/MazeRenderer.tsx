"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MazeData } from "./MazeGenerator";
import { getWallPositions } from "./MazeGenerator";
import type { MapType } from "./CityWalkScene";

const WALL_COLORS: Record<MapType, { base: string; emissive: string; top: string }> = {
  city: { base: "#2a2a3e", emissive: "#1a1a2e", top: "#3a3a4e" },
  beach: { base: "#c4a875", emissive: "#8B6914", top: "#d4b885" },
  sakura: { base: "#5C3317", emissive: "#3a2010", top: "#6d4428" },
  garden: { base: "#1a4a1a", emissive: "#0a2a0a", top: "#2a6a2a" },
  ocean: { base: "#1a4a6a", emissive: "#0a2a4a", top: "#2a5a7a" },
};

export default function MazeRenderer({
  maze,
  mapType,
}: {
  maze: MazeData;
  mapType: MapType;
}) {
  const wallPositions = useMemo(() => getWallPositions(maze), [maze]);
  const colors = WALL_COLORS[mapType];
  const wallHeight = mapType === "ocean" ? 0.6 : 1.0;
  const cs = maze.cellSize;

  // Use InstancedMesh for performance
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const topRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!meshRef.current || !topRef.current) return;
    const dummy = new THREE.Object3D();
    wallPositions.forEach(([wx, wz], i) => {
      dummy.position.set(wx, wallHeight / 2, wz);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      // Top cap slightly above
      dummy.position.set(wx, wallHeight + 0.02, wz);
      dummy.updateMatrix();
      topRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    topRef.current.instanceMatrix.needsUpdate = true;
  }, [wallPositions, wallHeight]);

  // Decorative elements on some walls
  const decorPositions = useMemo(() => {
    return wallPositions.filter(() => Math.random() < 0.05).slice(0, 30);
  }, [wallPositions]);

  return (
    <group>
      {/* Wall bodies */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, wallPositions.length]}
        frustumCulled={true}
      >
        <boxGeometry args={[cs * 0.95, wallHeight, cs * 0.95]} />
        <meshStandardMaterial color={colors.base} roughness={0.8} />
      </instancedMesh>

      {/* Wall tops */}
      <instancedMesh
        ref={topRef}
        args={[undefined, undefined, wallPositions.length]}
        frustumCulled={true}
      >
        <boxGeometry args={[cs * 1.0, 0.05, cs * 1.0]} />
        <meshStandardMaterial color={colors.top} roughness={0.6} />
      </instancedMesh>

      {/* Decorations on some walls */}
      {decorPositions.map(([wx, wz], i) => (
        <WallDecor key={i} position={[wx, wallHeight, wz]} mapType={mapType} />
      ))}
    </group>
  );
}

function WallDecor({ position, mapType }: {
  position: [number, number, number]; mapType: MapType;
}) {

  if (mapType === "city") {
    return (
      <mesh position={[position[0], position[1] + 0.3, position[2]]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
    );
  }
  if (mapType === "garden") {
    return (
      <group position={position}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.02, 0.03, 0.1, 4]} /><meshStandardMaterial color="#ffe4c4" /></mesh>
        <mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.06, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c084fc" emissive="#8b5cf6" emissiveIntensity={0.5} /></mesh>
      </group>
    );
  }
  if (mapType === "sakura") {
    return (
      <mesh position={[position[0], position[1] + 0.15, position[2]]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#ffb7c5" emissive="#ff69b4" emissiveIntensity={0.2} />
      </mesh>
    );
  }
  if (mapType === "ocean") {
    return (
      <mesh position={[position[0], position[1] + 0.1, position[2]]}>
        <coneGeometry args={[0.06, 0.15, 5]} />
        <meshStandardMaterial color="#ff4060" emissive="#ff4060" emissiveIntensity={0.2} />
      </mesh>
    );
  }
  return null;
}
