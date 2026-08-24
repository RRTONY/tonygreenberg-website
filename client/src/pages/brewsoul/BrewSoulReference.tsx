/**
 * BrewSoul Reference Pages — Varieties, Processing, Roasters, Glossary, Pairings, Economics
 */
import { useState } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { VARIETIES, PROCESSING_METHODS, ROASTERS, GLOSSARY, PAIRINGS, FLIGHTS, DOLLAR_BREAKDOWNS } from "@/data/brewsoul-encyclopedia";
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";

const H = { fontFamily: "'Playfair Display', serif" } as const;
const M = { fontFamily: "'DM Mono', monospace" } as const;
const S = { fontFamily: "'Source Sans 3', sans-serif" } as const;
const EYE = { ...M, fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase" as const, marginBottom: "0.5rem" };
const TITLE = { ...H, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" };
const DESC = { ...S, fontSize: "0.95rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "2.5rem" };
const CARD = { background: "#fff", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(111,78,55,0.08)" };
const TAG = (color: string) => ({ ...M, fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: `${color}10`, color });
const WRAP = { padding: "3rem 1.5rem", maxWidth: "900px", margin: "0 auto" };

/* ──────────────────── VARIETY ENCYCLOPEDIA ──────────────────── */
export function BrewSoulVarieties() {
  const [search, setSearch] = useState("");
  const filtered = VARIETIES.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <SEO
        title="Coffee Reference — BrewSoul"
        description="The definitive reference for specialty coffee terminology, processing methods, and brewing science."
        path="/brewsoul/reference"
        keywords="Tony Greenberg, coffee reference, coffee terminology, brewing science"
        indexable={true}
      />
      <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#4A7C59" }}>Botany Meets Flavor</div>
        <h1 style={TITLE}>Variety Encyclopedia</h1>
        <p style={DESC}>
          Every coffee variety has a story — where it was discovered, how it mutated, what it tastes like.
          This is the most comprehensive variety guide outside the World Coffee Research catalog.
        </p>
        <input type="text" placeholder="Search varieties..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", marginBottom: "1.5rem", background: "rgba(111,78,55,0.02)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {filtered.map(v => (
            <div key={v.id} style={CARD}>
              <div style={{ ...EYE, color: "#C5A23C", fontSize: "0.62rem" }}>{v.species} · {v.origin}</div>
              <h3 style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.35rem" }}>{v.name}</h3>
              <p style={{ ...S, fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.5rem" }}>{v.description}</p>
              <p style={{ ...S, fontSize: "0.82rem", color: "#4A7C59", fontStyle: "italic", marginTop: "0.25rem" }}>{v.cupProfile}</p>
              {v.yieldLevel && <div style={{ ...M, fontSize: "0.68rem", color: "#999", marginTop: "0.5rem" }}>Yield: {v.yieldLevel} · Resistance: {v.diseaseResistance || "unknown"}</div>}
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Processing Methods", path: "/brewsoul/processing", description: "How it's made" },
        { label: "Roaster Profiles", path: "/brewsoul/roasters", description: "Who roasts it" },
        { label: "Browse by Variety", path: "/brewsoul/browse", description: "Taste the difference" },
      ]} />
    </BrewSoulLayout>
    </>);
}

/* ──────────────────── PROCESSING DEEP-DIVE ──────────────────── */
export function BrewSoulProcessing() {
  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#6F4E37" }}>From Cherry to Cup</div>
        <h1 style={TITLE}>Processing Methods</h1>
        <p style={DESC}>How a coffee cherry is processed after picking determines up to 60% of its final flavor.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {PROCESSING_METHODS.map(pm => (
            <div key={pm.id} style={{ ...CARD, borderLeft: "4px solid #6F4E37" }}>
              <h3 style={{ ...H, fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.35rem" }}>{pm.name}</h3>
              <p style={{ ...S, fontSize: "0.9rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "0.75rem" }}>{pm.description}</p>
              <div style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#4A7C59", marginBottom: "0.25rem" }}>Flavor Impact</div>
              <p style={{ ...S, fontSize: "0.85rem", color: "#4A7C59", fontStyle: "italic" }}>{pm.flavorImpact}</p>
              <div style={{ ...M, fontSize: "0.68rem", color: "#999", marginTop: "0.5rem" }}>Complexity: {pm.complexity}/10 · Category: {pm.category}</div>
              {pm.controversy && <p style={{ ...S, fontSize: "0.82rem", color: "#8B6914", fontStyle: "italic", marginTop: "0.5rem" }}>{pm.controversy}</p>}
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Varieties Guide", path: "/brewsoul/varieties", description: "Bean types explained" },
        { label: "Farm Profiles", path: "/brewsoul/farms", description: "Where it grows" },
        { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find your method" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── ROASTER DIRECTORY ──────────────────── */
export function BrewSoulRoasters() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const filtered = ROASTERS.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !(r.country + " " + (r.region || "")).toLowerCase().includes(search.toLowerCase())) return false;
    if (tier !== "all") {
      const grade = r.overallGrade;
      if (tier === "legendary" && grade !== "A") return false;
      if (tier === "exceptional" && grade !== "B") return false;
      if (tier === "excellent" && !"CD".includes(grade)) return false;
    }
    return true;
  });

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>Who Roasts What Matters</div>
        <h1 style={TITLE}>Roaster Directory</h1>
        <p style={DESC}>We profile the roasters that source transparently, roast with intention, and pay farmers fairly.</p>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search roasters..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "200px", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", background: "rgba(111,78,55,0.02)" }} />
          <select value={tier} onChange={e => setTier(e.target.value)} style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...M, fontSize: "0.78rem", background: "#fff" }}>
            <option value="all">All Tiers</option>
            <option value="legendary">Grade A</option>
            <option value="exceptional">Grade B</option>
            <option value="excellent">Grade C/D</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filtered.map(r => (
            <div key={r.id} style={CARD}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                <h3 style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810" }}>{r.name}</h3>
                <span style={TAG(r.overallGrade === "A" ? "#C5A23C" : r.overallGrade === "B" ? "#4A7C59" : "#6F4E37")}>Grade {r.overallGrade}</span>
              </div>
              <div style={{ ...M, fontSize: "0.68rem", color: "#6F4E37", marginBottom: "0.5rem" }}>{r.country}{r.region ? `, ${r.region}` : ""}</div>
              <p style={{ ...S, fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.5rem" }}>{r.philosophy || r.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", ...M, fontSize: "0.68rem", color: "#999" }}>
                <span>Quality: {r.qualityScore}</span><span>·</span>
                <span>Transparency: {r.transparencyScore}</span><span>·</span>
                <span>Equity: {r.farmerEquityGrade}</span>
              </div>
              {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ ...M, fontSize: "0.68rem", color: "#C5A23C", marginTop: "0.5rem", display: "inline-block" }}>Visit →</a>}
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Browse Their Coffees", path: "/brewsoul/browse", description: "Taste their work" },
        { label: "Compare Coffees", path: "/brewsoul/compare", description: "Side by side" },
        { label: "New Drops", path: "/brewsoul/drops", description: "Latest releases" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── GLOSSARY ──────────────────── */
export function BrewSoulGlossary() {
  const [search, setSearch] = useState("");
  const filtered = GLOSSARY.filter(g => !search || g.term.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce<Record<string, typeof GLOSSARY>>((acc, g) => {
    const letter = g.term[0].toUpperCase();
    (acc[letter] = acc[letter] || []).push(g);
    return acc;
  }, {});

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#6F4E37" }}>Speak Coffee</div>
        <h1 style={TITLE}>Glossary</h1>
        <p style={DESC}>Every term you need to navigate specialty coffee without feeling like an outsider.</p>
        <input type="text" placeholder="Search terms..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", marginBottom: "1.5rem", background: "rgba(111,78,55,0.02)" }} />
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
          <div key={letter} style={{ marginBottom: "1.5rem" }}>
            <div style={{ ...H, fontSize: "1.5rem", fontWeight: 700, color: "#C5A23C", marginBottom: "0.5rem", borderBottom: "1px solid rgba(111,78,55,0.08)", paddingBottom: "0.25rem" }}>{letter}</div>
            {terms.map(g => (
              <div key={g.id} style={{ marginBottom: "0.75rem" }}>
                <dt style={{ ...H, fontSize: "1rem", fontWeight: 700, color: "#2C1810" }}>{g.term}</dt>
                <dd style={{ ...S, fontSize: "0.88rem", color: "#6B5B4F", lineHeight: 1.6, margin: "0.15rem 0 0 0" }}>{g.definition}</dd>
                {g.category && <span style={{ ...TAG("#6F4E37"), marginTop: "0.25rem", display: "inline-block" }}>{g.category}</span>}
              </div>
            ))}
          </div>
        ))}
      </section>
      <NextSteps steps={[
        { label: "Varieties Guide", path: "/brewsoul/varieties", description: "Deep dive" },
        { label: "Processing Methods", path: "/brewsoul/processing", description: "How it's made" },
        { label: "Browse Catalog", path: "/brewsoul/browse", description: "Apply what you learned" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── PAIRINGS ──────────────────── */
export function BrewSoulPairings() {
  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>The Perfect Match</div>
        <h1 style={TITLE}>Coffee Pairings</h1>
        <p style={DESC}>What you eat with your coffee matters. These pairings are based on flavor chemistry, not vibes.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {PAIRINGS.map((p, i) => (
            <div key={i} style={CARD}>
              <h3 style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>{p.origin}</h3>
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#4A7C59", marginBottom: "0.25rem" }}>Pairs well with:</div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>{p.foods.map(f => <span key={f} style={TAG("#4A7C59")}>{f}</span>)}</div>
              </div>
              {p.drinks && p.drinks.length > 0 && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <div style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#6F4E37", marginBottom: "0.25rem" }}>Drink pairings:</div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>{p.drinks.map(d => <span key={d} style={TAG("#6F4E37")}>{d}</span>)}</div>
                </div>
              )}
              {p.antiPairings && p.antiPairings.length > 0 && (
                <div>
                  <div style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#8B2500", marginBottom: "0.25rem" }}>Avoid:</div>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>{p.antiPairings.map(a => <span key={a} style={TAG("#8B2500")}>{a}</span>)}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 style={{ ...H, fontSize: "1.4rem", fontWeight: 700, color: "#2C1810", marginTop: "3rem", marginBottom: "1rem" }}>Curated Flights</h2>
        <p style={{ ...S, fontSize: "0.9rem", color: "#6B5B4F", lineHeight: 1.7, marginBottom: "1.5rem" }}>Three-coffee tasting progressions designed to teach your palate something new.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {FLIGHTS.map(f => (
            <div key={f.id} style={{ ...CARD, borderLeft: "4px solid #C5A23C" }}>
              <h3 style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{f.name}</h3>
              <p style={{ ...S, fontSize: "0.85rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "0.5rem" }}>{f.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {f.coffeeIds.map((cid, i) => {
                  const coffee = COFFEES.find(c => c.id === cid);
                  return coffee ? (
                    <Link key={cid} href={`/brewsoul/coffee/${cid}`} style={{ textDecoration: "none" }}>
                      <span style={{ ...M, fontSize: "0.72rem", padding: "0.35rem 0.75rem", borderRadius: "16px", background: "rgba(197,162,60,0.08)", color: "#8B6914", cursor: "pointer" }}>
                        {i + 1}. {coffee.name}
                      </span>
                    </Link>
                  ) : <span key={cid} style={TAG("#999")}>{cid}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Experiences", path: "/brewsoul/experiences", description: "Coffee moments" },
        { label: "Blend Builder", path: "/brewsoul/blend-builder", description: "Create your own" },
        { label: "Browse Catalog", path: "/brewsoul/browse", description: "Find the pairing" },
      ]} />
    </BrewSoulLayout>
  );
}

/* ──────────────────── ECONOMICS DASHBOARD ──────────────────── */
export function BrewSoulEconomics() {
  const avgFarmerPct = DOLLAR_BREAKDOWNS.reduce((sum, d) => sum + d.farmerPct, 0) / DOLLAR_BREAKDOWNS.length;
  const priced = COFFEES.filter(c => c.priceUsd);
  const avgPrice = priced.length ? priced.reduce((sum, c) => sum + (c.priceUsd || 0), 0) / priced.length : 0;
  const origins = Array.from(new Set(COFFEES.map(c => c.originCountry)));

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>The Numbers</div>
        <h1 style={TITLE}>Economics Dashboard</h1>
        <p style={DESC}>The specialty coffee economy at a glance — pricing trends, farmer equity, and the real cost of your morning cup.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Coffees", value: COFFEES.length, color: "#6F4E37" },
            { label: "Origins", value: origins.length, color: "#4A7C59" },
            { label: "Avg $/Bag", value: `$${avgPrice.toFixed(0)}`, color: "#C5A23C" },
            { label: "Farmer Share", value: `${avgFarmerPct.toFixed(0)}%`, color: avgFarmerPct >= 15 ? "#4A7C59" : "#8B2500" },
            { label: "Roasters", value: ROASTERS.length, color: "#6F4E37" },
            { label: "Varieties", value: VARIETIES.length, color: "#4A7C59" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", background: "rgba(111,78,55,0.03)", borderRadius: "10px", padding: "1.25rem" }}>
              <div style={{ ...M, fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ ...M, fontSize: "0.72rem", color: "#6B5B4F" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ ...H, fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Price Distribution</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {[{ range: "<$15", min: 0, max: 15 }, { range: "$15–25", min: 15, max: 25 }, { range: "$25–40", min: 25, max: 40 }, { range: "$40–75", min: 40, max: 75 }, { range: "$75+", min: 75, max: 9999 }].map(b => {
            const count = COFFEES.filter(c => c.priceUsd && c.priceUsd >= b.min && c.priceUsd < b.max).length;
            const pct = COFFEES.length ? (count / COFFEES.length) * 100 : 0;
            return (
              <div key={b.range} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ ...M, fontSize: "0.72rem", color: "#6B5B4F", width: "60px", textAlign: "right" }}>{b.range}</span>
                <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: "rgba(111,78,55,0.04)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, #6F4E37, #A68B3C)", minWidth: count > 0 ? "4px" : "0" }} />
                </div>
                <span style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#2C1810", width: "25px" }}>{count}</span>
              </div>
            );
          })}
        </div>

        <h2 style={{ ...H, fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "1rem" }}>Top Origins</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {origins.map(o => ({ origin: o, count: COFFEES.filter(c => c.originCountry === o).length }))
            .sort((a, b) => b.count - a.count).slice(0, 10).map(o => (
              <div key={o.origin} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ ...M, fontSize: "0.72rem", color: "#6B5B4F", width: "90px", textAlign: "right" }}>{o.origin}</span>
                <div style={{ flex: 1, height: "22px", borderRadius: "4px", background: "rgba(111,78,55,0.04)", overflow: "hidden" }}>
                  <div style={{ width: `${(o.count / COFFEES.length) * 100}%`, height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, #4A7C59, #6B9E6B)", minWidth: "4px" }} />
                </div>
                <span style={{ ...M, fontSize: "0.72rem", fontWeight: 700, color: "#2C1810", width: "25px" }}>{o.count}</span>
              </div>
            ))}
        </div>
      </section>
      <NextSteps steps={[
        { label: "Follow the Dollar", path: "/brewsoul/follow-the-dollar", description: "Your money's path" },
        { label: "Farm Profiles", path: "/brewsoul/farms", description: "Meet the growers" },
        { label: "Chain Rankings", path: "/brewsoul/chains", description: "Who pays fairly?" },
      ]} />
    </BrewSoulLayout>
  );
}
