"use client";

import { useState } from "react";

export type Vendor = {
  vendor: string;
  score: number;
  coa: string;
  purity: string;
  usShip: string;
  notes: string;
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-600" : score >= 60 ? "bg-amber-500" : "bg-red-600";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold text-white ${color}`}>
      {score}
    </span>
  );
}

export function VendorScorecard({ vendors }: { vendors: Vendor[] }) {
  const [sortBy, setSortBy] = useState<"score" | "vendor">("score");
  const sorted = [...vendors].sort((a, b) =>
    sortBy === "score" ? b.score - a.score : a.vendor.localeCompare(b.vendor),
  );

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setSortBy("score")}
          className={`rounded px-3 py-1.5 text-sm font-medium ${
            sortBy === "score" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
          }`}
        >
          Sort by Score
        </button>
        <button
          onClick={() => setSortBy("vendor")}
          className={`rounded px-3 py-1.5 text-sm font-medium ${
            sortBy === "vendor" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
          }`}
        >
          Sort by Name
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border text-left">
              <th className="px-2 py-3 font-bold">Vendor</th>
              <th className="px-2 py-3 text-center font-bold">Score</th>
              <th className="px-2 py-3 font-bold">COA Type</th>
              <th className="px-2 py-3 font-bold">Purity</th>
              <th className="px-2 py-3 text-center font-bold">US Ship</th>
              <th className="px-2 py-3 font-bold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => (
              <tr key={v.vendor} className="border-b border-border/60">
                <td className="px-2 py-3 font-medium text-foreground">{v.vendor}</td>
                <td className="px-2 py-3 text-center">
                  <ScoreBadge score={v.score} />
                </td>
                <td className="px-2 py-3 text-foreground/80">{v.coa}</td>
                <td className="px-2 py-3 text-foreground/80">{v.purity}</td>
                <td className="px-2 py-3 text-center text-foreground/80">{v.usShip}</td>
                <td className="px-2 py-3 text-muted-foreground">{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
