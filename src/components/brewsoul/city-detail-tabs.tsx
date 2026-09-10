"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  CupSoda,
  Skull,
  Trophy,
  type LucideIcon,
  Waypoints,
} from "lucide-react";
import {
  SCORING_DIMENSIONS,
  getGradeColor,
  getGradeBg,
  type CityData,
  type CoffeeShop,
  type Grade,
} from "@/lib/content/brewsoul-cities";

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/15 bg-linear-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </div>
  );
}

function GradeBadge({ grade, size = "md" }: { grade: Grade; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "size-8 text-xs", md: "size-12 text-lg", lg: "size-20 text-3xl" };
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-xl border font-bold backdrop-blur-sm ${getGradeBg(grade)} ${getGradeColor(grade)}`}
    >
      {grade}
    </div>
  );
}

function ScoreBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = (value / max) * 100;
  const colorClass =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-amber-500"
        : pct >= 40
          ? "bg-orange-500"
          : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 truncate text-right text-[10px] text-amber-200/40">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs text-amber-200/60">
        {value}/{max}
      </span>
    </div>
  );
}

function ShopRow({ shop, isBest }: { shop: CoffeeShop; isBest: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5"
      >
        <span className="w-6 text-center font-mono text-xs text-amber-500/60">
          {shop.rankInCity}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-amber-50">{shop.name}</span>
            {shop.isChain && (
              <span className="rounded border border-red-500/30 bg-red-500/20 px-1.5 py-0.5 text-[9px] text-red-400">
                Chain
              </span>
            )}
            {shop.roastsOwn && (
              <span className="rounded border border-emerald-500/30 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-400">
                Roasts Own
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
          {expanded ? (
            <ChevronUp aria-hidden="true" className="size-4 text-amber-200/40" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-4 text-amber-200/40" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 px-4 pb-4">
          <p className="text-sm leading-relaxed text-amber-200/60 italic">{shop.blurb}</p>

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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
              <div className="mb-1 text-[10px] tracking-wider text-emerald-400 uppercase">
                Order This
              </div>
              <div className="text-sm text-amber-50">{shop.orderThis}</div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <div className="mb-1 text-[10px] tracking-wider text-red-400 uppercase">
                Skip This
              </div>
              <div className="text-sm text-amber-50">{shop.skipThis}</div>
            </div>
          </div>

          {!isBest && shop.crime && (
            <div className="space-y-2">
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <div className="mb-1 text-[10px] tracking-wider text-red-400 uppercase">
                  The Crime
                </div>
                <div className="text-sm text-amber-200/60">{shop.crime}</div>
              </div>
              {shop.redemptionPath && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <div className="mb-1 text-[10px] tracking-wider text-amber-400 uppercase">
                    Redemption Path
                  </div>
                  <div className="text-sm text-amber-200/60">{shop.redemptionPath}</div>
                </div>
              )}
              {shop.insteadGoTo && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <div className="mb-1 text-[10px] tracking-wider text-emerald-400 uppercase">
                    Instead, Go To
                  </div>
                  <div className="text-sm font-medium text-amber-50">{shop.insteadGoTo}</div>
                </div>
              )}
            </div>
          )}

          {shop.bridgeDrink && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <div className="mb-1 text-[10px] tracking-wider text-amber-400 uppercase">
                Bridge Drink
              </div>
              <div className="text-sm text-amber-50">{shop.bridgeDrink}</div>
            </div>
          )}

          {shop.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {shop.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-amber-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 text-xs text-amber-200/40">
            <span>Latte: ${shop.pricing.avgLatte.toFixed(2)}</span>
            {shop.pricing.avgPourover && (
              <span>Pour-over: ${shop.pricing.avgPourover.toFixed(2)}</span>
            )}
            {shop.pricing.avgDrip && <span>Drip: ${shop.pricing.avgDrip.toFixed(2)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulCityDetail.tsx —
// real tab switching (Best/Worst/Chains/Bridge/Non-Coffee) and
// per-shop click-to-expand breakdown, extracted into this client island.
// Legacy's own real "coming soon" fallback (per-tab and whole-page) for
// cities without full shop-level data is preserved exactly — see
// `lib/content/brewsoul-cities.ts`'s port note.
export function CityDetailTabs({ city }: { city: CityData }) {
  const [tab, setTab] = useState<"best" | "worst" | "chains" | "bridge" | "noncoffee">("best");

  const tabs: { key: typeof tab; label: string; icon: LucideIcon }[] = [
    { key: "best", label: `Best ${city.bestShops.length}`, icon: Trophy },
    { key: "worst", label: `Worst ${city.worstShops.length}`, icon: Skull },
    { key: "chains", label: "Chain Report", icon: Building2 },
    { key: "bridge", label: "Bridge Drinks", icon: Waypoints },
    { key: "noncoffee", label: "Not Coffee?", icon: CupSoda },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap ${
                tab === t.key
                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "border border-white/10 text-amber-200/50"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "best" && (
        <GlassCard className="overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <h2 className="text-xl font-bold text-amber-50">
              Best {city.bestShops.length} Coffee Shops in {city.name}
            </h2>
            <p className="mt-1 text-sm text-amber-200/50">
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
          <div className="border-b border-white/10 p-4">
            <h2 className="text-xl font-bold text-amber-50">
              Worst {city.worstShops.length} Coffee Shops in {city.name}
            </h2>
            <p className="mt-1 text-sm text-amber-200/50">
              Every shop on this list has a redemption path. We&apos;re not here to destroy —
              we&apos;re here to demand better.
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
          <h2 className="mb-2 text-xl font-bold text-amber-50">Chain Report Card — {city.name}</h2>
          <p className="mb-6 text-sm text-amber-200/50">
            How the chains perform in this specific market.
          </p>
          {city.chainScores.length > 0 ? (
            <div className="space-y-3">
              {city.chainScores.map((chain) => (
                <div
                  key={chain.chainName}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-amber-50">{chain.chainName}</span>
                      <span className="ml-2 text-xs text-amber-200/40">
                        {chain.locationsInMetro} locations
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-amber-200/50">
                        ${chain.avgLatte.toFixed(2)}
                      </span>
                      <span className={`text-lg font-bold ${getGradeColor(chain.grade)}`}>
                        {chain.grade}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-amber-200/50">{chain.verdict}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-amber-200/40">Chain data coming soon.</p>
          )}
        </GlassCard>
      )}

      {tab === "bridge" && (
        <GlassCard className="p-6">
          <h2 className="mb-2 text-xl font-bold text-amber-50">Bridge Drinks — {city.name}</h2>
          <p className="mb-6 text-sm text-amber-200/50">
            Think you don&apos;t like coffee? These drinks will change your mind. Matched to your
            specific objection.
          </p>
          {city.bridgeDrinks.length > 0 ? (
            <div className="space-y-3">
              {city.bridgeDrinks.map((bd) => (
                <div key={bd.persona} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-1 text-sm font-semibold text-amber-400">
                    &ldquo;{bd.persona}&rdquo;
                  </div>
                  <div className="font-medium text-amber-50">{bd.drink}</div>
                  <div className="mt-1 text-xs text-amber-200/40">
                    at {bd.shop} · {bd.neighborhood}
                  </div>
                  <div className="mt-2 text-sm text-amber-200/60 italic">
                    Tastes like: {bd.tastesLike}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-amber-200/40">Bridge drink data coming soon.</p>
          )}
        </GlassCard>
      )}

      {tab === "noncoffee" && (
        <GlassCard className="p-6">
          <h2 className="mb-2 text-xl font-bold text-amber-50">
            Not a Coffee Person? — {city.name}
          </h2>
          <p className="mb-6 text-sm text-amber-200/50">
            The best tea, matcha, chai, and hot chocolate spots in {city.name}. Because great taste
            doesn&apos;t require caffeine.
          </p>
          {city.nonCoffeeSpots.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {city.nonCoffeeSpots.map((spot) => (
                <div key={spot.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-amber-50">{spot.name}</span>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 uppercase">
                      {spot.category}
                    </span>
                  </div>
                  <div className="mb-2 text-xs text-amber-200/40">
                    {spot.neighborhood} · {spot.priceRange}
                  </div>
                  <p className="text-sm leading-relaxed text-amber-200/60">{spot.why}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-amber-200/40">Non-coffee data coming soon.</p>
          )}
        </GlassCard>
      )}
    </div>
  );
}

export { GlassCard, GradeBadge };
