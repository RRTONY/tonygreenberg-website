"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FRAUD_PATTERNS } from "@/lib/content/peptide-watch";

// Legacy conditionally unmounted each pattern's body until clicked — since
// these are 12 substantial, real fraud-pattern write-ups (not decorative
// reveals), every body renders in the raw SSR HTML by default here instead,
// matching the site's accordion-crawlability rule (see /journeys, /intel,
// framework-step-card.tsx).
export function PeptideWatchFraudPatterns() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {FRAUD_PATTERNS.map((fp) => {
        const isOpen = expanded === fp.num;
        return (
          <div
            key={fp.num}
            className="cursor-pointer rounded-md border border-brand-gold/20 transition-colors hover:border-brand-gold/50"
            onClick={() => setExpanded(isOpen ? null : fp.num)}
          >
            <div className="flex items-start gap-4 p-4">
              <span className="w-8 shrink-0 font-heading text-2xl font-black text-[#C84B2A]">
                {fp.num}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground">{fp.title}</h3>
                <p
                  className={`mt-2 text-sm leading-relaxed text-foreground/80 ${isOpen ? "" : "hidden"}`}
                >
                  {fp.body}
                </p>
              </div>
              {isOpen ? (
                <Minus className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <Plus className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
