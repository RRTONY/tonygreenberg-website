"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ChevronDown, ChevronUp, DollarSign, Leaf, MapPin, Plane, Shield, Ship, Zap } from "lucide-react";
import { tierClasses } from "@/components/sake/carbon-tier-classes";
import { DollarMap } from "@/components/sake/dollar-map";
import { Reveal } from "@/components/sake/motion";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";
import {
  carbonTiers,
  generateSupplyChainMap,
  getAllSupplyChainsSortedByCarbon,
  getAllSupplyChainsSortedByIntegrity,
  getCarbonTier,
  sakeSupplyChains,
  usBreweries,
} from "@/lib/content/sake/supply-chain-engine";

// Ported from the Sake Manus app's client/src/pages/SupplyChain.tsx (2026-11-26): the Dollar Map
// explorer (Carbon Journey / Integrity Score / Dollar Map views, the American breweries, carbon
// tiers, every sake with its dollar map, and "The Juyondai Problem"). The page's own palette (#c9a227
// gold on #0a0e1a, stone and red-800 in Austere) is two literal class sets (TONES). Changed:
// - The Ordering Guide's "Dollar Map" button links here with ?sake=<id>, but the app ignored it and
//   showed a closed list; that sake now opens with its dollar map (SakeSupplyChainFromQuery).
// - Rows are buttons (keyboard access) and say if they're open; the Find Retailer button's hover
//   color was built from a class fragment that never existed, so it's a full class now.
// - The dollar map links are site links (/sake/bottle/<id>, /sake/retailer-finder).

type ViewMode = "carbon" | "integrity" | "dollar";

const TONES = {
  kintsugi: {
    gold: "text-[#c9a227]",
    goldBg: "bg-[#c9a227]/10",
    goldBorder: "border-[#c9a227]/30",
    cardBg: "bg-[#0d1321]/80",
    cardBorder: "border-[#1a2035]",
    textMain: "text-[#e8e2d6]",
    textMuted: "text-[#e8e2d6]/60",
    textMainHover: "hover:text-[#e8e2d6]",
    pageBg: "bg-[#0a0e1a]",
    ring: "ring-1 ring-[#c9a227]/30",
    integrityTab: "text-[#c9a227] border-[#c9a227] bg-[#c9a227]/8",
  },
  austere: {
    gold: "text-red-800",
    goldBg: "bg-red-800/10",
    goldBorder: "border-red-800/30",
    cardBg: "bg-stone-100",
    cardBorder: "border-stone-300",
    textMain: "text-stone-900",
    textMuted: "text-stone-600",
    textMainHover: "hover:text-stone-900",
    pageBg: "bg-stone-50",
    ring: "ring-1 ring-red-800/30",
    integrityTab: "text-[oklch(0.52_0.19_30)] border-[oklch(0.52_0.19_30)] bg-[oklch(0.52_0.19_30/0.08)]",
  },
};

const INTEGRITY_TEXT = (score: number) => (score >= 80 ? "text-[#22c55e]" : score >= 50 ? "text-[#eab308]" : "text-[#ef4444]");
const HEADING = "font-sk-display font-bold [.sake-austere_&]:font-light";

/** Reads ?sake=<id> (the Ordering Guide's Dollar Map link). Rendered inside <Suspense> by the route. */
export function SakeSupplyChainFromQuery() {
  const sake = useSearchParams().get("sake");
  const known = sake && sakeSupplyChains.some((s) => s.sakeId === sake) ? sake : null;
  return <SakeSupplyChain key={known ?? "none"} initialSake={known} />;
}

export function SakeSupplyChain({ initialSake = null }: { initialSake?: string | null }) {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const c = TONES[isAustere ? "austere" : "kintsugi"];

  const [viewMode, setViewMode] = useState<ViewMode>("carbon");
  const [selectedSake, setSelectedSake] = useState<string | null>(initialSake);

  const carbonSorted = useMemo(() => getAllSupplyChainsSortedByCarbon(), []);
  const integritySorted = useMemo(() => getAllSupplyChainsSortedByIntegrity(), []);

  const selectedMap = useMemo(() => {
    const profile = selectedSake ? sakeSupplyChains.find((s) => s.sakeId === selectedSake) : null;
    return profile ? generateSupplyChainMap(profile) : null;
  }, [selectedSake]);

  const tabs = [
    { key: "carbon" as const, icon: Leaf, en: "Carbon Journey", ja: "カーボンの旅", on: "text-[#22c55e] border-[#22c55e] bg-[#22c55e]/8" },
    { key: "integrity" as const, icon: Shield, en: "Integrity Score", ja: "誠実度スコア", on: c.integrityTab },
    { key: "dollar" as const, icon: DollarSign, en: "Dollar Map", ja: "ドルマップ", on: "text-[#3b82f6] border-[#3b82f6] bg-[#3b82f6]/8" },
  ];

  const list = viewMode === "integrity" ? integritySorted : carbonSorted;

  return (
    <div className={`min-h-screen ${c.pageBg} transition-colors duration-500`}>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${c.gold}`}>{t("Follow the Money", "金の流れを追え")}</p>
            <h1 className={`${HEADING} text-4xl sm:text-5xl lg:text-6xl leading-tight ${c.textMain}`}>
              {t("Where Every", "すべての")} <span className="gold-shimmer">{t("Dollar Goes", "ドルの行き先")}</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${c.textMuted}`}>
              {t(
                "From rice paddy to your glass — trace the supply chain, see the margins, measure the carbon. Know who's trying hard, who's trying too hard, and where the QPR actually lives.",
                "田んぼからあなたのグラスまで — サプライチェーンを追跡し、マージンを見て、炭素を測定。誰が真摯に取り組み、誰が過剰に取り組み、QPRが実際にどこにあるかを知る。",
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                aria-pressed={viewMode === tab.key}
                onClick={() => {
                  setViewMode(tab.key);
                  setSelectedSake(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase border transition-all duration-300 ${
                  viewMode === tab.key ? tab.on : `${c.cardBg} ${c.cardBorder} ${c.textMuted}`
                }`}
              >
                <tab.icon aria-hidden="true" size={14} />
                {t(tab.en, tab.ja)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* US Breweries — Lowest Carbon */}
      {viewMode === "carbon" && (
        <section className="py-16 lg:py-20">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
              <div className="flex items-center gap-3 mb-2">
                <Zap aria-hidden="true" size={20} className="text-green-500" />
                <h2 className={`${HEADING} text-3xl sm:text-4xl ${c.textMain}`}>{t("Zero Ocean Miles", "ゼロ海里")}</h2>
              </div>
              <p className={`text-base mb-8 max-w-2xl ${c.textMuted}`}>
                {t(
                  "The lowest carbon sake in America is brewed in America. These breweries use local rice, local water, and zero transpacific shipping. Your glass travels 50 feet, not 5,000 miles.",
                  "アメリカで最も低炭素の酒はアメリカで醸造される。地元の米、地元の水、太平洋横断輸送ゼロ。あなたのグラスは5,000マイルではなく50フィート移動する。",
                )}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usBreweries.map((brewery, i) => (
                <Reveal
                  key={brewery.id}
                  delay={i * 0.08}
                  enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  className={`${c.cardBg} border ${c.cardBorder} p-5 transition-all duration-300 hover:scale-[1.01]`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className={`${HEADING} text-lg ${c.textMain}`}>{brewery.name}</h3>
                      <div className={`flex items-center gap-1 text-xs ${c.textMuted}`}>
                        <MapPin aria-hidden="true" size={10} />
                        {brewery.city}, {brewery.state}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-green-500 text-lg font-bold font-mono">{brewery.carbonKgPerBottle} kg</div>
                      <div className="text-[10px] text-green-500/70 tracking-wider uppercase">CO₂/bottle</div>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed mb-3 ${c.textMuted}`}>{t(brewery.description, brewery.descriptionJa)}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {brewery.notableSakes.map((sake) => (
                      <span key={sake} className={`text-[10px] px-2 py-0.5 ${c.goldBg} ${c.gold} border ${c.goldBorder}`}>
                        {sake}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className={`text-xs ${c.textMuted}`}>
                      {t("Price range:", "価格帯:")} <span className={c.textMain}>{brewery.priceRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield aria-hidden="true" size={10} className="text-green-500" />
                      <span className="text-[10px] font-mono text-green-500">{brewery.integrityScore}/100</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {viewMode === "carbon" && <div className="kintsugi-line" />}

      {/* Carbon Tier Legend */}
      {viewMode === "carbon" && (
        <section className="py-12">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className={`${HEADING} text-2xl mb-6 ${c.textMain}`}>{t("Carbon Tiers", "カーボンティア")}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {carbonTiers.map((tier, i) => {
                const tc = tierClasses(tier.color);
                return (
                  <Reveal
                    key={tier.tier}
                    delay={i * 0.08}
                    enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both"
                    className={`${c.cardBg} border ${c.cardBorder} p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`size-3 rounded-full ${tc.bg}`} />
                      <span className={`text-sm font-bold ${tc.text}`}>{t(tier.tier, tier.tierJa)}</span>
                    </div>
                    <div className={`text-xs font-mono mb-2 ${c.textMuted}`}>{tier.range}</div>
                    <p className={`text-[10px] leading-relaxed ${c.textMuted}`}>{t(tier.description, tier.descriptionJa)}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="kintsugi-line" />

      {/* Main Sake List */}
      <section className="py-16 lg:py-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`${HEADING} text-3xl sm:text-4xl mb-2 ${c.textMain}`}>
            {viewMode === "carbon" && t("Japanese Sake by Carbon Footprint", "日本酒のカーボンフットプリント")}
            {viewMode === "integrity" && t("Who's Trying Hard vs Too Hard", "真摯に取り組む蔵 vs 過剰な蔵")}
            {viewMode === "dollar" && t("Follow Every Dollar", "すべてのドルを追え")}
          </h2>
          <p className={`text-sm mb-8 ${c.textMuted}`}>
            {viewMode === "carbon" &&
              t(
                "Sorted from lowest to highest carbon footprint. Click any sake to see the full supply chain dollar map.",
                "最低から最高のカーボンフットプリント順。クリックで完全なサプライチェーンドルマップを表示。",
              )}
            {viewMode === "integrity" &&
              t(
                "Integrity score measures how much of the retail price reflects genuine craft vs marketing markup. Higher = more honest.",
                "誠実度スコアは小売価格のうちどれだけが本物の技術を反映しているかを測定。高い = より正直。",
              )}
            {viewMode === "dollar" &&
              t(
                "Select a sake to see exactly where every dollar goes — from brewery gate to your glass.",
                "酒を選んで、蔵の門からあなたのグラスまで、すべてのドルの行き先を正確に見る。",
              )}
          </p>

          <div className="space-y-3">
            {list.map((chain, i) => {
              const profile = sakeSupplyChains.find((s) => s.sakeId === chain.productId);
              if (!profile) return null;
              const isSelected = selectedSake === chain.productId;
              const carbonTier = getCarbonTier(chain.totalCarbonKg);
              const panelId = `chain-${chain.productId}`;
              return (
                <Reveal key={chain.productId} delay={i * 0.05} enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both">
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls={panelId}
                    onClick={() => setSelectedSake(isSelected ? null : chain.productId)}
                    className={`block w-full text-left ${c.cardBg} border ${c.cardBorder} p-4 transition-all duration-300 hover:scale-[1.005] ${isSelected ? c.ring : ""}`}
                  >
                    <span className="flex flex-wrap items-center gap-4">
                      <span className={`w-8 text-center text-lg font-mono ${c.textMuted}`}>{i + 1}</span>
                      <span className="flex-1 min-w-50">
                        <span className={`block ${HEADING} text-base ${c.textMain}`}>
                          {t(chain.productName, chain.productNameJa || chain.productName)}
                        </span>
                        <span className={`block text-xs ${c.textMuted}`}>
                          {profile.brewery} · {profile.prefecture}
                        </span>
                      </span>
                      <span className="text-center">
                        <span className={`block text-sm font-bold font-mono ${tierClasses(carbonTier.color).text}`}>{chain.totalCarbonKg} kg</span>
                        <span className={`block text-[10px] ${c.textMuted}`}>CO₂</span>
                      </span>
                      <span className="text-center">
                        <span className={`block text-sm font-bold font-mono ${c.textMain}`}>{chain.producerShare}%</span>
                        <span className={`block text-[10px] ${c.textMuted}`}>{t("to maker", "生産者へ")}</span>
                      </span>
                      <span className="text-center">
                        <span className={`block text-sm font-bold font-mono ${c.textMain}`}>${chain.totalRetailPrice}</span>
                        <span className={`block text-[10px] ${c.textMuted}`}>{t("retail", "小売")}</span>
                      </span>
                      <span className="text-center">
                        <span className={`block text-sm font-bold font-mono ${INTEGRITY_TEXT(profile.integrityScore)}`}>{profile.integrityScore}</span>
                        <span className={`block text-[10px] ${c.textMuted}`}>{t("integrity", "誠実度")}</span>
                      </span>
                      <span className="text-center">
                        {profile.isNamazake ? (
                          <Plane aria-hidden="true" size={16} className="text-red-400 mx-auto" />
                        ) : (
                          <Ship aria-hidden="true" size={16} className="text-blue-400 mx-auto" />
                        )}
                        <span className={`block text-[10px] ${c.textMuted}`}>{profile.isNamazake ? t("Air", "空輸") : t("Ocean", "船便")}</span>
                      </span>
                      <span className={c.textMuted}>
                        {isSelected ? <ChevronUp aria-hidden="true" size={16} /> : <ChevronDown aria-hidden="true" size={16} />}
                      </span>
                    </span>
                    <span className={`block mt-3 text-xs leading-relaxed italic ${c.textMuted}`}>
                      {t(profile.integrityNotes, profile.integrityNotesJa || profile.integrityNotes)}
                    </span>
                  </button>

                  {isSelected && selectedMap && (
                    <div id={panelId} className={`${c.cardBg} border-x border-b ${c.cardBorder} p-4 sm:p-6 animate-in fade-in duration-300`}>
                      <DollarMap supplyChain={selectedMap} showRestaurant={true} />
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={sakeDetailPath(chain.productId)}
                          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)] hover:bg-[oklch(0.82_0.10_85)] transition-all min-h-12 rounded-lg"
                        >
                          {t("View & Buy", "詳細・購入")}
                        </Link>
                        <Link
                          href={sk(`/retailer-finder?sake=${encodeURIComponent(chain.productName)}`)}
                          className={`inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider border ${c.cardBorder} ${c.textMuted} ${c.textMainHover} transition-all min-h-12 rounded-lg`}
                        >
                          {t("Find Retailer", "販売店を探す")}
                        </Link>
                      </div>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* The Juyondai Problem */}
      <section className="py-16 lg:py-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${c.cardBg} border ${c.cardBorder} p-6 sm:p-8 max-w-3xl mx-auto`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle aria-hidden="true" size={24} className="text-red-400" />
              <h3 className={`${HEADING} text-2xl ${c.textMain}`}>{t("The Juyondai Problem", "十四代問題")}</h3>
            </div>
            <div className={`space-y-4 text-sm leading-relaxed ${c.textMuted}`}>
              <p>
                {t(
                  "Takagi Shuzo sells Juyondai Honmaru at their gate for about $15. In Japan, if you can find it, it's $20-30. In America, it's $250. The brewery sees none of that $235 gap.",
                  "高木酒造は十四代本丸を蔵の門で約15ドルで販売。日本で見つけられれば20-30ドル。アメリカでは250ドル。蔵はその235ドルの差額を一銭も受け取らない。",
                )}
              </p>
              <p>
                {t(
                  "This is the most extreme example of supply chain extraction in the sake world. Speculators, gray market importers, and collectors have turned a $15 bottle into a $250 status symbol. The brewery — the people who actually made the sake — get 6 cents of every dollar you spend.",
                  "これは酒の世界で最も極端なサプライチェーン搾取の例。投機家、グレーマーケットの輸入業者、コレクターが15ドルの瓶を250ドルのステータスシンボルに変えた。蔵 — 実際に酒を造った人々 — はあなたが使う1ドルのうち6セントしか受け取らない。",
                )}
              </p>
              <p className={`font-bold ${c.gold}`}>
                {t(
                  "Meanwhile, Suigei Tokubetsu Junmai at $20 gives the brewery 22 cents of every dollar. That's where the real QPR lives — not in the hype, but in the honesty.",
                  "一方、酔鯨特別純米は20ドルで蔵に1ドルあたり22セントを渡す。本当のQPRはそこにある — 誇大広告ではなく、正直さの中に。",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
