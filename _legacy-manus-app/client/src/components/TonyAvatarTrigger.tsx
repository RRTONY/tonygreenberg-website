/**
 * TonyAvatarTrigger — Trigger for TonyDiscovery (Search + FauxTony chat).
 * Desktop: full "Ask Tony ⌘K" pill button.
 * Mobile: compact search icon button (magnifying glass).
 *
 * First-visit: a dry-wit tooltip appears once, fades after 5s, never returns.
 *
 * The DiscoveryPanel is rendered via createPortal at document.body level
 * so it is never trapped inside the nav stacking context.
 */
import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

const DiscoveryPanel = lazy(() => import("./TonyDiscovery"));

// Rotate through a few dry-wit lines — one per visitor, randomly picked on first visit
const TOOLTIP_LINES = [
  "There's more here than the nav suggests.",
  "118 essays. You've seen maybe two.",
  "Most people miss the good stuff. ⌘K fixes that.",
  "The rabbit hole has a search bar.",
  "Somewhere in here is exactly what you needed.",
];

export function TonyAvatarTrigger({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipLine, setTooltipLine] = useState("");
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // First-visit tooltip: show once, 3s delay, auto-dismiss after 5s
  useEffect(() => {
    try {
      const seen = localStorage.getItem("tg_cmdK_tooltip_seen");
      if (!seen) {
        const line = TOOLTIP_LINES[Math.floor(Math.random() * TOOLTIP_LINES.length)];
        setTooltipLine(line);
        tooltipTimer.current = setTimeout(() => {
          setShowTooltip(true);
          tooltipTimer.current = setTimeout(() => {
            setShowTooltip(false);
            localStorage.setItem("tg_cmdK_tooltip_seen", "1");
          }, 5000);
        }, 3000);
      }
    } catch {}
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    try { localStorage.setItem("tg_cmdK_tooltip_seen", "1"); } catch {}
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setInitialQuestion(undefined);
        setOpen(true);
        dismissTooltip();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    const handleExitIntent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.question) {
        setInitialQuestion(detail.question);
      }
      setOpen(true);
    };
    window.addEventListener("open-fauxtony", handleExitIntent);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-fauxtony", handleExitIntent);
    };
  }, []);

  const modal = (
    <AnimatePresence>
      {open && (
        <Suspense fallback={null}>
          <DiscoveryPanel
            onClose={() => { setOpen(false); setInitialQuestion(undefined); }}
            initialQuestion={initialQuestion}
          />
        </Suspense>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* ── Desktop: full pill button with first-visit tooltip ── */}
      <div className="hidden xl:block relative">
        <button
          onClick={() => { setOpen(true); dismissTooltip(); }}
          aria-label="Search & Ask Tony"
          className="flex items-center"
          style={{
            background: isDark ? "rgba(212,185,106,0.12)" : "rgba(139,105,20,0.06)",
            border: `1.5px solid ${isDark ? "rgba(212,185,106,0.25)" : "rgba(139,105,20,0.15)"}`,
            cursor: "pointer",
            color: isDark ? "#D4B96A" : "#8B6914",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 12,
            transition: "all 0.25s ease",
            minWidth: 170,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? "rgba(212,185,106,0.18)" : "rgba(139,105,20,0.1)";
            e.currentTarget.style.borderColor = isDark ? "rgba(212,185,106,0.4)" : "rgba(139,105,20,0.25)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? "rgba(212,185,106,0.12)" : "rgba(139,105,20,0.06)";
            e.currentTarget.style.borderColor = isDark ? "rgba(212,185,106,0.25)" : "rgba(139,105,20,0.15)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B6914, #D4B96A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#0A0A10",
              flexShrink: 0,
            }}
          >
            T
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
            }}
          >
            Ask Tony
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: isDark ? "#666" : "#aaa",
              border: `1px solid ${isDark ? "#444" : "#ccc"}`,
              borderRadius: 5,
              padding: "1px 6px",
              marginLeft: 2,
            }}
          >
            ⌘K
          </span>
        </button>

        {/* First-visit tooltip — dry wit, appears once, fades out */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={dismissTooltip}
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                background: isDark ? "rgba(10,10,16,0.96)" : "rgba(250,250,247,0.97)",
                border: `1px solid ${isDark ? "rgba(212,185,106,0.22)" : "rgba(139,105,20,0.18)"}`,
                borderRadius: 8,
                padding: "8px 14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                cursor: "pointer",
                zIndex: 200,
              }}
            >
              {/* Caret */}
              <div style={{
                position: "absolute",
                top: -5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                background: isDark ? "rgba(10,10,16,0.96)" : "rgba(250,250,247,0.97)",
                border: `1px solid ${isDark ? "rgba(212,185,106,0.22)" : "rgba(139,105,20,0.18)"}`,
                borderBottom: "none",
                borderRight: "none",
                rotate: "45deg",
              }} />
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.8rem",
                color: isDark ? "rgba(245,240,224,0.75)" : "rgba(26,23,16,0.65)",
                fontStyle: "italic",
              }}>
                {tooltipLine}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile: search icon button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="xl:hidden flex items-center justify-center flex-shrink-0"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: isDark ? "#D4B96A" : "#8B6914",
          width: 40,
          height: 40,
          padding: 0,
          borderRadius: 8,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        <Search size={22} strokeWidth={2} />
      </button>

      {/* ── Portal: renders at document.body, outside nav stacking context ── */}
      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}
