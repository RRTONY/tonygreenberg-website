/**
 * THE AMPLIFIER — v1.5 exact copy.
 * For companies already scaling who need the external layer no internal coach provides.
 * Tony opens rooms. You walk through them.
 * Design: "The Folio" editorial — dark hero, gold accents, parchment body.
 */

import { Section, FadeIn, Eyebrow, SectionTitle, Divider, Spacer, Pullquote } from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";

const PILLARS = [
  {
    num: "01",
    title: "Network Activation",
    desc: "25 years of Fortune 50 relationships mapped to your specific growth problem. Microsoft. Disney. Goldman Sachs. Nike. And hundreds more.",
  },
  {
    num: "02",
    title: "Vendor Intelligence",
    desc: "RampRate's SPY Index: 1M+ datapoints on what Fortune 500 companies actually pay vs. what they should. If you have a technology stack, Tony will tell you exactly where you are being extracted from — and by how much. Most clients find 20–40% cost reduction before the session ends.",
  },
  {
    num: "03",
    title: "Capital Pattern Recognition",
    desc: "35+ portfolio companies across blockchain, psychedelic medicine, regenerative real estate, cultural asset tokenization. Tony identifies capital misalignment faster than any operating coach — because he has seen where money actually goes.",
  },
  {
    num: "04",
    title: "Regenerative Business Stress Test",
    desc: "Every business is either extractive or regenerative. Tony will tell you which one yours is — and what it costs you to stay extractive. This is not a values conversation. It is a survival conversation.",
  },
  {
    num: "05",
    title: "ImpactSoul Alignment",
    desc: "If your venture intersects with cultural assets, regenerative real estate, natural resources, or conscious capital — Tony evaluates fit with ImpactSoul's ABIT program. Launching Q3 2026.",
  },
];

const TIERS = [
  {
    tier: "Diagnostic",
    price: "$5,000",
    note: "floor",
    details: ["Donate true value after.", "Full pattern match.", "One network activation.", "One vendor benchmark."],
    cta: "ENTER THE GATE →",
    href: "/engage",
    featured: false,
  },
  {
    tier: "Half-Day Briefing",
    price: "$10,000",
    note: "floor",
    details: ["Deep diagnostic.", "Written output.", "3 targeted introductions."],
    cta: "ENTER THE GATE →",
    href: "/engage",
    featured: true,
  },
  {
    tier: "Monthly Amplifier",
    price: "$15,000–$25,000",
    note: "per month",
    details: ["Continuous BD activation.", "Deal flow access.", "ImpactSoul pipeline visibility."],
    cta: "ENTER THE GATE →",
    href: "/engage",
    featured: false,
  },
  {
    tier: "Board / Advisory",
    price: "Equity + Cash",
    note: "contact directly",
    details: ["Full strategic alignment.", "Board-level engagement.", "Contact directly."],
    cta: "MAKE YOUR CASE →",
    href: "mailto:tony@impactsoul.is?subject=Board%20/%20Advisory%20Inquiry",
    featured: false,
  },
];

const WONT_DO = [
  "Sign NDAs before a first conversation",
  "Review decks over 10 slides without a paid engagement in place",
  "Take equity-only from undercapitalized ventures",
  "Validate ideas he believes are extractive",
  "Send follow-up summary emails (that is what Fireflies is for)",
];

export default function Amplifier() {
  return (
    <div>
      <SEO
        title="The Amplifier — Networked Advisory"
        description="For companies already scaling who need the external layer no internal coach provides. Tony opens rooms. You walk through them. Engagements begin with a scoping conversation."
        path="/amplifier"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section
        style={{
          background: "linear-gradient(170deg, #0A0A10 0%, #111118 60%, #1a1a24 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "1.2rem",
            }}
          >
            THE AMPLIFIER
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#F5F0E0",
              lineHeight: 1.15,
              marginBottom: "1.2rem",
            }}
          >
            Matt builds the CEO.
            <br />
            <span style={{ color: "#D4B96A" }}>I expand the arena the CEO gets to play in.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(245,240,224,0.65)",
              maxWidth: "560px",
              margin: "0 auto 1rem",
            }}
          >
            If you can get both — get both.
          </p>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(245,240,224,0.45)",
              letterSpacing: "0.08em",
            }}
          >
            Engagements begin with a scoping conversation · tony@impactsoul.is
          </div>
        </div>
      </section>

      {/* ── A PERSONAL NOTE ON MATT MOCHARY ── */}
      <Section>
        <FadeIn>
          <Eyebrow>A Personal Note on Matt Mochary</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              I have known{" "}
              <a
                href="https://mochary.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)" }}
              >
                Matt Mochary
              </a>{" "}
              for 25 years. He was my neighbor in Kauai. I have been coached by him personally. I love him like a brother.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              His honor and integrity are above almost anyone I have encountered in 25 years across hundreds of companies. What he has built — becoming genuinely the best in the world at what he does — I hold in complete awe.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem", fontWeight: 600 }}>
              Follow his method to the letter. Not selectively. To the letter. Then call me.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#555", fontStyle: "italic" }}>
              He probably just thinks I am a funny guy. I will take it. I am just glad he lets me make him laugh.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── WHAT THE AMPLIFIER IS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>What The Amplifier Is</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              Matt Mochary builds your internal operating system. What he does not — and cannot — provide is the external surface:
            </p>
            <div style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
              {[
                "The room you have not been in yet.",
                "The vendor benchmark that proves you are overpaying by 30–60%.",
                "The capital pattern that tells you why your raise is structured wrong.",
                "The introduction that changes everything.",
              ].map((line, i) => (
                <p key={i} style={{ fontSize: "1rem", lineHeight: 1.75, color: "#333", marginBottom: "0.4rem" }}>
                  {line}
                </p>
              ))}
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", fontWeight: 600 }}>
              That is The Amplifier.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE UNFAIR ADVANTAGE ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The Unfair Advantage</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem", fontWeight: 600 }}>
              Tony does not show up alone.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              Every Amplifier engagement includes:
            </p>
            <div style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
              {[
                "Tony's 12-person core team",
                "Hundreds of vetted specialist resources",
                "One handpicked domain expert from your specific vertical — someone Tony has a deep personal relationship with, built on a value exchange model",
              ].map((line, i) => (
                <p key={i} style={{ fontSize: "1rem", lineHeight: 1.75, color: "#333", marginBottom: "0.4rem" }}>
                  — {line}
                </p>
              ))}
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem" }}>
              This is not a referral. Not a warm intro on LinkedIn. Your vertical expert shows up invested.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#555", fontStyle: "italic" }}>
              Very few people in the world can convene a room this way.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── FIVE PILLARS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The 5 Pillars</Eyebrow>
        </FadeIn>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {PILLARS.map((p, i) => (
            <FadeIn key={p.num} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.2rem 0",
                  borderBottom: i < PILLARS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      color: "#D4B96A",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      paddingTop: "0.2rem",
                    }}
                  >
                    {p.num}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#0A0A10",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", margin: 0 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── THE 2X GUARANTEE ── */}
      <Section>
        <FadeIn>
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              padding: "1.5rem 2rem",
              background: "rgba(212,185,106,0.06)",
              border: "1px solid rgba(212,185,106,0.2)",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.6rem",
              }}
            >
              THE 2× GUARANTEE
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem", fontWeight: 600 }}>
              Do the work. Show the receipts. Get 2x back — or Tony keeps working until you do.
            </p>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#555", margin: 0 }}>
              Proof of work = completed preparation document + all session action items documented in writing. No proof, no guarantee. Simple.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── TIERS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Tiers</Eyebrow>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {TIERS.map((t, i) => (
            <FadeIn key={t.tier} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "6px",
                  border: t.featured
                    ? "1px solid rgba(212,185,106,0.4)"
                    : "1px solid rgba(0,0,0,0.06)",
                  background: t.featured
                    ? "linear-gradient(135deg, rgba(212,185,106,0.06) 0%, rgba(139,105,20,0.03) 100%)"
                    : "#fff",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column" as const,
                  height: "100%",
                }}
              >
                {t.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.5rem",
                      right: "1rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase" as const,
                      color: "#fff",
                      background: "#8B6914",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t.tier}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#0A0A10",
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      color: "#888",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {t.note}
                  </span>
                </div>
                <div style={{ flex: 1, marginBottom: "1rem" }}>
                  {t.details.map((d, j) => (
                    <p key={j} style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "#444", marginBottom: "0.2rem" }}>
                      {d}
                    </p>
                  ))}
                </div>
                {t.href.startsWith("/") ? (
                  <Link
                    href={t.href}
                    className="no-underline"
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: t.featured ? "#0A0A10" : "#8B6914",
                      background: t.featured ? "#D4B96A" : "transparent",
                      border: t.featured ? "none" : "1px solid rgba(139,105,20,0.3)",
                      padding: "0.7rem 1.5rem",
                      borderRadius: "3px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.cta}
                  </Link>
                ) : (
                  <a
                    href={t.href}
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
                      borderRadius: "3px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.cta}
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── HOW TO PREPARE ── */}
      <Section>
        <FadeIn>
          <Eyebrow>How to Prepare</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              Complete the preparation document and send to{" "}
              <a href="mailto:tony@impactsoul.is" style={{ color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)" }}>
                tony@impactsoul.is
              </a>{" "}
              48 hours before your session.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#333", marginBottom: "0.6rem" }}>
              The document asks you to quantify:
            </p>
            <div style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
              {[
                "The single decision worth the most if you get it right",
                "The dollar value of that decision",
                "The door you need opened and what you offer in return",
                "What you would do if this conversation did not exist",
              ].map((line, i) => (
                <p key={i} style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#444", marginBottom: "0.3rem" }}>
                  — {line}
                </p>
              ))}
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem", fontWeight: 600 }}>
              Vague questions produce general answers. Specific high-stakes questions produce specific high-value answers.
            </p>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#555", fontStyle: "italic" }}>
              All sessions recorded via Fireflies. Transcript delivered within 24 hours.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── WHAT TONY WILL NOT DO ── */}
      <Section>
        <FadeIn>
          <Eyebrow>What Tony Will Not Do</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            {WONT_DO.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  alignItems: "flex-start",
                  padding: "0.5rem 0",
                  borderBottom: i < WONT_DO.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                }}
              >
                <span style={{ color: "#c44", fontSize: "0.9rem", flexShrink: 0 }}>—</span>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* ── BOOK ── */}
      <section
        style={{
          background: "#0A0A10",
          padding: "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "0.8rem",
            }}
          >
            BOOK
          </div>
          <p style={{ fontSize: "1rem", color: "rgba(245,240,224,0.7)", marginBottom: "0.6rem" }}>
            <a href="mailto:tony@impactsoul.is" style={{ color: "#D4B96A", textDecoration: "none" }}>tony@impactsoul.is</a>
          </p>
          <Link
            href="/engage"
            className="no-underline"
            style={{
              display: "inline-block",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#0A0A10",
              background: "#D4B96A",
              padding: "0.9rem 3rem",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "all 0.2s",
              marginBottom: "0.8rem",
            }}
          >
            ENTER THE GATE →
          </Link>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(245,240,224,0.35)",
              letterSpacing: "0.08em",
              marginTop: "0.5rem",
            }}
          >
            $5,000 MINIMUM · PREPARATION DOC REQUIRED · ALL SESSIONS RECORDED VIA FIREFLIES
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
