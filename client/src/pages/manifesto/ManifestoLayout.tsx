import { Link, useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronLeft, Flame } from "lucide-react";

/* ── Crusade Design Tokens — HIGH-CONTRAST LIGHT MODE ── */
export const C = {
  /* Backgrounds */
  parchment: "#FAFAF7",
  warmWhite: "#F5F3EE",
  sand: "#EDE9E0",
  /* Text */
  ink: "#1A1A1A",
  darkBrown: "#2C2418",
  muted: "#6B6358",
  /* Accents */
  red: "#C8161A",
  crimson: "#A01015",
  blood: "#8B1E14",
  gold: "#8B6914",
  brightGold: "#D4A853",
  teal: "#0E7C7C",
  deepTeal: "#0A5E5E",
  ember: "#D4850A",
  /* Glass */
  glass: "rgba(255,255,255,0.75)",
  glassEdge: "rgba(0,0,0,0.08)",
  glassDark: "rgba(255,255,255,0.85)",
} as const;

const NAV_ITEMS = [
  { path: "/attention-theft", anchor: "", label: "The Manifesto", short: "Home" },
  { path: "/attention-theft", anchor: "#heresy", label: "Economics of Theft", short: "Economics" },
  { path: "/attention-theft", anchor: "#blocker-finder", label: "Blocker Finder", short: "Blockers" },
  { path: "/attention-theft", anchor: "#legal", label: "Legal Arsenal", short: "Legal" },
  { path: "/attention-theft", anchor: "#weapons", label: "10 Weapons", short: "Weapons" },
  { path: "/attention-theft", anchor: "#report", label: "Report Spammer", short: "Report" },
];

/* ── Ember Particle System (warm gold/red sparks) ── */
function EmberParticles({ count = 20, color = C.ember }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 10}%`,
            backgroundColor: i % 3 === 0 ? C.red : i % 3 === 1 ? color : C.brightGold,
            opacity: Math.random() * 0.6 + 0.1,
            animation: `ember-rise ${Math.random() * 8 + 6}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
            filter: `blur(${Math.random() > 0.7 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Shattered Glass Overlay (subtle on light bg) ── */
function ShatteredGlass() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: Math.random() * 50 + 15,
            height: Math.random() * 50 + 15,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(${Math.random() * 360}deg, rgba(200,22,26,0.08), rgba(255,255,255,0.3))`,
            clipPath: `polygon(${Math.random()*30}% 0%, 100% ${Math.random()*30}%, ${100-Math.random()*30}% 100%, 0% ${100-Math.random()*30}%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `glass-float ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export { EmberParticles, ShatteredGlass };

export default function ManifestoLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      // Track which section is in view
      const sections = ["report", "weapons", "legal", "blocker-finder", "heresy"];
      let found = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          found = `#${id}`;
          break;
        }
      }
      setActiveAnchor(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToAnchor = useCallback((anchor: string) => {
    if (!anchor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(anchor.replace("#", ""));
    if (el) {
      const offset = 80; // account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const navOpacity = Math.min(scrollY / 100, 1);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: C.parchment,
        color: C.ink,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Top Bar — Warm Parchment Nav ── */}
      <header
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          backgroundColor: `rgba(250,250,247,${0.85 + navOpacity * 0.15})`,
          borderColor: `rgba(200,22,26,${0.1 + navOpacity * 0.1})`,
          backdropFilter: "blur(20px) saturate(1.3)",
          boxShadow: scrollY > 50 ? `0 2px 20px rgba(0,0,0,0.06)` : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-100"
            style={{ color: C.muted, opacity: 0.7 }}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">TonyG</span>
          </Link>

          <Link href="/attention-theft" className="flex items-center gap-2 group">
            <Flame
              size={22}
              className="transition-all group-hover:scale-110"
              style={{
                color: C.red,
                filter: "drop-shadow(0 0 6px rgba(200,22,26,0.4))",
              }}
            />
            <span
              className="text-base font-bold tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Fraunces', serif",
                color: C.ink,
              }}
            >
              THE CRUSADE
            </span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md transition-colors"
            style={{ color: C.ink }}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="max-w-7xl mx-auto px-5 flex items-center gap-1 overflow-x-auto py-1">
            {NAV_ITEMS.map((item) => {
              const active = activeAnchor === item.anchor;
              return (
                <button
                  key={item.anchor}
                  onClick={() => scrollToAnchor(item.anchor)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all cursor-pointer"
                  style={{
                    backgroundColor: active ? C.red : "transparent",
                    color: active ? "#fff" : C.muted,
                    boxShadow: active ? `0 0 15px rgba(200,22,26,0.3)` : "none",
                    border: "none",
                  }}
                >
                  {item.short}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="lg:hidden border-t"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              backgroundColor: "rgba(250,250,247,0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-5 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = activeAnchor === item.anchor;
                return (
                  <button
                    key={item.anchor}
                    onClick={() => { scrollToAnchor(item.anchor); setMenuOpen(false); }}
                    className="px-3 py-2.5 rounded-md text-base font-medium transition-colors text-left cursor-pointer"
                    style={{
                      backgroundColor: active ? C.red : "transparent",
                      color: active ? "#fff" : C.ink,
                      boxShadow: active ? `0 0 15px rgba(200,22,26,0.2)` : "none",
                      border: "none",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm font-medium"
                  style={{ color: C.muted, opacity: 0.6 }}
                >
                  Back to TonyGreenberg.com
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>{children}</main>

      {/* ── Footer — Warm with red accent ── */}
      <footer
        className="relative py-16 px-5 text-center overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${C.sand} 0%, ${C.warmWhite} 100%)`,
          color: C.ink,
        }}
      >
        <div className="relative z-10">
          <Flame
            size={32}
            className="mx-auto mb-4"
            style={{ color: C.red, filter: "drop-shadow(0 0 8px rgba(200,22,26,0.3))" }}
          />
          <p
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
          >
            Tony Greenberg
          </p>
          <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: C.muted }}>
            Founder &amp; CEO, ImpactSoul &middot; Co-Founder, RampRate &middot; 25 Years Building Fortune 500 Efficiency
          </p>
          <div className="flex items-center justify-center gap-5 mb-6 flex-wrap">
            <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: C.muted, opacity: 0.7 }}>
              TonyGreenberg.com
            </Link>
            <Link href="/blog" className="text-sm transition-opacity hover:opacity-100" style={{ color: C.muted, opacity: 0.7 }}>
              Essays
            </Link>
            <Link href="/attention-theft" className="text-sm font-semibold transition-opacity hover:opacity-100" style={{ color: C.red }}>
              The Manifesto
            </Link>
          </div>
          <div
            className="pt-6 border-t mx-auto max-w-md"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            <p className="text-xs" style={{ color: C.muted, opacity: 0.6 }}>
              &copy; 2025 Tony Greenberg. This manifesto may be freely shared. <strong style={{ color: C.red }}>That&apos;s the point.</strong>
            </p>
          </div>
        </div>
      </footer>

      {/* ── Global Animations ── */}
      <style>{`
        @keyframes ember-rise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100vh) translateX(40px) scale(0.3); opacity: 0; }
        }
        @keyframes glass-float {
          0%, 100% { transform: rotate(var(--r, 0deg)) translateY(0); opacity: 0.2; }
          50% { transform: rotate(var(--r, 0deg)) translateY(-15px); opacity: 0.35; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(200,22,26,0.1); }
          50% { box-shadow: 0 0 30px rgba(200,22,26,0.25), 0 0 60px rgba(200,22,26,0.08); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes threat-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes glitch-x {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(200,22,26,0.15); }
          50% { border-color: rgba(200,22,26,0.4); }
        }

        /* ── GLITCH / DISTORTION EFFECTS (light-mode compatible) ── */
        @keyframes glitch-clip {
          0% { clip-path: inset(40% 0 61% 0); }
          10% { clip-path: inset(92% 0 1% 0); }
          20% { clip-path: inset(43% 0 1% 0); }
          30% { clip-path: inset(25% 0 58% 0); }
          40% { clip-path: inset(54% 0 7% 0); }
          50% { clip-path: inset(58% 0 43% 0); }
          60% { clip-path: inset(70% 0 7% 0); }
          70% { clip-path: inset(5% 0 80% 0); }
          80% { clip-path: inset(82% 0 5% 0); }
          90% { clip-path: inset(15% 0 70% 0); }
          100% { clip-path: inset(40% 0 61% 0); }
        }
        @keyframes chromatic-shift {
          0%, 100% { text-shadow: -2px 0 rgba(200,22,26,0.6), 2px 0 rgba(14,124,124,0.6); }
          25% { text-shadow: 2px 0 rgba(200,22,26,0.6), -2px 0 rgba(14,124,124,0.6); }
          50% { text-shadow: -1px 2px rgba(200,22,26,0.6), 1px -2px rgba(14,124,124,0.6); }
          75% { text-shadow: 1px -1px rgba(200,22,26,0.6), -1px 1px rgba(14,124,124,0.6); }
        }
        @keyframes distort-flicker {
          0%, 100% { opacity: 1; transform: scaleX(1); }
          5% { opacity: 0.85; transform: scaleX(1.002); }
          10% { opacity: 1; transform: scaleX(0.998); }
          15% { opacity: 0.92; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1); }
          51% { opacity: 0.7; transform: scaleX(1.004); }
          52% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes vhs-tracking {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }

        .glitch-hero:hover img {
          animation: distort-flicker 0.3s steps(2) infinite;
        }
        .glitch-hero:hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(200,22,26,0.04) 2px,
            rgba(200,22,26,0.04) 4px
          );
          animation: vhs-tracking 4s linear infinite;
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: multiply;
        }

        .glitch-title {
          position: relative;
          transition: all 0.2s ease;
        }
        .glitch-title:hover {
          animation: chromatic-shift 0.15s steps(2) infinite;
        }

        .glitch-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .glitch-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(200,22,26,0.04),
            rgba(14,124,124,0.04),
            transparent
          );
          transition: left 0.5s ease;
          z-index: 1;
          pointer-events: none;
        }
        .glitch-card:hover::before {
          left: 100%;
        }
        .glitch-card:hover {
          border-color: rgba(200,22,26,0.25) !important;
          box-shadow: 0 4px 30px rgba(200,22,26,0.08), 0 0 0 1px rgba(200,22,26,0.1) !important;
        }

        .glitch-scan {
          position: relative;
          overflow: hidden;
        }
        .glitch-scan::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(200,22,26,0.5), rgba(14,124,124,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 10;
          pointer-events: none;
        }
        .glitch-scan:hover::after {
          opacity: 1;
          animation: scan-line 2s linear infinite;
        }

        .glitch-text {
          position: relative;
        }
        .glitch-text:hover {
          animation: glitch-x 0.1s steps(2) infinite;
        }

        /* ── SCARY ENHANCEMENTS ── */
        @keyframes blood-drip {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes surveillance-sweep {
          0% { transform: translateX(-100%) rotate(-1deg); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: translateX(100%) rotate(1deg); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.05); }
          28% { transform: scale(1); }
          42% { transform: scale(1.08); }
          70% { transform: scale(1); }
        }
        @keyframes static-noise {
          0%, 100% { opacity: 0.03; }
          10% { opacity: 0.08; }
          20% { opacity: 0.02; }
          30% { opacity: 0.06; }
          40% { opacity: 0.01; }
          50% { opacity: 0.09; }
          60% { opacity: 0.04; }
          70% { opacity: 0.07; }
          80% { opacity: 0.02; }
          90% { opacity: 0.05; }
        }
        @keyframes red-flash {
          0%, 95%, 100% { opacity: 0; }
          97% { opacity: 0.06; }
        }
        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.6; }
          97% { opacity: 1; }
        }
        @keyframes warning-strobe {
          0%, 100% { background-color: rgba(200,22,26,0.08); }
          50% { background-color: rgba(200,22,26,0.2); }
        }
        .scary-flicker {
          animation: text-flicker 4s ease-in-out infinite;
        }
        .scary-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .scary-strobe {
          animation: warning-strobe 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ── Shared UI Primitives — HIGH-CONTRAST LIGHT MODE ── */

export function GlassCard({
  children,
  className = "",
  variant = "default",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "danger" | "teal";
  glow?: boolean;
}) {
  const styles = {
    default: {
      background: "rgba(255,255,255,0.8)",
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: glow ? "0 0 25px rgba(200,22,26,0.1)" : "0 4px 24px rgba(0,0,0,0.06)",
      color: C.ink,
    },
    dark: {
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(0,0,0,0.1)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      color: C.ink,
    },
    danger: {
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(200,22,26,0.2)",
      boxShadow: glow ? "0 0 30px rgba(200,22,26,0.12)" : "0 4px 24px rgba(200,22,26,0.06)",
      color: C.ink,
    },
    teal: {
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(14,124,124,0.2)",
      boxShadow: glow ? "0 0 25px rgba(14,124,124,0.1)" : "0 4px 24px rgba(14,124,124,0.04)",
      color: C.ink,
    },
  };

  return (
    <div
      className={`rounded-2xl p-6 md:p-8 backdrop-blur-xl transition-all glitch-card ${className}`}
      style={{
        ...styles[variant],
        animation: glow ? "pulse-glow 3s ease-in-out infinite" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-3"
      style={{ color: color || C.red }}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <h2
      className="font-bold mb-4 glitch-title"
      style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(28px, 5vw, 56px)",
        color: color || C.ink,
        lineHeight: 1.1,
      }}
    >
      {children}
    </h2>
  );
}

export function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-lg leading-relaxed max-w-2xl"
      style={{ color: C.muted, lineHeight: 1.8 }}
    >
      {children}
    </p>
  );
}

export function PullQuote({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <blockquote
      className="my-10 pl-6 text-xl md:text-2xl leading-relaxed max-w-3xl"
      style={{
        fontFamily: "'Fraunces', serif",
        fontWeight: 400,
        color: C.darkBrown,
        borderLeft: `3px solid ${color || C.red}`,
        lineHeight: 1.6,
      }}
    >
      {children}
    </blockquote>
  );
}

export function StatCard({
  number,
  label,
  source,
}: {
  number: string;
  label: string;
  source: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-center relative overflow-hidden backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(200,22,26,0.15)",
        boxShadow: "0 4px 24px rgba(200,22,26,0.06)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.ember}, transparent)`,
          animation: "threat-pulse 2s ease-in-out infinite",
        }}
      />
      <div
        className="font-bold leading-none mb-2"
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          color: C.red,
        }}
      >
        {number}
      </div>
      <div className="text-base font-medium" style={{ color: C.ink }}>
        {label}
      </div>
      <div className="text-xs mt-2" style={{ color: C.muted }}>
        {source}
      </div>
    </div>
  );
}

export function ThreatBadge({ level }: { level: "critical" | "high" | "medium" | "low" }) {
  const colors = {
    critical: { bg: "rgba(200,22,26,0.1)", text: C.red, border: "rgba(200,22,26,0.3)" },
    high: { bg: "rgba(212,133,10,0.1)", text: C.ember, border: "rgba(212,133,10,0.25)" },
    medium: { bg: "rgba(139,105,20,0.08)", text: C.gold, border: "rgba(139,105,20,0.2)" },
    low: { bg: "rgba(14,124,124,0.08)", text: C.teal, border: "rgba(14,124,124,0.2)" },
  };
  const c = colors[level];
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {level}
    </span>
  );
}

export function CrusadeDivider() {
  return (
    <div className="my-10 mx-auto relative" style={{ height: "2px", maxWidth: "200px" }}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.ember}, ${C.red}, transparent)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{
          backgroundColor: C.red,
          boxShadow: `0 0 8px ${C.red}, 0 0 16px rgba(200,22,26,0.4)`,
        }}
      />
    </div>
  );
}

/* ── Hero Section — Explosive image with glassmorphic text overlay ── */
export function HeroSection({
  image,
  title,
  subtitle,
  label,
  children,
}: {
  image: string;
  title: React.ReactNode;
  subtitle: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden glitch-hero glitch-scan">
      {/* Background image — vivid, not darkened to death */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.85) saturate(1.2) contrast(1.05)" }}
        />
        {/* Light gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(250,250,247,0.4) 0%, rgba(250,250,247,0.15) 30%, rgba(250,250,247,0.6) 70%, rgba(250,250,247,0.95) 100%)`,
          }}
        />
      </div>

      <EmberParticles count={15} />
      <ShatteredGlass />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-24 md:py-36">
        {/* Glassmorphic text panel */}
        <div
          className="inline-block rounded-2xl px-8 py-8 md:px-10 md:py-10 backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <SectionLabel color={C.red}>{label}</SectionLabel>
          <h1
            className="font-bold mb-4"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(32px, 7vw, 72px)",
              color: C.ink,
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
          <p
            className="text-lg md:text-xl mb-6 max-w-2xl"
            style={{ color: C.darkBrown, lineHeight: 1.75 }}
          >
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
