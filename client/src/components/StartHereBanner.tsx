/**
 * StartHereBanner — Top bar for first-time visitors.
 * Shows once, dismissible, links to /walk-through.
 * Auto-hides when user scrolls past the hero (~500px).
 * Compact on mobile — single tight row.
 *
 * Sets a CSS custom property --start-banner-h on <html> so the sticky nav
 * can offset itself (top: var(--start-banner-h, 0px)).
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "tg-start-here-dismissed";
const SCROLL_HIDE_THRESHOLD = 500; // px — roughly past the hero fold

export default function StartHereBanner() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dismissed = useRef(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Sync CSS custom property with banner visibility
  const syncCSSVar = useCallback((show: boolean) => {
    if (show && bannerRef.current) {
      const h = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--start-banner-h", `${h}px`);
    } else {
      document.documentElement.style.setProperty("--start-banner-h", "0px");
    }
  }, []);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (!wasDismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update CSS var when visible changes
  useEffect(() => {
    // Small delay to let the DOM render first
    const raf = requestAnimationFrame(() => syncCSSVar(visible && !hidden));
    return () => cancelAnimationFrame(raf);
  }, [visible, hidden, syncCSSVar]);

  // Auto-hide on scroll past hero
  useEffect(() => {
    if (!visible || dismissed.current) return;

    const onScroll = () => {
      if (window.scrollY > SCROLL_HIDE_THRESHOLD) {
        setHidden(true);
        syncCSSVar(false);
        // Permanently dismiss after auto-hide so it doesn't reappear on scroll-up
        setTimeout(() => {
          setVisible(false);
          localStorage.setItem(STORAGE_KEY, "1");
        }, 400); // wait for slide-up animation
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible, syncCSSVar]);

  const dismiss = () => {
    dismissed.current = true;
    setHidden(true);
    syncCSSVar(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    }, 300);
  };

  // Clean up CSS var on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty("--start-banner-h", "0px");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "linear-gradient(90deg, #0A0A10 0%, #1a1a24 100%)",
        borderBottom: "1px solid rgba(212,185,106,0.25)",
        padding: "0.35rem 0.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        transition: "transform 0.35s ease-in-out, opacity 0.35s ease-in-out",
        animation: hidden ? "none" : "slideDown 0.4s ease-out",
      }}
    >
      <span
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.78rem",
          color: "rgba(245,240,224,0.85)",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        New here?
      </span>
      <Link
        href="/walk-through"
        onClick={dismiss}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "#0A0A10",
          background: "#D4B96A",
          padding: "0.25rem 0.7rem",
          borderRadius: "3px",
          textDecoration: "none",
          fontWeight: 600,
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        90-second tour →
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        style={{
          background: "none",
          border: "none",
          color: "rgba(245,240,224,0.4)",
          fontSize: "0.95rem",
          cursor: "pointer",
          padding: "0 0.2rem",
          lineHeight: 1,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245,240,224,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,240,224,0.4)")}
      >
        ×
      </button>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
