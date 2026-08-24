import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { TonyAvatarTrigger } from "@/components/TonyAvatarTrigger";

/**
 * StandaloneNav — A persistent floating navigation bar for standalone pages
 * (assessments, tools, etc.) that renders outside the main Layout.
 *
 * Provides: Home link, Find My hub link, and current page context.
 * Designed to be minimal and non-intrusive while always giving users
 * a way back to the main site.
 */

const ROUTE_LABELS: Record<string, string> = {
  "/find-your-me": "Find Your Me",
  "/discover": "Discover",
  "/find-your-therapy": "Find Your Therapy",
  "/find-your-sake": "Find Your Sake",
  "/find-your-spirit": "Find Your Spirit",
  "/find-your-religion": "Find Your Religion",
  "/find-your-diet": "Find Your Diet",
  "/find-your-movement": "Find Your Movement",
  "/find-your-sleep": "Find Your Sleep",
  "/find-your-coffee": "Find Your Coffee",
  "/find-your-kitchen": "Find Your Kitchen",
  "/find-your-style": "Find Your Style",
  "/find-your-attachment-style": "Attachment Style",
  "/find-your-love-language": "Love Language",
  "/find-your-peptide": "Find Your Peptide",
  "/find-your-sexuality": "Find Your Sexuality",
  "/find-my-me": "Find Your Me",
  "/find-my-we": "Find Your We",
  "/find-my-tribe": "Community",
  "/find-my-attachment-style": "Attachment Style",
  "/find-my-sleep": "Find Your Sleep",
  "/find-my-movement": "Find Your Movement",
  "/find-my-diet": "Find Your Diet",
  "/find-my-peptide": "Find Your Peptide",
  "/find-my-therapy": "Find Your Therapy",
  "/find-my-spirit": "Find Your Spirit",
  "/find-my-sexuality": "Find Your Sexuality",
  "/dharma-finder": "Dharma Finder",
  "/consciousness-scale": "Consciousness Scale",
  "/grant-study": "Grant Study",
  "/flow-circuit": "Flow Circuit",
  "/self-portrait": "Self-Portrait",
  "/soulscore": "SoulScore",
  "/ecosystem-map": "Ecosystem Map",
  "/my-journey": "My Journey",
  "/payment-success": "Payment",
  "/payment-cancel": "Payment",
};

export default function StandaloneNav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const currentLabel = ROUTE_LABELS[location] || "Tony Greenberg";

  // Determine if this is a Find Your assessment
  const isFindYour = location.startsWith("/find-your-") || location.startsWith("/find-my-");

  return (
    <>
      {/* Fixed nav bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1rem, 3vw, 2rem)",
          height: "52px",
          background: scrolled
            ? "rgba(10, 10, 16, 0.92)"
            : "rgba(10, 10, 16, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(212, 185, 106, 0.15)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        {/* Left: Home link */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#D4B96A",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.02em",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7";
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          }}
        >
          {/* Small T monogram */}
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D4B96A, #8B6914)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A0A10",
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            T
          </span>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "'DM Mono', monospace",
              color: "#C4A882",
              letterSpacing: "0.05em",
            }}
          >
            TonyG
          </span>
        </Link>

        {/* Center: Current page label (desktop) */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(196, 168, 130, 0.6)",
            whiteSpace: "nowrap",
            display: "none",
          }}
          className="standalone-nav-center"
        >
          {currentLabel}
        </span>

        {/* Right: Tony avatar/search + Menu button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TonyAvatarTrigger isDark={true} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "1px solid rgba(212, 185, 106, 0.25)",
              color: "#C4A882",
              padding: "6px 14px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212, 185, 106, 0.5)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212, 185, 106, 0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212, 185, 106, 0.25)";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            <span style={{ fontSize: "14px" }}>{menuOpen ? "✕" : "☰"}</span>
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </nav>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "52px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: "rgba(10, 10, 16, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            overflowY: "auto",
            animation: "slideDown 0.25s ease",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "2rem clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            {/* Primary links */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(196, 168, 130, 0.5)",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Navigate
              </div>
              {[
                { href: "/", label: "Home", icon: "◆" },
                { href: "/find-my", label: "Find My Hub", icon: "◇" },
                { href: "/articles", label: "All 119 Essays", icon: "◇" },
                { href: "/blog", label: "Latest Essays", icon: "◇" },
                { href: "/the-letter", label: "The Letter", icon: "◇" },
                { href: "/soulscore", label: "SoulScore", icon: "◇" },
                { href: "/assessments", label: "All Assessments", icon: "◇" },
                { href: "/brewsoul", label: "BrewSoul Coffee", icon: "◇" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 0",
                    textDecoration: "none",
                    color: location === link.href ? "#D4B96A" : "#E8E4DC",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "18px",
                    borderBottom: "1px solid rgba(212, 185, 106, 0.08)",
                    transition: "color 0.2s",
                  }}
                >
                  <span style={{ color: "#D4B96A", fontSize: "10px" }}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick assessments */}
            {isFindYour && (
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    color: "rgba(196, 168, 130, 0.5)",
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                  }}
                >
                  More Assessments
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {[
                    { href: "/find-your-coffee", label: "☕ Coffee" },
                    { href: "/brewsoul", label: "☕ BrewSoul" },
                    { href: "/brewsoul/chains", label: "🏪 Chain Rankings" },
                    { href: "/find-your-diet", label: "🥗 Diet" },
                    { href: "/find-your-movement", label: "🏃 Movement" },
                    { href: "/find-your-sleep", label: "😴 Sleep" },
                    { href: "/find-your-kitchen", label: "🍳 Kitchen" },
                    { href: "/find-your-style", label: "👔 Style" },
                    { href: "/find-your-sake", label: "🍶 Sake" },
                    { href: "/find-your-spirit", label: "🧘 Spirit" },
                    { href: "/find-your-therapy", label: "🧠 Therapy" },
                    { href: "/find-your-peptide", label: "💊 Peptide" },
                    { href: "/find-your-attachment-style", label: "💕 Attachment" },
                    { href: "/find-your-love-language", label: "❤️ Love Language" },
                    { href: "/find-your-sexuality", label: "🌹 Sexuality" },
                    { href: "/find-your-religion", label: "✝️ Religion" },
                  ]
                    .filter((a) => a.href !== location)
                    .map((a) => (
                      <Link
                        key={a.href}
                        href={a.href}
                        style={{
                          display: "block",
                          padding: "10px 12px",
                          textDecoration: "none",
                          color: "#C4A882",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "12px",
                          border: "1px solid rgba(212, 185, 106, 0.1)",
                          transition: "all 0.2s",
                          textAlign: "center",
                        }}
                      >
                        {a.label}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Connect */}
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(196, 168, 130, 0.5)",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Connect
              </div>
              {[
                { href: "/pick-up-the-phone", label: "Pick Up the Phone" },
                { href: "/fauxtony", label: "Ask FauxTony" },
                { href: "/subscribe", label: "Subscribe" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "12px 0",
                    textDecoration: "none",
                    color: "#C4A882",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "16px",
                    borderBottom: "1px solid rgba(212, 185, 106, 0.08)",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS for center label on desktop + slide animation */}
      <style>{`
        @media (min-width: 768px) {
          .standalone-nav-center {
            display: block !important;
          }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
