"use client";

import { Suspense, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChibiCouple from "./ChibiCouple";
import { FloatingHearts3D } from "./maps/SharedEffects";
import TargetMarker, { DirectionArrow } from "./TargetMarker";
import Celebration from "./Celebration";
import MazeRenderer from "./MazeRenderer";
import Enemies from "./Enemies";
import { generateMaze, gridToWorld, randomOpenPosition } from "./MazeGenerator";
import type { MazeData } from "./MazeGenerator";
import type { KeyState } from "./useKeyboard";

import CityNight from "./maps/CityNight";
import BeachSunset from "./maps/BeachSunset";
import SakuraPark from "./maps/SakuraPark";
import FairyGarden from "./maps/FairyGarden";
import OceanNight from "./maps/OceanNight";

export type MapType = "city" | "beach" | "sakura" | "garden" | "ocean";

const MapComponent: Record<MapType, React.ComponentType> = {
  city: CityNight,
  beach: BeachSunset,
  sakura: SakuraPark,
  garden: FairyGarden,
  ocean: OceanNight,
};

// Maze sizes per map
const MAZE_SIZE: Record<MapType, { w: number; h: number; cell: number }> = {
  city: { w: 10, h: 10, cell: 1.6 },
  beach: { w: 9, h: 9, cell: 1.7 },
  sakura: { w: 10, h: 10, cell: 1.5 },
  garden: { w: 11, h: 11, cell: 1.4 },
  ocean: { w: 8, h: 8, cell: 1.8 },
};

// ---- Proximity checker ----
function ProximityChecker({
  playerPosRef, targetPos, onReached,
}: {
  playerPosRef: React.RefObject<THREE.Vector3>; targetPos: [number, number, number]; onReached: () => void;
}) {
  const reached = useRef(false);
  useFrame(() => {
    if (reached.current || !playerPosRef.current) return;
    const dx = playerPosRef.current.x - targetPos[0];
    const dz = playerPosRef.current.z - targetPos[2];
    if (Math.sqrt(dx * dx + dz * dz) < 1.2) { reached.current = true; onReached(); }
  });
  return null;
}

// ---- Distance tracker ----
function DistanceTracker({
  playerPosRef, targetPos, distanceRef,
}: {
  playerPosRef: React.RefObject<THREE.Vector3>; targetPos: [number, number, number]; distanceRef: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    if (!playerPosRef.current) return;
    const dx = playerPosRef.current.x - targetPos[0];
    const dz = playerPosRef.current.z - targetPos[2];
    distanceRef.current = Math.sqrt(dx * dx + dz * dz);
  });
  return null;
}

export default function CityWalkScene({
  map,
  keysRef,
  onCelebration,
  hp,
  onHit,
  invincible,
  gameOver,
}: {
  map: MapType;
  keysRef: React.RefObject<KeyState>;
  onCelebration: () => void;
  hp: number;
  onHit: () => void;
  invincible: boolean;
  gameOver: boolean;
}) {
  const Map = MapComponent[map];
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const [celebrating, setCelebrating] = useState(false);
  const distanceRef = useRef(10);
  const [displayDist, setDisplayDist] = useState(10);

  // Generate maze
  const mazeConfig = MAZE_SIZE[map];
  const maze = useMemo<MazeData>(
    () => generateMaze(mazeConfig.w, mazeConfig.h, mazeConfig.cell),
    [mazeConfig.w, mazeConfig.h, mazeConfig.cell]
  );

  // Start position (center of first open cell)
  const startPos = useMemo<[number, number]>(
    () => gridToWorld(maze.startCell[0], maze.startCell[1], maze),
    [maze]
  );

  // Target position (random far open cell)
  const targetWorldPos = useMemo<[number, number, number]>(() => {
    const [tx, tz] = randomOpenPosition(maze);
    return [tx, 0, tz];
  }, [maze]);

  const handleReached = useCallback(() => {
    setCelebrating(true);
    onCelebration();
  }, [onCelebration]);

  // Distance updater
  const frameCounter = useRef(0);
  const DistanceUpdater = () => {
    useFrame(() => {
      frameCounter.current++;
      if (frameCounter.current % 10 === 0) setDisplayDist(distanceRef.current);
    });
    return null;
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1]}
        shadows={false}
      >
        <Suspense fallback={null}>
          <Map />
          <MazeRenderer maze={maze} mapType={map} />
          <ChibiCouple
            keysRef={keysRef}
            playerPosRef={playerPosRef}
            maze={maze}
            invincible={invincible}
            startPos={startPos}
          />
          <FloatingHearts3D count={6} />

          {/* Enemies */}
          {!celebrating && !gameOver && (
            <Enemies
              maze={maze}
              mapType={map}
              playerPosRef={playerPosRef}
              onHit={onHit}
              invincible={invincible}
            />
          )}

          {/* Target */}
          {!celebrating && (
            <>
              <TargetMarker position={targetWorldPos} />
              <DirectionArrow playerPos={playerPosRef} targetPos={targetWorldPos} />
              <ProximityChecker playerPosRef={playerPosRef} targetPos={targetWorldPos} onReached={handleReached} />
            </>
          )}

          {celebrating && <Celebration origin={targetWorldPos} />}

          <DistanceTracker playerPosRef={playerPosRef} targetPos={targetWorldPos} distanceRef={distanceRef} />
          <DistanceUpdater />
        </Suspense>
      </Canvas>

      {/* Distance + HP HUD */}
      {!celebrating && !gameOver && (
        <>
          <div className="distance-hud">
            <div className="distance-icon">📍</div>
            <div className="distance-text">{displayDist.toFixed(1)}m</div>
            <div className="distance-label">đến 8/3</div>
          </div>
          <div className="hp-hud">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`hp-heart ${i < hp ? "hp-heart-active" : "hp-heart-empty"}`}>
                {i < hp ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
