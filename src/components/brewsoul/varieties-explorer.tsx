"use client";

import { useState } from "react";
import type { VarietyEntry } from "@/lib/intelligence-engine/types";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulVarieties` — real search-as-you-type over the variety
// encyclopedia, extracted into a client island.
export function VarietiesExplorer({ varieties }: { varieties: VarietyEntry[] }) {
  const [search, setSearch] = useState("");
  const filtered = varieties.filter(
    (v) =>
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.origin.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search varieties..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border border-[#6F4E37]/15 bg-[#6F4E37]/2 px-4 py-3 text-sm"
      />
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {filtered.map((v) => (
          <div key={v.id} className="rounded-xl border border-[#6F4E37]/8 bg-white p-6">
            <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#C5A23C] uppercase">
              {v.species} · {v.origin}
            </div>
            <h3 className="mb-1.5 font-heading text-[1.1rem] font-bold text-[#2C1810]">{v.name}</h3>
            <p className="mb-2 text-[0.85rem] leading-relaxed text-[#6B5B4F]">{v.description}</p>
            <p className="mt-1 text-[0.82rem] text-[#4A7C59] italic">{v.cupProfile}</p>
            {v.yieldLevel && (
              <div className="mt-2 font-mono text-[0.68rem] text-[#999]">
                Yield: {v.yieldLevel} · Resistance: {v.diseaseResistance || "unknown"}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
