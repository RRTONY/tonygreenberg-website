/*
 * DESIGN: "The Folio" — Health & Longevity page
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  Pullquote,
  HeroImage,
  NextPage,
  FadeIn,
  Divider,
  Spacer,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

const HERO_HEALTH = "/api/img/thebody-orig_0c05bc23.jpg";

const scorecard = [
  { dimension: "Efficacy", weight: "30%", desc: "Does it actually work? Measured by biomarkers, not feelings." },
  { dimension: "Cost", weight: "25%", desc: "Total cost including time, travel, and opportunity cost." },
  { dimension: "Time", weight: "20%", desc: "How long before measurable results appear?" },
  { dimension: "Safety", weight: "15%", desc: "Side effects, contraindications, long-term risks." },
  { dimension: "Access", weight: "10%", desc: "Can you actually get it? Legal, geographic, practical barriers." },
];

export default function TheBody() {
  return (
    <div>
      <SEO title="The Body" description="Tony Greenberg's health protocols, biometric tracking, peptide research, and measurement-driven wellness approach with Oura Ring data." path="/the-body"
        indexable={true} />
      <HeroImage src={HERO_HEALTH} alt="Wellness and longevity elements" />

      <Section>
        <FadeIn>
          <Eyebrow>Door 05 — Deep Dive</Eyebrow>
          <SectionTitle>Health & Longevity</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            Not biohacking vanity. Measurement-driven wellness with accountability built in. Years of testing every modality I can find — peptides, exosomes, regenerative medicine, breathwork, cold exposure, psychedelic-assisted therapy — each scored on a rigorous five-dimension framework.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111",
              margin: "2.5rem 0 1rem",
            }}
          >
            The Alt Therapy Scorecard
          </h3>
          <p style={{ color: "#222", marginBottom: "1.5rem", fontSize: "1.05rem" }}>
            Every therapy I test gets scored on five dimensions, weighted by importance. Oura Ring biometrics provide the baseline data. Here's the framework:
          </p>

          <div
            style={{
              border: "1px solid rgba(139,105,20,0.15)",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            {scorecard.map((row, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-4"
                style={{
                  padding: "1.2rem 1.5rem",
                  borderBottom: i < scorecard.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  background: i % 2 === 0 ? "rgba(247,243,234,0.5)" : "transparent",
                }}
              >
                <div style={{ minWidth: "120px" }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      color: "#111",
                      fontSize: "1rem",
                    }}
                  >
                    {row.dimension}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#8B6914",
                      fontWeight: 700,
                      marginRight: "1rem",
                    }}
                  >
                    {row.weight}
                  </span>
                  <span style={{ color: "#333", fontSize: "1rem" }}>{row.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Pullquote>
            Best-in-world peptide manufacturing partnerships. Provider connections across every modality I've tested. Hedonic engineering applied to the body — not vanity metrics, but real measurement with real accountability.
          </Pullquote>
        </FadeIn>

        <Divider />
        <Spacer />

        <FadeIn delay={0.2}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111",
              margin: "0 0 1rem",
            }}
          >
            Current Protocols
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Peptide therapy — BPC-157, Thymosin Alpha-1, GHK-Cu",
              "Exosome therapy — regenerative medicine applications",
              "Oura Ring biometric tracking — sleep, HRV, readiness scores",
              "Breathwork — Wim Hof method, holotropic variations",
              "Cold exposure — structured cold plunge protocols",
              "Psychedelic-assisted therapy — supervised, clinical settings",
              "Functional medicine — comprehensive blood panels quarterly",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  padding: "0.6rem 0 0.6rem 1.2rem",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  color: "#222",
                  fontSize: "1.05rem",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "#D4B96A",
                    fontWeight: 700,
                  }}
                >
                  ›
                </span>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.5rem",
              }}
            >
              The Lesson
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#222" }}>
              The body doesn't lie, but feelings do. The only wellness protocol worth following is one that submits to measurement. If you can't track it, you can't trust it — and the gap between what feels good and what is good is where most people get lost.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111",
              margin: "0 0 1rem",
            }}
          >
            Peptide Research Tools
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            {[
              { href: "/peptide-supply-chain", label: "Supply Chain Transparency", desc: "Where does your peptide dollar actually go?" },
              { href: "/peptide-hall-of-shame", label: "Provider Assessment Audit", desc: "Which clinics ask the right questions?" },
              { href: "/peptide-matrix", label: "Review vs Evidence Matrix", desc: "5-star reviews ≠ FDA-approved efficacy" },
              { href: "/supplier-intake", label: "Become a Supply Partner", desc: "Join our vetted manufacturing network" },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                style={{
                  display: "block",
                  padding: "1.2rem",
                  border: "1px solid rgba(139,105,20,0.15)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  background: "rgba(212,185,106,0.03)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.4)"; e.currentTarget.style.background = "rgba(212,185,106,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,105,20,0.15)"; e.currentTarget.style.background = "rgba(212,185,106,0.03)"; }}
              >
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#8B6914", margin: "0 0 0.3rem", textTransform: "uppercase" }}>{tool.label}</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", margin: 0 }}>{tool.desc}</p>
              </a>
            ))}
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/the-nightstand" label="Continue to The Nightstand" />
    </div>
  );
}
