"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage, useViewMode } from "@/components/soulsmoke/soulsmoke-providers";

// The SoulSmoke app's always-on extras, ported from client/src/components/SmokeCursor.tsx,
// AmbientSound.tsx and ContentProtection.tsx, mounted once by the /soul-smoke layout (App.tsx's
// AppContent did the same). Smoke cursor and fire sound only show in SoulSmoke mode, as before.
// The fire sound is the app's fire-crackling.mp3, rescued into Sanity (2026-11-10).

const FIRE_SOUND_URL = "https://cdn.sanity.io/files/a3q1cyqs/production/b6cfacd812452a26e1393e48c4ee521073af9d23.mp3";

type SmokeParticle = { id: number; x: number; y: number; opacity: number; scale: number; rotation: number };

function SmokeCursor() {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const particleIdRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;
      throttleRef.current = true;
      setTimeout(() => {
        throttleRef.current = false;
      }, 50);
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) return;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const particle: SmokeParticle = {
        id: particleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        opacity: 0.4,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      };
      setParticles((prev) => [...prev.slice(-15), particle]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.05, scale: p.scale + 0.02, y: p.y - 1 }))
          .filter((p) => p.opacity > 0),
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div aria-hidden="true" className="smoke-cursor-container pointer-events-none fixed inset-0 z-9999">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute size-8 transition-opacity duration-100 ease-out"
          // Runtime-computed position, fade and spin per particle (the one allowed style use).
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 100 100" className="size-full blur-[4px]">
            <defs>
              <radialGradient id={`smokeGradient-${particle.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(163, 230, 53, 0.3)" />
                <stop offset="50%" stopColor="rgba(200, 200, 200, 0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill={`url(#smokeGradient-${particle.id})`} />
          </svg>
        </div>
      ))}
    </div>
  );
}

function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const audio = new Audio(FIRE_SOUND_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const label = isPlaying
    ? language === "es"
      ? "Fuego encendido"
      : "Fire on"
    : language === "es"
      ? "Encender fuego"
      : "Light fire";

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isPlaying}
      aria-label={language === "es" ? "Sonido ambiente" : "Ambient sound"}
      title={language === "es" ? "Sonido ambiente" : "Ambient sound"}
      className="ambient-sound-toggle group fixed right-6 bottom-6 z-50 flex min-h-11 items-center gap-2 rounded-full border border-lime-500/30 bg-stone-900/90 px-4 py-2 text-stone-200 backdrop-blur-sm transition-all duration-300 hover:border-lime-500/60 hover:text-lime-400"
    >
      {isPlaying ? (
        <Volume2 aria-hidden="true" className="size-5 animate-pulse text-lime-400" />
      ) : (
        <VolumeX aria-hidden="true" className="size-5 group-hover:text-lime-400" />
      )}
      <span className="hidden font-mono text-sm sm:inline">{label}</span>
      {isPlaying && <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-lime-500/20" />}
    </button>
  );
}

// The app's copy deterrent: blocks the right-click menu, save/view-source/devtools shortcuts and
// dragging images, only while a SoulSmoke page is open (it unmounts with the layout).
function ContentProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey;
      const meta = e.metaKey;
      if (
        (ctrl && (e.key === "s" || e.key === "u")) ||
        (ctrl && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        e.key === "F12" ||
        (meta && e.altKey && e.key === "i") ||
        (meta && (e.key === "s" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);
  return null;
}

export function SoulsmokeEffects() {
  const { isSoulSmoke } = useViewMode();
  return (
    <>
      <ContentProtection />
      {isSoulSmoke && <SmokeCursor />}
      {isSoulSmoke && <AmbientSound />}
    </>
  );
}
