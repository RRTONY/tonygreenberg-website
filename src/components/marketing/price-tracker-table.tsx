"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PriceEntry = {
  compound: string;
  researchVendor: string;
  telehealth: string;
  monthlyEst: string;
  verdict: string;
  tgTake?: string;
  researchLow: number;
  researchHigh: number;
  telehealthLow: number;
  telehealthHigh: number;
};

export function PriceTrackerTable({ prices }: { prices: PriceEntry[] }) {
  const [sortBy, setSortBy] = useState<"compound" | "research" | "telehealth">("compound");
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [pricingMode, setPricingMode] = useState<"research" | "telehealth">("research");

  const calculatorOptions = useMemo(
    () =>
      prices.map((p) => ({
        label: p.compound.split(" (")[0],
        researchLow: p.researchLow,
        researchHigh: p.researchHigh,
        telehealthLow: p.telehealthLow,
        telehealthHigh: p.telehealthHigh,
      })),
    [prices],
  );

  const sorted = useMemo(() => {
    return [...prices].sort((a, b) => {
      if (sortBy === "research") return a.researchLow - b.researchLow;
      if (sortBy === "telehealth") return (a.telehealthLow || 9999) - (b.telehealthLow || 9999);
      return a.compound.localeCompare(b.compound);
    });
  }, [prices, sortBy]);

  const stackCost = useMemo(() => {
    const items = calculatorOptions.filter((o) => selectedStack.includes(o.label));
    if (pricingMode === "research") {
      return {
        low: items.reduce((s, i) => s + i.researchLow, 0),
        high: items.reduce((s, i) => s + i.researchHigh, 0),
      };
    }
    const validItems = items.filter((i) => i.telehealthLow > 0);
    return {
      low: validItems.reduce((s, i) => s + i.telehealthLow, 0),
      high: validItems.reduce((s, i) => s + i.telehealthHigh, 0),
    };
  }, [calculatorOptions, selectedStack, pricingMode]);

  const toggleStack = (label: string) => {
    setSelectedStack((prev) => {
      if (prev.includes(label)) return prev.filter((l) => l !== label);
      if (prev.length >= 4) return prev;
      return [...prev, label];
    });
  };

  return (
    <>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Sort:</span>
            {(["compound", "research", "telehealth"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`rounded px-3 py-1.5 text-xs font-medium capitalize ${
                  sortBy === s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                {s === "compound" ? "Name" : s === "research" ? "Research $" : "Telehealth $"}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border text-left">
                  <th className="px-2 py-3 font-bold">Compound</th>
                  <th className="px-2 py-3 font-bold">Research Vendor</th>
                  <th className="px-2 py-3 font-bold">Telehealth / Rx</th>
                  <th className="px-2 py-3 font-bold">Monthly Est.</th>
                  <th className="px-2 py-3 font-bold">Value Verdict</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.compound} className="border-b border-border/60">
                    <td className="px-2 py-3 font-medium text-foreground">{p.compound}</td>
                    <td className="px-2 py-3 font-medium text-emerald-700">{p.researchVendor}</td>
                    <td className="px-2 py-3 text-amber-700">{p.telehealth}</td>
                    <td className="px-2 py-3 text-foreground/80">{p.monthlyEst}</td>
                    <td className="px-2 py-3 text-xs text-muted-foreground">{p.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-secondary p-5">
            <h3 className="mb-3 text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Tony&apos;s Takes
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {prices
                .filter((p) => p.tgTake)
                .map((p) => (
                  <div key={p.compound} className="text-sm">
                    <span className="font-bold text-foreground">{p.compound.split(" (")[0]}:</span>{" "}
                    <span className="text-muted-foreground italic">&quot;{p.tgTake}&quot;</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What Will Your Protocol Actually Cost Per Month?
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Select up to 4 compounds. Choose pricing source. See your monthly estimate.
          </p>

          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setPricingMode("research")}
              className={`rounded px-4 py-2 text-sm font-medium ${
                pricingMode === "research" ? "bg-emerald-700 text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              Research Vendor
            </button>
            <button
              onClick={() => setPricingMode("telehealth")}
              className={`rounded px-4 py-2 text-sm font-medium ${
                pricingMode === "telehealth" ? "bg-amber-600 text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              Telehealth / Rx
            </button>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {calculatorOptions.map((opt) => {
              const isSelected = selectedStack.includes(opt.label);
              const isDisabled = !isSelected && selectedStack.length >= 4;
              const noTelehealth = pricingMode === "telehealth" && opt.telehealthLow === 0;
              return (
                <button
                  key={opt.label}
                  onClick={() => !isDisabled && toggleStack(opt.label)}
                  disabled={isDisabled}
                  className={`rounded px-3 py-2 text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-foreground text-background"
                      : isDisabled
                        ? "cursor-not-allowed bg-secondary/50 text-muted-foreground/50"
                        : "bg-secondary text-foreground/80"
                  } ${noTelehealth && !isSelected ? "opacity-50" : ""}`}
                >
                  {opt.label}
                  {noTelehealth && <span className="block text-[10px] opacity-60">No Rx path</span>}
                </button>
              );
            })}
          </div>

          {selectedStack.length > 0 && (
            <div className="rounded-lg border-2 border-foreground p-6 text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                {selectedStack.length} compound{selectedStack.length > 1 ? "s" : ""} ·{" "}
                {pricingMode === "research" ? "Research vendor" : "Telehealth"} pricing
              </p>
              <p className="mb-1 text-4xl font-bold text-foreground">
                ${stackCost.low} – ${stackCost.high}
              </p>
              <p className="text-sm text-muted-foreground">estimated monthly cost</p>
              {pricingMode === "telehealth" && (
                <p className="mt-3 text-xs text-emerald-700">
                  Research vendor alternative: $
                  {calculatorOptions
                    .filter((o) => selectedStack.includes(o.label))
                    .reduce((s, i) => s + i.researchLow, 0)}{" "}
                  – $
                  {calculatorOptions
                    .filter((o) => selectedStack.includes(o.label))
                    .reduce((s, i) => s + i.researchHigh, 0)}
                  /mo
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground italic">
            Research vendor sourcing involves regulatory considerations. See{" "}
            <Link href="/whats-legal" className="underline">
              What&apos;s Legal
            </Link>{" "}
            for full context.
          </p>
        </div>
      </section>
    </>
  );
}
