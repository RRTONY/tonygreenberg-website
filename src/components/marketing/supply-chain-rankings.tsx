"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import { ChevronDown, Flag } from "lucide-react";
import type { CostBreakdown, Provider } from "@/lib/content/supply-chain-providers";
import { COST_CATEGORIES } from "@/lib/content/supply-chain-providers";

// DollarBar's segment widths/colors are per-provider runtime data (not a
// small known-at-build-time variant set), so inline `style` is the
// documented exception in CONTRIBUTING.md rather than a Tailwind class.
function DollarBar({
  breakdown,
  showLabels = true,
}: {
  breakdown: CostBreakdown;
  showLabels?: boolean;
}) {
  return (
    <div>
      <div
        className="flex overflow-hidden rounded-md border border-brand-gold/10"
        style={{ height: showLabels ? 32 : 18 }}
      >
        {COST_CATEGORIES.map((cat) => {
          const pct = breakdown[cat.key];
          if (pct === 0) return null;
          return (
            <div
              key={cat.key}
              title={`${cat.label}: ${pct}¢`}
              className="flex items-center justify-center opacity-85 transition-opacity hover:opacity-100"
              style={{ width: `${pct}%`, background: cat.color }}
            >
              {showLabels && pct >= 8 && (
                <span className="font-mono text-[0.55rem] font-bold whitespace-nowrap text-white">
                  {pct}¢
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div className="mt-2 flex flex-wrap gap-2">
          {COST_CATEGORIES.map((cat) => {
            const pct = breakdown[cat.key];
            if (pct === 0) return null;
            return (
              <span
                key={cat.key}
                className="flex items-center gap-1 font-mono text-[0.55rem] text-muted-foreground"
              >
                <span
                  className="inline-block size-2 shrink-0 rounded-sm"
                  style={{ background: cat.color }}
                />
                {cat.label} {pct}¢
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CredibilityBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-[#2E8B57]"
      : score >= 50
        ? "bg-[#D4B96A]"
        : score >= 30
          ? "bg-[#CD853F]"
          : "bg-[#B22222]";
  const label =
    score >= 70
      ? "Credible"
      : score >= 50
        ? "Moderate"
        : score >= 30
          ? "Questionable"
          : "Low Credibility";
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-white ${color}`}
    >
      {score}/100 · {label}
    </span>
  );
}

const TRANSPARENCY_CLASSES: Record<Provider["transparency"], string> = {
  high: "bg-[#2E8B57]/10 text-[#2E8B57]",
  medium: "bg-[#D4B96A]/10 text-[#D4B96A]",
  low: "bg-[#CD853F]/10 text-[#CD853F]",
  opaque: "bg-[#B22222]/10 text-[#B22222]",
};

function TransparencyTag({ level }: { level: Provider["transparency"] }) {
  const label =
    level === "high"
      ? "High Transparency"
      : level === "medium"
        ? "Medium Transparency"
        : level === "low"
          ? "Low Transparency"
          : "Opaque";
  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[0.55rem] tracking-wide uppercase ${TRANSPARENCY_CLASSES[level]}`}
    >
      {label}
    </span>
  );
}

export function SupplyChainRankings({ providers }: { providers: Provider[] }) {
  const [sortBy, setSortBy] = useState<"credibility" | "price" | "marketing" | "manufacturing">(
    "credibility",
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...providers];
    if (sortBy === "credibility") arr.sort((a, b) => b.credibilityScore - a.credibilityScore);
    else if (sortBy === "price") arr.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    else if (sortBy === "marketing")
      arr.sort((a, b) => b.breakdown.marketing - a.breakdown.marketing);
    else arr.sort((a, b) => b.breakdown.manufacturing - a.breakdown.manufacturing);
    return arr;
  }, [providers, sortBy]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Provider Rankings</h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "credibility", label: "By Credibility" },
              { key: "price", label: "By Price" },
              { key: "marketing", label: "By Marketing %" },
              { key: "manufacturing", label: "By Manufacturing %" },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`rounded border px-3 py-1.5 font-mono text-xs tracking-wide uppercase ${
                sortBy === s.key
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-border text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((provider, i) => {
          const isExpanded = expanded === provider.name;
          const rank = i + 1;
          return (
            <div
              key={provider.name}
              className={`overflow-hidden rounded-lg border bg-card ${isExpanded ? "border-brand-gold/30" : "border-border"}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : provider.name)}
                className="flex w-full flex-col gap-3 p-5 text-left"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`min-w-7 font-mono text-sm font-bold ${rank <= 3 ? "text-brand-gold" : "text-muted-foreground"}`}
                  >
                    #{rank}
                  </span>
                  <div className="min-w-37.5 flex-1">
                    <div className="font-medium text-foreground">{provider.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {provider.model} · ${provider.monthlyPrice}/mo
                    </div>
                  </div>
                  <TransparencyTag level={provider.transparency} />
                  <CredibilityBadge score={provider.credibilityScore} />
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
                <DollarBar breakdown={provider.breakdown} showLabels={false} />
              </button>

              {isExpanded && (
                <div className="border-t border-border p-5 pt-4">
                  <div className="mb-6">
                    <div className="mb-2 font-mono text-xs tracking-wide text-brand-gold uppercase">
                      Your Dollar Breakdown
                    </div>
                    <DollarBar breakdown={provider.breakdown} />
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {COST_CATEGORIES.map((cat) => {
                      const pct = provider.breakdown[cat.key];
                      const dollars = ((pct / 100) * provider.monthlyPrice).toFixed(0);
                      return (
                        <div
                          key={cat.key}
                          className="rounded-md border border-border p-2 text-center"
                        >
                          <div className="font-mono text-[0.55rem] tracking-wide text-muted-foreground uppercase">
                            {cat.label}
                          </div>
                          <div
                            className="font-heading text-lg font-bold"
                            style={{ color: cat.color }}
                          >
                            ${dollars}
                          </div>
                          <div className="font-mono text-[0.55rem] text-muted-foreground/70">
                            {pct}¢ per dollar
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {provider.flags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {provider.flags.map((flag) => (
                        <span
                          key={flag}
                          className="flex items-center gap-1 rounded bg-[#B22222]/10 px-1.5 py-0.5 font-mono text-[0.55rem] text-[#B22222]"
                        >
                          <Flag className="size-2.5" />
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mb-4 text-sm leading-relaxed text-foreground/80">
                    {provider.notes}
                  </p>

                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-brand-gold underline"
                  >
                    Visit {provider.name} <ForwardIcon aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
