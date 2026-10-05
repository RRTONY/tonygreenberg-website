import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { RESULT_LOG_COOKIE, parseResultLogCookie } from "@/lib/assessments/result-log";
import { SELF_PORTRAIT_CATALOG, SELF_PORTRAIT_CATALOG_BY_SLUG } from "@/lib/content/self-portrait-catalog";

// Ported from legacy client/src/pages/SelfPortrait.tsx's real premise — a
// single place to see every assessment you've completed — but NOT its real
// mechanism. Legacy combined each assessment's own per-dimension scores
// (pulled from 16 different localStorage keys, one per assessment type)
// into one composite radar chart across 15 unified dimensions
// (Self-Awareness, Purpose & Direction, Emotional Depth, etc.), gated
// behind "5+ completed."
//
// This migration's `AssessmentResultActions` (see `result-log.ts`) only
// ever logs *that* an assessment was completed, not its actual scored
// answers — building the real composite radar would mean threading each
// assessment's real dimension scores through a second data channel, a
// meaningfully bigger change than what shipped so far. Rather than fake a
// radar chart from data that doesn't exist, this ships the real, honest
// subset: a genuine completed-assessments log (read server-side from the
// real `tg_assessment_results` cookie — no client hydration flash) with a
// real retake link per entry and real progress toward the full catalog.
// The composite radar is a tracked future enhancement, not a silent scope
// cut — see NEXTJS-MIGRATION-TODO.md.
//
// 2026-10-06: restyled to live's current design (dark page, "The Composite
// You", progress ring, the "N More Brushstrokes Needed" lock until 5 are
// done) with live's copy. Counts are this site's real ones (live says 27
// experiences; our catalog has SELF_PORTRAIT_CATALOG.length). Live's ring sits
// against the left edge, which reads as a layout bug there; here it is
// centered in the space live leaves for it.
export const metadata: Metadata = {
  title: "Your Self-Portrait",
  description: "Every assessment you've completed, in one place — a running record of what you've discovered about yourself.",
  alternates: { canonical: "/self-portrait" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const UNLOCK_AT = 5;
// Ring geometry: r=46 in a 104px box, 4px stroke.
const RING_CIRCUMFERENCE = 2 * Math.PI * 46;

export default async function SelfPortraitPage() {
  // next/headers's cookies() already URI-decodes the raw Cookie header
  // value (unlike the client-side document.cookie read in
  // result-log.ts's saveAssessmentResult, which does need its own
  // decodeURIComponent) — decoding again here would be a no-op-but-wrong
  // double decode.
  const cookieStore = await cookies();
  const raw = cookieStore.get(RESULT_LOG_COOKIE)?.value;
  const completed = parseResultLogCookie(raw)
    .filter((c) => SELF_PORTRAIT_CATALOG_BY_SLUG[c.slug])
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const total = SELF_PORTRAIT_CATALOG.length;
  const needed = Math.max(0, UNLOCK_AT - completed.length);
  const percent = Math.round((completed.length / total) * 100);

  return (
    <div className="min-h-screen bg-[#0E0D12] text-[#E8E4DD]">
      <div className="mx-auto max-w-162 px-6 pt-4 text-center">
        <Link
          href="/my-journey"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.15em] text-brand-gold-light uppercase"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to my journey
        </Link>

        <p className="mt-14 mb-4 font-mono text-[0.7rem]/[1.8] tracking-[0.2em] text-brand-gold-light uppercase">The Composite You</p>
        <h1 className="mb-4 font-heading text-[2.5rem]/[1.1] font-normal sm:text-[4rem]/[1.1]">
          Self-<span className="text-brand-gold-light">Portrait</span>
        </h1>
        <p className="mx-auto max-w-150 text-[1.1rem]/[1.6] text-[#E8E4DD]/60">
          {needed > 0
            ? `Complete ${needed} more assessment${needed === 1 ? "" : "s"} to unlock your composite self-portrait.`
            : "Every assessment you've completed, in one place: a running record of what you've discovered about yourself."}
        </p>

        <div className="relative mx-auto mt-14 mb-4 size-26" role="img" aria-label={`${percent}% complete`}>
          <svg viewBox="0 0 104 104" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="52" cy="52" r="46" fill="none" strokeWidth="4" className="stroke-brand-gold-light/15" />
            <circle
              cx="52"
              cy="52"
              r="46"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - percent / 100)}
              className="stroke-brand-gold-light"
            />
          </svg>
          <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl/none text-brand-gold-light">{percent}%</span>
            <span className="mt-1 font-mono text-[0.55rem] tracking-[0.1em] text-[#E8E4DD]/60 uppercase">Complete</span>
          </div>
        </div>
        <p className="font-mono text-xs text-[#E8E4DD]/60">
          {completed.length} of {total} experiences completed
        </p>
      </div>

      {needed > 0 && (
        <section className="mx-auto mt-33 max-w-137 px-6">
          <div className="rounded-xl border border-brand-gold-light/15 bg-white/3 px-8 py-12 text-center">
            <Lock aria-hidden="true" className="mx-auto mb-6 size-12 text-brand-gold-light" strokeWidth={1.5} />
            <h2 className="mb-4 font-heading text-2xl/[1.8] font-normal">
              {needed} More Brushstroke{needed === 1 ? "" : "s"} Needed
            </h2>
            <p className="text-lg/[1.6] text-[#E8E4DD]/60">
              Your self-portrait requires at least {UNLOCK_AT} completed assessments to generate a meaningful composite. Each assessment adds
              new dimensions to your identity map.
            </p>
            <Link
              href="/find-your-me"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-linear-to-br from-[#8B6914] to-brand-gold-light px-8 py-3 font-mono text-[0.8rem] tracking-[0.1em] text-[#0A0A10] uppercase"
            >
              Continue Your Journey
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="mx-auto mt-12 max-w-137 px-6">
          <h2 className="mb-4 text-center font-mono text-[0.68rem] tracking-[0.18em] text-[#E8E4DD]/60 uppercase">Completed so far</h2>
          <div className="flex flex-col gap-3">
            {completed.map((entry) => {
              const info = SELF_PORTRAIT_CATALOG_BY_SLUG[entry.slug];
              return (
                <Link
                  key={entry.slug}
                  href={`/${entry.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-brand-gold-light/15 bg-white/3 px-6 py-4 transition-colors hover:border-brand-gold-light/40"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <div className="font-heading text-[1.05rem] leading-tight">{info.title}</div>
                    <div className="mt-0.5 text-[0.85rem] leading-snug text-[#E8E4DD]/60">{info.summary}</div>
                    <div className="mt-1.5 font-mono text-[0.65rem] tracking-wide text-[#E8E4DD]/60 uppercase">
                      Completed {formatDate(entry.completedAt)}
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-brand-gold-light">
                    Retake
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mx-auto mt-12 max-w-137 px-6">
        <JourneyTracker compact />
      </div>

      <footer className="mt-12 border-t border-white/5 py-10 text-center font-mono text-[0.65rem] tracking-[0.1em] text-[#E8E4DD]/40 uppercase">
        Self-Portrait · Find Your Me · 2026
      </footer>
    </div>
  );
}
