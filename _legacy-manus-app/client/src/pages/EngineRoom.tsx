/*
 * DESIGN: "The Folio" — Projects & Ventures page
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  NextPage,
  FadeIn,
  Divider,
  Spacer,
  InlineQuote,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import SEO from "@/components/SEO";

const ventures = [
  {
    name: "RampRate",
    role: "CEO & Founder",
    years: "2000–Present",
    desc: "Enterprise technology advisory. $10B+ benchmarked. SPY Index with 1M+ data points. Microsoft, Disney, Goldman Sachs, Nike. The objective lever in enterprise IT procurement.",
    url: "https://ramprate.com",
  },
  {
    name: "ImpactSoul",
    role: "Founder",
    years: "2021–Present",
    desc: "Certified B Corp. Tokenizing high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems: BEYOND, REX, SPACE, BEING.",
    url: "https://impactsoul.is",
  },
  {
    name: "Menagerie",
    role: "Co-Founder",
    years: "2023–Present",
    desc: "Creative studio and venture builder. Where the weird ideas get built — the cross-pollination engine for everything else.",
  },
  {
    name: "MycoMedica Life Sciences",
    role: "Investor",
    years: "2019–Present",
    desc: "Psychedelic medicine research and development. Psilocybin therapeutics and mycological science.",
  },
  {
    name: "The Corridor (Payments)",
    role: "Strategic Advisor",
    years: "2022–Present",
    desc: "Four payment processing companies at the intersection of traditional card processing, stablecoin settlement, and cross-border remittance. Details under NDA.",
  },
  {
    name: "Homeaglow Exposed",
    role: "Investigator & Publisher",
    years: "2023–Present",
    desc: "Consumer advocacy investigation. Dark patterns, fake reviews, exploited workers. Filed with CA Attorney General and FTC.",
    url: "https://homeaglowexposed.com",
  },
];

const investments = [
  { name: "AtaiBeckley", sector: "Psychedelic Medicine", note: "FDA Breakthrough Therapy designation" },
  { name: "Wake Network", sector: "Psychedelic Medicine", note: "Psychedelic wellness network" },
  { name: "Radicle Science", sector: "Clinical Research", note: "Decentralized clinical trials" },
  { name: "Tripp", sector: "Digital Therapeutics", note: "VR-based psychedelic experiences" },
];

export default function EngineRoom() {
  return (
    <div>
      <SEO title="The Engine Room" description="The operational infrastructure behind Tony Greenberg's work. How the companies and causes connect, the team that runs them, and the systems that make it work." path="/engine-room"
        indexable={true} />
      <Section>
        <FadeIn>
          <Eyebrow>The Work</Eyebrow>
          <SectionTitle>Projects & Ventures</SectionTitle>
          <p style={{ color: "#222", marginBottom: "2rem" }}>
            Every company and cause I'm involved with gets my network, my time, and my obsessive attention to detail. Here's what's currently active.
          </p>
        </FadeIn>

        <FadeIn>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1.5rem",
              marginTop: "2rem",
            }}
          >
            Active Ventures
          </h3>
        </FadeIn>

        {ventures.map((v, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              style={{
                padding: "2rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  {v.url ? (
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#111", textDecoration: "none", borderBottom: "1px solid #D4B96A" }}
                    >
                      {v.name}
                    </a>
                  ) : (
                    v.name
                  )}
                </h4>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    color: "#8B6914",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {v.role}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    color: "#999",
                  }}
                >
                  {v.years}
                </span>
              </div>
              <p style={{ color: "#333", fontSize: "1.05rem", lineHeight: 1.8 }}>
                <AutoLinkedText>{v.desc}</AutoLinkedText>
              </p>
            </div>
          </FadeIn>
        ))}

        <Divider />
        <Spacer />

        <FadeIn>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1.5rem",
            }}
          >
            Active Engagements
          </h3>
        </FadeIn>

        <div style={{ display: "grid", gap: "1px" }}>
          {investments.map((inv, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <div
                className="flex flex-wrap items-baseline gap-4"
                style={{
                  padding: "1.2rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111",
                    minWidth: "160px",
                  }}
                >
                  {inv.name}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    color: "#8B6914",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {inv.sector}
                </span>
                <span style={{ color: "#555", fontSize: "1.05rem" }}>
                  {inv.note}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <InlineQuote attr="— TG">
            "We never stop building. The work connects — enterprise technology informs the impact models, the consciousness research sharpens the ethics, and the consumer advocacy keeps everyone honest."
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
              The work isn't a collection of bets. It's a system. The ventures that survive are the ones where network, attention, and conviction are non-negotiable inputs — not optional extras.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/under-nda" label="Continue to Under NDA" />
    </div>
  );
}
