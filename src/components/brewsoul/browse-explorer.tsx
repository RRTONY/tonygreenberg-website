"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee } from "lucide-react";
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
  "max-w-full rounded-lg border border-[#836311]/15 bg-white/65 px-3 py-2 font-mono text-xs text-[#2C1810] backdrop-blur-md";

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
    () => BREWSOUL_COFFEES.map((coffee) => ({ coffee, scores: { qpr: computeQPR(coffee, BREWSOUL_COFFEES) } })),
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
        return [...items].sort((a, b) => (b.coffee.cuppingScore || 0) - (a.coffee.cuppingScore || 0));
      case "name":
        return [...items].sort((a, b) => a.coffee.name.localeCompare(b.coffee.name));
      default:
        return items;
    }
  }, [scored, origin, process, roaster, moldOnly, maxPrice, search, sort]);

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate min-h-[clamp(340px,45vh,500px)] overflow-hidden bg-linear-to-b from-[#F0E8D8] to-[#FAFAF7] text-center">
        {/* Live's BrewSoul hero photo (rescued into Sanity, docs/ai/manus-media-rescue.md),
            with legacy's warm cream fade; the scroll parallax and particle canvas are dropped. */}
        <Image
          src="https://cdn.sanity.io/images/a3q1cyqs/production/1c8cf85cb4a89e17203b371252c9e86ccecff53a-1200x670.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 scale-110 object-cover object-[center_40%] brightness-105 saturate-115"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-linear-to-t from-[#F0E8D8] via-[#F0E8D8]/85 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(240,232,216,0.3)_100%)]" />
        <div className="mx-auto max-w-225 px-6 pt-[clamp(3rem,8vh,5rem)] pb-8">
          <div className="mb-3 font-mono text-[0.68rem]/[1.85] tracking-[0.3em] text-[#836311] uppercase">The Catalog</div>
          <h1 className="mb-3 font-heading text-[clamp(1.8rem,5vw,3rem)]/[1.15] font-bold text-[#2C1810]">Browse All Coffees</h1>
          <p className="mx-auto mb-6 max-w-150 text-[clamp(0.92rem,1.5vw,1.1rem)]/[1.6] text-[#6B5B4F]">
            {BREWSOUL_COFFEES.length} coffees scored, tested, and traced. Filter by what matters to you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { val: String(BREWSOUL_COFFEES.length), label: "Coffees" },
              { val: String(ORIGINS.length), label: "Origins" },
              { val: String(ROASTERS.length), label: "Roasters" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#836311]/15 bg-white/60 px-5 py-2.5 backdrop-blur-md">
                <span className="font-heading text-[1.3rem] font-bold text-[#836311]">{s.val}</span>
                <span className="ml-2 font-mono text-[0.58rem] tracking-[0.15em] text-[#5A4A20]/50 uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#FAFAF7] px-6 pb-8">
        <div className="mx-auto max-w-225 rounded-2xl border border-[#836311]/12 bg-white/50 px-6 py-5 backdrop-blur-md">
          <p className="mb-2 text-[0.85rem]/[1.65] text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">What you&apos;re looking at:</strong> Every coffee in the BrewSoul
            catalog — from competition-winning micro-lots to commodity blends — scored on cupping quality, value
            (QPR), sourcing ethics, and traceability. The best and worst extremes are both here, intentionally.
          </p>
          <p className="mb-2 text-[0.85rem]/[1.65] text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">Why it matters:</strong> Most coffee ratings are pay-to-play or
            self-reported. This catalog aggregates SCA cupping scores, blind panel results, and supply chain audits
            into a single, objective profile for each coffee.
          </p>
          <p className="text-[0.85rem]/[1.65] text-[#6B5B4F]">
            <strong className="text-[#6F4E37]">What to do:</strong> Sort by QPR (quality-to-price ratio) to find the
            best value. Filter by origin, process, or roast level. Click any card for the full scoring breakdown and
            tasting notes.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-13 z-100 border-b border-[#836311]/8 bg-[#FAFAF7]/90 px-6 py-3 backdrop-blur-lg">
        <div className="mx-auto max-w-300">
          <input
            type="search"
            aria-label="Search coffees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roaster, variety, or tasting note..."
            className="mb-3 w-full max-w-125 rounded-xl border border-[#836311]/12 bg-white/65 px-4 py-2.5 text-sm text-[#2C1810] backdrop-blur-md"
          />
          <div className="flex flex-wrap items-center gap-2.5">
            <select aria-label="Sort coffees" className={selectClass} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="qpr">Sort: Best QPR</option>
              <option value="cupping">Sort: Highest Score</option>
              <option value="price-asc">Sort: Price Low→High</option>
              <option value="price-desc">Sort: Price High→Low</option>
              <option value="name">Sort: A→Z</option>
            </select>
            <select aria-label="Filter by origin" className={selectClass} value={origin} onChange={(e) => setOrigin(e.target.value)}>
              <option value="">All Origins</option>
              {ORIGINS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select aria-label="Filter by processing method" className={selectClass} value={process} onChange={(e) => setProcess(e.target.value)}>
              <option value="">All Processing</option>
              {PROCESSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select aria-label="Filter by roaster" className={selectClass} value={roaster} onChange={(e) => setRoaster(e.target.value)}>
              <option value="">All Roasters</option>
              {ROASTERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 rounded-lg border border-[#4A7C59]/12 bg-[#4A7C59]/6 px-3 py-2 font-mono text-xs text-[#436F50]">
              <input
                type="checkbox"
                checked={moldOnly}
                onChange={(e) => setMoldOnly(e.target.checked)}
                className="accent-[#4A7C59]"
              />
              Mold-Free Only
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[#836311]/10 bg-white/50 px-3 py-1.5">
              <span className="font-mono text-[0.68rem] text-[#6F4E37]">Max ${maxPrice}</span>
              <input
                type="range"
                aria-label="Maximum price"
                min={10}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#836311]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="min-h-[60vh] bg-linear-to-b from-[#FAFAF7] via-[#F5F0E6] to-[#FAFAF7] px-6 py-8">
        <div className="mx-auto max-w-300">
          <div className="mb-5 font-mono text-xs tracking-wide text-[#836311] uppercase">
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
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#836311]/12 bg-white/60 p-10 text-center backdrop-blur-md">
              <Coffee aria-hidden="true" className="mx-auto mb-3 size-8 text-[#836311]" />
              <p className="mb-1.5 font-heading text-lg text-[#2C1810]">No coffees match your filters.</p>
              <p className="text-sm text-[#6B5B4F]">Try broadening your search or resetting a filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
