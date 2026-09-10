import { computeTier, tierLabel } from "@/lib/intelligence-engine/scoring";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import { Check } from "lucide-react";

// Ported from legacy client/src/pages/brewsoul/BrewSoulHome.tsx's
// `CoffeeCard` (originally defined there and re-exported for BrewSoulBrowse
// to reuse) — pulled out to its own shared component here instead, since
// both /brewsoul/home and /brewsoul/browse use it as a real, separate
// consumer. Legacy's "glass card" (backdrop-blur + rgba border/shadow) is
// a small, known set of hover/default states — expressed as Tailwind
// utility classes instead of the inline `style={}`/JS mouse-handler
// version, per this repo's no-inline-style rule. Real content/logic
// unchanged; `tierStars` folded into the existing `computeTier`/
// `tierLabel` pair (same 92/90/86 thresholds) rather than duplicated.
export interface CoffeeCardScores {
  qpr: number;
}

function qprColorClass(qpr: number) {
  if (qpr >= 80) return "text-[#4A7C59]";
  if (qpr >= 60) return "text-[#C5A23C]";
  return "text-[#8B2500]";
}

export function CoffeeCard({ coffee, scores }: { coffee: CatalogItem; scores: CoffeeCardScores }) {
  return (
    <div className="rounded-2xl border border-[#8B6914]/15 bg-white/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#8B6914]/50 hover:bg-white/90 hover:shadow-lg">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="font-heading text-base font-bold text-[#2C1810]">{coffee.name}</div>
          <div className="font-mono text-[0.7rem] text-[#6F4E37]">{coffee.producer}</div>
        </div>
        <div className={`font-mono text-[0.95rem] font-bold ${qprColorClass(scores.qpr)}`}>
          QPR {scores.qpr}
        </div>
      </div>
      <div className="mb-2 text-sm text-[#6B5B4F]">
        {coffee.originCountry} · {coffee.variety} · {coffee.processingMethod}
      </div>
      <div className="mb-3 text-sm text-[#999] italic">
        {coffee.tastingNotes?.join(", ") || "Complex, nuanced"}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#8B6914]/8 px-2 py-0.5 font-mono text-[0.65rem] text-[#6F4E37]">
            {tierLabel(computeTier(coffee.cuppingScore || 0))} · {coffee.cuppingScore}
          </span>
          {coffee.moldTestStatus === "verified" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#4A7C59]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#4A7C59]">
              <Check aria-hidden="true" className="size-3" /> Mold-Free
            </span>
          )}
          {coffee.limitedRelease && (
            <span className="rounded-full bg-[#C5A23C]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#C5A23C]">
              Limited
            </span>
          )}
        </div>
        <div className="font-mono text-[0.88rem] font-semibold text-[#2C1810]">
          ${coffee.priceUsd}
        </div>
      </div>
    </div>
  );
}
