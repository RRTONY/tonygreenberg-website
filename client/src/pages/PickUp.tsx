/*
 * DESIGN: "The Folio" — Connect page
 * Warm personal invitation → funnels to The Gate (/engage)
 * No phone number published. Scheduling only via The Gate.
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  FadeIn,
  Pullquote,
  Divider,
  Spacer,
} from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";

const socialLinks = [
  { label: "LinkedIn", url: "https://linkedin.com/in/tonygreenberg" },
  { label: "Linktree", url: "https://linktr.ee/TonyG2" },
  { label: "RampRate", url: "https://ramprate.com" },
  { label: "ImpactSoul", url: "https://impactsoul.is" },
  { label: "Blog", url: "https://tonygreenberg.com" },
];

const topics = [
  "Enterprise technology procurement & AI infrastructure",
  "Social impact tokenization & B Corp strategy",
  "Psychedelic medicine & consciousness research",
  "Payments infrastructure & stablecoin settlement",
  "Health & longevity protocols",
  "Consumer advocacy & regulatory investigations",
  "Decentralized identity & Web3 governance",
  "Speaking engagements & advisory roles",
];

export default function PickUp() {
  return (
    <div>
      <SEO title="Pick Up the Phone" description="Ready to work with Tony Greenberg? Seven out of ten don't qualify. Enter The Gate to find out if you do." path="/pick-up-the-phone"
        indexable={true} />
      <Section>
        <FadeIn>
          <Eyebrow>Let's Talk</Eyebrow>
          <SectionTitle>Connect</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.2rem", lineHeight: 1.75 }}>
            If something on this site resonated — or if you think we should be working together — I want to hear from you. But I don't take cold calls, and I don't take meetings without preparation. The best partnerships start with clarity, not small talk.
          </p>
          <p style={{ color: "#444", marginBottom: "1.5rem", lineHeight: 1.75, fontSize: "0.98rem" }}>
            Seven out of ten inquiries aren't the right fit. That's not arrogance — it's respect for your time and mine. The Gate is a five-question audit that ensures we're both clear on what you're building, why it matters, and whether this is the right partnership. Pass it, and you'll get the booking link. Make it compelling enough, and I might reach out to you first.
          </p>
        </FadeIn>

        {/* ── THE GATE CTA ── */}
        <FadeIn delay={0.1}>
          <div
            style={{
              background: "linear-gradient(135deg, #0A0A10 0%, #111118 100%)",
              padding: "2rem 2.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              border: "1px solid rgba(212,185,106,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#D4B96A",
                marginBottom: "0.8rem",
              }}
            >
              THE ENGAGEMENT AUDIT
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#F5F0E0",
                marginBottom: "0.8rem",
              }}
            >
              Ready to make your case?
            </div>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(245,240,224,0.6)",
                marginBottom: "1.5rem",
                maxWidth: "480px",
                margin: "0 auto 1.5rem",
                lineHeight: 1.65,
              }}
            >
              Five questions. No right answers — but there are wrong ones. Specificity, evidence of action, and clarity get you through.
            </p>
            <Link
              href="/engage"
              className="no-underline"
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#0A0A10",
                background: "#D4B96A",
                padding: "0.8rem 2.5rem",
                borderRadius: "3px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              ENTER THE GATE →
            </Link>
            <div style={{
              marginTop: "1.2rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              color: "#D4B96A",
              letterSpacing: "0.08em",
            }}>
              2× MONEY-BACK GUARANTEE — Do the work we specify. Document it. Zero results? Fee refunded, times two.
            </div>
          </div>
        </FadeIn>

        {/* ── CONTACT INFO (email only, no phone) ── */}
        <FadeIn delay={0.12}>
          <div
            style={{
              background: "rgba(10,10,16,0.03)",
              padding: "1.5rem 2rem",
              borderRadius: "6px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Email
                </span>
                <a
                  href="mailto:tony@impactsoul.is"
                  style={{
                    color: "#222",
                    textDecoration: "none",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1rem",
                    borderBottom: "1px solid rgba(139,105,20,0.3)",
                  }}
                >
                  tony@impactsoul.is
                </a>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Location
                </span>
                <span
                  style={{
                    color: "#222",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1rem",
                  }}
                >
                  Santa Monica, CA
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1rem",
            }}
          >
            What to Talk About
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem" }}>
            {topics.map((topic, i) => (
              <li
                key={i}
                style={{
                  padding: "0.5rem 0 0.5rem 1.2rem",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  color: "#222",
                  fontSize: "1rem",
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
                {topic}
              </li>
            ))}
          </ul>
        </FadeIn>

        <Divider />
        <Spacer />

        <FadeIn delay={0.2}>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1rem",
            }}
          >
            Find Me Online
          </h3>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  color: "#8B6914",
                  padding: "0.5rem 1.2rem",
                  border: "1px solid rgba(139,105,20,0.3)",
                  borderRadius: "20px",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </FadeIn>

        <Spacer />

        <FadeIn delay={0.25}>
          <Pullquote>
            The best conversations start with the right question. What's yours?
          </Pullquote>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.2rem 1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.4rem",
              }}
            >
              The Lesson
            </div>
            <p style={{ fontSize: "0.98rem", lineHeight: 1.75, color: "#222" }}>
              The conversation you're afraid to start is usually the one that matters most. But start it with clarity — know what you want, know why it matters, and know what you've already done about it. That's how you earn the meeting.
            </p>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
