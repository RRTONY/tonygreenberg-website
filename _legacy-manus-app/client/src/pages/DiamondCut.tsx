/**
 * THE DIAMOND CUT — v1.5.
 * For services businesses not yet at product scale.
 * Tony identifies diamonds in rough, maps services → scalable product.
 * NOT for tech founders — send them to Mochary.
 * Design: "The Folio" editorial — dark hero, gold accents, parchment body.
 */

import { Section, FadeIn, Eyebrow, SectionTitle, Divider, Spacer, Pullquote } from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

const FIVE_CUTS = [
  {
    num: "01",
    title: "Diamond Identification",
    desc: "Most services businesses cannot see their own product. They are too close. Tony has spent 25 years looking at thousands of companies through a Fortune 50 CXO lens — identifying the one thing inside a services business that a $50B company would actually buy, integrate, and scale. That is the diamond.",
  },
  {
    num: "02",
    title: "The CXO Lens",
    desc: "The difference between a product and a tolerated vendor is how a CXO perceives you. Tony translates your offering into the language, metrics, and decision frameworks that Fortune 50 executives actually use. If a CXO cannot explain your value in one sentence to their board, you do not have a product yet.",
  },
  {
    num: "03",
    title: "Product Architecture",
    desc: "Services revenue is linear. Product revenue compounds. Tony maps the architecture: what stays bespoke, what becomes repeatable, what gets automated, and what becomes the platform. The goal is not to eliminate services — it is to make them the onramp to something that scales without you in every room.",
  },
  {
    num: "04",
    title: "BD Activation",
    desc: "A product without distribution is a hobby. Tony activates business development through his 25-year Fortune 500 network — not introductions, but strategic placement. Your product in front of the three people who can say yes, with context they trust, from someone they have trusted for decades.",
  },
  {
    num: "05",
    title: "Regenerative Positioning",
    desc: "The market is shifting. Extractive business models are being repriced by regulation, consumer sentiment, and capital allocation. Tony positions your product on the right side of that shift — so you are not just scaling, you are building something that compounds value for everyone it touches.",
  },
];

const TIERS = [
  {
    tier: "Rough Cut",
    price: "$5,000",
    note: "floor",
    details: ["Diamond identification.", "CXO lens assessment.", "Written output: is there a product here?"],
    cta: "BUY — $5,000",
    href: "/engage",
    productKey: "diamond-rough-cut",
    featured: false,
  },
  {
    tier: "Full Cut",
    price: "$10,000",
    note: "floor",
    details: ["All 5 cuts.", "Product architecture map.", "3 BD introductions.", "Written deliverable."],
    cta: "BUY — $10,000",
    href: "/engage",
    productKey: "diamond-full-cut",
    featured: true,
  },
  {
    tier: "Monthly Polish",
    price: "$15,000/mo",
    note: "per month",
    details: ["Ongoing product refinement.", "Active BD pipeline.", "CXO translation on demand.", "ImpactSoul alignment."],
    cta: "SUBSCRIBE — $15,000/MO",
    href: "/engage",
    productKey: "diamond-monthly-polish",
    featured: false,
  },
  {
    tier: "The Setting",
    price: "Equity + Cash",
    note: "contact directly",
    details: ["Full strategic partnership.", "Board-level engagement.", "The diamond gets set."],
    cta: "MAKE YOUR CASE →",
    href: "mailto:tony@impactsoul.is?subject=Diamond%20Cut%20-%20The%20Setting",
    featured: false,
  },
];

export default function DiamondCut() {
  return (
    <div>
      <SEO
        title="The Diamond Cut — Services to Product"
        description="For services businesses not yet at product scale. Tony identifies the diamond in your rough, maps services to scalable product, and activates Fortune 50 distribution. Engagements begin with a scoping conversation."
        path="/diamond-cut"
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto" }}>
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
            THE DIAMOND CUT
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
            Every services business has
            <br />
            <span style={{ color: "#D4B96A" }}>a product trapped inside it.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(245,240,224,0.65)",
              maxWidth: "560px",
              margin: "0 auto 1rem",
            }}
          >
            Most founders cannot see it. They are too close. Tony has spent 25 years finding diamonds in rough — and cutting them into something Fortune 50 companies actually buy.
          </p>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(245,240,224,0.45)",
              letterSpacing: "0.08em",
            }}
          >
            Engagements begin with a scoping conversation · tony@impactsoul.is
          </div>
        </div>
      </section>

      {/* ── AN HONEST NOTE ── */}
      <Section>
        <FadeIn>
          <Eyebrow>An Honest Note</Eyebrow>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              Tony is not a great CEO. He is a magnificent number two. A consigliere. The person who has guided top CXOs at Fortune 50 companies for 25 years — not by running the company, but by seeing what they cannot see from inside it.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem" }}>
              His zone of genius is finding diamonds in rough. Translating what a services business actually does into something a CXO would pay for, integrate, and scale. That is a very specific skill. It is not coaching. It is not consulting. It is pattern recognition built on scar tissue from thousands of deals.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "1rem", fontWeight: 600 }}>
              If you are a technology company founder — go to{" "}
              <a
                href="https://mochary.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)" }}
              >
                Matt Mochary
              </a>
              . He is the best in the world at that. This is not for you.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#555", fontStyle: "italic" }}>
              The Diamond Cut is for services businesses that know they have something valuable — but have not yet figured out how to make it scale without the founder in every room.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE 5 CUTS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The 5 Cuts</Eyebrow>
        </FadeIn>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {FIVE_CUTS.map((c, i) => (
            <FadeIn key={c.num} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.2rem 0",
                  borderBottom: i < FIVE_CUTS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      color: "#D4B96A",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      paddingTop: "0.2rem",
                    }}
                  >
                    {c.num}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#0A0A10",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {c.title}
                    </h3>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#333", margin: 0 }}>
                      {c.desc}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ── THE 2X GUARANTEE ── */}
      <Section>
        <FadeIn>
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              padding: "1.5rem 2rem",
              background: "rgba(212,185,106,0.06)",
              border: "1px solid rgba(212,185,106,0.2)",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.6rem",
              }}
            >
              THE 2× GUARANTEE
            </div>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#222", marginBottom: "0.6rem", fontWeight: 600 }}>
              Do the work. Show the receipts. Get 2x back — or Tony keeps working until you do.
            </p>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#555", margin: 0 }}>
              Proof of work = completed preparation document + all session action items documented in writing. No proof, no guarantee.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── TIERS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>Tiers</Eyebrow>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {TIERS.map((t, i) => (
            <FadeIn key={t.tier} delay={i * 0.05}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "6px",
                  border: t.featured
                    ? "1px solid rgba(212,185,106,0.4)"
                    : "1px solid rgba(0,0,0,0.06)",
                  background: t.featured
                    ? "linear-gradient(135deg, rgba(212,185,106,0.06) 0%, rgba(139,105,20,0.03) 100%)"
                    : "#fff",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column" as const,
                  height: "100%",
                }}
              >
                {t.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.5rem",
                      right: "1rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase" as const,
                      color: "#fff",
                      background: "#8B6914",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                    }}
                  >
                    RECOMMENDED
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t.tier}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#0A0A10",
                    }}
                  >
                    {t.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      color: "#888",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {t.note}
                  </span>
                </div>
                <div style={{ flex: 1, marginBottom: "1rem" }}>
                  {t.details.map((d, j) => (
                    <p key={j} style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "#444", marginBottom: "0.2rem" }}>
                      {d}
                    </p>
                  ))}
                </div>
                {(t as any).productKey ? (
                  <StripeCheckoutButton
                    productKey={(t as any).productKey}
                    label={t.cta}
                    successPath="/payment-success"
                    cancelPath="/diamond-cut"
                    variant={t.featured ? "primary" : "secondary"}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      padding: "0.7rem 1.5rem",
                      ...(t.featured ? { background: "#D4B96A", color: "#0A0A10" } : {}),
                    }}
                  />
                ) : t.href.startsWith("/") ? (
                  <Link
                    href={t.href}
                    className="no-underline"
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: t.featured ? "#0A0A10" : "#8B6914",
                      background: t.featured ? "#D4B96A" : "transparent",
                      border: t.featured ? "none" : "1px solid rgba(139,105,20,0.3)",
                      padding: "0.7rem 1.5rem",
                      borderRadius: "3px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.cta}
                  </Link>
                ) : (
                  <a
                    href={t.href}
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "#8B6914",
                      border: "1px solid rgba(139,105,20,0.3)",
                      padding: "0.7rem 1.5rem",
                      borderRadius: "3px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {t.cta}
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Spacer />

      {/* ── BOOK ── */}
      <section
        style={{
          background: "#0A0A10",
          padding: "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "#D4B96A",
              marginBottom: "0.8rem",
            }}
          >
            BOOK
          </div>
          <p style={{ fontSize: "1rem", color: "rgba(245,240,224,0.7)", marginBottom: "0.6rem" }}>
            <a href="mailto:tony@impactsoul.is" style={{ color: "#D4B96A", textDecoration: "none" }}>tony@impactsoul.is</a>
          </p>
          <Link
            href="/engage"
            className="no-underline"
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
              marginBottom: "0.8rem",
            }}
          >
            ENTER THE GATE →
          </Link>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(245,240,224,0.35)",
              letterSpacing: "0.08em",
              marginTop: "0.5rem",
            }}
          >
            $5,000 MINIMUM · PREPARATION DOC REQUIRED · ALL SESSIONS RECORDED VIA FIREFLIES
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
