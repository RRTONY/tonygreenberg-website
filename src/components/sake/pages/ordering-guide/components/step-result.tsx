"use client";

import Link from "next/link";
import { ArrowRight, Bell, DollarSign, RotateCcw, ShoppingCart, Star, Zap } from "lucide-react";
import { tierClasses } from "@/components/sake/carbon-tier-classes";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";
import { orderingGuideData as copy } from "../data/ordering-guide.data";
import type { StepProps } from "../ordering-guide";

// Step 3 of the Ordering Guide: the carbon-consciousness meter, American-brewed picks (when the
// answers lean low-carbon), the four Japanese picks with View & Buy / Find Retailer / Dollar Map,
// and the closing links. The meter's marker sits at the answer's position (the app slid it there
// from the middle after half a second; a CSS transition can't start from a value it never had, so
// it now simply appears there). The marker's -8px nudge is -ml-2.
export function StepResult({ guide, tone, t }: StepProps) {
  const recs = guide.recommendations;
  if (!recs) return null;
  const marker = (1 - recs.avgCarbonWeight) * 100;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-xl sm:text-2xl ${tone.textMain}`}>
          {t(...copy.result.title)}
        </h3>
        <button
          type="button"
          onClick={guide.reset}
          className={`flex items-center gap-1 text-xs ${tone.textMuted} ${tone.goldHover} transition-colors`}
        >
          <RotateCcw aria-hidden="true" size={12} />
          {t(...copy.result.startOver)}
        </button>
      </div>

      {/* Carbon Consciousness Meter */}
      <div className={`p-4 border ${tone.cardBorder} ${tone.optionBg} mb-6`}>
        <div className={`text-[10px] tracking-[0.15em] uppercase mb-2 ${tone.textMuted}`}>{t(...copy.result.consciousness)}</div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-linear-to-r from-green-500 via-yellow-500 to-red-500 relative">
            <div
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 -ml-2 size-4 rounded-full bg-white border-2 border-black shadow-lg"
              style={{ left: `${marker}%` }}
            />
          </div>
          <span className={`text-sm font-mono ${tone.textMain}`}>
            {recs.avgCarbonWeight > 0.7
              ? t(...copy.result.ecoWarrior)
              : recs.avgCarbonWeight > 0.4
                ? t(...copy.result.conscious)
                : t(...copy.result.experienceFirst)}
          </span>
        </div>
      </div>

      {/* US Breweries (if carbon-conscious) */}
      {recs.avgCarbonWeight > 0.5 && recs.usTop.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap aria-hidden="true" size={14} className="text-green-500" />
            <span className={`text-xs tracking-[0.15em] uppercase ${tone.textMuted}`}>{t(...copy.result.usHeading)}</span>
          </div>
          {recs.usTop.map(({ brewery }) => (
            <div key={brewery.id} className={`p-4 border ${tone.cardBorder} ${tone.optionBg} mb-2`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className={`text-base font-bold ${tone.textMain}`}>{brewery.name}</div>
                  <div className={`text-xs ${tone.textMuted}`}>
                    {brewery.city}, {brewery.state}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-500 font-bold font-mono">{brewery.carbonKgPerBottle} kg CO₂</div>
                  <div className={`text-[10px] ${tone.textMuted}`}>{brewery.priceRange}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Japanese Sake Recommendations */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star aria-hidden="true" size={14} className={tone.gold} />
          <span className={`text-xs tracking-[0.15em] uppercase ${tone.textMuted}`}>{t(...copy.result.japanHeading)}</span>
        </div>
        {recs.japanTop.map(({ profile, chain, carbonTier }, i) => (
          <div
            key={profile.sakeId}
            style={{ animationDelay: `${i * 0.1}s` }}
            className={`p-4 border ${tone.cardBorder} ${tone.optionBg} mb-2 animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-45">
                <div className={`font-sk-display font-bold [.sake-austere_&]:font-light text-base ${tone.textMain}`}>
                  {t(profile.name, profile.nameJa)}
                </div>
                <div className={`text-xs ${tone.textMuted}`}>
                  {profile.brewery} · {profile.prefecture}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold font-mono ${tierClasses(carbonTier.color).text}`}>{chain.totalCarbonKg} kg</div>
                <div className={`text-[10px] ${tone.textMuted}`}>CO₂</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold font-mono ${tone.textMain}`}>${chain.totalRetailPrice}</div>
                <div className={`text-[10px] ${tone.textMuted}`}>{t(...copy.result.retail)}</div>
              </div>
              <div className="text-center">
                <div className={profile.integrityScore >= 80 ? "text-sm font-bold font-mono text-[#22c55e]" : "text-sm font-bold font-mono text-[#eab308]"}>
                  {profile.integrityScore}
                </div>
                <div className={`text-[10px] ${tone.textMuted}`}>{t(...copy.result.integrity)}</div>
              </div>
            </div>
            <p className={`mt-2 text-xs italic ${tone.textMuted}`}>{t(profile.integrityNotes, profile.integrityNotesJa || profile.integrityNotes)}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link
                href={sakeDetailPath(profile.sakeId)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs tracking-widest uppercase font-bold bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)] transition-all duration-300 hover:opacity-90 min-h-10 rounded"
              >
                <ShoppingCart aria-hidden="true" size={12} />
                {t(...copy.result.viewAndBuy)}
              </Link>
              <Link
                href={sk(`/retailer-finder?sake=${encodeURIComponent(profile.name)}`)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs tracking-widest uppercase border ${tone.goldBorder} ${tone.gold} transition-all duration-300 hover:opacity-80 min-h-10 rounded`}
              >
                {t(...copy.result.findRetailer)}
              </Link>
              <Link
                href={sk(`/supply-chain?sake=${encodeURIComponent(profile.sakeId)}`)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase border ${tone.cardBorder} ${tone.textMuted} transition-all duration-300 hover:opacity-80`}
              >
                <DollarSign aria-hidden="true" size={10} />
                {t(...copy.result.dollarMap)}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href={sk("/retailer-finder")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.12em] uppercase border ${tone.goldBorder} ${tone.goldBg} ${tone.gold} transition-all duration-300`}
        >
          <ShoppingCart aria-hidden="true" size={14} />
          {t(...copy.result.findRetailersNearYou)}
        </Link>
        <Link
          href={sk("/deal-alerts")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.12em] uppercase border ${tone.goldBorder} ${tone.gold} transition-all duration-300`}
        >
          <Bell aria-hidden="true" size={14} />
          {t(...copy.result.setDealAlerts)}
        </Link>
        <Link
          href={sk("/supply-chain")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.12em] uppercase border ${tone.cardBorder} ${tone.textMuted} transition-all duration-300`}
        >
          <DollarSign aria-hidden="true" size={14} />
          {t(...copy.result.dollarMaps)}
        </Link>
        <Link
          href={sk("/qpr")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.12em] uppercase border ${tone.cardBorder} ${tone.textMuted} transition-all duration-300`}
        >
          {t(...copy.result.qprRankings)}
          <ArrowRight aria-hidden="true" size={14} />
        </Link>
      </div>
    </div>
  );
}
