import type { Metadata } from "next";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { ASSESSMENTS } from "@/lib/content/assessments-hub";

// Ported from legacy client/src/pages/Assessments.tsx. See
// `lib/content/assessments-hub.ts` for the full port note on the three
// real instruments. All three now have real routes (`/dharma-finder`,
// `/consciousness-scale`, `/grant-study`), so every card links directly —
// this page is a pure preview/hub with no quiz or results step of its own,
// so no `EmailGate`/`AssessmentResultActions` here (each linked assessment
// handles its own). `JourneyTracker` is reused unchanged, same real
// per-browser progress data used everywhere else in this migration.
// Legacy's footer claimed "Results saved for your return" — dropped for
// an honest line since results still aren't cross-instrument-saved
// anywhere but the per-browser `tg_assessment_results` cookie.
export const metadata: Metadata = {
  title: "Self-Assessment Tools",
  description: "Three research-backed instruments — Dharma Finder, Consciousness Scale, and the Grant Study Assessment — mapping purpose, consciousness, and life satisfaction.",
  alternates: { canonical: "/assessments" },
};

export default function AssessmentsPage() {
  return (
    <div className="relative z-1 min-h-screen">
      <ThemedBackground theme="journey" />

      <div className="relative z-1 bg-[#0A0A10] pt-[clamp(7.5rem,12vw,10rem)] pb-[clamp(4rem,6vw,6rem)]">
        <div className="mx-auto max-w-300 px-8">
          <div className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">Know Thyself</div>
          <h1 className="mb-6 font-heading text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.15] font-normal text-background">
            Three Maps.
            <br />
            <span className="text-brand-gold-light">One Journey.</span>
          </h1>
          <p className="max-w-170 text-[1.05rem] leading-[1.8] text-[#999]">
            Purpose. Consciousness. Satisfaction. Three dimensions of a life well-lived, measured by three of the most rigorous frameworks ever developed.
            Each takes 15–20 minutes. Together, they create a portrait of where you are — and where you&apos;re being called.
          </p>
          <div className="mt-12">
            <a
              href="#instruments"
              className="inline-block bg-linear-to-br from-brand-gold to-brand-gold-light px-10 py-4 font-mono text-[0.85rem] tracking-[0.15em] text-white uppercase transition-opacity hover:opacity-90"
            >
              See the Instruments ↓
            </a>
          </div>
        </div>
      </div>

      <div id="instruments" className="relative z-1 mx-auto max-w-300 px-8 py-[clamp(4rem,6vw,6rem)]">
        <div className="flex flex-col gap-6">
          {ASSESSMENTS.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="grid grid-cols-1 items-center gap-6 border border-border bg-background p-8 transition-colors hover:border-brand-gold/40 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-10"
            >
              <div className="flex size-16 items-center justify-center rounded-sm border text-3xl" style={{ color: a.accent, borderColor: `${a.accent}33` }}>
                {a.icon}
              </div>
              <div>
                <p className="mb-2 font-mono text-xs tracking-[0.2em] uppercase" style={{ color: a.accent }}>
                  {a.subtitle}
                </p>
                <h3 className="mb-3 font-heading text-xl font-normal text-foreground">{a.title}</h3>
                <p className="max-w-170 text-[1.05rem] leading-[1.7] text-muted-foreground">{a.description}</p>
              </div>
              <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                <p className="font-mono text-xs tracking-widest text-muted-foreground">{a.time}</p>
                <span className="rounded-full bg-brand-gold/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-widest text-brand-gold uppercase">Begin →</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Looking for something else?{" "}
          <Link href="/find-my" className="text-brand-gold underline underline-offset-4">
            Browse the full assessment directory →
          </Link>
        </p>
      </div>

      <div className="relative z-1 mx-auto max-w-300 px-8 pt-[clamp(2rem,4vw,4rem)] pb-[clamp(4rem,6vw,6rem)]">
        <div className="mx-auto max-w-215">
          <JourneyTracker variant="light" />
        </div>
      </div>

      <div className="relative z-1 border-t border-b border-border">
        <div className="mx-auto max-w-300 px-8 py-[clamp(4rem,6vw,6rem)]">
          <p className="mb-6 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Why These Three</p>
          <p className="max-w-170 text-[1.05rem] leading-[1.8] text-foreground/80">
            I&apos;ve spent twenty-five years in rooms where people are trying to figure out what matters. What I&apos;ve learned: you need three
            coordinates to locate yourself. <strong>Purpose</strong> tells you what you&apos;re here to do (Schmachtenberger).{" "}
            <strong>Consciousness</strong> tells you from what level you&apos;re doing it (Hawkins). <strong>Satisfaction</strong> tells you whether the
            life you&apos;ve built actually sustains you (Harvard Grant Study). Together, they&apos;re a triangulation of the soul.
          </p>
        </div>
      </div>

      <div className="relative z-1 px-8 py-[clamp(2rem,4vw,3rem)] text-center">
        <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground">Curated by Tony Greenberg</p>
      </div>
    </div>
  );
}
