/*
 * Impact Futurism — Category Page
 * Curated collection of Tony Greenberg's essays on broken systems,
 * the future of health, money, trust, AI, and consciousness.
 * Route: /impact-futurism
 */
import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import StandaloneNav from "@/components/StandaloneNav";

const FEATURED = [
  {
    slug: "your-blood-lies-without-your-dna",
    title: "Your Blood Lies Without Your DNA",
    date: "August 2026",
    teaser: "Quest Diagnostics runs 600 million tests a year. 1.7 stars on Trustpilot. An $11B company that built a system hostile to the patient it serves. And what comes next.",
    image: "/manus-storage/blood-dna-hero_da0291f1.jpg",
    tag: "Health Systems",
    readTime: "12 min",
  },
  {
    slug: "energy-is-money-money-is-memory",
    title: "Energy Is Money. Money Is Memory. We Just Made Remembering the Most Expensive Thing on Earth.",
    date: "August 2026",
    teaser: "The physics underneath the AI buildout — and why the largest act of memory-making in human history is happening right now.",
    image: "/manus-storage/energy-money-memory-hero-v2_deb8f3db.jpg",
    tag: "AI & Energy",
    readTime: "10 min",
  },
  {
    slug: "when-healing-becomes-extraction",
    title: "I Made Money Today on Psychedelics. I'm Not Celebrating.",
    date: "July 2026",
    teaser: "On the day Eli Lilly spent $2.8B validating psychedelic medicine, a woman named Tina died. The system that should have saved her failed her.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/when-healing-hero-FEiKS3iCJcSfUDNrR6wwXm.webp",
    tag: "Psychedelic Medicine",
    readTime: "8 min",
  },
];

const ALL_ARTICLES = [
  {
    slug: "your-blood-lies-without-your-dna",
    title: "Your Blood Lies Without Your DNA",
    date: "August 2026",
    teaser: "The most broken vendor relationship in American healthcare — and the five-layer stack that replaces it.",
    tag: "Health Systems",
  },
  {
    slug: "energy-is-money-money-is-memory",
    title: "Energy Is Money. Money Is Memory.",
    date: "August 2026",
    teaser: "Soddy, Satoshi, and Kocherlakota walk into a data center. The AI buildout as the largest act of memory-making in human history.",
    tag: "AI & Energy",
  },
  {
    slug: "when-healing-becomes-extraction",
    title: "I Made Money Today on Psychedelics. I'm Not Celebrating.",
    date: "July 2026",
    teaser: "Capital is arriving in psychedelic medicine. The question is whether it arrives as healing or as extraction.",
    tag: "Psychedelic Medicine",
  },
  {
    slug: "energy-as-impact",
    title: "Energy as Impact",
    date: "February 2023",
    teaser: "Redefining sustainable computing — building infrastructure that treats energy as a moral act, not just a cost.",
    tag: "Infrastructure",
  },
  {
    slug: "greenberg-kurzweil-scientist-foundation-of-trust",
    title: "H+ Summit: Rise of the Citizen-Scientist",
    date: "August 2010",
    teaser: "On stage with Kurzweil. The case for citizen-scientists as the verification layer in a world drowning in misinformation.",
    tag: "Trust & Verification",
  },
  {
    slug: "only-time-buys-trust",
    title: "Trust Us? Are You Really My Friend?",
    date: "October 2017",
    teaser: "The evolving definition of trust in the digital age — and why time is the only currency that cannot be faked.",
    tag: "Trust & Verification",
  },
  {
    slug: "google-verizon-walled-garden-plan",
    title: "The Google/Verizon Walled Garden Plan",
    date: "August 2010",
    teaser: "Net neutrality as a trust problem, not a technical one. Why the compromise was always going to fail.",
    tag: "Infrastructure",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Health Systems": "#4A1D5E",
  "AI & Energy": "#1a3a5c",
  "Psychedelic Medicine": "#2d4a1e",
  "Infrastructure": "#3a2a0a",
  "Trust & Verification": "#1a2a3a",
};

export default function ImpactFuturism() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const tags = ["All", ...Array.from(new Set(ALL_ARTICLES.map(a => a.tag)))];
  const filtered = activeTag === "All" ? ALL_ARTICLES : ALL_ARTICLES.filter(a => a.tag === activeTag);

  return (
    <>
      <SEO
        title="Impact Futurism — Tony Greenberg"
        description="Essays on broken systems and what comes next. Health, AI, energy, psychedelic medicine, trust, and the infrastructure of the future. By Tony Greenberg."
        path="/impact-futurism"
        type="WebPage"
      />
      <StandaloneNav />

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(160deg, #0A0A10 0%, #12091a 40%, #0d1520 100%)",
        padding: "5rem clamp(1.5rem, 6vw, 5rem) 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: "-60px", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(74,29,94,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(26,58,92,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "1rem" }}>
            ◆ Tony Greenberg
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 400,
            color: "#F5F0E0",
            lineHeight: 1.1,
            marginBottom: "1.2rem",
            fontStyle: "italic",
          }}>
            Impact Futurism
          </h1>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "rgba(245,240,224,0.65)",
            lineHeight: 1.7,
            maxWidth: "620px",
            marginBottom: "2rem",
          }}>
            The systems that run your health, your money, and your future are broken. These essays are about what comes next — written from the inside of $10B+ in transactions, six psychedelic investments, and twenty-five years of watching institutions fail the people they were built to serve.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/subscribe" style={{
              display: "inline-block",
              padding: "0.75rem 1.8rem",
              background: "#D4B96A",
              color: "#0A0A10",
              borderRadius: "3px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 600,
            }}>Get the Dispatch</Link>
            <Link href="/articles" style={{
              display: "inline-block",
              padding: "0.75rem 1.8rem",
              background: "transparent",
              color: "rgba(245,240,224,0.7)",
              border: "1px solid rgba(212,185,106,0.3)",
              borderRadius: "3px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}>All 121 Essays</Link>
          </div>
        </div>
      </div>

      {/* ── FEATURED THREE ── */}
      <div style={{ background: "#FAFAF7", padding: "3.5rem clamp(1.5rem, 6vw, 5rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1.5rem" }}>
            Featured
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {FEATURED.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  border: "1px solid rgba(139,105,20,0.15)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.25s, transform 0.25s",
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 12px 40px rgba(139,105,20,0.14)"; el.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: "200px", overflow: "hidden", position: "relative", background: "#111" }}>
                    <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                    <div style={{
                      position: "absolute", top: "0.8rem", left: "0.8rem",
                      padding: "0.25rem 0.6rem",
                      background: TAG_COLORS[article.tag] || "#333",
                      color: "#F5F0E0",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      borderRadius: "2px",
                    }}>{article.tag}</div>
                  </div>
                  <div style={{ padding: "1.2rem 1.3rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#8B6914", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
                      {article.date} · {article.readTime} read
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#111", lineHeight: 1.3, marginBottom: "0.6rem", flex: 1 }}>
                      {article.title}
                    </h3>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#555", lineHeight: 1.6, marginBottom: "1rem" }}>
                      {article.teaser}
                    </p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#8B6914", letterSpacing: "0.08em" }}>
                      Read →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALL ARTICLES WITH TAG FILTER ── */}
      <div style={{ background: "#F2EDE4", padding: "3rem clamp(1.5rem, 6vw, 5rem) 5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Tag filter */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: "0.4rem 1rem",
                  background: activeTag === tag ? "#8B6914" : "transparent",
                  color: activeTag === tag ? "#FAFAF7" : "#8B6914",
                  border: "1px solid rgba(139,105,20,0.4)",
                  borderRadius: "20px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >{tag}</button>
            ))}
          </div>

          {/* Article list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {filtered.map((article, i) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "1.4rem 0",
                  borderBottom: "1px solid rgba(139,105,20,0.12)",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "1.2rem",
                  alignItems: "start",
                  transition: "background 0.15s",
                  borderRadius: "4px",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(139,105,20,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(139,105,20,0.5)", paddingTop: "0.2rem", minWidth: "1.5rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                      <span style={{
                        padding: "0.15rem 0.5rem",
                        background: TAG_COLORS[article.tag] || "#333",
                        color: "#F5F0E0",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.55rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        borderRadius: "2px",
                      }}>{article.tag}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#8B6914", opacity: 0.6 }}>{article.date}</span>
                    </div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#111", lineHeight: 1.3, marginBottom: "0.3rem" }}>
                      {article.title}
                    </h4>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#666", lineHeight: 1.55 }}>
                      {article.teaser}
                    </p>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#8B6914", paddingTop: "0.2rem", whiteSpace: "nowrap" }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER FOOTER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0A0A10 0%, #1a1020 100%)",
        padding: "4rem clamp(1.5rem, 6vw, 5rem)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "0.8rem" }}>◆ The Dispatch</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 400, color: "#F5F0E0", fontStyle: "italic", lineHeight: 1.25, marginBottom: "0.8rem" }}>
            The next dispatch arrives when it's ready.
          </h3>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(245,240,224,0.55)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            No cadence. No algorithm. Just the things I couldn't not write — about the systems breaking around us and what comes next.
          </p>
          <Link href="/subscribe" style={{
            display: "inline-block",
            padding: "0.85rem 2.2rem",
            background: "#D4B96A",
            color: "#0A0A10",
            borderRadius: "3px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 600,
          }}>Send Me the Dispatch</Link>
        </div>
      </div>
    </>
  );
}
