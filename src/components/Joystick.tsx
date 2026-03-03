"use client";

import { useRef, useCallback } from "react";
import type { KeyState } from "./useKeyboard";

export default function Joystick({ keysRef }: { keysRef: React.RefObject<KeyState> }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const baseRect = useRef<DOMRect | null>(null);

  const handleMove = useCallback((cx: number, cy: number) => {
    if (!baseRect.current || !knobRef.current || !keysRef.current) return;
    const rect = baseRect.current;
    const dx = cx - (rect.left + rect.width / 2);
    const dy = cy - (rect.top + rect.height / 2);
    const maxR = rect.width / 2 - 15;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;
    knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;

    const threshold = maxR * 0.3;
    keysRef.current.forward = ny < -threshold;
    keysRef.current.backward = ny > threshold;
    keysRef.current.left = nx < -threshold;
    keysRef.current.right = nx > threshold;
  }, [keysRef]);

  const handleEnd = useCallback(() => {
    if (!knobRef.current || !keysRef.current) return;
    knobRef.current.style.transform = "translate(0px, 0px)";
    keysRef.current.forward = false;
    keysRef.current.backward = false;
    keysRef.current.left = false;
    keysRef.current.right = false;
    activeTouch.current = null;
  }, [keysRef]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!baseRef.current) return;
    activeTouch.current = e.touches[0].identifier;
    baseRect.current = baseRef.current.getBoundingClientRect();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === activeTouch.current) {
        handleMove(e.touches[i].clientX, e.touches[i].clientY);
        break;
      }
    }
  }, [handleMove]);

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "2px solid rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        touchAction: "none",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          background: "rgba(255,105,180,0.5)",
          border: "2px solid rgba(255,255,255,0.3)",
          transition: "none",
          boxShadow: "0 0 15px rgba(255,105,180,0.3)",
        }}
      />
    </div>
  );
}
