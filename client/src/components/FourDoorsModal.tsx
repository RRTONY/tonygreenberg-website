/**
 * FourDoorsModal
 * Warm parchment editorial overlay that opens when a Four Doors card is tapped.
 * Framer Motion: fade + scale-up backdrop, slide-up panel.
 * Closes on backdrop click, Escape key, or the × button.
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export interface DoorData {
  num: string;
  title: string;
  sub: string;
  href: string;
  img: string;
  /** Expanded modal content */
  headline: string;
  body: string;
  bullets: string[];
  cta: string;
}

interface FourDoorsModalProps {
  door: DoorData | null;
  onClose: () => void;
}

export default function FourDoorsModal({ door, onClose }: FourDoorsModalProps) {
  /* Close on Escape */
  useEffect(() => {
    if (!door) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [door, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    if (door) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [door]);

  return (
    <AnimatePresence>
      {door && (
        /* Backdrop */
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44, 24, 16, 0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 9000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0",
          }}
          className="sm:items-center sm:p-4"
        >
          {/* Panel — stop propagation so clicks inside don't close */}
          <motion.div
            key="panel"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FAFAF7",
              borderRadius: "20px 20px 0 0",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "92dvh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 -8px 60px rgba(44,24,16,0.18), 0 0 0 1px rgba(139,105,20,0.1)",
              colorScheme: "light" as const,
            }}
            className="sm:rounded-[20px]"
          >
            {/* Image header — 200px tall, full-bleed */}
            <div style={{
              position: "relative",
              height: "200px",
              overflow: "hidden",
              borderRadius: "20px 20px 0 0",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${door.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              {/* Bottom fade into parchment */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 30%, #FAFAF7 100%)",
              }} />
              {/* Door number badge */}
              <div style={{
                position: "absolute",
                top: "1rem",
                left: "1.25rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#FAFAF7",
                background: "rgba(44,24,16,0.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: "0.25rem 0.6rem",
                borderRadius: "3px",
              }}>Door {door.num}</div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "0.9rem",
                right: "1rem",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(44,24,16,0.45)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#FAFAF7",
                fontSize: "1rem",
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >×</button>

            {/* Body */}
            <div style={{ padding: "0 1.5rem 2rem" }}>
              {/* Title */}
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 4vw, 2rem)",
                fontWeight: 400,
                color: "#2C1810",
                lineHeight: 1.1,
                marginBottom: "0.4rem",
                marginTop: "0",
              }}>{door.headline}</h2>

              {/* Ochre rule */}
              <div style={{ width: "40px", height: "2px", background: "#8B6914", marginBottom: "1rem" }} />

              {/* Body paragraph */}
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(44,24,16,0.75)",
                lineHeight: 1.7,
                marginBottom: "1.25rem",
              }}>{door.body}</p>

              {/* Bullet list */}
              {door.bullets.length > 0 && (
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}>
                  {door.bullets.map((b, i) => (
                    <li key={i} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.88rem",
                      color: "rgba(44,24,16,0.7)",
                      lineHeight: 1.5,
                    }}>
                      <span style={{
                        flexShrink: 0,
                        marginTop: "0.3rem",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#8B6914",
                        display: "inline-block",
                      }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA — full-width ochre button */}
              <Link
                href={door.href}
                onClick={onClose}
                className="no-underline"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: "#FAFAF7",
                  background: "#2C1810",
                  padding: "0.9rem 1.5rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s",
                  boxSizing: "border-box" as const,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#8B6914";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#2C1810";
                }}
              >
                {door.cta} →
              </Link>

              {/* Subtle dismiss hint */}
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                color: "rgba(44,24,16,0.3)",
                textAlign: "center",
                marginTop: "1rem",
                marginBottom: 0,
              }}>Tap outside or press Esc to close</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
