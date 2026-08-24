/**
 * PEPTIDE HALL OF SHAME
 * 
 * A ranked audit of peptide questionnaires across the US.
 * Score 1 = best possible assessment, 100 = worst.
 * Based on 6 clinical criteria: contraindication screening, health goals,
 * personalized results, evidence citations, medical history, and disclaimer.
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { BioChainCTA } from "@/components/BioChainCTA";

/* ── Clinic Data (from research of 20 US peptide providers) ── */

interface Clinic {
  name: string;
  url: string;
  questions: number;
  score: number;
  type: string;
  contraindications: boolean;
  goals: boolean;
  personalized: boolean;
  evidence: boolean;
  medicalHistory: boolean;
  disclaimer: boolean;
  weaknesses: string;
  strengths: string;
  tier: "gold" | "silver" | "bronze" | "fail";
}

const CLINICS: Clinic[] = [
  { name: "Admire Medical", url: "https://www.admiremedical.com/peptides", questions: 19, score: 40, type: "Intake form", contraindications: true, goals: true, personalized: false, evidence: false, medicalHistory: true, disclaimer: true, weaknesses: "No immediate personalized results — it's a lead-in to a paid consultation. No citation of evidence.", strengths: "Good safety screening. Asks about contraindications, medical history, and health goals. Comprehensive intake.", tier: "silver" },
  { name: "Vitality Centers NW", url: "https://vitalitycentersnw.com/peptide-assessment", questions: 10, score: 90, type: "Lead generation form", contraindications: false, goals: true, personalized: false, evidence: false, medicalHistory: false, disclaimer: true, weaknesses: "No contraindication screening, generic results, no evidence cited, no medical history questions.", strengths: "Asks about health goals. Has disclaimer.", tier: "fail" },
  { name: "Elite Living & Health", url: "https://www.elitelivingandhealth.com", questions: 9, score: 90, type: "Lead generation form", contraindications: false, goals: true, personalized: false, evidence: false, medicalHistory: true, disclaimer: false, weaknesses: "No contraindication screening, no personalized results, no evidence. Basic lead gen.", strengths: "Asks about medical history and goals.", tier: "fail" },
  { name: "Defy Medical", url: "https://www.defymedical.com/services/peptide-therapy/", questions: 8, score: 95, type: "Lead generation form", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: true, weaknesses: "Basic lead generation form. No screening, no goals, no personalization, no evidence.", strengths: "Has disclaimer.", tier: "fail" },
  { name: "10X Health System", url: "https://10xhealthsystem.com", questions: 4, score: 95, type: "Lead generation form", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "Only 4 questions. Pure lead generation. No clinical value whatsoever.", strengths: "None.", tier: "fail" },
  { name: "Renew Youth", url: "https://www.renewyouth.com", questions: 8, score: 95, type: "Lead generation form", contraindications: false, goals: true, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "Lead generation disguised as assessment. No safety screening.", strengths: "Asks about goals.", tier: "fail" },
  { name: "HRTGuru", url: "https://www.hrtguru.com", questions: 5, score: 95, type: "Lead generation form", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: true, disclaimer: false, weaknesses: "Minimal questions. No personalization, no evidence, no safety screening.", strengths: "Asks about medical history.", tier: "fail" },
  { name: "Evolve", url: "https://www.evolvehrt.com", questions: 5, score: 100, type: "Lead generation form", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "Pure lead generation. No clinical criteria met.", strengths: "None.", tier: "fail" },
  { name: "Peptide Sciences", url: "https://www.peptidesciences.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment exists. Research chemical vendor.", strengths: "None.", tier: "fail" },
  { name: "Lifeline Medical", url: "https://lifelinemed.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment exists.", strengths: "None.", tier: "fail" },
  { name: "Bloom Health & Wellness", url: "https://bloomhealthwellness.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: true, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. Mentions goals on marketing page but no actual tool.", strengths: "None.", tier: "fail" },
  { name: "Fountain Life", url: "https://www.fountainlife.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. Premium pricing with no upfront screening.", strengths: "None.", tier: "fail" },
  { name: "Maximus", url: "https://www.maximustribe.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. DTC peptide sales with no screening.", strengths: "None.", tier: "fail" },
  { name: "Peter Attia MD", url: "https://peterattiamd.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: true, medicalHistory: false, disclaimer: false, weaknesses: "No assessment tool. Educational content only.", strengths: "Cites peer-reviewed evidence in articles.", tier: "fail" },
  { name: "Biote Medical", url: "https://biote.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. Hormone pellet focus, peptides secondary.", strengths: "None.", tier: "fail" },
  { name: "SSRP Institute", url: "https://ssrpinstitute.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment exists.", strengths: "None.", tier: "fail" },
  { name: "International Peptide Society", url: "https://peptidesociety.org", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: true, medicalHistory: false, disclaimer: false, weaknesses: "Professional society. No consumer-facing assessment.", strengths: "Publishes evidence-based guidelines.", tier: "fail" },
  { name: "Core Med Science", url: "https://coremedscience.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. Supplement vendor.", strengths: "None.", tier: "fail" },
  { name: "Peptide Clinics (AU)", url: "https://www.peptideclinics.com.au", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: false, medicalHistory: false, disclaimer: false, weaknesses: "No assessment. Australian telehealth provider.", strengths: "None.", tier: "fail" },
  { name: "AgelessRx", url: "https://www.agelessrx.com", questions: 0, score: 100, type: "No assessment", contraindications: false, goals: false, personalized: false, evidence: true, medicalHistory: true, disclaimer: false, weaknesses: "No upfront assessment. Requires paid consultation.", strengths: "Cites evidence. Collects medical history during consultation.", tier: "fail" },
];

/* ── Scoring Criteria ── */

const CRITERIA = [
  { key: "contraindications", label: "Screens Contraindications", weight: 25, description: "Does the tool ask about conditions that would make peptide use dangerous?" },
  { key: "medicalHistory", label: "Asks Medical History", weight: 20, description: "Does it collect relevant health background before recommending?" },
  { key: "personalized", label: "Personalized Results", weight: 20, description: "Does it generate individualized recommendations based on answers?" },
  { key: "evidence", label: "Cites Evidence", weight: 15, description: "Are recommendations backed by peer-reviewed research?" },
  { key: "goals", label: "Asks Health Goals", weight: 10, description: "Does it understand what the user is trying to achieve?" },
  { key: "disclaimer", label: "Medical Disclaimer", weight: 10, description: "Does it include appropriate medical disclaimers?" },
];

/* ── Our Assessment Comparison ── */

const OUR_ASSESSMENT = {
  name: "TonyG Peptide Clarity Index™",
  questions: 10,
  score: 5,
  axes: 7,
  archetypes: 16,
  contraindications: true,
  goals: true,
  personalized: true,
  evidence: true,
  medicalHistory: true,
  disclaimer: true,
};

/* ── Components ── */

function ScoreBadge({ score }: { score: number }) {
  const color = score <= 20 ? "#2E8B57" : score <= 50 ? "#D4B96A" : score <= 80 ? "#CD853F" : "#B22222";
  const label = score <= 20 ? "EXCELLENT" : score <= 50 ? "ADEQUATE" : score <= 80 ? "POOR" : "FAILING";
  return (
    <span style={{
      display: "inline-block",
      padding: "0.15rem 0.5rem",
      borderRadius: "4px",
      fontSize: "0.65rem",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.1em",
      fontWeight: 700,
      color: "#fff",
      background: color,
    }}>
      {score}/100 · {label}
    </span>
  );
}

function CriteriaCheck({ met }: { met: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      borderRadius: "50%",
      fontSize: "0.7rem",
      background: met ? "rgba(46,139,87,0.15)" : "rgba(178,34,34,0.1)",
      color: met ? "#2E8B57" : "#B22222",
    }}>
      {met ? "✓" : "✗"}
    </span>
  );
}

export default function PeptideHallOfShame() {
  const [sortBy, setSortBy] = useState<"score" | "questions" | "name">("score");
  const [expandedClinic, setExpandedClinic] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...CLINICS];
    if (sortBy === "score") arr.sort((a, b) => a.score - b.score);
    else if (sortBy === "questions") arr.sort((a, b) => b.questions - a.questions);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [sortBy]);

  const avgScore = useMemo(() => Math.round(CLINICS.reduce((s, c) => s + c.score, 0) / CLINICS.length), []);
  const withAssessment = CLINICS.filter(c => c.questions > 0).length;
  const withContraindications = CLINICS.filter(c => c.contraindications).length;
  const withEvidence = CLINICS.filter(c => c.evidence).length;

  return (
    <>
      <SEO
        title="Peptide Assessment Hall of Shame — How 20 US Clinics Score"
        description="We audited 20 peptide clinics and providers across the US on 6 clinical criteria. The results are damning: average score 93/100 (where 100 is worst)."
        indexable={true}
      />

      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        {/* FDA Shutdown Banner */}
        <div style={{ background: "linear-gradient(90deg, #1a0a0a 0%, #2a0a0a 50%, #1a0a0a 100%)", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(220, 38, 38, 0.3)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626", fontWeight: 700 }}>MARCH 2026</span>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#fca5a5" }}>Peptide Sciences shut down by FDA. <Link href="/rip-peptide-sciences" style={{ color: "#dc2626", textDecoration: "underline", fontWeight: 600 }}>Full breakdown &rarr;</Link></span>
          </div>
        </div>

        {/* Legal Banner */}
        <div style={{ background: "#0A0A10", borderBottom: "1px solid rgba(212,185,106,0.15)", padding: "0.6rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,185,106,0.6)", margin: 0 }}>
            Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice · <a href="/peptide-matrix#appeals" style={{ color: "#D4B96A", textDecoration: "underline" }}>Appeals Process</a>
          </p>
        </div>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0A0A10 0%, #1a1a2e 100%)",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }} className="glitch-hero">
          {/* Glassmorphic hero background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/peptide-hero-shame-F3CU4ffRKBb77JgiCsFgmX.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(1px) brightness(0.6)" }} loading="lazy" />
          </div>
          <div className="glitch-hero-scanlines" />
          <div className="glitch-hero-tear" />
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Peptide Assessment Audit · 20 US Providers
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#E8E4DC", lineHeight: 1.15, marginBottom: "1.5rem" }}>
              The Peptide Assessment<br />
              <span style={{ color: "#B22222" }}>Hall of Shame</span>
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.15rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 2rem" }}>
              We audited every peptide questionnaire we could find across the United States.
              Most aren't assessments at all — they're lead generation forms wearing a lab coat.
            </p>

            {/* Key Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", marginBottom: "2rem" }}>
              {[
                { value: `${avgScore}/100`, label: "Average Score", sub: "(100 = worst)" },
                { value: `${withAssessment}/20`, label: "Have Any Assessment", sub: "" },
                { value: `${withContraindications}/20`, label: "Screen Contraindications", sub: "" },
                { value: `${withEvidence}/20`, label: "Cite Evidence", sub: "" },
              ].map((stat) => (
                <div key={stat.label} style={{ minWidth: 120 }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#D4B96A", fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(232,228,220,0.4)", textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                  {stat.sub && (
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(232,228,220,0.3)" }}>
                      {stat.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "1rem" }}>
            Scoring Methodology
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#444", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Each provider was evaluated on 6 clinical criteria that any responsible peptide assessment should include.
            A score of 1 represents a perfect assessment; 100 represents the worst possible outcome — no assessment at all,
            or a lead generation form with zero clinical value. The criteria are weighted by clinical importance:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {CRITERIA.map((c) => (
              <div key={c.key} style={{
                background: "#fff",
                border: "1px solid rgba(139,105,20,0.1)",
                borderRadius: "8px",
                padding: "1rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: "#0A0A10" }}>
                    {c.label}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#D4B96A" }}>
                    {c.weight}%
                  </span>
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#666", margin: 0, lineHeight: 1.5 }}>
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          {/* Our Assessment Comparison */}
          <div style={{
            background: "linear-gradient(135deg, rgba(46,139,87,0.05), rgba(212,185,106,0.08))",
            border: "2px solid rgba(46,139,87,0.2)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "3rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", color: "#0A0A10", margin: "0 0 0.25rem" }}>
                  For Comparison: The Peptide Clarity Index™
                </h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", margin: 0 }}>
                  Our assessment scores <strong>5/100</strong> — meeting all 6 clinical criteria with 7 scoring axes and 16 personalized archetypes.
                </p>
              </div>
              <a
                href="/find-your-peptide"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.6rem 1.5rem",
                  background: "#2E8B57",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Take the Assessment →
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["✓ Contraindication Screening", "✓ Medical History", "✓ Personalized Results", "✓ Evidence Citations", "✓ Health Goals", "✓ Medical Disclaimer", "✓ 7 Clinical Axes", "✓ 16 Archetypes"].map((f) => (
                <span key={f} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  padding: "0.2rem 0.5rem",
                  background: "rgba(46,139,87,0.1)",
                  color: "#2E8B57",
                  borderRadius: "4px",
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Sort Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", margin: 0 }}>
              The Rankings
            </h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["score", "questions", "name"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.4rem 0.8rem",
                    border: `1px solid ${sortBy === s ? "#8B6914" : "rgba(139,105,20,0.2)"}`,
                    borderRadius: "4px",
                    background: sortBy === s ? "rgba(139,105,20,0.08)" : "transparent",
                    color: sortBy === s ? "#8B6914" : "#666",
                    cursor: "pointer",
                  }}
                >
                  {s === "score" ? "By Score" : s === "questions" ? "By Questions" : "By Name"}
                </button>
              ))}
            </div>
          </div>

          {/* Rankings Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sorted.map((clinic, i) => {
              const isExpanded = expandedClinic === clinic.name;
              const rank = sortBy === "score" ? i + 1 : undefined;
              return (
                <div
                  key={clinic.name}
                  style={{
                    background: "#fff",
                    border: `1px solid ${isExpanded ? "rgba(139,105,20,0.3)" : "rgba(139,105,20,0.08)"}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div
                    onClick={() => setExpandedClinic(isExpanded ? null : clinic.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      flexWrap: "wrap",
                    }}
                  >
                    {rank && (
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: rank <= 3 ? "#D4B96A" : "#999",
                        minWidth: 28,
                      }}>
                        #{rank}
                      </span>
                    )}
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0A0A10" }}>
                        {clinic.name}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999" }}>
                        {clinic.type} · {clinic.questions > 0 ? `${clinic.questions} questions` : "No assessment"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                      <CriteriaCheck met={clinic.contraindications} />
                      <CriteriaCheck met={clinic.medicalHistory} />
                      <CriteriaCheck met={clinic.personalized} />
                      <CriteriaCheck met={clinic.evidence} />
                      <CriteriaCheck met={clinic.goals} />
                      <CriteriaCheck met={clinic.disclaimer} />
                    </div>
                    <ScoreBadge score={clinic.score} />
                    <span style={{ fontSize: "0.8rem", color: "#999", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      ▼
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid rgba(139,105,20,0.08)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                        <div>
                          <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#B22222", marginBottom: "0.5rem" }}>
                            Weaknesses
                          </h4>
                          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.6, margin: 0 }}>
                            {clinic.weaknesses}
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2E8B57", marginBottom: "0.5rem" }}>
                            Strengths
                          </h4>
                          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.6, margin: 0 }}>
                            {clinic.strengths || "None identified."}
                          </p>
                        </div>
                      </div>
                      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <a
                          href={clinic.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.65rem",
                            color: "#8B6914",
                            textDecoration: "underline",
                          }}
                        >
                          Visit Site →
                        </a>
                        {/* Criteria detail */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {CRITERIA.map((c) => {
                            const met = clinic[c.key as keyof Clinic] as boolean;
                            return (
                              <span key={c.key} style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.55rem",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "3px",
                                background: met ? "rgba(46,139,87,0.08)" : "rgba(178,34,34,0.05)",
                                color: met ? "#2E8B57" : "#B22222",
                              }}>
                                {met ? "✓" : "✗"} {c.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            marginTop: "3rem",
            background: "linear-gradient(135deg, #0A0A10, #1a1a2e)",
            borderRadius: "16px",
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#E8E4DC", marginBottom: "1rem" }}>
              Take an Assessment That Actually Works
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 2rem" }}>
              10 questions. 7 clinical axes. 16 personalized archetypes.
              Contraindication screening. Evidence citations. No lead generation tricks.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/find-your-peptide"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  background: "linear-gradient(135deg, #D4B96A, #8B6914)",
                  color: "#0A0A10",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Take the Assessment →
              </a>
              <a
                href="/peptide-supply-chain"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Where Does Your $ Go? →
              </a>
              <a
                href="/peptide-matrix"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Review vs Evidence Matrix →
              </a>
              <a
                href="/quiz_25q"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                25-Question Quiz →
              </a>
              <a
                href="/peptide-watch"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(200,75,42,0.4)",
                  color: "#C84B2A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                PeptideWatch Safety Guide →
              </a>
            </div>
          </div>

          {/* Vendor CTA */}
          <div style={{ marginTop: "3rem", padding: "2rem", background: "linear-gradient(135deg, rgba(139,105,20,0.08), rgba(139,105,20,0.02))", border: "1px solid rgba(212,185,106,0.25)", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem" }}>FOR MANUFACTURERS & SUPPLIERS</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "0.75rem" }}>Join Our Vetted Supply Network</h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              We are onboarding 400+ naturopathic clinics and selectively expanding our approved vendor base. If your manufacturing meets our transparency and quality standards, we want to hear from you.
            </p>
            <a
              href="/supplier-intake"
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.9rem 2.5rem",
                background: "#8B6914",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Become a Supply Partner →
            </a>
          </div>

          {/* BioChain CTA */}
          <BioChainCTA
            variant="supplier"
            context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier applications at RampRate."
          />

          {/* Disclaimer */}
          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(139,105,20,0.03)", borderRadius: "8px", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#999", lineHeight: 1.6, margin: 0 }}>
              <strong>Methodology Note:</strong> This audit was conducted in February 2026 by visiting each provider's website and
              evaluating their publicly available peptide assessment or questionnaire tools. Scores reflect the quality of the
              consumer-facing assessment tool only — not the quality of clinical care provided. Providers without a public assessment
              tool received the maximum weakness score (100). This page is for educational purposes only and does not constitute
              medical advice. Rankings may change as providers update their tools.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
