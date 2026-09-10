"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useState } from "react";
import type { ProducerEntry } from "@/lib/intelligence-engine/types";

const GRADE_TAG_CLASS: Record<string, string> = {
  A: "bg-[#C5A23C]/10 text-[#C5A23C]",
  B: "bg-[#4A7C59]/10 text-[#4A7C59]",
};
const DEFAULT_TAG_CLASS = "bg-[#6F4E37]/10 text-[#6F4E37]";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulRoasters` — real search + tier (overallGrade) filter over the
// roaster directory, extracted into a client island.
export function RoastersExplorer({ roasters }: { roasters: ProducerEntry[] }) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");

  const filtered = roasters.filter((r) => {
    if (
      search &&
      !r.name.toLowerCase().includes(search.toLowerCase()) &&
      !`${r.country} ${r.region || ""}`.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (tier === "legendary" && r.overallGrade !== "A") return false;
    if (tier === "exceptional" && r.overallGrade !== "B") return false;
    if (tier === "excellent" && !"CD".includes(r.overallGrade)) return false;
    return true;
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search roasters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-50 flex-1 rounded-lg border border-[#6F4E37]/15 bg-[#6F4E37]/2 px-4 py-3 text-sm"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="rounded-lg border border-[#6F4E37]/15 bg-white px-4 py-3 font-mono text-[0.78rem]"
        >
          <option value="all">All Tiers</option>
          <option value="legendary">Grade A</option>
          <option value="exceptional">Grade B</option>
          <option value="excellent">Grade C/D</option>
        </select>
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#6F4E37]/8 bg-white p-6">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <h3 className="font-heading text-[1.1rem] font-bold text-[#2C1810]">{r.name}</h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.65rem] ${GRADE_TAG_CLASS[r.overallGrade] ?? DEFAULT_TAG_CLASS}`}
              >
                Grade {r.overallGrade}
              </span>
            </div>
            <div className="mb-2 font-mono text-[0.68rem] text-[#6F4E37]">
              {r.country}
              {r.region ? `, ${r.region}` : ""}
            </div>
            <p className="mb-2 text-[0.85rem] leading-relaxed text-[#6B5B4F]">
              {r.philosophy || r.description}
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-[0.68rem] text-[#999]">
              <span>Quality: {r.qualityScore}</span>
              <span>·</span>
              <span>Transparency: {r.transparencyScore}</span>
              <span>·</span>
              <span>Equity: {r.farmerEquityGrade}</span>
            </div>
            {r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-[0.68rem] text-[#C5A23C]"
              >
                Visit <ForwardIcon aria-hidden="true" />
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
