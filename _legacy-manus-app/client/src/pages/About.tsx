import {
  Section,
  FadeIn,
  Divider,
  Spacer,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { QuoteGrid } from "@/components/PartnerQuotes";

const TONY_HEADSHOT = "/api/img/tony-headshot_2d63de23.jpg";

const KINTSUGI_IMG = "/api/img/homepage-hero-original_d3e7447d.jpg";

export default function About() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="The Story | Tony 'WhyNot' Greenberg"
        description="Systems thinker. Impact builder. Corporate accountability crusader. This is the story of why — and what happens next."
        path="/about"
        indexable={true}
      />

      {/* ── CINEMATIC HERO ── */}
      <div
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${KINTSUGI_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.35)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 4rem)",
            display: "flex",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src={TONY_HEADSHOT}
            alt="Tony Greenberg"
            style={{
              width: "clamp(160px, 22vw, 240px)",
              height: "clamp(160px, 22vw, 240px)",
              objectFit: "cover",
              borderRadius: "6px",
              border: "2px solid rgba(212,185,106,0.4)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "1rem",
              }}
            >
              THE STORY
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                fontWeight: 400,
                color: "#F5F0E0",
                lineHeight: 1.15,
                marginBottom: "1.2rem",
              }}
            >
              The broken things<br />
              <em className="gold-shimmer">taught me everything.</em>
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.8,
                maxWidth: "480px",
              }}
            >
              Wrong about the timing. Right about everything else. For 25 years. First URL on live TV. First webcast. First digital record label. Cloud before AWS was trusted. Blockchain before the lawyers showed up. Psychedelic medicine before it was respectable.
            </p>
          </div>
        </div>
      </div>

      {/* ── CHAPTER 1: THE ORIGIN ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "0.8rem",
              }}
            >
              CHAPTER ONE
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
              }}
            >
              Before the systems, there was the question.
            </h2>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              It started with retail. Boutique shops, direct-response marketing, the unglamorous work of selling things to people who didn't know they needed them. The 1990s were a masterclass in hustle — launching businesses, selling businesses, learning that the distance between a good idea and a dead company is about six months of cash flow and one honest conversation nobody wants to have.
            </p>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              Then came Exodus Communications. A $37 billion IPO. Raindance Communications — running sales and marketing for a company that was scaling faster than anyone could steer. The lesson wasn't about scale. It was about what happens when growth outpaces wisdom. The answer: spectacular, instructive wreckage.
            </p>

            <div
              style={{
                borderLeft: "3px solid #D4B96A",
                paddingLeft: "1.5rem",
                margin: "2rem 0",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                
                color: "#444",
                lineHeight: 1.6,
              }}
            >
              "The infrastructure that actually matters? Meaning itself."
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── CHAPTER 2: THE BUILD ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "0.8rem",
              }}
            >
              CHAPTER TWO
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
              }}
            >
              $10 billion in truth-telling.
            </h2>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              RampRate was born from a simple observation: enterprise technology vendors lie about what things cost, and their customers don't know enough to call them on it. So we built the most comprehensive benchmarking operation on the planet. The SPY Index — over a million data points on what infrastructure actually costs versus what vendors claim. Microsoft, Disney, Goldman Sachs, Nike. Hundreds of Fortune 500s. $10 billion benchmarked.
            </p>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              Eighteen years of saving companies hundreds of millions of dollars. And then the question that changed everything: <em>what is all this money for?</em> Saving a corporation $40 million on cloud infrastructure is satisfying. But if that $40 million goes into stock buybacks while the planet burns, the victory is hollow. The work needed to point somewhere.
            </p>

            {/* The Receipts — inline */}
            <div
              style={{
                background: "rgba(139,105,20,0.04)",
                borderRadius: "6px",
                padding: "1.5rem",
                margin: "2rem 0",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#8B6914",
                  marginBottom: "1rem",
                }}
              >
                THE RECEIPTS
              </div>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {[
                  { label: "Enterprise tech benchmarked", value: "$10B+" },
                  { label: "SPY Index data points", value: "1,000,000+" },
                  { label: "Fortune 500 clients served", value: "Hundreds" },
                  { label: "Years of unsolicited opinions", value: "25+" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#555" }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.05rem", color: "#8B6914", fontWeight: 600 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── CHAPTER 3: THE SHIFT ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "0.8rem",
              }}
            >
              CHAPTER THREE
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
              }}
            >
              Consciousness expansion isn't optional anymore.
            </h2>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              ImpactSoul is a Certified B Corp venture foundry that tokenizes high-value cultural and real estate assets to fund regenerative impact. Four live token ecosystems — BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health) — putting everyday people into investments previously reserved for the 0.1%. Facilitated a multi-million-dollar grant for XPRIZE Foundation. Advised Bhutan's Gross National Happiness Centre. Championed tribal rights from Latin America to Africa under the Nagoya Protocol.
            </p>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              Investor in MycoMedica Life Sciences and five other psychedelic medicine ventures — from FDA Breakthrough Therapy designations to consciousness research platforms. Because the next infrastructure revolution isn't servers and switches. It's the operating system between our ears.
            </p>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1.5rem" }}>
              Spoke at Harvard's H+ Summit alongside Ray Kurzweil in 2010 on the convergence of humanity and technology. Keynoted at Davos, Paris Blockchain Week, UCLA, and more conferences than memory permits. Written up by Forbes, Wired, Business Week, and others who occasionally regret giving a platform to someone who says what he actually thinks.
            </p>

            <div
              style={{
                borderLeft: "3px solid #D4B96A",
                paddingLeft: "1.5rem",
                margin: "2rem 0",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                
                color: "#444",
                lineHeight: 1.6,
              }}
            >
              "Everyone and their golden retriever is doing AI and data centers. The question isn't what to build. It's what's worth building."
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── WHAT I AM THINKING NOW ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "760px", padding: "clamp(1.35rem, 4vw, 2rem)", background: "linear-gradient(135deg, #11111A 0%, #20162C 100%)", borderRadius: "7px", color: "#F5F0E0", boxShadow: "0 18px 48px rgba(18,12,26,0.15)" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.17em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "0.75rem" }}>What I am thinking about now</div>
            <p style={{ margin: "0 0 0.85rem", fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(1.42rem, 3vw, 2rem)", lineHeight: 1.32, textWrap: "balance" }}>
              AI is a memory machine with an energy problem. The people solving the energy problem will quietly decide what the future gets to remember.
            </p>
            <p style={{ margin: 0, fontFamily: "'Source Sans 3', sans-serif", color: "rgba(245,240,224,0.7)", lineHeight: 1.6 }}>
              I am following the collision of AI buildout, nuclear manufacturing, and the trust layer underneath every serious system.
            </p>
            <Link href="/blog/energy-is-money-money-is-memory" style={{ display: "inline-block", marginTop: "1rem", color: "#D4B96A", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(212,185,106,0.5)", paddingBottom: "0.2rem" }}>
              Read the field note →
            </Link>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE MUSE ── */}
      <Section>
        <FadeIn>
          <div style={{ maxWidth: "680px" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "0.8rem",
              }}
            >
              THE MUSE
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
              }}
            >
              Clarisse Abelarde
            </h2>

            <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.9, marginBottom: "1rem" }}>
              Behind every relentless builder is someone who reminds them why beauty matters. Clarisse Abelarde — artist, partner, constant source of inspiration for creativity and love for humankind. Her work is a permanent influence on everything here.
            </p>
            <a
              href="https://clarisseart-jyfqwtnv.manus.space/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.05rem",
                letterSpacing: "0.04em",
                color: "#8B6914",
                textDecoration: "none",
                borderBottom: "1px solid rgba(139,105,20,0.3)",
                paddingBottom: "2px",
              }}
            >
              clarisseart.manus.space
            </a>
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* ── FEATURED IN ── */}
      <div
        style={{
          background: "#F0EDE4",
          padding: "1.5rem clamp(1.5rem, 5vw, 3rem)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "1.2rem",
          }}
        >
          FEATURED IN & QUOTED BY
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem 2rem", justifyContent: "center" }}>
          {["Forbes", "Wired", "Business Week", "Huffington Post", "Ars Technica", "All Things D", "Computer World", "Psychedelic Times"].map((outlet) => (
            <span
              key={outlet}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#555",
              }}
            >
              {outlet}
            </span>
          ))}
        </div>
      </div>

      {/* ── PARTNER QUOTES ── */}
      <Section>
        <QuoteGrid count={3} />
      </Section>

      {/* ── CLOSING CTA ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "2.5rem clamp(1.5rem, 5vw, 3rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1.2rem",
            }}
          >
            WHAT HAPPENS NEXT
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
            }}
          >
            The door is open. The work is ongoing.<br />
            <em style={{ color: "#D4B96A" }}>The aligned are welcome.</em>
          </h2>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "420px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            Got an injustice worth exposing? A story that needs telling? Something broken that needs naming? The best thinking comes from people who refuse to stay quiet.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:tony@tonygreenberg.com"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                color: "#0A0A10",
                background: "#D4B96A",
                padding: "0.7rem 1.8rem",
                textDecoration: "none",
                borderRadius: "2px",
                transition: "all 0.2s",
              }}
            >
              REACH OUT
            </a>
            <Link
              href="/ecosystem"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                color: "#D4B96A",
                border: "1px solid rgba(212,185,106,0.4)",
                padding: "0.7rem 1.8rem",
                textDecoration: "none",
                borderRadius: "2px",
                transition: "all 0.2s",
              }}
            >
              JOIN THE ECOSYSTEM
            </Link>
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.3)",
              marginTop: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            Santa Monica · Aspen · At Large
          </div>
        </FadeIn>
      </div>

      <NextPage href="/" label="Back to the Essays" />
    </div>
  );
}
