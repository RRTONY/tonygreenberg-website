/**
 * BrewSoul Content Pages — Wall of Shame, Follow the Dollar, Health,
 * Farm Passport, Mold-Free, Experience Map
 */
import { useState } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { SHAME_ENTRIES, HEALTH_CLAIMS, EXPERIENCES, FARMS, DOLLAR_BREAKDOWNS } from "@/data/brewsoul-encyclopedia";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

/* ──────────────────── WALL OF SHAME ──────────────────── */
export function BrewSoulShame() {
  const [cat, setCat] = useState("all");
  const cats = Array.from(new Set(SHAME_ENTRIES.map(s => s.category)));
  const filtered = cat === "all" ? SHAME_ENTRIES : SHAME_ENTRIES.filter(s => s.category === cat);

  return (
    <>
    <SEO
        title="Coffee Content — BrewSoul"
        description="Deep-dive articles, guides, and research on specialty coffee."
        path="/brewsoul/content"
        keywords="Tony Greenberg, coffee articles, coffee guides, specialty coffee research"
        indexable={true}
      />
      <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B2500", marginBottom: "0.5rem" }}>
          The Reckoning
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Wall of Shame
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2rem" }}>
          The coffee industry has a transparency problem. These are the practices, brands, and myths
          that exploit farmers, mislead consumers, or perpetuate harm. We name names because
          accountability starts with visibility.
        </p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <button onClick={() => setCat("all")} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", padding: "0.5rem 1rem",
            borderRadius: "20px", border: cat === "all" ? "2px solid #8B2500" : "1px solid rgba(111,78,55,0.15)",
            background: cat === "all" ? "rgba(139,37,0,0.06)" : "transparent", color: cat === "all" ? "#8B2500" : "#6B5B4F",
            cursor: "pointer",
          }}>All</button>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", padding: "0.5rem 1rem",
              borderRadius: "20px", border: cat === c ? "2px solid #8B2500" : "1px solid rgba(111,78,55,0.15)",
              background: cat === c ? "rgba(139,37,0,0.06)" : "transparent", color: cat === c ? "#8B2500" : "#6B5B4F",
              cursor: "pointer",
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map(s => (
            <div key={s.id} style={{
              background: "#fff", borderRadius: "10px", padding: "1.25rem",
              borderLeft: "4px solid #8B2500", border: "1px solid rgba(111,78,55,0.08)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C1810" }}>
                  #{s.rank} {s.brand}
                </h3>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", padding: "0.25rem 0.6rem",
                  borderRadius: "10px", background: "rgba(139,37,0,0.06)", color: "#8B2500",
                }}>{s.category}</span>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.5rem" }}>{s.evidence}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999" }}>
                  Severity: {s.severity}/100
                </div>
                {s.response && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", fontStyle: "italic", maxWidth: "60%" }}>{s.response}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Browse Clean Coffees", path: "/brewsoul/browse", description: "Find the good stuff" },
        { label: "Mold-Free Verified", path: "/brewsoul/mold-free", description: "Tested & clean" },
        { label: "Chain Rankings", path: "/brewsoul/chains", description: "Who's actually good?" },
      ]} />
    </BrewSoulLayout>
    </>);
}

/* ──────────────────── FOLLOW THE DOLLAR ──────────────────── */
export function BrewSoulDollar() {
  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
          Transparency
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Follow the Dollar
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          When you pay for a bag of specialty coffee, where does that money actually go?
          We break down the supply chain economics at every price point.
        </p>

        {DOLLAR_BREAKDOWNS.map(db => {
          const segs = [
            { label: "Farmer", pct: db.farmerPct },
            { label: "Exporter", pct: db.exporterPct },
            { label: "Importer", pct: db.importerPct },
            { label: "Roaster", pct: db.roasterPct },
            { label: "Retailer", pct: db.retailerPct },
          ];
          return (
            <div key={db.id} style={{ marginBottom: "2.5rem", background: "#fff", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(111,78,55,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{db.segment}</h3>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#6F4E37", marginBottom: "1rem" }}>
                Farmer gets: ${db.farmerDollars.toFixed(2)} of ${db.totalPrice}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {segs.map(seg => (
                  <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6B5B4F", width: "70px", textAlign: "right" }}>{seg.label}</span>
                    <div style={{ flex: 1, height: "20px", borderRadius: "4px", background: "rgba(111,78,55,0.04)", overflow: "hidden" }}>
                      <div style={{
                        width: `${seg.pct}%`, height: "100%", borderRadius: "4px",
                        background: seg.label === "Farmer"
                          ? `linear-gradient(90deg, ${db.farmerPct >= 20 ? "#4A7C59" : db.farmerPct >= 10 ? "#C5A23C" : "#8B2500"}, ${db.farmerPct >= 20 ? "#6B9E6B" : db.farmerPct >= 10 ? "#D4B96A" : "#C04030"})`
                          : "linear-gradient(90deg, #8B6914, #A68B3C)",
                      }} />
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", fontWeight: 700, color: "#2C1810", width: "40px" }}>{seg.pct}%</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", fontStyle: "italic", marginTop: "0.75rem", lineHeight: 1.6 }}>{db.commentary}</p>
            </div>
          );
        })}
      </section>
      <NextSteps steps={[
        { label: "Farm Profiles", path: "/brewsoul/farms", description: "Meet the growers" },
        { label: "Economics Deep Dive", path: "/brewsoul/economics", description: "The full picture" },
        { label: "Shanita Nicholas Interview", path: "/brewsoul/guest/shanita-nicholas", description: "Fair Trade theater exposed" },
        { label: "Browse Ethical Coffees", path: "/brewsoul/browse", description: "Vote with your cup" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── HEALTH ──────────────────── */
export function BrewSoulHealth() {
  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4A7C59", marginBottom: "0.5rem" }}>
          Science, Not Marketing
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Coffee & Health
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          What does the actual science say? We separate peer-reviewed evidence from wellness marketing.
          Every claim is rated and cited.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {HEALTH_CLAIMS.map(h => (
            <div key={h.id} style={{
              background: "#fff", borderRadius: "10px", padding: "1.25rem",
              border: "1px solid rgba(111,78,55,0.08)",
              borderLeft: `4px solid ${h.type === "benefit" ? "#4A7C59" : "#C5A23C"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C1810" }}>{h.title}</h3>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", padding: "0.25rem 0.6rem",
                  borderRadius: "10px", textTransform: "uppercase",
                  background: h.type === "benefit" ? "rgba(74,124,89,0.08)" : "rgba(197,162,60,0.08)",
                  color: h.type === "benefit" ? "#4A7C59" : "#C5A23C",
                }}>{h.type}</span>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.5rem" }}>{h.detail}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {h.citation && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999" }}>{h.citation}</div>}
                {h.magnitude && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#4A7C59", fontWeight: 600 }}>{h.magnitude}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Mold-Free Verified", path: "/brewsoul/mold-free", description: "Tested & clean" },
        { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find healthy options" },
        { label: "Processing Methods", path: "/brewsoul/processing", description: "How it's made matters" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── FARM PASSPORT ──────────────────── */
export function BrewSoulFarms() {
  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4A7C59", marginBottom: "0.5rem" }}>
          Origin Stories
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Farm Passports
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Meet the people who grow your coffee. Every farm profiled here has been verified
          for transparency, fair labor practices, and environmental stewardship.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {FARMS.map(f => (
            <div key={f.id} style={{
              background: "#fff", borderRadius: "12px", padding: "1.5rem",
              border: "1px solid rgba(111,78,55,0.08)",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.35rem" }}>
                {f.country} · {f.region}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.35rem" }}>{f.name}</h3>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6F4E37", marginBottom: "0.75rem" }}>
                {f.producer} {f.altitude ? `· ${f.altitude}` : ""}
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.75rem" }}>{f.story}</p>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {f.varieties.map(v => (
                  <span key={v} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                    padding: "0.2rem 0.5rem", borderRadius: "12px",
                    background: "rgba(74,124,89,0.06)", color: "#4A7C59",
                  }}>{v}</span>
                ))}
              </div>
              {f.certifications.length > 0 && (
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  {f.certifications.map(c => (
                    <span key={c} style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                      padding: "0.2rem 0.5rem", borderRadius: "12px",
                      background: "rgba(197,162,60,0.06)", color: "#8B6914",
                    }}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", description: "Where your money goes" },
        { label: "Economics", path: "/brewsoul/economics", description: "The supply chain" },
        { label: "Browse Farm Coffees", path: "/brewsoul/browse", description: "Taste the origin" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── MOLD-FREE ──────────────────── */
export function BrewSoulMoldFree() {
  const verified = COFFEES.filter(c => c.moldTestStatus === "verified");
  const claims = COFFEES.filter(c => c.moldTestStatus === "claims");
  const untested = COFFEES.filter(c => !c.moldTestStatus || c.moldTestStatus === "untested");

  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4A7C59", marginBottom: "0.5rem" }}>
          Clean Coffee
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Mold-Free Verified
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Mycotoxin contamination is real but overhyped by wellness marketers. Here's what the
          science actually says, and which coffees have been independently tested.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { n: verified.length, label: "Verified Clean", color: "#4A7C59" },
            { n: claims.length, label: "Claims Clean", color: "#C5A23C" },
            { n: untested.length, label: "Untested", color: "#999" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", background: "rgba(111,78,55,0.03)", borderRadius: "10px", padding: "1.25rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "2rem", fontWeight: 700, color: s.color }}>{s.n}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#6B5B4F" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>
          ✓ Independently Verified
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {verified.map(c => (
            <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#fff", borderRadius: "8px", padding: "0.85rem 1rem",
                border: "1px solid rgba(74,124,89,0.15)", cursor: "pointer",
              }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2C1810" }}>{c.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6F4E37" }}>{c.producer}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#4A7C59" }}>
                  {c.moldTestSource || "Third-party tested"}
                </div>
              </div>
            </Link>
          ))}
          {verified.length === 0 && <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#999" }}>No verified coffees yet.</p>}
        </div>

        {claims.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>
              ⚠ Claims Clean (Unverified)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {claims.map(c => (
                <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#fff", borderRadius: "8px", padding: "0.85rem 1rem",
                    border: "1px solid rgba(197,162,60,0.15)", cursor: "pointer",
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2C1810" }}>{c.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6F4E37" }}>{c.producer}</div>
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#C5A23C" }}>Self-reported</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      <NextSteps steps={[
        { label: "Health Claims", path: "/brewsoul/health", description: "What science says" },
        { label: "Wall of Shame", path: "/brewsoul/wall-of-shame", description: "Who's failing" },
        { label: "Browse Clean Coffees", path: "/brewsoul/browse", description: "Find verified options" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── EXPERIENCE MAP ──────────────────── */
export function BrewSoulExperiences() {
  const [selected, setSelected] = useState("all");
  const countries = Array.from(new Set(EXPERIENCES.map(e => e.country)));

  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
          Beyond the Cup
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Experience Map
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2rem" }}>
          The best coffee experiences in the world — from origin farm tours to legendary cafés,
          cupping labs, and immersive roastery visits. Curated, not sponsored.
        </p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <button onClick={() => setSelected("all")} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", padding: "0.5rem 1rem",
            borderRadius: "20px", border: selected === "all" ? "2px solid #6F4E37" : "1px solid rgba(111,78,55,0.15)",
            background: selected === "all" ? "rgba(111,78,55,0.06)" : "transparent", color: selected === "all" ? "#6F4E37" : "#6B5B4F",
            cursor: "pointer",
          }}>All</button>
          {countries.map(r => (
            <button key={r} onClick={() => setSelected(r)} style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", padding: "0.5rem 1rem",
              borderRadius: "20px", border: selected === r ? "2px solid #6F4E37" : "1px solid rgba(111,78,55,0.15)",
              background: selected === r ? "rgba(111,78,55,0.06)" : "transparent", color: selected === r ? "#6F4E37" : "#6B5B4F",
              cursor: "pointer",
            }}>{r}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {(selected === "all" ? EXPERIENCES : EXPERIENCES.filter(e => e.country === selected)).map(exp => (
            <div key={exp.id} style={{
              background: "#fff", borderRadius: "12px", padding: "1.25rem",
              border: "1px solid rgba(111,78,55,0.08)",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.25rem" }}>
                {exp.type} · {exp.country}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{exp.name}</h3>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#6F4E37", marginBottom: "0.5rem" }}>{exp.location}</div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.6 }}>{exp.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                {exp.price && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#4A7C59" }}>{exp.price}</span>}
                {exp.url && <a href={exp.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6F4E37" }}>Visit →</a>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Food Pairings", path: "/brewsoul/pairings", description: "Perfect combinations" },
        { label: "Blend Builder", path: "/brewsoul/blend-builder", description: "Create your own" },
        { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find your next cup" },
      ]} />
    </BrewSoulLayout>
  );
}
