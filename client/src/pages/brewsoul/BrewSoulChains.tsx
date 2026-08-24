/**
 * BrewSoul Chain Rankings — Top 100 Coffee Chains
 * Scored across 5 dimensions with aggregate composite
 */
import { useState, useMemo } from "react";
import { CHAIN_RANKINGS, type ChainEntry } from "@/data/brewsoul-chains";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

const H = { fontFamily: "'Playfair Display', serif" } as const;
const M = { fontFamily: "'DM Mono', monospace" } as const;
const S = { fontFamily: "'Source Sans 3', sans-serif" } as const;

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: "rgba(197,162,60,0.12)", text: "#8B6914", label: "S — Exceptional" },
  A: { bg: "rgba(74,124,89,0.1)", text: "#4A7C59", label: "A — Excellent" },
  B: { bg: "rgba(111,78,55,0.08)", text: "#6F4E37", label: "B — Good" },
  C: { bg: "rgba(153,153,153,0.1)", text: "#666", label: "C — Average" },
  D: { bg: "rgba(139,37,0,0.06)", text: "#8B2500", label: "D — Below Average" },
  F: { bg: "rgba(139,37,0,0.12)", text: "#8B2500", label: "F — Avoid" },
};

const TYPE_LABELS: Record<string, string> = {
  specialty: "Specialty",
  premium: "Premium",
  "mass-market": "Mass Market",
  "fast-food": "Fast Food",
};

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "rgba(111,78,55,0.06)", overflow: "hidden" }}>
        <div style={{
          width: `${(value / max) * 100}%`, height: "100%", borderRadius: "3px",
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          transition: "width 0.6s ease",
        }} />
      </div>
      <span style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color, width: "24px", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ChainCard({ chain, expanded, onToggle }: { chain: ChainEntry; expanded: boolean; onToggle: () => void }) {
  const tc = TIER_COLORS[chain.tier];
  return (
    <div
      onClick={onToggle}
      style={{
        background: "#fff", borderRadius: "12px", padding: "1.25rem",
        border: "1px solid rgba(111,78,55,0.08)",
        borderLeft: `4px solid ${tc.text}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <span style={{ ...M, fontSize: "1.1rem", fontWeight: 700, color: tc.text }}>#{chain.rank}</span>
            <h3 style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", margin: 0 }}>{chain.name}</h3>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ ...M, fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "10px", background: tc.bg, color: tc.text }}>{chain.tier}-Tier</span>
            <span style={{ ...M, fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "10px", background: "rgba(111,78,55,0.05)", color: "#6B5B4F" }}>{TYPE_LABELS[chain.type]}</span>
            <span style={{ ...M, fontSize: "0.62rem", color: "#999" }}>{chain.hq} · {chain.locations.toLocaleString()} locations · Est. {chain.founded}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ ...M, fontSize: "1.5rem", fontWeight: 700, color: tc.text }}>{chain.aggregate}</div>
          <div style={{ ...M, fontSize: "0.58rem", color: "#999", textTransform: "uppercase" }}>Score</div>
        </div>
      </div>

      {/* Verdict */}
      <p style={{ ...S, fontSize: "0.88rem", color: "#6B5B4F", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: expanded ? "1rem" : 0 }}>
        {chain.verdict}
      </p>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: "0.5rem" }}>
          {/* Score breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.5rem", marginBottom: "1rem" }}>
            {[
              { label: "Coffee Quality", value: chain.scores.coffeeQuality, weight: "30%" },
              { label: "Value (QPR)", value: chain.scores.value, weight: "25%" },
              { label: "Sourcing Ethics", value: chain.scores.sourcingEthics, weight: "20%" },
              { label: "Experience", value: chain.scores.experience, weight: "15%" },
              { label: "Consistency", value: chain.scores.consistency, weight: "10%" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F" }}>{s.label}</span>
                  <span style={{ ...M, fontSize: "0.58rem", color: "#999" }}>{s.weight}</span>
                </div>
                <ScoreBar value={s.value} color={s.value >= 7 ? "#4A7C59" : s.value >= 5 ? "#C5A23C" : "#8B2500"} />
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ ...M, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4A7C59", marginBottom: "0.35rem" }}>Strengths</div>
              {chain.strengths.map(s => (
                <div key={s} style={{ ...S, fontSize: "0.82rem", color: "#2C1810", padding: "0.15rem 0", display: "flex", gap: "0.35rem" }}>
                  <span style={{ color: "#4A7C59" }}>+</span> {s}
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...M, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B2500", marginBottom: "0.35rem" }}>Weaknesses</div>
              {chain.weaknesses.map(w => (
                <div key={w} style={{ ...S, fontSize: "0.82rem", color: "#2C1810", padding: "0.15rem 0", display: "flex", gap: "0.35rem" }}>
                  <span style={{ color: "#8B2500" }}>−</span> {w}
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {chain.signatureDrink && (
              <div style={{ ...M, fontSize: "0.72rem", color: "#6B5B4F" }}>
                <span style={{ color: "#C5A23C" }}>★</span> Signature: {chain.signatureDrink}
              </div>
            )}
            <div style={{ ...M, fontSize: "0.72rem", color: "#6B5B4F" }}>{chain.priceRange}</div>
            {chain.website && (
              <a href={chain.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ ...M, fontSize: "0.72rem", color: "#C5A23C", textDecoration: "none" }}>
                Visit →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrewSoulChains() {
  const [filter, setFilter] = useState<"all" | ChainEntry["type"]>("all");
  const [tierFilter, setTierFilter] = useState<"all" | ChainEntry["tier"]>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const filtered = useMemo(() => {
    let list = [...CHAIN_RANKINGS];
    if (filter !== "all") list = list.filter(c => c.type === filter);
    if (tierFilter !== "all") list = list.filter(c => c.tier === tierFilter);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.hq.toLowerCase().includes(q) ||
        c.verdict.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, tierFilter, searchQ]);

  // Tier distribution
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    CHAIN_RANKINGS.forEach(c => counts[c.tier]++);
    return counts;
  }, []);

  return (
    <BrewSoulLayout>
      <section style={{ padding: "3rem 1.5rem", maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ ...M, fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C5A23C", marginBottom: "0.5rem" }}>
          The Definitive Ranking
        </div>
        <h1 style={{ ...H, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
          Top 100 Coffee Chains
        </h1>
        <p style={{ ...S, fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "1rem" }}>
          Every major coffee chain in America, objectively scored across five dimensions:
          Coffee Quality (30%), Value (25%), Sourcing Ethics (20%), Experience (15%), and Consistency (10%).
          Aggregate scores from consumer reviews, expert panels, transparency audits, and direct trade data.
        </p>

        {/* ─── CONTEXTUAL INTRO ─── */}
        <div style={{
          background: "rgba(111,78,55,0.04)",
          border: "1px solid rgba(111,78,55,0.12)",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
        }}>
          <p style={{ ...S, fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.65, marginBottom: "0.5rem" }}>
            <strong style={{ color: "#6F4E37" }}>What you're looking at:</strong> The only ranking that unifies consumer reviews, expert cupping scores, sourcing audits, and transparency data into a single composite grade for every major coffee chain. S-tier means exceptional across all five dimensions. F-tier means you deserve better.
          </p>
          <p style={{ ...S, fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.65, marginBottom: "0.5rem" }}>
            <strong style={{ color: "#6F4E37" }}>Why it matters:</strong> You're spending $5–$7 per cup. That's $1,500–$2,500 a year. This tells you whether you're getting quality, ethics, and experience for that money — or just marketing.
          </p>
          <p style={{ ...S, fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: "#6F4E37" }}>What to do:</strong> Filter by tier badge to see the best (or worst). Click any chain to expand its full scoring breakdown. Use the search bar to find your go-to chain and see how it stacks up.
          </p>
        </div>

        {/* Methodology note */}
        <div style={{
          background: "rgba(197,162,60,0.06)", borderRadius: "10px", padding: "1rem 1.25rem",
          border: "1px solid rgba(197,162,60,0.15)", marginBottom: "2rem",
        }}>
          <div style={{ ...M, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.35rem" }}>
            Scoring Methodology
          </div>
          <p style={{ ...S, fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.6, margin: 0 }}>
            Each dimension is scored 1–10 by aggregating Google reviews (4M+), Yelp reviews (2M+),
            SCA judge evaluations, specialty press ratings (Sprudge, Daily Coffee News, Barista Magazine),
            B Corp certifications, direct trade audit reports, and blind cupping panels.
            The weighted composite produces a 0–100 aggregate score that determines tier placement.
          </p>
        </div>

        {/* Tier distribution */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {(["S", "A", "B", "C", "D", "F"] as const).map(t => {
            const tc = TIER_COLORS[t];
            return (
              <button key={t} onClick={() => setTierFilter(tierFilter === t ? "all" : t)}
                style={{
                  ...M, fontSize: "0.72rem", padding: "0.4rem 0.75rem", borderRadius: "8px",
                  border: tierFilter === t ? `2px solid ${tc.text}` : "1px solid rgba(111,78,55,0.1)",
                  background: tierFilter === t ? tc.bg : "transparent",
                  color: tc.text, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.35rem",
                }}>
                {t} <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>({tierCounts[t]})</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
      <SEO
        title="Coffee Supply Chains — BrewSoul"
        description="Transparency into specialty coffee supply chains from farm to cup."
        path="/brewsoul/supply-chains"
        keywords="Tony Greenberg, coffee supply chain, coffee transparency, farm to cup"
        indexable={true}
      />
          {(["all", "specialty", "premium", "mass-market", "fast-food"] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                ...M, fontSize: "0.68rem", padding: "0.35rem 0.75rem", borderRadius: "16px",
                border: filter === t ? "2px solid #6F4E37" : "1px solid rgba(111,78,55,0.1)",
                background: filter === t ? "rgba(111,78,55,0.06)" : "transparent",
                color: filter === t ? "#6F4E37" : "#6B5B4F", cursor: "pointer",
              }}>
              {t === "all" ? "All Types" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text" placeholder="Search chains by name, location, or keyword..."
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          style={{
            width: "100%", padding: "0.75rem 1rem", borderRadius: "8px",
            border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem",
            background: "rgba(111,78,55,0.02)", marginBottom: "1.5rem",
          }}
        />

        {/* Results count */}
        <div style={{ ...M, fontSize: "0.72rem", color: "#999", marginBottom: "1rem" }}>
          Showing {filtered.length} of {CHAIN_RANKINGS.length} chains
        </div>

        {/* Chain list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map(chain => (
            <ChainCard
              key={chain.id}
              chain={chain}
              expanded={expandedId === chain.id}
              onToggle={() => setExpandedId(expandedId === chain.id ? null : chain.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#999", ...S }}>
            No chains match your filters. Try adjusting your criteria.
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: "3rem", textAlign: "center", padding: "2rem",
          background: "rgba(111,78,55,0.03)", borderRadius: "12px",
          border: "1px solid rgba(111,78,55,0.08)",
        }}>
          <div style={{ ...H, fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
            Think we got it wrong?
          </div>
          <p style={{ ...S, fontSize: "0.88rem", color: "#6B5B4F", marginBottom: "1rem" }}>
            Every ranking is an argument. If you have evidence that a chain should move up or down,
            submit an appeal with data and we'll review it.
          </p>
          <a href="/brewsoul/submit" style={{
            ...M, fontSize: "0.78rem", letterSpacing: "0.15em", padding: "0.75rem 1.5rem",
            borderRadius: "8px", textDecoration: "none", display: "inline-block",
            background: "linear-gradient(135deg, #6F4E37, #A68B3C)", color: "#fff",
          }}>
            FILE AN APPEAL
          </a>
        </div>
      </section>
      <NextSteps steps={[
        { label: "Browse Top Coffees", path: "/brewsoul/browse", description: "Find better options" },
        { label: "Take the Taste Quiz", path: "/brewsoul/quiz", description: "Get matched" },
        { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", description: "Where your money goes" },
      ]} />
    </BrewSoulLayout>
  );
}
