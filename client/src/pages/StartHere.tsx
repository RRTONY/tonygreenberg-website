import {
  Section,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import blogData from "@/data/blogData.json";

/* ── Image lookup from blogData ── */
const imageMap: Record<string, string> = {};
(blogData as { slug: string; image: string }[]).forEach((p) => {
  imageMap[p.slug] = p.image;
});

const ESSAYS = [
  {
    num: "01",
    slug: "boiling-the-human-summit-harvard-kurzweil",
    title: '"Boiling the Human" — H+ Summit / Harvard-Kurzweil',
    why: "Because the line between human and machine was drawn on a stage at Harvard in 2010. This transcript captures the moment the question stopped being theoretical.",
    hook: "What happens when the people building the future forget to ask the people living in it?",
    tag: "THE RECKONING",
  },
  {
    num: "02",
    slug: "only-time-buys-trust",
    title: "Trust Us? Are You Really My Friend?",
    why: "Because trust is the only currency that compounds. This essay is the thesis statement for everything else on this site.",
    hook: "In a world optimized for speed, the most radical act is patience.",
    tag: "THE LESSON",
  },
  {
    num: "03",
    slug: "psychedelics-could-become-extractive-capitalism",
    title: "Psychedelics Could Become Extractive Capitalism",
    why: "Because consciousness expansion without accountability is just another gold rush. Six investments deep, this is what the view looks like from inside.",
    hook: "The medicine works. The question is whether the business model will poison it.",
    tag: "THE SYSTEMS MAP",
  },
  {
    num: "04",
    slug: "the-ball-and-blockchain-decentralization",
    title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory",
    why: "Because decentralization promised liberation and delivered speculation. This essay maps the gap between the vision and the reality.",
    hook: "Every revolution gets co-opted. The question is when you notice.",
    tag: "THE RECKONING",
  },
  {
    num: "05",
    slug: "return-on-investment-going-green-going-green-2",
    title: "Return on Investment — Are You Going Green?",
    why: "Because impact without returns is charity, and returns without impact is extraction. The math has to work for both.",
    hook: "Green isn't a color. It's a calculation.",
    tag: "THE SYSTEMS MAP",
  },
];

const tagColors: Record<string, string> = {
  "THE RECKONING": "#9B2335",
  "THE LESSON": "#8B6914",
  "THE SYSTEMS MAP": "#4682B4",
};

export default function StartHere() {
  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Start Here | Tony Greenberg"
        description="Five essays that define the worldview. Start with the thinking that started everything."
        path="/start-here"
        indexable={true}
      />

      {/* ── HERO ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 4rem)",
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
            THE FOUNDATION
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 400,
              color: "#F5F0E0",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
            }}
          >
            Five essays.<br />
            <em className="gold-shimmer">One worldview.</em>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            If you're new here, start with these. They're the load-bearing walls.
            Everything else is built on top of them.
          </p>
        </FadeIn>
      </div>

      {/* ── ESSAYS — Large image-driven cards ── */}
      <div
        style={{
          maxWidth: "1100px",
          width: "70%",
          minWidth: "min(100% - 2rem, 700px)",
          margin: "0 auto",
          padding: "clamp(2rem, 5vw, 4rem) 0",
        }}
      >
        {ESSAYS.map((essay, i) => {
          const img = imageMap[essay.slug];
          const isEven = i % 2 === 0;
          const tc = tagColors[essay.tag] || "#8B6914";

          return (
            <FadeIn key={essay.slug} delay={i * 0.05}>
              <Link
                href={`/blog/${essay.slug}`}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isEven ? "1.2fr 1fr" : "1fr 1.2fr",
                    gap: "0",
                    marginBottom: "clamp(2rem, 4vw, 3.5rem)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    minHeight: "clamp(320px, 40vw, 480px)",
                  }}
                  className="card-lift"
                  data-start-card="true"
                >
                  {/* Image side */}
                  {isEven && (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      {img && (
                        <img
                          src={img}
                          alt={essay.title}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 1,
                          }}
                          loading={i < 2 ? "eager" : "lazy"}
                        />
                      )}
                      {/* Subtle overlay for depth */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)",
                        }}
                      />
                      {/* Number watermark */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "1rem",
                          left: "1.5rem",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(3rem, 6vw, 5rem)",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.2)",
                          lineHeight: 1,
                        }}
                      >
                        {essay.num}
                      </div>
                    </div>
                  )}

                  {/* Text side */}
                  <div
                    style={{
                      padding: "clamp(1.5rem, 3vw, 2.5rem)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      order: isEven ? 0 : 0,
                    }}
                  >
                    {/* Tag */}
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#fff",
                        marginBottom: "0.8rem",
                        display: "inline-block",
                        background: tc,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2px",
                        alignSelf: "flex-start",
                      }}
                    >
                      {essay.tag}
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
                        fontWeight: 400,
                        color: "#111",
                        lineHeight: 1.3,
                        marginBottom: "1rem",
                      }}
                    >
                      {essay.title}
                    </h2>

                    {/* Hook */}
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1rem",
                        
                        color: "#666",
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        borderLeft: `2px solid ${tc}`,
                        paddingLeft: "1rem",
                      }}
                    >
                      "{essay.hook}"
                    </p>

                    {/* Why */}
                    <p
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1.05rem",
                        color: "#444",
                        lineHeight: 1.7,
                        marginBottom: "1.2rem",
                      }}
                    >
                      {essay.why}
                    </p>

                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.06em",
                        color: tc,
                      }}
                    >
                      Read this essay →
                    </div>
                  </div>

                  {/* Image side (for odd items — image on right) */}
                  {!isEven && (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      {img && (
                        <img
                          src={img}
                          alt={essay.title}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 1,
                          }}
                          loading={i < 2 ? "eager" : "lazy"}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(225deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "1rem",
                          right: "1.5rem",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(3rem, 6vw, 5rem)",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.2)",
                          lineHeight: 1,
                        }}
                      >
                        {essay.num}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>

      {/* ── WHAT COMES AFTER ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <FadeIn>
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
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
              AFTER THE FOUNDATION
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                fontWeight: 400,
                color: "#F5F0E0",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
              }}
            >
              Once you've read these five, you'll know whether
              this work resonates — or repels.
            </h2>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Either response is useful. The essays that follow explore psychedelic
              medicine, payments infrastructure, enterprise technology, tokenized
              impact, and the personal cost of building systems that matter.
              Ninety dispatches from twenty-five years in the field. No algorithm.
              No sponsors. Just one person's attempt to make sense of the largest
              wealth transfer in human history.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link
                href="/"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  color: "#0A0A10",
                  background: "#D4B96A",
                  padding: "0.8rem 1.8rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >
                EXPLORE ALL ESSAYS →
              </Link>
              <Link
                href="/ecosystem"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.7)",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "0.8rem 1.8rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >
                JOIN THE ECOSYSTEM →
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>

      <NextPage href="/ecosystem" label="Join the Ecosystem" />

      {/* ── Responsive override for mobile ── */}
      <style>{`
        @media (max-width: 768px) {
          /* Stack the grid cards vertically on mobile */
          [data-start-card] {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          [data-start-card] img {
            position: relative !important;
            width: 100% !important;
            height: 250px !important;
            object-fit: cover !important;
          }
        }
      `}</style>
    </div>
  );
}
