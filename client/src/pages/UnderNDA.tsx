/*
 * DESIGN: "The Folio" — The Corridor (Payments) page
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  Pullquote,
  NextPage,
  FadeIn,
  InlineQuote,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

export default function UnderNDA() {
  return (
    <div>
      <SEO title="Under NDA" description="The deals, partnerships, and projects Tony Greenberg can't talk about yet. What's behind the curtain and why it matters." path="/under-nda" />
      <Section>
        <FadeIn>
          <Eyebrow>Door 04 — Deep Dive</Eyebrow>
          <SectionTitle>The Corridor</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            Four payment processing companies through what we call "the corridor" — a payments infrastructure play at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance.
          </p>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            The corridor handles transactions across gaming, healthcare, and enterprise commerce. Details under NDA. The opportunity is measured in billions. We hold the relationships on both sides of the bridge between traditional rails and blockchain settlement.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Pullquote>
            The future of payments isn't crypto OR traditional rails. It's the bridge between them. We're not betting on one side — we're building the infrastructure that makes both sides work together.
          </Pullquote>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111",
              margin: "2.5rem 0 1rem",
            }}
          >
            What We're Building
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Traditional card processing optimization across multiple verticals",
              "Stablecoin settlement infrastructure for enterprise-scale transactions",
              "Cross-border remittance corridors with regulatory compliance built in",
              "Gaming payment solutions with fraud prevention and chargeback management",
              "Healthcare payment processing with HIPAA-compliant data handling",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  padding: "0.8rem 0 0.8rem 1.2rem",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  color: "#222",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
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

        <FadeIn delay={0.2}>
          <InlineQuote attr="— TG">
            "The payments space is where the real infrastructure of the future economy is being built. Not in flashy consumer apps — in the plumbing. We're plumbers. Very well-connected plumbers."
          </InlineQuote>
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
              The most valuable infrastructure is invisible. The companies that will define the next decade of finance aren't building consumer apps — they're building the plumbing that every consumer app will eventually depend on.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/the-body" label="Continue to The Body" />
    </div>
  );
}
