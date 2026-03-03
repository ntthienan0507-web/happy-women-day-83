"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MazeData } from "./MazeGenerator";
import { isWall, gridToWorld } from "./MazeGenerator";
import type { MapType } from "./CityWalkScene";

export interface EnemyInstance {
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  changeTimer: number;
}

// Find random open positions for enemies
function spawnEnemies(maze: MazeData, count: number): EnemyInstance[] {
  const open: [number, number][] = [];
  for (let r = 2; r < maze.rows - 2; r++) {
    for (let c = 2; c < maze.cols - 2; c++) {
      if (maze.grid[r][c] === 0) {
        // Don't spawn near start
        const [wx, wz] = gridToWorld(r, c, maze);
        const [sx, sz] = gridToWorld(maze.startCell[0], maze.startCell[1], maze);
        if (Math.sqrt((wx - sx) ** 2 + (wz - sz) ** 2) > 4) {
          open.push([r, c]);
        }
      }
    }
  }

  const enemies: EnemyInstance[] = [];
  const dirs = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];

  for (let i = 0; i < count && open.length > 0; i++) {
    const idx = Math.floor(Math.random() * open.length);
    const [r, c] = open.splice(idx, 1)[0];
    const [wx, wz] = gridToWorld(r, c, maze);
    enemies.push({
      pos: new THREE.Vector3(wx, 0, wz),
      dir: dirs[Math.floor(Math.random() * 4)].clone(),
      speed: 1 + Math.random() * 1.5,
      changeTimer: 2 + Math.random() * 3,
    });
  }
  return enemies;
}

// ---- Enemy visual per map theme ----
function EnemyModel({ mapType, walkPhase }: { mapType: MapType; walkPhase: number }) {
  if (mapType === "city") {
    // Evil robot
    return (
      <group>
        <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.25, 0.25, 0.2]} /><meshStandardMaterial color="#666" metalness={0.8} /></mesh>
        <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.2, 0.15, 0.18]} /><meshStandardMaterial color="#555" metalness={0.8} /></mesh>
        <mesh position={[-0.06, 0.42, 0.09]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} /></mesh>
        <mesh position={[0.06, 0.42, 0.09]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} /></mesh>
        {/* Legs */}
        <mesh position={[-0.08, 0.05, 0]} rotation={[Math.sin(walkPhase) * 0.4, 0, 0]}><boxGeometry args={[0.06, 0.12, 0.06]} /><meshStandardMaterial color="#444" /></mesh>
        <mesh position={[0.08, 0.05, 0]} rotation={[Math.sin(walkPhase + Math.PI) * 0.4, 0, 0]}><boxGeometry args={[0.06, 0.12, 0.06]} /><meshStandardMaterial color="#444" /></mesh>
      </group>
    );
  }
  if (mapType === "beach") {
    // Angry crab
    return (
      <group>
        <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.15, 8, 6]} /><meshStandardMaterial color="#cc4400" /></mesh>
        <mesh position={[-0.06, 0.18, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#000" /></mesh>
        <mesh position={[0.06, 0.18, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#000" /></mesh>
        {/* Claws */}
        <mesh position={[-0.2, 0.12, 0]} rotation={[0, 0, Math.sin(walkPhase * 2) * 0.3]}><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#dd5500" /></mesh>
        <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, -Math.sin(walkPhase * 2) * 0.3]}><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#dd5500" /></mesh>
        {/* Legs */}
        {[-0.1, 0, 0.1].map((z, i) => (
          <group key={i}>
            <mesh position={[-0.14, 0.03, z]} rotation={[0, 0, 0.5 + Math.sin(walkPhase + i) * 0.2]}><cylinderGeometry args={[0.01, 0.01, 0.1, 3]} /><meshStandardMaterial color="#aa3300" /></mesh>
            <mesh position={[0.14, 0.03, z]} rotation={[0, 0, -0.5 - Math.sin(walkPhase + i) * 0.2]}><cylinderGeometry args={[0.01, 0.01, 0.1, 3]} /><meshStandardMaterial color="#aa3300" /></mesh>
          </group>
        ))}
      </group>
    );
  }
  if (mapType === "sakura") {
    // Cute ghost
    const bob = Math.sin(walkPhase * 2) * 0.05;
    return (
      <group position={[0, bob, 0]}>
        <mesh position={[0, 0.2, 0]}><capsuleGeometry args={[0.12, 0.15, 4, 8]} /><meshStandardMaterial color="#dda0dd" transparent opacity={0.7} emissive="#9966cc" emissiveIntensity={0.3} /></mesh>
        <mesh position={[-0.05, 0.28, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0.05, 0.28, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0, 0.22, 0.11]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#333" /></mesh>
      </group>
    );
  }
  if (mapType === "garden") {
    // Slime
    const squash = 1 + Math.sin(walkPhase * 3) * 0.15;
    return (
      <group>
        <mesh position={[0, 0.1, 0]} scale={[squash, 1 / squash, squash]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#44cc44" emissive="#22aa22" emissiveIntensity={0.3} transparent opacity={0.85} />
        </mesh>
        <mesh position={[-0.05, 0.16, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0.05, 0.16, 0.1]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[-0.05, 0.16, 0.12]}><sphereGeometry args={[0.015, 4, 4]} /><meshStandardMaterial color="#000" /></mesh>
        <mesh position={[0.05, 0.16, 0.12]}><sphereGeometry args={[0.015, 4, 4]} /><meshStandardMaterial color="#000" /></mesh>
      </group>
    );
  }
  // ocean - pufferfish
  const puff = 1 + Math.sin(walkPhase * 2) * 0.2;
  return (
    <group>
      <mesh position={[0, 0.15, 0]} scale={puff}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff8800" emissiveIntensity={0.2} />
      </mesh>
      {/* Spikes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, 0.15, Math.sin(a) * 0.14]} rotation={[0, 0, a]}>
            <coneGeometry args={[0.015, 0.06, 3]} />
            <meshStandardMaterial color="#ff6600" />
          </mesh>
        );
      })}
      <mesh position={[-0.04, 0.2, 0.1]}><sphereGeometry args={[0.02, 4, 4]} /><meshStandardMaterial color="#000" /></mesh>
      <mesh position={[0.04, 0.2, 0.1]}><sphereGeometry args={[0.02, 4, 4]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  );
}

// ==================== ENEMY SYSTEM ====================
export default function Enemies({
  maze,
  mapType,
  playerPosRef,
  onHit,
  invincible,
}: {
  maze: MazeData;
  mapType: MapType;
  playerPosRef: React.RefObject<THREE.Vector3>;
  onHit: () => void;
  invincible: boolean;
}) {
  const enemyCount = mapType === "ocean" ? 6 : 8;
  const enemies = useRef<EnemyInstance[]>([]);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const walkPhaseRef = useRef(0);
  const initialized = useRef(false);

  if (!initialized.current) {
    enemies.current = spawnEnemies(maze, enemyCount);
    initialized.current = true;
  }

  useFrame((_, delta) => {
    walkPhaseRef.current += delta * 5;
    const hitRadius = 0.4;

    enemies.current.forEach((enemy, i) => {
      // Move
      enemy.changeTimer -= delta;
      const nextX = enemy.pos.x + enemy.dir.x * enemy.speed * delta;
      const nextZ = enemy.pos.z + enemy.dir.z * enemy.speed * delta;

      // Check wall collision
      if (!isWall(nextX, nextZ, maze, 0.15)) {
        enemy.pos.x = nextX;
        enemy.pos.z = nextZ;
      } else {
        enemy.changeTimer = 0; // force direction change
      }

      // Change direction periodically or on wall hit
      if (enemy.changeTimer <= 0) {
        const dirs = [
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 0, -1),
        ];
        enemy.dir = dirs[Math.floor(Math.random() * 4)];
        enemy.changeTimer = 1.5 + Math.random() * 3;
      }

      // Update visual
      const g = groupRefs.current[i];
      if (g) {
        g.position.set(enemy.pos.x, 0, enemy.pos.z);
        g.rotation.y = Math.atan2(enemy.dir.x, enemy.dir.z);
      }

      // Player collision check
      if (!invincible && playerPosRef.current) {
        const dx = enemy.pos.x - playerPosRef.current.x;
        const dz = enemy.pos.z - playerPosRef.current.z;
        if (Math.sqrt(dx * dx + dz * dz) < hitRadius) {
          onHit();
        }
      }
    });
  });

  return (
    <group>
      {enemies.current.map((_, i) => (
        <group key={i} ref={(el) => { groupRefs.current[i] = el; }}>
          <EnemyModel mapType={mapType} walkPhase={walkPhaseRef.current} />
          {/* Enemy danger glow */}
          <pointLight color="#ff0000" intensity={0.3} distance={1.5} position={[0, 0.3, 0]} />
        </group>
      ))}
    </group>
  );
}
