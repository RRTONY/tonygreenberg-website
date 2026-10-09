import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHAIN_RANKINGS } from "@/lib/content/brewsoul-chains";

// Plain-text entity statement under the homepage hero: one clear, quotable
// definition of who Tony is for search engines and AI tools. Copy from the
// "SEO and UX Implementation Pack" (2026-10-05), owner's yes 2026-10-10; the
// link's anchor text is the pack's suggested internal link to /ecosystem.
// The BrewSoul numbers are counted from the same data modules the BrewSoul
// section and pages use, so they can't drift from the site. Same dark band as
// the Four Doors section right below it, so the two read as one block.
export function HomeEntityStatement() {
  return (
    <section
      aria-label="About Tony Greenberg"
      className="bg-[#0E0C09] px-4 pt-8 pb-2 sm:px-6 sm:pt-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[0.95rem]/[1.7] text-white/80 sm:text-base/[1.75]">
          Tony Greenberg is a strategist, author, and CEO of RampRate, a company benchmarking
          enterprise technology contracts. He is the founder of ImpactSoul, which aims to tokenize
          high-value assets to fund regenerative impact, and the creator of BrewSoul, a scored
          database of {BREWSOUL_COFFEES.length} specialty coffees and {CHAIN_RANKINGS.length}{" "}
          coffee chains.
        </p>
        <Link
          href="/ecosystem"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold-light uppercase underline-offset-4 hover:underline"
        >
          Explore the RampRate, ImpactSoul and BrewSoul ecosystem
          <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
