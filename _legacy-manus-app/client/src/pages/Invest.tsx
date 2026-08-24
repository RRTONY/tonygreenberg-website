/**
 * INVEST IN THE THESIS — v1.5 + Portfolio.
 * ABIT Waitlist + full investment portfolio display.
 * "Many more that can't be mentioned yet" teaser → Gate CTA.
 */

import { Section, FadeIn, Eyebrow, Divider, Spacer } from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";

const CATEGORIES = [
  {
    name: "Psychedelic Medicine",
    color: "#9B59B6",
    companies: [
      { name: "MycoMedica Life Sciences", role: "Investor", note: "Paul Stamets' patent portfolio company" },
      { name: "AtaiBeckley", role: "Investor", note: "Formerly Beckley Psytech" },
      { name: "Wake Network", role: "Investor", note: "" },
      { name: "Radicle Science", role: "Investor", note: "Proof-as-a-Service CRO for natural products" },
      { name: "Tripp", role: "Investor", note: "XR wellness — VR meditation & breathwork" },
    ],
  },
  {
    name: "Impact Venture & Finance",
    color: "#27AE60",
    companies: [
      { name: "Capria.VC", role: "LP", note: "India's top social impact fund — 1.2M people impacted" },
      { name: "Supernode Ventures", role: "LP", note: "Seed fund led by Laurel Touby" },
      { name: "Tacit Capital LLC", role: "Investor", note: "PE firm — post-disruption rebuilding" },
      { name: "Wavemaker Three-Sixty Health", role: "Investor", note: "Early-stage healthcare VC" },
      { name: "Belveron Partners Fund VI", role: "LP", note: "" },
      { name: "AngelsList The Fund LA I", role: "LP", note: "" },
      { name: "Akerna", role: "Advisor/Shareholder", note: "Exited" },
    ],
  },
  {
    name: "Web3, DAOs & Governance",
    color: "#3498DB",
    companies: [
      { name: "Tea", role: "Investor", note: "Equitable open-source for Web3" },
      { name: "Menagerie", role: "Investor/Advisor", note: "Build clubs, DAOs, nonprofits in Web3" },
      { name: "Vatom", role: "Partner", note: "Brand metaverse creation" },
      { name: "DEVxDAO", role: "Former Client", note: "Capital for decentralized projects" },
    ],
  },
  {
    name: "Blockchain Infrastructure",
    color: "#E67E22",
    companies: [
      { name: "Synternet", role: "Advisor/Investor", note: "Formerly NOIA Network — the Waze of internet congestion" },
      { name: "Block.one", role: "Investor", note: "Open-source software for transparency" },
      { name: "RAIR", role: "Investor", note: "NFT-based DRM & token-gated streaming" },
      { name: "WAX", role: "Investor", note: "High-throughput NFT & gaming chain" },
      { name: "Pynths", role: "Investor", note: "Cross-chain synthetic-asset protocol" },
      { name: "Nakji Network", role: "Investor", note: "Blockchain data indexing" },
    ],
  },
  {
    name: "Identity & Trust",
    color: "#1ABC9C",
    companies: [
      { name: "Yoti", role: "Partner", note: "Digital ID & age verification — 55% YoY revenue growth" },
      { name: "Bluenumber", role: "Partner", note: "Global identity for supply chains" },
    ],
  },
  {
    name: "Health & Wellness Tech",
    color: "#E74C3C",
    companies: [
      { name: "Hiro Technologies", role: "Investor", note: "Miki Agrawal — MycoDigestible diapers" },
      { name: "XR Workout", role: "Investor", note: "" },
    ],
  },
];

const TOTAL_VISIBLE = CATEGORIES.reduce((acc, c) => acc + c.companies.length, 0);

export default function Invest() {
  return (
    <div>
      <SEO
        title="Invest in the Thesis — Portfolio & ABIT Waitlist"
        description="35+ portfolio companies across psychedelic medicine, impact venture, Web3, blockchain, and health tech. ImpactSoul ABITs launch Q3 2026. If you can help any of these companies, enter The Gate."
        path="/invest"
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
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
            THE PORTFOLIO
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
            Invest in the Thesis
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(245,240,224,0.65)",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            {TOTAL_VISIBLE} companies you can see. Many more you can't — yet. If you can help any of them, there's a door at the bottom of this page.
          </p>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      {CATEGORIES.map((cat, ci) => (
        <div key={cat.name}>
          <Section>
            <FadeIn>
              <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <Eyebrow>{cat.name}</Eyebrow>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "0.8rem",
                  }}
                >
                  {cat.companies.map((co) => (
                    <div
                      key={co.name}
                      style={{
                        background: "#FAFAF7",
                        border: "1px solid rgba(139,105,20,0.12)",
                        borderRadius: "4px",
                        padding: "1rem 1.2rem",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(212,185,106,0.5)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(139,105,20,0.12)")
                      }
                    >
                      <div
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#111",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {co.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase" as const,
                          color: cat.color,
                          marginBottom: co.note ? "0.35rem" : 0,
                        }}
                      >
                        {co.role}
                      </div>
                      {co.note && (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            lineHeight: 1.5,
                            color: "#555",
                          }}
                        >
                          {co.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </Section>
          {ci < CATEGORIES.length - 1 && <Divider />}
        </div>
      ))}

      <Spacer />

      {/* ── THE ONES YOU CAN'T SEE YET ── */}
      <section
        style={{
          background: "linear-gradient(170deg, #0A0A10 0%, #111118 100%)",
          padding: "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                color: "#D4B96A",
                marginBottom: "1rem",
              }}
            >
              AND MANY MORE
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                fontWeight: 600,
                color: "#F5F0E0",
                lineHeight: 1.35,
                marginBottom: "1rem",
              }}
            >
              There are companies in this portfolio that can't be named yet. Stealth rounds. Pre-announcement partnerships. Deals in the corridor.
            </p>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "rgba(245,240,224,0.55)",
                marginBottom: "1.5rem",
              }}
            >
              If you have capital, connections, expertise, or distribution that could accelerate any company on this page — or if you suspect you might be useful to the ones you can't see — there's one way to find out.
            </p>
            <Link
              href="/engage"
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
              }}
            >
              ENTER THE GATE →
            </Link>
          </div>
        </FadeIn>
      </section>

      <Spacer />

      {/* ── ABIT WAITLIST ── */}
      <Section>
        <FadeIn>
          <Eyebrow>ImpactSoul — ABITs</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.75, color: "#222", marginBottom: "0.8rem", fontWeight: 600 }}>
              Asset-Backed Impact Tokens. Real assets. Real value. Tokenized.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              The assets that matter most — cultural, regenerative, natural — are the ones traditional capital markets cannot properly price. ImpactSoul is a Certified B Corporation fixing that. Every ABIT is backed by a real asset, structured for impact, and designed to compound regeneratively.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#555", marginBottom: "1rem" }}>
              Launching Q3 2026. Waitlist open now. No solicitation. No commitment. First position when the door opens.
            </p>
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <a
                href="https://impactsoul.is"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "#0A0A10",
                  background: "#D4B96A",
                  padding: "0.8rem 2.5rem",
                  borderRadius: "3px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                JOIN THE WAITLIST → IMPACTSOUL.IS
              </a>
              <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.6rem" }}>
                <a href="mailto:tony@impactsoul.is" style={{ color: "#8B6914", textDecoration: "none" }}>tony@impactsoul.is</a>
                {" "}for direct inquiries.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
