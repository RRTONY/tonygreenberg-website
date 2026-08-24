/**
 * BrewSoul City Intelligence — Cities Index
 * Glass-morphism leaderboard of 25 US coffee markets
 */
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import {
  CITIES,
  NATIONAL_STATS,
  SCORING_DIMENSIONS,
  GRADE_SCALE,
  UNIVERSAL_CHAINS,
  NUANCED_CHAINS,
  getGradeColor,
  getGradeBg,
  type CityData,
  type Grade,
} from "@/data/cityData";

/* ── Floating Particles ─────────────────────────────────────────────── */
function CityParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 8 + Math.random() * 12,
        delay: Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  );
  return (
<div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,185,106,${p.opacity}), transparent)`,
            animation: `cityFloat ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes cityFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

/* ── Glass Card ──────────────────────────────────────────────────────── */
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
      className={`
        relative rounded-2xl border border-white/15
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl shadow-lg
        ${hover ? "transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-500/10 hover:shadow-xl hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-2xl" />
      {children}
    </div>
  );
}

/* ── Grade Badge ─────────────────────────────────────────────────────── */
function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };
  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-xl border font-bold
        flex items-center justify-center
        ${getGradeBg(grade)} ${getGradeColor(grade)}
        backdrop-blur-sm
      `}
    >
      {grade}
    </div>
  );
}

/* ── City Card ───────────────────────────────────────────────────────── */
function CityCard({ city }: { city: CityData }) {
  const hasData = city.bestShops.length > 0;
  return (
    <Link href={hasData ? `/brewsoul/cities/${city.slug}` : "#"}>
      <GlassCard className={`p-5 cursor-pointer group ${!hasData ? "opacity-70" : ""}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">
              #{city.rank}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-amber-50 group-hover:text-amber-300 transition-colors">
                {city.name}
              </h3>
              <span className="text-xs text-amber-200/50 tracking-wider uppercase">{city.state}</span>
            </div>
          </div>
          <GradeBadge grade={city.grade} />
        </div>

        <p className="text-sm text-amber-200/60 italic mb-3 leading-relaxed">"{city.tagline}"</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-amber-400 font-bold text-sm">{city.stats.totalSpecialtyShops}</div>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider">Shops</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-amber-400 font-bold text-sm">${city.stats.avgLattePrice.toFixed(2)}</div>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider">Avg Latte</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-emerald-400 font-bold text-sm">{city.stats.bestScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider">Best</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-red-400 font-bold text-sm">{city.stats.worstScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase tracking-wider">Worst</div>
          </div>
        </div>

        <p className="text-xs text-amber-200/50 leading-relaxed">{city.verdict}</p>

        {hasData && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-amber-500/60 uppercase tracking-wider">
              {city.bestShops.length} best · {city.worstShops.length} worst scored
            </span>
            <span className="text-amber-400 text-xs group-hover:translate-x-1 transition-transform">→</span>
          </div>
        )}
        {!hasData && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <span className="text-[10px] text-amber-500/40 uppercase tracking-wider">Full data coming soon</span>
          </div>
        )}
      </GlassCard>
    </Link>
  );
}

/* ── Stat Pill ───────────────────────────────────────────────────────── */
function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="text-2xl font-bold text-amber-400">{value}</div>
      <div className="text-xs text-amber-200/50 uppercase tracking-wider mt-1">{label}</div>
      {sub && <div className="text-[10px] text-amber-200/30 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function BrewSoulCities() {
  const [filter, setFilter] = useState<"all" | "A" | "B" | "C">("all");
  const [showMethodology, setShowMethodology] = useState(false);
  const [showChains, setShowChains] = useState(false);

  const filteredCities = useMemo(() => {
    if (filter === "all") return CITIES;
    return CITIES.filter((c) => c.grade.startsWith(filter));
  }, [filter]);

  // Parallax
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1208] via-[#0f0d08] to-[#0a0806] text-amber-50 overflow-x-hidden">
      <SEO
        title="Coffee Cities — BrewSoul"
        description="The world's best cities for specialty coffee, ranked and reviewed."
        path="/brewsoul/cities"
        keywords="Tony Greenberg, coffee cities, specialty coffee cities, best coffee cities"
        indexable={true}
      />
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920)`,
            transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/70 via-[#0f0d08]/80 to-[#0a0806]" />
        <CityParticles />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
            <span className="text-xs tracking-[0.3em] uppercase text-amber-400/80 font-mono">
              City Intelligence Module
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-amber-50">The Best & Worst Coffee</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              in 25 American Cities
            </span>
          </h1>
          <p className="text-lg text-amber-200/60 max-w-2xl mx-auto mb-6 leading-relaxed">
            Nobody has done this. 1,250 shops scored across 7 dimensions.
            Best 25 and Worst 25 per city. Chain report cards. Bridge drinks
            for non-coffee people. Every claim backed by data.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              See the Rankings
            </button>
            <button
              onClick={() => setShowMethodology(true)}
              className="px-6 py-3 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all backdrop-blur-sm"
            >
              Our Methodology
            </button>
          </div>
        </div>
      </section>

      {/* ── NATIONAL STATS ────────────────────────────────────────── */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatPill label="Cities Scored" value={NATIONAL_STATS.totalCities} />
            <StatPill label="Shops Scored" value={NATIONAL_STATS.totalShopsScored.toLocaleString()} />
            <StatPill label="Avg US Latte" value={`$${NATIONAL_STATS.avgNationalLattePrice}`} />
            <StatPill label="Best Score" value={NATIONAL_STATS.bestScoreNational} sub={NATIONAL_STATS.bestShopNational} />
            <StatPill label="Worst Score" value={NATIONAL_STATS.worstScoreNational} sub={NATIONAL_STATS.worstShopNational} />
            <StatPill label="#1 City" value="PDX" sub={`${NATIONAL_STATS.topCityScore}/100`} />
          </div>
        </div>
      </section>

      {/* ── CHAIN REPORT CARD TEASER ──────────────────────────────── */}
      <section className="relative py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <GlassCard hover={false} className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-50">National Chain Report Card</h2>
                <p className="text-sm text-amber-200/50 mt-1">
                  How the big chains score against our 7-dimension framework
                </p>
              </div>
              <button
                onClick={() => setShowChains(!showChains)}
                className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all"
              >
                {showChains ? "Hide" : "Show All"}
              </button>
            </div>

            {/* Always show top offenders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {UNIVERSAL_CHAINS.slice(0, 4).map((chain) => (
                <div
                  key={chain.chainName}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-amber-50 text-sm">{chain.chainName}</span>
                    <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>{chain.grade}</span>
                  </div>
                  <div className="text-xs text-amber-200/40 mb-2">${chain.avgLatte.toFixed(2)} avg latte</div>
                  <p className="text-xs text-amber-200/50 leading-relaxed">{chain.verdict}</p>
                </div>
              ))}
            </div>

            {showChains && (
              <>
                <h3 className="text-lg font-semibold text-amber-50 mt-6 mb-3">The Rest of the Commodity Chains</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {UNIVERSAL_CHAINS.slice(4).map((chain) => (
                    <div key={chain.chainName} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-amber-50 text-sm">{chain.chainName}</span>
                        <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>{chain.grade}</span>
                      </div>
                      <div className="text-xs text-amber-200/40 mb-2">${chain.avgLatte.toFixed(2)} avg latte</div>
                      <p className="text-xs text-amber-200/50 leading-relaxed">{chain.verdict}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-amber-50 mt-6 mb-3">The Nuanced Chains — Grade Each Location</h3>
                <p className="text-sm text-amber-200/50 mb-4">
                  These chains have real quality in their DNA but have scaled unevenly. Some locations are genuinely great; others coast on the brand.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NUANCED_CHAINS.map((chain) => (
                    <div key={chain.chainName} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-amber-50 text-sm">{chain.chainName}</span>
                        <span className={`text-sm font-bold ${getGradeColor(chain.grade)}`}>{chain.grade}</span>
                      </div>
                      <div className="text-xs text-amber-200/40 mb-2">${chain.avgLatte.toFixed(2)} avg latte</div>
                      <p className="text-xs text-amber-200/50 leading-relaxed">{chain.verdict}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </section>

      {/* ── CITY LEADERBOARD ──────────────────────────────────────── */}
      <section id="leaderboard" className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-amber-50">City Rankings</h2>
              <p className="text-sm text-amber-200/50 mt-1">
                Tap a city to see its Best 25, Worst 25, chain report card, and bridge drinks
              </p>
            </div>
            <div className="flex gap-2">
              {(["all", "A", "B", "C"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-amber-200/50 border border-white/10 hover:border-amber-500/20"
                  }`}
                >
                  {f === "all" ? "All" : `${f}-Grade`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-16 text-amber-200/40">
              No cities match this filter.
            </div>
          )}
        </div>
      </section>

      {/* ── SCORING METHODOLOGY MODAL ─────────────────────────────── */}
      {showMethodology && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowMethodology(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl border border-white/15 bg-gradient-to-br from-[#1a1208]/95 to-[#0f0d08]/95 backdrop-blur-xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 text-amber-200/50 hover:text-amber-400 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-amber-50 mb-4">Scoring Methodology</h2>
            <p className="text-sm text-amber-200/60 mb-6 leading-relaxed">
              Every shop is scored across 7 dimensions totaling 100 points. Scores are assigned by
              trained evaluators using blind tastings, published sourcing data, price audits, and
              on-site experience assessments. No shop pays for placement. No chain is exempt.
            </p>

            <h3 className="text-lg font-semibold text-amber-50 mb-3">The 7 Dimensions</h3>
            <div className="space-y-3 mb-6">
              {SCORING_DIMENSIONS.map((dim) => (
                <div key={dim.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-xl">{dim.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-50">{dim.label}</span>
                      <span className="text-xs text-amber-400 font-mono">{dim.max} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-amber-50 mb-3">Grade Scale</h3>
            <div className="space-y-2">
              {GRADE_SCALE.map((g) => (
                <div key={g.grade} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <span className={`font-bold text-sm w-8 ${getGradeColor(g.grade as Grade)}`}>{g.grade}</span>
                  <span className="text-xs text-amber-200/40 font-mono w-16">{g.range}</span>
                  <span className="text-xs text-amber-200/60">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BACK TO BREWSOUL ──────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <GlassCard hover={false} className="p-8 inline-block">
            <p className="text-amber-200/60 mb-4">
              This is one module of the BrewSoul Coffee Intelligence Engine.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/brewsoul/home">
                <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
                  ← BrewSoul Home
                </span>
              </Link>
              <Link href="/brewsoul/browse">
                <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
                  Browse Catalog
                </span>
              </Link>
              <Link href="/brewsoul">
                <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
                  Take the Quiz
                </span>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
