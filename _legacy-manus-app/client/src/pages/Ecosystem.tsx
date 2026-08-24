import {
  Section,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

export default function Ecosystem() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="The Ecosystem | Tony Greenberg"
        description="A curated network for people building what replaces what's broken."
        path="/ecosystem"
        indexable={true}
      />

      {/* ── HEADER ── */}
      <section style={{
        textAlign: "center",
        padding: "clamp(3.5rem, 7vh, 6rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 4vh, 3rem)",
        borderBottom: "1px solid rgba(139,105,20,0.08)",
      }}>
        <FadeIn>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8B6914",
            marginBottom: "0.8rem",
          }}>THE ECOSYSTEM</div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.15,
            marginBottom: "0.8rem",
          }}>
            The Ecosystem
          </h1>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
            color: "#666",
            lineHeight: 1.65,
            maxWidth: "580px",
            margin: "0 auto",
          }}>
            A curated network for people building what replaces what's broken.
          </p>
        </FadeIn>
      </section>

      {/* ── SECTION 1: WHAT IT IS ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.6rem",
            }}>WHAT IT IS</div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "1.2rem",
            }}>What It Is</h2>

            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "#444",
              lineHeight: 1.8,
              marginBottom: "1rem",
            }}>
              The Ecosystem is a curated network of builders, investors, and thought leaders working at the intersection of consciousness-aligned capital, regenerative economics, and systems change.
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "#444",
              lineHeight: 1.8,
            }}>
              This isn't a community — it's a collaboration engine. Members share deal flow, co-create ventures, and leverage collective expertise to accelerate projects that matter.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* ── SECTION 2: WHO IT'S FOR ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.6rem",
            }}>WHO IT'S FOR</div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "1.2rem",
            }}>Who It's For</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {[
                "Founders building regenerative businesses",
                "Investors allocating consciousness-aligned capital",
                "Operators seeking strategic partnerships in blockchain, psychedelics, or impact",
                "Advisors with deep domain expertise in emerging systems",
                "Anyone committed to building what replaces extractive systems",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    color: "#D4B96A",
                    marginTop: "0.2rem",
                    flexShrink: 0,
                  }}>•</div>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ── SECTION 3: WHAT MEMBERS RECEIVE ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.6rem",
            }}>WHAT MEMBERS RECEIVE</div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "1.2rem",
            }}>What Members Receive</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {[
                "Access to curated deal flow and co-investment opportunities",
                "Direct connection to Tony's network of 35+ portfolio companies",
                "Strategic introductions for partnerships and fundraising",
                "Quarterly gatherings for high-trust collaboration",
                "Early access to research, frameworks, and diagnostic tools",
                "Monthly office hours with Tony for decision support",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    color: "#D4B96A",
                    marginTop: "0.2rem",
                    flexShrink: 0,
                  }}>•</div>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "#444",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ── SINGLE CTA ── */}
      <section style={{
        textAlign: "center",
        padding: "clamp(2.5rem, 5vh, 4rem) clamp(1rem, 4vw, 3rem)",
        borderTop: "1px solid rgba(139,105,20,0.08)",
      }}>
        <FadeIn>
          <a
            href="mailto:tony@tonygreenberg.com?subject=Ecosystem%20—%20Request%20an%20Invitation"
            style={{
              display: "inline-block",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.92rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
              padding: "0.9rem 2.5rem",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            Request an Invitation
          </a>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.88rem",
            color: "#999",
            lineHeight: 1.6,
            maxWidth: "420px",
            margin: "1rem auto 0",
          }}>
            Membership is by invitation only. We review all requests within 5 business days.
          </p>
        </FadeIn>
      </section>

      <NextPage href="/find-my" label="Explore the Assessments" />
    </div>
  );
}
