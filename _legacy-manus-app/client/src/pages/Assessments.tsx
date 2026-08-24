import { Section, Divider, FadeIn, Eyebrow } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker from "@/components/JourneyTracker";

const ASSESSMENTS = [
  {
    slug: "dharma-finder",
    title: "The Dharma Finder",
    subtitle: "Inspired by Daniel Schmachtenberger",
    description: "Twenty-five questions distilled from Schmachtenberger's Dharma Inquiry — a framework for discovering your unique purpose, the intersection of your gifts and the world's needs. Not what you should do. What you can't not do.",
    time: "15–20 min",
    icon: "◎",
    accent: "#8B6914",
  },
  {
    slug: "consciousness-scale",
    title: "The Consciousness Scale",
    subtitle: "Based on David R. Hawkins' Map of Consciousness",
    description: "Where do you currently sit on the spectrum from Shame to Enlightenment? Twenty-five questions that map your dominant energy field across Hawkins' calibrated levels. Not a judgment — a compass.",
    time: "15–20 min",
    icon: "△",
    accent: "#6B4C8A",
  },
  {
    slug: "grant-study",
    title: "The Grant Study Assessment",
    subtitle: "Based on 85 Years of Harvard Research",
    description: "The longest study of human happiness ever conducted. Five factors predict lifelong wellbeing: relationships, adaptive coping, generativity, career satisfaction, and physical vitality. This assessment maps where you stand on each.",
    time: "15–20 min",
    icon: "♡",
    accent: "#2E8B57",
  },
];

export default function Assessments() {
  return (
    <>
      <SEO
        title="Self-Assessment Tools — Tony Greenberg"
        description="23 research-backed assessments to map your identity, purpose, and spirit. Find Your Me, SoulScore, and more."
        keywords="personality assessment, find your me, soulscore, self assessment, identity quiz, purpose finder, Tony Greenberg"
        path="/assessments"
        image="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/og-assessments-AUxeFWUhMQsVqn5dNbzGoq.png"
        indexable={true}
      />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>

        {/* ── HERO: 120px+ top padding, clear hierarchy ── */}
        <div style={{
          background: "#0A0A10",
          padding: "clamp(7.5rem, 12vw, 10rem) 0 clamp(4rem, 6vw, 6rem)",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <FadeIn>
              <Eyebrow>Know Thyself</Eyebrow>

              {/* H1: dominant, clear step above H2 */}
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: 400,
                color: "#FAFAF7",
                lineHeight: 1.15,
                marginBottom: "1.5rem",
              }}>
                Three Maps.<br />
                <span style={{ color: "#D4B96A" }}>One Journey.</span>
              </h1>

              {/* Body: max 680px for 60-75 char line length */}
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.05rem",
                color: "#999",
                lineHeight: 1.8,
                maxWidth: "680px",
              }}>
                Purpose. Consciousness. Satisfaction. Three dimensions of a life well-lived, measured by three of the most rigorous frameworks ever developed. Each takes 15–20 minutes. Together, they create a portrait of where you are — and where you're being called.
              </p>

              {/* Primary CTA in hero with 2x breathing room */}
              <div style={{ marginTop: "3rem" }}>
                <Link href={`/assessments/${ASSESSMENTS[0].slug}`}>
                  <span style={{
                    display: "inline-block",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "1rem 2.5rem",
                    background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}>
                    Begin Your First Assessment →
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── ASSESSMENT CARDS: Section-level 64-96px spacing ── */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(4rem, 6vw, 6rem) 2rem",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {ASSESSMENTS.map((a, i) => (
              <FadeIn key={a.slug}>
                <Link href={`/assessments/${a.slug}`}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "2rem",
                      alignItems: "center",
                      padding: "2.5rem 2rem",
                      background: "#fff",
                      border: "1px solid #e5e0d5",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = a.accent;
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${a.accent}15`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#e5e0d5";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: "64px",
                      height: "64px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      color: a.accent,
                      border: `1px solid ${a.accent}33`,
                      borderRadius: "2px",
                    }}>
                      {a.icon}
                    </div>

                    {/* Content */}
                    <div>
                      {/* Eyebrow: standardized 0.72rem */}
                      <p style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        letterSpacing: "0.2em",
                        color: a.accent,
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}>
                        {a.subtitle}
                      </p>
                      {/* H3: clear step below H1/H2 */}
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.4rem",
                        fontWeight: 400,
                        color: "#0A0A10",
                        marginBottom: "0.75rem",
                      }}>
                        {a.title}
                      </h3>
                      {/* Body: standardized 1.05rem */}
                      <p style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1.05rem",
                        color: "#666",
                        lineHeight: 1.7,
                        maxWidth: "680px",
                      }}>
                        {a.description}
                      </p>
                    </div>

                    {/* Right: time + CTA */}
                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <p style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#999",
                        letterSpacing: "0.1em",
                        marginBottom: "0.75rem",
                      }}>
                        {a.time}
                      </p>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.85rem",
                        color: a.accent,
                        display: "inline-block",
                        fontWeight: 600,
                      }}>
                        Begin →
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* ── JOURNEY TRACKER: Section-level spacing ── */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(2rem, 4vw, 4rem) 2rem clamp(4rem, 6vw, 6rem)",
        }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <JourneyTracker variant="light" />
          </div>
        </div>

        {/* ── TONY'S NOTE: Section-level spacing with clear entry/exit ── */}
        <div style={{
          borderTop: "1px solid #e5e0d5",
          borderBottom: "1px solid #e5e0d5",
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "clamp(4rem, 6vw, 6rem) 2rem",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#8B6914",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}>
              Why These Three
            </p>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "#444",
              lineHeight: 1.8,
              maxWidth: "680px",
            }}>
              I've spent twenty-five years in rooms where people are trying to figure out what matters. What I've learned: you need three coordinates to locate yourself. <strong>Purpose</strong> tells you what you're here to do (Schmachtenberger). <strong>Consciousness</strong> tells you from what level you're doing it (Hawkins). <strong>Satisfaction</strong> tells you whether the life you've built actually sustains you (Harvard Grant Study). Together, they're a triangulation of the soul.
            </p>
          </div>
        </div>

        {/* ── FOOTER: Reduced visual weight, consistent spacing ── */}
        <div style={{
          textAlign: "center",
          padding: "clamp(2rem, 4vw, 3rem) 2rem",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "#aaa",
            letterSpacing: "0.1em",
          }}>
            All assessments are free · Results saved for your return · Curated by Tony Greenberg
          </p>
        </div>
      </div>
    </>
  );
}
