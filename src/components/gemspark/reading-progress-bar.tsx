"use client";

import { useEffect, useState } from "react";

// Ported from the GemSpark app's components/ReadingProgressBar.tsx. Same bar, hidden until the
// reader starts scrolling. The width is the one runtime style (a scroll percentage).
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation (e.g. a reload that restores the scroll position), after paint.
    const frame = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Don't show until user starts scrolling
  if (progress < 1) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-[3px]">
      <div
        className="h-full bg-linear-to-r from-[#2C3E50] via-[#5D6D7E] to-[#D4E6F1] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
