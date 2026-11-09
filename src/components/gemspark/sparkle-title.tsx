"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

// Ported from the GemSpark app's components/SparkleTitle.tsx: while the pointer is over the title,
// small four-pointed stars burst around it every 50ms. The app animated each star with
// framer-motion; here a CSS keyframe in gemspark.css does the same fade, grow, half-turn and
// drift. Each star's position, size, color, rotation and duration are random per particle, so
// they're the runtime values in its style.

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
}

const COLORS = [
  "rgba(200, 180, 255, 0.9)",
  "rgba(150, 230, 220, 0.85)",
  "rgba(255, 255, 255, 0.95)",
  "rgba(244, 180, 255, 0.8)",
  "rgba(180, 220, 255, 0.85)",
  "rgba(255, 220, 180, 0.7)",
];

let sparkleCounter = 0;

function generateSparkle(containerRect: DOMRect, mouseX: number, mouseY: number): Sparkle {
  const relX = mouseX - containerRect.left;
  const relY = mouseY - containerRect.top;
  // Scatter around the cursor position
  const offsetX = (Math.random() - 0.5) * 80;
  const offsetY = (Math.random() - 0.5) * 60;

  return {
    id: sparkleCounter++,
    x: relX + offsetX,
    y: relY + offsetY,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    duration: Math.random() * 600 + 400,
  };
}

export function SparkleTitle({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const mouseRef = useRef({ x: 0, y: 0 });

  const addSparkle = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sparkle = generateSparkle(rect, mouseRef.current.x, mouseRef.current.y);
    setSparkles((prev) => [...prev, sparkle]);
    // Remove after animation completes
    const timeout = setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
    }, sparkle.duration);
    timeoutsRef.current.add(timeout);
  }, []);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Stop emitting and drop pending removals when the title unmounts.
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleMouseEnter = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    // Emit sparkles at intervals while hovering
    addSparkle();
    stop();
    intervalRef.current = setInterval(addSparkle, 50);
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={stop}
      onMouseMove={handleMouseMove}
    >
      {children}
      {/* Sparkle particles */}
      <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <svg
            key={sparkle.id}
            data-testid="gemspark-sparkle"
            className="gemspark-sparkle absolute"
            style={
              {
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
                animationDuration: `${sparkle.duration}ms`,
                "--gemspark-rotation": `${sparkle.rotation}deg`,
              } as CSSProperties
            }
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Four-pointed star / gem facet shape */}
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={sparkle.color} />
          </svg>
        ))}
      </div>
    </div>
  );
}
