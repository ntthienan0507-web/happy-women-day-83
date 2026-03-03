"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { KeyState } from "./useKeyboard";

// ==================== SINGLE CHIBI ====================
function ChibiBody({ isFemale, walkPhase }: { isFemale: boolean; walkPhase: number }) {
  const skinColor = "#fdd5b1";
  const hairColor = isFemale ? "#2c1810" : "#1a1a2e";
  const bodyColor = isFemale ? "#ff69b4" : "#4a90d9";
  const shoeColor = isFemale ? "#ff1493" : "#333";

  return (
    <group>
      {/* === LEGS === */}
      <group position={[-0.06, 0.15, 0]} rotation={[Math.sin(walkPhase) * 0.5, 0, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.04, 0.16, 4, 8]} />
          <meshStandardMaterial color={isFemale ? skinColor : "#2c3e50"} />
        </mesh>
        <mesh position={[0, -0.2, 0.02]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={shoeColor} />
        </mesh>
      </group>
      <group position={[0.06, 0.15, 0]} rotation={[Math.sin(walkPhase + Math.PI) * 0.5, 0, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <capsuleGeometry args={[0.04, 0.16, 4, 8]} />
          <meshStandardMaterial color={isFemale ? skinColor : "#2c3e50"} />
        </mesh>
        <mesh position={[0, -0.2, 0.02]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={shoeColor} />
        </mesh>
      </group>

      {/* === BODY === */}
      {isFemale ? (
        <group position={[0, 0.35, 0]}>
          <mesh><cylinderGeometry args={[0.1, 0.18, 0.3, 8]} /><meshStandardMaterial color={bodyColor} /></mesh>
          <mesh position={[0, 0.05, 0]}><torusGeometry args={[0.11, 0.015, 4, 16]} /><meshStandardMaterial color="#ff1493" /></mesh>
          <mesh position={[0, 0.05, 0.11]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#fff" /></mesh>
        </group>
      ) : (
        <group position={[0, 0.35, 0]}>
          <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.22, 0.2, 0.15]} /><meshStandardMaterial color={bodyColor} /></mesh>
          <mesh position={[0, 0.13, 0.05]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.08, 0.04, 0.04]} /><meshStandardMaterial color="#fff" /></mesh>
          <mesh position={[0, -0.08, 0]}><boxGeometry args={[0.22, 0.12, 0.15]} /><meshStandardMaterial color="#2c3e50" /></mesh>
        </group>
      )}

      {/* === ARMS === */}
      <group position={[isFemale ? 0.14 : -0.14, 0.4, 0]} rotation={[Math.sin(walkPhase) * 0.3, 0, isFemale ? 0.2 : -0.2]}>
        <mesh position={[0, -0.1, 0]}><capsuleGeometry args={[0.03, 0.15, 4, 8]} /><meshStandardMaterial color={skinColor} /></mesh>
      </group>
      <group position={[isFemale ? -0.13 : 0.13, 0.38, 0]} rotation={[0.15, isFemale ? -0.4 : 0.4, isFemale ? -0.5 : 0.5]}>
        <mesh position={[0, -0.09, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshStandardMaterial color={skinColor} /></mesh>
      </group>

      {/* === HEAD === */}
      <group position={[0, 0.6, 0]}>
        <mesh><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color={skinColor} /></mesh>
        {/* Blush */}
        <mesh position={[-0.1, -0.02, 0.12]}><circleGeometry args={[0.04, 12]} /><meshStandardMaterial color="#ff69b4" transparent opacity={0.4} /></mesh>
        <mesh position={[0.1, -0.02, 0.12]}><circleGeometry args={[0.04, 12]} /><meshStandardMaterial color="#ff69b4" transparent opacity={0.4} /></mesh>
        {/* Eyes */}
        <mesh position={[-0.055, 0.02, 0.14]}><torusGeometry args={[0.025, 0.008, 4, 12, Math.PI]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0.055, 0.02, 0.14]}><torusGeometry args={[0.025, 0.008, 4, 12, Math.PI]} /><meshStandardMaterial color="#333" /></mesh>
        {/* Mouth */}
        <mesh position={[0, -0.04, 0.145]}><torusGeometry args={[0.03, 0.006, 4, 12, Math.PI]} /><meshStandardMaterial color="#e74c3c" /></mesh>
        {/* Hair */}
        {isFemale ? (
          <>
            <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshStandardMaterial color={hairColor} /></mesh>
            <mesh position={[-0.14, -0.05, 0]}><capsuleGeometry args={[0.06, 0.25, 4, 8]} /><meshStandardMaterial color={hairColor} /></mesh>
            <mesh position={[0.14, -0.05, 0]}><capsuleGeometry args={[0.06, 0.25, 4, 8]} /><meshStandardMaterial color={hairColor} /></mesh>
            <mesh position={[-0.12, 0.14, 0.05]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.3} /></mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><meshStandardMaterial color={hairColor} /></mesh>
            {[-0.08, -0.03, 0.03, 0.08].map((xOff, i) => (
              <mesh key={i} position={[xOff, 0.18, 0.08]} rotation={[0.5, 0, (i - 1.5) * 0.15]}>
                <coneGeometry args={[0.03, 0.08, 4]} /><meshStandardMaterial color={hairColor} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
}

// ==================== COUPLE WITH MOVEMENT ====================
export default function ChibiCouple({
  keysRef,
  boundary = 12,
  playerPosRef,
}: {
  keysRef: React.RefObject<KeyState>;
  boundary?: number;
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const rotRef = useRef(0);
  const walkRef = useRef(0);
  const isMoving = useRef(false);
  const velRef = useRef(new THREE.Vector3());
  const { camera } = useThree();

  // Heart above couple
  const heartRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !keysRef.current) return;
    const keys = keysRef.current;
    const speed = 3;
    const rotSpeed = 3;

    // Calculate movement direction
    const moveDir = new THREE.Vector3();
    if (keys.forward) moveDir.z -= 1;
    if (keys.backward) moveDir.z += 1;
    if (keys.left) moveDir.x -= 1;
    if (keys.right) moveDir.x += 1;

    isMoving.current = moveDir.length() > 0;

    if (isMoving.current) {
      moveDir.normalize();

      // Get camera-relative directions
      const camForward = new THREE.Vector3();
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();
      const camRight = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), camForward).normalize();

      // Transform movement to camera space
      const worldDir = new THREE.Vector3()
        .addScaledVector(camRight, -moveDir.x)
        .addScaledVector(camForward, -moveDir.z)
        .normalize();

      // Smooth rotation to face movement direction
      const targetRot = Math.atan2(worldDir.x, worldDir.z);
      let diff = targetRot - rotRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      rotRef.current += diff * rotSpeed * delta;

      // Move
      velRef.current.lerp(worldDir.multiplyScalar(speed), 0.1);
      posRef.current.add(velRef.current.clone().multiplyScalar(delta));

      // Boundary clamp
      posRef.current.x = Math.max(-boundary, Math.min(boundary, posRef.current.x));
      posRef.current.z = Math.max(-boundary, Math.min(boundary, posRef.current.z));

      // Walk animation
      walkRef.current += delta * 8;
    } else {
      velRef.current.lerp(new THREE.Vector3(), 0.15);
      posRef.current.add(velRef.current.clone().multiplyScalar(delta));
    }

    // Bob when walking
    const bobY = isMoving.current ? Math.sin(walkRef.current * 2) * 0.03 : 0;

    groupRef.current.position.set(posRef.current.x, bobY, posRef.current.z);
    groupRef.current.rotation.y = rotRef.current;

    // Sync external ref
    if (playerPosRef) playerPosRef.current.copy(posRef.current);

    // Camera follow
    const camOffset = new THREE.Vector3(0, 3, 5);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotRef.current * 0.3);
    const targetCamPos = new THREE.Vector3(
      posRef.current.x + camOffset.x,
      camOffset.y,
      posRef.current.z + camOffset.z
    );
    camera.position.lerp(targetCamPos, 0.03);
    const lookTarget = new THREE.Vector3(posRef.current.x, 1, posRef.current.z);
    camera.lookAt(lookTarget);

    // Heart animation
    if (heartRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      heartRef.current.scale.setScalar(s);
      heartRef.current.position.y = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const walkPhase = walkRef.current;

  return (
    <group ref={groupRef}>
      <ChibiBody isFemale={false} walkPhase={isMoving.current ? walkPhase : 0} />
      <group position={[0.5, 0, 0]}>
        <ChibiBody isFemale={true} walkPhase={isMoving.current ? walkPhase + Math.PI : 0} />
      </group>
      {/* Heart */}
      <mesh ref={heartRef} position={[0.25, 1.0, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.8} />
      </mesh>
      {/* Small floating hearts trail */}
      <HeartTrail isMoving={isMoving} />
    </group>
  );
}

// Emit hearts when walking
function HeartTrail({ isMoving }: { isMoving: React.RefObject<boolean> }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particles = useRef<{ pos: THREE.Vector3; vel: THREE.Vector3; life: number; }[]>(
    Array.from({ length: 8 }, () => ({ pos: new THREE.Vector3(0, -10, 0), vel: new THREE.Vector3(), life: 0 }))
  );
  const spawnIdx = useRef(0);
  const spawnTimer = useRef(0);

  useFrame((_, delta) => {
    spawnTimer.current += delta;
    if (isMoving.current && spawnTimer.current > 0.3) {
      spawnTimer.current = 0;
      const idx = spawnIdx.current % particles.current.length;
      particles.current[idx] = {
        pos: new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.3, (Math.random() - 0.5) * 0.3),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.8 + Math.random() * 0.5, (Math.random() - 0.5) * 0.3),
        life: 1,
      };
      spawnIdx.current++;
    }

    particles.current.forEach((p, i) => {
      if (p.life <= 0) return;
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.life -= delta * 0.5;
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.pos);
        mesh.scale.setScalar(0.03 * Math.max(0, p.life));
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, p.life);
      }
    });
  });

  return (
    <group>
      {particles.current.map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={0.5} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}
