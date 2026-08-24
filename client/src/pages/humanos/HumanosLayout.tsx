/**
 * HumanOS V2.0 — Shared Layout
 * Matches original humanosv2: dark nav → light body → dark footer
 * Space Grotesk + Special Elite fonts
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";

const LOGO_IMG = "/api/img/impact-soul-logo-official_d77d784c.png";

const NAV_ITEMS = [
  { label: "PHILOSOPHY", href: "/humanos/philosophy" },
  { label: "ECOSYSTEM", href: "/humanos/ecosystem" },
  { label: "RESOURCES", href: "/humanos/resources" },
  { label: "CONNECT", href: "/humanos/connect" },
];

export default function HumanosLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#fafafa", color: "#1a1a2e", minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/humanos" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <img src={LOGO_IMG} alt="Human OS" sizes="36px" style={{ width: 36, height: 36, borderRadius: 6 }} loading="lazy" />
          </Link>

          {/* Desktop nav */}
          <div style={{ alignItems: "center", gap: "1.5rem" }} className="hidden lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.8rem", letterSpacing: "0.12em", color: location === item.href ? "#7C3AED" : "rgba(255,255,255,0.75)", textDecoration: "none", transition: "color 0.2s" }}>
                {item.label}
              </Link>
            ))}
            <Link href="/living-declaration" style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.8rem", letterSpacing: "0.12em", background: "#7C3AED", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "2px", textDecoration: "none" }}>
              MANIFESTO
            </Link>
          </div>

          {/* Mobile hamburger — red icon matching original humanosv2 */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col items-center justify-center" style={{ background: "#7C3AED", border: "none", width: 42, height: 42, borderRadius: "8px", cursor: "pointer", gap: 5, padding: 0 }}>
            <span style={{ display: "block", width: 20, height: 2.5, background: "#fff", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2.5, background: "#fff", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2.5, background: "#fff", borderRadius: 2 }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden block" style={{ background: "rgba(10,10,10,0.98)", padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display: "block", fontFamily: "'Special Elite', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", color: location === item.href ? "#7C3AED" : "rgba(255,255,255,0.7)", textDecoration: "none", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {item.label}
              </Link>
            ))}
            <Link href="/living-declaration" onClick={() => setMenuOpen(false)} style={{ display: "block", fontFamily: "'Special Elite', monospace", fontSize: "0.85rem", letterSpacing: "0.1em", color: "#7C3AED", textDecoration: "none", padding: "0.6rem 0" }}>
              MANIFESTO
            </Link>
          </div>
        )}
      </nav>

      {/* CONTENT */}
      <main style={{ paddingTop: "60px" }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a10", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "3rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1rem" }}>
            HUMAN OPERATING SYSTEM
          </p>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "500px" }}>
            The machine is perfect. Be the glitch. A framework for agency in the age of algorithmic control.
          </p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem" }}>
            Supported by{" "}
            <a href="https://impactsoul.com" target="_blank" rel="noopener" style={{ color: "rgba(255,255,255,0.35)" }}>ImpactSoul</a>
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>SYSTEM</p>
              <Link href="/humanos/philosophy" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>The Philosophy</Link>
              <Link href="/humanos/ecosystem" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>The Ecosystem</Link>
              <Link href="/humanos/resources" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>Resources</Link>
              <Link href="/living-declaration" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>Living Declaration</Link>
              <Link href="/humanos/path-to-here" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>Path to Here</Link>
            </div>
            <div>
              <p style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>CONNECT</p>
              <Link href="/portfolio" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>Investment Portfolio</Link>
              <a href="https://www.linkedin.com/in/tonygreenberg" target="_blank" rel="noopener" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>LinkedIn</a>
              <Link href="/humanos/connect" style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.3rem" }}>Contact</Link>
            </div>
          </div>

          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", marginTop: "2rem" }}>
            &copy; 2000&ndash;2026 ImpactSoul and RampRate. All Rights Reserved. Architected by Tony Greenberg.
          </p>
        </div>
      </footer>
    </div>
  );
}
