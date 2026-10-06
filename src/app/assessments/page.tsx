import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { ASSESSMENTS } from "@/lib/content/assessments-hub";

// Ported from legacy client/src/pages/Assessments.tsx and matched to the live
// tonygreenberg.com/assessments page (2026-10-07). See
// `lib/content/assessments-hub.ts` for the port note on the three real
// instruments. All three have real routes (`/dharma-finder`,
// `/consciousness-scale`, `/grant-study`; live's `/assessments/<slug>` links
// redirect there), so every card links directly. This page is a pure hub with
// no quiz or results step of its own, so no `EmailGate`/`AssessmentResultActions`
// here (each linked assessment handles its own). `JourneyTracker` is reused
// unchanged. Live's "Keep going" block is the site-wide WhereNext component,
// ported separately in the layout, not here.
//
// Two deliberate differences from live: the cards stack on phones (live keeps
// three columns at 375px and the text overflows), and the footer line uses
// `text-muted-foreground` instead of live's #aaa, which fails AA contrast.
export const metadata: Metadata = {
  title: "Self-Assessment Tools",
  description: "Three research-backed instruments — Dharma Finder, Consciousness Scale, and the Grant Study Assessment — mapping purpose, consciousness, and life satisfaction.",
  alternates: { canonical: "/assessments" },
};

export default function AssessmentsPage() {
  const first = ASSESSMENTS[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#0A0A10] pt-[clamp(7.5rem,12vw,10rem)] pb-[clamp(4rem,6vw,6rem)]">
        <div className="mx-auto max-w-300 px-8">
          <div className="mb-6 font-mono text-[0.78rem] tracking-[0.35em] text-[#8E1E25] uppercase">Know Thyself</div>
          <h1 className="mb-6 font-heading text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.15] font-normal text-[#FAFAF7]">
            Three Maps.
            <br />
            <span className="text-brand-gold-light">One Journey.</span>
          </h1>
          <p className="max-w-170 text-[1.05rem] leading-[1.8] text-[#999]">
            Purpose. Consciousness. Satisfaction. Three dimensions of a life well-lived, measured by three of the most rigorous frameworks ever developed.
            Each takes 15–20 minutes. Together, they create a portrait of where you are — and where you&apos;re being called.
          </p>
          <div className="mt-12">
            <Link
              href={`/${first.slug}`}
              className="inline-flex items-center gap-2 bg-linear-to-br from-brand-gold to-brand-gold-light px-10 py-4 font-mono text-[0.85rem] tracking-[0.15em] text-white uppercase transition-opacity hover:opacity-90"
            >
              Begin Your First Assessment
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-300 px-8 py-[clamp(4rem,6vw,6rem)]">
        <div className="flex flex-col gap-6">
          {ASSESSMENTS.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className={`group grid grid-cols-1 items-center gap-6 border border-[#e5e0d5] bg-card px-8 py-10 transition-all duration-300 hover:translate-x-1 sm:grid-cols-[auto_1fr_auto] sm:gap-8 dark:border-border ${a.cardHover}`}
            >
              <div className={`flex size-16 items-center justify-center rounded-xs border ${a.iconBox}`}>
                <a.icon aria-hidden="true" strokeWidth={1.25} className="size-8" />
              </div>
              <div>
                <p className={`mb-2 font-mono text-[0.72rem] tracking-[0.2em] uppercase ${a.accentText}`}>{a.subtitle}</p>
                <h2 className="mb-3 font-heading text-[1.4rem] font-normal text-foreground">{a.title}</h2>
                <p className="max-w-170 text-[1.05rem] leading-[1.7] text-muted-foreground">{a.description}</p>
              </div>
              <div className="flex flex-row items-center gap-4 sm:min-w-25 sm:flex-col sm:items-end sm:gap-3 sm:text-right">
                <p className="font-mono text-[0.72rem] tracking-widest text-muted-foreground">{a.time}</p>
                <span className={`inline-flex items-center gap-1.5 font-mono text-[0.85rem] font-semibold ${a.accentText}`}>
                  Begin
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-300 px-8 pt-[clamp(2rem,4vw,4rem)] pb-[clamp(4rem,6vw,6rem)]">
        <div className="mx-auto max-w-215">
          <JourneyTracker variant="light" />
        </div>
      </div>

      <div className="border-t border-b border-[#e5e0d5] dark:border-border">
        <div className="mx-auto max-w-300 px-8 py-[clamp(4rem,6vw,6rem)]">
          <p className="mb-6 font-mono text-[0.72rem] tracking-[0.2em] text-brand-gold uppercase">Why These Three</p>
          <p className="max-w-170 text-[1.05rem] leading-[1.8] text-foreground/80">
            I&apos;ve spent twenty-five years in rooms where people are trying to figure out what matters. What I&apos;ve learned: you need three
            coordinates to locate yourself. <strong>Purpose</strong> tells you what you&apos;re here to do (Schmachtenberger).{" "}
            <strong>Consciousness</strong> tells you from what level you&apos;re doing it (Hawkins). <strong>Satisfaction</strong> tells you whether the
            life you&apos;ve built actually sustains you (Harvard Grant Study). Together, they&apos;re a triangulation of the soul.
          </p>
        </div>
      </div>

      <div className="px-8 py-[clamp(2rem,4vw,3rem)] text-center">
        <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground">
          All assessments are free · Results saved for your return · Curated by Tony Greenberg
        </p>
      </div>
    </div>
  );
}
