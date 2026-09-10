"use client";

import { useMemo, useState } from "react";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

interface BlendPart {
  coffeeId: string;
  pct: number;
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulBlendBuilder` — combine up to 5 coffees, adjust ratios via
// real range sliders, see the weighted-average QPR/Wow/Overall scores.
// Unchanged. The blend itself is never persisted anywhere in legacy
// (no save/share) — it's a pure in-session calculator, ported as-is.
export function BlendBuilderExplorer({ coffees }: { coffees: CatalogItem[] }) {
  const [parts, setParts] = useState<BlendPart[]>([]);
  const [name, setName] = useState("");

  const addPart = (coffeeId: string) => {
    if (parts.length < 5 && !parts.find((p) => p.coffeeId === coffeeId)) {
      setParts([...parts, { coffeeId, pct: Math.floor(100 / (parts.length + 1)) }]);
    }
  };
  const removePart = (coffeeId: string) => setParts(parts.filter((p) => p.coffeeId !== coffeeId));
  const updatePct = (coffeeId: string, pct: number) =>
    setParts(parts.map((p) => (p.coffeeId === coffeeId ? { ...p, pct } : p)));
  const totalPct = parts.reduce((s, p) => s + p.pct, 0);

  const blendScores = useMemo(() => {
    if (parts.length === 0 || totalPct === 0) return null;
    return parts.reduce(
      (acc, p) => {
        const coffee = coffees.find((c) => c.id === p.coffeeId);
        if (!coffee) return acc;
        const s = computeToolScores(coffee);
        const w = p.pct / totalPct;
        return {
          qpr: acc.qpr + s.qpr * w,
          wow: acc.wow + s.wow * w,
          overall: acc.overall + s.overall * w,
        };
      },
      { qpr: 0, wow: 0, overall: 0 },
    );
  }, [parts, totalPct, coffees]);

  return (
    <>
      <input
        type="text"
        placeholder="Name your blend..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded-lg border border-[#6F4E37]/15 bg-[#6F4E37]/2 px-4 py-3 font-heading text-[1.1rem]"
      />

      <select
        onChange={(e) => {
          addPart(e.target.value);
          e.target.value = "";
        }}
        className="mb-6 w-full rounded-lg border border-[#6F4E37]/15 bg-white px-4 py-3 text-sm"
        defaultValue=""
      >
        <option value="">+ Add a coffee to your blend...</option>
        {coffees
          .filter((c) => !parts.find((p) => p.coffeeId === c.id))
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.producer}
            </option>
          ))}
      </select>

      {parts.length > 0 && (
        <div className="mb-6 flex flex-col gap-3">
          {parts.map((p) => {
            const coffee = coffees.find((c) => c.id === p.coffeeId);
            if (!coffee) return null;
            return (
              <div
                key={p.coffeeId}
                className="flex items-center gap-4 rounded-xl border border-[#6F4E37]/8 bg-white p-6"
              >
                <div className="flex-1">
                  <div className="font-heading text-[0.95rem] font-bold text-[#2C1810]">
                    {coffee.name}
                  </div>
                  <div className="font-mono text-[0.68rem] text-[#6B5B4F]">
                    {coffee.originCountry} · {coffee.variety}
                  </div>
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={p.pct}
                  onChange={(e) => updatePct(p.coffeeId, Number(e.target.value))}
                  className="w-25"
                />
                <span className="w-10 shrink-0 text-right font-mono text-[0.85rem] font-bold text-[#C5A23C]">
                  {p.pct}%
                </span>
                <button onClick={() => removePart(p.coffeeId)} className="text-lg text-[#999]">
                  ✕
                </button>
              </div>
            );
          })}
          <div
            className={`text-right font-mono text-[0.78rem] ${totalPct === 100 ? "text-[#4A7C59]" : "text-[#8B2500]"}`}
          >
            Total: {totalPct}% {totalPct !== 100 && "(adjust to 100%)"}
          </div>
        </div>
      )}

      {blendScores && (
        <div className="rounded-xl border border-[#6F4E37]/8 bg-[#C5A23C]/4 p-6">
          <div className="mb-3 font-mono text-[0.68rem] tracking-[0.25em] text-[#C5A23C] uppercase">
            Blend Profile{name ? `: "${name}"` : ""}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "QPR", value: blendScores.qpr },
              { label: "Wow Factor", value: blendScores.wow },
              { label: "Overall", value: blendScores.overall },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-2xl font-bold text-[#C5A23C]">
                  {s.value.toFixed(1)}
                </div>
                <div className="font-mono text-[0.68rem] text-[#6B5B4F]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
