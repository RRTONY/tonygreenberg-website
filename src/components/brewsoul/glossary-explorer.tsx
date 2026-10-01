"use client";

import { useState } from "react";
import type { GlossaryTerm } from "@/lib/intelligence-engine/types";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulGlossary` — real search-as-you-type and alphabetical grouping,
// extracted into a client island.
export function GlossaryExplorer({ terms }: { terms: GlossaryTerm[] }) {
  const [search, setSearch] = useState("");
  const filtered = terms.filter((g) => !search || g.term.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce<Record<string, GlossaryTerm[]>>((acc, g) => {
    const letter = g.term[0].toUpperCase();
    (acc[letter] ??= []).push(g);
    return acc;
  }, {});

  return (
    <>
      <input
        type="text"
        placeholder="Search terms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border border-[#6F4E37]/15 bg-[#6F4E37]/2 px-4 py-3 text-sm"
      />
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, group]) => (
          <div key={letter} className="mb-6">
            <div className="mb-2 border-b border-[#6F4E37]/8 pb-1 font-heading text-2xl font-bold text-[#836311]">{letter}</div>
            {/* dt/dd need a <dl> parent, and a <div> inside one may hold only dt/dd. */}
            <dl>
              {group.map((g) => (
                <div key={g.id} className="mb-3">
                  <dt className="font-heading text-base font-bold text-[#2C1810]">{g.term}</dt>
                  <dd className="mt-0.5 ml-0 text-[0.88rem] leading-relaxed text-[#6B5B4F]">
                    {g.definition}
                    {g.category && <span className="mt-1 block w-fit rounded-full bg-[#6F4E37]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#6F4E37]">{g.category}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
    </>
  );
}
