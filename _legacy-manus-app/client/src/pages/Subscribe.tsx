/**
 * SUBSCRIBE — THE THROUGHLINE — v2.0 with Stripe.
 * Free newsletter + $99/yr paid membership + $27 essay compilation.
 * Design: "The Folio" editorial — dark hero, gold accents, parchment body.
 */

import { Section, FadeIn, Eyebrow, Divider, Spacer } from "@/components/Editorial";
import SEO from "@/components/SEO";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

export default function Subscribe() {
  return (
    <div>
      <SEO
        title="Subscribe — The Throughline"
        description="91 essays. 15 years. Zero algorithm. Subscribe to receive Tony Greenberg's essays directly — no social feed required, no platform between us."
        path="/subscribe"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section
        style={{
          background: "linear-gradient(170deg, #0A0A10 0%, #111118 60%, #1a1a24 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
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
            THE THROUGHLINE
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
            91 essays. 15 years.
            <br />
            <span style={{ color: "#D4B96A" }}>Zero algorithm.</span>
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
            Every essay is free. Always has been. Always will be. Subscribe to receive new essays directly — no social feed required, no platform between us.
          </p>
        </div>
      </section>

      {/* ── FREE SUBSCRIBE ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Free</Eyebrow>
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1.2rem" }}>
              New essays delivered directly to your inbox. No algorithm. No platform. Just the work.
            </p>
            <div
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#0A0A10",
                background: "#D4B96A",
                padding: "0.8rem 2.5rem",
                borderRadius: "3px",
                cursor: "pointer",
                opacity: 0.6,
              }}
            >
              SUBSCRIBE FREE → COMING SOON
            </div>
            <p style={{ fontSize: "0.78rem", color: "#888", marginTop: "0.6rem", fontStyle: "italic" }}>
              Beehiiv integration launching soon.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── PAID MEMBERSHIP ── */}
      <Section>
        <FadeIn>
          <Eyebrow>$99 / Year</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0A0A10",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Paid Membership
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              For readers who want more:
            </p>
            <div style={{ paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.3)" }}>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", marginBottom: "0.4rem" }}>
                Early access to all new essays
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", marginBottom: "0.4rem" }}>
                Quarterly Q&A with Tony
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", marginBottom: "0.4rem" }}>
                ImpactSoul deal flow briefings
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", marginBottom: "0.4rem" }}>
                Access to the compiled essay collections before public release
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", marginBottom: "0.4rem" }}>
                "Tip Me Off" community — submit injustices worth exposing
              </p>
            </div>
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <StripeCheckoutButton
                productKey="membership-yearly"
                label="JOIN — $99/YR"
                successPath="/payment-success"
                cancelPath="/subscribe"
              />
              <p style={{ fontSize: "0.78rem", color: "#888", marginTop: "0.6rem", fontStyle: "italic" }}>
                Includes full blog access and all premium content.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE ESSAY COMPILATION ── */}
      <Section>
        <FadeIn>
          <Eyebrow>$27</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0A0A10",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              The Essay Compilation
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem" }}>
              The top 25 essays compiled, sequenced, and annotated. The extractive economy explained. The regenerative alternative mapped.
            </p>
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <StripeCheckoutButton
                productKey="essay-compilation"
                label="BUY — $27"
                successPath="/payment-success"
                cancelPath="/subscribe"
                style={{ background: "#D4B96A", color: "#0A0A10" }}
              />
            </div>
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* ── FOOTER MOTIF ── */}
      <section
        style={{
          background: "#0A0A10",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              color: "rgba(245,240,224,0.6)",
              fontStyle: "italic",
              maxWidth: "400px",
              margin: "0 auto 0.8rem",
              lineHeight: 1.5,
            }}
          >
            "Only time buys trust."
          </div>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              color: "rgba(245,240,224,0.3)",
              letterSpacing: "0.08em",
            }}
          >
            tonygreenberg.com &nbsp;·&nbsp; impactsoul.is
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
