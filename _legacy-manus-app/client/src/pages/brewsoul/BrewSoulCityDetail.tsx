/**
 * BrewSoul City Intelligence — City Detail Page
 * Best 25 / Worst 25 / Chain Report Card / Bridge Drinks / Non-Coffee
 */
import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "wouter";
import {
  getCityBySlug,
  SCORING_DIMENSIONS,
  getGradeColor,
  getGradeBg,
  type CoffeeShop,
  type Grade,
} from "@/data/cityData";

/* ── Particles ───────────────────────────────────────────────────────── */
function DetailParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        dur: 10 + Math.random() * 10,
        delay: Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.3,
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
            animation: `detailFloat ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes detailFloat {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-30px) translateX(15px); }
        }
      `}</style>
    </div>
  );
}

/* ── Glass Card ──────────────────────────────────────────────────────── */
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-2xl" />
      {children}
    </div>
  );
}

/* ── Grade Badge ─────────────────────────────────────────────────────── */
function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-12 h-12 text-lg", lg: "w-20 h-20 text-3xl" };
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl border font-bold flex items-center justify-center ${getGradeBg(grade)} ${getGradeColor(grade)} backdrop-blur-sm`}
    >
      {grade}
    </div>
  );
}

/* ── Score Bar ───────────────────────────────────────────────────────── */
function ScoreBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = (value / max) * 100;
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-amber-200/40 w-20 text-right truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-amber-200/60 font-mono w-10 text-right">
        {value}/{max}
      </span>
    </div>
  );
}

/* ── Shop Row (Expandable) ───────────────────────────────────────────── */
function ShopRow({ shop, isBest }: { shop: CoffeeShop; isBest: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
      >
        <span className="text-xs font-mono text-amber-500/60 w-6 text-center">
          {shop.rankInCity}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-50 text-sm truncate">{shop.name}</span>
            {shop.isChain && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                CHAIN
              </span>
            )}
            {shop.roastsOwn && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ROASTS OWN
              </span>
            )}
          </div>
          <span className="text-xs text-amber-200/40">{shop.neighborhood}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-lg font-bold ${isBest ? "text-emerald-400" : "text-red-400"}`}>
            {shop.scores.total}
          </span>
          <GradeBadge grade={shop.scores.grade} size="sm" />
          <span className="text-amber-200/40 text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-amber-200/60 leading-relaxed italic">{shop.blurb}</p>

          {/* Score breakdown */}
          <div className="space-y-1.5">
            {SCORING_DIMENSIONS.map((dim) => (
              <ScoreBar
                key={dim.key}
                value={shop.scores[dim.key as keyof typeof shop.scores] as number}
                max={dim.max}
                label={dim.label}
              />
            ))}
          </div>

          {/* Order / Skip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Order This</div>
              <div className="text-sm text-amber-50">{shop.orderThis}</div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Skip This</div>
              <div className="text-sm text-amber-50">{shop.skipThis}</div>
            </div>
          </div>

          {/* Crime & Redemption for worst list */}
          {!isBest && shop.crime && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">The Crime</div>
                <div className="text-sm text-amber-200/60">{shop.crime}</div>
              </div>
              {shop.redemptionPath && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Redemption Path</div>
                  <div className="text-sm text-amber-200/60">{shop.redemptionPath}</div>
                </div>
              )}
              {shop.insteadGoTo && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Instead, Go To</div>
                  <div className="text-sm text-amber-50 font-medium">{shop.insteadGoTo}</div>
                </div>
              )}
            </div>
          )}

          {/* Bridge drink */}
          {shop.bridgeDrink && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Bridge Drink</div>
              <div className="text-sm text-amber-50">{shop.bridgeDrink}</div>
            </div>
          )}

          {/* Tags */}
          {shop.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {shop.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className="flex gap-3 text-xs text-amber-200/40">
            <span>Latte: ${shop.pricing.avgLatte.toFixed(2)}</span>
            {shop.pricing.avgPourover && <span>Pour-over: ${shop.pricing.avgPourover.toFixed(2)}</span>}
            {shop.pricing.avgDrip && <span>Drip: ${shop.pricing.avgDrip.toFixed(2)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function BrewSoulCityDetail() {
  const params = useParams<{ slug: string }>();
  const city = getCityBySlug(params.slug || "");
  const [tab, setTab] = useState<"best" | "worst" | "chains" | "bridge" | "noncoffee">("best");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (!city) {
    return (
      <div className="min-h-screen bg-[#0a0806] flex items-center justify-center text-amber-200/60">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-50 mb-2">City Not Found</h1>
          <Link href="/brewsoul/cities">
            <span className="text-amber-400 hover:underline cursor-pointer">← Back to Cities</span>
          </Link>
        </div>
      </div>
    );
  }

  const hasFullData = city.bestShops.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1208] via-[#0f0d08] to-[#0a0806] text-amber-50 overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${city.heroImage})`,
            transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent" />
        <DetailParticles />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-8">
          <Link href="/brewsoul/cities">
            <span className="inline-block mb-4 text-sm text-amber-400/60 hover:text-amber-400 cursor-pointer transition-colors">
              ← All Cities
            </span>
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  #{city.rank} in America
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-amber-50 mb-1">
                {city.name}
                <span className="text-amber-200/30 ml-2 text-2xl">{city.state}</span>
              </h1>
              <p className="text-lg text-amber-200/60 italic">"{city.tagline}"</p>
            </div>
            <GradeBadge grade={city.grade} size="lg" />
          </div>
        </div>
      </section>

      {/* ── CITY STATS ────────────────────────────────────────────── */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-amber-400">{city.stats.totalSpecialtyShops}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Specialty Shops</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-emerald-400">{city.stats.bestScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Best Score</div>
            <div className="text-[9px] text-amber-200/30 truncate">{city.stats.bestShop}</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-red-400">{city.stats.worstScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Worst Score</div>
            <div className="text-[9px] text-amber-200/30 truncate">{city.stats.worstShop}</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-amber-400">${city.stats.avgLattePrice.toFixed(2)}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Avg Latte</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-amber-400">{city.stats.roastersPer100k}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Roasters / 100k</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl font-bold text-amber-400">{city.score}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">City Score</div>
          </div>
        </div>
      </section>

      {/* ── VERDICT ───────────────────────────────────────────────── */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-6">
            <p className="text-lg text-amber-200/70 leading-relaxed italic text-center">
              "{city.verdict}"
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ── TABS ──────────────────────────────────────────────────── */}
      {hasFullData ? (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Tab bar */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { key: "best" as const, label: `Best ${city.bestShops.length}`, icon: "🏆" },
                { key: "worst" as const, label: `Worst ${city.worstShops.length}`, icon: "💀" },
                { key: "chains" as const, label: "Chain Report", icon: "🏪" },
                { key: "bridge" as const, label: "Bridge Drinks", icon: "🌉" },
                { key: "noncoffee" as const, label: "Not Coffee?", icon: "🍵" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    tab === t.key
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                      : "text-amber-200/50 border border-white/10 hover:border-amber-500/20"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "best" && (
              <GlassCard className="overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-amber-50">
                    Best {city.bestShops.length} Coffee Shops in {city.name}
                  </h2>
                  <p className="text-sm text-amber-200/50 mt-1">
                    Ranked by composite score across 7 dimensions. Tap any shop for full breakdown.
                  </p>
                </div>
                <div>
                  {city.bestShops.map((shop) => (
                    <ShopRow key={shop.id} shop={shop} isBest={true} />
                  ))}
                </div>
              </GlassCard>
            )}

            {tab === "worst" && (
              <GlassCard className="overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-amber-50">
                    Worst {city.worstShops.length} Coffee Shops in {city.name}
                  </h2>
                  <p className="text-sm text-amber-200/50 mt-1">
                    Every shop on this list has a redemption path. We're not here to destroy — we're here to demand better.
                  </p>
                </div>
                <div>
                  {city.worstShops.map((shop) => (
                    <ShopRow key={shop.id} shop={shop} isBest={false} />
                  ))}
                </div>
              </GlassCard>
            )}

            {tab === "chains" && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-amber-50 mb-2">
                  Chain Report Card — {city.name}
                </h2>
                <p className="text-sm text-amber-200/50 mb-6">
                  How the chains perform in this specific market.
                </p>
                {city.chainScores.length > 0 ? (
                  <div className="space-y-3">
                    {city.chainScores.map((chain) => (
                      <div
                        key={chain.chainName}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-amber-50">{chain.chainName}</span>
                            <span className="text-xs text-amber-200/40 ml-2">
                              {chain.locationsInMetro} locations
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-amber-200/50">
                              ${chain.avgLatte.toFixed(2)}
                            </span>
                            <span className={`text-lg font-bold ${getGradeColor(chain.grade)}`}>
                              {chain.grade}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-amber-200/50 leading-relaxed">{chain.verdict}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-200/40 text-center py-8">Chain data coming soon.</p>
                )}
              </GlassCard>
            )}

            {tab === "bridge" && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-amber-50 mb-2">
                  Bridge Drinks — {city.name}
                </h2>
                <p className="text-sm text-amber-200/50 mb-6">
                  Think you don't like coffee? These drinks will change your mind.
                  Matched to your specific objection.
                </p>
                {city.bridgeDrinks.length > 0 ? (
                  <div className="space-y-3">
                    {city.bridgeDrinks.map((bd, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-amber-400 font-semibold text-sm mb-1">
                          "{bd.persona}"
                        </div>
                        <div className="text-amber-50 font-medium">{bd.drink}</div>
                        <div className="text-xs text-amber-200/40 mt-1">
                          at {bd.shop} · {bd.neighborhood}
                        </div>
                        <div className="text-sm text-amber-200/60 mt-2 italic">
                          Tastes like: {bd.tastesLike}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-200/40 text-center py-8">Bridge drink data coming soon.</p>
                )}
              </GlassCard>
            )}

            {tab === "noncoffee" && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-amber-50 mb-2">
                  Not a Coffee Person? — {city.name}
                </h2>
                <p className="text-sm text-amber-200/50 mb-6">
                  The best tea, matcha, chai, and hot chocolate spots in {city.name}.
                  Because great taste doesn't require caffeine.
                </p>
                {city.nonCoffeeSpots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {city.nonCoffeeSpots.map((spot, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-amber-50 text-sm">{spot.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                            {spot.category}
                          </span>
                        </div>
                        <div className="text-xs text-amber-200/40 mb-2">
                          {spot.neighborhood} · {spot.priceRange}
                        </div>
                        <p className="text-sm text-amber-200/60 leading-relaxed">{spot.why}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-200/40 text-center py-8">Non-coffee data coming soon.</p>
                )}
              </GlassCard>
            )}
          </div>
        </section>
      ) : (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <GlassCard className="p-12 text-center">
              <h2 className="text-2xl font-bold text-amber-50 mb-4">
                Full Data Coming Soon
              </h2>
              <p className="text-amber-200/60 max-w-lg mx-auto mb-6">
                {city.name} is on our scoring schedule. City stats and metadata are live.
                Best 25, Worst 25, chain report cards, and bridge drinks are being compiled.
              </p>
              <Link href="/brewsoul/cities">
                <span className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold cursor-pointer hover:from-amber-500 hover:to-amber-400 transition-all">
                  ← Back to All Cities
                </span>
              </Link>
            </GlassCard>
          </div>
        </section>
      )}

      {/* ── FOOTER NAV ────────────────────────────────────────────── */}
      <section className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center">
          <Link href="/brewsoul/cities">
            <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
              ← All Cities
            </span>
          </Link>
          <Link href="/brewsoul/browse">
            <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
              Browse Catalog
            </span>
          </Link>
          <Link href="/brewsoul/home">
            <span className="px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all cursor-pointer">
              BrewSoul Home
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
