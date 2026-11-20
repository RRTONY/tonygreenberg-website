"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { LIQUIDSUN_AUDIO } from "@/lib/content/liquidsun/images";
import { usePresenceSwap } from "@/components/liquidsun/motion";

// LiquidSun's "Digital Fortress" (App.tsx) and its soundscape (components/AudioController.tsx),
// ported 2026-11-21.
//
// ContentProtection: as SoulSmoke's port does (soulsmoke-effects.tsx), it blocks the right-click
// menu, the save / view-source / print / devtools shortcuts and dragging images, only while a
// LiquidSun page is open. SoulSmoke's port dropped its app's page-wide text-selection lock and
// console banner, so this one does too (they also stop visitors copying a quote or an address).
//
// AudioController: the wind and tahona-grind loops (rescued to Sanity), muted until the visitor
// presses the button (browsers block autoplay anyway). Scrolling crossfades them like the app:
// top 30% of the page wind only, 30-70% a crossfade, below 70% grind only. The framer-motion hover
// and tap scale became CSS (hover:scale-110 active:scale-90), the "Now Playing" label's
// slide-in became tw-animate (fade-in slide-in-from-right-5).

export function ContentProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        ((e.ctrlKey || e.metaKey) && (key === "s" || key === "u" || key === "p")) ||
        (e.ctrlKey && e.shiftKey && (key === "i" || key === "c" || key === "j")) ||
        (e.metaKey && e.altKey && (key === "i" || key === "j" || key === "c")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
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

/** Volumes for a scroll position (0 = top, 1 = bottom), the app's crossfade. */
export function crossfade(scrollPercent: number) {
  if (!(scrollPercent >= 0.3)) return { wind: 0.3, grind: 0, track: "wind" as const };
  if (scrollPercent < 0.7) {
    const p = (scrollPercent - 0.3) / 0.4;
    return { wind: 0.3 * (1 - p), grind: 0.4 * p, track: null };
  }
  return { wind: 0, grind: 0.4, track: "grind" as const };
}

export function AudioController() {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<"wind" | "grind">("wind");
  const windRef = useRef<HTMLAudioElement>(null);
  const grindRef = useRef<HTMLAudioElement>(null);
  // AnimatePresence: the label slides out (200ms) after muting before it disappears.
  const label = usePresenceSwap(!isMuted, 200);
  const showLabel = !isMuted || label.shown;

  useEffect(() => {
    if (windRef.current) {
      windRef.current.volume = 0.3;
      windRef.current.loop = true;
    }
    if (grindRef.current) {
      grindRef.current.volume = 0;
      grindRef.current.loop = true;
    }
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const mix = crossfade(docHeight > 0 ? window.scrollY / docHeight : 0);
      if (windRef.current && grindRef.current) {
        windRef.current.volume = mix.wind;
        grindRef.current.volume = mix.grind;
        if (mix.track) setCurrentTrack(mix.track);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMute = () => {
    if (isMuted) {
      windRef.current?.play().catch(() => {});
      grindRef.current?.play().catch(() => {});
      setIsMuted(false);
    } else {
      windRef.current?.pause();
      grindRef.current?.pause();
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed right-8 bottom-8 z-50">
      <audio ref={windRef} src={LIQUIDSUN_AUDIO.wind} preload="none" />
      <audio ref={grindRef} src={LIQUIDSUN_AUDIO.grind} preload="none" />

      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={!isMuted}
        aria-label={isMuted ? "Play ambient sound" : "Mute ambient sound"}
        className="group rounded-full border border-amber-500/30 bg-black/40 p-4 text-amber-500 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-amber-500 hover:bg-amber-950/50 active:scale-90"
      >
        {isMuted ? (
          <VolumeX aria-hidden="true" className="size-6" />
        ) : (
          <span className="relative block">
            <Volume2 aria-hidden="true" className="size-6" />
            <span className="absolute -top-1 -right-1 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
            </span>
          </span>
        )}
      </button>

      {showLabel && (
        <div
          aria-live="polite"
          className={
            isMuted
              ? "pointer-events-none absolute right-0 bottom-full mb-4 animate-out rounded-lg border border-white/10 bg-black/60 px-4 py-2 font-mono text-xs whitespace-nowrap text-amber-100 backdrop-blur-md duration-200 fade-out fill-mode-forwards slide-out-to-right-5"
              : "pointer-events-none absolute right-0 bottom-full mb-4 animate-in rounded-lg border border-white/10 bg-black/60 px-4 py-2 font-mono text-xs whitespace-nowrap text-amber-100 backdrop-blur-md fade-in slide-in-from-right-5"
          }
        >
          Now Playing: {currentTrack === "wind" ? "Agave Fields (Night)" : "Volcanic Tahona (Grind)"}
        </div>
      )}
    </div>
  );
}
