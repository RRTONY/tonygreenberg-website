import { ForwardIcon } from "@/components/ui/inline-icons";
import Link from "next/link";

// Ported from legacy client/src/pages/Blog.tsx's "EcosystemCTA" (site-wide
// throughline block). Essay count is fetched live rather than the
// hardcoded "ninety-one" in legacy source, which was already stale for the
// current corpus size. Uses theme tokens, same as the rest of the page, so
// this section follows the light/dark toggle instead of staying a
// permanent dark band.
export function EcosystemCTA({ essayCount }: { essayCount: number }) {
  return (
    <section className="bg-secondary px-4 py-10 text-center sm:px-6 sm:py-12">
      <div className="mb-4 font-mono text-base tracking-[0.2em] text-brand-gold uppercase">
        The Throughline
      </div>
      <h2 className="mx-auto mb-4 max-w-2xl font-heading text-3xl font-normal text-foreground sm:text-4xl">
        The thinking doesn&apos;t stop here.
      </h2>
      <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
        {essayCount} essays and counting. If something here made you think differently — or made you
        angry enough to act — that&apos;s the point.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/find-my"
          className="rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-7 py-2.5 font-mono text-base font-bold tracking-wide text-white uppercase"
        >
          Find Your Fit
        </Link>
        <Link
          href="/ecosystem"
          className="rounded-sm border border-brand-gold/30 px-7 py-2.5 font-mono text-base tracking-wide text-brand-gold uppercase"
        >
          The Ecosystem <ForwardIcon aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
