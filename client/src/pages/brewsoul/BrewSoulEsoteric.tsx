/**
 * BrewSoul Esoteric Coffee Index
 * "Where To Actually Buy The Legendary Coffees"
 * Editorial broadsheet style matching site palette.
 */
import BrewSoulLayout from "./BrewSoulLayout";
import NextSteps from "./NextSteps";
import SEO from "@/components/SEO";
import {
  ESOTERIC_COFFEES,
  EXPLORER_SCORES,
  ACQUISITION_PRIORITY,
  FINAL_OBSERVATION,
  type EsotericCoffee,
} from "@/data/brewsoul-esoteric";

/* ── Colors ── */
const C = {
  ink: "#0A0A10",
  parch: "#FAFAF7",
  gold: "#8B6914",
  goldLight: "#D4B96A",
  cream: "#f5efe0",
  bark: "#2d1810",
  bone: "#e8dcc8",
  smoke: "#6b5a4e",
  rust: "#8b4c2a",
  sage: "#4a5e3c",
  white: "#ffffff",
};

/* ── Typography ── */
const F = {
  d: "'Playfair Display',Georgia,serif",
  b: "'Source Sans 3',Georgia,serif",
  m: "'DM Mono','JetBrains Mono',monospace",
};

/* ── Shared Components ── */
const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: F.m, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.smoke, marginBottom: 12, opacity: 0.8 }}>
    {children}
  </div>
);

const RarityDots = ({ score }: { score: number }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: i < score ? C.gold : "rgba(139,105,20,0.15)",
          transition: "background 0.3s",
        }}
      />
    ))}
    <span style={{ fontFamily: F.m, fontSize: 11, color: C.smoke, marginLeft: 6 }}>{score}/10</span>
  </div>
);

const TastingPills = ({ notes }: { notes: string[] }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
    {notes.map((note) => (
      <span
        key={note}
        style={{
          fontFamily: F.m,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 20,
          background: "rgba(139,105,20,0.08)",
          color: C.gold,
          border: "1px solid rgba(139,105,20,0.2)",
        }}
      >
        {note}
      </span>
    ))}
  </div>
);

/* ── Coffee Card ── */
const CoffeeCard = ({ coffee }: { coffee: EsotericCoffee }) => (
  <div
    style={{
      background: C.white,
      border: "1px solid rgba(139,105,20,0.12)",
      borderRadius: 12,
      padding: "28px 32px",
      marginBottom: 20,
      transition: "box-shadow 0.3s, transform 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.12)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h3 style={{ fontFamily: F.d, fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.2 }}>
          {coffee.name}
        </h3>
        {coffee.origin && (
          <span style={{ fontFamily: F.m, fontSize: 11, color: C.smoke, letterSpacing: 2, textTransform: "uppercase" }}>
            {coffee.origin}
          </span>
        )}
      </div>
      <div style={{ fontFamily: F.m, fontSize: 18, fontWeight: 700, color: C.gold, whiteSpace: "nowrap" }}>
        {coffee.typicalCost}
      </div>
    </div>

    {/* Why It Matters */}
    <p style={{ fontFamily: F.b, fontSize: 16, lineHeight: 1.6, color: C.bark, margin: "14px 0 12px", fontStyle: "italic" }}>
      {coffee.whyItMatters}
    </p>

    {/* Tasting Notes */}
    <TastingPills notes={coffee.tastingNotes} />

    {/* Rarity */}
    <div style={{ marginTop: 16 }}>
      <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.smoke }}>RARITY</span>
      <RarityDots score={coffee.rarity} />
    </div>

    {/* Buy Sources */}
    {coffee.buySources.length > 0 && (
      <div style={{ marginTop: 18 }}>
        <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.smoke, display: "block", marginBottom: 8 }}>
          WHERE TO BUY
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {coffee.buySources.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: F.m,
                fontSize: 11,
                letterSpacing: 0.5,
                padding: "6px 14px",
                borderRadius: 8,
                background: C.ink,
                color: C.goldLight,
                textDecoration: "none",
                transition: "background 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.goldLight; }}
            >
              {src.name} {src.note ? `(${src.note})` : ""} →
            </a>
          ))}
        </div>
      </div>
    )}

    {/* Additional Sources */}
    {coffee.additionalSources && coffee.additionalSources.length > 0 && (
      <div style={{ marginTop: 12 }}>
        <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.smoke, display: "block", marginBottom: 6 }}>
          ADDITIONAL SOURCES
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {coffee.additionalSources.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: F.m,
                fontSize: 10,
                color: C.gold,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              {src.name}
            </a>
          ))}
        </div>
      </div>
    )}

    {/* Note */}
    {coffee.note && (
      <p style={{ fontFamily: F.b, fontSize: 13, color: C.smoke, marginTop: 12, fontStyle: "italic", opacity: 0.8 }}>
        ⚠ {coffee.note}
      </p>
    )}

    {/* Reference */}
    {coffee.references && (
      <p style={{ fontFamily: F.b, fontSize: 12, color: C.smoke, marginTop: 10, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 10, lineHeight: 1.5 }}>
        {coffee.references}
      </p>
    )}
  </div>
);

/* ── Main Page ── */
export default function BrewSoulEsoteric() {
  const tier1 = ESOTERIC_COFFEES.filter((c) => c.tier === 1);
  const tier2 = ESOTERIC_COFFEES.filter((c) => c.tier === 2);

  return (
    <>
    <SEO
        title="Esoteric Coffee — BrewSoul"
        description="Rare, unusual, and experimental coffees for the serious enthusiast."
        path="/brewsoul/esoteric"
        keywords="Tony Greenberg, rare coffee, experimental coffee, esoteric coffee"
        indexable={true}
      />
      <BrewSoulLayout>
      <div style={{ background: C.parch, minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ padding: "clamp(60px,10vw,120px) 20px 60px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <Label>BREWSOUL INTELLIGENCE</Label>
          <h1 style={{ fontFamily: F.d, fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, color: C.ink, lineHeight: 1.1, margin: "0 0 16px" }}>
            Esoteric Coffee Index
          </h1>
          <p style={{ fontFamily: F.d, fontSize: "clamp(18px,2.5vw,24px)", color: C.gold, fontStyle: "italic", margin: "0 0 24px" }}>
            Where To Actually Buy The Legendary Coffees
          </p>
          <p style={{ fontFamily: F.b, fontSize: 16, color: C.smoke, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Most coffee drinkers never encounter these. Not because they're hidden — but because nobody tells you where to find them. Until now.
          </p>
          <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: C.smoke, marginTop: 24, opacity: 0.6 }}>
            LAST UPDATED: MAY 2026
          </div>
        </section>

        {/* Tier 1: Holy Grail */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ borderBottom: "2px solid " + C.gold, paddingBottom: 12, marginBottom: 32 }}>
            <Label>TIER 1</Label>
            <h2 style={{ fontFamily: F.d, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.15 }}>
              The Holy Grail Coffees
            </h2>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, marginTop: 8 }}>
              Rarity 9–10. Genetic unicorns. The coffees that changed what coffee means.
            </p>
          </div>
          {tier1.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </section>

        {/* Tier 2: Competition Monsters */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ borderBottom: "2px solid " + C.rust, paddingBottom: 12, marginBottom: 32 }}>
            <Label>TIER 2</Label>
            <h2 style={{ fontFamily: F.d, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.15 }}>
              Competition Monsters
            </h2>
            <p style={{ fontFamily: F.b, fontSize: 14, color: C.smoke, marginTop: 8 }}>
              The varieties winning World Barista Championships and fetching auction records.
            </p>
          </div>
          {tier2.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} />
          ))}
        </section>

        {/* Acquisition Priority */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ background: C.ink, borderRadius: 16, padding: "40px 36px", color: C.cream }}>
            <Label>BREWSOUL</Label>
            <h2 style={{ fontFamily: F.d, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: C.goldLight, margin: "0 0 24px", lineHeight: 1.15 }}>
              Top 10 Acquisition Priority
            </h2>
            <ol style={{ fontFamily: F.b, fontSize: 17, lineHeight: 2.2, color: C.bone, paddingLeft: 24, margin: 0 }}>
              {ACQUISITION_PRIORITY.map((name, i) => (
                <li key={name} style={{ borderBottom: i < 9 ? "1px solid rgba(212,185,106,0.1)" : "none" }}>
                  <span style={{ fontFamily: F.m, fontSize: 12, color: C.goldLight, marginRight: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {name}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Explorer Score Table */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
          <Label>COFFEE EXPLORER SCORE</Label>
          <h2 style={{ fontFamily: F.d, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: C.ink, margin: "0 0 24px", lineHeight: 1.15 }}>
            The Scorecard
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.b, fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid " + C.gold }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontFamily: F.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.smoke }}>Coffee</th>
                  <th style={{ textAlign: "center", padding: "12px 12px", fontFamily: F.m, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.smoke }}>Taste Shock</th>
                  <th style={{ textAlign: "center", padding: "12px 12px", fontFamily: F.m, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.smoke }}>Rarity</th>
                  <th style={{ textAlign: "center", padding: "12px 12px", fontFamily: F.m, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.smoke }}>Story</th>
                  <th style={{ textAlign: "center", padding: "12px 12px", fontFamily: F.m, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: C.smoke }}>Worth Buying</th>
                </tr>
              </thead>
              <tbody>
                {EXPLORER_SCORES.map((row, i) => (
                  <tr key={row.coffee} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(139,105,20,0.02)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.ink }}>{row.coffee}</td>
                    <td style={{ textAlign: "center", padding: "12px", color: row.tasteShock >= 9 ? C.gold : C.bark, fontWeight: row.tasteShock >= 9 ? 700 : 400 }}>{row.tasteShock}</td>
                    <td style={{ textAlign: "center", padding: "12px", color: row.rarity >= 9 ? C.gold : C.bark, fontWeight: row.rarity >= 9 ? 700 : 400 }}>{row.rarity}</td>
                    <td style={{ textAlign: "center", padding: "12px", color: row.story >= 9 ? C.gold : C.bark, fontWeight: row.story >= 9 ? 700 : 400 }}>{row.story}</td>
                    <td style={{ textAlign: "center", padding: "12px", color: row.worthBuying >= 9 ? C.gold : C.bark, fontWeight: row.worthBuying >= 9 ? 700 : 400 }}>{row.worthBuying}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Final Observation */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
          <div style={{ borderLeft: `4px solid ${C.gold}`, paddingLeft: 28, margin: "40px 0" }}>
            {FINAL_OBSERVATION.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: F.d, fontSize: i === 0 ? 20 : 17, fontStyle: "italic", color: C.ink, lineHeight: 1.6, margin: "0 0 8px" }}>
                {line}
              </p>
            ))}
          </div>
        </section>

        <NextSteps
          steps={[
            { label: "Browse All Coffees", path: "/brewsoul/browse", description: "Explore the full catalog" },
            { label: "Coffee Varieties", path: "/brewsoul/varieties", description: "Deep dive into genetics" },
            { label: "BrewSoul Home", path: "/brewsoul/home", description: "Return to intelligence hub" },
          ]}
        />
      </div>
    </BrewSoulLayout>
    </>);
}
