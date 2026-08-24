/**
 * THE MIRROR — Life Assessment
 * 18 questions across 6 dimensions. Radar visualization.
 * Routes to personalized article journey + satellite sites.
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import { AssessmentResultActions } from "@/components/AssessmentResultActions";
import {
  FadeIn,
  Section,
  SectionTitle,
  Eyebrow,
  Divider,
  Spacer,
} from "@/components/Editorial";
import mirrorData from "@/data/mirrorData.json";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

/* ── types ─────────────────────────────────────────────── */
type Dimension = (typeof mirrorData.dimensions)[number];
type Question = (typeof mirrorData.questions)[number];

/* ── radar chart (pure SVG) ────────────────────────────── */
function RadarChart({
  scores,
  dimensions,
}: {
  scores: Record<string, number>;
  dimensions: Dimension[];
}) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 130;
  const levels = 4;

  const angleStep = (2 * Math.PI) / dimensions.length;
  const startAngle = -Math.PI / 2; // top

  const point = (i: number, r: number) => {
    const a = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, l) => {
    const r = ((l + 1) / levels) * maxR;
    return dimensions.map((_, i) => point(i, r)).map((p) => `${p.x},${p.y}`).join(" ");
  });

  const dataPoints = dimensions.map((d, i) => {
    const val = (scores[d.id] || 0) / 9; // normalize to 0-1
    return point(i, val * maxR);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPoints = dimensions.map((d, i) => {
    const p = point(i, maxR + 28);
    return { ...p, label: d.name.split(" & ")[0], dim: d };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto">
      {/* grid */}
      {gridPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="oklch(0.75 0.05 85)"
          strokeWidth={i === levels - 1 ? 1.5 : 0.5}
          opacity={0.3}
        />
      ))}
      {/* axes */}
      {dimensions.map((_, i) => {
        const p = point(i, maxR);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="oklch(0.75 0.05 85)"
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}
      {/* data area */}
      <polygon
        points={dataPolygon}
        fill="oklch(0.65 0.12 85)"
        fillOpacity={0.2}
        stroke="oklch(0.55 0.15 85)"
        strokeWidth={2}
      />
      {/* data dots */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="oklch(0.55 0.15 85)"
          stroke="#FAFAF7"
          strokeWidth={1.5}
        />
      ))}
      {/* labels */}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[#5A5A52] text-[9px] font-['DM_Mono',monospace] uppercase tracking-wider"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

/* ── main component ────────────────────────────────────── */
export default function LifeAssessment() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"intro" | "questions" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const { markComplete } = useJourneyProgress();
  const questionRef = useRef<HTMLDivElement>(null);

  const questions = mirrorData.questions;
  const dimensions = mirrorData.dimensions;

  // Calculate dimension scores
  const dimensionScores = useMemo(() => {
    const scores: Record<string, number> = {};
    dimensions.forEach((d) => {
      const dimQuestions = questions.filter((q) => q.dimension === d.id);
      const dimAnswers = dimQuestions
        .map((_, qi) => {
          const globalIdx = questions.findIndex(
            (q) => q.dimension === d.id && q.number === qi + 1
          );
          return answers[globalIdx];
        })
        .filter((a) => a !== undefined);
      if (dimAnswers.length > 0) {
        scores[d.id] = Math.round(
          dimAnswers.reduce((s, v) => s + v, 0) / dimAnswers.length
        );
      }
    });
    return scores;
  }, [answers, dimensions, questions]);

  // Overall flow score
  const overallScore = useMemo(() => {
    const vals = Object.values(dimensionScores);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  }, [dimensionScores]);

  // Find weakest and strongest dimensions
  const sortedDims = useMemo(() => {
    return [...dimensions]
      .filter((d) => dimensionScores[d.id] !== undefined)
      .sort((a, b) => (dimensionScores[a.id] || 0) - (dimensionScores[b.id] || 0));
  }, [dimensionScores, dimensions]);

  // Get recommended articles based on weakest dimensions
  const recommendedArticles = useMemo(() => {
    if (sortedDims.length === 0) return [];
    const weakest = sortedDims.slice(0, 3).map((d) => d.id);
    const mirrors = mirrorData.mirrors as Record<
      string,
      { dimension: string; reflection: string; prompt: string }
    >;
    const articles: {
      slug: string;
      title: string;
      reflection: string;
      dimension: string;
    }[] = [];

    Object.entries(mirrors).forEach(([slug, mirror]) => {
      if (weakest.includes(mirror.dimension)) {
        const article = blogData.find((a: any) => a.slug === slug);
        if (article) {
          articles.push({
            slug,
            title: (article as any).title,
            reflection: mirror.reflection,
            dimension: mirror.dimension,
          });
        }
      }
    });

    return articles.slice(0, 9);
  }, [sortedDims]);

  // Save results mutation (uses assessment system)
  const saveResults = trpc.assessments.submit.useMutation();
  const [sessionId] = useState(() => crypto.randomUUID());

  const handleAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    const score = questions[currentQ].options[optionIdx].score;

    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [currentQ]: score }));
      setSelectedOption(null);

      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setPhase("results");
        markComplete("find-your-mirror");
        try {
          localStorage.setItem("findyourme_results", JSON.stringify({ archetype: sortedDims[sortedDims.length - 1]?.name || "Self-Aware", scores: dimensionScores, timestamp: Date.now() }));
        } catch {}
        // Save to DB (works for both logged-in and anonymous users)
        const answersArr = Object.entries(answers).map(([qIdx, s]) => ({
          questionId: `q${questions[Number(qIdx)]?.number ?? qIdx}`,
          answer: String(s),
          score: s as number,
        }));
        // Add the final answer
        answersArr.push({
          questionId: `q${questions[currentQ]?.number ?? currentQ}`,
          answer: String(score),
          score,
        });
        saveResults.mutate({
          assessmentType: "mirror" as const,
          sessionId,
          answers: JSON.stringify(answersArr),
          resultSummary: JSON.stringify({
            dimensionScores,
            overallScore,
            topDimension: sortedDims[0]?.id,
            bottomDimension: sortedDims[sortedDims.length - 1]?.id,
          }),
          totalScore: Math.round(overallScore * 10),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  const getFlowLabel = (score: number) => {
    if (score >= 8) return "Deep Flow";
    if (score >= 6) return "Approaching Flow";
    if (score >= 4) return "In Transition";
    if (score >= 2) return "Friction Zone";
    return "Starting Point";
  };

  const getFlowColor = (score: number) => {
    if (score >= 8) return "text-emerald-700";
    if (score >= 6) return "text-emerald-600";
    if (score >= 4) return "text-amber-700";
    return "text-red-800";
  };

  const shareUrl = typeof window !== "undefined"
    ? "https://tonygreenberg.com/life-assessment"
    : "/life-assessment";

  /* ── INTRO ─────────────────────────────────────────── */
  if (phase === "intro") {
    return (
    <>
    <SEO
        title="Life Assessment"
        description="A comprehensive life audit across health, wealth, relationships, and purpose."
        path="/life-assessment"
        keywords="Tony Greenberg, life assessment, life audit, purpose, alignment"
        indexable={true}
      />
      <main className="bg-[#FAFAF7] text-[#1A1A17] min-h-screen">
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0A10]" />
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 50%, oklch(0.65 0.12 85 / 0.3), transparent 50%), radial-gradient(circle at 70% 50%, oklch(0.55 0.15 85 / 0.2), transparent 50%)",
              }}
            />
          </div>
          <div className="relative container max-w-3xl text-center">
            <FadeIn>
              <p className="font-['DM_Mono',monospace] text-xs tracking-[0.35em] uppercase text-[#D4B96A] mb-6">
                The Mirror
              </p>
              <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-bold text-[#FAFAF7] leading-[1.1] mb-6">
                How Far Are You
                <br />
                <span className="text-[#D4B96A]">From Yourself?</span>
              </h1>
              <p className="font-['Source_Sans_3',sans-serif] text-lg md:text-xl text-[#FAFAF7]/70 max-w-xl mx-auto mb-4">
                Eighteen questions. Six dimensions. One honest map of where you
                are — and how fast you can get to where you belong.
              </p>
              <p className="font-['Source_Sans_3',sans-serif] text-base text-[#FAFAF7]/50 max-w-lg mx-auto mb-10">
                This isn't a personality quiz. It's a measurement. Of your
                distance from your truth, your friction, your flow. Every answer
                routes you to the articles, the sites, and the people who can
                close the gap.
              </p>
              <button
                onClick={() => setPhase("questions")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B6914] text-[#FAFAF7] font-['DM_Mono',monospace] text-sm tracking-wider uppercase hover:bg-[#D4B96A] hover:text-[#0A0A10] transition-all duration-300"
              >
                Begin The Mirror
                <span className="text-lg">→</span>
              </button>
              <p className="mt-6 font-['DM_Mono',monospace] text-xs text-[#FAFAF7]/30">
                ~ 4 minutes · no wrong answers · your results are private
              </p>
            </FadeIn>
          </div>
        </section>

        {/* dimensions preview */}
        <Section>
          <div className="container max-w-4xl">
            <Eyebrow>Six Dimensions of Flow</Eyebrow>
            <SectionTitle>What We Measure</SectionTitle>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {dimensions.map((d) => (
                <div key={d.id} className="border-l-2 border-[#D4B96A]/30 pl-6">
                  <h3 className="font-['Playfair_Display',serif] text-xl font-semibold mb-2">
                    {d.name}
                  </h3>
                  <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] text-sm mb-3">
                    {d.description}
                  </p>
                  <div className="space-y-1">
                    <p className="font-['DM_Mono',monospace] text-xs text-emerald-700">
                      Flow: {d.flowState}
                    </p>
                    <p className="font-['DM_Mono',monospace] text-xs text-red-800/70">
                      Friction: {d.frictionState}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* connected ecosystem */}
        <Section>
          <div className="container max-w-3xl text-center">
            <Eyebrow>The Ecosystem</Eyebrow>
            <SectionTitle>Your Results Connect To Everything</SectionTitle>
            <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] mt-6 max-w-xl mx-auto">
              Your assessment maps to 90 articles, 11 satellite sites, and a
              community of people on the same journey. Each layer pulls you
              deeper.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { name: "Intimacy Assessment", url: "https://intimacyassess-tcir3hon.manus.space/" },
                { name: "Flow Circuit", url: "https://flow.tonygreenberg.com" },
                { name: "Sacred Waters", url: "https://sacredwaters-x4bqmkxb.manus.space" },
                { name: "SoulSmoke Mezcal", url: "https://soulsmoke-9yjr0bq0.manus.space" },
                { name: "Human OS", url: "/humanos" },
              ].map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#D4B96A]/30 font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] hover:bg-[#8B6914] hover:text-[#FAFAF7] transition-all"
                >
                  {site.name}
                </a>
              ))}
            </div>
            <div className="mt-12">
              <button
                onClick={() => {
                  setPhase("questions");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A0A10] text-[#FAFAF7] font-['DM_Mono',monospace] text-sm tracking-wider uppercase hover:bg-[#8B6914] transition-all duration-300"
              >
                Take The Assessment
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </Section>

        <Spacer />
      </main>
    </>);
  }

  /* ── QUESTIONS ──────────────────────────────────────── */
  if (phase === "questions") {
    const q = questions[currentQ];
    const dim = dimensions.find((d) => d.id === q.dimension);
    const progress = ((currentQ + 1) / questions.length) * 100;
    const dimProgress = questions
      .slice(0, currentQ + 1)
      .filter((qq) => qq.dimension === q.dimension).length;

    return (
      <main className="bg-[#FAFAF7] text-[#1A1A17] min-h-screen">
        {/* progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#E8E6DF]">
          <div
            className="h-full bg-[#8B6914] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="container max-w-2xl py-16 md:py-24" ref={questionRef}>
          {/* dimension indicator */}
          <div className="text-center mb-4">
            <p className="font-['DM_Mono',monospace] text-xs tracking-[0.35em] uppercase text-[#8B6914]">
              {dim?.name} · Question {dimProgress} of 3
            </p>
          </div>

          {/* question counter */}
          <div className="text-center mb-12">
            <span className="font-['Playfair_Display',serif] text-7xl md:text-8xl font-bold text-[#D4B96A]/20">
              {String(currentQ + 1).padStart(2, "0")}
            </span>
            <span className="font-['DM_Mono',monospace] text-sm text-[#5A5A52] ml-2">
              / {questions.length}
            </span>
          </div>

          {/* question stem */}
          <FadeIn key={currentQ}>
            <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-semibold text-center leading-relaxed mb-12">
              {q.stem}
            </h2>

            {/* options */}
            <div className="space-y-4">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-5 md:p-6 border transition-all duration-300 group ${
                    selectedOption === i
                      ? "border-[#8B6914] bg-[#8B6914]/10"
                      : "border-[#D4B96A]/20 hover:border-[#8B6914] hover:bg-[#8B6914]/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`font-['DM_Mono',monospace] text-xs mt-1 ${
                        selectedOption === i
                          ? "text-[#8B6914]"
                          : "text-[#D4B96A]/50 group-hover:text-[#8B6914]"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <p className="font-['Source_Sans_3',sans-serif] text-base md:text-lg text-[#1A1A17]">
                      {opt.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </FadeIn>

          {/* back button */}
          {currentQ > 0 && (
            <button
              onClick={() => {
                setCurrentQ((prev) => prev - 1);
                setSelectedOption(null);
              }}
              className="mt-8 font-['DM_Mono',monospace] text-xs tracking-wider text-[#5A5A52] hover:text-[#8B6914] transition-colors"
            >
              ← Previous question
            </button>
          )}
        </div>
      </main>
    );
  }

  /* ── RESULTS ────────────────────────────────────────── */
  return (
    <main className="bg-[#FAFAF7] text-[#1A1A17] min-h-screen">
      {/* hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A10]" />
        <div className="relative container max-w-4xl text-center">
          <FadeIn>
            <p className="font-['DM_Mono',monospace] text-xs tracking-[0.35em] uppercase text-[#D4B96A] mb-6">
              Your Mirror
            </p>
            <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-[#FAFAF7] leading-[1.1] mb-4">
              Your Distance From Flow
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span
                className={`font-['Playfair_Display',serif] text-6xl md:text-7xl font-bold ${getFlowColor(
                  overallScore
                )} opacity-90`}
                style={{ color: overallScore >= 6 ? "#86efac" : overallScore >= 4 ? "#fbbf24" : "#fca5a5" }}
              >
                {overallScore}
              </span>
              <span className="font-['DM_Mono',monospace] text-sm text-[#FAFAF7]/50">
                / 9
              </span>
            </div>
            <p className="font-['DM_Mono',monospace] text-sm tracking-wider uppercase text-[#D4B96A]">
              {getFlowLabel(overallScore)}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* radar chart */}
      <Section>
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Eyebrow>Your Map</Eyebrow>
              <SectionTitle>Six Dimensions</SectionTitle>
              <div className="mt-8 space-y-4">
                {sortedDims.map((d) => {
                  const score = dimensionScores[d.id] || 0;
                  return (
                    <div key={d.id} className="flex items-center gap-4">
                      <div className="w-32 font-['DM_Mono',monospace] text-xs tracking-wider text-[#5A5A52]">
                        {d.name.split(" & ")[0]}
                      </div>
                      <div className="flex-1 h-2 bg-[#E8E6DF] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(score / 9) * 100}%`,
                            backgroundColor:
                              score >= 7
                                ? "#059669"
                                : score >= 5
                                ? "#d97706"
                                : "#dc2626",
                          }}
                        />
                      </div>
                      <span className="font-['DM_Mono',monospace] text-sm font-semibold w-8 text-right">
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <RadarChart scores={dimensionScores} dimensions={dimensions} />
          </div>
        </div>
      </Section>

      <Divider />

      {/* dimension insights */}
      <Section>
        <div className="container max-w-3xl">
          <Eyebrow>Dimension Insights</Eyebrow>
          <SectionTitle>Where You Are</SectionTitle>
          <div className="mt-12 space-y-8">
            {sortedDims.map((d) => {
              const score = dimensionScores[d.id] || 0;
              const inFlow = score >= 6;
              return (
                <div
                  key={d.id}
                  className="p-6 border border-[#D4B96A]/20 bg-[#FAFAF7]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-['Playfair_Display',serif] text-xl font-semibold">
                      {d.name}
                    </h3>
                    <span
                      className={`font-['DM_Mono',monospace] text-xs px-3 py-1 ${
                        inFlow
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {getFlowLabel(score)}
                    </span>
                  </div>
                  <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] text-sm italic mb-2">
                    {d.description}
                  </p>
                  <p className="font-['Source_Sans_3',sans-serif] text-sm">
                    {inFlow ? d.flowState : d.frictionState}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Divider />

      {/* recommended articles */}
      <Section>
        <div className="container max-w-3xl">
          <Eyebrow>Your Prescribed Reading</Eyebrow>
          <SectionTitle>Articles That Mirror Your Growth Edge</SectionTitle>
          <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] mt-4 mb-10">
            Based on your assessment, these articles will challenge the
            dimensions where you have the most room to grow. Each one is a
            mirror — read it and notice what it reflects back.
          </p>
          <div className="space-y-4">
            {recommendedArticles.map((article, i) => {
              const dim = dimensions.find((d) => d.id === article.dimension);
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="block p-5 border border-[#D4B96A]/20 hover:border-[#8B6914] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#D4B96A]/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] mb-1">
                        {dim?.name}
                      </p>
                      <h4 className="font-['Playfair_Display',serif] text-lg font-semibold group-hover:text-[#8B6914] transition-colors">
                        {article.title}
                      </h4>
                      <p className="font-['Source_Sans_3',sans-serif] text-sm text-[#5A5A52] mt-1 italic">
                        This article is a mirror for {article.reflection}
                      </p>
                    </div>
                    <span className="text-[#D4B96A] group-hover:text-[#8B6914] transition-colors mt-2">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      <Divider />

      {/* satellite sites */}
      <Section>
        <div className="container max-w-3xl">
          <Eyebrow>Go Deeper</Eyebrow>
          <SectionTitle>Your Next Stations</SectionTitle>
          <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] mt-4 mb-10">
            Based on your dimensions, these satellite experiences will take you
            deeper into the areas where you're ready to grow.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: "Intimacy Assessment (UIIA)",
                url: "https://intimacyassess-tcir3hon.manus.space/",
                dim: "relationships",
                desc: "15-question deep dive into your intimacy patterns",
              },
              {
                name: "Flow Circuit",
                url: "https://flow.tonygreenberg.com",
                dim: "consciousness",
                desc: "Measure your flow state across work, play, and presence",
              },
              {
                name: "Sacred Waters",
                url: "https://sacredwaters-x4bqmkxb.manus.space",
                dim: "body",
                desc: "The biochemistry of water and its role in your biology",
              },
              {
                name: "SoulSmoke Mezcal",
                url: "https://soulsmoke-9yjr0bq0.manus.space",
                dim: "consciousness",
                desc: "Sacred ceremony meets artisanal craft",
              },
              {
                name: "Human OS",
                url: "/humanos",
                dim: "purpose",
                desc: "The operating system for human potential",
              },
              {
                name: "Regenerative Protocol",
                url: "https://regenprotocol-2kxfwp7h.manus.space",
                dim: "body",
                desc: "Biochemistry optimization for your best self",
              },
            ]
              .filter((site) => {
                // Prioritize sites matching weak dimensions
                const weakDims = sortedDims.slice(0, 3).map((d) => d.id);
                return weakDims.includes(site.dim);
              })
              .slice(0, 4)
              .map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 border border-[#D4B96A]/20 hover:border-[#8B6914] transition-all group"
                >
                  <p className="font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] mb-2">
                    {dimensions.find((d) => d.id === site.dim)?.name}
                  </p>
                  <h4 className="font-['Playfair_Display',serif] text-lg font-semibold group-hover:text-[#8B6914] transition-colors">
                    {site.name}
                  </h4>
                  <p className="font-['Source_Sans_3',sans-serif] text-sm text-[#5A5A52] mt-1">
                    {site.desc}
                  </p>
                </a>
              ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* share prompt */}
      <Section>
        <div className="container max-w-3xl text-center">
          <Eyebrow>The Invitation</Eyebrow>
          <SectionTitle>Share The Mirror</SectionTitle>
          <p className="font-['Source_Sans_3',sans-serif] text-[#5A5A52] mt-4 max-w-xl mx-auto mb-8">
            This assessment was designed to be shared. Send it to at least 10
            people — your partner, your team, your family, your tribe. When
            everyone maps their dimensions, you can see where you complement
            each other, where you collide, and where you can grow together.
          </p>

          {!showSharePrompt ? (
            <button
              onClick={() => setShowSharePrompt(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B6914] text-[#FAFAF7] font-['DM_Mono',monospace] text-sm tracking-wider uppercase hover:bg-[#D4B96A] hover:text-[#0A0A10] transition-all duration-300"
            >
              Share With Your People
            </button>
          ) : (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-[#0A0A10] text-left">
                <p className="font-['DM_Mono',monospace] text-xs text-[#D4B96A] mb-2">
                  Share this link:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-[#FAFAF7] font-['DM_Mono',monospace] text-sm border-none outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                    }}
                    className="px-3 py-1 bg-[#8B6914] text-[#FAFAF7] font-['DM_Mono',monospace] text-xs hover:bg-[#D4B96A] hover:text-[#0A0A10] transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=I%20just%20took%20The%20Mirror%20%E2%80%94%20a%20life%20assessment%20that%20measures%20your%20distance%20from%20flow.%20My%20score%3A%20${overallScore}%2F9.%20Take%20yours%3A&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#D4B96A]/30 font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] hover:bg-[#8B6914] hover:text-[#FAFAF7] transition-all"
                >
                  𝕏 Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#D4B96A]/30 font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] hover:bg-[#8B6914] hover:text-[#FAFAF7] transition-all"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:?subject=Take%20The%20Mirror%20%E2%80%94%20Life%20Assessment&body=I%20just%20took%20The%20Mirror%20and%20scored%20${overallScore}%2F9%20on%20my%20distance%20from%20flow.%20Take%20yours%3A%20${encodeURIComponent(shareUrl)}`}
                  className="px-4 py-2 border border-[#D4B96A]/30 font-['DM_Mono',monospace] text-xs tracking-wider text-[#8B6914] hover:bg-[#8B6914] hover:text-[#FAFAF7] transition-all"
                >
                  Email
                </a>
              </div>
              <p className="font-['DM_Mono',monospace] text-xs text-[#5A5A52]">
                Find your tribe. Find your partner. Find your joy.
                <br />
                It starts with knowing where you are.
              </p>
            </div>
          )}
        </div>
      </Section>

      <Divider />

      {/* Journey Progress Tracker */}
      <Section>
        <div className="container max-w-3xl">
          <JourneyTracker variant="light" currentAssessmentId="find-your-mirror" />
        </div>
      </Section>

      {/* Journey Flow: Continue Your Discovery */}
      <Section>
        <div className="container max-w-3xl">
          <p className="font-['DM_Mono',monospace] text-[0.65rem] tracking-[0.25em] uppercase text-[#8B6914] mb-2 text-center">The Journey Continues</p>
          <p className="font-['Source_Sans_3',sans-serif] text-[0.95rem] text-[#666] text-center mb-6" style={{ lineHeight: 1.6 }}>You've held up the mirror. Now explore the dimensions that shape what you saw.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "Find Your Purpose", hook: "The Dharma Finder \u2014 what you can't stop doing.", url: "/assessments/dharma-finder", badge: "25 Qs" },
              { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", url: "/find-your-therapy", badge: "25 Qs" },
              { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", url: "https://findmyassess-9eekxcob.manus.space/find-my-spirituality", badge: "35 Qs" },
              { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/assessments/consciousness-scale", badge: "25 Qs" },
              { name: "Find Your Score", hook: "85 years of Harvard data, one assessment.", url: "/assessments/grant-study", badge: "25 Qs" },
              { name: "Find Your Me", hook: "The gateway to the whole ecosystem.", url: "/find-your-me", badge: "5 Qs" },
            ].map((next) => (
              <a key={next.name} href={next.url} className="no-underline">
                <div className="p-4 border border-[#e5e0d5] bg-[#FAFAF7] hover:border-[#8B6914] transition-all duration-300">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-['Playfair_Display',Georgia,serif] text-[0.9rem] text-[#0A0A10]">{next.name}</span>
                    <span className="font-['DM_Mono',monospace] text-[0.5rem] tracking-wide text-[#8B6914] border border-[#e5e0d5] px-1.5 py-0.5">{next.badge}</span>
                  </div>
                  <p className="font-['Source_Sans_3',sans-serif] text-[0.82rem] text-[#666] leading-relaxed m-0">{next.hook}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="mirror"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ scores: dimensionScores })}
              totalScore={null}
            />

      {/* CTA: community + retake */}
      <Section>
        <div className="container max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href="/community"
              className="p-8 bg-[#0A0A10] text-center group hover:bg-[#8B6914] transition-all duration-300"
            >
              <h3 className="font-['Playfair_Display',serif] text-xl font-semibold text-[#FAFAF7] mb-2">
                Join The Community
              </h3>
              <p className="font-['Source_Sans_3',sans-serif] text-sm text-[#FAFAF7]/60 group-hover:text-[#FAFAF7]/80">
                Find your tribe, your partner, your collaborators. Upload your
                contacts and start connecting.
              </p>
            </Link>
            <button
              onClick={() => {
                setPhase("intro");
                setCurrentQ(0);
                setAnswers({});
                setSelectedOption(null);
                setShowSharePrompt(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-8 border-2 border-[#D4B96A]/30 text-center group hover:border-[#8B6914] transition-all duration-300"
            >
              <h3 className="font-['Playfair_Display',serif] text-xl font-semibold mb-2">
                Retake The Mirror
              </h3>
              <p className="font-['Source_Sans_3',sans-serif] text-sm text-[#5A5A52]">
                Come back in a month. See how far you've moved. The measurement
                is the medicine.
              </p>
            </button>
          </div>
        </div>
      </Section>

      <Spacer />
    </main>
  );
}
