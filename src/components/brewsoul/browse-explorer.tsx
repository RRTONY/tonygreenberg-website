"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { computeQPR } from "@/lib/intelligence-engine/scoring";
import { CoffeeCard } from "@/components/brewsoul/coffee-card";
import { markVisited } from "@/components/brewsoul/journey-bar";

// Ported from legacy client/src/pages/brewsoul/BrewSoulBrowse.tsx — the
// full-catalog browse/filter/sort/search tool. Real filtering logic
// unchanged (origin, processing method, roaster, mold-verified-only, max
// price, free-text search across name/producer/variety/tasting notes; 5
// sort modes). Legacy's "glass" toolbar/select styling ported as Tailwind
// utilities rather than inline styles, matching the CoffeeCard convention
// already established. The sticky filter bar sits at `top-13` to clear
// BrewSoulNav's own fixed height (matches `pt-13` in
// app/brewsoul/layout.tsx).
type SortKey = "qpr" | "price-asc" | "price-desc" | "cupping" | "name";

const ORIGINS = Array.from(new Set(BREWSOUL_COFFEES.map((c) => c.originCountry))).sort();
const PROCESSES = Array.from(new Set(BREWSOUL_COFFEES.map((c) => c.processingMethod))).sort();
const ROASTERS = Array.from(new Set(BREWSOUL_COFFEES.map((c) => c.producer))).sort();

const selectClass =
  "rounded-lg border border-[#8B6914]/15 bg-white/65 px-3 py-2 font-mono text-xs text-[#2C1810] backdrop-blur-md";

export function BrowseExplorer() {
  useEffect(() => {
    markVisited("browse");
  }, []);

  const [sort, setSort] = useState<SortKey>("qpr");
  const [origin, setOrigin] = useState("");
  const [process, setProcess] = useState("");
  const [roaster, setRoaster] = useState("");
  const [moldOnly, setMoldOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [search, setSearch] = useState("");

  const scored = useMemo(
    () =>
      BREWSOUL_COFFEES.map((coffee) => ({
        coffee,
        scores: { qpr: computeQPR(coffee, BREWSOUL_COFFEES) },
      })),
    [],
  );

  const filtered = useMemo(() => {
    let items = scored;
    if (origin) items = items.filter((x) => x.coffee.originCountry === origin);
    if (process) items = items.filter((x) => x.coffee.processingMethod === process);
    if (roaster) items = items.filter((x) => x.coffee.producer === roaster);
    if (moldOnly) items = items.filter((x) => x.coffee.moldTestStatus === "verified");
    items = items.filter((x) => x.coffee.priceUsd <= maxPrice);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (x) =>
          x.coffee.name.toLowerCase().includes(q) ||
          x.coffee.producer.toLowerCase().includes(q) ||
          x.coffee.variety.toLowerCase().includes(q) ||
          x.coffee.tastingNotes.some((n) => n.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case "qpr":
        return [...items].sort((a, b) => b.scores.qpr - a.scores.qpr);
      case "price-asc":
        return [...items].sort((a, b) => a.coffee.priceUsd - b.coffee.priceUsd);
      case "price-desc":
        return [...items].sort((a, b) => b.coffee.priceUsd - a.coffee.priceUsd);
      case "cupping":
        return [...items].sort(
          (a, b) => (b.coffee.cuppingScore || 0) - (a.coffee.cuppingScore || 0),
        );
      case "name":
        return [...items].sort((a, b) => a.coffee.name.localeCompare(b.coffee.name));
      default:
        return items;
    }
  }, [scored, origin, process, roaster, moldOnly, maxPrice, search, sort]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-[#F0E8D8] to-[#FAFAF7] px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 font-mono text-xs tracking-[0.3em] text-[#C5A23C] uppercase">
            The Catalog
          </div>
          <h1 className="mb-3 font-heading text-3xl font-bold text-[#2C1810] sm:text-4xl">
            Browse All Coffees
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base leading-relaxed text-[#6B5B4F]">
            {BREWSOUL_COFFEES.length} coffees scored, tested, and traced. Filter by what matters to
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { val: String(BREWSOUL_COFFEES.length), label: "Coffees" },
              { val: String(ORIGINS.length), label: "Origins" },
              { val: String(ROASTERS.length), label: "Roasters" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#8B6914]/15 bg-white/60 px-4 py-2 backdrop-blur-md"
              >
                <span className="font-heading text-lg font-bold text-[#8B6914]">{s.val}</span>
                <span className="ml-1.5 font-mono text-[0.58rem] tracking-wide text-[#5A4A20]/50 uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#FAFAF7] px-6 pb-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#8B6914]/12 bg-white/50 p-6 backdrop-blur-md">
          <p className="mb-2 text-sm leading-relaxed text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">What you&apos;re looking at:</strong> Every coffee in
            the BrewSoul catalog — from competition-winning micro-lots to commodity blends — scored
            on cupping quality, value (QPR), sourcing ethics, and traceability. The best and worst
            extremes are both here, intentionally.
          </p>
          <p className="mb-2 text-sm leading-relaxed text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">Why it matters:</strong> Most coffee ratings are
            pay-to-play or self-reported. This catalog aggregates SCA cupping scores, blind panel
            results, and supply chain audits into a single, objective profile for each coffee.
          </p>
          <p className="text-sm leading-relaxed text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">What to do:</strong> Sort by QPR (quality-to-price
            ratio) to find the best value. Filter by origin, process, or roast level. Click any card
            for the full scoring breakdown and tasting notes.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-13 z-100 border-b border-[#8B6914]/8 bg-[#FAFAF7]/90 px-6 py-3 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roaster, variety, or tasting note..."
            className="mb-3 w-full max-w-md rounded-xl border border-[#8B6914]/12 bg-white/65 px-4 py-2.5 text-sm text-[#2C1810] backdrop-blur-md"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              className={selectClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="qpr">Sort: Best QPR</option>
              <option value="cupping">Sort: Highest Score</option>
              <option value="price-asc">Sort: Price, low to high</option>
              <option value="price-desc">Sort: Price, high to low</option>
              <option value="name">Sort: Alphabetical</option>
            </select>
            <select
              className={selectClass}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              <option value="">All Origins</option>
              {ORIGINS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={process}
              onChange={(e) => setProcess(e.target.value)}
            >
              <option value="">All Processing</option>
              {PROCESSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={roaster}
              onChange={(e) => setRoaster(e.target.value)}
            >
              <option value="">All Roasters</option>
              {ROASTERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 rounded-lg border border-[#4A7C59]/12 bg-[#4A7C59]/6 px-3 py-2 font-mono text-xs text-[#4A7C59]">
              <input
                type="checkbox"
                checked={moldOnly}
                onChange={(e) => setMoldOnly(e.target.checked)}
                className="accent-[#4A7C59]"
              />
              Mold-Free Only
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#8B6914]/10 bg-white/50 px-3 py-1.5">
              <span className="font-mono text-[0.68rem] text-[#6F4E37]">Max ${maxPrice}</span>
              <input
                type="range"
                min={10}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#8B6914]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="min-h-[60vh] bg-linear-to-b from-[#FAFAF7] via-[#F5F0E6] to-[#FAFAF7] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 font-mono text-xs tracking-wide text-[#C5A23C] uppercase">
            {filtered.length} coffee{filtered.length !== 1 ? "s" : ""} found
          </div>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {filtered.map(({ coffee, scores }) => (
              <Link key={coffee.id} href={`/brewsoul/coffee/${coffee.id}`}>
                <CoffeeCard coffee={coffee} scores={scores} />
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#8B6914]/12 bg-white/60 p-10 text-center backdrop-blur-md">
              <div className="mb-3 text-3xl">☕</div>
              <p className="mb-1.5 font-heading text-lg text-[#2C1810]">
                No coffees match your filters.
              </p>
              <p className="text-sm text-[#6B5B4F]">
                Try broadening your search or resetting a filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
