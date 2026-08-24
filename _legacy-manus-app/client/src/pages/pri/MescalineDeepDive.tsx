/**
 * MESCALINE / PEYOTE — DEEP DIVE MODULE
 * Standalone page at /peyote-mescaline
 * Pharmacology, Latuda Mirror, Outcomes, Pharma Alternatives,
 * Supplement Stacks, Dimension Scores, Medicine Selector, Sources.
 */

import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import {
  MESCALINE_PHARMACOLOGY,
  LATUDA_MIRROR,
  LATUDA_MIRROR_ONELINER,
  MESCALINE_OUTCOMES,
  OUTCOMES_SOURCE,
  OUTCOMES_SPIRITUAL,
  OUTCOMES_INTENT,
  PHARMA_ALTERNATIVES,
  SUPPLEMENT_STACKS,
  MESCALINE_DIM_SCORES,
  MEDICINE_SELECTOR,
  MESCALINE_SOURCES,
  MESCALINE_META,
  MESCALINE_DISCLAIMER,
} from "./mescaline-module";

/* ── Shared styles ── */
const S = {
  eyebrow: { fontSize: ".75rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#6B21A8", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" } as React.CSSProperties,
  eyebrowDash: { width: "1.5rem", height: 2, background: "#6B21A8", display: "block" } as React.CSSProperties,
  heading: { fontFamily: "'Playfair Display', 'Fraunces', Georgia, serif", fontWeight: 800, letterSpacing: "-.02em" } as React.CSSProperties,
  label: { fontSize: ".7rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#6B21A8", margin: "1.25rem 0 .4rem" } as React.CSSProperties,
  body: { fontSize: ".9rem", color: "#4A3F35", lineHeight: 1.7 } as React.CSSProperties,
  btn: { display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".9rem 2rem", fontFamily: "'DM Sans', sans-serif", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" as const, cursor: "pointer", borderWidth: 0, borderStyle: "none", borderColor: "transparent" } as React.CSSProperties,
  warningBox: { background: "#FFF3E0", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#E65100", padding: "1rem 1.25rem", margin: "1rem 0" } as React.CSSProperties,
  dangerBox: { background: "#F3E8FF", borderLeftWidth: 4, borderLeftStyle: "solid" as const, borderLeftColor: "#581C87", padding: "1rem 1.25rem", margin: "1rem 0" } as React.CSSProperties,
};

/* ── Table cell styles ── */
const thStyle: React.CSSProperties = {
  padding: ".6rem .75rem",
  fontSize: ".75rem",
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
  padding: ".6rem .75rem",
  fontSize: ".82rem",
  color: "#4A3F35",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#E8E2D8",
  lineHeight: 1.5,
  verticalAlign: "top",
};

const tdAlt: React.CSSProperties = { ...tdStyle, background: "#FAF7F2" };

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

/* ── Pharma Alternatives Table (scrollable on mobile) ── */
function PharmaTable() {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? PHARMA_ALTERNATIVES : PHARMA_ALTERNATIVES.slice(0, 8);

  return (
    <div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead>
            <tr>
              <th style={thStyle}>Drug (Brand)</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Plant Alternative</th>
              <th style={thStyle}>Supplement Alt</th>
              <th style={thStyle}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={i % 2 ? tdAlt : tdStyle}>
                  <strong style={{ color: "#1C1410" }}>{r.drug}</strong>
                </td>
                <td style={i % 2 ? tdAlt : tdStyle}>
                  <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#7A6A5A" }}>{r.category}</span>
                </td>
                <td style={i % 2 ? tdAlt : tdStyle}>
                  {r.plantAlt.includes("\u26A0") ? (
                    <span style={{ color: "#581C87", fontWeight: 700 }}>{r.plantAlt}</span>
                  ) : (
                    r.plantAlt
                  )}
                </td>
                <td style={i % 2 ? tdAlt : tdStyle}>{r.supplementAlt}</td>
                <td style={i % 2 ? tdAlt : tdStyle}>
                  <span
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 700,
                      padding: ".15rem .4rem",
                      background: r.evidence.startsWith("Strong") ? "rgba(107,143,113,.15)" : r.evidence.startsWith("Moderate") ? "rgba(200,166,76,.15)" : "rgba(107,33,168,.1)",
                      color: r.evidence.startsWith("Strong") ? "#3D6B44" : r.evidence.startsWith("Moderate") ? "#8B6914" : "#6B21A8",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: r.evidence.startsWith("Strong") ? "rgba(107,143,113,.3)" : r.evidence.startsWith("Moderate") ? "rgba(200,166,76,.3)" : "rgba(107,33,168,.2)",
                    }}
                  >
                    {r.evidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!expanded && PHARMA_ALTERNATIVES.length > 8 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            onClick={() => setExpanded(true)}
            style={{ ...S.btn, background: "transparent", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#1C1410", color: "#1C1410", padding: ".6rem 1.5rem", fontSize: ".78rem" }}
          >
            Show All {PHARMA_ALTERNATIVES.length} Medications &darr;
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function MescalineDeepDive() {
  return (
    <>
      <SEO
        title="Mescaline / Peyote Deep Dive \u2014 Psychedelic Readiness Index"
        description="Comprehensive pharmacology, outcomes data, pharma-to-plant alternatives, supplement stacks, and readiness dimensions for mescaline and peyote. Educational resource from the Psychedelic Readiness Index."
        path="/peyote-mescaline"
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

      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F4F0E8", color: "#1C1410", lineHeight: 1.7 }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "90px 1.25rem 4rem", maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Glassmorphic hero background */}
          <div className="glitch-hero" style={{ position: "absolute", top: "5%", right: "-8%", width: "50%", height: "75%", opacity: 0.3, zIndex: 0, borderRadius: "24px", overflow: "hidden" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/pri-hero-mescaline-LZ6qL5rTNsm96kDqBfwRyg.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) contrast(1.2)" }} loading="lazy" />
            <div className="glitch-scanlines" />
            <div className="glitch-tear" style={{ top: "40%" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDash} />
            PRI Deep Dive Module
          </div>
          <h1 style={{ ...S.heading, fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-.03em", marginBottom: "1rem" }}>
            <span style={{ color: "#6B21A8" }}>Mescaline</span> /<br />Peyote
          </h1>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {MESCALINE_META.tags.map((t) => (
              <span key={t} style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: ".2rem .5rem", borderWidth: 1, borderStyle: "solid", borderColor: t === "intense" ? "#6B21A8" : t === "ceremony" ? "#C9A84C" : "#6B8F71", color: t === "intense" ? "#6B21A8" : t === "ceremony" ? "#C9A84C" : "#6B8F71" }}>
                {t}
              </span>
            ))}
            <span style={{ fontSize: ".75rem", color: "#7A6A5A", fontWeight: 600 }}>
              {MESCALINE_META.duration} &middot; {MESCALINE_META.potencyNote}
            </span>
          </div>

          {/* Disclaimer banner */}
          <div className="pri-danger-glow" style={S.dangerBox}>
            <div style={{ fontWeight: 800, color: "#581C87", marginBottom: ".3rem", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              &#x26A0;&#xFE0F; Educational Only &mdash; Not Medical Advice
            </div>
            <p style={{ margin: 0, fontSize: ".82rem", color: "#4A3F35", lineHeight: 1.6 }}>
              {MESCALINE_DISCLAIMER}
            </p>
          </div>

          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Link href="/psychedelic-readiness-index" style={{ ...S.btn, borderWidth: "1.5px", borderStyle: "solid", borderColor: "#1C1410", background: "transparent", color: "#1C1410", textDecoration: "none" }}>
              &larr; Back to PRI
            </Link>
            <a href="#pharmacology" className="pri-btn-purple" style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8", textDecoration: "none" }}>
              Explore Pharmacology &darr;
            </a>
          </div>
          </div>
        </section>

        {/* ── PHARMACOLOGY ── */}
        <Section id="pharmacology">
          {/* Glassmorphic section image */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6, boxShadow: "0 8px 40px rgba(107,33,168,.15)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/pri-section-pharmacology-8nrnRWUbqMfZ8EUM9utBPY.webp" alt="Receptor pharmacology" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.15)" }} loading="lazy" />
            <div className="glitch-scanlines" />
            <div className="glitch-tear" style={{ top: "45%" }} />
          </div>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDash} />
            Receptor Pharmacology
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "1.5rem" }}>
            Key Receptors
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Receptor</th>
                  <th style={thStyle}>Action</th>
                  <th style={thStyle}>Clinical Use</th>
                </tr>
              </thead>
              <tbody>
                {MESCALINE_PHARMACOLOGY.map((r, i) => (
                  <tr key={i}>
                    <td style={i % 2 ? tdAlt : { ...tdStyle, fontWeight: 700, color: "#1C1410" }}>{r.receptor}</td>
                    <td style={i % 2 ? tdAlt : tdStyle}>{r.action}</td>
                    <td style={i % 2 ? tdAlt : tdStyle}>{r.clinicalUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...S.body, marginTop: "1rem", fontSize: ".82rem", color: "#7A6A5A" }}>
            Unlike MDMA and SSRIs, mescaline has <strong style={{ color: "#1C1410" }}>no serotonin transporter (SERT) affinity</strong> &mdash; it does not dump serotonin. Its psychedelic action is purely receptor-mediated via 5-HT2A partial agonism, with unique prosocial effects from low-affinity dopamine binding and sympathomimetic arousal from adrenergic agonism.
          </p>
        </Section>

        {/* ── LATUDA MIRROR ── */}
        <Section id="latuda-mirror" dark>
          {/* Cinematic: cracked mirror — pills vs cactus */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/mesc_latuda-YgTpmPv22YnAyD4CQiGmzE.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) contrast(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #1C1410 100%)" }} />
          </div>
          <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
            <span style={S.eyebrowDash} />
            The Latuda Mirror
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: ".75rem", color: "#F4F0E8" }}>
            Same Targets. Opposite Actions.
          </h2>
          <p style={{ fontSize: "clamp(.9rem, 2.5vw, 1.05rem)", color: "rgba(244,240,232,.6)", marginBottom: "2rem", maxWidth: 600 }}>
            Latuda (lurasidone) and mescaline share the same receptor targets with opposite actions:
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 450 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, background: "rgba(244,240,232,.08)", color: "rgba(244,240,232,.5)", borderBottomColor: "rgba(244,240,232,.1)" }}>Receptor</th>
                  <th style={{ ...thStyle, background: "rgba(244,240,232,.08)", color: "rgba(244,240,232,.5)", borderBottomColor: "rgba(244,240,232,.1)" }}>Latuda</th>
                  <th style={{ ...thStyle, background: "rgba(244,240,232,.08)", color: "rgba(244,240,232,.5)", borderBottomColor: "rgba(244,240,232,.1)" }}>Mescaline</th>
                </tr>
              </thead>
              <tbody>
                {LATUDA_MIRROR.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: ".7rem .75rem", fontSize: ".85rem", fontWeight: 700, color: "#F4F0E8", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.06)", background: i % 2 ? "rgba(244,240,232,.03)" : "transparent" }}>
                      {r.receptor}
                    </td>
                    <td style={{ padding: ".7rem .75rem", fontSize: ".85rem", color: "rgba(244,240,232,.55)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.06)", background: i % 2 ? "rgba(244,240,232,.03)" : "transparent" }}>
                      <span style={{ color: "#E57373" }}>{r.latuda}</span>
                    </td>
                    <td style={{ padding: ".7rem .75rem", fontSize: ".85rem", color: "rgba(244,240,232,.55)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "rgba(244,240,232,.06)", background: i % 2 ? "rgba(244,240,232,.03)" : "transparent" }}>
                      <span style={{ color: "#81C784" }}>{r.mescaline}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* One-liner callout */}
          <div style={{ marginTop: "2rem", padding: "1.5rem 2rem", background: "rgba(107,33,168,.12)", borderLeftWidth: 4, borderLeftStyle: "solid", borderLeftColor: "#6B21A8" }}>
            <p style={{ margin: 0, fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 700, color: "#F4F0E8", lineHeight: 1.5, fontFamily: "'Playfair Display', Georgia, serif" }}>
              &ldquo;{LATUDA_MIRROR_ONELINER}&rdquo;
            </p>
          </div>
        </Section>

        {/* ── OUTCOMES DATA ── */}
        <Section id="outcomes">
          {/* Cinematic: golden abacus with clinical data orbs */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/mesc_outcomes-bwmiTnjaYvWoVQcSh4mTTE.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.15)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, #FAF7F2 100%)" }} />
          </div>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDash} />
            Outcomes Data
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: ".5rem" }}>
            Clinical Outcomes
          </h2>
          <p style={{ fontSize: ".82rem", color: "#7A6A5A", marginBottom: "2rem" }}>
            Source: {OUTCOMES_SOURCE}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#E0D8CC", borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC", marginBottom: "1.5rem" }}>
            {MESCALINE_OUTCOMES.map((o, i) => (
              <div key={i} style={{ background: "#FAF7F2", padding: "1.5rem 1rem", textAlign: "center" }}>
                <div style={{ ...S.heading, fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 900, color: "#6B21A8", lineHeight: 1 }}>
                  {o.improved}
                </div>
                <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#7A6A5A", marginTop: ".4rem" }}>
                  {o.condition} improved
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "#FAF7F2", padding: "1.25rem", borderLeftWidth: 3, borderLeftStyle: "solid", borderLeftColor: "#C9A84C" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#C9A84C", marginBottom: ".3rem" }}>Spiritual Significance</div>
              <div style={{ fontSize: ".88rem", color: "#4A3F35", lineHeight: 1.6 }}>{OUTCOMES_SPIRITUAL}</div>
            </div>
            <div style={{ background: "#FAF7F2", padding: "1.25rem", borderLeftWidth: 3, borderLeftStyle: "solid", borderLeftColor: "#6B8F71" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#6B8F71", marginBottom: ".3rem" }}>Intent Paradox</div>
              <div style={{ fontSize: ".88rem", color: "#4A3F35", lineHeight: 1.6 }}>{OUTCOMES_INTENT}</div>
            </div>
          </div>
        </Section>

        {/* ── PHARMA → PLANT ALTERNATIVES ── */}
        <Section id="pharma-alternatives" dark>
          {/* Cinematic: shattering apothecary shelf — pharma to plant */}
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_67_mesc_pharma_d25171fc.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) contrast(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #1C1410 100%)" }} />
          </div>
          <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
            <span style={S.eyebrowDash} />
            Pharma &rarr; Plant Alternatives
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: ".5rem", color: "#F4F0E8" }}>
            16 Medications &amp; Their Alternatives
          </h2>

          {/* Warning */}
          <div style={{ background: "rgba(88,28,135,.15)", borderLeftWidth: 4, borderLeftStyle: "solid", borderLeftColor: "#581C87", padding: "1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontWeight: 800, color: "#EF5350", marginBottom: ".3rem", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
              &#x26A0;&#xFE0F; Educational Only. Not Medical Advice. Not a Substitution Guide.
            </div>
            <p style={{ margin: 0, fontSize: ".82rem", color: "rgba(244,240,232,.55)", lineHeight: 1.6 }}>
              Do not stop or modify any prescribed medication based on this content. Dangerous interactions exist between plant medicines and psychiatric drugs. Always consult qualified healthcare professionals.
            </p>
          </div>

          <div style={{ background: "#FAF7F2", padding: "0" }}>
            <PharmaTable />
          </div>
        </Section>

        {/* ── SUPPLEMENT STACKS ── */}
        {/* Cinematic: alchemist workbench with sacred geometry */}
        <Section id="supplements">
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_64_mesc_b5ca252b.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.15)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, #FAF7F2 100%)" }} />
          </div>
          <div style={S.eyebrow}>
            <span style={S.eyebrowDash} />
            Supplement Protocol
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "2rem" }}>
            Preparation &amp; Integration Stack
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {SUPPLEMENT_STACKS.map((phase) => (
              <div key={phase.phase} style={{ background: "#FAF7F2", borderWidth: 1, borderStyle: "solid", borderColor: "#E0D8CC" }}>
                <div style={{ background: phase.phase === "PRE" ? "#6B8F71" : phase.phase === "DAY-OF" ? "#C9A84C" : "#6B21A8", padding: ".75rem 1rem" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>
                    {phase.phase}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.7)" }}>{phase.timing}</div>
                </div>
                <div style={{ padding: "1rem" }}>
                  {phase.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: ".5rem 0", borderBottomWidth: i < phase.items.length - 1 ? 1 : 0, borderBottomStyle: "solid", borderBottomColor: "#E8E2D8", gap: ".5rem" }}>
                      <div>
                        <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#1C1410" }}>{item.name}</div>
                        <div style={{ fontSize: ".72rem", color: "#7A6A5A" }}>{item.dosage}</div>
                      </div>
                      {item.searchUrl && (
                        <a
                          href={item.searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: ".75rem", fontWeight: 700, color: "#6B21A8", textDecoration: "none", whiteSpace: "nowrap", padding: ".2rem .4rem", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(107,33,168,.2)", flexShrink: 0 }}
                        >
                          Buy &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── PRI DIMENSION SCORES ── */}
        {/* Cinematic: six translucent pillars in dark water */}
        <Section id="dimensions" dark>
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/mesc_dimensions-9RVHkrAxpLwCZgHTJAW5G3.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) contrast(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #1C1410 100%)" }} />
          </div>
          <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
            <span style={S.eyebrowDash} />
            PRI Dimension Scores
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "2rem", color: "#F4F0E8" }}>
            Mescaline-Specific Readiness
          </h2>

          <div style={{ display: "grid", gap: ".75rem" }}>
            {MESCALINE_DIM_SCORES.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", background: "rgba(244,240,232,.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(244,240,232,.08)", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>{d.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".3rem", flexWrap: "wrap", gap: ".5rem" }}>
                    <div style={{ ...S.heading, fontSize: "1rem", fontWeight: 700, color: "#F4F0E8" }}>{d.dimension}</div>
                    <span style={{
                      fontSize: ".75rem",
                      fontWeight: 800,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      padding: ".15rem .5rem",
                      background: d.threshold === "Critical" ? "rgba(88,28,135,.2)" : d.threshold.includes("High") ? "rgba(200,166,76,.15)" : "rgba(107,143,113,.15)",
                      color: d.threshold === "Critical" ? "#EF5350" : d.threshold.includes("High") ? "#C9A84C" : "#81C784",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: d.threshold === "Critical" ? "rgba(88,28,135,.3)" : d.threshold.includes("High") ? "rgba(200,166,76,.3)" : "rgba(107,143,113,.3)",
                    }}>
                      {d.threshold}
                    </span>
                  </div>
                  <div style={{ fontSize: ".85rem", color: "rgba(244,240,232,.5)", lineHeight: 1.6 }}>{d.keyNote}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── MEDICINE SELECTOR ── */}
        <Section id="selector">
          <div style={S.eyebrow}>
            <span style={S.eyebrowDash} />
            Medicine Selector
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "1.5rem" }}>
            How Mescaline Compares
          </h2>

          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Medicine</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Dep</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Anx</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>PTSD</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Addict</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>Beginner</th>
                  <th style={thStyle}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {MEDICINE_SELECTOR.map((m, i) => {
                  const isMesc = m.medicine.includes("Mescaline");
                  return (
                    <tr key={i} style={{ background: isMesc ? "rgba(107,33,168,.06)" : i % 2 ? "#FAF7F2" : "transparent" }}>
                      <td style={{ ...tdStyle, fontWeight: isMesc ? 800 : 600, color: isMesc ? "#6B21A8" : "#1C1410", borderBottomColor: isMesc ? "rgba(107,33,168,.2)" : "#E8E2D8" }}>
                        {m.icon} {m.medicine}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center", color: m.depression === "\u2713" ? "#3D6B44" : "#7A6A5A" }}>{m.depression}</td>
                      <td style={{ ...tdStyle, textAlign: "center", color: m.anxiety === "\u2713" ? "#3D6B44" : "#7A6A5A" }}>{m.anxiety}</td>
                      <td style={{ ...tdStyle, textAlign: "center", color: m.ptsd === "\u2713" || m.ptsd === "Best" ? "#3D6B44" : "#7A6A5A" }}>{m.ptsd}</td>
                      <td style={{ ...tdStyle, textAlign: "center", color: m.addiction === "\u2713" || m.addiction === "Best" ? "#3D6B44" : "#7A6A5A" }}>{m.addiction}</td>
                      <td style={tdStyle}>{m.duration}</td>
                      <td style={tdStyle}>{m.beginner}</td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: ".7rem",
                          fontWeight: 700,
                          padding: ".15rem .4rem",
                          background: m.evidence.startsWith("Strong") ? "rgba(107,143,113,.15)" : "rgba(200,166,76,.15)",
                          color: m.evidence.startsWith("Strong") ? "#3D6B44" : "#8B6914",
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: m.evidence.startsWith("Strong") ? "rgba(107,143,113,.3)" : "rgba(200,166,76,.3)",
                        }}>
                          {m.evidence}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── SOURCES ── */}
        {/* Cinematic: DNA helix library with floating books */}
        <Section id="sources" dark>
          <div className="glitch-hero" style={{ width: "100%", height: "clamp(180px, 25vw, 280px)", overflow: "hidden", position: "relative", marginBottom: "2rem", borderRadius: 6 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/mesc_sources-aQ77qjP56eHB6vhUJNNXAo.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) contrast(1.2)" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #1C1410 100%)" }} />
          </div>
          <div style={{ ...S.eyebrow, color: "#6B21A8" }}>
            <span style={S.eyebrowDash} />
            Sources
          </div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", marginBottom: "1.5rem", color: "#F4F0E8" }}>
            Research &amp; References
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: 0 }}>
            {MESCALINE_SOURCES.map((s, i) => (
              <li key={i} style={{ fontSize: ".85rem", color: "rgba(244,240,232,.5)", lineHeight: 1.8, marginBottom: ".3rem" }}>
                {s}
              </li>
            ))}
          </ol>
        </Section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#1C1410", color: "rgba(244,240,232,.4)", padding: "3rem 1.25rem", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ ...S.heading, fontSize: "1.3rem", color: "#F4F0E8", marginBottom: ".4rem" }}>
              ImpactSoul <span style={{ color: "#6B21A8" }}>&times;</span> Psychedelic Readiness Index
            </div>
            <div style={{ fontSize: ".78rem", marginBottom: "1rem" }}>A consciousness-aligned capital initiative</div>

            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", margin: "1rem 0", flexWrap: "wrap" }}>
              <Link href="/psychedelic-readiness-index" style={{ fontSize: ".72rem", color: "rgba(244,240,232,.35)", textDecoration: "none", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>
                &larr; Back to PRI
              </Link>
              <Link href="/" style={{ fontSize: ".72rem", color: "rgba(244,240,232,.35)", textDecoration: "none", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>
                TonyGreenberg.com
              </Link>
            </div>

            {/* Full disclaimer */}
            <div style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "rgba(244,240,232,.06)", paddingTop: "1.25rem", marginTop: "1.5rem" }}>
              <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#6B21A8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".5rem" }}>
                Legal Disclaimer
              </div>
              <div style={{ fontSize: ".7rem", lineHeight: 1.8, color: "rgba(244,240,232,.35)" }}>
                {MESCALINE_DISCLAIMER}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
