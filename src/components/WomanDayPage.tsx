"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { wishes, getWishByHour } from "@/data/wishes";
import { getImageByHour } from "@/data/images";
import gsap from "gsap";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function WomanDayPage() {
  const [bloomProgress, setBloomProgress] = useState(0);
  const [currentWish, setCurrentWish] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [wishIndex, setWishIndex] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; size: number; delay: number }[]
  >([]);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const wishRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    setCurrentWish(getWishByHour());
    setCurrentImage(getImageByHour());
    setWishIndex(new Date().getHours() % wishes.length);

    // Generate sparkles
    const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setSparkles(newSparkles);
  }, []);

  // Bloom animation
  useEffect(() => {
    if (!isOpened) return;
    const anim = { progress: 0 };
    gsap.to(anim, {
      progress: 1,
      duration: 4,
      ease: "power2.inOut",
      onUpdate: () => setBloomProgress(anim.progress),
    });
  }, [isOpened]);

  // Animate title and wish on open
  useEffect(() => {
    if (!isOpened) return;
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -40, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.5 }
      );
    }
    if (wishRef.current) {
      gsap.fromTo(
        wishRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 1.2 }
      );
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", delay: 1.8 }
      );
    }
  }, [isOpened]);

  // Auto-change wish every 10 seconds
  useEffect(() => {
    if (!isOpened) return;
    const interval = setInterval(() => {
      setWishIndex((prev) => {
        const next = (prev + 1) % wishes.length;
        if (wishRef.current) {
          gsap.to(wishRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
              setCurrentWish(wishes[next]);
              gsap.to(wishRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
              });
            },
          });
        } else {
          setCurrentWish(wishes[next]);
        }
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpened]);

  // Update image every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(getImageByHour());
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = useCallback(() => {
    setShowEnvelope(false);
    setTimeout(() => setIsOpened(true), 600);
  }, []);

  const nextWish = useCallback(() => {
    setWishIndex((prev) => {
      const next = (prev + 1) % wishes.length;
      if (wishRef.current) {
        gsap.to(wishRef.current, {
          opacity: 0,
          x: -30,
          duration: 0.3,
          onComplete: () => {
            setCurrentWish(wishes[next]);
            gsap.fromTo(
              wishRef.current,
              { opacity: 0, x: 30 },
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            );
          },
        });
      } else {
        setCurrentWish(wishes[next]);
      }
      return next;
    });
  }, []);

  // Envelope / Landing screen
  if (showEnvelope) {
    return (
      <div className="envelope-screen" onClick={handleOpen}>
        <div className="envelope-sparkles">
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="sparkle"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
        <div className="envelope-container">
          <div className="envelope">
            <div className="envelope-flap" />
            <div className="envelope-body">
              <div className="envelope-heart">💌</div>
            </div>
          </div>
          <p className="envelope-text">Nhấn để mở thư tình 💕</p>
          <p className="envelope-subtext">Dành tặng vợ yêu nhân ngày 8/3</p>
        </div>
      </div>
    );
  }

  if (!isOpened) {
    return (
      <div className="loading-screen">
        <div className="loading-heart">💗</div>
        <p>Đang chuẩn bị quà cho em...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="main-container">
      {/* Sparkles background */}
      <div className="sparkles-bg">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3D Scene */}
      <div className="scene-container">
        <Scene3D bloomProgress={bloomProgress} />
      </div>

      {/* Content overlay */}
      <div className="content-overlay">
        <header className="header-section">
          <h1 ref={titleRef} className="main-title">
            <span className="title-line-1">Happy</span>
            <span className="title-line-2">Women&apos;s Day</span>
            <span className="title-date">8/3</span>
          </h1>
          <p className="subtitle">Dành tặng vợ yêu 💕</p>
        </header>

        <div className="middle-section">
          {/* Image card */}
          <div ref={imageRef} className="image-card">
            {currentImage && (
              <img
                src={currentImage}
                alt="Beautiful flowers for you"
                className="hourly-image"
              />
            )}
            <div className="image-overlay">
              <span className="image-hour">
                🕐 {new Date().getHours()}:00 - Ảnh thay đổi mỗi giờ
              </span>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          {/* Wish card */}
          <div className="wish-card" onClick={nextWish}>
            <div className="wish-decoration wish-decoration-left">🌸</div>
            <p ref={wishRef} className="wish-text">
              {currentWish}
            </p>
            <div className="wish-decoration wish-decoration-right">🌸</div>
            <span className="wish-hint">Nhấn để xem câu chúc khác ✨</span>
            <span className="wish-counter">
              {wishIndex + 1} / {wishes.length}
            </span>
          </div>

          {/* Link to city walk page */}
          <a href="/walk" className="scene-toggle-btn" style={{ textDecoration: "none" }}>
            🌃 Cùng anh dạo phố đêm
          </a>
        </div>
      </div>
    </div>
  );
}
