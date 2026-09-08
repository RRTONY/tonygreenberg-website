"use client";

import { useState } from "react";

// Ported from legacy client/src/pages/brewsoul/BrewSoulBiodynamic.tsx's
// `CostCalc` — real annual cost comparison (conventional/organic/
// biodynamic per-cup pricing assumptions), unchanged.
export function CostCalculator() {
  const [cups, setCups] = useState(2);
  const conv = cups * 365 * 0.12;
  const org = cups * 365 * 0.22;
  const bio = cups * 365 * 0.38;

  return (
    <div className="my-7 rounded-lg border border-[#5d3a28]/10 bg-[#ede4d0] p-7">
      <div className="mb-3 font-mono text-[11px] tracking-[0.2em] text-[#6b5a4e]/80 uppercase">Annual Cost Calculator</div>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <span className="text-[15px] text-[#2d1810]">I drink</span>
        <input type="range" min={1} max={6} value={cups} onChange={(e) => setCups(+e.target.value)} className="w-30 accent-[#c4873b]" />
        <span className="font-heading text-2xl font-bold text-[#c4873b]">{cups}</span>
        <span className="text-[15px] text-[#2d1810]">cups per day</span>
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        {[
          { l: "Conventional", c: conv, d: "Pesticides, mold risk, soil depletion", h: false },
          { l: "Organic", c: org, d: "No synthetics, some natural pesticides allowed", h: false },
          { l: "Biodynamic", c: bio, d: "Zero pesticides, regenerative, mold-tested", h: true },
        ].map((t) => (
          <div key={t.l} className={`rounded-md p-4 text-center ${t.h ? "bg-[#1a0e08]" : "border border-[#5d3a28]/8 bg-white/70"}`}>
            <div className={`mb-2 font-mono text-[10px] tracking-[0.15em] uppercase ${t.h ? "text-[#e8dcc8]" : "text-[#6b5a4e]"}`}>{t.l}</div>
            <div className={`font-heading text-[28px] font-bold ${t.h ? "text-[#d4a84b]" : "text-[#2d1810]"}`}>${Math.round(t.c)}</div>
            <div className={`mt-1.5 text-[11px] leading-snug ${t.h ? "text-[#f5efe0]/60" : "text-[#6b5a4e]"}`}>{t.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-[#5c3a28] italic">
        The biodynamic premium is <strong>${Math.round(bio - conv)}/year</strong> — about ${((bio - conv) / 365).toFixed(2)}/day for zero pesticides,
        carbon sequestration, and verified purity.
      </div>
    </div>
  );
}
