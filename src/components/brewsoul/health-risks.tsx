"use client";

import { useState } from "react";

interface Risk {
  title: string;
  detail: string;
  citation: string;
  severity: "HIGH" | "MODERATE" | "LOW";
}

const SEVERITY_BORDER_CLASS: Record<Risk["severity"], string> = {
  HIGH: "border-l-[#8b4c2a]",
  MODERATE: "border-l-[#c4873b]",
  LOW: "border-l-[#7a8c6e]",
};
const SEVERITY_BADGE_CLASS: Record<Risk["severity"], string> = {
  HIGH: "bg-[#8b4c2a]",
  MODERATE: "bg-[#c4873b]",
  LOW: "bg-[#7a8c6e]",
};

// Ported from legacy BrewSoulHealthFull.tsx's expand/collapse risks
// section — real toggle behavior, unchanged. Extracted into its own
// client island so `/brewsoul/health` stays a Server Component
// everywhere else.
export function HealthRisks({ risks }: { risks: Risk[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-6 rounded-sm border border-[#8b4c2a]/50 bg-[#8b4c2a]/30 px-6 py-3 font-mono text-xs tracking-[0.1em] text-[#e8dcc8]"
      >
        {expanded ? "Collapse Risks ▲" : `Show All ${risks.length} Risks ▼`}
      </button>

      {expanded && (
        <div className="flex flex-col gap-3">
          {risks.map((r) => (
            <div
              key={r.title}
              className={`rounded-lg border border-white/10 bg-white/5 p-5 border-l-4 ${SEVERITY_BORDER_CLASS[r.severity]}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-base font-bold text-[#f5efe0]">{r.title}</div>
                <span
                  className={`rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-wide text-white ${SEVERITY_BADGE_CLASS[r.severity]}`}
                >
                  {r.severity}
                </span>
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#f5efe0]/75">{r.detail}</div>
              <div className="mt-2 font-mono text-[10px] text-[#f5efe0]/40">{r.citation}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
