import type { Metadata } from "next";
import Link from "next/link";
import { BREWSOUL_TOTAL_PAGES } from "@/lib/content/brewsoul-directory";
import { DirectoryExplorer } from "@/components/brewsoul/directory-explorer";

// Ported from legacy client/src/pages/brewsoul/BrewSoulDirectory.tsx —
// "Everything Inside BrewSoul," the real master page index (real 6
// categories, real page descriptions/icons), unchanged. Data already
// lived in `lib/content/brewsoul-directory.ts` (built earlier this phase
// to power `CategoryBadge`) — this route is where it finally becomes a
// real, browsable page. Category filter extracted into
// `components/brewsoul/directory-explorer.tsx`. Legacy's hardcoded
// "Browse All 103 Coffees" label corrected to drop the stale count
// (the real `/brewsoul/browse` page already shows the live 107).
export const metadata: Metadata = {
  title: "Coffee Directory — BrewSoul",
  description: "A curated directory of every page inside BrewSoul — specialty coffee intelligence, research, reference, and tools.",
  alternates: { canonical: "/brewsoul/directory" },
};

export default function BrewSoulDirectoryPage() {
  return (
    <div className="mx-auto max-w-225 px-6 pt-12 pb-20">
      <div className="mb-10 text-center">
        <div className="mb-3 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Complete Index</div>
        <h1 className="mb-4 font-heading text-[clamp(2rem,5vw,3rem)] leading-[1.15] font-bold text-[#2C1810]">Everything Inside BrewSoul</h1>
        <p className="mx-auto max-w-150 text-[1.1rem] leading-relaxed text-[#6B5B4F]">{BREWSOUL_TOTAL_PAGES} pages of coffee intelligence. Every page free.</p>
      </div>

      <DirectoryExplorer />

      <div className="mt-8 rounded-xl border border-[#6F4E37]/10 bg-[#6F4E37]/4 p-8 text-center">
        <div className="mb-2 font-heading text-[1.3rem] font-bold text-[#2C1810]">Don&apos;t know where to start?</div>
        <p className="mb-5 text-[0.95rem] text-[#6B5B4F]">Take the 2-minute Taste Quiz and we&apos;ll point you to the pages that matter for your palate.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/brewsoul/quiz" className="rounded-md bg-[#6F4E37] px-6 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-[#FAFAF7] uppercase">
            Take the Quiz
          </Link>
          <Link href="/brewsoul/first-sip" className="rounded-md border border-[#6F4E37]/30 px-6 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-[#6F4E37] uppercase">
            Read The First Sip
          </Link>
        </div>
      </div>
    </div>
  );
}
