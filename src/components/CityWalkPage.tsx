"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useKeyboard } from "./useKeyboard";
import { wishes, getRandomWish } from "@/data/wishes";
import gsap from "gsap";
import type { MapType } from "./CityWalkScene";

const CityWalkScene = dynamic(() => import("./CityWalkScene"), { ssr: false });
const Joystick = dynamic(() => import("./Joystick"), { ssr: false });

const MAPS: { id: MapType; name: string; icon: string; desc: string; color: string }[] = [
  { id: "city", name: "Phố Đêm", icon: "🌃", desc: "Dắt tay nhau đi giữa phố đêm lung linh", color: "#4a90d9" },
  { id: "beach", name: "Biển Hoàng Hôn", icon: "🏖️", desc: "Ngắm hoàng hôn bên bãi biển lãng mạn", color: "#ff6b35" },
  { id: "sakura", name: "Vườn Hoa Anh Đào", icon: "🌸", desc: "Dạo dưới những cánh hoa anh đào rơi", color: "#ff69b4" },
  { id: "garden", name: "Khu Vườn Thần Tiên", icon: "🧚", desc: "Lạc vào khu vườn đom đóm huyền ảo", color: "#c084fc" },
  { id: "ocean", name: "Đáy Đại Dương", icon: "🐠", desc: "Khám phá thế giới dưới đại dương", color: "#06b6d4" },
];

export default function CityWalkPage() {
  const [selectedMap, setSelectedMap] = useState<MapType | null>(null);
  const [showUI, setShowUI] = useState(true);
  const [wishIdx, setWishIdx] = useState(0);
  const [showWish, setShowWish] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationWish, setCelebrationWish] = useState("");
  const [mapKey, setMapKey] = useState(0); // key to force remount = new random target
  const keysRef = useKeyboard();

  const titleRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);
  const celebRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Enter game
  useEffect(() => {
    if (!selectedMap) return;
    setCelebrating(false);
    setShowWish(false);
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.3 });
    }
    const timer = setTimeout(() => setShowWish(true), 2000);
    return () => clearTimeout(timer);
  }, [selectedMap, mapKey]);

  // Wish animation
  useEffect(() => {
    if (!showWish || !wishRef.current) return;
    gsap.fromTo(wishRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
  }, [showWish, wishIdx]);

  // Auto cycle wishes
  useEffect(() => {
    if (!showWish || celebrating) return;
    const interval = setInterval(() => {
      if (wishRef.current) {
        gsap.to(wishRef.current, {
          opacity: 0, y: -10, duration: 0.4,
          onComplete: () => {
            setWishIdx((p) => (p + 1) % wishes.length);
            if (wishRef.current) gsap.fromTo(wishRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
          },
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [showWish, celebrating]);

  const nextWish = useCallback(() => {
    if (!wishRef.current) return;
    gsap.to(wishRef.current, {
      opacity: 0, x: -20, duration: 0.25,
      onComplete: () => {
        setWishIdx((p) => (p + 1) % wishes.length);
        if (wishRef.current) gsap.fromTo(wishRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
      },
    });
  }, []);

  // Celebration callback
  const handleCelebration = useCallback(() => {
    setCelebrating(true);
    setCelebrationWish(getRandomWish());
  }, []);

  // Celebration animation
  useEffect(() => {
    if (!celebrating || !celebRef.current) return;
    gsap.fromTo(celebRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.4)" });
  }, [celebrating]);

  const handlePlayAgain = useCallback(() => {
    setCelebrating(false);
    setMapKey((k) => k + 1); // remount scene = new random target
  }, []);

  const handleChangeMap = useCallback(() => {
    setSelectedMap(null);
    setCelebrating(false);
    setShowWish(false);
  }, []);

  // ===== MAP SELECTION =====
  if (!selectedMap) {
    return (
      <div className="map-select-screen">
        <div className="map-select-bg" />
        <div className="map-select-sparkles">
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} className="map-select-star" style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`, fontSize: `${8 + Math.random() * 14}px`,
            }}>✨</span>
          ))}
        </div>
        <div className="map-select-content">
          <h1 className="map-select-title">Mình đi đâu nhỉ? 💕</h1>
          <p className="map-select-sub">Chọn nơi để cùng anh dạo chơi — tìm chữ 8/3 để tung hoa nha!</p>
          <div className="map-grid">
            {MAPS.map((m) => (
              <button key={m.id} className="map-card" onClick={() => { setSelectedMap(m.id); setMapKey((k) => k + 1); }}
                style={{ "--map-color": m.color } as React.CSSProperties}>
                <span className="map-icon">{m.icon}</span>
                <span className="map-name">{m.name}</span>
                <span className="map-desc">{m.desc}</span>
              </button>
            ))}
          </div>
          <a href="/" className="map-back-link">← Quay lại trang chính</a>
        </div>
      </div>
    );
  }

  // ===== GAME SCREEN =====
  return (
    <div className="walk-page">
      <CityWalkScene key={mapKey} map={selectedMap} keysRef={keysRef} onCelebration={handleCelebration} />

      {/* Mobile joystick */}
      {isMobile && !celebrating && <Joystick keysRef={keysRef} />}

      {/* Celebration overlay */}
      {celebrating && (
        <div className="celebration-overlay">
          <div ref={celebRef} className="celebration-card">
            <div className="celebration-emoji">🎉🌸💕🎊</div>
            <h2 className="celebration-title">Happy Women&apos;s Day!</h2>
            <p className="celebration-wish">{celebrationWish}</p>
            <div className="celebration-buttons">
              <button className="celebration-btn celebration-btn-primary" onClick={handlePlayAgain}>
                🔄 Chơi lại (vị trí mới)
              </button>
              <button className="celebration-btn" onClick={handleChangeMap}>
                🗺️ Đổi map
              </button>
              <a href="/" className="celebration-btn" style={{ textDecoration: "none" }}>
                🌹 Trang chính
              </a>
            </div>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      {showUI && !celebrating && (
        <div className="walk-overlay">
          <div ref={titleRef} className="walk-title-section" style={{ opacity: 0 }}>
            <h1 className="walk-main-title">
              <span className="walk-title-small">
                {MAPS.find((m) => m.id === selectedMap)?.icon} {MAPS.find((m) => m.id === selectedMap)?.name}
              </span>
              <span className="walk-title-big">Tìm chữ 8/3 💕</span>
            </h1>
          </div>

          {showWish && (
            <div ref={wishRef} className="walk-wish-section" onClick={nextWish}>
              <div className="walk-wish-card">
                <div className="walk-wish-quote">&ldquo;</div>
                <p className="walk-wish-text">{wishes[wishIdx]}</p>
                <div className="walk-wish-quote walk-wish-quote-end">&rdquo;</div>
                <div className="walk-wish-footer">
                  <span className="walk-wish-tap">Nhấn để xem câu chúc khác</span>
                  <span className="walk-wish-count">{wishIdx + 1}/{wishes.length}</span>
                </div>
              </div>
            </div>
          )}

          <div className="walk-bottom-bar">
            <div className="walk-controls-hint">
              {isMobile ? "Dùng joystick để di chuyển → Tìm chữ 8/3" : "WASD di chuyển → Tìm chữ 8/3 để tung hoa!"}
            </div>
            <div className="walk-bottom-buttons">
              <button className="walk-btn" onClick={() => setShowUI(false)}>
                👁️ Ẩn UI
              </button>
              <button className="walk-btn" onClick={handleChangeMap}>
                🗺️ Đổi map
              </button>
              <a href="/" className="walk-btn" style={{ textDecoration: "none" }}>
                🌹 Trang chính
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Show UI button when hidden */}
      {!showUI && !celebrating && (
        <button className="walk-show-ui-btn" onClick={() => setShowUI(true)}>
          👁️
        </button>
      )}
    </div>
  );
}
