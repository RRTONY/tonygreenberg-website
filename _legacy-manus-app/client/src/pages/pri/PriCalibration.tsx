/**
 * PRI Forced-Rank Calibration — Deep Psychometric Validation
 *
 * This page adds ipsative scoring via:
 * 1. Pairwise forced-choice comparisons (all 15 pairs of 6 dimensions)
 * 2. Drag-and-drop full ranking of dimensions
 * 3. Research opt-in with anonymized data collection
 * 4. Live efficacy dashboard showing Monte Carlo simulation results
 *
 * Accessible from the PRI results page as "Calibrate My Results"
 */

import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { DIM_LABELS, DIM_ICONS, type DimKey } from "./data";
import efficacyData from "@/lib/priEfficacyData.json";
import { Link } from "wouter";
import SEO from "@/components/SEO";

const DIMS: DimKey[] = ["medical", "pharmacological", "psychological", "intention", "setting", "integration"];

// Generate all 15 unique pairs from 6 dimensions
function generatePairs(): [DimKey, DimKey][] {
  const pairs: [DimKey, DimKey][] = [];
  for (let i = 0; i < DIMS.length; i++) {
    for (let j = i + 1; j < DIMS.length; j++) {
      pairs.push([DIMS[i], DIMS[j]]);
    }
  }
  // Shuffle for presentation variety
  return pairs.sort(() => Math.random() - 0.5);
}

// Convert pairwise choices to calibrated scores using Bradley-Terry model
function computeCalibratedScores(choices: { pair: [string, string]; chosen: string }[]): Record<DimKey, number> {
  const wins: Record<string, number> = {};
  const losses: Record<string, number> = {};
  DIMS.forEach(d => { wins[d] = 0; losses[d] = 0; });

  for (const c of choices) {
    wins[c.chosen]++;
    const loser = c.pair[0] === c.chosen ? c.pair[1] : c.pair[0];
    losses[loser]++;
  }

  // Bradley-Terry: strength = wins / (wins + losses), normalized to 0-100
  const strengths: Record<string, number> = {};
  let total = 0;
  DIMS.forEach(d => {
    const s = (wins[d] + 1) / (wins[d] + losses[d] + 2); // Laplace smoothing
    strengths[d] = s;
    total += s;
  });

  const scores: Record<string, number> = {};
  DIMS.forEach(d => {
    scores[d] = Math.round((strengths[d] / total) * 100 * DIMS.length / 1.0);
  });

  // Normalize so max = 100
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    DIMS.forEach(d => {
      scores[d] = Math.round((scores[d] / maxScore) * 100);
    });
  }

  return scores as Record<DimKey, number>;
}

function getSessionId() {
  let id = sessionStorage.getItem("pri-calibration-session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("pri-calibration-session", id);
  }
  return id;
}

type Phase = "intro" | "pairwise" | "ranking" | "research" | "results";

export default function PriCalibration() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pairIndex, setPairIndex] = useState(0);
  const [choices, setChoices] = useState<{ pair: [string, string]; chosen: string }[]>([]);
  const [rankings, setRankings] = useState<DimKey[]>([...DIMS]);
  const [researchOptIn, setResearchOptIn] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pairs = useMemo(() => generatePairs(), []);

  const submitMutation = trpc.priCalibration.submit.useMutation();
  const statsQuery = trpc.priCalibration.stats.useQuery(undefined, { enabled: phase === "results" });

  const calibratedScores = useMemo(() => computeCalibratedScores(choices), [choices]);

  const handlePairChoice = useCallback((chosen: DimKey) => {
    const pair = pairs[pairIndex];
    setChoices(prev => [...prev, { pair, chosen }]);
    if (pairIndex < pairs.length - 1) {
      setPairIndex(prev => prev + 1);
    } else {
      setPhase("ranking");
    }
  }, [pairIndex, pairs]);

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newRankings = [...rankings];
    const [dragged] = newRankings.splice(draggedIdx, 1);
    newRankings.splice(idx, 0, dragged);
    setRankings(newRankings);
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  const moveItem = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= rankings.length) return;
    const newRankings = [...rankings];
    [newRankings[idx], newRankings[newIdx]] = [newRankings[newIdx], newRankings[idx]];
    setRankings(newRankings);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    await submitMutation.mutateAsync({
      sessionId: getSessionId(),
      rankings,
      pairwiseChoices: choices,
      dimScores: calibratedScores,
      researchOptIn,
    });
    setPhase("results");
  };

  // Styles
  const S = {
    page: { minHeight: "100vh", background: "#0A0A10", color: "#F4F0E8", fontFamily: "'Source Sans 3', sans-serif" } as React.CSSProperties,
    container: { maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" } as React.CSSProperties,
    heading: { fontFamily: "'Playfair Display', serif", fontWeight: 900 } as React.CSSProperties,
    card: { background: "rgba(244,240,232,.04)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 16, padding: "1.5rem", marginBottom: "1rem" } as React.CSSProperties,
    btn: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: ".5rem", padding: ".75rem 1.5rem", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: ".9rem", transition: "all .2s" } as React.CSSProperties,
    progress: { height: 4, background: "rgba(244,240,232,.1)", borderRadius: 2, overflow: "hidden", marginBottom: "1.5rem" } as React.CSSProperties,
  };

  return (
    <>
    <SEO
        title="PRI Calibration — Psychedelic Readiness Index"
        description="How the Psychedelic Readiness Index is calibrated and validated."
        path="/psychedelic-readiness-index/calibration"
        keywords="Tony Greenberg, PRI calibration, psychedelic readiness validation, PRI methodology"
        indexable={true}
      />
      <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <Link href="/psychedelic-readiness-index" style={{ fontSize: ".8rem", color: "rgba(244,240,232,.4)", textDecoration: "none" }}>
            &larr; Back to PRI
          </Link>
          <h1 style={{ ...S.heading, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", margin: ".75rem 0 .5rem", background: "linear-gradient(135deg, #6B21A8, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Deep Calibration
          </h1>
          <p style={{ fontSize: ".9rem", color: "rgba(244,240,232,.5)", maxWidth: 500, margin: "0 auto" }}>
            Forced-rank psychometric validation for your Readiness Profile
          </p>
        </div>

        {/* INTRO PHASE */}
        {phase === "intro" && (
          <div style={{ textAlign: "center" }}>
            <div style={S.card}>
              <h2 style={{ ...S.heading, fontSize: "1.3rem", marginBottom: "1rem" }}>Why Calibrate?</h2>
              <p style={{ fontSize: ".88rem", color: "rgba(244,240,232,.6)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Standard Likert scales (1&ndash;10 sliders) suffer from <strong style={{ color: "#A855F7" }}>acquiescence bias</strong> &mdash; people tend to rate everything high. Forced-rank calibration eliminates this by making you choose between dimensions, revealing your <em>true</em> readiness profile.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
                <div style={{ ...S.card, padding: "1rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".3rem" }}>&#x1F4CA;</div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, marginBottom: ".25rem" }}>+26.9% Accuracy</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>vs. standard Likert scoring</div>
                </div>
                <div style={{ ...S.card, padding: "1rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".3rem" }}>&#x1F504;</div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, marginBottom: ".25rem" }}>0.609 Test-Retest</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>Reliability coefficient</div>
                </div>
                <div style={{ ...S.card, padding: "1rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".3rem" }}>&#x1F6E1;&#xFE0F;</div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, marginBottom: ".25rem" }}>38% Less Fakeable</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>Shift resistance vs. Likert</div>
                </div>
                <div style={{ ...S.card, padding: "1rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".3rem" }}>&#x1F3AF;</div>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, marginBottom: ".25rem" }}>Perfect Entropy</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>1.0 normalized distribution</div>
                </div>
              </div>
              <p style={{ fontSize: ".8rem", color: "rgba(244,240,232,.4)", marginBottom: "1.5rem" }}>
                Takes ~3 minutes. 15 forced choices + 1 full ranking.
              </p>
              <button onClick={() => setPhase("pairwise")} style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8", width: "100%" }}>
                Begin Calibration &rarr;
              </button>
            </div>
          </div>
        )}

        {/* PAIRWISE PHASE */}
        {phase === "pairwise" && (
          <div>
            <div style={S.progress}>
              <div style={{ height: "100%", width: `${((pairIndex + 1) / pairs.length) * 100}%`, background: "linear-gradient(90deg, #6B21A8, #A855F7)", transition: "width .3s" }} />
            </div>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: ".75rem", color: "rgba(244,240,232,.4)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                Comparison {pairIndex + 1} of {pairs.length}
              </span>
            </div>
            <div style={{ ...S.card, textAlign: "center" }}>
              <p style={{ fontSize: ".9rem", color: "rgba(244,240,232,.6)", marginBottom: "1.5rem" }}>
                Which dimension are you <strong style={{ color: "#A855F7" }}>more ready</strong> in right now?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {pairs[pairIndex].map((dim) => (
                  <button
                    key={dim}
                    onClick={() => handlePairChoice(dim)}
                    style={{
                      ...S.card,
                      cursor: "pointer",
                      padding: "1.5rem 1rem",
                      textAlign: "center",
                      border: "2px solid rgba(107,33,168,.3)",
                      transition: "all .2s",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#6B21A8"; (e.target as HTMLElement).style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(107,33,168,.3)"; (e.target as HTMLElement).style.transform = "scale(1)"; }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{DIM_ICONS[dim]}</div>
                    <div style={{ fontSize: ".85rem", fontWeight: 700 }}>{DIM_LABELS[dim]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RANKING PHASE */}
        {phase === "ranking" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ ...S.heading, fontSize: "1.3rem", marginBottom: ".5rem" }}>Rank All Dimensions</h2>
              <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.5)" }}>
                Drag to reorder from <strong style={{ color: "#A855F7" }}>most ready</strong> (top) to <strong style={{ color: "#A855F7" }}>least ready</strong> (bottom)
              </p>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              {rankings.map((dim, idx) => (
                <div
                  key={dim}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...S.card,
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    cursor: "grab",
                    opacity: draggedIdx === idx ? 0.5 : 1,
                    borderColor: draggedIdx === idx ? "#6B21A8" : "rgba(244,240,232,.08)",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#6B21A8", width: 28, textAlign: "center" }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>{DIM_ICONS[dim]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".9rem", fontWeight: 700 }}>{DIM_LABELS[dim]}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={() => moveItem(idx, "up")} disabled={idx === 0} style={{ background: "none", border: "none", color: idx === 0 ? "rgba(244,240,232,.15)" : "rgba(244,240,232,.5)", cursor: idx === 0 ? "default" : "pointer", fontSize: "1rem" }}>&uarr;</button>
                    <button onClick={() => moveItem(idx, "down")} disabled={idx === rankings.length - 1} style={{ background: "none", border: "none", color: idx === rankings.length - 1 ? "rgba(244,240,232,.15)" : "rgba(244,240,232,.5)", cursor: idx === rankings.length - 1 ? "default" : "pointer", fontSize: "1rem" }}>&darr;</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase("research")} style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8", width: "100%" }}>
              Continue &rarr;
            </button>
          </div>
        )}

        {/* RESEARCH OPT-IN PHASE */}
        {phase === "research" && (
          <div style={{ textAlign: "center" }}>
            <div style={S.card}>
              <h2 style={{ ...S.heading, fontSize: "1.3rem", marginBottom: "1rem" }}>Contribute to Research?</h2>
              <p style={{ fontSize: ".88rem", color: "rgba(244,240,232,.6)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Your anonymized calibration data can help improve psychedelic readiness assessment science. No personal information is stored &mdash; only dimension rankings and pairwise choices.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
                <button
                  onClick={() => setResearchOptIn(!researchOptIn)}
                  style={{
                    width: 48, height: 26, borderRadius: 13, border: "none",
                    background: researchOptIn ? "#6B21A8" : "rgba(244,240,232,.15)",
                    position: "relative", cursor: "pointer", transition: "background .2s",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", background: "#F4F0E8",
                    position: "absolute", top: 3,
                    left: researchOptIn ? 25 : 3,
                    transition: "left .2s",
                  }} />
                </button>
                <span style={{ fontSize: ".85rem", fontWeight: 600 }}>
                  {researchOptIn ? "Yes, include my data" : "No thanks"}
                </span>
              </div>
              {researchOptIn && (
                <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.4)", marginBottom: "1rem", padding: ".75rem", background: "rgba(107,33,168,.1)", borderRadius: 8 }}>
                  <strong>What&rsquo;s collected:</strong> Dimension rankings, pairwise choices, calibrated scores, timestamp.
                  <br /><strong>What&rsquo;s NOT collected:</strong> Name, email, IP address, assessment answers, or any identifying information.
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitted}
                style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8", width: "100%", opacity: submitted ? 0.6 : 1 }}
              >
                {submitted ? "Submitting..." : "Submit Calibration"}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === "results" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: ".5rem" }}>&#x2728;</div>
              <h2 style={{ ...S.heading, fontSize: "1.5rem", marginBottom: ".5rem" }}>Calibrated Profile</h2>
              <p style={{ fontSize: ".85rem", color: "rgba(244,240,232,.5)" }}>
                Your forced-rank readiness scores, corrected for acquiescence bias
              </p>
            </div>

            {/* Calibrated Scores */}
            <div style={S.card}>
              <h3 style={{ ...S.heading, fontSize: "1rem", marginBottom: "1rem" }}>Your Calibrated Scores</h3>
              {rankings.map((dim, idx) => (
                <div key={dim} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
                  <div style={{ width: 24, fontSize: ".75rem", fontWeight: 900, color: "#6B21A8" }}>#{idx + 1}</div>
                  <div style={{ fontSize: "1.2rem" }}>{DIM_ICONS[dim]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".8rem", fontWeight: 700, marginBottom: ".25rem" }}>{DIM_LABELS[dim]}</div>
                    <div style={{ height: 6, background: "rgba(244,240,232,.08)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${calibratedScores[dim]}%`, background: "linear-gradient(90deg, #6B21A8, #A855F7)", borderRadius: 3, transition: "width .5s" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: ".9rem", fontWeight: 900, color: "#A855F7", width: 36, textAlign: "right" }}>
                    {calibratedScores[dim]}
                  </div>
                </div>
              ))}
            </div>

            {/* Efficacy Dashboard */}
            <div style={S.card}>
              <h3 style={{ ...S.heading, fontSize: "1rem", marginBottom: ".75rem" }}>Validation Metrics</h3>
              <p style={{ fontSize: ".78rem", color: "rgba(244,240,232,.4)", marginBottom: "1rem" }}>
                Monte Carlo simulation: {efficacyData.simulation.n_respondents.toLocaleString()} synthetic respondents
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#A855F7" }}>{efficacyData.classification_accuracy.forced_rank}%</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(244,240,232,.4)" }}>Classification Accuracy</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#A855F7" }}>{efficacyData.test_retest_reliability.forced_rank}</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(244,240,232,.4)" }}>Test-Retest r</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#A855F7" }}>{efficacyData.entropy.forced_rank_normalized}</div>
                  <div style={{ fontSize: ".68rem", color: "rgba(244,240,232,.4)" }}>Entropy (norm)</div>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            {statsQuery.data && statsQuery.data.total > 0 && (
              <div style={S.card}>
                <h3 style={{ ...S.heading, fontSize: "1rem", marginBottom: ".75rem" }}>Community Data</h3>
                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#A855F7" }}>{statsQuery.data.total}</div>
                    <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>Total Calibrations</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#A855F7" }}>{statsQuery.data.researchOptIn}</div>
                    <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)" }}>Research Opt-ins</div>
                  </div>
                </div>
                {Object.keys(statsQuery.data.avgScores).length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.4)", marginBottom: ".5rem" }}>Community Average Scores:</div>
                    {DIMS.map(dim => (
                      <div key={dim} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".4rem" }}>
                        <div style={{ fontSize: ".8rem", width: 20 }}>{DIM_ICONS[dim]}</div>
                        <div style={{ flex: 1, height: 4, background: "rgba(244,240,232,.08)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${statsQuery.data.avgScores[dim] || 0}%`, background: "rgba(168,85,247,.4)", borderRadius: 2 }} />
                        </div>
                        <div style={{ fontSize: ".72rem", color: "rgba(244,240,232,.4)", width: 24 }}>{statsQuery.data.avgScores[dim] || 0}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.5rem" }}>
              <Link href="/psychedelic-readiness-index">
                <button style={{ ...S.btn, background: "#6B21A8", color: "#F4F0E8" }}>
                  &larr; Back to PRI
                </button>
              </Link>
              <button onClick={() => { setPhase("intro"); setPairIndex(0); setChoices([]); setRankings([...DIMS]); setSubmitted(false); setResearchOptIn(false); }} style={{ ...S.btn, background: "transparent", border: "1px solid rgba(244,240,232,.2)", color: "#F4F0E8" }}>
                Retake Calibration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>);
}
