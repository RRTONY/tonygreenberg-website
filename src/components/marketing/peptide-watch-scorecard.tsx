"use client";

import { useState } from "react";
import { SCORECARD_CATEGORIES, SCORE_TIERS } from "@/lib/content/peptide-watch";

export function PeptideWatchScorecard() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {SCORECARD_CATEGORIES.map((cat) => (
          <div
            key={cat.letter}
            className="flex items-start gap-3 rounded-md border border-brand-gold/20 bg-card p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded bg-[#0A0A10] font-heading text-sm font-bold text-brand-gold">
              {cat.letter}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-sm font-bold text-foreground">{cat.name}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setScores((prev) => ({ ...prev, [cat.letter]: n }))}
                    className={`size-7 rounded text-xs font-bold transition-colors ${
                      scores[cat.letter] === n
                        ? "bg-brand-gold text-white"
                        : "bg-secondary text-foreground hover:bg-muted"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(scores).length > 0 && (
        <div className="mb-6 rounded-md bg-[#0A0A10] p-6 text-center">
          <div className="font-heading text-4xl font-black text-brand-gold">{total} / 50</div>
          <div className="mt-1 text-sm text-[#A09880]">
            {Object.keys(scores).length} of 10 categories scored
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {SCORE_TIERS.map((tier) => (
          <div
            key={tier.range}
            className="flex items-start gap-4 rounded-md border border-brand-gold/10 bg-card p-3"
          >
            <span className="w-16 shrink-0 text-lg font-bold" style={{ color: tier.color }}>
              {tier.range}
            </span>
            <div>
              <div className="text-sm font-bold text-foreground">{tier.verdict}</div>
              <div className="text-xs text-muted-foreground">{tier.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
