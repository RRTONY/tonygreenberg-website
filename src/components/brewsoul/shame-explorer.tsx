"use client";

import { useState } from "react";
import type { ShameEntry } from "@/lib/intelligence-engine/types";

// Ported from legacy client/src/pages/brewsoul/BrewSoulContent.tsx's
// `BrewSoulShame` — real category filter buttons, extracted into a
// client island so `/brewsoul/wall-of-shame` itself stays a Server
// Component for everything else.
export function ShameExplorer({ entries }: { entries: ShameEntry[] }) {
  const [cat, setCat] = useState("all");
  const cats = Array.from(new Set(entries.map((s) => s.category)));
  const filtered = cat === "all" ? entries : entries.filter((s) => s.category === cat);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {["all", ...cats].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 font-mono text-[0.7rem] ${
              cat === c
                ? "border-2 border-[#8B2500] bg-[#8B2500]/6 text-[#8B2500]"
                : "border border-[#6F4E37]/15 text-[#6B5B4F]"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-[#6F4E37]/8 border-l-4 border-l-[#8B2500] bg-white p-5"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-heading text-[1.05rem] font-bold text-[#2C1810]">
                #{s.rank} {s.brand}
              </h3>
              <span className="shrink-0 rounded-full bg-[#8B2500]/6 px-2.5 py-1 font-mono text-[0.62rem] text-[#8B2500]">
                {s.category}
              </span>
            </div>
            <p className="mb-2 text-[0.88rem] leading-relaxed text-[#6B5B4F]">{s.evidence}</p>
            <div className="flex items-center justify-between gap-4">
              <div className="font-mono text-[0.65rem] text-[#999]">Severity: {s.severity}/100</div>
              {s.response && (
                <div className="max-w-[60%] font-mono text-[0.65rem] text-[#999] italic">
                  {s.response}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
