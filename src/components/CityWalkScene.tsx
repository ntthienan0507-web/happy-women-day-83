"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChibiCouple from "./ChibiCouple";
import { FloatingHearts3D } from "./maps/SharedEffects";
import TargetMarker, { DirectionArrow } from "./TargetMarker";
import Celebration from "./Celebration";
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

function randomTargetPos(boundary: number): [number, number, number] {
  const margin = 2;
  const range = boundary - margin;
  // Ensure target is not too close to center (min distance 4)
  let x: number, z: number;
  do {
    x = (Math.random() - 0.5) * 2 * range;
    z = (Math.random() - 0.5) * 2 * range;
  } while (Math.sqrt(x * x + z * z) < 4);
  return [x, 0, z];
}

// ---- Proximity checker component ----
function ProximityChecker({
  playerPosRef,
  targetPos,
  onReached,
}: {
  playerPosRef: React.RefObject<THREE.Vector3>;
  targetPos: [number, number, number];
  onReached: () => void;
}) {
  const reached = useRef(false);

  useFrame(() => {
    if (reached.current || !playerPosRef.current) return;
    const dx = playerPosRef.current.x - targetPos[0];
    const dz = playerPosRef.current.z - targetPos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1.2) {
      reached.current = true;
      onReached();
    }
  });

  return null;
}

// ---- Distance HUD (rendered inside Canvas) ----
function DistanceTracker({
  playerPosRef,
  targetPos,
  distanceRef,
}: {
  playerPosRef: React.RefObject<THREE.Vector3>;
  targetPos: [number, number, number];
  distanceRef: React.MutableRefObject<number>;
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
}: {
  map: MapType;
  keysRef: React.RefObject<KeyState>;
  onCelebration: () => void;
}) {
  const Map = MapComponent[map];
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const [targetPos] = useState<[number, number, number]>(() => randomTargetPos(10));
  const [celebrating, setCelebrating] = useState(false);
  const distanceRef = useRef(10);

  // For the HTML distance display
  const [displayDist, setDisplayDist] = useState(10);

  const handleReached = useCallback(() => {
    setCelebrating(true);
    onCelebration();
  }, [onCelebration]);

  // Periodic distance update for HTML overlay
  const frameCounter = useRef(0);
  const DistanceUpdater = () => {
    useFrame(() => {
      frameCounter.current++;
      if (frameCounter.current % 10 === 0) {
        setDisplayDist(distanceRef.current);
      }
    });
    return null;
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        shadows={false}
      >
        <Suspense fallback={null}>
          <Map />
          <ChibiCouple keysRef={keysRef} boundary={11} playerPosRef={playerPosRef} />
          <FloatingHearts3D count={20} />

          {/* Target system */}
          {!celebrating && (
            <>
              <TargetMarker position={targetPos} />
              <DirectionArrow playerPos={playerPosRef} targetPos={targetPos} />
              <ProximityChecker playerPosRef={playerPosRef} targetPos={targetPos} onReached={handleReached} />
            </>
          )}

          {/* Celebration explosion */}
          {celebrating && <Celebration origin={targetPos} />}

          <DistanceTracker playerPosRef={playerPosRef} targetPos={targetPos} distanceRef={distanceRef} />
          <DistanceUpdater />
        </Suspense>
      </Canvas>

      {/* Distance HUD overlay */}
      {!celebrating && (
        <div className="distance-hud">
          <div className="distance-icon">📍</div>
          <div className="distance-text">{displayDist.toFixed(1)}m</div>
          <div className="distance-label">đến 8/3</div>
        </div>
      )}
    </div>
  );
}
