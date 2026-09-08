import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ThemedBackground } from "@/components/assessments/themed-background";
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
export const metadata: Metadata = {
  title: "Your Self-Portrait",
  description: "Every assessment you've completed, in one place — a running record of what you've discovered about yourself.",
  alternates: { canonical: "/self-portrait" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function SelfPortraitPage() {
  // next/headers's cookies() already URI-decodes the raw Cookie header
  // value (unlike the client-side document.cookie read in
  // result-log.ts's saveAssessmentResult, which does need its own
  // decodeURIComponent) — decoding again here would be a no-op-but-wrong
  // double decode.
  const cookieStore = await cookies();
  const raw = cookieStore.get(RESULT_LOG_COOKIE)?.value;
  const completed = parseResultLogCookie(raw).sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const completedSlugs = new Set(completed.map((c) => c.slug));
  const remaining = SELF_PORTRAIT_CATALOG.filter((entry) => !completedSlugs.has(entry.slug));

  return (
    <div className="relative z-1 min-h-screen">
      <ThemedBackground theme="selfportrait" />

      <div className="relative z-1 mx-auto max-w-135 px-6 pt-[clamp(6rem,10vw,8rem)] pb-12 text-center">
        <h1 className="mb-2 font-heading text-[clamp(1.8rem,4vw,2.4rem)] leading-tight font-normal text-foreground">Your Self-Portrait</h1>
        <p className="mx-auto max-w-105 text-base leading-relaxed text-muted-foreground">
          Every assessment you&apos;ve completed, in one place — a running record of what you&apos;ve discovered about yourself.
        </p>
        <div className="mt-4 font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold uppercase">
          {completed.length} of {SELF_PORTRAIT_CATALOG.length} completed
        </div>
      </div>

      <section className="relative z-1 mx-auto max-w-130 px-6">
        {completed.length === 0 ? (
          <div className="rounded-2xl border border-brand-gold/15 bg-background/85 p-8 text-center backdrop-blur-sm">
            <p className="mb-4 text-[0.95rem] leading-relaxed text-foreground/80">
              Nothing here yet. Complete an assessment and it&apos;ll show up on this page automatically — no account, no login, just this
              browser.
            </p>
            <Link
              href="/find-my"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-6 py-2.5 font-mono text-[0.75rem] tracking-[0.12em] text-brand-gold uppercase"
            >
              Browse Assessments →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {completed.map((entry) => {
              const info = SELF_PORTRAIT_CATALOG_BY_SLUG[entry.slug];
              if (!info) return null;
              return (
                <Link
                  key={entry.slug}
                  href={`/${entry.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/85 px-6 py-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <div className="font-heading text-[1.05rem] leading-tight font-medium text-foreground">{info.title}</div>
                    <div className="mt-0.5 text-[0.85rem] leading-snug text-muted-foreground">{info.summary}</div>
                    <div className="mt-1.5 font-mono text-[0.65rem] tracking-wide text-muted-foreground/70 uppercase">
                      Completed {formatDate(entry.completedAt)}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-brand-gold">Retake →</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {remaining.length > 0 && (
        <section className="relative z-1 mx-auto mt-10 max-w-130 px-6">
          <div className="mb-4 flex items-center gap-4 text-center font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
            <span className="h-px flex-1 bg-brand-gold/12" />
            Still to Explore
            <span className="h-px flex-1 bg-brand-gold/12" />
          </div>
          <div className="flex flex-col gap-2.5">
            {remaining.map((entry) => (
              <Link
                key={entry.slug}
                href={`/${entry.slug}`}
                className="flex items-center justify-between gap-4 rounded-full border border-border bg-background/60 px-6 py-3.5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1 text-left">
                  <div className="font-heading text-[0.95rem] leading-tight font-medium text-foreground">{entry.title}</div>
                  <div className="mt-0.5 truncate text-[0.8rem] text-muted-foreground">{entry.summary}</div>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="relative z-1 mx-auto mt-12 max-w-130 px-6 pb-16">
        <JourneyTracker compact />
      </div>
    </div>
  );
}
