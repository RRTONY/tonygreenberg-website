/**
 * PRI Efficacy — Psychometric Validation Dashboard
 * Shows Monte Carlo simulation results, reliability metrics, and live calibration stats
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import simData from "@/lib/priEfficacyData.json";
import SEO from "@/components/SEO";

const DIM_LABELS: Record<string, string> = {
  Medical: "Medical Readiness",
  Pharmacological: "Pharmacological Knowledge",
  Psychological: "Psychological Stability",
  Intention: "Intentionality & Purpose",
  Setting: "Set & Setting Preparation",
  Integration: "Integration Capacity",
};

const DIM_COLORS: Record<string, string> = {
  Medical: "#EF4444",
  Pharmacological: "#F59E0B",
  Psychological: "#10B981",
  Intention: "#6366F1",
  Setting: "#8B5CF6",
  Integration: "#EC4899",
};

function BarChart({ label, value, max, color, suffix }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
<div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: ".25rem" }}>
        <span style={{ color: "#F4F0E8" }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{typeof value === "number" ? value.toFixed(1) : value}{suffix || ""}</span>
      </div>
      <div style={{ height: 8, background: "rgba(244,240,232,.1)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string | number; subtitle?: string; color?: string }) {
  return (
    <div style={{ background: "rgba(107,33,168,.08)", border: "1px solid rgba(107,33,168,.25)", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
      <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(244,240,232,.5)", marginBottom: ".5rem" }}>{title}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: color || "#A855F7" }}>{value}</div>
      {subtitle && <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.4)", marginTop: ".25rem" }}>{subtitle}</div>}
    </div>
  );
}

export default function PriEfficacy() {
  const [activeTab, setActiveTab] = useState<"simulation" | "live">("simulation");
  const { data: liveStats } = trpc.priCalibration.stats.useQuery();

  const dims = Object.keys(DIM_LABELS);
  const { classification_accuracy, differentiation, entropy, test_retest_reliability, role_distribution, first_role_inflation, simulation } = simData;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", color: "#F4F0E8", fontFamily: "'Source Sans 3', sans-serif" }}>
      <SEO
        title="PRI Efficacy — Research and Evidence"
        description="The research and evidence base behind the Psychedelic Readiness Index."
        path="/psychedelic-readiness-index/efficacy"
        keywords="Tony Greenberg, PRI efficacy, psychedelic research, readiness index evidence"
        indexable={true}
      />
      {/* Header */}
      <header style={{ padding: "3rem 1.5rem 2rem", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".15em", color: "#A855F7", marginBottom: ".5rem" }}>Psychometric Validation</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          PRI Efficacy Report
        </h1>
        <p style={{ color: "rgba(244,240,232,.5)", marginTop: ".75rem", fontSize: ".95rem", maxWidth: 600, margin: ".75rem auto 0" }}>
          Monte Carlo simulation with {simulation.n_respondents.toLocaleString()} synthetic respondents validates the Psychedelic Readiness Index across six dimensions of preparedness.
        </p>
      </header>

      {/* Tab Switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: ".5rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("simulation")}
          style={{ padding: ".5rem 1.25rem", borderRadius: 6, border: "1px solid rgba(107,33,168,.4)", background: activeTab === "simulation" ? "#6B21A8" : "transparent", color: "#F4F0E8", cursor: "pointer", fontSize: ".85rem" }}
        >
          Simulation (n={simulation.n_respondents.toLocaleString()})
        </button>
        <button
          onClick={() => setActiveTab("live")}
          style={{ padding: ".5rem 1.25rem", borderRadius: 6, border: "1px solid rgba(107,33,168,.4)", background: activeTab === "live" ? "#6B21A8" : "transparent", color: "#F4F0E8", cursor: "pointer", fontSize: ".85rem" }}
        >
          Live Calibrations
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        {activeTab === "simulation" && (
          <>
            {/* Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              <StatCard title="Classification Accuracy" value={`${classification_accuracy.forced_rank}%`} subtitle="forced-rank method" color="#10B981" />
              <StatCard title="Test-Retest Reliability" value={test_retest_reliability.forced_rank.toFixed(2)} subtitle="forced-rank r-value" />
              <StatCard title="Entropy (Normalized)" value={entropy.forced_rank_normalized.toFixed(2)} subtitle="distribution uniformity" />
              <StatCard title="Improvement" value={`+${classification_accuracy.improvement}%`} subtitle="vs. Likert alone" color="#F59E0B" />
            </div>

            {/* Classification Comparison */}
            <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1.25rem" }}>Classification Accuracy: Likert vs. Forced-Rank</h3>
              <p style={{ fontSize: ".8rem", color: "rgba(244,240,232,.4)", marginBottom: "1rem" }}>
                Forced-rank calibration nearly doubles classification accuracy by eliminating acquiescence bias and social desirability effects.
              </p>
              <BarChart label="Likert Self-Report" value={classification_accuracy.likert} max={100} color="#EF4444" suffix="%" />
              <BarChart label="Forced-Rank Calibrated" value={classification_accuracy.forced_rank} max={100} color="#10B981" suffix="%" />
            </div>

            {/* Role Distribution */}
            <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1.25rem" }}>Dimension Priority Distribution</h3>
              <p style={{ fontSize: ".8rem", color: "rgba(244,240,232,.4)", marginBottom: "1rem" }}>
                Likert scoring inflates "{first_role_inflation.role}" by {first_role_inflation.inflation_pct}%. Forced-rank produces near-uniform distribution.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(244,240,232,.4)", marginBottom: ".75rem" }}>Likert (biased)</div>
                  {dims.map(d => (
                    <BarChart key={d} label={d} value={(role_distribution.likert as Record<string, number>)[d] / 100} max={simulation.n_respondents / 100 / 6 * 2} color={DIM_COLORS[d]} />
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(244,240,232,.4)", marginBottom: ".75rem" }}>Forced-Rank (calibrated)</div>
                  {dims.map(d => (
                    <BarChart key={d} label={d} value={(role_distribution.forced_rank as Record<string, number>)[d] / 100} max={simulation.n_respondents / 100 / 6 * 2} color={DIM_COLORS[d]} />
                  ))}
                </div>
              </div>
            </div>

            {/* Test-Retest & Entropy */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Test-Retest Reliability</h3>
                <BarChart label="Likert" value={test_retest_reliability.likert} max={1} color="#EF4444" />
                <BarChart label="Forced-Rank" value={test_retest_reliability.forced_rank} max={1} color="#10B981" />
                <p style={{ fontSize: ".75rem", color: "rgba(244,240,232,.35)", marginTop: ".5rem" }}>
                  Correlation between first and second administration (n={simulation.n_retest.toLocaleString()} retested)
                </p>
              </div>
              <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Distribution Entropy</h3>
                <BarChart label="Likert" value={entropy.likert} max={entropy.max_possible} color="#F59E0B" />
                <BarChart label="Forced-Rank" value={entropy.forced_rank} max={entropy.max_possible} color="#10B981" />
                <p style={{ fontSize: ".75rem", color: "rgba(244,240,232,.35)", marginTop: ".5rem" }}>
                  Higher entropy = more uniform distribution across dimensions (max: {entropy.max_possible})
                </p>
              </div>
            </div>

            {/* Methodology */}
            <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem" }}>Methodology</h3>
              <div style={{ fontSize: ".85rem", color: "rgba(244,240,232,.6)", lineHeight: 1.7 }}>
                <p>The PRI validation uses a Monte Carlo simulation with {simulation.n_respondents.toLocaleString()} synthetic respondents across {simulation.roles.length} readiness dimensions. Each respondent's answers are generated using dimension-specific trait distributions that model real-world response patterns including acquiescence bias and social desirability effects.</p>
                <p style={{ marginTop: ".75rem" }}>Key validation metrics:</p>
                <ul style={{ paddingLeft: "1.25rem", marginTop: ".5rem" }}>
                  <li><strong>Classification Accuracy:</strong> Percentage of respondents correctly assigned to their true primary readiness dimension.</li>
                  <li><strong>Test-Retest Reliability:</strong> Stability of rankings across repeated administrations (n={simulation.n_retest.toLocaleString()}).</li>
                  <li><strong>Faking Resistance:</strong> Tested with {simulation.n_faking.toLocaleString()} simulated fakers attempting to inflate scores.</li>
                  <li><strong>Distribution Entropy:</strong> Measures how uniformly respondents are classified across dimensions (max = log2({simulation.roles.length}) = {entropy.max_possible}).</li>
                </ul>
                <p style={{ marginTop: ".75rem" }}>The forced-rank calibration module eliminates first-dimension inflation bias ({first_role_inflation.likert_pct}% → {first_role_inflation.forced_rank_pct}%) by requiring explicit trade-off comparisons between dimensions.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "live" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              <StatCard title="Total Calibrations" value={liveStats?.total ?? 0} subtitle="completed sessions" />
              <StatCard title="Research Opt-Ins" value={liveStats?.researchOptIn ?? 0} subtitle="contributing to science" />
              <StatCard title="Opt-In Rate" value={liveStats?.total ? `${Math.round((liveStats.researchOptIn / liveStats.total) * 100)}%` : "—"} subtitle="participation rate" />
            </div>

            {liveStats?.total === 0 || !liveStats ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "rgba(244,240,232,.03)", borderRadius: 12, border: "1px solid rgba(244,240,232,.08)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔬</div>
                <p style={{ color: "rgba(244,240,232,.5)" }}>No live calibration data yet. Complete the <a href="/pri-calibration" style={{ color: "#A855F7" }}>Deep Calibration</a> to contribute.</p>
              </div>
            ) : (
              <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1.25rem" }}>Live Average Scores by Dimension</h3>
                {liveStats?.avgScores && Object.entries(liveStats.avgScores).map(([dim, score]) => (
                  <BarChart key={dim} label={DIM_LABELS[dim] || dim} value={score as number} max={100} color={DIM_COLORS[dim] || "#A855F7"} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ textAlign: "center", padding: "2rem 1.5rem 4rem" }}>
        <a href="/psychedelic-readiness-index" style={{ color: "#A855F7", fontSize: ".9rem" }}>← Take the PRI Assessment</a>
        <span style={{ margin: "0 1rem", color: "rgba(244,240,232,.2)" }}>|</span>
        <a href="/pri-calibration" style={{ color: "#A855F7", fontSize: ".9rem" }}>Deep Calibration →</a>
      </div>
    </div>
  );
}
