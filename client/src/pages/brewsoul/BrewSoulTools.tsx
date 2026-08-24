/**
 * BrewSoul Tools — Compare, Blend Builder, Drops, Collection, Submit/Appeal, Prescription
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { COFFEES } from "@/data/brewsoul-coffees";
import { computeQPR, computeWow, computeAvailability, computeTier, computeFreshness } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

function computeScores(c: CatalogItem) {
  const all = COFFEES;
  const qpr = computeQPR(c, all);
  const availability = computeAvailability(c);
  const wow = computeWow(c);
  const overall = (qpr + availability + wow) / 3;
  const tier = computeTier(c.cuppingScore || 80);
  const freshness = computeFreshness(c);
  return { qpr, availability, wow, overall, tier, freshness };
}
import BrewSoulLayout from "./BrewSoulLayout";
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

/* ──────────────────── COMPARE TOOL ──────────────────── */
export function BrewSoulCompare() {
  const [ids, setIds] = useState<string[]>([]);
  const scored = useMemo(() => COFFEES.map(c => ({ ...c, scores: computeScores(c) })), []);
  const selected = scored.filter(c => ids.includes(c.id));

  const addCoffee = (id: string) => {
    if (ids.length < 4 && !ids.includes(id)) setIds([...ids, id]);
  };
  const removeCoffee = (id: string) => setIds(ids.filter(x => x !== id));

  const dims = ["qpr", "availability", "wow", "overall"] as const;

  return (
    <>
    <SEO
        title="Coffee Tools — BrewSoul"
        description="Calculators, converters, and tools for specialty coffee professionals and enthusiasts."
        path="/brewsoul/tools"
        keywords="Tony Greenberg, coffee tools, coffee calculator, brewing tools"
        indexable={true}
      />
      <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>Side by Side</div>
        <h1 style={TITLE}>Compare Coffees</h1>
        <p style={DESC}>Select up to 4 coffees to compare scores, flavor profiles, and value.</p>

        {/* Selector */}
        <select
          onChange={e => { addCoffee(e.target.value); e.target.value = ""; }}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", marginBottom: "1rem", background: "#fff" }}
        >
          <option value="">+ Add a coffee to compare...</option>
          {scored.filter(c => !ids.includes(c.id)).map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.producer}</option>
          ))}
        </select>

        {/* Selected pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {selected.map(c => (
            <span key={c.id} onClick={() => removeCoffee(c.id)} style={{
              ...M, fontSize: "0.72rem", padding: "0.35rem 0.75rem", borderRadius: "16px",
              background: "rgba(197,162,60,0.1)", color: "#8B6914", cursor: "pointer",
            }}>
              {c.name} ✕
            </span>
          ))}
        </div>

        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#999", ...S }}>
            Select coffees above to start comparing.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", ...S, fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(111,78,55,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 0.5rem", ...M, fontSize: "0.72rem", color: "#999" }}>Metric</th>
                  {selected.map(c => (
                    <th key={c.id} style={{ textAlign: "center", padding: "0.75rem 0.5rem", ...H, fontSize: "0.9rem", color: "#2C1810" }}>
                      <Link href={`/brewsoul/coffee/${c.id}`} style={{ color: "#2C1810", textDecoration: "none" }}>{c.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Origin", fn: (c: typeof selected[0]) => `${c.originCountry}` },
                  { label: "Producer", fn: (c: typeof selected[0]) => c.producer },
                  { label: "Variety", fn: (c: typeof selected[0]) => c.variety },
                  { label: "Process", fn: (c: typeof selected[0]) => c.processingMethod },
                  { label: "Price", fn: (c: typeof selected[0]) => c.priceUsd ? `$${c.priceUsd}` : "—" },
                  { label: "Cupping", fn: (c: typeof selected[0]) => c.cuppingScore ? `${c.cuppingScore}` : "—" },
                  ...dims.map(d => ({ label: d.toUpperCase(), fn: (c: typeof selected[0]) => `${c.scores[d].toFixed(1)}` })),
                  { label: "Tier", fn: (c: typeof selected[0]) => c.scores.tier },
                ].map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: "1px solid rgba(111,78,55,0.05)", background: i % 2 ? "rgba(111,78,55,0.02)" : "transparent" }}>
                    <td style={{ padding: "0.5rem", ...M, fontSize: "0.72rem", color: "#6B5B4F" }}>{row.label}</td>
                    {selected.map(c => (
                      <td key={c.id} style={{ textAlign: "center", padding: "0.5rem", color: "#2C1810" }}>{row.fn(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </BrewSoulLayout>
    </>);
}

/* ──────────────────── BLEND BUILDER ──────────────────── */
interface BlendPart { coffeeId: string; pct: number }

export function BrewSoulBlendBuilder() {
  const [parts, setParts] = useState<BlendPart[]>([]);
  const [name, setName] = useState("");

  const addPart = (coffeeId: string) => {
    if (parts.length < 5 && !parts.find(p => p.coffeeId === coffeeId)) {
      setParts([...parts, { coffeeId, pct: Math.floor(100 / (parts.length + 1)) }]);
    }
  };
  const removePart = (coffeeId: string) => setParts(parts.filter(p => p.coffeeId !== coffeeId));
  const updatePct = (coffeeId: string, pct: number) => setParts(parts.map(p => p.coffeeId === coffeeId ? { ...p, pct } : p));
  const totalPct = parts.reduce((s, p) => s + p.pct, 0);

  // Weighted average scores
  const blendScores = useMemo(() => {
    if (parts.length === 0 || totalPct === 0) return null;
    const weighted = parts.reduce((acc, p) => {
      const coffee = COFFEES.find(c => c.id === p.coffeeId);
      if (!coffee) return acc;
      const s = computeScores(coffee);
      const w = p.pct / totalPct;
      return { qpr: acc.qpr + s.qpr * w, wow: acc.wow + s.wow * w, overall: acc.overall + s.overall * w };
    }, { qpr: 0, wow: 0, overall: 0 });
    return weighted;
  }, [parts, totalPct]);

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#6F4E37" }}>Your Vision</div>
        <h1 style={TITLE}>Blend Builder</h1>
        <p style={DESC}>Combine up to 5 coffees. Adjust ratios. See how the blend scores. Name it something worthy.</p>

        <input type="text" placeholder="Name your blend..." value={name} onChange={e => setName(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...H, fontSize: "1.1rem", marginBottom: "1rem", background: "rgba(111,78,55,0.02)" }} />

        <select onChange={e => { addPart(e.target.value); e.target.value = ""; }}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", marginBottom: "1.5rem", background: "#fff" }}>
          <option value="">+ Add a coffee to your blend...</option>
          {COFFEES.filter(c => !parts.find(p => p.coffeeId === c.id)).map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.producer}</option>
          ))}
        </select>

        {parts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {parts.map(p => {
              const coffee = COFFEES.find(c => c.id === p.coffeeId);
              return coffee ? (
                <div key={p.coffeeId} style={{ ...CARD, display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...H, fontSize: "0.95rem", fontWeight: 700, color: "#2C1810" }}>{coffee.name}</div>
                    <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F" }}>{coffee.originCountry} · {coffee.variety}</div>
                  </div>
                  <input type="range" min={5} max={95} value={p.pct} onChange={e => updatePct(p.coffeeId, Number(e.target.value))}
                    style={{ width: "100px" }} />
                  <span style={{ ...M, fontSize: "0.85rem", fontWeight: 700, color: "#C5A23C", width: "40px", textAlign: "right" }}>{p.pct}%</span>
                  <button onClick={() => removePart(p.coffeeId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: "1.1rem" }}>✕</button>
                </div>
              ) : null;
            })}
            <div style={{ ...M, fontSize: "0.78rem", color: totalPct === 100 ? "#4A7C59" : "#8B2500", textAlign: "right" }}>
              Total: {totalPct}% {totalPct !== 100 && "(adjust to 100%)"}
            </div>
          </div>
        )}

        {blendScores && (
          <div style={{ ...CARD, background: "rgba(197,162,60,0.04)" }}>
            <div style={{ ...EYE, color: "#C5A23C" }}>Blend Profile{name ? `: "${name}"` : ""}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "0.75rem" }}>
              {[
                { label: "QPR", value: blendScores.qpr },
                { label: "Wow Factor", value: blendScores.wow },
                { label: "Overall", value: blendScores.overall },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ ...M, fontSize: "1.5rem", fontWeight: 700, color: "#C5A23C" }}>{s.value.toFixed(1)}</div>
                  <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </BrewSoulLayout>
  );
}

/* ──────────────────── DROPS (New Releases) ──────────────────── */
export function BrewSoulDrops() {
  const scored = useMemo(() =>
    COFFEES.map(c => ({ ...c, scores: computeScores(c) }))
      .sort((a, b) => (b.scores.overall || 0) - (a.scores.overall || 0))
      .slice(0, 12),
  []);

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#8B2500" }}>Fresh Off the Roaster</div>
        <h1 style={TITLE}>Latest Drops</h1>
        <p style={DESC}>The newest arrivals in specialty coffee — scored, reviewed, and ready for your grinder.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {scored.map(c => (
            <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
              <div style={{ ...CARD, cursor: "pointer", transition: "transform 0.2s", position: "relative" }}>
                <div style={{
                  position: "absolute", top: "0.75rem", right: "0.75rem",
                  ...M, fontSize: "0.62rem", padding: "0.2rem 0.5rem", borderRadius: "8px",
                  background: "rgba(139,37,0,0.08)", color: "#8B2500",
                }}>NEW</div>
                <div style={{ ...EYE, color: "#C5A23C", fontSize: "0.6rem" }}>{c.producer}</div>
                <h3 style={{ ...H, fontSize: "1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{c.name}</h3>
                <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F", marginBottom: "0.5rem" }}>
                  {c.originCountry} · {c.variety} · {c.processingMethod}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ ...M, fontSize: "0.85rem", fontWeight: 700, color: "#C5A23C" }}>
                    {c.priceUsd ? `$${c.priceUsd}` : "—"}
                  </span>
                  <span style={TAG(c.scores.tier <= 2 ? "#C5A23C" : "#4A7C59")}>{c.scores.tier}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </BrewSoulLayout>
  );
}

/* ──────────────────── MY COLLECTION ──────────────────── */
export function BrewSoulCollection() {
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("brewsoul-collection") || "[]"); } catch { return []; }
  });
  const toggle = (id: string) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem("brewsoul-collection", JSON.stringify(next));
  };
  const collection = COFFEES.filter(c => saved.includes(c.id));

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>Your Shelf</div>
        <h1 style={TITLE}>My Collection</h1>
        <p style={DESC}>Coffees you've saved, tried, or want to remember. Your personal catalog.</p>

        {collection.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ ...H, fontSize: "1.2rem", color: "#2C1810", marginBottom: "0.5rem" }}>Nothing here yet.</div>
            <p style={{ ...S, fontSize: "0.9rem", color: "#6B5B4F" }}>
              Browse the <Link href="/brewsoul/browse" style={{ color: "#C5A23C" }}>catalog</Link> and save coffees you love.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {collection.map(c => {
              const s = computeScores(c);
              return (
                <div key={c.id} style={CARD}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Link href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ ...H, fontSize: "1rem", fontWeight: 700, color: "#2C1810" }}>{c.name}</h3>
                    </Link>
                    <button onClick={() => toggle(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C5A23C", fontSize: "1.1rem" }}>♥</button>
                  </div>
                  <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F" }}>{c.producer} · {c.originCountry}</div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={TAG("#C5A23C")}>{s.tier}</span>
                    <span style={TAG("#6F4E37")}>{s.overall.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick add from full catalog */}
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ ...H, fontSize: "1.2rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.75rem" }}>Quick Add</h2>
          <select onChange={e => { toggle(e.target.value); e.target.value = ""; }}
            style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", background: "#fff" }}>
            <option value="">+ Add a coffee to your collection...</option>
            {COFFEES.filter(c => !saved.includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.producer}</option>
            ))}
          </select>
        </div>
      </section>
    </BrewSoulLayout>
  );
}

/* ──────────────────── SUBMIT / APPEAL ──────────────────── */
export function BrewSoulSubmit() {
  const [form, setForm] = useState({ name: "", roaster: "", url: "", notes: "", type: "submit" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to a tRPC endpoint
    localStorage.setItem("brewsoul-submission-" + Date.now(), JSON.stringify(form));
    setSent(true);
  };

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#4A7C59" }}>Your Voice Matters</div>
        <h1 style={TITLE}>Submit or Appeal</h1>
        <p style={DESC}>
          Know a coffee we're missing? Think we scored something wrong? This is your channel.
          Every submission gets reviewed. Every appeal gets a fair hearing.
        </p>

        {sent ? (
          <div style={{ ...CARD, textAlign: "center", padding: "3rem" }}>
            <div style={{ ...H, fontSize: "1.3rem", color: "#2C1810", marginBottom: "0.5rem" }}>Received.</div>
            <p style={{ ...S, fontSize: "0.9rem", color: "#6B5B4F" }}>We'll review your {form.type === "submit" ? "submission" : "appeal"} and update accordingly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {["submit", "appeal"].map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                  style={{
                    ...M, fontSize: "0.78rem", padding: "0.5rem 1.25rem", borderRadius: "8px",
                    border: form.type === t ? "2px solid #C5A23C" : "1px solid rgba(111,78,55,0.15)",
                    background: form.type === t ? "rgba(197,162,60,0.08)" : "#fff",
                    color: form.type === t ? "#8B6914" : "#6B5B4F", cursor: "pointer",
                  }}>
                  {t === "submit" ? "Submit a Coffee" : "Appeal a Score"}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Coffee name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem" }} />
            <input type="text" placeholder="Roaster" value={form.roaster} onChange={e => setForm({ ...form, roaster: e.target.value })}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem" }} />
            <input type="url" placeholder="Link (optional)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem" }} />
            <textarea placeholder={form.type === "submit" ? "Why should we add this coffee?" : "What did we get wrong and why?"} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={4}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.9rem", resize: "vertical" }} />
            <button type="submit" style={{
              ...M, fontSize: "0.85rem", letterSpacing: "0.15em", padding: "0.85rem 2rem",
              borderRadius: "8px", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #6F4E37, #A68B3C)", color: "#fff",
            }}>
              {form.type === "submit" ? "SUBMIT FOR REVIEW" : "FILE APPEAL"}
            </button>
          </form>
        )}
      </section>
    </BrewSoulLayout>
  );
}

/* ──────────────────── PRESCRIPTION (Identity-Aware Smart Matcher) ──────────────────── */

const IDENTITY_PROFILES: Record<string, {
  name: string; badge: string; color: string;
  flavorBias: string[]; processBias: string[]; originBias: string[];
  priceRange: [number, number]; description: string;
  chainRecs: string[];
}> = {
  "terroir-purist": {
    name: "The Terroir Purist", badge: "🌿", color: "#4A7C59",
    flavorBias: ["floral", "citrus", "tea-like", "jasmine", "bergamot", "delicate", "clean", "bright", "crisp"],
    processBias: ["washed", "wet-hulled"],
    originBias: ["Ethiopia", "Kenya", "Colombia", "Guatemala", "Panama"],
    priceRange: [18, 80],
    description: "Light roasts, washed processing, single origins. The bean speaks.",
    chainRecs: ["Intelligentsia", "Counter Culture", "Blue Bottle", "Onyx Coffee Lab"],
  },
  "fermentation-explorer": {
    name: "The Fermentation Explorer", badge: "🧪", color: "#8B4585",
    flavorBias: ["funky", "wine", "tropical", "fermented", "boozy", "exotic", "wild", "complex", "unusual"],
    processBias: ["anaerobic", "natural", "carbonic maceration", "honey", "experimental"],
    originBias: ["Ethiopia", "Colombia", "Costa Rica", "Panama", "Ecuador"],
    priceRange: [22, 120],
    description: "Anaerobic, carbonic maceration, thermal shock. Coffee that questions what coffee IS.",
    chainRecs: ["Onyx Coffee Lab", "Black & White Coffee", "Proud Mary", "Sey Coffee"],
  },
  "ritual-architect": {
    name: "The Ritual Architect", badge: "🎭", color: "#6F4E37",
    flavorBias: ["balanced", "sweet", "caramel", "chocolate", "nutty", "smooth", "round", "comforting"],
    processBias: ["washed", "honey", "natural"],
    originBias: ["Colombia", "Brazil", "Guatemala", "Ethiopia", "Costa Rica"],
    priceRange: [15, 45],
    description: "The making is the meditation. Every variable is intentional.",
    chainRecs: ["Blue Bottle", "Stumptown", "Verve", "La Colombe"],
  },
  "impact-alchemist": {
    name: "The Impact Alchemist", badge: "🌍", color: "#C5A23C",
    flavorBias: ["chocolate", "nutty", "caramel", "earthy", "spice", "warm", "honest"],
    processBias: ["washed", "natural", "honey"],
    originBias: ["Ethiopia", "Rwanda", "Colombia", "Peru", "Guatemala", "Honduras"],
    priceRange: [14, 35],
    description: "Where the dollar goes matters as much as what's in the cup.",
    chainRecs: ["Counter Culture", "Equator Coffees", "Café Grumpy", "Devoción"],
  },
  "pressure-seeker": {
    name: "The Pressure Seeker", badge: "☕", color: "#8B2500",
    flavorBias: ["chocolate", "caramel", "nutty", "bold", "intense", "crema", "thick", "syrupy", "espresso"],
    processBias: ["washed", "natural", "honey"],
    originBias: ["Brazil", "Colombia", "Guatemala", "Ethiopia", "Indonesia"],
    priceRange: [14, 40],
    description: "Espresso is your language. Crema is your metric. Intensity, body, speed.",
    chainRecs: ["La Colombe", "Stumptown", "Lavazza", "Illy"],
  },
  "the-awakening": {
    name: "The Awakening", badge: "✨", color: "#D4A574",
    flavorBias: ["sweet", "chocolate", "caramel", "smooth", "approachable", "easy", "balanced"],
    processBias: ["washed", "natural"],
    originBias: ["Colombia", "Brazil", "Ethiopia", "Guatemala"],
    priceRange: [12, 28],
    description: "You want better than Starbucks. That's exactly why we built this.",
    chainRecs: ["Blue Bottle", "La Colombe", "Peet's Coffee", "Stumptown"],
  },
};

export function BrewSoulPrescription() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(typeof COFFEES[0] & { matchScore: number; matchReason: string })[]>([]);
  const [searched, setSearched] = useState(false);
  const [showIdentity, setShowIdentity] = useState(true);

  // Get saved identity
  const identityId = typeof window !== "undefined" ? localStorage.getItem("brewsoul-identity") : null;
  const identity = identityId ? IDENTITY_PROFILES[identityId] : null;

  const search = () => {
    const q = query.toLowerCase();
    const keywords = q.split(/\s+/).filter(Boolean);

    const scored = COFFEES.map(c => {
      let score = 0;
      let reasons: string[] = [];
      const text = [c.name, c.producer, c.originCountry, c.originRegion, c.variety, c.processingMethod, c.connoisseurNote || "", ...(c.tastingNotes || [])].join(" ").toLowerCase();

      // Keyword matching
      for (const kw of keywords) {
        if (text.includes(kw)) score += 1;
        if (c.tastingNotes?.some(f => f.toLowerCase().includes(kw))) { score += 2; reasons.push(`Flavor: ${kw}`); }
        if (c.originCountry.toLowerCase().includes(kw)) { score += 1.5; reasons.push(`Origin: ${c.originCountry}`); }
        if (c.processingMethod.toLowerCase().includes(kw)) { score += 1; reasons.push(`Process: ${c.processingMethod}`); }
      }

      // Price keyword handling
      const priceMatch = q.match(/under\s*\$?(\d+)/);
      if (priceMatch && c.priceUsd) {
        const maxPrice = parseInt(priceMatch[1]);
        if (c.priceUsd <= maxPrice) { score += 3; reasons.push(`Under $${maxPrice}`); }
        else score -= 2;
      }

      // Identity-based boosting
      if (identity && showIdentity) {
        // Flavor bias
        const flavorMatches = c.tastingNotes?.filter(f =>
          identity.flavorBias.some(bias => f.toLowerCase().includes(bias))
        ) || [];
        if (flavorMatches.length > 0) {
          score += flavorMatches.length * 0.5;
          if (keywords.length === 0) reasons.push(`Matches your palate`);
        }

        // Process bias
        if (identity.processBias.some(p => c.processingMethod.toLowerCase().includes(p.toLowerCase()))) {
          score += 0.75;
        }

        // Origin bias
        if (identity.originBias.some(o => c.originCountry.includes(o))) {
          score += 0.5;
        }

        // Price range preference
        if (c.priceUsd && c.priceUsd >= identity.priceRange[0] && c.priceUsd <= identity.priceRange[1]) {
          score += 0.5;
        }
      }

      return { ...c, matchScore: score, matchReason: reasons.slice(0, 3).join(" · ") || "Catalog match" };
    });

    // If no keywords, show identity-based recommendations
    if (keywords.length === 0 && identity && showIdentity) {
      const identityRecs = scored
        .filter(c => c.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8);
      setResults(identityRecs);
    } else {
      setResults(scored.filter(x => x.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8));
    }
    setSearched(true);
  };

  // Auto-show identity recs on load
  const identityRecs = useMemo(() => {
    if (!identity) return [];
    return COFFEES.map(c => {
      let score = 0;
      const flavorMatches = c.tastingNotes?.filter(f =>
        identity.flavorBias.some(bias => f.toLowerCase().includes(bias))
      ) || [];
      score += flavorMatches.length * 1.5;
      if (identity.processBias.some(p => c.processingMethod.toLowerCase().includes(p.toLowerCase()))) score += 1;
      if (identity.originBias.some(o => c.originCountry.includes(o))) score += 0.75;
      if (c.priceUsd && c.priceUsd >= identity.priceRange[0] && c.priceUsd <= identity.priceRange[1]) score += 0.5;
      const s = computeScores(c);
      score += s.overall * 0.1; // Slight quality boost
      return { ...c, matchScore: score, matchReason: "Matched to your identity" };
    }).filter(x => x.matchScore > 1).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  }, [identity]);

  return (
    <BrewSoulLayout>
      <section style={WRAP}>
        <div style={{ ...EYE, color: "#C5A23C" }}>Personalized Intelligence</div>
        <h1 style={TITLE}>The Prescription</h1>
        <p style={DESC}>
          Describe what you're craving — "something fruity and light for morning" or
          "a heavy, chocolatey espresso under $25" — and we'll match you.
          {identity ? " Results are personalized to your BrewSoul identity." : ""}
        </p>

        {/* Identity banner */}
        {identity && (
          <div style={{
            background: `${identity.color}08`, borderRadius: "10px", padding: "1rem 1.25rem",
            border: `1px solid ${identity.color}20`, marginBottom: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{identity.badge}</span>
              <div>
                <div style={{ ...H, fontSize: "0.95rem", fontWeight: 700, color: "#2C1810" }}>{identity.name}</div>
                <div style={{ ...S, fontSize: "0.82rem", color: "#6B5B4F" }}>{identity.description}</div>
              </div>
            </div>
            <button onClick={() => setShowIdentity(!showIdentity)} style={{
              ...M, fontSize: "0.68rem", padding: "0.35rem 0.75rem", borderRadius: "16px",
              border: "1px solid rgba(111,78,55,0.15)", cursor: "pointer",
              background: showIdentity ? `${identity.color}15` : "transparent",
              color: showIdentity ? identity.color : "#999",
            }}>
              {showIdentity ? "Identity ON" : "Identity OFF"}
            </button>
          </div>
        )}

        {/* Search */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input type="text" placeholder={identity ? `What does a ${identity.name} crave today?` : "I want something..."}
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            style={{ flex: 1, padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid rgba(111,78,55,0.15)", ...S, fontSize: "0.95rem", background: "rgba(111,78,55,0.02)" }} />
          <button onClick={search} style={{
            ...M, fontSize: "0.78rem", letterSpacing: "0.15em", padding: "0.85rem 1.5rem",
            borderRadius: "8px", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #6F4E37, #A68B3C)", color: "#fff",
          }}>PRESCRIBE</button>
        </div>

        {/* Quick prompts — identity-aware */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {(identity
            ? [...identity.flavorBias.slice(0, 3), ...identity.originBias.slice(0, 2), "under $25"]
            : ["fruity and light", "chocolatey espresso", "Ethiopian natural", "under $20", "rare and exotic", "clean and bright"]
          ).map(p => (
            <button key={p} onClick={() => { setQuery(p); }} style={{
              ...M, fontSize: "0.68rem", padding: "0.35rem 0.75rem", borderRadius: "16px",
              background: "rgba(111,78,55,0.04)", border: "1px solid rgba(111,78,55,0.1)",
              color: "#6B5B4F", cursor: "pointer",
            }}>{p}</button>
          ))}
        </div>

        {/* Identity-based recommendations (before search) */}
        {!searched && identity && showIdentity && identityRecs.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ ...EYE, color: identity.color, marginBottom: "1rem" }}>Curated for {identity.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {identityRecs.map(c => {
                const s = computeScores(c);
                return (
                  <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ ...CARD, cursor: "pointer", borderLeft: `3px solid ${identity.color}` }}>
                      <div style={{ ...EYE, color: "#C5A23C", fontSize: "0.6rem" }}>{c.producer}</div>
                      <h3 style={{ ...H, fontSize: "1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{c.name}</h3>
                      <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F", marginBottom: "0.35rem" }}>
                        {c.originCountry} · {c.variety} · {c.processingMethod}
                      </div>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                        {c.tastingNotes?.slice(0, 4).map(f => <span key={f} style={TAG("#4A7C59")}>{f}</span>)}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ ...M, fontSize: "0.85rem", fontWeight: 700, color: "#C5A23C" }}>{c.priceUsd ? `$${c.priceUsd}` : "—"}</span>
                        <span style={TAG("#6F4E37")}>{s.overall.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Chain recommendations */}
            <div style={{ marginTop: "2rem" }}>
              <div style={{ ...M, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B5B4F", marginBottom: "0.75rem" }}>
                Chains for {identity.name}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {identity.chainRecs.map(name => (
                  <Link key={name} href="/brewsoul/chains" style={{ textDecoration: "none" }}>
                    <div style={{
                      ...M, fontSize: "0.78rem", padding: "0.5rem 1rem", borderRadius: "8px",
                      background: "#fff", border: `1px solid ${identity.color}30`,
                      color: "#2C1810", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "0.35rem",
                    }}>
                      <span style={{ color: identity.color }}>★</span> {name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No identity prompt */}
        {!searched && !identity && (
          <div style={{
            textAlign: "center", padding: "2rem", marginBottom: "2rem",
            background: "rgba(197,162,60,0.04)", borderRadius: "12px",
            border: "1px solid rgba(197,162,60,0.12)",
          }}>
            <div style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              Want personalized recommendations?
            </div>
            <p style={{ ...S, fontSize: "0.88rem", color: "#6B5B4F", marginBottom: "1rem" }}>
              Take the BrewSoul assessment to unlock identity-matched prescriptions.
            </p>
            <Link href="/brewsoul" style={{
              ...M, fontSize: "0.78rem", letterSpacing: "0.15em", padding: "0.65rem 1.25rem",
              borderRadius: "8px", textDecoration: "none", display: "inline-block",
              background: "linear-gradient(135deg, #6F4E37, #A68B3C)", color: "#fff",
            }}>
              TAKE THE QUIZ
            </Link>
          </div>
        )}

        {/* Search results */}
        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999", ...S }}>
            No matches found. Try different keywords — origins, flavors, or processes work best.
          </div>
        )}

        {searched && results.length > 0 && (
          <div>
            <div style={{ ...M, fontSize: "0.72rem", color: "#999", marginBottom: "1rem" }}>
              {results.length} matches{identity && showIdentity ? " (identity-weighted)" : ""}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {results.map(c => {
                const s = computeScores(c);
                return (
                  <Link key={c.id} href={`/brewsoul/coffee/${c.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ ...CARD, cursor: "pointer" }}>
                      <div style={{ ...EYE, color: "#C5A23C", fontSize: "0.6rem" }}>{c.producer}</div>
                      <h3 style={{ ...H, fontSize: "1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>{c.name}</h3>
                      <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F", marginBottom: "0.35rem" }}>
                        {c.originCountry} · {c.variety} · {c.processingMethod}
                      </div>
                      {c.matchReason && (
                        <div style={{ ...M, fontSize: "0.62rem", color: identity?.color || "#C5A23C", marginBottom: "0.35rem" }}>
                          {c.matchReason}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                        {c.tastingNotes?.slice(0, 4).map(f => <span key={f} style={TAG("#4A7C59")}>{f}</span>)}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ ...M, fontSize: "0.85rem", fontWeight: 700, color: "#C5A23C" }}>{c.priceUsd ? `$${c.priceUsd}` : "—"}</span>
                        <span style={TAG("#6F4E37")}>{s.overall.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Explore chains CTA */}
        <div style={{
          marginTop: "3rem", textAlign: "center", padding: "2rem",
          background: "rgba(111,78,55,0.03)", borderRadius: "12px",
          border: "1px solid rgba(111,78,55,0.08)",
        }}>
          <div style={{ ...H, fontSize: "1.1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
            Looking for a chain near you?
          </div>
          <p style={{ ...S, fontSize: "0.85rem", color: "#6B5B4F", marginBottom: "1rem" }}>
            We've ranked the top 100 coffee chains in America across 5 dimensions.
          </p>
          <Link href="/brewsoul/chains" style={{
            ...M, fontSize: "0.78rem", letterSpacing: "0.15em", padding: "0.65rem 1.25rem",
            borderRadius: "8px", textDecoration: "none", display: "inline-block",
            background: "linear-gradient(135deg, #6F4E37, #A68B3C)", color: "#fff",
          }}>
            VIEW CHAIN RANKINGS →
          </Link>
        </div>
      </section>
    </BrewSoulLayout>
  );
}
