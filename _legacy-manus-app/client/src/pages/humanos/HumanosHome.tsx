/**
 * HumanOS V2.0 — Home Page
 * Matches original humanosv2: dark hero → light body sections
 * Hero with hand-breaking-glass, "BE THE GLITCH" tagline,
 * Maximizer vs Satisficer intro, assessment CTA
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import HumanosLayout from "./HumanosLayout";
import SEO from "@/components/SEO";

const ARCHETYPE_LABELS = ["Satisficer", "Maximizer", "Conscious Satisficer", "Recovering Maximizer", "Hybrid Optimizer"];

/* ── Glitch animation CSS ── */
const GLITCH_CSS = `
@keyframes glitch-skew {
  0%, 100% { transform: skew(0deg); }
  20% { transform: skew(-2deg); }
  40% { transform: skew(1.5deg); }
  60% { transform: skew(-0.5deg); }
  80% { transform: skew(0.8deg); }
}
@keyframes scanline {
  0% { top: -10%; }
  100% { top: 110%; }
}
@keyframes hero-drift {
  0%, 100% { transform: scale(1.05) translate(0, 0); }
  33% { transform: scale(1.08) translate(-8px, 4px); }
  66% { transform: scale(1.06) translate(6px, -3px); }
}
.humanos-hero-bg {
  animation: hero-drift 20s ease-in-out infinite;
  transition: filter 0.4s;
}
.humanos-hero-bg:hover {
  filter: brightness(0.45) saturate(1.1) hue-rotate(5deg);
}
.glitch-heading {
  position: relative;
  animation: glitch-skew 8s ease-in-out infinite;
}
.humanos-hero-section::after {
  content: '';
  position: absolute;
  top: -10%; left: 0;
  width: 100%; height: 2px;
  background: rgba(229,62,62,0.15);
  animation: scanline 6s linear infinite;
  pointer-events: none;
  z-index: 3;
}
`;

const HERO_IMG = "/api/img/humanos-hero-hand_73f45c74.jpg";
const SATISFICER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/satisficer-vs-maximizer-8cWbpDMM6EHc2L6u3bi6xT.webp";

/* ── Shared inline style helpers ── */
const label: React.CSSProperties = {
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

const purpleBtn: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Special Elite', monospace",
  fontSize: "0.9rem",
  letterSpacing: "0.15em",
  background: "#7C3AED",
  color: "#fff",
  padding: "1rem 2.5rem",
  textDecoration: "none",
  borderRadius: "2px",
  transition: "background 0.2s",
};

export default function HumanosHome() {
  const [count, setCount] = useState(264);
  const [toast, setToast] = useState<{ label: string; visible: boolean }>({ label: "", visible: false });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
      const lbl = ARCHETYPE_LABELS[Math.floor(Math.random() * ARCHETYPE_LABELS.length)];
      setToast({ label: lbl, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
    }, 25000 + Math.random() * 35000);
    const first = setTimeout(() => {
      const lbl = ARCHETYPE_LABELS[Math.floor(Math.random() * ARCHETYPE_LABELS.length)];
      setToast({ label: lbl, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
    }, 6000);
    return () => { clearInterval(interval); clearTimeout(first); };
  }, []);

  return (
    <>
    <SEO
        title="HumanOS — Operating System for Humans"
        description="A framework for upgrading how you think, decide, and act. Tony Greenberg's HumanOS project."
        path="/humanos"
        keywords="Tony Greenberg, HumanOS, human operating system, cognitive upgrade, decision making"
        indexable={true}
      />
      <HumanosLayout>
      <style dangerouslySetInnerHTML={{ __html: GLITCH_CSS }} />

      {/* ═══════ HERO (dark, with hand image) ═══════ */}
      <section
        className="humanos-hero-section"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "#0a0a10",
        }}
      >
        {/* Full-bleed background image — using <img> for reliable loading */}
        <img
          src={HERO_IMG}
          alt="Hand breaking through glass with golden flowers"
          className="humanos-hero-bg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        {/* Subtle bottom gradient for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,10,16,0.2) 0%, transparent 30%, rgba(10,10,16,0.4) 60%, rgba(10,10,16,0.75) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, textAlign: "left", padding: "0 2rem 4rem 2rem", maxWidth: "700px", width: "100%" }}>
          <p style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: "0.9rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase",
            marginBottom: "1.2rem",
            background: "rgba(10,10,16,0.5)",
            display: "inline-block",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#48bb78", marginRight: 10, verticalAlign: "middle" }} />
            SYSTEM STATUS: AWAKENING
          </p>

          <h1
            className="glitch-heading"
            data-text="HUMAN OS V2.0"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: "0 0 1.2rem",
              color: "#fff",
              textShadow: "2px 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            HUMAN<br />
            <span style={{ color: "#7C3AED" }}>OS V2.0</span>
          </h1>

          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.95)",
              marginBottom: "0.6rem",
              textShadow: "1px 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            The machine is perfect.{" "}
            <span style={{ color: "#7C3AED", fontWeight: 700 }}>BE THE GLITCH.</span>
          </p>

          <p
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7,
              marginBottom: "0",
              textShadow: "1px 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            Reclaim agency in the age of algorithmic control.
          </p>

          {/* Diagnostics Completed counter */}
          <div style={{
            marginTop: "2.5rem",
            background: "rgba(10,10,16,0.55)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: "1rem 1.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
          }}>
            <div style={{
              fontFamily: "'Special Elite', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
            }}>
              DIAGNOSTICS COMPLETED
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(229,62,62,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#fff",
              }}>
                {count}
              </span>
            </div>
          </div>
        </div>

        {/* Live notification toast */}
        <div style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          zIndex: 10,
          background: "rgba(10,10,16,0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(72,187,120,0.3)",
          borderRadius: "12px",
          padding: "0.8rem 1.2rem",
          maxWidth: "300px",
          opacity: toast.visible ? 1 : 0,
          transform: toast.visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s, transform 0.5s",
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            lineHeight: 1.4,
          }}>
            Someone just discovered they're<br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#48bb78", display: "inline-block" }} />
              <span style={{ color: "#48bb78", fontWeight: 600 }}>a {toast.label}</span>
            </span>
          </p>
        </div>
      </section>

      {/* ═══════ MAXIMIZER VS SATISFICER (LIGHT background — matches original) ═══════ */}
      <section style={{ padding: "5rem 1.5rem", background: "#fafafa" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem" }}>THE CORE QUESTION</p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              color: "#1a1a2e",
            }}
          >
            ARE YOU A{" "}
            <span style={{ color: "#7C3AED" }}>MAXIMIZER</span>{" "}
            OR A{" "}
            <span style={{ color: "#7C3AED" }}>SATISFICER</span>?
          </h2>

          <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "1.5rem" }}>
            We are being optimized to death. Every app, every feed, every notification is designed to make you believe that the next click, the next purchase, the next upgrade will finally make you complete. It won't. It can't. That's the trap.
          </p>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#3a3a4a", marginBottom: "2rem" }}>
            <strong>Human OS 2.0</strong> is the counter-protocol. A system for the <strong style={{ color: "#7C3AED" }}>Conscious Satisficer</strong> — someone who has learned to define their own criteria for "enough" and stop when they get there. Not settling. <em>Choosing.</em>
          </p>

          {/* Image */}
          <div style={{ margin: "2rem 0", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <img
              src={SATISFICER_IMG}
              alt="Maximizer vs Satisficer — the two operating systems"
              style={{ width: "100%", display: "block" }}
              loading="lazy"
            />
          </div>

          {/* What You'll Discover — light pink like original */}
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid rgba(229,62,62,0.15)",
              borderRadius: "8px",
              padding: "2.5rem",
              marginTop: "2rem",
            }}
          >
            <p style={{ ...label, color: "#7C3AED", marginBottom: "1.25rem", fontSize: "0.8rem" }}>WHAT YOU'LL DISCOVER</p>
            {[
              "Your operating system type — Maximizer, Satisficer, or somewhere in between",
              "The algorithmic loops keeping you stuck in optimization mode",
              "A personalized protocol for reclaiming your cognitive bandwidth",
              "Practical tools for shifting from endless seeking to intentional choosing",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.85rem", alignItems: "flex-start" }}>
                <span style={{ color: "#7C3AED", fontFamily: "'Special Elite', monospace", fontSize: "0.9rem", flexShrink: 0, marginTop: "0.1rem" }}>→</span>
                <p style={{ fontSize: "1.05rem", color: "#3a3a4a", lineHeight: 1.7, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TAKE THE DIAGNOSTIC CTA (light pink like original) ═══════ */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          background: "#fff0f0",
        }}
      >
        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "1rem",
              color: "#1a1a2e",
            }}
          >
            TAKE THE{" "}
            <span style={{ color: "#7C3AED", fontStyle: "italic" }}>DIAGNOSTIC</span>
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#4a4a5a", lineHeight: 1.7, marginBottom: "0.75rem", fontStyle: "italic" }}>
            "Are you playing the game, or is the game playing you?"
          </p>
          <p style={{ fontSize: "1.05rem", color: "#5a5a6a", lineHeight: 1.7, marginBottom: "2rem" }}>
            8 questions &bull; 3 minutes &bull; Discover your path to conscious agency
          </p>

          {/* Diagnostic card — white like original */}
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginTop: "1.5rem",
            border: "1px solid rgba(0,0,0,0.06)",
          }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "1rem" }}>
              THE DIAGNOSTIC
            </h3>
            <p style={{ fontSize: "1.05rem", color: "#4a4a5a", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem" }}>
              Are you a Maximizer or a Satisficer? Take this 8-question assessment to discover your decision-making pattern — and learn how to escape the optimization trap.
            </p>
            <Link href="/assessment" style={purpleBtn}>
              BEGIN DIAGNOSTIC
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ EXPLORE THE SYSTEM (light background) ═══════ */}
      <section style={{ padding: "5rem 1.5rem", background: "#fafafa" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ ...label, color: "#7C3AED", marginBottom: "0.75rem", textAlign: "center", fontSize: "0.8rem" }}>EXPLORE THE SYSTEM</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            {[
              { title: "The Philosophy", desc: "Boiling the Human, the Maximizer Trap, and the Conscious Satisficer framework.", href: "/humanos/philosophy" },
              { title: "The Ecosystem", desc: "Mentors, advisors, partners, and the companies that shaped this thinking.", href: "/humanos/ecosystem" },
              { title: "Resources", desc: "Transformation playbooks, daily practices, and the essential reading list.", href: "/humanos/resources" },
              { title: "Path to Here", desc: "From the 2010 H+ Summit to today — the architect's journey.", href: "/humanos/path-to-here" },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  padding: "1.75rem",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "0.6rem" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "1rem", color: "#5a5a6a", lineHeight: 1.7, margin: 0 }}>
                  {card.desc}
                </p>
                <span style={{ ...label, color: "#7C3AED", fontSize: "0.7rem", display: "inline-block", marginTop: "1.25rem" }}>
                  EXPLORE →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </HumanosLayout>
    </>);
}
