"use client";

import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  SCORING_DIMENSIONS,
  GRADE_SCALE,
  UNIVERSAL_CHAINS,
  NUANCED_CHAINS,
  getGradeColor,
  getGradeBg,
  type CityData,
  type Grade,
  type NationalStats,
} from "@/lib/content/brewsoul-cities";

function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/15 bg-linear-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-xl ${
        hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
          : ""
      } ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </div>
  );
}

function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "size-8 text-xs", md: "size-12 text-lg", lg: "size-16 text-2xl" };
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-xl border font-bold backdrop-blur-sm ${getGradeBg(grade)} ${getGradeColor(grade)}`}
    >
      {grade}
    </div>
  );
}

function CityCard({ city }: { city: CityData }) {
  const hasData = city.bestShops.length > 0;
  const card = (
    <GlassCard className={`cursor-pointer p-5 ${!hasData ? "opacity-70" : ""}`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-500/70">
            #{city.rank}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-amber-50">{city.name}</h3>
            <span className="text-xs tracking-wider text-amber-200/50 uppercase">{city.state}</span>
          </div>
        </div>
        <GradeBadge grade={city.grade} />
      </div>

      <p className="mb-3 text-sm leading-relaxed text-amber-200/60 italic">
        &ldquo;{city.tagline}&rdquo;
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <div className="text-sm font-bold text-amber-400">{city.stats.totalSpecialtyShops}</div>
          <div className="text-[10px] tracking-wider text-amber-200/40 uppercase">Shops</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <div className="text-sm font-bold text-amber-400">
            ${city.stats.avgLattePrice.toFixed(2)}
          </div>
          <div className="text-[10px] tracking-wider text-amber-200/40 uppercase">Avg Latte</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <div className="text-sm font-bold text-emerald-400">{city.stats.bestScore}</div>
          <div className="text-[10px] tracking-wider text-amber-200/40 uppercase">Best</div>
        </div>
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <div className="text-sm font-bold text-red-400">{city.stats.worstScore}</div>
          <div className="text-[10px] tracking-wider text-amber-200/40 uppercase">Worst</div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-amber-200/50">{city.verdict}</p>

      {hasData ? (
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[10px] tracking-wider text-amber-500/60 uppercase">
            {city.bestShops.length} best · {city.worstShops.length} worst scored
          </span>
          <span className="text-xs text-amber-400">
            <ForwardIcon aria-hidden="true" />
          </span>
        </div>
      ) : (
        <div className="mt-3 border-t border-white/10 pt-3">
          <span className="text-[10px] tracking-wider text-amber-500/40 uppercase">
            Full data coming soon
          </span>
        </div>
      )}
    </GlassCard>
  );
  return hasData ? <Link href={`/brewsoul/cities/${city.slug}`}>{card}</Link> : card;
}

function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
      <div className="text-2xl font-bold text-amber-400">{value}</div>
      <div className="mt-1 text-xs tracking-wider text-amber-200/50 uppercase">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-amber-200/30">{sub}</div>}
    </div>
  );
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulCities.tsx — real
// grade filter, methodology modal, and chain report card toggle,
// extracted into this client island so `app/brewsoul/cities/page.tsx`
// stays a thin Server Component wrapper. Scroll-linked hero parallax and
// the floating-particle background dropped, same decoration call made
// throughout this migration.
export function CitiesExplorer({
  cities,
  nationalStats,
}: {
  cities: CityData[];
  nationalStats: NationalStats;
}) {
  const [filter, setFilter] = useState<"all" | "A" | "B" | "C">("all");
  const [showMethodology, setShowMethodology] = useState(false);
  const [showChains, setShowChains] = useState(false);

  const filteredCities = useMemo(() => {
    if (filter === "all") return cities;
    return cities.filter((c) => c.grade.startsWith(filter));
  }, [cities, filter]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-b from-[#1a1208] via-[#0f0d08] to-[#0a0806] text-amber-50">
      <section className="relative flex h-[70vh] min-h-125 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1a1208]/70 via-[#0f0d08]/80 to-[#0a0806]" />

        <div className="relative z-1 max-w-4xl px-6 text-center">
          <div className="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="font-mono text-xs tracking-[0.3em] text-amber-400/80 uppercase">
              City Intelligence Module
            </span>
          </div>
          <h1 className="mb-4 text-4xl leading-tight font-bold sm:text-5xl md:text-6xl">
            <span className="text-amber-50">The Best & Worst Coffee</span>
            <br />
            <span className="bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              in 25 American Cities
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-amber-200/60">
            Nobody has done this. 1,250 shops scored across 7 dimensions. Best 25 and Worst 25 per
            city. Chain report cards. Bridge drinks for non-coffee people. Every claim backed by
            data.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#leaderboard"
              className="rounded-xl bg-linear-to-r from-amber-600 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/20"
            >
              See the Rankings
            </a>
            <button
              onClick={() => setShowMethodology(true)}
              className="rounded-xl border border-amber-500/30 px-6 py-3 text-amber-400 backdrop-blur-sm"
            >
              Our Methodology
            </button>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatPill label="Cities Scored" value={nationalStats.totalCities} />
          <StatPill label="Shops Scored" value={nationalStats.totalShopsScored.toLocaleString()} />
          <StatPill label="Avg US Latte" value={`$${nationalStats.avgNationalLattePrice}`} />
          <StatPill
            label="Best Score"
            value={nationalStats.bestScoreNational}
            sub={nationalStats.bestShopNational}
          />
          <StatPill
            label="Worst Score"
            value={nationalStats.worstScoreNational}
            sub={nationalStats.worstShopNational}
          />
          <StatPill label="#1 City" value="PDX" sub={`${nationalStats.topCityScore}/100`} />
        </div>
      </section>

      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <GlassCard hover={false} className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-amber-50">National Chain Report Card</h2>
                <p className="mt-1 text-sm text-amber-200/50">
                  How the big chains score against our 7-dimension framework
                </p>
              </div>
              <button
                onClick={() => setShowChains(!showChains)}
                className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400"
              >
                {showChains ? "Hide" : "Show All"}
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {UNIVERSAL_CHAINS.slice(0, 4).map((chain) => (
                <div
                  key={chain.chainName}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-amber-50">{chain.chainName}</span>
                    <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>
                      {chain.grade}
                    </span>
                  </div>
                  <div className="mb-2 text-xs text-amber-200/40">
                    ${chain.avgLatte.toFixed(2)} avg latte
                  </div>
                  <p className="text-xs leading-relaxed text-amber-200/50">{chain.verdict}</p>
                </div>
              ))}
            </div>

            {showChains && (
              <>
                <h3 className="mt-6 mb-3 text-lg font-semibold text-amber-50">
                  The Rest of the Commodity Chains
                </h3>
                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {UNIVERSAL_CHAINS.slice(4).map((chain) => (
                    <div
                      key={chain.chainName}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-amber-50">
                          {chain.chainName}
                        </span>
                        <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>
                          {chain.grade}
                        </span>
                      </div>
                      <div className="mb-2 text-xs text-amber-200/40">
                        ${chain.avgLatte.toFixed(2)} avg latte
                      </div>
                      <p className="text-xs leading-relaxed text-amber-200/50">{chain.verdict}</p>
                    </div>
                  ))}
                </div>

                <h3 className="mt-6 mb-3 text-lg font-semibold text-amber-50">
                  The Nuanced Chains — Grade Each Location
                </h3>
                <p className="mb-4 text-sm text-amber-200/50">
                  These chains have real quality in their DNA but have scaled unevenly. Some
                  locations are genuinely great; others coast on the brand.
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {NUANCED_CHAINS.map((chain) => (
                    <div
                      key={chain.chainName}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-amber-50">
                          {chain.chainName}
                        </span>
                        <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>
                          {chain.grade}
                        </span>
                      </div>
                      <div className="mb-2 text-xs text-amber-200/40">
                        ${chain.avgLatte.toFixed(2)} avg latte
                      </div>
                      <p className="text-xs leading-relaxed text-amber-200/50">{chain.verdict}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </section>

      <section id="leaderboard" className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-amber-50">City Rankings</h2>
              <p className="mt-1 text-sm text-amber-200/50">
                Tap a city to see its Best 25, Worst 25, chain report card, and bridge drinks
              </p>
            </div>
            <div className="flex gap-2">
              {(["all", "A", "B", "C"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    filter === f
                      ? "border border-amber-500/30 bg-amber-500/20 text-amber-400"
                      : "border border-white/10 text-amber-200/50"
                  }`}
                >
                  {f === "all" ? "All" : `${f}-Grade`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className="py-16 text-center text-amber-200/40">No cities match this filter.</div>
          )}
        </div>
      </section>

      {showMethodology && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowMethodology(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-linear-to-br from-[#1a1208]/95 to-[#0f0d08]/95 p-8 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 text-2xl text-amber-200/50"
            >
              ×
            </button>
            <h2 className="mb-4 text-2xl font-bold text-amber-50">Scoring Methodology</h2>
            <p className="mb-6 text-sm leading-relaxed text-amber-200/60">
              Every shop is scored across 7 dimensions totaling 100 points. Scores are assigned by
              trained evaluators using blind tastings, published sourcing data, price audits, and
              on-site experience assessments. No shop pays for placement. No chain is exempt.
            </p>

            <h3 className="mb-3 text-lg font-semibold text-amber-50">The 7 Dimensions</h3>
            <div className="mb-6 space-y-3">
              {SCORING_DIMENSIONS.map((dim) => (
                <div key={dim.key} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <span className="text-xl">{dim.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-50">{dim.label}</span>
                      <span className="font-mono text-xs text-amber-400">{dim.max} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mb-3 text-lg font-semibold text-amber-50">Grade Scale</h3>
            <div className="space-y-2">
              {GRADE_SCALE.map((g) => (
                <div key={g.grade} className="flex items-center gap-3 rounded-lg bg-white/5 p-2">
                  <span className={`w-8 text-sm font-bold ${getGradeColor(g.grade as Grade)}`}>
                    {g.grade}
                  </span>
                  <span className="w-16 font-mono text-xs text-amber-200/40">{g.range}</span>
                  <span className="text-xs text-amber-200/60">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <GlassCard hover={false} className="inline-block p-8">
            <p className="mb-4 text-amber-200/60">
              This is one module of the BrewSoul Coffee Intelligence Engine.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/brewsoul/home"
                className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400"
              >
                <BackIcon aria-hidden="true" /> BrewSoul Home
              </Link>
              <Link
                href="/brewsoul/browse"
                className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400"
              >
                Browse Catalog
              </Link>
              <Link
                href="/brewsoul"
                className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400"
              >
                Take the Quiz
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
