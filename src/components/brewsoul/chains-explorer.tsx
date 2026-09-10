"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import type { ChainEntry } from "@/lib/intelligence-engine/types";

const TIER_TAG_CLASS: Record<ChainEntry["tier"], string> = {
  S: "bg-[#C5A23C]/12 text-[#8B6914]",
  A: "bg-[#4A7C59]/10 text-[#4A7C59]",
  B: "bg-[#6F4E37]/8 text-[#6F4E37]",
  C: "bg-[#999]/10 text-[#666]",
  D: "bg-[#8B2500]/6 text-[#8B2500]",
  F: "bg-[#8B2500]/12 text-[#8B2500]",
};
const TIER_BORDER_CLASS: Record<ChainEntry["tier"], string> = {
  S: "border-l-[#8B6914]",
  A: "border-l-[#4A7C59]",
  B: "border-l-[#6F4E37]",
  C: "border-l-[#666]",
  D: "border-l-[#8B2500]",
  F: "border-l-[#8B2500]",
};
const TIER_TEXT_CLASS: Record<ChainEntry["tier"], string> = {
  S: "text-[#8B6914]",
  A: "text-[#4A7C59]",
  B: "text-[#6F4E37]",
  C: "text-[#666]",
  D: "text-[#8B2500]",
  F: "text-[#8B2500]",
};
const TIER_FILTER_ACTIVE_CLASS: Record<ChainEntry["tier"], string> = {
  S: "border-2 border-[#8B6914] bg-[#C5A23C]/12 text-[#8B6914]",
  A: "border-2 border-[#4A7C59] bg-[#4A7C59]/10 text-[#4A7C59]",
  B: "border-2 border-[#6F4E37] bg-[#6F4E37]/8 text-[#6F4E37]",
  C: "border-2 border-[#666] bg-[#999]/10 text-[#666]",
  D: "border-2 border-[#8B2500] bg-[#8B2500]/6 text-[#8B2500]",
  F: "border-2 border-[#8B2500] bg-[#8B2500]/12 text-[#8B2500]",
};
const BAR_CLASS = { good: "bg-[#4A7C59]", mid: "bg-[#C5A23C]", low: "bg-[#8B2500]" };

const TYPE_LABELS: Record<ChainEntry["type"], string> = {
  specialty: "Specialty",
  premium: "Premium",
  "mass-market": "Mass Market",
  "fast-food": "Fast Food",
};

function ScoreBar({ value }: { value: number }) {
  const cls = value >= 7 ? BAR_CLASS.good : value >= 5 ? BAR_CLASS.mid : BAR_CLASS.low;
  const textCls = value >= 7 ? "text-[#4A7C59]" : value >= 5 ? "text-[#C5A23C]" : "text-[#8B2500]";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#6F4E37]/6">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className={`w-6 text-right font-mono text-[0.72rem] font-bold ${textCls}`}>
        {value}
      </span>
    </div>
  );
}

function ChainCard({
  chain,
  expanded,
  onToggle,
}: {
  chain: ChainEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border border-[#6F4E37]/8 border-l-4 bg-white p-5 ${TIER_BORDER_CLASS[chain.tier]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-3">
            <span className={`font-mono text-[1.1rem] font-bold ${TIER_TEXT_CLASS[chain.tier]}`}>
              #{chain.rank}
            </span>
            <h3 className="font-heading text-[1.1rem] font-bold text-[#2C1810]">{chain.name}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] ${TIER_TAG_CLASS[chain.tier]}`}
            >
              {chain.tier}-Tier
            </span>
            <span className="rounded-full bg-[#6F4E37]/5 px-2 py-0.5 font-mono text-[0.65rem] text-[#6B5B4F]">
              {TYPE_LABELS[chain.type]}
            </span>
            <span className="font-mono text-[0.62rem] text-[#999]">
              {chain.hq} · {chain.locations.toLocaleString()} locations · Est. {chain.founded}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className={`font-mono text-2xl font-bold ${TIER_TEXT_CLASS[chain.tier]}`}>
            {chain.aggregate}
          </div>
          <div className="font-mono text-[0.58rem] text-[#999] uppercase">Score</div>
        </div>
      </div>

      <p
        className={`text-[0.88rem] leading-relaxed text-[#6B5B4F] ${expanded ? "mt-3 mb-4" : "mt-3"}`}
      >
        {chain.verdict}
      </p>

      {expanded && (
        <div className="mt-2">
          <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: "Coffee Quality", value: chain.scores.coffeeQuality, weight: "30%" },
              { label: "Value (QPR)", value: chain.scores.value, weight: "25%" },
              { label: "Sourcing Ethics", value: chain.scores.sourcingEthics, weight: "20%" },
              { label: "Experience", value: chain.scores.experience, weight: "15%" },
              { label: "Consistency", value: chain.scores.consistency, weight: "10%" },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-0.5 flex justify-between">
                  <span className="font-mono text-[0.68rem] text-[#6B5B4F]">{s.label}</span>
                  <span className="font-mono text-[0.58rem] text-[#999]">{s.weight}</span>
                </div>
                <ScoreBar value={s.value} />
              </div>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#4A7C59] uppercase">
                Strengths
              </div>
              {chain.strengths.map((s) => (
                <div key={s} className="flex gap-1.5 py-0.5 text-[0.82rem] text-[#2C1810]">
                  <span className="text-[#4A7C59]">+</span> {s}
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 font-mono text-[0.62rem] tracking-[0.15em] text-[#8B2500] uppercase">
                Weaknesses
              </div>
              {chain.weaknesses.map((w) => (
                <div key={w} className="flex gap-1.5 py-0.5 text-[0.82rem] text-[#2C1810]">
                  <span className="text-[#8B2500]">−</span> {w}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {chain.signatureDrink && (
              <div className="font-mono text-[0.72rem] text-[#6B5B4F]">
                <span className="text-[#C5A23C]">★</span> Signature: {chain.signatureDrink}
              </div>
            )}
            <div className="font-mono text-[0.72rem] text-[#6B5B4F]">{chain.priceRange}</div>
            {chain.website && (
              <a
                href={chain.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-[0.72rem] text-[#C5A23C]"
              >
                Visit <ForwardIcon aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulChains.tsx — real
// tier-filter, type-filter, and search over the full 100-chain ranking,
// plus per-chain expand-for-detail. Unchanged.
export function ChainsExplorer({ chains }: { chains: ChainEntry[] }) {
  const [typeFilter, setTypeFilter] = useState<"all" | ChainEntry["type"]>("all");
  const [tierFilter, setTierFilter] = useState<"all" | ChainEntry["tier"]>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const filtered = useMemo(() => {
    let list = [...chains];
    if (typeFilter !== "all") list = list.filter((c) => c.type === typeFilter);
    if (tierFilter !== "all") list = list.filter((c) => c.tier === tierFilter);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.hq.toLowerCase().includes(q) ||
          c.verdict.toLowerCase().includes(q),
      );
    }
    return list;
  }, [chains, typeFilter, tierFilter, searchQ]);

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    chains.forEach((c) => counts[c.tier]++);
    return counts;
  }, [chains]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["S", "A", "B", "C", "D", "F"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(tierFilter === t ? "all" : t)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[0.72rem] ${
              tierFilter === t
                ? TIER_FILTER_ACTIVE_CLASS[t]
                : "border border-[#6F4E37]/10 text-[#6B5B4F]"
            }`}
          >
            {t} <span className="text-[0.62rem] opacity-70">({tierCounts[t]})</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "specialty", "premium", "mass-market", "fast-food"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] ${
              typeFilter === t
                ? "border-2 border-[#6F4E37] bg-[#6F4E37]/6 text-[#6F4E37]"
                : "border border-[#6F4E37]/10 text-[#6B5B4F]"
            }`}
          >
            {t === "all" ? "All Types" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search chains by name, location, or keyword..."
        value={searchQ}
        onChange={(e) => setSearchQ(e.target.value)}
        className="mb-6 w-full rounded-lg border border-[#6F4E37]/15 bg-[#6F4E37]/2 px-4 py-3 text-sm"
      />

      <div className="mb-4 font-mono text-[0.72rem] text-[#999]">
        Showing {filtered.length} of {chains.length} chains
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((chain) => (
          <ChainCard
            key={chain.id}
            chain={chain}
            expanded={expandedId === chain.id}
            onToggle={() => setExpandedId(expandedId === chain.id ? null : chain.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-8 py-16 text-center text-[#999]">
          No chains match your filters. Try adjusting your criteria.
        </div>
      )}
    </>
  );
}
