"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type RiskLevel = "LOW" | "LOW-MEDIUM" | "MEDIUM" | "HIGH" | "VERY HIGH";

export type PeptideRegEntry = {
  compound: string;
  us: string;
  uk: string;
  australia: string;
  rxPath: string;
  userRisk: RiskLevel;
};

function StatusChip({ status }: { status: string }) {
  let color = "bg-secondary text-muted-foreground";
  if (status.includes("Approved")) color = "bg-emerald-100 text-emerald-800";
  if (status.includes("Grey")) color = "bg-amber-100 text-amber-800";
  if (status.includes("Banned") || status.includes("Scheduled")) color = "bg-red-100 text-red-800";
  if (status.includes("rejected")) color = "bg-red-100 text-red-800";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${color}`}>{status}</span>;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  "LOW-MEDIUM": "bg-lime-100 text-lime-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  "VERY HIGH": "bg-red-100 text-red-800",
};

function RiskChip({ risk }: { risk: RiskLevel }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${RISK_COLORS[risk]}`}>{risk}</span>
  );
}

export function PeptideLegalTable({ data }: { data: PeptideRegEntry[] }) {
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = data;
    if (filter === "low") items = items.filter((d) => d.userRisk === "LOW");
    if (filter === "medium") items = items.filter((d) => ["LOW-MEDIUM", "MEDIUM"].includes(d.userRisk));
    if (filter === "high") items = items.filter((d) => ["HIGH", "VERY HIGH"].includes(d.userRisk));
    if (search) items = items.filter((d) => d.compound.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [data, filter, search]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search compound..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 rounded-sm border border-border bg-background py-2 pr-4 pl-9 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "medium", "high"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : `${f} risk`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border text-left">
              <th className="px-2 py-3 font-bold">Compound</th>
              <th className="px-2 py-3 font-bold">US Status</th>
              <th className="px-2 py-3 font-bold">UK Status</th>
              <th className="px-2 py-3 font-bold">Australia</th>
              <th className="px-2 py-3 text-center font-bold">Rx Path?</th>
              <th className="px-2 py-3 text-center font-bold">User Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.compound} className="border-b border-border/60">
                <td className="px-2 py-3 font-medium text-foreground">{d.compound}</td>
                <td className="px-2 py-3">
                  <StatusChip status={d.us} />
                </td>
                <td className="px-2 py-3">
                  <StatusChip status={d.uk} />
                </td>
                <td className="px-2 py-3">
                  <StatusChip status={d.australia} />
                </td>
                <td className="px-2 py-3 text-center text-xs text-foreground/80">{d.rxPath}</td>
                <td className="px-2 py-3 text-center">
                  <RiskChip risk={d.userRisk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No compounds match your filter.</p>
      )}
    </div>
  );
}
