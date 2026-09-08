"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

const DIMS = ["qpr", "availability", "wow", "overall"] as const;

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulCompare` — real side-by-side comparison of up to 4 coffees
// across origin/producer/variety/process/price/cupping and the 4
// intelligence scores, unchanged.
export function CompareExplorer({ coffees }: { coffees: CatalogItem[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const scored = useMemo(() => coffees.map((c) => ({ ...c, scores: computeToolScores(c) })), [coffees]);
  const selected = scored.filter((c) => ids.includes(c.id));

  const addCoffee = (id: string) => {
    if (ids.length < 4 && !ids.includes(id)) setIds([...ids, id]);
  };
  const removeCoffee = (id: string) => setIds(ids.filter((x) => x !== id));

  const rows = [
    { label: "Origin", fn: (c: (typeof selected)[0]) => c.originCountry },
    { label: "Producer", fn: (c: (typeof selected)[0]) => c.producer },
    { label: "Variety", fn: (c: (typeof selected)[0]) => c.variety },
    { label: "Process", fn: (c: (typeof selected)[0]) => c.processingMethod },
    { label: "Price", fn: (c: (typeof selected)[0]) => (c.priceUsd ? `$${c.priceUsd}` : "—") },
    { label: "Cupping", fn: (c: (typeof selected)[0]) => (c.cuppingScore ? `${c.cuppingScore}` : "—") },
    ...DIMS.map((d) => ({ label: d.toUpperCase(), fn: (c: (typeof selected)[0]) => c.scores[d].toFixed(1) })),
    { label: "Tier", fn: (c: (typeof selected)[0]) => String(c.scores.tier) },
  ];

  return (
    <>
      <select
        onChange={(e) => {
          addCoffee(e.target.value);
          e.target.value = "";
        }}
        className="mb-4 w-full rounded-lg border border-[#6F4E37]/15 bg-white px-4 py-3 text-sm"
        defaultValue=""
      >
        <option value="">+ Add a coffee to compare...</option>
        {scored
          .filter((c) => !ids.includes(c.id))
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.producer}
            </option>
          ))}
      </select>

      <div className="mb-6 flex flex-wrap gap-2">
        {selected.map((c) => (
          <button
            key={c.id}
            onClick={() => removeCoffee(c.id)}
            className="rounded-full bg-[#C5A23C]/10 px-3 py-1.5 font-mono text-[0.72rem] text-[#8B6914]"
          >
            {c.name} ✕
          </button>
        ))}
      </div>

      {selected.length === 0 ? (
        <div className="px-8 py-16 text-center text-[#999]">Select coffees above to start comparing.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.85rem]">
            <thead>
              <tr className="border-b-2 border-[#6F4E37]/10">
                <th className="px-2 py-3 text-left font-mono text-[0.72rem] text-[#999]">Metric</th>
                {selected.map((c) => (
                  <th key={c.id} className="px-2 py-3 text-center font-heading text-[0.9rem] text-[#2C1810]">
                    <Link href={`/brewsoul/coffee/${c.id}`}>{c.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-b border-[#6F4E37]/5 ${i % 2 ? "bg-[#6F4E37]/2" : ""}`}>
                  <td className="p-2 font-mono text-[0.72rem] text-[#6B5B4F]">{row.label}</td>
                  {selected.map((c) => (
                    <td key={c.id} className="p-2 text-center text-[#2C1810]">
                      {row.fn(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
