/**
 * IBOGA COMPASS ASSESSMENT v2 — Section Component
 * Renders the full compass assessment content within the IbogaDeepDive page.
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  COMPASS_INTRO,
  COMPASS_WHATS_NEW,
  COMPASS_HOW_IT_WORKS,
  COMPASS_FORMULA,
  COMPASS_FORMULA_NOTE,
  COMPASS_DIMENSIONS,
  COMPASS_RANK_MULTIPLIERS,
  COMPASS_QUESTIONS,
  COMPASS_SUBSTANCE_ROUTING,
  COMPASS_HARD_FILTERS,
  COMPASS_SCENARIOS,
  COMPASS_SOURCES,
  COMPASS_VALIDITY_NOTICE,
  COMPASS_REQUIRED_READING,
} from "./iboga-compass-data";

/* ── Shared styles matching IbogaDeepDive ── */
const S = {
  eyebrow: { fontSize: "0.85rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#6B21A8", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" } as React.CSSProperties,
  eyebrowDash: { width: "1.5rem", height: 2, background: "#6B21A8", display: "block" } as React.CSSProperties,
  heading: { fontFamily: "'Playfair Display', 'Fraunces', Georgia, serif", fontWeight: 800, letterSpacing: "-.02em" } as React.CSSProperties,
  label: { fontSize: "0.85rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#6B21A8", margin: "1.25rem 0 .4rem" } as React.CSSProperties,
  body: { fontSize: "1.05rem", color: "#4A3F35", lineHeight: 1.75 } as React.CSSProperties,
  bodyDark: { fontSize: "1.05rem", color: "#E8E2D8", lineHeight: 1.75 } as React.CSSProperties,
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

const thDark: React.CSSProperties = { ...thStyle, background: "#2A2420", color: "#D4B96A", borderBottomColor: "#3A3530" };
const tdDark: React.CSSProperties = { ...tdStyle, color: "#E8E2D8", borderBottomColor: "#3A3530" };
const tdDarkAlt: React.CSSProperties = { ...tdDark, background: "rgba(255,255,255,0.03)" };

/* ── Section wrapper ── */
function SubSection({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ padding: "3rem 0", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: dark ? "#3A3530" : "#E8E2D8" }}>
      {children}
    </div>
  );
}

export default function IbogaCompassSection() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  return (
    <>
      {/* ── COMPASS INTRO ── */}
      <section id="compass" style={{ padding: "4rem 1.25rem", background: "#F4F0E8", color: "#1C1410" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={S.eyebrow}><span style={S.eyebrowDash} />THE IBOGA COMPASS</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.8rem, 4.5vw, 3rem)", margin: "0 0 1rem" }}>
            Assessment — v2
          </h2>
          <p style={{ ...S.body, fontSize: "1.2rem", maxWidth: 800, marginBottom: "1.5rem", fontStyle: "italic" }}>
            {COMPASS_INTRO.tagline}
          </p>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "2rem" }}>
            {COMPASS_INTRO.description}
          </p>
          <p style={{ ...S.body, fontSize: "0.95rem", color: "#6B5B3E" }}>
            — <a href={COMPASS_INTRO.authorUrl} style={{ color: "#6B21A8", textDecoration: "underline" }}>{COMPASS_INTRO.author}</a> · {COMPASS_INTRO.name}
          </p>

          {/* What's New */}
          <SubSection>
            <div style={S.label}>WHAT'S NEW IN VERSION 2</div>
            <p style={{ ...S.body, marginBottom: "1rem", maxWidth: 800 }}>
              Version 1 was thin on substance breadth and missed several contraindications that real iboga clinics screen for. Version 2 closes those gaps and adds a priority-rank step so the user can fine-tune what matters most.
            </p>
            <ol style={{ ...S.body, paddingLeft: "1.5rem", maxWidth: 800 }}>
              {COMPASS_WHATS_NEW.map((item, i) => (
                <li key={i} style={{ marginBottom: ".5rem" }}><strong>{item.split(" — ")[0]}</strong>{item.includes(" — ") ? ` — ${item.split(" — ").slice(1).join(" — ")}` : ""}</li>
              ))}
            </ol>
          </SubSection>

          {/* How It Works */}
          <SubSection>
            <div style={S.label}>HOW IT WORKS</div>
            <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
              {COMPASS_HOW_IT_WORKS}
            </p>
            <div style={{ background: "#1C1410", borderRadius: 8, padding: "1.25rem 1.5rem", maxWidth: 600, fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", color: "#D4B96A", lineHeight: 1.8 }}>
              <div>{COMPASS_FORMULA}</div>
            </div>
            <p style={{ ...S.body, marginTop: "1rem", maxWidth: 800, fontSize: "0.95rem" }}>
              {COMPASS_FORMULA_NOTE}
            </p>
          </SubSection>

          {/* 10 Dimensions */}
          <SubSection>
            <div style={S.label}>THE 10 DIMENSIONS</div>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr>
                    {["#", "Dimension", "Measures"].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPASS_DIMENSIONS.map((d, i) => {
                    const s = i % 2 ? tdAlt : tdStyle;
                    return (
                      <tr key={d.num}>
                        <td style={{ ...s, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#6B21A8" }}>{d.num}</td>
                        <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{d.dimension}</td>
                        <td style={s}>{d.measures}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SubSection>

          {/* Priority Rank Multipliers */}
          <SubSection>
            <div style={S.label}>PRIORITY RANK MULTIPLIERS</div>
            <p style={{ ...S.body, maxWidth: 800, marginBottom: "1rem" }}>
              After the 28 questions, the user reorders dimensions. Position determines multiplier:
            </p>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", maxWidth: 600 }}>
                <thead>
                  <tr>
                    {["Position", "Multiplier", "Effect"].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPASS_RANK_MULTIPLIERS.map((r, i) => {
                    const s = i % 2 ? tdAlt : tdStyle;
                    return (
                      <tr key={r.position}>
                        <td style={{ ...s, fontWeight: 700 }}>{r.position}</td>
                        <td style={{ ...s, fontFamily: "'DM Mono', monospace", color: "#6B21A8", fontWeight: 700 }}>{r.multiplier}</td>
                        <td style={s}>{r.effect}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ ...S.body, marginTop: "1rem", maxWidth: 800, fontSize: "0.95rem" }}>
              This compounds with the question-derived weights, then re-normalizes to sum to 1.
            </p>
          </SubSection>
        </div>
      </section>

      {/* ── THE 28 QUESTIONS ── */}
      <section id="compass-questions" style={{ padding: "4rem 1.25rem", background: "#1C1410", color: "#F4F0E8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />THE 28 QUESTIONS</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", margin: "0 0 2rem", color: "#FAFAF7" }}>
            Full Question Set
          </h2>

          {COMPASS_QUESTIONS.map((section) => (
            <div key={section.sectionNum} style={{ marginBottom: "2rem" }}>
              <button
                onClick={() => setExpandedSection(expandedSection === section.sectionNum ? null : section.sectionNum)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                  padding: "1rem 1.25rem",
                  background: expandedSection === section.sectionNum ? "rgba(212,185,106,0.12)" : "rgba(255,255,255,0.04)",
                  border: "1px solid",
                  borderColor: expandedSection === section.sectionNum ? "#D4B96A" : "#3A3530",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#F4F0E8",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#D4B96A", fontWeight: 700, minWidth: "2.5rem" }}>
                  {String(section.sectionNum).padStart(2, "0")}
                </span>
                <span style={{ fontWeight: 700, fontSize: "1.05rem", flex: 1 }}>
                  {section.sectionTitle}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#8A8070" }}>
                  {section.questions.length} question{section.questions.length > 1 ? "s" : ""}
                </span>
                <span style={{ fontSize: "1.2rem", color: "#D4B96A", transform: expandedSection === section.sectionNum ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  ▾
                </span>
              </button>

              {expandedSection === section.sectionNum && (
                <div style={{ padding: "1.5rem 1.25rem", borderWidth: "0 1px 1px", borderStyle: "solid", borderColor: "#3A3530", borderRadius: "0 0 8px 8px", background: "rgba(255,255,255,0.02)" }}>
                  {section.questions.map((q) => (
                    <div key={q.id} style={{ marginBottom: "1.5rem" }}>
                      <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".5rem", color: "#FAFAF7" }}>
                        <span style={{ color: "#D4B96A", fontFamily: "'DM Mono', monospace", marginRight: ".5rem" }}>{q.id}.</span>
                        {q.text}
                      </p>
                      {q.note && (
                        <p style={{ fontSize: "0.9rem", color: "#8A8070", marginBottom: ".5rem", fontStyle: "italic" }}>{q.note}</p>
                      )}
                      <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                        {q.options.map((opt, oi) => (
                          <li key={oi} style={{ fontSize: "0.95rem", color: "#E8E2D8", lineHeight: 1.7, marginBottom: ".25rem" }}>
                            {opt.includes("→") ? (
                              <>
                                {opt.split("→")[0]}
                                <span style={{ color: "#D4B96A", fontWeight: 600 }}>→ {opt.split("→")[1]}</span>
                              </>
                            ) : opt.includes("EXCLUDES") ? (
                              <span style={{ color: "#EF4444", fontWeight: 700 }}>{opt}</span>
                            ) : (
                              opt
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <p style={{ ...S.bodyDark, marginTop: "2rem", fontSize: "0.95rem", color: "#8A8070" }}>
            <strong style={{ color: "#D4B96A" }}>Final Step — Priority Rank:</strong> After 28 questions, the user sees their pre-ranked 10 dimensions. They can tap up/down arrows to reorder. Top 3 weighted ×1.4 to ×2.0. Bottom 3 weighted ×0.5 to ×0.7.
          </p>
        </div>
      </section>

      {/* ── SUBSTANCE ROUTING ── */}
      <section id="compass-routing" style={{ padding: "4rem 1.25rem", background: "#F4F0E8", color: "#1C1410" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={S.eyebrow}><span style={S.eyebrowDash} />SUBSTANCE-TO-FACILITY ROUTING</div>
          <h2 style={{ ...S.heading, fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", margin: "0 0 1rem" }}>
            How Substance Selections Route to Facilities
          </h2>
          <p style={{ ...S.body, maxWidth: 800, marginBottom: "1.5rem" }}>
            Additive boosts — selecting multiple substances compounds all routing bonuses.
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Substance</th>
                  <th style={thStyle}>Top Facilities</th>
                </tr>
              </thead>
              <tbody>
                {COMPASS_SUBSTANCE_ROUTING.map((r, i) => {
                  const s = i % 2 ? tdAlt : tdStyle;
                  return (
                    <tr key={r.substance}>
                      <td style={{ ...s, fontWeight: 700, whiteSpace: "nowrap" }}>{r.substance}</td>
                      <td style={{ ...s, fontFamily: "'DM Mono', monospace", fontSize: "0.88rem" }}>{r.facilities}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* ── CROSS-REFERENCED SOURCES ── */}
      <section id="compass-sources" style={{ padding: "3rem 1.25rem", background: "#1C1410", color: "#F4F0E8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />CROSS-REFERENCED SOURCES</div>
          <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0 0" }}>
            {COMPASS_SOURCES.map((s, i) => (
              <li key={i} style={{ marginBottom: ".5rem" }}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#D4B96A", textDecoration: "underline", fontSize: "0.95rem" }}>
                  {s.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── VALIDITY NOTICE ── */}
      <section id="compass-validity" style={{ padding: "3rem 1.25rem", background: "#F4F0E8", color: "#1C1410" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={S.dangerBox}>
            <p style={{ fontWeight: 800, margin: "0 0 .5rem", color: "#581C87", fontSize: "1rem" }}>⚠ VALIDITY NOTICE</p>
            <p style={{ ...S.body, margin: 0, fontSize: "0.95rem" }}>{COMPASS_VALIDITY_NOTICE}</p>
          </div>
        </div>
      </section>

      {/* ── REQUIRED READING ── */}
      <section id="compass-reading" style={{ padding: "3rem 1.25rem", background: "#1C1410", color: "#F4F0E8" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ ...S.eyebrow, color: "#D4B96A" }}><span style={{ ...S.eyebrowDash, background: "#D4B96A" }} />REQUIRED READING</div>
          <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0 2rem" }}>
            {COMPASS_REQUIRED_READING.map((r, i) => (
              <li key={i} style={{ marginBottom: ".75rem" }}>
                <a href={r.url} style={{ color: "#D4B96A", textDecoration: "underline", fontSize: "1rem", fontWeight: 700 }}>
                  {r.text}
                </a>
                <span style={{ color: "#8A8070", fontSize: "0.9rem" }}> — {r.desc}</span>
              </li>
            ))}
          </ul>
          <p style={{ textAlign: "center", fontSize: "1.1rem", fontStyle: "italic", color: "#D4B96A", fontFamily: "'Playfair Display', Georgia, serif" }}>
            The gold is in the cracks.
          </p>
          {/* ── TAKE THE ASSESSMENT CTA ── */}
          <div style={{ textAlign: "center", margin: "2.5rem 0 1.5rem" }}>
            <Link href="/iboga-compass" style={{ display: "inline-block", background: "linear-gradient(135deg, #6B21A8, #9333EA)", color: "#fff", padding: "1rem 2.5rem", borderRadius: 8, fontSize: "1.1rem", fontWeight: 700, letterSpacing: ".04em", textDecoration: "none", boxShadow: "0 4px 20px rgba(107,33,168,.35)", transition: "transform .2s, box-shadow .2s" }}>
              TAKE THE COMPASS ASSESSMENT
            </Link>
            <p style={{ marginTop: ".75rem", fontSize: "0.85rem", color: "#8A8070" }}>28 questions · 5 minutes · ranked facility matches</p>
          </div>

          <p style={{ textAlign: "center", marginTop: ".75rem", fontSize: "0.9rem", color: "#8A8070" }}>
            <a href="https://tonygreenberg.com" style={{ color: "#D4B96A", textDecoration: "none" }}>tonygreenberg.com</a>
            {" · "}
            <a href="https://impactsoul.is" style={{ color: "#D4B96A", textDecoration: "none" }}>impactsoul.is</a>
          </p>
        </div>
      </section>
    </>
  );
}
