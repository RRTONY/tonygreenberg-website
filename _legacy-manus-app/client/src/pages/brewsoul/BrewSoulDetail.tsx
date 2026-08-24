import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { computeQPR, computeAvailability, computeScarcity, computeWow, computeTier, tierEmoji, gradeColor } from "@/lib/intelligence-engine/scoring";
import BrewSoulLayout from "./BrewSoulLayout";
import JourneyBar from "./JourneyBar";

function FlavorBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#6B5B4F", width: "80px", textAlign: "right" }}>{label}</span>
      <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "rgba(111,78,55,0.08)" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #6F4E37, #C5A23C)", transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#2C1810", width: "24px" }}>{value}</span>
    </div>
  );
}

export default function BrewSoulDetail() {
  const params = useParams<{ id: string }>();
  const coffee = COFFEES.find(c => c.id === params.id);

  const scores = useMemo(() => {
    if (!coffee) return null;
    return {
      qpr: computeQPR(coffee, COFFEES),
      availability: computeAvailability(coffee),
      scarcity: computeScarcity(coffee),
      wow: computeWow(coffee),
      tier: computeTier(coffee.cuppingScore || 0),
    };
  }, [coffee]);

  if (!coffee || !scores) {
    return (
      <BrewSoulLayout>
        <div style={{ textAlign: "center", padding: "6rem 1.5rem" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#2C1810" }}>Coffee Not Found</h1>
          <Link href="/brewsoul/browse" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#6F4E37" }}>← Back to catalog</Link>
        </div>
      </BrewSoulLayout>
    );
  }

  const pricePerGram = (coffee.priceUsd / coffee.unitGrams).toFixed(2);
  const flavorEntries = Object.entries(coffee.flavorProfile);

  return (
    <>
    <BrewSoulLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#999", marginBottom: "2rem" }}>
          <Link href="/brewsoul" style={{ color: "#6F4E37", textDecoration: "none" }}>BrewSoul</Link>
          {" → "}
          <Link href="/brewsoul/browse" style={{ color: "#6F4E37", textDecoration: "none" }}>Browse</Link>
          {" → "}{coffee.name}
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.25rem" }}>
              {tierEmoji(scores.tier)} Tier {scores.tier}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", lineHeight: 1.2, marginBottom: "0.35rem" }}>
              {coffee.name}
            </h1>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F4E37" }}>
              by {coffee.producer}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "2rem", fontWeight: 700, color: scores.qpr >= 80 ? "#4A7C59" : scores.qpr >= 60 ? "#C5A23C" : "#8B2500" }}>
              QPR {scores.qpr}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#999" }}>
              ${coffee.priceUsd} / {coffee.unitGrams}g (${pricePerGram}/g)
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem",
          marginBottom: "2.5rem",
        }}>
          {[
            { label: "Origin", value: `${coffee.originCountry}, ${coffee.originRegion}` },
            { label: "Variety", value: coffee.variety },
            { label: "Processing", value: coffee.processingMethod },
            { label: "Roast", value: coffee.roastLevel || "—" },
            { label: "Cupping", value: `${coffee.cuppingScore || "—"} (${coffee.cuppingSource || "—"})` },
            { label: "Altitude", value: coffee.altitude ? `${coffee.altitude}m` : "—" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(111,78,55,0.03)", borderRadius: "8px", padding: "0.75rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.25rem" }}>{s.label}</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#2C1810" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tasting notes */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.75rem" }}>Tasting Notes</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {coffee.tastingNotes.map(n => (
              <span key={n} style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem",
                padding: "0.4rem 0.85rem", borderRadius: "20px",
                background: "rgba(111,78,55,0.06)", color: "#6F4E37",
              }}>{n}</span>
            ))}
          </div>
        </div>

        {/* Flavor profile */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Flavor Profile</h2>
          {flavorEntries.map(([key, val]) => (
            <FlavorBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
          ))}
        </div>

        {/* Scores breakdown */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Intelligence Scores</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            {[
              { label: "QPR", value: scores.qpr, desc: "Quality-to-Price Ratio", color: scores.qpr >= 80 ? "#4A7C59" : scores.qpr >= 60 ? "#C5A23C" : "#8B2500" },
              { label: "Availability", value: scores.availability, desc: "How easy to get", color: scores.availability >= 70 ? "#4A7C59" : "#C5A23C" },
              { label: "Scarcity", value: scores.scarcity, desc: "Rarity & exclusivity", color: scores.scarcity >= 70 ? "#8B4585" : "#6B5B4F" },
              { label: "Wow Factor", value: scores.wow, desc: "Uniqueness & interest", color: scores.wow >= 70 ? "#C5A23C" : "#6B5B4F" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: "10px", padding: "1rem", border: "1px solid rgba(111,78,55,0.08)" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.5rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", fontWeight: 600, color: "#2C1810", marginBottom: "0.15rem" }}>{s.label}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "#999" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Transparency & Ethics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <div style={{ background: "rgba(111,78,55,0.03)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.25rem" }}>Transparency Grade</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.5rem", fontWeight: 700, color: gradeColor(coffee.producerTransparencyGrade) }}>{coffee.producerTransparencyGrade}</div>
            </div>
            {coffee.farmerSharePct != null && (
              <div style={{ background: "rgba(111,78,55,0.03)", borderRadius: "8px", padding: "1rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.25rem" }}>Farmer Share</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.5rem", fontWeight: 700, color: (coffee.farmerSharePct || 0) >= 30 ? "#4A7C59" : "#C5A23C" }}>{coffee.farmerSharePct}%</div>
                {coffee.farmerShareUsd != null && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#6B5B4F" }}>${coffee.farmerShareUsd} per bag</div>}
              </div>
            )}
            {coffee.cMarketPremiumPct != null && (
              <div style={{ background: "rgba(111,78,55,0.03)", borderRadius: "8px", padding: "1rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.25rem" }}>C-Market Premium</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.5rem", fontWeight: 700, color: "#4A7C59" }}>+{coffee.cMarketPremiumPct}%</div>
              </div>
            )}
            <div style={{ background: "rgba(111,78,55,0.03)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: "0.25rem" }}>Mold Test</div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.92rem", fontWeight: 700,
                color: coffee.moldTestStatus === "verified" ? "#4A7C59" : coffee.moldTestStatus === "claims" ? "#C5A23C" : "#999",
              }}>
                {coffee.moldTestStatus === "verified" ? "✓ Verified Clean" : coffee.moldTestStatus === "claims" ? "Claims Clean" : coffee.moldTestStatus === "failed" ? "✗ Failed" : "Untested"}
              </div>
              {coffee.moldTestSource && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#999" }}>{coffee.moldTestSource}</div>}
            </div>
          </div>
        </div>

        {/* Buy links */}
        {coffee.buyLinks.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Where to Buy</h2>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {coffee.buyLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "0.75rem 1.5rem", borderRadius: "6px",
                  background: i === 0 ? "linear-gradient(135deg, #6F4E37, #8B6914)" : "transparent",
                  color: i === 0 ? "#FAFAF7" : "#6F4E37",
                  border: i === 0 ? "none" : "1px solid rgba(111,78,55,0.2)",
                  textDecoration: "none",
                }}>{link.label} →</a>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#BBB", marginTop: "0.5rem" }}>
              We don't take affiliate commissions. These are editorial picks.
            </p>
          </div>
        )}

        {/* Competition wins */}
        {coffee.competitionWins && coffee.competitionWins.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.75rem" }}>Competition Wins</h2>
            {coffee.competitionWins.map((w, i) => (
              <div key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#6B5B4F", padding: "0.35rem 0" }}>🏆 {w}</div>
            ))}
          </div>
        )}

        {/* Similar Coffees */}
        {(() => {
          const similar = COFFEES.filter(c => c.id !== coffee.id && (c.originCountry === coffee.originCountry || c.originRegion === coffee.originRegion)).slice(0, 3);
          if (similar.length === 0) return null;
          return (
            <div style={{ borderTop: "1px solid rgba(111,78,55,0.08)", paddingTop: "2rem", marginTop: "2rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>You Might Also Like</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {similar.map(c => {
                  const qpr = computeQPR(c, COFFEES);
                  const tier = computeTier(qpr);
                  return (
                    <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        padding: "1rem", borderRadius: "10px",
                        background: "rgba(111,78,55,0.03)", border: "1px solid rgba(111,78,55,0.08)",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(111,78,55,0.08)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                      >
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{c.name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6B5B4F" }}>{c.originCountry} · {tierEmoji(tier)} QPR {qpr.toFixed(1)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Journey CTAs */}
        <div style={{ borderTop: "1px solid rgba(111,78,55,0.08)", paddingTop: "2rem", marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <Link href="/brewsoul/browse" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#6F4E37", textDecoration: "none" }}>← Back to catalog</Link>
          <span style={{ color: "rgba(111,78,55,0.2)" }}>·</span>
          <Link href="/brewsoul/quiz" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#C5A23C", textDecoration: "none" }}>Take the Taste Quiz →</Link>
          <span style={{ color: "rgba(111,78,55,0.2)" }}>·</span>
          <Link href="/brewsoul/compare" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#C5A23C", textDecoration: "none" }}>Compare Coffees →</Link>
        </div>
      </div>
    </BrewSoulLayout>
    <JourneyBar />
    <div style={{ height: "80px" }} />
    </>
  );
}
