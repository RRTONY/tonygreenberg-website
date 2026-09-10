import type { Metadata } from "next";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { ROASTERS, VARIETIES, DOLLAR_BREAKDOWNS } from "@/lib/content/brewsoul-encyclopedia";
import { NextSteps } from "@/components/brewsoul/next-steps";

// Ported from legacy client/src/pages/brewsoul/BrewSoulReference.tsx's
// `BrewSoulEconomics` — real live-computed stats (coffee/origin/roaster/
// variety counts, average price, average farmer share), a real price
// distribution histogram, and a real top-origins ranking, all computed
// directly from `BREWSOUL_COFFEES`/`DOLLAR_BREAKDOWNS`, unchanged. Fully
// static — the bar widths are the one genuinely per-item dynamic value
// that has to stay an inline `style`, per this repo's documented
// exception; the farmer-share stat's threshold color is a 2-variant set,
// precomposed as literal classes instead.
export const metadata: Metadata = {
  title: "Economics Dashboard — BrewSoul",
  description:
    "The specialty coffee economy at a glance — pricing trends, farmer equity, and the real cost of your morning cup.",
  alternates: { canonical: "/brewsoul/economics" },
};

const PRICE_BUCKETS = [
  { range: "<$15", min: 0, max: 15 },
  { range: "$15–25", min: 15, max: 25 },
  { range: "$25–40", min: 25, max: 40 },
  { range: "$40–75", min: 40, max: 75 },
  { range: "$75+", min: 75, max: 9999 },
];

export default function BrewSoulEconomicsPage() {
  const avgFarmerPct =
    DOLLAR_BREAKDOWNS.reduce((sum, d) => sum + d.farmerPct, 0) / DOLLAR_BREAKDOWNS.length;
  const priced = BREWSOUL_COFFEES.filter((c) => c.priceUsd);
  const avgPrice = priced.length
    ? priced.reduce((sum, c) => sum + (c.priceUsd || 0), 0) / priced.length
    : 0;
  const origins = Array.from(new Set(BREWSOUL_COFFEES.map((c) => c.originCountry)));
  const topOrigins = origins
    .map((o) => ({
      origin: o,
      count: BREWSOUL_COFFEES.filter((c) => c.originCountry === o).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const stats = [
    { label: "Coffees", value: String(BREWSOUL_COFFEES.length), className: "text-[#6F4E37]" },
    { label: "Origins", value: String(origins.length), className: "text-[#4A7C59]" },
    { label: "Avg $/Bag", value: `$${avgPrice.toFixed(0)}`, className: "text-[#C5A23C]" },
    {
      label: "Farmer Share",
      value: `${avgFarmerPct.toFixed(0)}%`,
      className: avgFarmerPct >= 15 ? "text-[#4A7C59]" : "text-[#8B2500]",
    },
    { label: "Roasters", value: String(ROASTERS.length), className: "text-[#6F4E37]" },
    { label: "Varieties", value: String(VARIETIES.length), className: "text-[#4A7C59]" },
  ];

  return (
    <section className="mx-auto max-w-225 px-6 py-12">
      <div className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">
        The Numbers
      </div>
      <h1 className="mb-2 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
        Economics Dashboard
      </h1>
      <p className="mb-8 max-w-2xl text-[0.95rem] leading-relaxed text-[#6B5B4F]">
        The specialty coffee economy at a glance — pricing trends, farmer equity, and the real cost
        of your morning cup.
      </p>

      <div className="mb-10 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-[#6F4E37]/3 p-5 text-center">
            <div className={`font-mono text-[1.8rem] font-bold ${s.className}`}>{s.value}</div>
            <div className="font-mono text-[0.72rem] text-[#6B5B4F]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">Price Distribution</h2>
      <div className="mb-10 flex flex-col gap-2">
        {PRICE_BUCKETS.map((b) => {
          const count = BREWSOUL_COFFEES.filter(
            (c) => c.priceUsd && c.priceUsd >= b.min && c.priceUsd < b.max,
          ).length;
          const pct = BREWSOUL_COFFEES.length ? (count / BREWSOUL_COFFEES.length) * 100 : 0;
          return (
            <div key={b.range} className="flex items-center gap-3">
              <span className="w-15 shrink-0 text-right font-mono text-[0.72rem] text-[#6B5B4F]">
                {b.range}
              </span>
              <div className="h-5.5 flex-1 overflow-hidden rounded-sm bg-[#6F4E37]/4">
                <div
                  className="h-full rounded-sm bg-linear-to-r from-[#6F4E37] to-[#A68B3C]"
                  style={{ width: `${pct}%`, minWidth: count > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="w-6 shrink-0 font-mono text-[0.72rem] font-bold text-[#2C1810]">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold text-[#2C1810]">Top Origins</h2>
      <div className="flex flex-col gap-2">
        {topOrigins.map((o) => (
          <div key={o.origin} className="flex items-center gap-3">
            <span className="w-22.5 shrink-0 text-right font-mono text-[0.72rem] text-[#6B5B4F]">
              {o.origin}
            </span>
            <div className="h-5.5 flex-1 overflow-hidden rounded-sm bg-[#6F4E37]/4">
              <div
                className="h-full rounded-sm bg-linear-to-r from-[#4A7C59] to-[#6B9E6B]"
                style={{ width: `${(o.count / BREWSOUL_COFFEES.length) * 100}%`, minWidth: "4px" }}
              />
            </div>
            <span className="w-6 shrink-0 font-mono text-[0.72rem] font-bold text-[#2C1810]">
              {o.count}
            </span>
          </div>
        ))}
      </div>

      <NextSteps
        steps={[
          {
            label: "Follow the Dollar",
            path: "/brewsoul/follow-the-dollar",
            description: "Your money's path",
          },
          { label: "Farm Profiles", path: "/brewsoul/farms", description: "Meet the growers" },
          { label: "Chain Rankings", path: "/brewsoul/chains", description: "Who pays fairly?" },
        ]}
      />
    </section>
  );
}
