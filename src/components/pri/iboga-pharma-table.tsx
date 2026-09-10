"use client";

import { useState } from "react";
import { IBOGA_PHARMA_ALTERNATIVES } from "@/lib/content/pri-iboga-module";

const thClass =
  "border-b-2 border-[#D4CFC5] bg-[#E8E2D8] px-3 py-2.5 text-left text-xs font-extrabold tracking-[0.08em] whitespace-nowrap text-pri-ink uppercase";
const tdClass =
  "border-b border-[#E8E2D8] px-3 py-2.5 align-top text-[.85rem] leading-[1.5] text-pri-brown";

// Ported from legacy's `PharmaTable` (IbogaDeepDive.tsx) — the real 8-row
// ibogaine-specific pharma-to-plant alternatives table, unchanged.
// Show-all/collapse toggle is the only interactive piece.
export function IbogaPharmaTable() {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? IBOGA_PHARMA_ALTERNATIVES : IBOGA_PHARMA_ALTERNATIVES.slice(0, 5);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-175 border-collapse">
          <thead>
            <tr>
              <th className={thClass}>Pharmaceutical</th>
              <th className={thClass}>Category</th>
              <th className={thClass}>Iboga / Ibogaine Alternative</th>
              <th className={thClass}>Supplement Bridge</th>
              <th className={thClass}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.drug} className={i % 2 ? "bg-pri-parchment" : ""}>
                <td className={`${tdClass} font-bold`}>{r.drug}</td>
                <td className={tdClass}>{r.category}</td>
                <td className={tdClass}>{r.ibogaAlt}</td>
                <td className={tdClass}>{r.supplementAlt}</td>
                <td className={tdClass}>{r.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {IBOGA_PHARMA_ALTERNATIVES.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 rounded-md bg-pri-purple px-6 py-2.5 text-sm font-bold text-white"
        >
          {expanded ? "Show fewer" : `Show all ${IBOGA_PHARMA_ALTERNATIVES.length}`}
        </button>
      )}
    </div>
  );
}
