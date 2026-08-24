/*
 * DESIGN: "The Folio" — Ecosystem page
 * Network, partnerships, and how the pieces connect
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  HeroImage,
  NextPage,
  FadeIn,
  Pullquote,
  AdageStrip,
  Divider,
  Spacer,
} from "@/components/Editorial";
import { linkMap } from "@/data/linkMap";
import SEO from "@/components/SEO";

const HERO_ECO = "/api/img/theweb-orig_81d9b34b.jpg";

const clients = [
  "Microsoft", "Disney", "Goldman Sachs", "Nike", "Sony",
  "Warner Bros.", "NBCUniversal", "Verizon", "AT&T", "T-Mobile",
  "Salesforce", "Oracle", "SAP", "Dell Technologies", "HP",
  "Cisco", "IBM", "Accenture", "Deloitte", "PwC",
];

const partners = [
  { name: "MAPS / Rick Doblin", area: "Psychedelic Research" },
  { name: "B Lab", area: "B Corp Certification" },
  { name: "Ocean Cleanup Partners", area: "BEYOND Token Ecosystem" },
  { name: "Paleontological Research Institution", area: "REX Token Ecosystem" },
];

export default function TheWeb() {
  return (
    <div>
      <SEO title="The Web" description="Tony Greenberg's network — the clients, partners, and relationships built over 25 years. Disney, Microsoft, Goldman Sachs, Nike, and more." path="/the-web"
        indexable={true} />
      <HeroImage src={HERO_ECO} alt="Connected network of golden threads" />

      <Section>
        <FadeIn>
          <Eyebrow>The Network</Eyebrow>
          <SectionTitle>Ecosystem</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            The real value isn't in any single company — it's in the connections between them. Twenty-five years of building relationships across enterprise technology, psychedelic medicine, payments, social impact, and consumer advocacy has created an ecosystem where a single phone call can unlock years of trust-building.
          </p>
          <p style={{ color: "#222", marginBottom: "2rem" }}>
            The network effect applied to human relationships. Every new connection strengthens every existing one.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Pullquote>
            "I can cut out years of trust-building with a single phone call to activate important technologies that benefit society. That's not networking — that's infrastructure."
          </Pullquote>
        </FadeIn>

        <Divider />
        <Spacer />

        <FadeIn delay={0.15}>
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
            Select Clients & Relationships
          </h3>
          <div
            className="flex flex-wrap gap-3"
            style={{ marginBottom: "2.5rem" }}
          >
            {clients.map((client, i) => (
              linkMap[client] ? (
                <a
                  key={i}
                  href={linkMap[client]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "#333",
                    padding: "0.4rem 1rem",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "20px",
                    background: "rgba(247,243,234,0.5)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B6914"; e.currentTarget.style.color = "#8B6914"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.color = "#333"; }}
                >
                  {client}
                </a>
              ) : (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "#333",
                    padding: "0.4rem 1rem",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "20px",
                    background: "rgba(247,243,234,0.5)",
                  }}
                >
                  {client}
                </span>
              )
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
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
            Key Partnerships
          </h3>
          {partners.map((p, i) => (
            <div
              key={i}
              className="flex flex-wrap items-baseline gap-4"
              style={{
                padding: "1rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {p.name}
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
                {p.area}
              </span>
            </div>
          ))}
        </FadeIn>
      </Section>

      <AdageStrip
        adages={[
          { text: "\"The long-term success of powerful international clients — spanning 20+ years — is driven by wisdom, the power of discernment, and the strength of relationships.\"", attr: "— TG" },
          { text: "\"Half of success is just being in the room. The other half is knowing which room to be in.\"", attr: "— TG" },
        ]}
      />

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
              A network isn't a Rolodex. It's a living organism. The relationships that matter most are the ones where both sides get stronger over time — and the only way to build those is to show up consistently, for years, without keeping score.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/pick-up-the-phone" label="Pick Up the Phone" />
    </div>
  );
}
