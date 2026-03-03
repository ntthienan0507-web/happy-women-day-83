"use client";

import { useEffect, useRef } from "react";

export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyState>({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": keys.current.forward = true; break;
        case "KeyS": case "ArrowDown": keys.current.backward = true; break;
        case "KeyA": case "ArrowLeft": keys.current.left = true; break;
        case "KeyD": case "ArrowRight": keys.current.right = true; break;
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": keys.current.forward = false; break;
        case "KeyS": case "ArrowDown": keys.current.backward = false; break;
        case "KeyA": case "ArrowLeft": keys.current.left = false; break;
        case "KeyD": case "ArrowRight": keys.current.right = false; break;
      }
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return keys;
}
