/**
 * IBOGA vs IBOGAINE — DEEP DIVE MODULE
 * Standalone page at /iboga-ibogaine
 * The Plant vs The Isolate: Alkaloid Profiles, Pharmacology,
 * Bwiti Tradition vs Clinical Protocol, Outcomes, Pharma Alternatives,
 * Supplement Stacks, Dimension Scores, Medicine Selector, Sources.
 */
import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import {
  IBOGA_IMAGES,
  IBOGAINE_PHARMACOLOGY,
  ALKALOID_COMPARISON,
  HEAD_TO_HEAD,
  IBOGAINE_OUTCOMES,
  IBOGA_PHARMA_ALTERNATIVES,
  IBOGA_SUPPLEMENT_STACKS,
  IBOGA_DIM_SCORES,
  IBOGA_MEDICINE_SELECTOR,
  IBOGA_SOURCES,
  IBOGA_META,
  IBOGA_DISCLAIMER,
} from "./iboga-module";
import IbogaCompassSection from "./IbogaCompassSection";

/* ── Shared styles (mobile-first: min 1rem body, 1.25rem headings) ── */
const S = {
  eyebrow: { fontSize: "0.85rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#6B21A8", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" } as React.CSSProperties,
  eyebrowDash: { width: "1.5rem", height: 2, background: "#6B21A8", display: "block" } as React.CSSProperties,
  heading: { fontFamily: "'Playfair Display', 'Fraunces', Georgia, serif", fontWeight: 800, letterSpacing: "-.02em" } as React.CSSProperties,
  label: { fontSize: "0.85rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#6B21A8", margin: "1.25rem 0 .4rem" } as React.CSSProperties,
  body: { fontSize: "1.05rem", color: "#4A3F35", lineHeight: 1.75 } as React.CSSProperties,
  bodyDark: { fontSize: "1.05rem", color: "#E8E2D8", lineHeight: 1.75 } as React.CSSProperties,
  btn: { display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".9rem 2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" as const, cursor: "pointer", borderWidth: 0, borderStyle: "none", borderColor: "transparent" } as React.CSSProperties,
  warningBox: { background: "#FFF3E0", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#E65100", padding: "1rem 1.25rem", margin: "1rem 0", borderRadius: 6 } as React.CSSProperties,
  dangerBox: { background: "#F3E8FF", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#581C87", padding: "1rem 1.25rem", margin: "1rem 0", borderRadius: 6 } as React.CSSProperties,
};

const thStyle: React.CSSProperties = {
  padding: ".65rem .75rem",
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#1C1410",
  background: "#E8E2D8",
  textAlign: "left",
  borderBottomWidth: 2,
  borderBottomStyle: "solid",
  borderBottomColor: "#D4CFC5",
  whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: ".65rem .75rem",
  fontSize: "0.95rem",
  color: "#4A3F35",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#E8E2D8",
  lineHeight: 1.55,
  verticalAlign: "top",
};
const tdAlt: React.CSSProperties = { ...tdStyle, background: "#FAF7F2" };
const tdDark: React.CSSProperties = { ...tdStyle, color: "#E8E2D8", borderBottomColor: "#3A3530" };
const tdDarkAlt: React.CSSProperties = { ...tdDark, background: "rgba(255,255,255,0.03)" };

/* ── Section wrapper ── */
function Section({ id, children, dark }: { id: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section
      id={id}
      style={{
        padding: "4rem 1.25rem",
        background: dark ? "#1C1410" : "#F4F0E8",
        color: dark ? "#F4F0E8" : "#1C1410",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/* ── Pharma Alternatives Table ── */
function PharmaTable() {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? IBOGA_PHARMA_ALTERNATIVES : IBOGA_PHARMA_ALTERNATIVES.slice(0, 5);
  return (
    <div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr>
              {["Pharmaceutical", "Category", "Iboga / Ibogaine Alternative", "Supplement Bridge", "Evidence"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const s = i % 2 ? tdAlt : tdStyle;
              return (
                <tr key={r.drug}>
                  <td style={{ ...s, fontWeight: 700 }}>{r.drug}</td>
                  <td style={s}>{r.category}</td>
                  <td style={s}>{r.ibogaAlt}</td>
                  <td style={s}>{r.supplementAlt}</td>
                  <td style={s}>{r.evidence}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {IBOGA_PHARMA_ALTERNATIVES.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ ...S.btn, marginTop: "1rem", background: "#6B21A8", color: "#fff", borderRadius: 6 }}
        >
          {expanded ? "Show fewer" : `Show all ${IBOGA_PHARMA_ALTERNATIVES.length}`}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function IbogaDeepDive() {
  return (
    <>
      <SEO
        title="Iboga vs Ibogaine — Deep Dive | Psychedelic Readiness Index"
        description="The Plant vs The Isolate. Full alkaloid profiles, receptor pharmacology, Bwiti tradition vs clinical protocol, outcomes data, and supplement stacks."
        indexable={true}
      />

      <style>{`
        .pri-btn-purple { transition: all 0.3s ease; position: relative; overflow: hidden; }
        .pri-btn-purple:hover { background: linear-gradient(135deg, #6B21A8 0%, #4338CA 50%, #6B21A8 100%) !important; box-shadow: 0 0 20px rgba(107,33,168,0.4), 0 0 40px rgba(67,56,202,0.15); transform: translateY(-1px); }
        .pri-btn-purple::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: left 0.5s ease; }
        .pri-btn-purple:hover::after { left: 150%; }
        .pri-danger-glow { transition: all 0.3s ease; }
        .pri-danger-glow:hover { box-shadow: 0 0 16px rgba(107,33,168,0.2), inset 0 0 8px rgba(107,33,168,0.05); }
      `}</style>

      <div style={{ background: "#F4F0E8", minHeight: "100vh" }}>
        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          <img
            src={IBOGA_IMAGES.hero}
            alt="Bwiti ceremony with Tabernanthe iboga root bark"
            sizes="100vw"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) contrast(1.1) saturate(1.1)" }}
          />
          {/* Strong gradient overlay — ensures white text is readable at all viewport sizes */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.7) 40%, rgba(10,8,6,0.35) 70%, rgba(10,8,6,0.15) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "0 1.5rem 4rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <Link href="/psychedelic-readiness-index" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", color: "#D4B96A", fontSize: "0.9rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, textDecoration: "none", marginBottom: "1.5rem" }}>
              ← Back to PRI
            </Link>
            <div style={{ ...S.eyebrow, color: "#D4B96A", marginBottom: "1rem" }}>
              <span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />
              THE PLANT vs THE ISOLATE
            </div>
            <h1 style={{ ...S.heading, fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "#FAFAF7", margin: "0 0 1rem" }}>
              Iboga vs Ibogaine
            </h1>
            <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", color: "#E8E2D8", lineHeight: 1.6, maxWidth: 700, margin: 0 }}>
              Twelve companion alkaloids in sacred synergy — or one purified molecule under cardiac monitoring.
              The Bwiti have known for centuries what Western medicine is only now beginning to measure.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <span style={{ background: "rgba(212,185,106,0.15)", border: "1px solid rgba(212,185,106,0.4)", color: "#D4B96A", padding: ".4rem 1rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600 }}>
                Iboga: 24–72 hrs
              </span>
              <span style={{ background: "rgba(212,185,106,0.15)", border: "1px solid rgba(212,185,106,0.4)", color: "#D4B96A", padding: ".4rem 1rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600 }}>
                Ibogaine: 18–36 hrs
              </span>
              <span style={{ background: "rgba(107,33,168,0.15)", border: "1px solid rgba(107,33,168,0.4)", color: "#E8A09A", padding: ".4rem 1rem", borderRadius: 4, fontSize: "0.9rem", fontWeight: 600 }}>
                ⚠ Cardiac screening mandatory
              </span>
            </div>
          </div>
        </section>

        {/* ── ALKALOID COMPARISON ── */}
        <Section id="alkaloids">
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "2rem", maxHeight: 340 }}>
            <img src={IBOGA_IMAGES.alkaloidComparison} alt="Alkaloid comparison visualization" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(1.1)" }} loading="lazy" />
          </div>
          <div style={S.eyebrow}><span style={S.eyebrowDash} />ALKALOID PROFILES</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            The Entourage Effect
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            Tabernanthe iboga root bark contains at least twelve identified indole alkaloids — approximately 6% of the dried bark by weight.
            Ibogaine is the most abundant (50–80% of total alkaloid content), but the companion alkaloids — ibogamine, tabernanthine, voacangine,
            coronaridine, ibogaline, and noribogaine — each contribute distinct pharmacological actions. Traditional Bwiti practitioners
            have always insisted the whole root bark is greater than any single compound. Western pharmacology is beginning to agree.
          </p>
          <div style={S.warningBox}>
            <p style={{ ...S.body, fontWeight: 700, margin: "0 0 .25rem", color: "#E65100" }}>Entourage Hypothesis</p>
            <p style={{ ...S.body, margin: 0, color: "#4A3F35" }}>
              Like cannabis (THC + CBD + terpenes) and ayahuasca (DMT + harmalines), iboga's full alkaloid profile may produce
              synergistic effects that isolated ibogaine cannot replicate. Coronaridine alone shows independent anti-addictive
              properties at NIDA. Tabernanthine provides the stimulant phase. Voacangine contributes anti-inflammatory action.
            </p>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginTop: "2rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
              <thead>
                <tr>
                  {["Alkaloid", "Abundance", "Primary Action", "Unique Property", "Present In"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALKALOID_COMPARISON.map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.alkaloid}>
                      <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{r.alkaloid}</td>
                      <td style={s}>{r.abundance}</td>
                      <td style={s}>{r.primaryAction}</td>
                      <td style={s}>{r.uniqueProperty}</td>
                      <td style={{ ...s, whiteSpace: "nowrap" }}>{r.presentIn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── RECEPTOR PHARMACOLOGY ── */}
        <Section id="pharmacology" dark>
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "2rem", maxHeight: 340 }}>
            <img src={IBOGA_IMAGES.pharmacology} alt="Receptor pharmacology" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.15)" }} loading="lazy" />
          </div>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />RECEPTOR PHARMACOLOGY</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            Multi-Target Mechanism
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ibogaine is pharmacologically unique among psychedelics — it simultaneously engages opioid, glutamate, serotonin,
            dopamine, and nicotinic systems. No other known compound hits this many addiction-relevant targets in a single dose.
            Its primary metabolite, noribogaine, extends the therapeutic window to 24–48 hours with stronger mu-opioid and
            serotonin transporter affinity than the parent compound.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
              <thead>
                <tr>
                  {["Receptor", "Action", "Clinical Relevance", "Ki (Ibogaine)"].map(h => (
                    <th key={h} style={{ ...thStyle, background: "#2A2420", color: "#D4B96A", borderBottomColor: "#3A3530" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IBOGAINE_PHARMACOLOGY.map((r, i) => {
                  const s = i % 2 ? tdDarkAlt : tdDark;
                  return (
                    <tr key={r.receptor}>
                      <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{r.receptor}</td>
                      <td style={s}>{r.action}</td>
                      <td style={s}>{r.clinicalUse}</td>
                      <td style={{ ...s, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{r.ibogaineKi || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ ...S.dangerBox, background: "rgba(198,40,40,0.12)", borderLeftColor: "#E57373", marginTop: "1.5rem" }}>
            <p style={{ fontWeight: 700, margin: "0 0 .25rem", color: "#E57373", fontSize: "1rem" }}>⚠ Noribogaine: The Hidden Duration</p>
            <p style={{ ...S.bodyDark, margin: 0 }}>
              Ibogaine's half-life is 4–7 hours. But its metabolite noribogaine persists for 24–48 hours with stronger
              mu-opioid and SERT binding. This is why opioid withdrawal relief extends far beyond ibogaine's direct action —
              and why cardiac monitoring must continue for at least 72 hours post-treatment.
            </p>
          </div>
        </Section>

        {/* ── HEAD-TO-HEAD COMPARISON ── */}
        <Section id="comparison">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 260 }}>
              <img src={IBOGA_IMAGES.bwitiTradition} alt="Bwiti tradition" sizes="(max-width: 768px) 100vw, 50vw" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", maxHeight: 260 }}>
              <img src={IBOGA_IMAGES.clinicalSetting} alt="Clinical ibogaine treatment" sizes="(max-width: 768px) 100vw, 50vw" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>
          </div>
          <div style={S.eyebrow}><span style={S.eyebrowDash} />HEAD-TO-HEAD</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            Sacred Bark vs Clinical Isolate
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            The Bwiti tradition and Western ibogaine clinics approach the same plant from opposite ends of the epistemological spectrum.
            One treats the root bark as a living intelligence — a teacher plant that communicates through visions, purging, and ancestor contact.
            The other isolates the most pharmacologically active molecule and administers it under EKG monitoring.
            Both save lives. Neither is wrong.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Dimension</th>
                  <th style={{ ...thStyle, background: "#2A5A2A", color: "#fff" }}>🌳 Iboga (Whole Plant)</th>
                  <th style={{ ...thStyle, background: "#4A2A5A", color: "#fff" }}>💊 Ibogaine (HCl Isolate)</th>
                </tr>
              </thead>
              <tbody>
                {HEAD_TO_HEAD.map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.dimension}>
                      <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{r.dimension}</td>
                      <td style={s}>{r.iboga}</td>
                      <td style={s}>{r.ibogaine}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── OUTCOMES ── */}
        <Section id="outcomes" dark>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />CLINICAL OUTCOMES</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            What the Data Shows
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Most clinical data is on ibogaine HCl, not whole iboga — because clinical trials require standardized dosing.
            The Bwiti tradition has thousands of years of observational evidence but limited Western-style controlled studies.
            What exists is compelling: single-dose ibogaine eliminates opioid withdrawal in 80–90% of cases and sustains
            craving reduction at 12 months in over half of participants.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 550 }}>
              <thead>
                <tr>
                  {["Condition", "Improvement", "Source"].map(h => (
                    <th key={h} style={{ ...thStyle, background: "#2A2420", color: "#D4B96A", borderBottomColor: "#3A3530" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IBOGAINE_OUTCOMES.map((r, i) => {
                  const s = i % 2 ? tdDarkAlt : tdDark;
                  return (
                    <tr key={r.condition}>
                      <td style={{ ...s, fontWeight: 700 }}>{r.condition}</td>
                      <td style={{ ...s, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#D4B96A" }}>{r.improved}</td>
                      <td style={{ ...s, fontSize: "0.85rem", opacity: 0.8 }}>{r.source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ ...S.warningBox, background: "rgba(230,81,0,0.12)", borderLeftColor: "#FFB74D", marginTop: "1.5rem" }}>
            <p style={{ fontWeight: 700, margin: "0 0 .25rem", color: "#FFB74D", fontSize: "1rem" }}>Limitations</p>
            <p style={{ ...S.bodyDark, margin: 0 }}>
              Most studies are observational, not randomized controlled trials. Sample sizes are small (n=12–88).
              Publication bias likely inflates success rates. Ibogaine is not FDA-approved. The Stanford TBI trial
              (2024) is the most rigorous to date. Whole-iboga outcomes data is almost entirely anecdotal from Bwiti practitioners.
            </p>
          </div>
        </Section>

        {/* ── PHARMA ALTERNATIVES ── */}
        <Section id="pharma-alternatives">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />PHARMA → PLANT ALTERNATIVES</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            What Iboga Replaces
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ibogaine's multi-receptor profile means it mechanistically overlaps with several pharmaceutical categories —
            opioid agonists, antagonists, NMDA modulators, SSRIs, and smoking cessation agents. A single ibogaine session
            can address what would otherwise require 3–5 separate prescriptions with their respective side-effect profiles.
          </p>
          <PharmaTable />
        </Section>

        {/* ── SUPPLEMENT STACKS ── */}
        <Section id="supplements" dark>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />SUPPLEMENT PROTOCOL</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            Preparation & Integration Stacks
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ibogaine preparation is more medically intensive than any other psychedelic. Cardiac support (CoQ10, magnesium, potassium)
            is non-negotiable. The 4–8 week pre-treatment window is critical for building physiological resilience.
            Post-integration extends longer than most medicines due to noribogaine's sustained 24–48 hour half-life.
          </p>
          {IBOGA_SUPPLEMENT_STACKS.map(phase => (
            <div key={phase.phase} style={{ marginBottom: "2rem" }}>
              <h3 style={{ ...S.heading, fontSize: "1.3rem", color: "#D4B96A", margin: "0 0 .25rem" }}>{phase.phase}</h3>
              <p style={{ ...S.bodyDark, fontSize: "0.9rem", opacity: 0.7, margin: "0 0 .75rem" }}>{phase.timing}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: ".75rem" }}>
                {phase.items.map(item => (
                  <div key={item.name} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: ".75rem 1rem" }}>
                    <div style={{ fontWeight: 700, color: "#FAFAF7", fontSize: "1rem" }}>{item.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#D4B96A", marginTop: ".25rem" }}>{item.dosage}</div>
                    {item.searchUrl && (
                      <a href={item.searchUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#8B8070", textDecoration: "underline", marginTop: ".25rem", display: "inline-block" }}>
                        Find on Amazon →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* ── DIMENSION SCORES ── */}
        <Section id="dimensions">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />PRI DIMENSION THRESHOLDS</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            Readiness Requirements
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            Iboga and ibogaine demand the highest readiness thresholds of any medicine in the PRI.
            The 24–72 hour duration, cardiac risk profile, and intensity of the visionary experience
            mean that every dimension must be at or near maximum before proceeding.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
              <thead>
                <tr>
                  {["", "Dimension", "Iboga Threshold", "Ibogaine Threshold", "Key Consideration"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IBOGA_DIM_SCORES.map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.dimension}>
                      <td style={{ ...s, fontSize: "1.4rem", textAlign: "center", width: 40 }}>{r.icon}</td>
                      <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{r.dimension}</td>
                      <td style={{ ...s, fontWeight: 700, color: r.ibogaThreshold.includes("Critical") ? "#581C87" : "#8B6914" }}>{r.ibogaThreshold}</td>
                      <td style={{ ...s, fontWeight: 700, color: r.ibogaineThreshold.includes("Critical") ? "#581C87" : "#8B6914" }}>{r.ibogaineThreshold}</td>
                      <td style={s}>{r.keyNote}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── MEDICINE SELECTOR ── */}
        <Section id="selector" dark>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />MEDICINE COMPARISON</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            Where Iboga Fits
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ibogaine is the strongest evidence-based medicine for opioid addiction interruption. For depression, ketamine acts faster.
            For PTSD, MDMA has the strongest trial data. For spiritual development, iboga (whole plant) in Bwiti context is unmatched
            in depth and duration. Know what you need before choosing.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
              <thead>
                <tr>
                  {["", "Medicine", "Addiction", "Depression", "PTSD", "TBI", "Duration", "Beginner", "Evidence"].map(h => (
                    <th key={h} style={{ ...thStyle, background: "#2A2420", color: "#D4B96A", borderBottomColor: "#3A3530" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IBOGA_MEDICINE_SELECTOR.map((r, i) => {
                  const s = i % 2 ? tdDarkAlt : tdDark;
                  const isIboga = r.medicine.includes("Iboga");
                  return (
                    <tr key={r.medicine} style={isIboga ? { background: "rgba(212,185,106,0.08)" } : undefined}>
                      <td style={{ ...s, fontSize: "1.3rem", textAlign: "center", width: 36 }}>{r.icon}</td>
                      <td style={{ ...s, fontWeight: isIboga ? 800 : 600, whiteSpace: "nowrap" }}>{r.medicine}</td>
                      <td style={{ ...s, textAlign: "center" }}>{r.addiction}</td>
                      <td style={{ ...s, textAlign: "center" }}>{r.depression}</td>
                      <td style={{ ...s, textAlign: "center" }}>{r.ptsd}</td>
                      <td style={{ ...s, textAlign: "center" }}>{r.tbi}</td>
                      <td style={{ ...s, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{r.duration}</td>
                      <td style={{ ...s, textAlign: "center" }}>{r.beginner}</td>
                      <td style={s}>{r.evidence}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── SECTION A: PERSONAL NARRATIVE & UPDATED RESEARCH ── */}
        <Section id="research-narrative">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />FIRST-HAND ACCOUNT</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            I Sat Ibogaine at The Mission Within
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            I sat Ibogaine at The Mission Within in Baja California alongside Navy SEALs. Men trained to feel nothing wept. Men who had spent years cycling through VA medications, residential rehab, and every approved protocol the United States government offers — undone and rebuilt by a molecule in a single night.
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            That is not anecdote. That is an 88% PTSD symptom reduction at one month, published in <em>Nature Medicine</em> by Stanford University in January 2024. That is 80% of participants at The Mission Within no longer meeting diagnostic criteria for PTSD — across 1,200 veterans. That is the most significant psychiatric intervention data in a generation, happening 90 minutes south of the US border because the US government still classifies this plant as having "no accepted medical use."
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            If you're here because you or someone you love is suffering and nothing has worked — you're in the right place. If you're here because you're curious about the most interesting molecule in neuropharmacology — also the right place.
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            This section will tell you what ibogaine actually is, what the research actually shows, which facilities are worth your life, and which ones you should run from. Then the Iboga Compass below will match you to the right path for your specific situation — or tell you clearly if ibogaine isn't right for you at all.
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "2rem", fontWeight: 700 }}>No paid placements. No ads. No bullshit.</p>

          {/* Updated Research Numbers Table */}
          <div style={S.eyebrow}><span style={S.eyebrowDash} />THE NUMBERS</div>
          <h3 style={{ ...S.heading, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", margin: "0 0 1rem" }}>Updated Research Data (2024–2026)</h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
              <thead>
                <tr>
                  {["Condition", "Result", "Source"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { condition: "Opioid withdrawal elimination", result: "80–90%", source: "Mash et al., Ann NY Acad Sci 2000" },
                  { condition: "Opioid abstinence at 6 months (n=88)", result: "54%", source: "Davis et al., J Psychedelic Studies 2017" },
                  { condition: "Opioid craving reduction at 12 months", result: "50–60%", source: "Noller et al., Am J Drug Alcohol Abuse 2018" },
                  { condition: "Cocaine dependence", result: "60–70%", source: "Schenberg et al., J Psychopharmacol 2014" },
                  { condition: "Alcohol use disorder", result: "50–65%", source: "Brown & Alper 2018" },
                  { condition: "SOF veterans — PTSD reduction at 1 month", result: "88%", source: "Cherian et al., Nature Medicine, Jan 2024" },
                  { condition: "SOF veterans — depression reduction at 1 month", result: "87%", source: "Cherian et al., Nature Medicine 2024" },
                  { condition: "SOF veterans — anxiety reduction at 1 month", result: "81%", source: "Cherian et al., Nature Medicine 2024" },
                  { condition: "SOF veterans no longer meeting PTSD criteria at 1 year", result: "71%", source: "Williams et al., Nature Mental Health, July 2025" },
                  { condition: "Mission Within veterans — no longer meet PTSD criteria", result: "80%", source: "missionwithin.org, verified June 2026" },
                  { condition: "Safety across 19,071 patients at 11 clinics", result: "6 deaths — all opioid-use-disorder; zero in non-SUD", source: "Research Square multisite analysis, June 2026" },
                ].map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.condition}>
                      <td style={{ ...s, fontWeight: 600 }}>{r.condition}</td>
                      <td style={{ ...s, fontWeight: 800, color: "#8B6914", fontFamily: "'DM Mono', monospace" }}>{r.result}</td>
                      <td style={{ ...s, fontSize: "0.85rem", opacity: 0.75 }}>{r.source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ ...S.warningBox, marginTop: "1.5rem" }}>
            <p style={{ fontWeight: 700, margin: "0 0 .25rem", color: "#E65100" }}>Honest Limitations</p>
            <p style={{ ...S.body, margin: 0 }}>
              Most studies are observational, not randomized controlled trials. Sample sizes are small. Ibogaine is not FDA-approved. The Research Square 2026 study — 19,071 patients — is the largest safety analysis to date. Six deaths, all in opioid-use-disorder patients at under-resourced settings. Zero in non-SUD patients under proper protocols. <strong>Proper protocols. That phrase is doing enormous work.</strong>
            </p>
          </div>
        </Section>

        {/* ── HARD STOPS ── */}
        <Section id="contraindications" dark>
          <div style={{ ...S.eyebrow, color: "#E57373" }}><span style={{ ...S.eyebrowDash, background: "#E57373" }} />HARD STOPS</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            Who Should Not Do This
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            These are absolute contraindications. Not risk factors to manage. Hard stops. If any apply, ibogaine is not your path right now.
          </p>

          <h3 style={{ ...S.heading, fontSize: "1.3rem", color: "#E57373", margin: "0 0 .75rem" }}>Cardiac — Non-Negotiable</h3>
          <ul style={{ ...S.bodyDark, paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li style={{ marginBottom: ".5rem" }}><strong>Long QT Syndrome or QTc above 450ms on any EKG.</strong> In a 14-patient Dutch clinical study, 50% reached QTc above 500ms during treatment. Every known ibogaine fatality has involved either an undetected cardiac condition or inadequate monitoring.</li>
            <li style={{ marginBottom: ".5rem" }}><strong>Diagnosed heart disease, arrhythmia, Brugada syndrome, or history of cardiac events.</strong></li>
            <li style={{ marginBottom: ".5rem" }}><strong>Family history of sudden cardiac death under 50 or known inherited Long QT.</strong></li>
          </ul>
          <div style={{ ...S.dangerBox, background: "rgba(198,40,40,0.12)", borderLeftColor: "#E57373", marginBottom: "1.5rem" }}>
            <p style={{ ...S.bodyDark, margin: 0 }}>Any clinic that will take you without a 12-lead EKG reviewed by a physician is telling you something important about their standards.</p>
          </div>

          <h3 style={{ ...S.heading, fontSize: "1.3rem", color: "#E57373", margin: "0 0 .75rem" }}>Medical</h3>
          <ul style={{ ...S.bodyDark, paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li style={{ marginBottom: ".5rem" }}><strong>Severe liver disease or liver enzymes above 2.5× normal.</strong> Ibogaine is metabolized via CYP450-2D6. Compromised liver means dangerous accumulation.</li>
            <li style={{ marginBottom: ".5rem" }}><strong>Uncontrolled seizure disorder.</strong> Ibogaine doesn't cause seizures. But seizures during treatment can trigger fatal arrhythmias.</li>
            <li style={{ marginBottom: ".5rem" }}><strong>Pregnancy or breastfeeding.</strong></li>
          </ul>

          <h3 style={{ ...S.heading, fontSize: "1.3rem", color: "#E57373", margin: "0 0 .75rem" }}>Psychiatric</h3>
          <ul style={{ ...S.bodyDark, paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
            <li><strong>Active psychosis. Acute bipolar mania. Schizophrenia or schizoaffective disorder (active).</strong> Ibogaine is an oneirogen — a waking dream lasting 8–20 hours. In a stable person this is transformative. In an actively psychotic person this is dangerous.</li>
          </ul>

          <h3 style={{ ...S.heading, fontSize: "1.3rem", color: "#FFB74D", margin: "1.5rem 0 .75rem" }}>The Medications Problem</h3>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1rem" }}>Most people reading this have more preparation work to do than they realize.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "rgba(198,40,40,0.1)", border: "1px solid rgba(229,115,115,0.3)", borderRadius: 8, padding: "1rem" }}>
              <p style={{ fontWeight: 800, color: "#E57373", margin: "0 0 .5rem" }}>Hard stops — physician clearance required</p>
              <ul style={{ ...S.bodyDark, paddingLeft: "1.25rem", margin: 0, fontSize: "0.9rem" }}>
                <li>MAO inhibitors (MAOIs) — serious serotonin syndrome risk. Weeks of washout.</li>
                <li>QT-prolonging medications — certain antipsychotics, antibiotics, anti-nausea drugs.</li>
              </ul>
            </div>
            <div style={{ background: "rgba(255,183,77,0.1)", border: "1px solid rgba(255,183,77,0.3)", borderRadius: 8, padding: "1rem" }}>
              <p style={{ fontWeight: 800, color: "#FFB74D", margin: "0 0 .5rem" }}>Supervised medical taper required</p>
              <ul style={{ ...S.bodyDark, paddingLeft: "1.25rem", margin: 0, fontSize: "0.9rem" }}>
                <li>SSRIs — 2–6 weeks (fluoxetine requires 5–6 weeks)</li>
                <li>Methadone — 4–6 weeks supervised transition</li>
                <li>Buprenorphine/Suboxone — supervised taper</li>
                <li>Benzodiazepines — abrupt stop triggers seizures</li>
                <li>Daily alcohol — same seizure risk</li>
              </ul>
            </div>
          </div>
          <p style={{ ...S.bodyDark, marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}>
            Also avoid: grapefruit (72 hours before), St. John's Wort (2 weeks before), quinine/tonic water (prolongs QT — avoid completely). <strong>Full medication disclosure to your treatment team is non-negotiable. Undisclosed drug interactions are how people die.</strong>
          </p>
        </Section>

        {/* ── FACILITIES ── */}
        <Section id="facilities">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />THE FACILITIES</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            Who's Doing It Right
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "2rem" }}>
            Twenty-two years of due diligence across $10 billion in restructured deals taught me one thing: the difference between a good deal and a catastrophic one is almost always the quality of the people managing it, not the underlying asset. Same principle applies here. The medicine is not the variable. The setting is.
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "2rem" }}>
            Every facility listed below is verified from their public website and independent directories as of June 2026. Two that appeared on earlier versions of this list have been removed — I'll tell you why.
          </p>

          {/* Featured Facilities */}
          {[
            { star: true, name: "The Mission Within", location: "Baja California, Mexico", focus: "Veterans only", url: "https://missionwithin.org", pricing: "Contact directly", body: "This is where I sat. This is what I witnessed. This is the one I can speak to from personal experience rather than research. Founded and led by Dr. Martín Polanco — a Mexican-licensed physician with over 26 years of clinical experience in ibogaine medicine, the most experienced ibogaine physician in North America, who has treated more than 5,000 patients. He set up the first medically supervised ibogaine clinic in North America near Tijuana in 2001. 6-week clinical program built for special operations veterans and their families. Virtual preparation. Five-day in-person medicine retreat: ibogaine ceremony overnight, individual 5-MeO-DMT sessions, therapist-led integration. Ongoing peer support community of veterans healing together. Their numbers: 1,200+ veterans and family members treated since 2017. 80% no longer meeting PTSD diagnostic criteria.", who: "Military veterans, active duty, first responders, and their families. Peer-to-peer healing in a community that understands military trauma from the inside. Not a general population program.", partners: "SEAL Future Foundation · SOC-F · Heroic Hearts Project · The Hope Project" },
            { star: false, name: "Ambio Life Sciences", location: "Tijuana / Playas de Tijuana, Baja California, Mexico", focus: null, url: "https://ambio.life", pricing: "From $7,350 USD (published)", body: "The Stanford MISTIC study site — those 30 Navy SEALs, that Nature Medicine paper, those numbers. The world's first and only Nagoya-compliant ibogaine clinic. Six private residential clinics across Baja California. Netflix's In Waves and War (November 2025) was filmed here. GITA-aligned. Co-founder Jonathan Dickinson received Missoko Bwiti initiation in Gabon before building a clinic. They treat addiction, TBI, PTSD, Parkinson's, MS, and performance optimization.", who: "Anyone who wants the most rigorously evidenced ibogaine protocol available and for whom Nagoya compliance and indigenous reciprocity is non-negotiable.", partners: null },
            { star: false, name: "Beōnd Ibogaine", location: "Cancún, Quintana Roo, Mexico (Level 2 travel advisory)", focus: null, url: "https://beondibogaine.com", pricing: "Contact directly", body: "9 MDs and 23 RNs on-site. Stanford-aligned cardiac protocols. 5-phase model starting weeks before arrival, continuing months after departure. Veteran program (Beond Service) launched January 2025. Plants 3 iboga trees in Gabon per treatment through Blessings of the Forest. Nagoya-compliant.", who: "Serious cases wanting maximum medical infrastructure with genuine commitment to indigenous reciprocity.", partners: null },
            { star: false, name: "MindScape Retreat", location: "Cozumel, Quintana Roo, Mexico (Level 2)", focus: null, url: "https://www.mindscaperetreat.com", pricing: "Contact directly — includes 90-day aftercare", body: "900+ patients, zero cardiac events (facility-reported). What sets them apart: they publish their full contraindications list, cardiac screening protocol, and QTc thresholds publicly. Most clinics bury this. MindScape puts it on the homepage. 90-day structured aftercare included. Treatment does not affect VA eligibility or benefit status.", who: "Veterans and civilians who want maximum medical transparency and structured long-term aftercare.", partners: null },
            { star: false, name: "Clear Sky Recovery", location: "Cancún, Mexico (Level 2)", focus: null, url: "https://clearskyrecovery.com", pricing: "~$5,500–$8,000 (third-party estimate)", body: "Beachfront Cancún. 7–10 day programs. Strong track record in opioid and alcohol addiction.", who: "Addiction focus, mid-range budget, Cancún location.", partners: null },
            { star: false, name: "Experience Ibogaine", location: "Rosarito Beach, Baja California, Mexico (Level 3 region)", focus: null, url: "https://www.experienceibogaine.com", pricing: "Contact directly", body: "10+ years operating. Active research partnerships with Ohio State University. Veteran discounts. The detail that matters most: they properly decline cardiac cases, referring patients to Tijuana cardiologists when an EKG fails. That is the green flag that should matter more to you than the amenities photography.", who: "Addiction, PTSD, budget-conscious, Baja proximity.", partners: null },
            { star: false, name: "IbogaQuest", location: "Tepoztlán, Morelos, Mexico", focus: null, url: "https://ibogaquest.com", pricing: "USA: +1 (802) 748-4600", body: "Founded 2009 — one of the longest continuously operating centers in North America. Small groups in the spiritual mountain town of Tepoztlán. Verified reviews include repeat clients who booked a second visit three months after the first. That data point matters more than any marketing copy.", who: "Spiritual seekers and trauma cases who want psychospiritual depth alongside clinical safety.", partners: null },
            { star: false, name: "Tabula Rasa Retreat", location: "Portugal", focus: null, url: "https://tabularasaretreat.com", pricing: "Contact directly", body: "Europe's leading ibogaine facility. ACLS-trained staff. Lifetime online aftercare. Legal under Portugal's harm-reduction framework — no Mexico logistics, no border concerns, no Level 3 advisories.", who: "European patients or anyone who wants a legal European setting.", partners: null },
            { star: false, name: "Bwiti House — Moughenda Mikala", location: "Gabon, West Africa", focus: null, url: "https://bwitihouse.com", pricing: "Contact directly", body: "This is the source. Moughenda Mikala is one of the most respected nganga globally. Full Tabernanthe iboga root bark, not HCl. Authentic Missoko Bwiti initiation lasting up to three days. This is the medicine in its most potent, most unpredictable, most transformative form. Only appropriate for thoroughly cardiac-screened, physically healthy individuals with genuine respect for the tradition they are entering. No continuous Western cardiac monitoring.", who: "Spiritual seekers with clean cardiac screening, robust health, and genuine reverence for the tradition.", partners: null },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid #E8E2D8" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: ".75rem", flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ ...S.heading, fontSize: "1.4rem", margin: "0 0 .25rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                    {f.star && <span style={{ color: "#D4B96A" }}>⭐</span>} {f.name}
                  </h3>
                  <p style={{ ...S.body, margin: 0, fontSize: "0.9rem", color: "#6B5A4E" }}>
                    {f.location}{f.focus && ` | ${f.focus}`} | <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>{f.url.replace("https://", "")}</a> | {f.pricing}
                  </p>
                </div>
              </div>
              <p style={{ ...S.body, maxWidth: 800, marginBottom: ".75rem" }}>{f.body}</p>
              <p style={{ ...S.body, fontSize: "0.9rem", color: "#6B5A4E" }}><strong>Who it's for:</strong> {f.who}</p>
              {f.partners && <p style={{ ...S.body, fontSize: "0.9rem", color: "#6B5A4E" }}><strong>Partners:</strong> {f.partners}</p>}
            </div>
          ))}

          {/* Additional Verified Facilities Table */}
          <h3 style={{ ...S.heading, fontSize: "1.3rem", margin: "2rem 0 1rem" }}>Additional Verified Facilities</h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr>
                  {["Facility", "Location", "Focus", "Website"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Iboga Wellness Institute", location: "International", focus: "Navigation · complex case coordination", url: "https://theibogainstitute.org" },
                  { name: "New Roots Ibogaine", location: "Mexico", focus: "Opioid replacement specialists", url: "https://newrootsibogaine.com" },
                  { name: "Transcend Ibogaine", location: "Cancún, MX (Level 2)", focus: "Bilingual · cardiology-trained", url: "https://transcendibogaine.com" },
                  { name: "Root Healing", location: "Portugal", focus: "Bwiti lineage · depression", url: "https://roothealing.com" },
                  { name: "Iboga Wellness Center", location: "Costa Rica", focus: "Bwiti-informed · spiritual", url: "https://ibogawellness.com" },
                  { name: "Awakening Soul", location: "Costa Rica", focus: "Life reset · small groups", url: "https://awakeningsoul.com" },
                ].map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.name}>
                      <td style={{ ...s, fontWeight: 700 }}>{r.name}</td>
                      <td style={s}>{r.location}</td>
                      <td style={s}>{r.focus}</td>
                      <td style={s}><a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>{r.url.replace("https://", "")}</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Removed facilities */}
          <div style={{ ...S.dangerBox, marginTop: "2rem" }}>
            <p style={{ fontWeight: 800, margin: "0 0 .5rem", color: "#581C87" }}>Two Facilities No Longer on This List</p>
            <p style={{ ...S.body, margin: "0 0 .5rem" }}><strong>Ibogaine by David Dardashti</strong> — Removed. Multiple independently documented reviews describe unsafe conditions, absent medical oversight, threatened clients, and alleged misrepresentation. Do not go here.</p>
            <p style={{ ...S.body, margin: 0 }}><strong>Crossroads Treatment Center</strong> — Removed. Permanently closed 2025.</p>
          </div>

          {/* Quick Reference Table */}
          <h3 style={{ ...S.heading, fontSize: "1.3rem", margin: "2rem 0 1rem" }}>Quick Reference</h3>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr>
                  {["Facility", "Location", "Travel Level", "Veteran", "Nagoya", "Pricing"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "The Mission Within", loc: "Baja California, MX", travel: "Level 3 (regional)", vet: "⭐ Primary", nagoya: "No", price: "Contact" },
                  { name: "Ambio Life Sciences", loc: "Tijuana, MX", travel: "Level 3 (regional)", vet: "Yes", nagoya: "Only globally", price: "From $7,350" },
                  { name: "Beōnd Ibogaine", loc: "Cancún, MX", travel: "Level 2", vet: "Yes", nagoya: "Yes", price: "Contact" },
                  { name: "MindScape Retreat", loc: "Cozumel, MX", travel: "Level 2", vet: "Yes", nagoya: "No", price: "Contact" },
                  { name: "Clear Sky Recovery", loc: "Cancún, MX", travel: "Level 2", vet: "No", nagoya: "No", price: "~$5,500–$8,000" },
                  { name: "Experience Ibogaine", loc: "Rosarito, MX", travel: "Level 3 (regional)", vet: "Discounts", nagoya: "No", price: "Contact" },
                  { name: "IbogaQuest", loc: "Tepoztlán, MX", travel: "Low", vet: "No", nagoya: "No", price: "Contact" },
                  { name: "Tabula Rasa Retreat", loc: "Portugal", travel: "N/A", vet: "No", nagoya: "No", price: "Contact" },
                  { name: "Bwiti House", loc: "Gabon", travel: "N/A", vet: "No", nagoya: "Yes", price: "Contact" },
                ].map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.name}>
                      <td style={{ ...s, fontWeight: 700 }}>{r.name}</td>
                      <td style={s}>{r.loc}</td>
                      <td style={{ ...s, color: r.travel.includes("3") ? "#E65100" : r.travel.includes("2") ? "#8B6914" : undefined }}>{r.travel}</td>
                      <td style={s}>{r.vet}</td>
                      <td style={s}>{r.nagoya}</td>
                      <td style={{ ...s, fontFamily: "'DM Mono', monospace" }}>{r.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── EXTRACTIVE CAPITALISM ── */}
        <Section id="extractive-capitalism" dark>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />THE EXTRACTIVE CAPITALISM PROBLEM</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem", color: "#FAFAF7" }}>
            Who Benefits From This Plant?
          </h2>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Of the seven biggest companies currently developing ibogaine as a pharmaceutical, none had made any public mention of following the Nagoya Protocol at the time of my research. The Nagoya Protocol governs access to genetic resources and traditional knowledge from indigenous communities. Gabon was the first country in the world to sign it.
          </p>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            What this means in plain English: Western pharmaceutical companies are taking a plant that Gabonese communities have stewarded for centuries, extracting the active compound, patenting novel formulations, and building businesses worth hundreds of millions of dollars — without returning anything meaningful to the people whose knowledge made this possible.
          </p>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ambio Life Sciences is the only ibogaine clinic in the world that is Nagoya-compliant. Beōnd plants three iboga trees in Gabon per treatment. These are not marketing claims — they are structural positions that should be part of your facility selection criteria.
          </p>
          <p style={{ ...S.bodyDark, maxWidth: 800, marginBottom: "2rem" }}>
            This is the core of ImpactSoul's thesis: regenerative capital heals. Extractive capital destroys. Ibogaine is the most literal test of that proposition I have encountered.
          </p>
          <a
            href="https://tonygreenberg.com/psychedelics-could-become-extractive-capitalism/"
            style={{ ...S.btn, background: "#D4B96A", color: "#1C1410", borderRadius: 6, textDecoration: "none", display: "inline-flex" }}
          >
            Read the Full Argument →
          </a>
        </Section>

        {/* ── US LEGAL STATUS ── */}
        <Section id="legal-status">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />US LEGAL STATUS (2026)</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 1rem" }}>
            The Regulatory Landscape
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            Ibogaine is Schedule I in the United States. US and Canadian citizens traveling to Mexico for treatment face zero domestic legal consequences.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Baja California", detail: "US State Dept Level 3: Reconsider Travel. Regional organized crime advisory — not facility-specific." },
              { label: "Quintana Roo (Cancún, Cozumel)", detail: "US State Dept Level 2: Exercise Increased Caution." },
              { label: "April 2026: White House Executive Order", detail: "Directed FDA and DEA to facilitate a Right to Try pathway for ibogaine. Ibogaine remains Schedule I — this initiates a regulatory process only." },
              { label: "Texas SB 2308 (2025)", detail: "$50 million for ibogaine clinical trials through UTHealth Houston and UTMB Galveston. Largest single public investment in psychedelic medicine research in US history." },
              { label: "VA and Military", detail: "Treatment in Mexico does not affect VA eligibility, disability rating, or benefit status. No reporting mechanism exists." },
            ].map(item => (
              <div key={item.label} style={{ background: "#FAFAF7", border: "1px solid #E8E2D8", borderRadius: 8, padding: "1rem" }}>
                <p style={{ fontWeight: 700, margin: "0 0 .4rem", color: "#1C1410", fontSize: "0.95rem" }}>{item.label}</p>
                <p style={{ ...S.body, margin: 0, fontSize: "0.9rem" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── IBOGA COMPASS ASSESSMENT v2 ── */}
        <IbogaCompassSection />

        {/* ── SOURCES ── */}
        <Section id="sources">
          <div style={S.eyebrow}><span style={S.eyebrowDash} />SOURCES & REFERENCES</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.4rem, 3vw, 2rem)", margin: "0 0 1.5rem" }}>
            Peer-Reviewed Literature
          </h2>
          <ol style={{ ...S.body, paddingLeft: "1.5rem", maxWidth: 800 }}>
            {IBOGA_SOURCES.map((s, i) => (
              <li key={i} style={{ marginBottom: ".6rem", fontSize: "0.95rem" }}>{s}</li>
            ))}
          </ol>
        </Section>

        {/* ── DISCLAIMER ── */}
        <section style={{ padding: "2rem 1.25rem", background: "#1C1410" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="pri-danger-glow" style={S.dangerBox}>
              <p style={{ fontWeight: 800, margin: "0 0 .5rem", color: "#581C87", fontSize: "1rem" }}>⚠ CRITICAL SAFETY NOTICE</p>
              <p style={{ ...S.body, margin: 0, fontSize: "0.95rem" }}>{IBOGA_DISCLAIMER}</p>
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link href="/psychedelic-readiness-index" style={{ ...S.btn, background: "#D4B96A", color: "#1C1410", borderRadius: 6, textDecoration: "none" }}>
                ← Return to Psychedelic Readiness Index
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
