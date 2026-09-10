"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAME } from "@/lib/content/brewsoul-decaf";

// Ported from legacy client/src/pages/brewsoul/BrewSoulDecaf.tsx's
// click-to-expand "Hall of Fame" clean-decaf cards — real behavior,
// unchanged. Data lives in `lib/content/brewsoul-decaf.ts` (see its own
// port note on why it's not exported from this client file).
export function DecafFame() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      {FAME.map((b, i) => (
        <button
          key={b.name}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className={`mb-3 block w-full rounded-lg border border-[#5d3a28]/8 bg-white p-5 text-left border-l-4 ${b.borderClass}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-50 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-heading text-lg font-bold text-[#1a0e08] italic">
                  {b.name}
                </span>
                <span
                  className={`rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-wide text-white ${b.colorClass}`}
                >
                  {b.tier}
                </span>
              </div>
              <div className="mt-1 text-xs text-[#6b5a4e]">{b.cert}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-base font-bold text-[#c4873b]">{b.perOz}/oz</div>
              <div className="text-xs text-[#6b5a4e]">{b.price}</div>
            </div>
          </div>
          {expanded === i && (
            <div className="mt-3.5 border-t border-[#5d3a28]/6 pt-3.5">
              <div className="mb-2.5 text-sm leading-relaxed text-[#5c3a28]">{b.notes}</div>
              <div className="flex flex-wrap gap-4 text-xs text-[#6b5a4e]">
                <span>
                  <strong>Process:</strong> {b.process}
                </span>
                <span>
                  <strong>Origin:</strong> {b.origin}
                </span>
              </div>
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 inline-block rounded-sm bg-[#4a5e3c] px-4 py-2 font-mono text-[11px] tracking-wide text-white"
              >
                Buy <ForwardIcon aria-hidden="true" />
              </a>
            </div>
          )}
          <div className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-[#6b5a4e]">
            {expanded === i ? (
              <ChevronUp aria-hidden="true" className="size-3" />
            ) : (
              <>
                <ChevronDown aria-hidden="true" className="size-3" /> Details &amp; buy link
              </>
            )}
          </div>
        </button>
      ))}
    </>
  );
}
