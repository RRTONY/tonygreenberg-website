"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";
import {
  ARCHETYPES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIRECTORY,
  DIRECTORY_COMING,
  DIRECTORY_LIVE,
  DIRECTORY_TOTAL,
  QUESTIONS,
  WOUND_CARDS,
  WOUND_TO_CATEGORY,
  type Dimension,
} from "@/lib/content/find-your-me";

// Ported from legacy client/src/pages/FindYourMe.tsx — see
// `lib/content/find-your-me.ts` for the full port-note on real content
// changes (directory live/coming correction, Peptide/Sexuality additions,
// wound-card hover→always-visible accessibility fix). This file covers
// the remaining structural changes: legacy's hero used a dead Manus image
// (`/api/img/findme-orig_c4cf916c.jpg`) — dropped for the plain
// `ThemedBackground` (theme="selfportrait") this page already rendered
// behind everything anyway, so nothing but a broken photo is lost.
// `trpc.assessments.submit` (the results-save mutation), `sessionId`
// generation that only fed it, and the `mirrorData`-based article-title
// lookup (whose own ternary computed the identical string on both
// branches — dead code) are all dropped; real article titles are fetched
// server-side in `app/find-your-me/page.tsx` via `postsBySlugsQuery` and
// passed in as `articleTitles`, more accurate than legacy's naive
// slug-to-title-case (which mangles acronyms like "GDP"). `SacredGeometryBg`
// dropped, same decoration call made throughout this migration.
// `AssessmentResultActions` simplified to this migration's real
// `accentColor`-only signature. The real Twitter/LinkedIn/email/clipboard
// share row (both the mid-assessment-style "10 shares" counter and its
// cute "You're a Tribe Weaver already" copy) is genuinely backend-free and
// ported as a real feature.
const ACCENT = "#8B6914";

function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-brand-gold-light/12 bg-[#0A0A10]/60 backdrop-blur-xl ${className}`}>{children}</div>;
}

const TYPE_ICON: Record<string, string> = { assessment: "◇", tool: "○", community: "◦", reading: "▹" };

export function FindYourMeQuiz({ articleTitles }: { articleTitles: Record<string, string> }) {
  const [phase, setPhase] = useState<"landing" | "assessment" | "results">("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [directoryFilter, setDirectoryFilter] = useState<"all" | "live" | "coming">("all");
  const [directorySearch, setDirectorySearch] = useState("");
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const directorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { markComplete } = useJourneyProgress();

  const scrollToCategory = useCallback((category: string) => {
    setHighlightCategory(category);
    directorySectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightCategory(null), 3000);
  }, []);

  const dimensionScores = useMemo(() => {
    const scores: Record<Dimension, number> = {} as Record<Dimension, number>;
    const counts: Record<Dimension, number> = {} as Record<Dimension, number>;
    DIMENSIONS.forEach((d) => {
      scores[d] = 0;
      counts[d] = 0;
    });
    Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
      const choice = QUESTIONS[Number(qIdx)]?.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, weight]) => {
        const d = dim as Dimension;
        scores[d] += weight ?? 0;
        counts[d] += 1;
      });
    });
    DIMENSIONS.forEach((d) => {
      if (counts[d] > 0) scores[d] = Math.min(10, Math.round((scores[d] / (counts[d] * 9)) * 10 * 10) / 10);
    });
    return scores;
  }, [answers]);

  const archetype = useMemo(() => {
    const sorted = (Object.entries(dimensionScores) as [Dimension, number][]).sort((a, b) => b[1] - a[1]);
    const topDim = sorted[0]?.[0] ?? "relationships";
    return ARCHETYPES.find((a) => a.id === topDim) ?? ARCHETYPES[0];
  }, [dimensionScores]);

  const handleChoice = useCallback(
    (choiceIdx: number) => {
      if (transitioning) return;
      setSelectedChoice(choiceIdx);
      setTimeout(() => {
        setTransitioning(true);
        const next = { ...answers, [currentQ]: choiceIdx };
        setAnswers(next);
        setTimeout(() => {
          if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ((prev) => prev + 1);
            setSelectedChoice(null);
            questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            setPhase("results");
            markComplete("find-your-me");
          }
          setTransitioning(false);
        }, 600);
      }, 400);
    },
    [answers, currentQ, transitioning, markComplete],
  );

  const handleShare = useCallback(
    (platform: string) => {
      const url = "https://tonygreenberg.com/find-your-me";
      const text = archetype.shareText;
      if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
      else if (platform === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
      else if (platform === "email") window.open(`mailto:?subject=${encodeURIComponent(`Find My — ${archetype.name}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank");
      else if (platform === "copy") navigator.clipboard?.writeText(`${text}\n\n${url}`);
      setShareCount((prev) => prev + 1);
    },
    [archetype],
  );

  const displayScores = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of DIMENSIONS) out[DIMENSION_LABELS[d]] = dimensionScores[d];
    return out;
  }, [dimensionScores]);

  const filteredDirectory = useMemo(
    () =>
      DIRECTORY.map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const statusMatch = directoryFilter === "all" || item.status === directoryFilter;
          const searchMatch =
            !directorySearch || item.name.toLowerCase().includes(directorySearch.toLowerCase()) || item.hook.toLowerCase().includes(directorySearch.toLowerCase());
          return statusMatch && searchMatch;
        }),
      })).filter((section) => section.items.length > 0),
    [directoryFilter, directorySearch],
  );

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="selfportrait" />

        <div className="relative z-1 flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-8 font-mono text-[0.7rem] tracking-[0.3em] text-brand-gold/70 uppercase">Five Questions. No Escape Hatch.</div>
          <h1 className="mb-2 font-heading text-[clamp(2.8rem,8vw,5.5rem)] leading-[1.1] font-normal">
            Find Y<span className="text-brand-gold">our</span> <span className="text-brand-gold italic">Me</span>
          </h1>
          <h2 className="mb-8 font-heading text-[clamp(1.5rem,4vw,2.8rem)] leading-[1.2] font-normal text-[#5C4A3A]">
            to Find Y<span className="text-brand-gold">our</span> <span className="text-brand-gold italic">We</span>
          </h2>
          <div className="font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/50">SCROLL TO BEGIN ↓</div>
        </div>

        <div className="relative z-1 mx-auto max-w-3xl px-6 pb-24">
          <p className="mb-16 text-center font-heading text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.5] font-normal">
            Look closely. <span className="text-brand-gold italic underline decoration-brand-gold-light/40 underline-offset-4">Your</span> was never just yours.
            <br />
            The word <em>your</em> contains <em className="text-brand-gold not-italic">our</em>.
            <br />
            That&apos;s not a typo. That&apos;s the whole point.
          </p>

          <div className="mb-16 grid gap-6">
            <GlassPanel className="border-l-2 border-l-brand-gold-light/30 p-10">
              <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.25em] text-brand-gold-light/60 uppercase">What This Is</h3>
              <p className="text-[1.1rem] leading-[1.8] text-[#F5F0E0]/80">
                Five questions that don&apos;t have right answers — only honest ones. Each answer tilts a mirror. By the end, you&apos;ll see which dimension of
                life is pulling you hardest right now: purpose, relationships, body, truth, consciousness, or tribe. Not a personality quiz. A reckoning.
              </p>
            </GlassPanel>
            <GlassPanel className="border-l-2 border-l-brand-gold-light/30 p-10">
              <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.25em] text-brand-gold-light/60 uppercase">What Happens Next</h3>
              <p className="text-[1.1rem] leading-[1.8] text-[#F5F0E0]/80">
                Your archetype unlocks a map: essays that read like the conversation you&apos;ve been waiting to have, assessments that go deeper than you
                expected, tools that actually work, and a community of people who think like you do at 2am. Every minute you spend here shifts something. The
                hour after changes everything else.
              </p>
            </GlassPanel>
            <GlassPanel className="border-l-2 border-l-brand-gold-light/30 p-10">
              <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.25em] text-brand-gold-light/60 uppercase">Why It Matters</h3>
              <p className="text-[1.1rem] leading-[1.8] text-[#F5F0E0]/80">
                You can&apos;t be of service to the world until you know what you&apos;re serving from. Self-knowledge isn&apos;t selfish — it&apos;s
                prerequisite. Find your <em className="text-brand-gold not-italic">me</em> and you find the <em className="text-brand-gold not-italic">our</em>{" "}
                that was hiding inside <em className="text-brand-gold not-italic">your</em> all along. Then you find your people. Then you change the world
                around you. That&apos;s the sequence. That&apos;s the only sequence.
              </p>
            </GlassPanel>
          </div>

          <div className="mb-20 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { num: "5", label: "Questions" },
              { num: "6", label: "Dimensions" },
              { num: "90+", label: "Essays" },
              { num: String(DIRECTORY_TOTAL), label: "Find Your ___" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-4xl text-brand-gold">{stat.num}</div>
                <div className="mt-1 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold/50 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-20">
            <div className="mb-12 text-center">
              <div className="mb-3 font-mono text-[0.65rem] tracking-[0.3em] text-brand-gold/50 uppercase">Or Skip the Quiz</div>
              <h2 className="mb-3 font-heading text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.3] font-normal">
                What Are You <span className="text-brand-gold italic">Healing</span> From?
              </h2>
              <p className="mx-auto max-w-125 text-base text-[#2C1810]/50">Pick the wound. We&apos;ll hand you the map.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {WOUND_CARDS.map((item) => (
                <div key={item.wound} className="rounded-2xl border border-brand-gold-light/12 bg-[#0A0A10]/60 p-6 backdrop-blur-xl" style={{ borderLeft: `2px solid ${item.color}` }}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 shrink-0 text-2xl" style={{ color: item.color }}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="mb-1 text-base font-semibold text-[#F5F0E0]/90">{item.wound}</div>
                      <div className="text-sm leading-relaxed text-[#F5F0E0]/45">{item.subtext}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 pl-10">
                    {item.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.path}
                        target={link.path.startsWith("http") ? "_blank" : undefined}
                        rel={link.path.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] transition-opacity hover:opacity-70"
                        style={{ color: item.color }}
                      >
                        <span className="text-[0.6rem]">{TYPE_ICON[link.type]}</span>
                        {link.label} →
                      </a>
                    ))}
                    {WOUND_TO_CATEGORY[item.wound] && (
                      <button
                        onClick={() => scrollToCategory(WOUND_TO_CATEGORY[item.wound])}
                        className="mt-1 flex items-center gap-2 py-1 font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold-light/50 transition-colors hover:text-brand-gold-light"
                      >
                        <span className="text-[0.6rem]">▼</span>
                        Browse {WOUND_TO_CATEGORY[item.wound]} ↓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <JourneyTracker variant="light" />
          </div>

          <div className="mb-20">
            <div className="mb-8 text-center">
              <div className="mb-3 font-mono text-[0.65rem] tracking-[0.3em] text-brand-gold/50 uppercase">The Full Ecosystem</div>
              <h2 className="mb-3 font-heading text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.3] font-normal">
                Every <span className="text-brand-gold italic underline decoration-brand-gold-light/40 underline-offset-4">Your</span> ___
              </h2>
              <p className="mx-auto max-w-135 text-base text-[#2C1810]/50">
                {DIRECTORY_TOTAL} doorways to self-knowledge. Some are live. Some are coming. All of them are you.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {(["all", "live", "coming"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setDirectoryFilter(f)}
                    className={`rounded-full border px-5 py-1.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors ${
                      directoryFilter === f ? "border-brand-gold-light/40 bg-brand-gold-light/15 text-brand-gold" : "border-brand-gold-light/10 bg-[#0A0A10]/30 text-brand-gold/50"
                    }`}
                  >
                    {f === "all" ? "All" : f === "live" ? "● Live" : "○ Coming"}
                  </button>
                ))}
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-brand-gold/30">⌕</span>
                  <input
                    type="text"
                    placeholder="Search experiences..."
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    className="w-50 rounded-full border border-brand-gold-light/10 bg-[#0A0A10]/30 py-1.5 pr-5 pl-8 text-sm text-[#2C1810] outline-none focus:border-brand-gold-light/30"
                  />
                </div>
              </div>
            </div>

            {filteredDirectory.map((section) => (
              <div
                key={section.category}
                ref={(el) => {
                  directorySectionRefs.current[section.category] = el;
                }}
                className={`mb-10 rounded-2xl transition-all duration-500 ${highlightCategory === section.category ? "border border-brand-gold/15 bg-brand-gold-light/4 p-6 shadow-[0_0_40px_rgba(212,185,106,0.08)]" : ""}`}
              >
                <div className="mb-5 flex items-baseline gap-4">
                  <h3 className="font-heading text-xl font-normal" style={{ color: section.color }}>
                    {section.category}
                  </h3>
                  <span className="text-sm text-[#2C1810]/35 italic">{section.subtitle}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => {
                    const isLive = item.status === "live";
                    const card = (
                      <div
                        className={`rounded-xl border p-5 backdrop-blur-xl transition-all ${
                          isLive
                            ? "border-brand-gold-light/12 bg-[#0A0A10]/60 hover:-translate-x-0 hover:border-brand-gold-light/30"
                            : "cursor-default border-brand-gold-light/6 bg-[#0A0A10]/30 opacity-55"
                        }`}
                      >
                        <div className="mb-1.5 flex items-start justify-between gap-2">
                          <span className={`font-heading text-[0.95rem] ${isLive ? "text-brand-gold-light" : "text-brand-gold-light/50"}`}>{item.name}</span>
                          <span
                            className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.1em] uppercase ${
                              isLive ? "border-[#7BC9A4]/20 text-[#7BC9A4]/70" : "border-brand-gold-light/10 text-brand-gold-light/30"
                            }`}
                          >
                            {isLive ? "Live" : "Coming"}
                          </span>
                        </div>
                        <p className="m-0 text-[0.82rem] leading-relaxed text-[#F5F0E0]/40">{item.hook}</p>
                      </div>
                    );
                    if (!isLive) return <div key={item.name}>{card}</div>;
                    if (item.url.startsWith("http")) {
                      return (
                        <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">
                          {card}
                        </a>
                      );
                    }
                    return (
                      <Link key={item.name} href={item.url}>
                        {card}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-10 flex flex-wrap justify-center gap-12 border-t border-b border-brand-gold-light/8 py-8 text-center">
              {[
                { num: String(DIRECTORY_LIVE), label: "Live Now" },
                { num: String(DIRECTORY_COMING), label: "Coming Soon" },
                { num: String(DIRECTORY.length), label: "Categories" },
                { num: "∞", label: "Rabbit Holes" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-heading text-[1.8rem] text-brand-gold">{s.num}</div>
                  <div className="mt-1 font-mono text-[0.6rem] tracking-[0.15em] text-brand-gold/40 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 text-center font-mono text-[0.65rem] tracking-[0.3em] text-brand-gold/30 uppercase">─── or let the mirror decide ───</div>

          <div className="text-center">
            <button
              onClick={() => setPhase("assessment")}
              className="inline-block animate-pulse rounded-2xl border border-brand-gold-light/12 bg-[#0A0A10]/60 px-14 py-5 font-mono text-[0.9rem] tracking-[0.25em] text-brand-gold uppercase backdrop-blur-xl"
            >
              Show Me What I Already Know →
            </button>
            <p className="mt-6 text-[0.9rem] text-[#2C1810]/40 italic">Takes 3 minutes. Stays with you longer.</p>
            <p className="mt-12 font-mono text-[0.6rem] tracking-[0.15em] text-brand-gold-light/20 uppercase">Zero Algorithm · All Nerve · One Ecosystem</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "assessment") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + (selectedChoice !== null ? 1 : 0)) / QUESTIONS.length) * 100;

    return (
      <div ref={questionRef} className="relative z-1 flex min-h-screen flex-col items-center justify-center px-6 py-16 font-sans text-[#2C1810]">
        <ThemedBackground theme="selfportrait" />
        <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-brand-gold/10">
          <div className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="fixed top-6 right-6 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/50">
          {currentQ + 1} / {QUESTIONS.length}
        </div>
        <button
          onClick={() => {
            if (currentQ > 0) {
              setCurrentQ((prev) => prev - 1);
              setSelectedChoice(null);
            } else setPhase("landing");
          }}
          className="fixed top-6 left-6 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/50"
        >
          ← Back
        </button>

        <div className={`w-full max-w-2xl transition-all duration-500 ${transitioning ? "-translate-y-5 opacity-0" : "translate-y-0 opacity-100"}`}>
          <h2 className="mb-3 font-heading text-[clamp(1.5rem,4vw,2.2rem)] leading-[1.4] font-normal">{q.stem}</h2>
          <p className="mb-12 text-[0.95rem] text-brand-gold/60 italic">{q.subtext}</p>

          <div className="flex flex-col gap-3">
            {q.choices.map((choice, idx) => (
              <button
                key={choice.text}
                onClick={() => handleChoice(idx)}
                disabled={transitioning}
                className={`w-full rounded-xl border px-6 py-5 text-left text-[1.05rem] leading-relaxed backdrop-blur-sm transition-all ${
                  selectedChoice === idx ? "border-brand-gold bg-brand-gold-light/15" : "border-brand-gold-light/10 bg-[#0A0A10]/40 hover:border-brand-gold-light/40 hover:bg-brand-gold-light/8"
                } ${transitioning && selectedChoice !== idx ? "opacity-30" : "opacity-100"}`}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="selfportrait" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-2 text-center font-mono text-[0.7rem] tracking-[0.3em] text-brand-gold/50 uppercase">What the Mirror Caught</div>
        <h1 className="mb-2 text-center font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] font-normal text-brand-gold">{archetype.name}</h1>
        <p className="mx-auto mb-12 max-w-125 text-center font-heading text-[1.15rem] text-[#5C4A3A] italic">{archetype.tagline}</p>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <GlassPanel className="flex items-center justify-center p-8">
            <AssessmentRadarChart scores={displayScores} max={10} accentColor={ACCENT} />
          </GlassPanel>
          <GlassPanel className="p-8">
            <p className="text-[1.02rem] leading-[1.8] text-[#F5F0E0]/85">{archetype.description}</p>
            <div className="mt-6 flex flex-col gap-2">
              {(Object.entries(dimensionScores) as [Dimension, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([dim, score]) => (
                  <div key={dim} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-right font-mono text-[0.65rem] text-brand-gold-light/50">{DIMENSION_LABELS[dim].split(" ")[0]}</span>
                    <div className="h-1 flex-1 rounded-full bg-brand-gold-light/10">
                      <div className="h-full rounded-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-700" style={{ width: `${score * 10}%` }} />
                    </div>
                    <span className="w-8 shrink-0 font-mono text-[0.65rem] text-brand-gold-light">{score.toFixed(1)}</span>
                  </div>
                ))}
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="mb-12 p-8 text-center">
          <p className="mb-2 font-heading text-[1.3rem] text-brand-gold">
            You found y<span className="text-brand-gold">our</span> Me. Now find y<span className="text-brand-gold">our</span> We.
          </p>
          <p className="mb-6 text-[0.95rem] text-[#F5F0E0]/50">Send this to 10 people brave enough to look. The ones who text back are your tribe.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { platform: "twitter", label: "𝕏" },
              { platform: "linkedin", label: "in" },
              { platform: "email", label: "✉" },
              { platform: "copy", label: "⎘" },
            ].map(({ platform, label }) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="flex size-11 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold-light/10 text-base text-brand-gold transition-colors hover:bg-brand-gold-light/25"
              >
                {label}
              </button>
            ))}
          </div>
          {shareCount > 0 && (
            <p className="mt-4 font-mono text-[0.7rem] text-brand-gold-light/50">
              {shareCount} of 10 shared · {10 - shareCount > 0 ? `${10 - shareCount} to go` : "You're a Tribe Weaver already"}
            </p>
          )}
        </GlassPanel>

        <div className="mb-12">
          <h3 className="mb-5 font-mono text-[0.75rem] tracking-[0.25em] text-brand-gold-light/50 uppercase">Rabbit Holes Worth Falling Into</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {archetype.articles.map((slug, idx) => (
              <Link key={slug} href={`/blog/${slug}`}>
                <GlassPanel className="h-full p-5 transition-colors hover:border-brand-gold-light/30">
                  <span className="font-mono text-[0.65rem] text-brand-gold-light/40">{String(idx + 1).padStart(2, "0")}</span>
                  <p className="mt-1 font-heading text-[0.95rem] leading-[1.4] text-[#F5F0E0]/85">{articleTitles[slug] ?? slug}</p>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="mb-5 font-mono text-[0.75rem] tracking-[0.25em] text-brand-gold-light/50 uppercase">Find Your ___</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {archetype.sites.map((site) => (
              <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer">
                <GlassPanel className="h-full p-5 transition-colors hover:border-brand-gold-light/30">
                  <p className="mb-1.5 font-heading text-base text-brand-gold-light">{site.name}</p>
                  <p className="text-[0.85rem] leading-relaxed text-[#F5F0E0]/50">{site.why}</p>
                </GlassPanel>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="mb-5 font-mono text-[0.75rem] tracking-[0.25em] text-brand-gold-light/50 uppercase">Go Deeper</h3>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {archetype.deeperAssessments.map((assess) => (
              <Link key={assess.path} href={assess.path}>
                <GlassPanel className="h-full p-5 transition-colors hover:border-brand-gold-light/30">
                  <p className="mb-1.5 font-heading text-base text-brand-gold-light">{assess.label} →</p>
                  <p className="text-[0.85rem] leading-relaxed text-[#F5F0E0]/50">{assess.why}</p>
                </GlassPanel>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {archetype.nextStep.path.startsWith("http") ? (
              <a href={archetype.nextStep.path} target="_blank" rel="noopener noreferrer">
                <GlassPanel className="animate-pulse px-8 py-4">
                  <span className="font-mono text-[0.8rem] tracking-[0.15em] text-brand-gold">{archetype.nextStep.label} →</span>
                </GlassPanel>
              </a>
            ) : (
              <Link href={archetype.nextStep.path}>
                <GlassPanel className="animate-pulse px-8 py-4">
                  <span className="font-mono text-[0.8rem] tracking-[0.15em] text-brand-gold">{archetype.nextStep.label} →</span>
                </GlassPanel>
              </Link>
            )}
            {archetype.nextStep.path !== "/community" && (
              <Link href="/community">
                <GlassPanel className="px-8 py-4">
                  <span className="font-mono text-[0.8rem] tracking-[0.15em] text-[#F5F0E0]/60">Find Your Tribe →</span>
                </GlassPanel>
              </Link>
            )}
            {archetype.nextStep.path !== "/living-declaration" && (
              <Link href="/living-declaration">
                <GlassPanel className="px-8 py-4">
                  <span className="font-mono text-[0.8rem] tracking-[0.15em] text-[#F5F0E0]/60">Find Your Living Declaration →</span>
                </GlassPanel>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center">
          <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-me" />
          <div className="mt-4 flex flex-wrap justify-center gap-8">
            <button
              onClick={() => {
                setPhase("landing");
                setCurrentQ(0);
                setAnswers({});
                setSelectedChoice(null);
                setShareCount(0);
              }}
              className="font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold-light/40 hover:text-brand-gold-light"
            >
              Shuffle the Deck
            </button>
            <Link href="/" className="font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold-light/40 hover:text-brand-gold-light">
              Back to the Mothership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
