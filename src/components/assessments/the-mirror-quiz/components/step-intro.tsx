"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";
import { ECOSYSTEM_PILLS, theMirrorData } from "../data/the-mirror.data";
import type { StepProps } from "../the-mirror-quiz";

const PILL =
  "inline-flex min-h-11 items-center border border-brand-gold-light/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold dark:text-brand-gold-light";

// Step 1: live's intro (2026-10-07): dark hero, "What We Measure" (the six
// dimensions with their flow/friction lines), then "The Ecosystem" pills.
// Both buttons start the questions.
export function StepIntro({ quiz }: StepProps) {
  const copy = theMirrorData.intro;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden py-24 md:py-36">
        <div aria-hidden="true" className="absolute inset-0 bg-[#0A0A10]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.65_0.12_85/0.3),transparent_50%),radial-gradient(circle_at_70%_50%,oklch(0.55_0.15_85/0.2),transparent_50%)] opacity-10"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-6 font-mono text-xs tracking-[0.35em] text-brand-gold-light uppercase">{copy.eyebrow}</p>
          <h1 className="mb-6 font-heading text-4xl leading-[1.1] font-bold text-[#FAFAF7] md:text-6xl">
            {copy.titleLine1}
            <br />
            <span className="text-brand-gold-light">{copy.titleLine2}</span>
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-lg text-[#FAFAF7]/70 md:text-xl">{copy.subhead}</p>
          <p className="mx-auto mb-10 max-w-lg text-base text-[#FAFAF7]/50">{copy.body}</p>
          <button
            type="button"
            onClick={quiz.begin}
            className="inline-flex items-center gap-2 bg-brand-gold px-8 py-4 font-mono text-sm tracking-wider text-[#FAFAF7] uppercase transition-all duration-300 hover:bg-brand-gold-light hover:text-[#0A0A10]"
          >
            {copy.cta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
          <p className="mt-6 font-mono text-xs text-[#FAFAF7]/50">{copy.meta}</p>
        </div>
      </section>

      <section className="mx-auto max-w-215 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 font-mono text-[0.78rem] tracking-[0.35em] text-essay-red uppercase">{copy.measureEyebrow}</p>
          <h2 className="mb-4 font-heading text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight font-normal text-foreground">
            {copy.measureTitle}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {MIRROR_DIMENSIONS.map((d) => (
              <div key={d.id} className="border-l-2 border-brand-gold-light/30 pl-6">
                <h3 className="mb-2 font-heading text-xl font-semibold">{d.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{d.description}</p>
                <div className="space-y-1">
                  <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                    {copy.flowLabel}: {d.flowState}
                  </p>
                  <p className="font-mono text-xs text-red-800/80 dark:text-red-400">
                    {copy.frictionLabel}: {d.frictionState}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="mx-auto h-px w-44 bg-linear-to-r from-transparent via-essay-red to-transparent" />

      <section className="mx-auto max-w-215 px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-mono text-[0.78rem] tracking-[0.35em] text-essay-red uppercase">{copy.ecosystemEyebrow}</p>
          <h2 className="mb-4 font-heading text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight font-normal text-foreground">
            {copy.ecosystemTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">{copy.ecosystemBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ECOSYSTEM_PILLS.map((pill) =>
              !pill.href ? (
                <span key={pill.label} className={PILL}>
                  {pill.label}
                </span>
              ) : pill.external ? (
                <a
                  key={pill.label}
                  href={pill.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${PILL} transition-all hover:bg-brand-gold hover:text-[#FAFAF7]`}
                >
                  {pill.label}
                </a>
              ) : (
                <Link key={pill.label} href={pill.href} className={`${PILL} transition-all hover:bg-brand-gold hover:text-[#FAFAF7]`}>
                  {pill.label}
                </Link>
              ),
            )}
          </div>
          <div className="mt-12">
            <button
              type="button"
              onClick={quiz.begin}
              className="inline-flex items-center gap-2 bg-[#0A0A10] px-8 py-4 font-mono text-sm tracking-wider text-[#FAFAF7] uppercase transition-all duration-300 hover:bg-brand-gold dark:border dark:border-brand-gold-light/30"
            >
              {copy.ecosystemCta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-6" />
    </div>
  );
}
