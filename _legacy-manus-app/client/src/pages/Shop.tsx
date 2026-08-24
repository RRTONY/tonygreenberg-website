/**
 * SHOP — Essay IP products (Stripe) + Living Well affiliates.
 */

import { Section, FadeIn, Eyebrow, SectionTitle, Divider, Pullquote } from "@/components/Editorial";
import SEO from "@/components/SEO";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

const PRODUCTS = [
  {
    title: "The Complete Essay Archive",
    price: "$27",
    desc: "91 essays spanning enterprise technology, psychedelic medicine, tokenized impact, payments infrastructure, and consciousness. Twenty-five years of pattern recognition, distilled.",
    productKey: "essay-archive",
  },
  {
    title: "The Regenerative Business Playbook",
    price: "$47",
    desc: "The extractive-to-regenerative framework applied to real companies. Case studies, stress tests, and the architecture for building businesses that compound value instead of depleting it.",
    productKey: "regenerative-playbook",
  },
  {
    title: "The Vendor Intelligence Brief",
    price: "$97",
    desc: "Selected findings from the RampRate SPY Index. How to negotiate with enterprise technology vendors when you don't have a million data points — but someone does.",
    productKey: "vendor-intel-brief",
  },
];

const AFFILIATES = [
  {
    title: "Oura Ring",
    desc: "The biometric Tony actually wears. Sleep architecture, HRV, readiness scores. Not a gadget — a mirror.",
    note: "~$40 referral credit",
    status: "COMING SOON",
  },
  {
    title: "Living Well Essentials",
    desc: "Curated tools for the pescatarian-vegan, consciousness-forward life. Nothing mainstream. Everything tested.",
    note: "Amazon Associates",
    status: "COMING SOON",
  },
];

export default function Shop() {
  return (
    <div>
      <SEO
        title="Shop — Essay Products & Living Well"
        description="Essay compilations, frameworks, and curated tools from Tony Greenberg. Twenty-five years of pattern recognition, available for the first time."
        path="/shop"
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
            THE SHOP
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#F5F0E0",
              lineHeight: 1.15,
              marginBottom: "1.2rem",
            }}
          >
            Frameworks, Not Platitudes.
            <br />
            <span style={{ color: "#D4B96A" }}>Tools, Not Toys.</span>
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
            Essay compilations, regenerative business frameworks, and the curated tools that actually get used. Priced to be accessible. Built to be actionable.
          </p>
        </div>
      </section>

      {/* ── ESSAY PRODUCTS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Essay IP</Eyebrow>
          <SectionTitle>Digital Products</SectionTitle>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.5rem",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column" as const,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#0A0A10",
                    marginBottom: "0.3rem",
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#8B6914",
                    marginBottom: "0.6rem",
                  }}
                >
                  {p.price}
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#444", flex: 1, marginBottom: "1rem" }}>
                  {p.desc}
                </p>
                <StripeCheckoutButton
                  productKey={p.productKey}
                  label={`BUY — ${p.price}`}
                  successPath="/payment-success"
                  cancelPath="/shop"
                  style={{ width: "100%", textAlign: "center" }}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── LIVING WELL AFFILIATES ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Living Well</Eyebrow>
          <SectionTitle>Curated Tools</SectionTitle>
          <p style={{ maxWidth: "560px", margin: "0 auto 1.5rem", textAlign: "center", fontSize: "0.95rem", color: "#555", lineHeight: 1.7 }}>
            Things Tony actually uses. Nothing sponsored. Nothing mainstream. Affiliate links support the site — full transparency, always.
          </p>
        </FadeIn>

        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {AFFILIATES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.2rem 0",
                  borderBottom: i < AFFILIATES.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#0A0A10",
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#888",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {a.status}
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#444", margin: 0 }}>
                  {a.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <Pullquote>
            The things worth buying are the things that change how you see — not what you own.
          </Pullquote>
        </FadeIn>
      </Section>
    </div>
  );
}
