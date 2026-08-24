import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { TonyAvatarTrigger } from "@/components/TonyAvatarTrigger";
import CategoryBadge from "./CategoryBadge";

const NAV_SECTIONS = [
  { label: "Home", path: "/brewsoul" },
  { label: "📋 All Pages", path: "/brewsoul/directory" },
  { label: "The First Sip", path: "/brewsoul/first-sip" },
  { label: "Quiz", path: "/brewsoul/quiz" },
  { label: "Catalog", path: "/brewsoul/browse" },
  { label: "Esoteric Index", path: "/brewsoul/esoteric" },
  { label: "Biodynamic", path: "/brewsoul/biodynamic" },
  { label: "Decaf Guide", path: "/brewsoul/decaf" },
  { label: "Health", path: "/brewsoul/health" },
  { label: "Prescription", path: "/brewsoul/prescription" },
  { label: "Varieties", path: "/brewsoul/varieties" },
  { label: "Processing", path: "/brewsoul/processing" },
  { label: "Roasters", path: "/brewsoul/roasters" },
  { label: "Farms", path: "/brewsoul/farms" },
  { label: "Mold-Free", path: "/brewsoul/mold-free" },
  { label: "Wall of Shame", path: "/brewsoul/wall-of-shame" },
  { label: "Follow $", path: "/brewsoul/follow-the-dollar" },
  { label: "Experiences", path: "/brewsoul/experiences" },
  { label: "Compare", path: "/brewsoul/compare" },
  { label: "Blend Builder", path: "/brewsoul/blend-builder" },
  { label: "Drops", path: "/brewsoul/drops" },
  { label: "Pairings", path: "/brewsoul/pairings" },
  { label: "Economics", path: "/brewsoul/economics" },
  { label: "Glossary", path: "/brewsoul/glossary" },
  { label: "Chain Rankings", path: "/brewsoul/chains" },
  { label: "City Rankings", path: "/brewsoul/cities" },
  { label: "Guest: Shanita Nicholas", path: "/brewsoul/guest/shanita-nicholas" },
  { label: "My Collection", path: "/brewsoul/my-coffees" },
];

const ECOSYSTEM = [
  { label: "Tony Greenberg", url: "/" },
  { label: "SoulSmoke (Mezcal)", url: "https://mezcalagave-ahru9fq8.manus.space" },
  { label: "LiquidSun (Tequila)", url: "https://tequilaazul-fxqrr3js.manus.space" },
  { label: "Find Your Sake", url: "/find-your-sake" },
];

export default function BrewSoulLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (p: string) => p === "/brewsoul" ? location === p : location.startsWith(p);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#2C1810" }}>
      {/* Top nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1rem, 3vw, 2rem)",
        background: scrolled ? "rgba(250,250,247,0.95)" : "rgba(250,250,247,0.8)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(111,78,55,0.12)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <Link href="/brewsoul" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#6F4E37" }}>BrewSoul</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C5A23C", opacity: 0.8 }}>Coffee Intelligence</span>
        </Link>

        {/* Desktop nav scroll */}
        <div className="hidden md:flex" style={{ gap: "0.25rem", overflow: "auto", maxWidth: "50vw", scrollbarWidth: "none" }}>
          {NAV_SECTIONS.slice(0, 8).map(s => (
            <Link key={s.path} href={s.path} style={{
              textDecoration: "none", padding: "0.3rem 0.6rem", borderRadius: "4px", whiteSpace: "nowrap",
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", fontWeight: isActive(s.path) ? 600 : 400,
              color: isActive(s.path) ? "#6F4E37" : "#6B5B4F",
              background: isActive(s.path) ? "rgba(111,78,55,0.08)" : "transparent",
            }}>{s.label}</Link>
          ))}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "0.3rem 0.6rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#C5A23C",
          }}>More +</button>
        </div>

        {/* Right side: Tony avatar + search, ecosystem badge, mobile hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Tony Avatar / Search — visible on all sizes */}
          <TonyAvatarTrigger isDark={false} />

          {/* Ecosystem badge — desktop only */}
          <Link href="/" className="hidden lg:flex" style={{
            textDecoration: "none", alignItems: "center", gap: "0.3rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#999", opacity: 0.7,
          }}>
            Part of Find Your Me
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "0.5rem",
            fontSize: "1.2rem", color: "#6F4E37",
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </nav>

      {/* Full menu overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "52px", left: 0, right: 0, bottom: 0, zIndex: 9998,
          background: "rgba(250,250,247,0.98)", backdropFilter: "blur(20px)",
          overflowY: "auto", padding: "1.5rem",
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "1rem" }}>
              Navigate
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {NAV_SECTIONS.map(s => (
                <Link key={s.path} href={s.path} style={{
                  textDecoration: "none", padding: "0.75rem 1rem", borderRadius: "6px",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem",
                  color: isActive(s.path) ? "#6F4E37" : "#2C1810",
                  background: isActive(s.path) ? "rgba(111,78,55,0.1)" : "rgba(111,78,55,0.03)",
                  border: "1px solid rgba(111,78,55,0.08)",
                  fontWeight: isActive(s.path) ? 600 : 400,
                }}>{s.label}</Link>
              ))}
            </div>
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(111,78,55,0.1)" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.75rem" }}>
                Ecosystem
              </div>
              {ECOSYSTEM.map(e => (
                <a key={e.url} href={e.url} style={{
                  display: "block", textDecoration: "none", padding: "0.5rem 0",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F",
                }}>{e.label}</a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <main style={{ paddingTop: "52px" }}>
        <CategoryBadge />
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: "#F5F0E6", borderTop: "1px solid rgba(111,78,55,0.1)",
        padding: "3rem 1.5rem 2rem", textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#6F4E37", marginBottom: "0.5rem" }}>
          BrewSoul — The Coffee Intelligence Engine
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "1.5rem" }}>
          Every Cup Is a Vote
        </div>
        <Link href="/brewsoul/directory" style={{
          display: "inline-block", textDecoration: "none", marginBottom: "1.25rem",
          padding: "0.6rem 1.5rem", borderRadius: "6px",
          border: "1px solid rgba(111,78,55,0.2)", background: "rgba(111,78,55,0.04)",
          fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#6F4E37",
        }}>
          📋 See All 24 Pages
        </Link>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {ECOSYSTEM.map(e => (
            <a key={e.url} href={e.url} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#6F4E37", textDecoration: "none",
            }}>{e.label}</a>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#BBB", letterSpacing: "0.1em" }}>
          Original content. No copying from Cup of Excellence/ACE/third parties. All prices USD.
        </div>
      </footer>
    </div>
  );
}
