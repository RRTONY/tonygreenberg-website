/**
 * HOMEPAGE — v2.0  Glass-Morphism Edition
 * "Exposing the Extractive. Building What Replaces It."
 * Same layout & content — elevated with glass-morphism, glowing bowl, particles, design tricks.
 */

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Section,
  Eyebrow,
  Divider,
  FadeIn,
} from "@/components/Editorial";
import { SocialProofTicker, EmailCapture } from "@/components/ConversionMechanics";
import { TypewriterText } from "@/components/Enhancements";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { ProvocationBlock, ReferralTracker } from "@/components/EngagementFeatures";
import FourDoorsModal, { type DoorData } from "@/components/FourDoorsModal";

const KINTSUGI_IMG = "/api/img/homepage-hero-original_d3e7447d.jpg";

const MOST_READ = [
  { num: "01", title: "Boiling the Human", subtitle: "Harvard H+ / Kurzweil", slug: "/blog" },
  { num: "02", title: "Trust Us? Are You Really My Friend?", subtitle: "", slug: "/blog" },
  { num: "03", title: "Return on Investment: Are You Going Green?", subtitle: "", slug: "/blog" },
  { num: "04", title: "Customer Service: The Key to Business Success", subtitle: "", slug: "/blog" },
  { num: "05", title: "Davos 2022 — World Economic Forum", subtitle: "", slug: "/blog" },
];

/* ── Floating golden particles ── */
function GoldenParticles({ count = 35 }: { count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      size: 1.5 + Math.random() * 3,
      opacity: 0.15 + Math.random() * 0.35,
      drift: -30 + Math.random() * 60,
    })), [count]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-5%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(212,185,106,${p.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(212,185,106,${p.opacity * 0.6})`,
            animation: `floatParticle ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: "transform, opacity",
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Breaking Context Banner — moved to peptide pages ── */

const FOUR_DOORS_DATA: DoorData[] = [
  {
    num: "01",
    title: "Read",
    sub: "Essays on culture, capital & human systems",
    href: "/blog",
    img: "/api/img/door01_634cd4d4.webp",
    headline: "Twenty-five years of thinking, unfiltered",
    body: "Essays that challenge extractive systems and explore what comes next. Culture, capital, human systems — written for people who are tired of being managed and ready to think for themselves.",
    bullets: [
      "118 essays spanning enterprise technology, impact investing, and social systems",
      "Featured in Harvard H+, Davos 2022, and independent media",
      "No paywall. No algorithm. Just the work.",
    ],
    cta: "Read the Essays",
  },
  {
    num: "02",
    title: "Diagnose",
    sub: "Assessments that clarify who you are",
    href: "/find-my",
    img: "/api/img/door02_8abcc1e9.webp",
    headline: "Clarity is a competitive advantage",
    body: "Short assessments — five to ten minutes — that surface decisions you've been avoiding. Who you are, what you want, and what's getting in the way. Immediate insight, no consultant required.",
    bullets: [
      "Psychographic profiling across leadership, risk, and values",
      "Calibrated against 25 years of pattern recognition",
      "Results you can actually act on",
    ],
    cta: "Find Your Fit",
  },
  {
    num: "03",
    title: "Engage",
    sub: "Builders & investors in regenerative systems",
    href: "/ecosystem",
    img: "/api/img/door03_ac43a96c.webp",
    headline: "The people building what comes after extraction",
    body: "A curated network of builders, investors, and operators who are done with the old playbook. Real capital. Real projects. No pitch decks required — just alignment on what matters.",
    bullets: [
      "Active investments across impact tokens, consciousness research, and payments infrastructure",
      "ImpactSoul — a Certified B Corp tokenizing cultural and real estate assets",
      "Introductions by merit, not by LinkedIn connection count",
    ],
    cta: "Explore the Ecosystem",
  },
  {
    num: "04",
    title: "Verify",
    sub: "COA checks, testing & vendor scoring",
    href: "/verify-your-coa",
    img: "/api/img/door04_f682151b.webp",
    headline: "Trust, but verify. Actually, just verify.",
    body: "Before you order anything from anyone — peptides, supplements, compounds — here's how to actually confirm what you're getting. COA interpretation, independent testing labs, and vendor scoring built from real sourcing experience.",
    bullets: [
      "Certificate of Analysis (COA) reading guide",
      "Independent third-party lab recommendations",
      "Vendor scoring rubric based on $10B+ procurement experience",
    ],
    cta: "Verify Your Source",
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeDoor, setActiveDoor] = useState<DoorData | null>(null);
  const openDoor = useCallback((door: DoorData) => setActiveDoor(door), []);
  const closeDoor = useCallback(() => setActiveDoor(null), []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <SEO
        title="Home"
        description="Tony Greenberg — 25 years exposing broken systems and building what replaces them. Enterprise technology, impact investing, human systems."
        path="/"
        keywords="Tony Greenberg, enterprise technology, impact investing, RampRate, ImpactSoul, human systems"
        indexable={true}
      />

      {/* ── HERO with glowing bowl ── */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          height: "70vh",
          minHeight: "420px",
          maxHeight: "650px",
          overflow: "hidden",
        }}
      >
        {/* Parallax background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${KINTSUGI_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        />

        {/* ★ BOWL GLOW — radial warm light bloom */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "25%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,185,106,0.35) 0%, rgba(212,185,106,0.15) 30%, rgba(180,140,50,0.08) 55%, transparent 75%)",
            filter: "blur(40px)",
            animation: "bowlPulse 4s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {/* ★ Inner glow — tighter, brighter */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "28%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,220,130,0.4) 0%, rgba(212,185,106,0.2) 40%, transparent 70%)",
            filter: "blur(25px)",
            animation: "bowlPulseInner 3s ease-in-out infinite 0.5s",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {/* ★ Light rays emanating from bowl */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "20%",
            width: "500px",
            height: "500px",
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(212,185,106,0.06) 15deg, transparent 30deg, transparent 60deg, rgba(212,185,106,0.04) 75deg, transparent 90deg, transparent 120deg, rgba(212,185,106,0.05) 135deg, transparent 150deg, transparent 180deg, rgba(212,185,106,0.06) 195deg, transparent 210deg, transparent 240deg, rgba(212,185,106,0.04) 255deg, transparent 270deg, transparent 300deg, rgba(212,185,106,0.05) 315deg, transparent 330deg, transparent 360deg)",
            borderRadius: "50%",
            filter: "blur(20px)",
            animation: "raysSpin 30s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Floating particles */}
        <GoldenParticles count={25} />

        {/* ★ JEWEL: Iridescent rain — prismatic light refracting across the glass */}
        <div className="hero-iridescent" />

        {/* ★ JEWEL: Light sweep shimmer — slow diagonal pass */}
        <div className="hero-shimmer-sweep" />

        {/* Gradient overlay — slightly adjusted for glow visibility */}
        <div
          className="hero-edge-glow"
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(1.5px)",
            WebkitBackdropFilter: "blur(1.5px)",
            background: "linear-gradient(180deg, rgba(10,10,16,0.25) 0%, rgba(10,10,16,0.02) 35%, rgba(10,10,16,0.55) 100%)",
            zIndex: 3,
          }}
        />

        {/* Hero text */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 clamp(1.5rem, 5vw, 4rem)",
            paddingBottom: "clamp(3rem, 8vh, 5rem)",
            maxWidth: "900px",
            zIndex: 4,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "0.8rem",
              textShadow: "0 0 20px rgba(212,185,106,0.4)",
            }}
          >
            <TypewriterText text="A Living Document · Updated Continuously" speed={40} delay={800} />
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: "0.6rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span className="glitch-text" style={{ display: "inline" }}>I expose broken systems.</span>
            <br />
            <span className="glitch-text jewel-glow-text" style={{ display: "block", color: "#D4B96A", textShadow: "0 0 30px rgba(212,185,106,0.3)" }}>Then I build what <br className="hero-mobile-break" />comes next.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "520px",
              lineHeight: 1.65,
              marginBottom: "1.2rem",
            }}
          >
            $10B+ transactions &nbsp;·&nbsp; Microsoft, Disney, Goldman Sachs &nbsp;·&nbsp; 25 years
          </p>

	         {/* Two compact CTA buttons — with glow */}
	         <div className="hero-cta-row" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "flex-start" }}>
	            <Link
	              href="/find-my"
	              className="no-underline magnetic-cta hero-cta"
	              style={{
	                display: "inline-flex",
	                alignItems: "center",
	                justifyContent: "center",
	                alignSelf: "flex-start",
	                width: "auto",
	                maxWidth: "max-content",
	                fontFamily: "'DM Mono', monospace",
	                fontSize: "0.69rem",
	                letterSpacing: "0.12em",
	                textTransform: "uppercase" as const,
	                color: "#0A0A10",
	                background: "#D4B96A",
	                padding: "0.58rem 1.1rem",
                borderRadius: "3px",
                textDecoration: "none",
                transition: "all 0.3s",
                boxShadow: "0 0 20px rgba(212,185,106,0.3), 0 0 40px rgba(212,185,106,0.1)",
              }}
            >
              Find Your Fit →
            </Link>
	            <Link
	              href="/blog"
	              className="no-underline magnetic-cta hero-cta"
	              style={{
	                display: "inline-flex",
	                alignItems: "center",
	                justifyContent: "center",
	                alignSelf: "flex-start",
	                width: "auto",
	                maxWidth: "max-content",
	                fontFamily: "'DM Mono', monospace",
	                fontSize: "0.69rem",
	                letterSpacing: "0.12em",
	                textTransform: "uppercase" as const,
	                color: "#D4B96A",
	                border: "1px solid rgba(212,185,106,0.5)",
	                padding: "0.58rem 1.1rem",
                borderRadius: "3px",
                textDecoration: "none",
                transition: "all 0.3s",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "rgba(212,185,106,0.08)",
              }}
            >
              121 Essays →
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.3rem",
              animation: "gentleBounce 2.5s ease-in-out infinite",
            }}
          >
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(212,185,106,0.6)" }}>Explore</span>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ opacity: 0.5 }}>
              <path d="M1 1L10 10L19 1" stroke="#D4B96A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── BREAKING CONTEXT BANNER removed — content moved to /rip-peptide-sciences ── */}

      {/* ── PROVOCATION OF THE DAY ── */}
      <ProvocationBlock />

      {/* ── THREE VISITOR PATHWAYS — clear wayfinding below hero ── */}
      <div style={{
        background: "#FAFAF7",
        padding: "2.5rem clamp(1.5rem, 5vw, 4rem) 0",
        borderBottom: "1px solid rgba(139,105,20,0.1)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#8B6914",
            marginBottom: "1.25rem",
            opacity: 0.7,
          }}>Where do you want to start?</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
            borderTop: "1px solid rgba(139,105,20,0.15)",
          }}>
            {/* PATH 1: WORK WITH TONY */}
            <a href="/engage" style={{ textDecoration: "none", display: "block" }}
              onClick={() => { try { (window as any).gtag?.("event", "homepage_path_work", { destination: "/engage" }); } catch {} }}>
              <div style={{
                padding: "1.5rem 1.5rem 1.5rem 0",
                borderRight: "1px solid rgba(139,105,20,0.12)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem" }}>Work with Tony</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#111", lineHeight: 1.25, marginBottom: "0.5rem" }}>You have a problem that insiders have normalized.</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>Strategic, pricing, infrastructure, or transformation challenges. Tony opens rooms. You walk through them.</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#8B6914", marginTop: "0.75rem", letterSpacing: "0.08em" }}>Start a conversation →</div>
              </div>
            </a>
            {/* PATH 2: READ / UNDERSTAND */}
            <a href="/start-here" style={{ textDecoration: "none", display: "block" }}
              onClick={() => { try { (window as any).gtag?.("event", "homepage_path_thinking", { destination: "/start-here" }); (window as any).gtag?.("event", "start_here_open", {}); } catch {} }}>
              <div style={{
                padding: "1.5rem 1.5rem",
                borderRight: "1px solid rgba(139,105,20,0.12)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem" }}>Read Tony's Thinking</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#111", lineHeight: 1.25, marginBottom: "0.5rem" }}>You came here because you want to understand his ideas.</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>121 essays. Start with the 7 that explain everything. No algorithm. No paywall.</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#8B6914", marginTop: "0.75rem", letterSpacing: "0.08em" }}>Start here →</div>
              </div>
            </a>
            {/* PATH 3: EXPLORE WHAT'S BEING BUILT */}
            <a href="/ecosystem" style={{ textDecoration: "none", display: "block" }}
              onClick={() => { try { (window as any).gtag?.("event", "homepage_path_building", { destination: "/ecosystem" }); } catch {} }}>
              <div style={{
                padding: "1.5rem 0 1.5rem 1.5rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem" }}>Explore What Tony Builds</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#111", lineHeight: 1.25, marginBottom: "0.5rem" }}>You want to see the companies, experiments, and systems.</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>RampRate. ImpactSoul. Human OS. The things being built before they make the news.</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#8B6914", marginTop: "0.75rem", letterSpacing: "0.08em" }}>See the ecosystem →</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── START HERE — 7 foundational essays for first-time visitors ── */}
      <div style={{
        background: "#FAFAF7",
        padding: "2.5rem clamp(1.5rem, 5vw, 4rem) 3rem",
        borderBottom: "1px solid rgba(139,105,20,0.1)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" as const }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "#111" }}>Start Here</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#8B6914", opacity: 0.7 }}>7 essays that explain what I think and what I'm building</div>
          </div>
          <div style={{ width: "40px", height: "2px", background: "#8B6914", marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0" }}>
            {[
              { num: "01", slug: "when-healing-becomes-extraction", title: "When Healing Becomes Extraction", why: "The clearest statement of what I stand for — and what I'll fight against.", theme: "Ethics & Systems", time: "22 min" },
              { num: "02", slug: "your-blood-lies-without-your-dna", title: "Your Blood Lies Without Your DNA", why: "How I think about broken systems and what replaces them. Health as a case study.", theme: "Health Systems", time: "12 min" },
              { num: "03", slug: "energy-is-money-money-is-memory", title: "Energy Is Money. Money Is Memory.", why: "The physics underneath the AI buildout. Why this matters for everything.", theme: "AI & Energy", time: "10 min" },
              { num: "04", slug: "trust-us-are-you-really-my-friend", title: "Trust Us? Are You Really My Friend?", why: "The foundational idea behind everything I build. Only time buys trust.", theme: "Trust", time: "8 min" },
              { num: "05", slug: "greenberg-kurzweil-scientist-foundation-of-trust", title: "Rise of the Citizen-Scientist", why: "On stage with Kurzweil. Why verification matters more than credentials.", theme: "Technology", time: "7 min" },
              { num: "06", slug: "energy-as-impact", title: "Energy as Impact", why: "How I think about infrastructure as a moral act, not just a cost.", theme: "Impact", time: "6 min" },
              { num: "07", slug: "google-verizon-walled-garden-plan", title: "The Google/Verizon Walled Garden Plan", why: "From 2010. Still the most accurate prediction I ever made about the internet.", theme: "Infrastructure", time: "5 min" },
            ].map((essay, i) => (
              <a key={essay.slug} href={`/blog/${essay.slug}`}
                onClick={() => { try { (window as any).gtag?.("event", "start_here_article_click", { post_slug: essay.slug, position: i + 1 }); } catch {} }}
                style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr auto",
                  gap: "1rem",
                  alignItems: "start",
                  padding: "1rem 0.5rem",
                  borderTop: "1px solid rgba(139,105,20,0.1)",
                  transition: "background 0.15s",
                  borderRadius: "4px",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(139,105,20,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(139,105,20,0.4)", paddingTop: "0.2rem" }}>{essay.num}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#111", lineHeight: 1.3, marginBottom: "0.2rem" }}>{essay.title}</div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.83rem", color: "#666", lineHeight: 1.5 }}>{essay.why}</div>
                  </div>
                  <div style={{ textAlign: "right" as const, minWidth: "80px" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", opacity: 0.6, marginBottom: "0.2rem" }}>{essay.theme}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>{essay.time}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(139,105,20,0.1)" }}>
            <a href="/articles" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#8B6914", textDecoration: "none" }}>
              All 121 essays →
            </a>
          </div>
        </div>
      </div>

      {/* ── WHAT I'M THINKING NOW — one sentence, updated monthly ── */}
      <div style={{
        background: "#0A0A10",
        padding: "1.25rem clamp(1.5rem, 5vw, 4rem)",
        borderBottom: "1px solid rgba(212,185,106,0.08)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" as const }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(212,185,106,0.45)", flexShrink: 0 }}>Aug 2026</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "rgba(245,240,224,0.85)", fontStyle: "italic", lineHeight: 1.5, flex: 1 }}>
            "The most important political question of the next decade is not who controls the government. It is who controls the memory layer of AI — and whether that memory serves the person or the platform."
          </div>
          <a href="/blog/energy-is-money-money-is-memory" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4B96A", textDecoration: "none", flexShrink: 0, opacity: 0.7 }}>Read the essay →</a>
        </div>
      </div>


      {/* ── FOUR DOORS — Full-Bleed Image Tap Cards ── */}
      <div
        style={{
          background: "#0E0C09",
          position: "relative",
          isolation: "isolate",
          colorScheme: "light" as const,
        }}
      >
        {/* Section header */}
        <div style={{
          textAlign: "center",
          padding: "2.5rem 1rem 1.25rem",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
            letterSpacing: "0.22em", textTransform: "uppercase" as const,
            color: "rgba(212,185,106,0.55)", marginBottom: "0.45rem",
          }}>Four Doors</div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
            color: "#F5F0E6", fontWeight: 400,
          }}>Choose how you want to{" "}
            <em style={{ color: "#D4B96A", fontStyle: "italic" }}>begin</em>
          </div>
        </div>

        {/* 2×2 on mobile, 4-col on desktop — no gap, seamless grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2px",
          }}
          className="lg:!grid-cols-4"
        >
          {FOUR_DOORS_DATA.map((door) => (
            <button
              key={door.num}
              onClick={() => openDoor(door)}
              className="four-door-tap-card"
              style={{
                display: "block",
                position: "relative",
                overflow: "hidden",
                height: "220px",
                cursor: "pointer",
                border: "none",
                padding: 0,
                background: "none",
                width: "100%",
                textAlign: "left",
              }}
            >
              {/* Full-bleed image — using <img> so mobile Safari follows the storage proxy redirect */}
              <img
                src={door.img}
                alt={door.title}
                className="four-door-img"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  willChange: "transform",
                  display: "block",
                }}
              />
              {/* Bottom gradient — dark-to-transparent so text is always legible */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)",
              }} />
              {/* Text at bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "0.85rem 1rem 0.9rem",
                zIndex: 2,
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "rgba(212,185,106,0.75)",
                  marginBottom: "0.2rem",
                }}>{door.num}</div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  color: "#FAFAF7",
                  lineHeight: 1.15,
                  marginBottom: "0.25rem",
                  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                }}>{door.title}</div>
                <div style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.72rem",
                  color: "rgba(250,250,247,0.7)",
                  lineHeight: 1.35,
                  textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                }}>{door.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Four Doors modal */}
      <FourDoorsModal door={activeDoor} onClose={closeDoor} />

      <style>{`
        @keyframes gentleBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes bowlPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes bowlPulseInner {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes raysSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-70vh) translateX(var(--drift, 0px)); opacity: 0; }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .four-door-tap-card:hover .four-door-img {
          transform: scale(1.05) !important;
        }
        .four-door-tap-card:hover {
          opacity: 0.92;
        }
        .glass-work-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 32px rgba(139,105,20,0.1), 0 0 24px rgba(212,185,106,0.06), inset 0 1px 0 rgba(255,255,255,0.5) !important;
          border-color: rgba(212,185,106,0.35) !important;
        }
        .glass-work-card:hover .card-shimmer {
          animation: shimmerSlide 1.5s ease-in-out;
        }
        .glass-read-row:hover {
          background: rgba(212,185,106,0.06) !important;
          border-radius: 8px;
        }
        .glass-read-row:hover .read-num {
          text-shadow: 0 0 12px rgba(212,185,106,0.5);
        }
        .glow-cta:hover {
          box-shadow: 0 0 24px rgba(212,185,106,0.4), 0 0 48px rgba(212,185,106,0.15) !important;
          transform: translateY(-1px);
        }
        .glow-cta-outline:hover {
          background: rgba(212,185,106,0.08) !important;
          box-shadow: 0 0 20px rgba(212,185,106,0.15) !important;
          border-color: rgba(212,185,106,0.5) !important;
        }
      `}</style>

      {/* ── SOCIAL PROOF TICKER ── */}
      <SocialProofTicker />

      {/* ── WHAT THIS SITE IS — Hidden for cohesion (hero + Three Doors already communicate this) ── */}

      {/* ── FEATURED ESSAY — Primary prominence, full-width ── */}
      <div style={{
        background: "linear-gradient(180deg, #0A0A10 0%, #1A0A2E 100%)",
        padding: "3rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle radial glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,105,20,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "#D4B96A", display: "block", marginBottom: "0.4rem" }}>Featured Essay — July 2026</span>
            <div style={{ width: "40px", height: "2px", background: "#8B6914", margin: "0 auto" }} />
          </div>
          <Link href="/blog/when-healing-becomes-extraction" style={{ display: "block", textDecoration: "none" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "clamp(280px, 45%, 480px) 1fr",
              gap: "0",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(212,185,106,0.2)",
              boxShadow: "0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,185,106,0.08)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,185,106,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,185,106,0.08)"; }}
            >
              {/* Image panel */}
              <div style={{ position: "relative", minHeight: "360px", overflow: "hidden" }}>
                <img
                  src="/api/img/when-healing-hero_20e20251.jpg?w=600&q=85"
                  alt="When Healing Becomes Extraction"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.8)" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, rgba(10,10,16,0.7) 100%)" }} />
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, background: "rgba(139,105,20,0.9)", color: "#fff", padding: "0.3rem 0.6rem", borderRadius: "3px" }}>Open Letter</span>
                </div>
              </div>
              {/* Text panel */}
              <div style={{ background: "rgba(10,10,16,0.97)", padding: "2.5rem 2rem", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.75rem" }}>Harm Reduction · ImpactSoul</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#FAFAF7", lineHeight: 1.2, marginBottom: "1rem" }}>When Healing Becomes Extraction</h2>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "rgba(250,250,247,0.72)", lineHeight: 1.7, marginBottom: "1.5rem" }}>Tina Sodhi paid $2,000. She trusted a man with her life. The pharmacology was predictable. The outcome was not an accident. An open letter to Rick Doblin and the field that must say something now.</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(212,185,106,0.6)", letterSpacing: "0.06em" }}>July 2026</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(212,185,106,0.4)" }}>·</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(212,185,106,0.6)", letterSpacing: "0.06em" }}>22 min read</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(212,185,106,0.4)" }}>·</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(212,185,106,0.6)", letterSpacing: "0.06em" }}>Investor Disclosure Included</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D4B96A", fontWeight: 600 }}>Read the Letter</span>
                  <span style={{ color: "#D4B96A", fontSize: "1rem" }}>→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── THE TWO WAYS TO WORK WITH TONY — Glass-Morphism Cards ── */}
      <Section>
        <FadeIn>
          <Eyebrow>How Tony Works in the World</Eyebrow>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* The Amplifier — Glass Card */}
          <FadeIn delay={0.05}>
            <div
              className="glass-work-card jewel-door-card"
              style={{
                padding: "1.8rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(212,185,106,0.08) 0%, rgba(255,255,255,0.4) 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(212,185,106,0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 24px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer effect */}
              <div className="card-shimmer" style={{
                position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(212,185,106,0.06), transparent)",
                pointerEvents: "none",
              }} />
              {/* Gold top edge */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, transparent 5%, rgba(212,185,106,0.4) 50%, transparent 95%)",
              }} />
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  marginBottom: "0.6rem",
                  textShadow: "0 0 12px rgba(139,105,20,0.15)",
                }}
              >
                THE AMPLIFIER
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "0.6rem",
                  lineHeight: 1.3,
                }}
              >
                For companies already scaling who need the external layer no internal coach provides.
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#444", flex: 1, marginBottom: "1rem" }}>
                Tony opens rooms. You walk through them. Engagements begin with a scoping conversation.
              </p>
              <Link
                href="/amplifier"
                className="no-underline glow-cta"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#0A0A10",
                  background: "linear-gradient(135deg, #D4B96A, #C5A23C)",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  boxShadow: "0 0 16px rgba(212,185,106,0.2)",
                  transition: "all 0.3s",
                }}
              >
                Engagements begin with a scoping conversation →
              </Link>
            </div>
          </FadeIn>

          {/* The Diamond Cut — Glass Card */}
          <FadeIn delay={0.1}>
            <div
              className="glass-work-card jewel-door-card"
              style={{
                padding: "1.8rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.06)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 24px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer effect */}
              <div className="card-shimmer" style={{
                position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                pointerEvents: "none",
              }} />
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  marginBottom: "0.6rem",
                }}
              >
                THE DIAMOND CUT
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#0A0A10",
                  marginBottom: "0.6rem",
                  lineHeight: 1.3,
                }}
              >
                For services businesses sitting on unproductized expertise.
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#444", flex: 1, marginBottom: "1rem" }}>
                Tony finds the diamond. Together you cut it. Engagements begin with a scoping conversation.
              </p>
              <Link
                href="/diamond-cut"
                className="no-underline glow-cta-outline"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  border: "1px solid rgba(139,105,20,0.3)",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                Engagements begin with a scoping conversation →
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Shared note — glass pill */}
        <FadeIn delay={0.15}>
          <div style={{
            textAlign: "center", marginTop: "1.2rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "10px",
            padding: "1rem 1.5rem",
            border: "1px solid rgba(212,185,106,0.08)",
          }}>
            <p style={{ fontSize: "clamp(1.1rem, 2.3vw, 1.3rem)", lineHeight: 1.45, color: "#0A0A10", fontWeight: 800, marginBottom: "0.7rem", fontFamily: "'Playfair Display', serif", borderLeft: "4px solid #C5A23C", padding: "0.2rem 0 0.2rem 1rem", textWrap: "balance", textShadow: "0 1px 0 rgba(255,255,255,0.65)" }}>
              Both engagements include a handpicked vertical domain expert. Tony does not show up alone.
            </p>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#8B6914", fontWeight: 600, textShadow: "0 0 20px rgba(139,105,20,0.1)" }}>
              2X RETURN GUARANTEE — Do the work. Show the receipts. Get 2x back.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE INVESTMENT THESIS — Glass card ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The Investment Thesis</Eyebrow>
          <div style={{
            maxWidth: "680px", margin: "0 auto",
            background: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "1.5rem 2rem",
            border: "1px solid rgba(212,185,106,0.1)",
            boxShadow: "0 2px 16px rgba(139,105,20,0.03)",
          }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem" }}>
              ImpactSoul Asset-Backed Impact Tokens (ABITs) launch Q3 2026. Tokenizing cultural, regenerative, and natural assets that traditional capital markets cannot price.
            </p>
            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              className="glow-cta-outline"
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                border: "1px solid rgba(139,105,20,0.3)",
                padding: "0.6rem 1.4rem",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              Join the waitlist → impactsoul.is
            </a>
          </div>
        </FadeIn>
      </Section>


      {/* ── OPEN QUESTIONS — Humanize / Intellectual Vulnerability ── */}
      <div style={{
        background: "#F5F0E8",
        borderTop: "1px solid rgba(139,105,20,0.1)",
        borderBottom: "1px solid rgba(139,105,20,0.1)",
        padding: "2.5rem clamp(1.5rem, 5vw, 4rem)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1.5rem" }}>
            Still Figuring Out
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}>
            {[
              { q: "Was I wrong about blockchain?", note: "Wrote about it optimistically in 2018. The infrastructure thesis held. The governance thesis did not. Still deciding." },
              { q: "Can capital actually regenerate?", note: "ImpactSoul is the experiment. The hypothesis is that tokenized assets can fund restoration without extraction. The data is still coming in." },
              { q: "What does consciousness have to do with enterprise technology?", note: "This is the question that connects everything on this site. I don't have a clean answer. I have 25 years of circumstantial evidence." },
              { q: "Is psychedelic medicine being captured before it can heal?", note: "The Eli Lilly acquisition happened the same week Tina Sodhi died. I wrote about both. I don't know how the story ends." },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "1.25rem",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "4px",
                border: "1px solid rgba(139,105,20,0.08)",
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "#0A0A10", marginBottom: "0.5rem", lineHeight: 1.35 }}>{item.q}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

            {/* ── WHAT I BUILD — Project Taxonomy ── */}
      <Section>
        <FadeIn>
          <Eyebrow>What I Build</Eyebrow>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}>
              <a href="/ramprate" style={{ textDecoration: "none" }}>
                <div style={{ padding: "1.5rem", border: "1px solid rgba(139,105,20,0.12)", borderRadius: "8px", background: "rgba(250,250,247,0.6)", backdropFilter: "blur(8px)", transition: "all 0.25s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.3)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.12)"; el.style.transform = "translateY(0)"; }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem", opacity: 0.7 }}>Infrastructure</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: "0.4rem" }}>RampRate</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>The trust layer between buyers and sellers. $10B+ in transactions. 25 years. The intermediary that makes enterprise decisions defensible.</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#8B6914", marginTop: "0.75rem" }}>ramprate.com →</div>
                </div>
              </a>
              <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ padding: "1.5rem", border: "1px solid rgba(139,105,20,0.12)", borderRadius: "8px", background: "rgba(250,250,247,0.6)", backdropFilter: "blur(8px)", transition: "all 0.25s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.3)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.12)"; el.style.transform = "translateY(0)"; }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem", opacity: 0.7 }}>Impact Capital</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: "0.4rem" }}>ImpactSoul</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>A Certified B Corp tokenizing cultural, regenerative, and natural assets. ABITs: the financial instrument that prices what markets cannot see yet.</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#8B6914", marginTop: "0.75rem" }}>impactsoul.is →</div>
                </div>
              </a>

              <a href="/human-os" style={{ textDecoration: "none" }}>
                <div style={{ padding: "1.5rem", border: "1px solid rgba(139,105,20,0.12)", borderRadius: "8px", background: "rgba(250,250,247,0.6)", backdropFilter: "blur(8px)", transition: "all 0.25s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.3)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(139,105,20,0.12)"; el.style.transform = "translateY(0)"; }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.5rem", opacity: 0.7 }}>Operating System</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: "0.4rem" }}>Human OS 2.0</div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>The framework for upgrading how humans think, decide, and connect. Built on A Living Declaration — the foundational document for what comes after extraction.</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#8B6914", marginTop: "0.75rem" }}>Human OS 2.0 →</div>
                </div>
              </a>
            </div>
          </div>
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(139,105,20,0.08)" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#aaa" }}>
                Also active in:&nbsp;
                <a href="/psychedelic-readiness-index" style={{ color: "#8B6914", textDecoration: "none", opacity: 0.65 }}>Psychedelic Medicine</a>
                &nbsp;·&nbsp;
                <a href="/brewsoul" style={{ color: "#8B6914", textDecoration: "none", opacity: 0.65 }}>BrewSoul</a>
                &nbsp;·&nbsp;
                <a href="/ecosystem" style={{ color: "#8B6914", textDecoration: "none", opacity: 0.65 }}>Full Ecosystem →</a>
              </span>
            </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── MOST READ — Glass rows ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Most Read</Eyebrow>
        </FadeIn>

        <div style={{
          maxWidth: "680px", margin: "0 auto",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "12px",
          padding: "0.5rem 1rem",
          border: "1px solid rgba(212,185,106,0.08)",
        }}>
          {MOST_READ.map((item, i) => (
            <FadeIn key={item.num} delay={i * 0.04}>
              <Link
                href={item.slug}
                className="no-underline glass-read-row"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  padding: "0.8rem 0.5rem",
                  borderBottom: i < MOST_READ.length - 1 ? "1px solid rgba(212,185,106,0.08)" : "none",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                <span
                  className="read-num"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    color: "#D4B96A",
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                    transition: "text-shadow 0.3s",
                  }}
                >
                  {item.num}
                </span>
                <span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "#0A0A10",
                    }}
                  >
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        color: "#888",
                        marginLeft: "0.5rem",
                      }}
                    >
                      — {item.subtitle}
                    </span>
                  )}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── BREWSOUL INTELLIGENCE ── */}
      {/* BrewSoul is a fun tangent — positioned after the core authority sections */}
      <Section>
        <FadeIn>
          <Eyebrow>The Intelligence of Coffee</Eyebrow>
          <div style={{
            maxWidth: "680px", margin: "0 auto",
            background: "linear-gradient(135deg, rgba(111,78,55,0.06) 0%, rgba(255,255,255,0.35) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            padding: "1.5rem 2rem",
            border: "1px solid rgba(111,78,55,0.1)",
            boxShadow: "0 4px 20px rgba(111,78,55,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              103 coffees scored. 100 chains ranked. 6 identity archetypes. The most opinionated coffee intelligence platform on the internet — built on data, not vibes.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                href="/brewsoul"
                className="no-underline glow-cta"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "#fff",
                  background: "linear-gradient(135deg, #6F4E37, #A68B3C)",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  boxShadow: "0 0 16px rgba(111,78,55,0.15)",
                  transition: "all 0.3s",
                }}
              >
                Enter BrewSoul →
              </Link>
              <Link
                href="/brewsoul/chains"
                className="no-underline glow-cta-outline"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "#6F4E37",
                  border: "1px solid rgba(111,78,55,0.3)",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                Chain Rankings →
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── FOOTER MOTIF — Glowing ── */}
      <section
        className="noise-overlay"
        style={{
          background: "#0A0A10",
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow behind quote */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,185,106,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }} />

        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              color: "rgba(245,240,224,0.7)",
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: "500px",
              margin: "0 auto 1rem",
              fontStyle: "italic",
              position: "relative",
              textShadow: "0 0 30px rgba(212,185,106,0.15)",
            }}
          >
            "Only time buys trust.
            <br />
            The gold is in the cracks."
          </div>
          <p style={{ fontSize: "0.88rem", color: "rgba(245,240,224,0.5)", marginBottom: "0.3rem", position: "relative" }}>
            <a href="mailto:tony@impactsoul.is" style={{ color: "#D4B96A", textDecoration: "none", textShadow: "0 0 12px rgba(212,185,106,0.3)" }}>tony@impactsoul.is</a>
          </p>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              color: "rgba(245,240,224,0.3)",
              letterSpacing: "0.08em",
              position: "relative",
            }}
          >
            tonygreenberg.com &nbsp;·&nbsp; impactsoul.is &nbsp;·&nbsp; ramprate.com
          </p>
        </FadeIn>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <Section>
        <FadeIn>
          <EmailCapture source="homepage" />
        </FadeIn>
      </Section>
      <ReferralTracker />
    </div>
  );
}
