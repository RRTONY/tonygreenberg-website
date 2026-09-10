"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Compound {
  name: string;
  amount: string;
  effect: string;
  source: string;
  preserved: boolean;
}

// Ported from legacy BrewSoulHealthFull.tsx's click-to-expand compound
// cards — real toggle behavior, unchanged. Extracted into its own client
// island for the same reason as `HealthRisks`.
export function HealthCompounds({ compounds }: { compounds: Compound[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {compounds.map((c, i) => (
        <button
          key={c.name}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className={`mb-3 block w-full rounded-lg border border-[#5d3a28]/8 bg-white p-5 text-left border-l-4 ${c.preserved ? "border-l-[#3a7a4a]" : "border-l-[#c4873b]"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="font-heading text-lg font-bold text-[#1a0e08] italic">{c.name}</div>
              <div className="mt-0.5 font-mono text-xs text-[#c4873b]">{c.amount}</div>
            </div>
            <span
              className={`rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-wide text-white ${c.preserved ? "bg-[#3a7a4a]" : "bg-[#c4873b]"}`}
            >
              {c.preserved ? "Preserved in Decaf" : "Lost in Decaf"}
            </span>
          </div>
          {expanded === i && (
            <div className="mt-3.5 border-t border-[#5d3a28]/6 pt-3.5">
              <div className="mb-2 text-sm leading-relaxed text-[#5c3a28]">{c.effect}</div>
              <div className="font-mono text-[10px] text-[#6b5a4e]">{c.source}</div>
            </div>
          )}
          <div className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-[#6b5a4e]">
            {expanded === i ? (
              <ChevronUp aria-hidden="true" className="size-3" />
            ) : (
              <>
                <ChevronDown aria-hidden="true" className="size-3" /> Details &amp; citation
              </>
            )}
          </div>
        </button>
      ))}
    </>
  );
}
