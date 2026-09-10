"use client";

import { BackIcon } from "@/components/ui/inline-icons";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";
import {
  MIRROR_ARTICLES,
  MIRROR_DIMENSIONS,
  MIRROR_QUESTIONS,
  type MirrorDimensionId,
} from "@/lib/content/mirror-data";

// Ported from legacy client/src/pages/LifeAssessment.tsx ("THE MIRROR — Life
// Assessment") — real 18 questions across the real 6 dimensions from
// lib/content/mirror-data.ts, real dimension scoring (average of that
// dimension's 3 answers, 2-9 scale), real weakest-dimension article/
// satellite-site recommendations, and the real share-this-assessment
// feature, all unchanged. Two real routes serve this component:
// `/the-mirror` (canonical) and `/life-assessment` (redirects to
// `/the-mirror` — see that route's own file for why).
//
// Structural changes made to fit this migration's established assessment
// shape (same normalization every other "Find Your X" port has made):
// legacy's fully bespoke intro hero (dark full-bleed section, its own copy
// layout) is replaced with the shared `AssessmentIntro`/`ThemedBackground`
// every sibling assessment uses; the pre-quiz "What We Measure" dimension
// preview and "Connected Ecosystem" satellite-site teaser sections are
// dropped from the landing screen — both would just repeat content the
// results screen already shows (dimension descriptions in "Dimension
// Insights," satellite links in "Your Next Stations"), and no other
// assessment in this migration shows its results content twice. An
// `EmailGate` step was added between the quiz and results (legacy shipped
// with none) because every other assessment already built in this
// migration gates results behind one real, backend-connected step; skipping
// it here would make this the only assessment that doesn't.
//
// **Real hydration-unsafe pattern fixed**: legacy computed its share URL as
// `typeof window !== "undefined" ? "https://tonygreenberg.com/life-assessment" : "/life-assessment"`
// — a `typeof window` branch evaluated during render, the exact anti-pattern
// CONTRIBUTING.md and this migration's earlier bug list already flag
// (`window.innerWidth`-during-render). It was also pointed at the
// non-canonical `/life-assessment` path. Replaced with a single constant,
// `https://tonygreenberg.com/the-mirror`.
//
// **Real stale satellite-site URLs found and fixed**: legacy's own
// hardcoded satellite list used three manus.space deployment URLs
// (`sacredwaters-x4bqmkxb`, `soulsmoke-9yjr0bq0`, `regenprotocol-2kxfwp7h`)
// that a live Sanity/GROQ cross-check couldn't confirm still resolve, for
// what is clearly the same three products under their current, already
// live-verified names and URLs elsewhere in this migration
// (`journey-tracker.tsx`'s `JOURNEY_MAP` / `find-your-me.ts`'s
// `ARCHETYPES`/`DIRECTORY`, whose own port notes state all 6 external
// sibling sites were "confirmed live before porting"): "Sacred Waters" →
// Find Your Water (`aqwaterqpr-wvzsc3ph.manus.space`), "SoulSmoke Mezcal" →
// Find Your Mezcal (`mezcalagave-ahru9fq8.manus.space`), "Regenerative
// Protocol" → Find Your Chemistry (`regenhealth-4nns6jnd.manus.space`).
// "Flow Circuit" is repointed from legacy's hardcoded
// `https://flow.tonygreenberg.com` to this app's own `/flow-circuit`, which
// already redirects there (matching how `find-your-me.ts` links it).
//
// **Real dead "Journey Continues" links fixed**: legacy linked "Find Your
// Level"/"Find Your Score"/"Find Your Purpose" to `/assessments/*` paths
// that only exist in this app as redirects to their real canonical routes
// (`/consciousness-scale`, `/grant-study`, `/dharma-finder`) — repointed
// directly, same "skip the redirect hop" fix implied by this migration's
// canonical-URL requirement. "Find Your Spirit" is repointed from legacy's
// dead external `findmyassess-9eekxcob.manus.space` stub to the real
// internal `/find-your-spirit` — the identical fix `find-your-therapy-quiz.tsx`
// already made for this exact same stale link.
//
// Real article recommendations are resolved defensively, matching legacy's
// own behavior exactly: `app/the-mirror/page.tsx` looks up every
// `MIRROR_ARTICLES` slug against real Sanity posts server-side and passes
// down only the titles that actually resolved (a live GROQ check found only
// 27 of the 85 legacy slugs still exist — the rest were retired or renamed
// since legacy was written); a slug with no resolved title is silently
// skipped, the same way legacy's own `blogData.find()` skipped slugs missing
// from its local `blogData.json`.
const ACCENT = "#8B6914";
const SHARE_URL = "https://tonygreenberg.com/the-mirror";

const SATELLITE_SITES: { name: string; url: string; dimension: MirrorDimensionId; desc: string }[] =
  [
    {
      name: "Find Your Partner",
      url: "https://intimacyassess-tcir3hon.manus.space",
      dimension: "relationships",
      desc: "15-question deep dive into your intimacy patterns",
    },
    {
      name: "Find Your Team",
      url: "/flow-circuit",
      dimension: "consciousness",
      desc: "Measure your flow state across work, play, and presence",
    },
    {
      name: "Find Your Water",
      url: "https://aqwaterqpr-wvzsc3ph.manus.space",
      dimension: "body",
      desc: "The biochemistry of water and its role in your biology",
    },
    {
      name: "Find Your Mezcal",
      url: "https://mezcalagave-ahru9fq8.manus.space",
      dimension: "consciousness",
      desc: "Sacred ceremony meets artisanal craft",
    },
    {
      name: "Human OS",
      url: "/humanos",
      dimension: "purpose",
      desc: "The operating system for human potential",
    },
    {
      name: "Find Your Chemistry",
      url: "https://regenhealth-4nns6jnd.manus.space",
      dimension: "body",
      desc: "Biochemistry optimization for your best self",
    },
  ];

const JOURNEY_CONTINUES = [
  {
    name: "Find Your Purpose",
    hook: "The Dharma Finder — what you can't stop doing.",
    url: "/dharma-finder",
    badge: "25 Qs",
  },
  {
    name: "Find Your Therapy",
    hook: "Matched to your wiring, not a waitlist.",
    url: "/find-your-therapy",
    badge: "25 Qs",
  },
  {
    name: "Find Your Spirit",
    hook: "Map your beliefs across 10 dimensions.",
    url: "/find-your-spirit",
    badge: "35 Qs",
  },
  {
    name: "Find Your Level",
    hook: "Where you sit on the consciousness scale.",
    url: "/consciousness-scale",
    badge: "25 Qs",
  },
  {
    name: "Find Your Score",
    hook: "85 years of Harvard data, one assessment.",
    url: "/grant-study",
    badge: "25 Qs",
  },
  {
    name: "Find Your Me",
    hook: "The gateway to the whole ecosystem.",
    url: "/find-your-me",
    badge: "5 Qs",
  },
];

function getFlowLabel(score: number): string {
  if (score >= 8) return "Deep Flow";
  if (score >= 6) return "Approaching Flow";
  if (score >= 4) return "In Transition";
  if (score >= 2) return "Friction Zone";
  return "Starting Point";
}

function scoreTextClass(score: number): string {
  if (score >= 8) return "text-emerald-700";
  if (score >= 6) return "text-emerald-600";
  if (score >= 4) return "text-amber-700";
  return "text-red-800";
}

function scoreBarClass(score: number): string {
  if (score >= 7) return "bg-emerald-600";
  if (score >= 5) return "bg-amber-600";
  return "bg-red-600";
}

export function TheMirrorQuiz({ articleTitles }: { articleTitles: Record<string, string> }) {
  const [phase, setPhase] = useState<"landing" | "quiz" | "email" | "results">("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showShare, setShowShare] = useState(false);
  const { markComplete } = useJourneyProgress();

  const dimensionScores = useMemo(() => {
    const scores: Partial<Record<MirrorDimensionId, number>> = {};
    MIRROR_DIMENSIONS.forEach((d) => {
      const vals = MIRROR_QUESTIONS.map((q, idx) =>
        q.dimension === d.id ? answers[idx] : undefined,
      ).filter((v): v is number => v !== undefined);
      if (vals.length > 0) scores[d.id] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    });
    return scores;
  }, [answers]);

  const overallScore = useMemo(() => {
    const vals = Object.values(dimensionScores).filter((v): v is number => v !== undefined);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [dimensionScores]);

  const sortedDims = useMemo(
    () =>
      [...MIRROR_DIMENSIONS]
        .filter((d) => dimensionScores[d.id] !== undefined)
        .sort((a, b) => (dimensionScores[a.id] ?? 0) - (dimensionScores[b.id] ?? 0)),
    [dimensionScores],
  );

  const recommendedArticles = useMemo(() => {
    if (sortedDims.length === 0) return [];
    const weakest: string[] = sortedDims.slice(0, 3).map((d) => d.id);
    const out: { slug: string; title: string; reflection: string; dimension: string }[] = [];
    for (const [slug, article] of Object.entries(MIRROR_ARTICLES)) {
      if (out.length >= 9) break;
      const title = articleTitles[slug];
      if (weakest.includes(article.dimension) && title) {
        out.push({ slug, title, reflection: article.reflection, dimension: article.dimension });
      }
    }
    return out;
  }, [sortedDims, articleTitles]);

  const satelliteSites = useMemo(() => {
    const weakest: string[] = sortedDims.slice(0, 3).map((d) => d.id);
    return SATELLITE_SITES.filter((s) => weakest.includes(s.dimension)).slice(0, 4);
  }, [sortedDims]);

  const displayScores = useMemo(() => {
    const out: Record<string, number> = {};
    MIRROR_DIMENSIONS.forEach((d) => {
      out[d.name.split(" & ")[0]] = dimensionScores[d.id] ?? 0;
    });
    return out;
  }, [dimensionScores]);

  const handleShare = useCallback(
    (platform: "twitter" | "linkedin" | "email" | "copy") => {
      const text = `I just took The Mirror — a life assessment that measures your distance from flow. My score: ${overallScore}/9. Take yours:`;
      if (platform === "twitter") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SHARE_URL)}`,
          "_blank",
        );
      } else if (platform === "linkedin") {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
          "_blank",
        );
      } else if (platform === "email") {
        window.open(
          `mailto:?subject=${encodeURIComponent("Take The Mirror — Life Assessment")}&body=${encodeURIComponent(`${text}\n\n${SHARE_URL}`)}`,
          "_blank",
        );
      } else {
        void navigator.clipboard?.writeText(SHARE_URL);
      }
    },
    [overallScore],
  );

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const score = MIRROR_QUESTIONS[currentQ].options[optionIdx].score;
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [currentQ]: score }));
      setSelectedOption(null);
      if (currentQ < MIRROR_QUESTIONS.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        markComplete("find-your-mirror");
        setPhase("email");
      }
    }, 400);
  };

  const resetAssessment = () => {
    setPhase("landing");
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setShowShare(false);
  };

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="mirror" />
        <AssessmentIntro
          title="The Mirror"
          subtitle="How far are you from yourself?"
          description="Eighteen questions. Six dimensions. One honest map of where you are — and how fast you can get to where you belong. This isn't a personality quiz. It's a measurement — of your distance from your truth, your friction, your flow. Every answer routes you to the articles, the sites, and the people who can close the gap."
          stats={{
            questions: MIRROR_QUESTIONS.length,
            dimensions: MIRROR_DIMENSIONS.length,
            minutes: 4,
          }}
          whatYouGet={[
            "A radar chart mapping all six dimensions of your flow",
            "Where you're in flow — and where you're in friction, dimension by dimension",
            "Articles chosen to mirror your specific growth edge",
            "Satellite experiences matched to your weakest dimensions",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("quiz")}
        />
      </div>
    );
  }

  if (phase === "quiz") {
    const q = MIRROR_QUESTIONS[currentQ];
    const dim = MIRROR_DIMENSIONS.find((d) => d.id === q.dimension);
    const progress = ((currentQ + 1) / MIRROR_QUESTIONS.length) * 100;
    const dimProgress = MIRROR_QUESTIONS.slice(0, currentQ + 1).filter(
      (qq) => qq.dimension === q.dimension,
    ).length;

    return (
      <div className="relative z-1 flex min-h-screen flex-col font-sans text-[#2C1810]">
        <ThemedBackground theme="mirror" />
        <div className="fixed inset-x-0 top-0 z-50">
          <div className="h-[3px] bg-brand-gold/10">
            <div
              className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
            <button onClick={() => setPhase("landing")}>
              <BackIcon aria-hidden="true" /> EXIT
            </button>
            <span>
              {dim?.name} · Question {dimProgress} of 3 · {currentQ + 1} / {MIRROR_QUESTIONS.length}
            </span>
          </div>
        </div>

        <div className="relative z-1 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-8">
          <h2 className="mb-10 text-center font-heading text-[clamp(1.3rem,3.5vw,1.8rem)] leading-[1.3] font-normal">
            {q.stem}
          </h2>

          <div className="flex w-full flex-col gap-3">
            {q.options.map((opt, i) => (
              <button
                key={opt.text}
                onClick={() => handleAnswer(i)}
                disabled={selectedOption !== null}
                className={`rounded-lg border px-5 py-4 text-left text-[0.92rem] leading-relaxed transition-all disabled:cursor-wait ${
                  selectedOption === i
                    ? "border-brand-gold-light/40 bg-brand-gold-light/15"
                    : "border-black/8 bg-white/40"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => {
                setCurrentQ((prev) => prev - 1);
                setSelectedOption(null);
              }}
              className="mt-6 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]"
            >
              <BackIcon aria-hidden="true" /> PREVIOUS
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "email") {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="mirror" />
        <EmailGate assessmentSlug="mirror" onUnlock={() => setPhase("results")} />
      </div>
    );
  }

  // results
  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="mirror" />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
          Your Mirror
        </div>
        <h1 className="mb-6 font-heading text-[clamp(2rem,5vw,3rem)] font-normal">
          Your Distance From Flow
        </h1>
        <div className="mb-3 flex items-center justify-center gap-3">
          <span
            className={`font-heading text-[clamp(3rem,8vw,4.5rem)] font-bold ${scoreTextClass(overallScore)}`}
          >
            {overallScore}
          </span>
          <span className="font-mono text-sm text-[#888]">/ 9</span>
        </div>
        <p className="font-mono text-sm tracking-[0.15em] text-brand-gold uppercase">
          {getFlowLabel(overallScore)}
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
              Your Map
            </div>
            <h2 className="mb-8 font-heading text-2xl font-normal">Six Dimensions</h2>
            <div className="space-y-4">
              {sortedDims.map((d) => {
                const score = dimensionScores[d.id] ?? 0;
                return (
                  <div key={d.id} className="flex items-center gap-4">
                    <div className="w-32 shrink-0 font-mono text-xs tracking-wider text-[#5A5A52]">
                      {d.name.split(" & ")[0]}
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/8">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${scoreBarClass(score)}`}
                        style={{ width: `${(score / 9) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-sm font-semibold">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <AssessmentRadarChart scores={displayScores} max={9} accentColor="#D4B96A" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
          Dimension Insights
        </div>
        <h2 className="mb-8 font-heading text-2xl font-normal">Where You Are</h2>
        <div className="space-y-6">
          {sortedDims.map((d) => {
            const score = dimensionScores[d.id] ?? 0;
            const inFlow = score >= 6;
            return (
              <div key={d.id} className="rounded-lg border border-black/8 bg-white/40 p-6">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-heading text-xl font-normal">{d.name}</h3>
                  <span
                    className={`rounded-sm px-3 py-1 font-mono text-xs uppercase ${
                      inFlow
                        ? "bg-emerald-600/10 text-emerald-700"
                        : "bg-amber-600/10 text-amber-700"
                    }`}
                  >
                    {getFlowLabel(score)}
                  </span>
                </div>
                <p className="mb-2 text-sm text-[#5A5A52] italic">{d.description}</p>
                <p className="text-sm text-[#2C1810]">{inFlow ? d.flowState : d.frictionState}</p>
              </div>
            );
          })}
        </div>
      </section>

      {recommendedArticles.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
            Your Prescribed Reading
          </div>
          <h2 className="mb-4 font-heading text-2xl font-normal">
            Articles That Mirror Your Growth Edge
          </h2>
          <p className="mb-8 text-sm text-[#5A5A52]">
            Based on your assessment, these articles will challenge the dimensions where you have
            the most room to grow. Each one is a mirror — read it and notice what it reflects back.
          </p>
          <div className="space-y-3">
            {recommendedArticles.map((article, i) => {
              const dim = MIRROR_DIMENSIONS.find((d) => d.id === article.dimension);
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="block rounded-lg border border-black/8 bg-white/40 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-heading text-2xl font-bold text-brand-gold-light/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="mb-1 font-mono text-xs tracking-wider text-brand-gold">
                        {dim?.name}
                      </p>
                      <h4 className="font-heading text-lg font-normal">{article.title}</h4>
                      <p className="mt-1 text-sm text-[#5A5A52] italic">
                        This article is a mirror for {article.reflection}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {satelliteSites.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
            Go Deeper
          </div>
          <h2 className="mb-4 font-heading text-2xl font-normal">Your Next Stations</h2>
          <p className="mb-8 text-sm text-[#5A5A52]">
            Based on your dimensions, these satellite experiences will take you deeper into the
            areas where you&apos;re ready to grow.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {satelliteSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target={site.url.startsWith("/") ? undefined : "_blank"}
                rel={site.url.startsWith("/") ? undefined : "noopener noreferrer"}
                className="rounded-lg border border-black/8 bg-white/40 p-5"
              >
                <p className="mb-2 font-mono text-xs tracking-wider text-brand-gold">
                  {MIRROR_DIMENSIONS.find((d) => d.id === site.dimension)?.name}
                </p>
                <h4 className="font-heading text-lg font-normal">{site.name}</h4>
                <p className="mt-1 text-sm text-[#5A5A52]">{site.desc}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
          The Invitation
        </div>
        <h2 className="mb-4 font-heading text-2xl font-normal">Share The Mirror</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm text-[#5A5A52]">
          This assessment was designed to be shared. Send it to at least 10 people — your partner,
          your team, your family, your tribe. When everyone maps their dimensions, you can see where
          you complement each other, where you collide, and where you can grow together.
        </p>

        {!showShare ? (
          <button
            onClick={() => setShowShare(true)}
            className="rounded-none border-none bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-4 font-mono text-sm tracking-wider text-background uppercase"
          >
            Share With Your People
          </button>
        ) : (
          <div className="mx-auto max-w-md space-y-4">
            <div className="rounded-lg bg-[#0A0A10] p-4 text-left">
              <p className="mb-2 font-mono text-xs text-brand-gold-light">Share this link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={SHARE_URL}
                  className="flex-1 border-none bg-transparent font-mono text-sm text-[#FAFAF7] outline-none"
                />
                <button
                  onClick={() => handleShare("copy")}
                  className="bg-brand-gold px-3 py-1 font-mono text-xs text-[#FAFAF7]"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleShare("twitter")}
                className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold"
              >
                𝕏 Twitter
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("email")}
                className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold"
              >
                Email
              </button>
            </div>
            <p className="font-mono text-xs text-[#5A5A52]">
              Find your tribe. Find your partner. Find your joy.
              <br />
              It starts with knowing where you are.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <JourneyTracker variant="light" currentAssessmentId="find-your-mirror" />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-2 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold uppercase">
          The Journey Continues
        </p>
        <p className="mb-6 text-center text-[0.95rem] leading-relaxed text-[#666]">
          You&apos;ve held up the mirror. Now explore the dimensions that shape what you saw.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {JOURNEY_CONTINUES.map((next) => (
            <Link
              key={next.name}
              href={next.url}
              className="block rounded-lg border border-black/8 bg-white/40 p-4"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="font-heading text-[0.9rem]">{next.name}</span>
                <span className="border border-black/10 px-1.5 py-0.5 font-mono text-[0.5rem] tracking-wide text-brand-gold">
                  {next.badge}
                </span>
              </div>
              <p className="m-0 text-[0.82rem] leading-relaxed text-[#666]">{next.hook}</p>
            </Link>
          ))}
        </div>
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-center">
        <AssessmentResultActions accentColor={ACCENT} resultSlug="the-mirror" />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/community" className="rounded-lg bg-[#0A0A10] p-8 text-center">
            <h3 className="mb-2 font-heading text-xl font-normal text-[#FAFAF7]">
              Join The Community
            </h3>
            <p className="text-sm text-[#FAFAF7]/60">
              Find your tribe, your partner, your collaborators. Upload your contacts and start
              connecting.
            </p>
          </Link>
          <button
            onClick={resetAssessment}
            className="rounded-lg border-2 border-brand-gold-light/30 p-8 text-center"
          >
            <h3 className="mb-2 font-heading text-xl font-normal">Retake The Mirror</h3>
            <p className="text-sm text-[#5A5A52]">
              Come back in a month. See how far you&apos;ve moved. The measurement is the medicine.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
