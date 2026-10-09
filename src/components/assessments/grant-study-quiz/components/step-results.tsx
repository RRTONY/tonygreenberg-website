"use client";

import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { ACCENT, JOURNEY_CONTINUES, barClassForScore, getFactorInsight } from "../data/grant-study.data";
import type { StepProps } from "../grant-study-quiz";

// Step 3: the life-satisfaction profile. Unchanged from the earlier port.
export function StepResults({ quiz }: StepProps) {
  const { factorScores, overall } = quiz;
  const sorted = [...factorScores].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const growthEdge = sorted[sorted.length - 1];

  return (
    <div className="relative z-1 min-h-screen py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="journey" />
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-4 font-mono text-[0.75rem] tracking-[0.2em] text-[#2E8B57] uppercase">Your Life Satisfaction Profile</p>
          <h1 className="mb-2 font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.2] font-normal text-[#0A0A10]">Overall: {overall}%</h1>
          <p className="text-[1.1rem] text-[#666]">Based on the five factors the Harvard Grant Study identified as predictive of lifelong wellbeing</p>
        </div>

        <hr className="mb-8 border-t border-brand-gold/15" />

        <div className="mb-8">
          {factorScores.map((f) => (
            <div key={f.key} className="mb-8">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="inline-flex items-center gap-2 font-heading text-[1.2rem] text-[#0A0A10]">
                  <f.icon aria-hidden="true" className="size-4.5 shrink-0" />
                  {f.name}
                </span>
                <span className="font-mono text-[0.85rem] font-semibold text-[#2E8B57]">{f.score}%</span>
              </div>
              <div className="h-2 rounded-sm bg-[#f0ede5]">
                <div className={`h-full rounded-sm transition-[width] duration-1000 ${barClassForScore(f.score)}`} style={{ width: `${f.score}%` }} />
              </div>
              <p className="mt-3 text-[0.9rem] leading-[1.7] text-[#666]">{getFactorInsight(f.key, f.score)}</p>
            </div>
          ))}
        </div>

        <hr className="mb-8 border-t border-brand-gold/15" />

        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div className="border border-[#e5e0d5] bg-white p-6">
            <p className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-[#2E8B57] uppercase">Your Strength</p>
            <p className="flex items-center gap-2 font-heading text-[1.2rem] text-[#0A0A10]">
              <strongest.icon aria-hidden="true" className="size-4.5 shrink-0" />
              {strongest.name}
            </p>
          </div>
          <div className="border border-[#e5e0d5] bg-white p-6">
            <p className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">Your Growth Edge</p>
            <p className="flex items-center gap-2 font-heading text-[1.2rem] text-[#0A0A10]">
              <growthEdge.icon aria-hidden="true" className="size-4.5 shrink-0" />
              {growthEdge.name}
            </p>
          </div>
        </div>

        <div className="mb-12 bg-[#0A0A10] p-8">
          <p className="mb-4 font-mono text-[0.75rem] tracking-[0.2em] text-brand-gold-light uppercase">Tony&apos;s Note</p>
          <p className="text-[1.05rem] leading-[1.8] text-[#ccc]">
            The Harvard Grant Study began in 1938 and followed 724 men for over 85 years — making it the longest study
            of human happiness ever conducted. George Vaillant, who directed it for three decades, distilled the
            findings into one sentence: &ldquo;Happiness is love. Full stop.&rdquo; Robert Waldinger, the current
            director, adds: &ldquo;The clearest message we get from this study is: good relationships keep us happier
            and healthier.&rdquo; Your scores above aren&apos;t grades — they&apos;re a map. The factor with the
            lowest score isn&apos;t your weakness. It&apos;s your invitation.
          </p>
        </div>

        <div className="mb-12">
          <JourneyTracker variant="light" currentAssessmentId="find-your-score" />
        </div>

        <div className="mb-12">
          <p className="mb-1 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold uppercase">The Journey Continues</p>
          <p className="mb-6 text-center text-[0.95rem] text-[#666]">You&apos;ve measured what matters most. Now explore the dimensions underneath.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_CONTINUES.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block border border-[#e5e0d5] bg-[#FAFAF7] p-4 transition-colors hover:border-[#2E8B57]"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="font-heading text-[0.9rem] text-[#0A0A10]">{item.name}</span>
                  <span className="shrink-0 border border-[#e5e0d5] px-1.5 py-0.5 font-mono text-[0.5rem] tracking-[0.08em] text-brand-gold uppercase">{item.badge}</span>
                </div>
                <p className="m-0 text-[0.82rem] leading-relaxed text-[#666]">{item.hook}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={quiz.retake}
            className="rounded-sm border border-brand-gold px-8 py-3 font-mono text-[0.8rem] tracking-[0.15em] text-brand-gold uppercase"
          >
            Retake Assessment
          </button>
          <Link href="/find-your-me" className="rounded-sm bg-brand-gold px-8 py-3 font-mono text-[0.8rem] tracking-[0.15em] text-white uppercase">
            Explore All Assessments
          </Link>
        </div>

        <AssessmentResultActions
          accentColor={ACCENT}
          resultSlug="grant-study"
          resultSummary={`Overall: ${overall}%; Strength: ${strongest.name}; Growth edge: ${growthEdge.name}`}
          resultScore={overall}
        />

        <p className="mt-4 text-center font-mono text-[0.7rem] tracking-widest text-[#999]">
          Based on the Harvard Grant Study (1938–present) · Curated by Tony Greenberg
        </p>
      </div>
    </div>
  );
}
