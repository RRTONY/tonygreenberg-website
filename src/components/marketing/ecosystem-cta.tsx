import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ported from legacy client/src/pages/Blog.tsx's "EcosystemCTA" (site-wide
// throughline block). Essay count is fetched live rather than the
// hardcoded "ninety-one" in legacy source, which was already stale for the
// current corpus size. A permanent dark band, matching live's 2026-10
// redesign (light gold on near-black in both themes).
export function EcosystemCTA({ essayCount }: { essayCount: number }) {
  return (
    <section className="bg-[#0A0A10] px-4 py-10 text-center sm:px-12 sm:py-9">
      <div className="mb-4 font-mono text-base tracking-[0.2em] text-brand-gold-light uppercase">
        The Throughline
      </div>
      <h2 className="mx-auto mb-4 max-w-[43.75rem] font-heading text-3xl/[1.2] font-normal text-[#F5F0E0] sm:text-[2.6rem]/[1.2]">
        The thinking doesn&apos;t stop here.
      </h2>
      <p className="mx-auto mb-8 max-w-[37.5rem] text-[1.15rem]/[1.7] text-white/60">
        {essayCount} essays and counting. If something here made you think differently — or made
        you angry enough to act — that&apos;s the point.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/find-my"
          className="inline-flex min-h-11 items-center rounded-sm bg-linear-to-br from-brand-gold-light to-[#C5A23C] px-7 py-2.5 font-mono text-base font-bold tracking-wide text-[#0A0A10] uppercase"
        >
          Find Your Fit
        </Link>
        <Link
          href="/ecosystem"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-brand-gold-light/30 px-7 py-2.5 font-mono text-base tracking-wide text-brand-gold-light uppercase"
        >
          The Ecosystem
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
