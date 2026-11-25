"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronDown, DollarSign, Droplets, Filter, GitCompare, Search, SlidersHorizontal, Star, Thermometer, Wheat, X } from "lucide-react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useAesthetic, useLanguage, useMode, useSakePortalClass } from "@/components/sake/sake-providers";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeTypes } from "@/lib/content/sake/sake-data";
import {
  getUniquePrefectures,
  getUniqueRice,
  getUniqueAromas,
  getUniqueTiers,
  getUniqueTypes,
  unifiedSakeDatabase,
  type UnifiedSake,
} from "@/lib/content/sake/unified-sake-data";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";
import { cn } from "@/lib/utils";

// Ported from the Sake app's client/src/pages/Collection.tsx (2026-11-26): every bottle of the unified
// database with EVI/EEI bars, search, nine filters, sort, "Load More", the bottle detail panel and the
// classification table. The app's class strings per look are kept; changed:
// - The detail panel is the site's accessible Dialog (focus trap, Escape, labelled), same look.
// - "View Full Details" only shows for bottles that have a sake page: the app linked every bottle to
//   /sake/<id>, and the curated-only bottles (not in the QPR database) landed on a 404 (rule 20).
// - The close button's hover color was built from a fragment (`hover:${textMain}`), which never made a
//   real class; it's a full class now. Cormorant/Noto JP inline fonts are `font-sk-display`.
// - framer-motion: the bar grow is a slide-in inside its track; cards and panel fade/slide in with CSS.

type SortOption = "eei" | "evi" | "name" | "price-low" | "price-high" | "polish" | "abv" | "qpr";

const priceOrder: Record<string, number> = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
const ITEMS_PER_PAGE = 30;
const qprIds = new Set(qprSakeDatabase.map((s) => s.id));

/** A bottle's sake page exists only for sakes in the QPR database. */
export function hasSakePage(id: string) {
  return qprIds.has(id);
}

export type CollectionFilters = {
  search: string;
  type: string;
  pref: string;
  rice: string;
  price: string;
  temp: string;
  aroma: string;
  abv: string;
  tier: string;
  source: string;
  sortBy: SortOption;
};

export const NO_FILTERS: CollectionFilters = {
  search: "",
  type: "all",
  pref: "all",
  rice: "all",
  price: "all",
  temp: "all",
  aroma: "all",
  abv: "all",
  tier: "all",
  source: "all",
  sortBy: "eei",
};

/** The app's filter + sort, unchanged. */
export function filterCollection(all: UnifiedSake[], f: CollectionFilters): UnifiedSake[] {
  let result = [...all];
  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.nameJa.includes(q) ||
        b.brewery.toLowerCase().includes(q) ||
        b.breweryJa.includes(q) ||
        b.prefecture.toLowerCase().includes(q) ||
        b.rice.toLowerCase().includes(q) ||
        (b.labelKanji ? b.labelKanji.includes(q) : false),
    );
  }
  if (f.type !== "all") result = result.filter((b) => b.type === f.type);
  if (f.pref !== "all") result = result.filter((b) => b.prefecture === f.pref);
  if (f.rice !== "all") result = result.filter((b) => b.rice === f.rice);
  if (f.price !== "all") result = result.filter((b) => b.priceRange === f.price);
  if (f.aroma !== "all") result = result.filter((b) => b.aromaProfile.includes(f.aroma));
  if (f.tier !== "all") result = result.filter((b) => b.qprTier === f.tier);
  if (f.source !== "all")
    result = result.filter((b) => {
      if (f.source === "curated") return b.source === "curated" || b.source === "both";
      if (f.source === "qpr") return b.source === "qpr" || b.source === "both";
      return true;
    });
  if (f.abv !== "all")
    result = result.filter((b) => {
      if (f.abv === "low") return b.abv < 14;
      if (f.abv === "standard") return b.abv >= 14 && b.abv <= 16;
      if (f.abv === "high") return b.abv > 16;
      return true;
    });
  if (f.temp !== "all")
    result = result.filter((b) => {
      const temp = b.servingTemp.toLowerCase();
      if (f.temp === "Chilled") return temp.includes("chilled") || temp.includes("well chilled") || temp.includes("cold");
      if (f.temp === "Room Temp") return temp.includes("room");
      if (f.temp === "Warm") return temp.includes("warm") || temp.includes("hot");
      return true;
    });
  result.sort((a, b) => {
    switch (f.sortBy) {
      case "evi":
        return b.evi - a.evi;
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return (priceOrder[a.priceRange] || 0) - (priceOrder[b.priceRange] || 0);
      case "price-high":
        return (priceOrder[b.priceRange] || 0) - (priceOrder[a.priceRange] || 0);
      case "polish":
        return a.polishRatio - b.polishRatio;
      case "abv":
        return b.abv - a.abv;
      case "qpr":
        return (b.qualityScore || 0) - (a.qualityScore || 0);
      default:
        return b.eei - a.eei;
    }
  });
  return result;
}

// EVI = accent, EEI = crimson, QS = teal (the app's per-look colors).
const BAR = {
  evi: { text: "text-(--sk-accent)", bar: "bg-(--sk-accent)" },
  eei: {
    text: "text-[oklch(0.55_0.18_25)] [.sake-austere_&]:text-[oklch(0.45_0.15_25)]",
    bar: "bg-[oklch(0.55_0.18_25)] [.sake-austere_&]:bg-[oklch(0.45_0.15_25)]",
  },
  qs: {
    text: "text-[oklch(0.60_0.15_200)] [.sake-austere_&]:text-[oklch(0.40_0.12_200)]",
    bar: "bg-[oklch(0.60_0.15_200)] [.sake-austere_&]:bg-[oklch(0.40_0.12_200)]",
  },
};

function ScoreBar({ label, value, tone, maxVal = 10 }: { label: string; value: number; tone: keyof typeof BAR; maxVal?: number }) {
  const pct = Math.min(100, (value / maxVal) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className={`font-mono text-[10px] tracking-[0.15em] uppercase w-8 text-right ${BAR[tone].text}`}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[oklch(0.2_0.03_270)] [.sake-austere_&]:bg-stone-300">
        <div
          className={`h-full rounded-full animate-in slide-in-from-left-full duration-800 ease-out fill-mode-both ${BAR[tone].bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-xs font-bold w-8 ${BAR[tone].text}`}>{value.toFixed(1)}</span>
    </div>
  );
}

export function SakeCollection() {
  const { lang, t } = useLanguage();
  const { isBeginner } = useMode();
  const { isAustere } = useAesthetic();
  const portalClass = useSakePortalClass();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollectionFilters>(NO_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const set = (key: keyof CollectionFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    if (key !== "sortBy") setVisibleCount(ITEMS_PER_PAGE);
  };

  // Style tokens (the app's per-look class strings).
  const goldText = isAustere ? "text-red-800" : "text-[oklch(0.78_0.12_85)]";
  const goldBorder = isAustere ? "border-red-800/30" : "border-[oklch(0.78_0.12_85/0.2)]";
  const goldBg = isAustere ? "bg-red-800/10" : "bg-[oklch(0.78_0.12_85/0.1)]";
  const goldHover = isAustere ? "hover:bg-red-800/5" : "hover:bg-[oklch(0.78_0.12_85/0.1)]";
  const cardBg = isAustere ? "bg-stone-100" : "bg-[oklch(0.16_0.03_270)]";
  const cardBorder = isAustere ? "border-stone-300" : "border-[oklch(0.28_0.04_270)]";
  const textMain = isAustere ? "text-stone-900" : "text-[oklch(0.96_0.01_85)]";
  const textMuted = isAustere ? "text-stone-500" : "text-[oklch(0.55_0.02_270)]";
  const textSoft = isAustere ? "text-stone-700" : "text-[oklch(0.65_0.01_85)]";
  const textBody = isAustere ? "text-stone-800" : "text-[oklch(0.85_0.01_85)]";
  const pageBg = isAustere ? "bg-stone-50" : "bg-background";
  const inputBg = isAustere
    ? "bg-white border-stone-300 text-stone-900"
    : "bg-[oklch(0.2_0.03_270)] border-[oklch(0.28_0.04_270)] text-[oklch(0.85_0.01_85)]";
  const hoverCard = isAustere ? "hover:border-red-800/30" : "hover:border-[oklch(0.78_0.12_85/0.3)]";
  const statBg = isAustere ? "bg-stone-200" : "bg-[oklch(0.18_0.03_270)]";
  const closeColor = isAustere ? "text-stone-500 hover:text-stone-900" : "text-[oklch(0.55_0.02_270)] hover:text-[oklch(0.96_0.01_85)]";

  const tierColors: Record<string, string> = {
    legendary: isAustere ? "bg-red-800 text-white" : "bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)]",
    exceptional: isAustere ? "bg-red-700/80 text-white" : "bg-[oklch(0.65_0.15_60)] text-[oklch(0.12_0.03_270)]",
    excellent: isAustere ? "bg-stone-600 text-white" : "bg-[oklch(0.45_0.10_270)] text-white",
    good: isAustere ? "bg-stone-400 text-white" : "bg-[oklch(0.35_0.05_270)] text-[oklch(0.85_0.01_85)]",
    fair: isAustere ? "bg-stone-300 text-stone-700" : "bg-[oklch(0.25_0.03_270)] text-[oklch(0.65_0.01_85)]",
    overpriced: isAustere ? "bg-stone-200 text-stone-500" : "bg-[oklch(0.20_0.02_270)] text-[oklch(0.50_0.01_85)]",
  };

  const types = useMemo(() => getUniqueTypes(), []);
  const prefs = useMemo(() => getUniquePrefectures(), []);
  const rices = useMemo(() => getUniqueRice(), []);
  const aromas = useMemo(() => getUniqueAromas(), []);
  const tiers = useMemo(() => getUniqueTiers(), []);

  const activeFilterCount = (["type", "pref", "rice", "price", "temp", "aroma", "abv", "tier", "source", "search"] as const)
    .map((k) => filters[k])
    .filter((v) => v !== "all" && v !== "").length;

  const filtered = useMemo(() => filterCollection(unifiedSakeDatabase, filters), [filters]);
  const selected = selectedId ? unifiedSakeDatabase.find((b) => b.id === selectedId) ?? null : null;
  const visibleSakes = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setFilters((f) => ({ ...NO_FILTERS, sortBy: f.sortBy }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const label = `flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase mb-1.5 ${textMuted}`;
  const select = `w-full px-3 py-2 text-sm border rounded-sm ${inputBg}`;

  return (
    <div className={`min-h-screen pt-16 ${pageBg}`}>
      {/* Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className={`font-sk-display text-5xl sm:text-6xl lg:text-7xl font-bold [.sake-austere_&]:font-light ${textMain}`}>
              {t("The", "")} <span className={isAustere ? "text-red-800" : "gold-shimmer"}>{t("Collection", "コレクション")}</span>
            </h1>
            <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${textSoft}`}>
              {t(
                `${unifiedSakeDatabase.length} bottles that define what sake can be. Each scored by our Extraordinary Value Index (EVI) and Extraordinary Experience Index (EEI). Filter by type, region, rice, price, temperature, aroma, ABV, or QPR tier.`,
                `日本酒の可能性を定義する${unifiedSakeDatabase.length}本。驚異的価値指数（EVI）と驚異的体験指数（EEI）で評価。種類、地域、米、価格、温度、香り、度数、QPRティアでフィルター。`,
              )}
            </p>
            <div className="mt-4">
              <Link href={sk("/compare")} className={`inline-flex items-center gap-2 text-sm hover:underline transition-colors ${goldText}`}>
                <GitCompare aria-hidden="true" size={14} />
                {t("Compare sakes side-by-side", "日本酒を並べて比較")}
              </Link>
            </div>
          </div>

          {/* Search + filter toggle */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search aria-hidden="true" size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => set("search", e.target.value)}
                aria-label={t("Search", "検索")}
                placeholder={t("Search by name, brewery, prefecture, rice, kanji...", "名前、蔵元、県、米、漢字で検索...")}
                className={`w-full pl-10 pr-4 py-2.5 text-sm border focus:outline-none transition-colors rounded-sm ${inputBg}`}
              />
            </div>
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((s) => !s)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 border text-xs tracking-[0.15em] uppercase transition-colors relative",
                goldBorder,
                goldText,
                isAustere ? "hover:bg-red-800/5" : "hover:border-[oklch(0.78_0.12_85/0.4)]",
              )}
            >
              <SlidersHorizontal aria-hidden="true" size={14} />
              {t("Filters & Sort", "フィルター＆ソート")}
              {activeFilterCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 size-5 rounded-full text-[10px] font-bold flex items-center justify-center ${isAustere ? "bg-red-800 text-white" : "bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)]"}`}
                >
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown aria-hidden="true" size={14} className={showFilters ? "transition-transform rotate-180" : "transition-transform"} />
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className={`mt-3 p-5 border rounded-sm ${cardBg} ${cardBorder}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="sk-f-type" className={label}>
                      <Droplets aria-hidden="true" size={12} />
                      {t("Classification", "分類")}
                    </label>
                    <select id="sk-f-type" value={filters.type} onChange={(e) => set("type", e.target.value)} className={select}>
                      <option value="all">{t("All Types", "全種類")}</option>
                      {types.map((ty) => (
                        <option key={ty} value={ty}>
                          {ty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-pref" className={label}>
                      {t("Prefecture", "産地")}
                    </label>
                    <select id="sk-f-pref" value={filters.pref} onChange={(e) => set("pref", e.target.value)} className={select}>
                      <option value="all">{t("All Prefectures", "全産地")}</option>
                      {prefs.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-rice" className={label}>
                      <Wheat aria-hidden="true" size={12} />
                      {t("Rice Variety", "米品種")}
                    </label>
                    <select id="sk-f-rice" value={filters.rice} onChange={(e) => set("rice", e.target.value)} className={select}>
                      <option value="all">{t("All Rice", "全品種")}</option>
                      {rices.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-price" className={label}>
                      <DollarSign aria-hidden="true" size={12} />
                      {t("Price Range", "価格帯")}
                    </label>
                    <select id="sk-f-price" value={filters.price} onChange={(e) => set("price", e.target.value)} className={select}>
                      <option value="all">{t("All Prices", "全価格帯")}</option>
                      <option value="$">{t("$ (Under $20)", "$ (20ドル以下)")}</option>
                      <option value="$$">{t("$$ ($20-$45)", "$$ (20-45ドル)")}</option>
                      <option value="$$$">{t("$$$ ($45-$80)", "$$$ (45-80ドル)")}</option>
                      <option value="$$$$">{t("$$$$ ($80+)", "$$$$ (80ドル以上)")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-temp" className={label}>
                      <Thermometer aria-hidden="true" size={12} />
                      {t("Serving Temp", "提供温度")}
                    </label>
                    <select id="sk-f-temp" value={filters.temp} onChange={(e) => set("temp", e.target.value)} className={select}>
                      <option value="all">{t("All Temps", "全温度帯")}</option>
                      <option value="Chilled">{t("Chilled", "冷酒")}</option>
                      <option value="Room Temp">{t("Room Temp", "常温")}</option>
                      <option value="Warm">{t("Warm / Hot", "燗酒")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-aroma" className={label}>
                      {t("Aroma", "香り")}
                    </label>
                    <select id="sk-f-aroma" value={filters.aroma} onChange={(e) => set("aroma", e.target.value)} className={select}>
                      <option value="all">{t("All Aromas", "全香り")}</option>
                      {aromas.map((a) => (
                        <option key={a} value={a}>
                          {a.charAt(0).toUpperCase() + a.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-abv" className={label}>
                      {t("ABV Range", "度数帯")}
                    </label>
                    <select id="sk-f-abv" value={filters.abv} onChange={(e) => set("abv", e.target.value)} className={select}>
                      <option value="all">{t("All ABV", "全度数")}</option>
                      <option value="low">{t("Low (< 14%)", "低 (14%未満)")}</option>
                      <option value="standard">{t("Standard (14-16%)", "標準 (14-16%)")}</option>
                      <option value="high">{t("High (> 16%)", "高 (16%超)")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-tier" className={label}>
                      <Star aria-hidden="true" size={12} />
                      {t("QPR Tier", "QPRティア")}
                    </label>
                    <select id="sk-f-tier" value={filters.tier} onChange={(e) => set("tier", e.target.value)} className={select}>
                      <option value="all">{t("All Tiers", "全ティア")}</option>
                      {tiers.map((ti) => (
                        <option key={ti} value={ti}>
                          {ti.charAt(0).toUpperCase() + ti.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-source" className={label}>
                      <Filter aria-hidden="true" size={12} />
                      {t("Source", "ソース")}
                    </label>
                    <select id="sk-f-source" value={filters.source} onChange={(e) => set("source", e.target.value)} className={select}>
                      <option value="all">{t("All Sources", "全ソース")}</option>
                      <option value="curated">{t("Curated (EVI/EEI)", "キュレーション")}</option>
                      <option value="qpr">{t("QPR Database", "QPRデータベース")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sk-f-sort" className={`text-[10px] tracking-[0.15em] uppercase mb-1.5 block ${textMuted}`}>
                      {t("Sort By", "ソート")}
                    </label>
                    <select id="sk-f-sort" value={filters.sortBy} onChange={(e) => set("sortBy", e.target.value)} className={select}>
                      <option value="eei">{t("EEI (Experience)", "EEI (体験)")}</option>
                      <option value="evi">{t("EVI (Value)", "EVI (価値)")}</option>
                      <option value="qpr">{t("Quality Score", "品質スコア")}</option>
                      <option value="name">{t("Name A-Z", "名前順")}</option>
                      <option value="price-low">{t("Price: Low → High", "価格: 安い順")}</option>
                      <option value="price-high">{t("Price: High → Low", "価格: 高い順")}</option>
                      <option value="polish">{t("Polish Ratio", "精米歩合")}</option>
                      <option value="abv">{t("ABV", "度数")}</option>
                    </select>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className={`px-4 py-2 text-xs tracking-wider border transition-colors rounded-sm ${goldBorder} ${goldText} ${goldHover}`}
                    >
                      {t("Clear All Filters", "フィルターをクリア")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className={`mt-4 text-xs ${textMuted}`} aria-live="polite">
            {t(
              `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} sake (${unifiedSakeDatabase.length} total)`,
              `${filtered.length}銘柄中${Math.min(visibleCount, filtered.length)}銘柄を表示（全${unifiedSakeDatabase.length}銘柄）`,
            )}
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className={`ml-2 underline ${goldText}`}>
                {t("Clear filters", "フィルターをクリア")}
              </button>
            )}
          </p>
        </div>
      </section>

      {/* Bottle grid */}
      <section className="pb-24">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className={`text-center py-20 animate-in fade-in duration-500 ${textMuted}`}>
              <p className="text-lg">{t("No sake match your filters.", "フィルターに一致する日本酒がありません。")}</p>
              <button type="button" onClick={clearFilters} className={`mt-4 underline ${goldText}`}>
                {t("Clear all filters", "すべてのフィルターをクリア")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleSakes.map((bottle, i) => (
                  <button
                    type="button"
                    key={bottle.id}
                    onClick={() => setSelectedId(bottle.id)}
                    className={`text-left p-5 border transition-all duration-500 group relative animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both ${cardBg} ${cardBorder} ${hoverCard}`}
                    style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}
                  >
                    <span className="absolute top-4 right-4 hanko text-[10px]">
                      {lang === "ja" ? bottle.typeJa.slice(0, 2) : bottle.type.slice(0, 2).toUpperCase()}
                    </span>

                    {(bottle.source === "curated" || bottle.source === "both") && (
                      <span
                        className={`absolute top-4 left-4 px-1.5 py-0.5 text-[8px] tracking-wider uppercase font-bold rounded-sm ${isAustere ? "bg-red-800/20 text-red-800" : "bg-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.78_0.12_85)]"}`}
                      >
                        {bottle.source === "both" ? "CURATED + QPR" : "CURATED"}
                      </span>
                    )}

                    <span
                      className={`font-sk-display block text-xl font-bold pr-12 leading-tight ${textMain} ${bottle.source !== "qpr" ? "mt-5" : ""}`}
                    >
                      {lang === "ja" ? bottle.nameJa : bottle.name}
                    </span>
                    <span className={`block mt-1 text-xs tracking-widest ${textMuted}`}>
                      {lang === "ja" ? bottle.breweryJa : bottle.brewery} · {lang === "ja" ? bottle.prefectureJa : bottle.prefecture}
                    </span>

                    <span className="block mt-4 space-y-2">
                      <ScoreBar label="EVI" value={bottle.evi} tone="evi" />
                      <ScoreBar label="EEI" value={bottle.eei} tone="eei" />
                    </span>

                    {bottle.qprTier && (
                      <span className="block mt-3">
                        <span className={`inline-block px-2 py-0.5 text-[9px] tracking-wider uppercase font-bold rounded-sm ${tierColors[bottle.qprTier] || ""}`}>
                          {bottle.qprTier}
                        </span>
                      </span>
                    )}

                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {bottle.aromaProfile.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className={`px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-sm ${isAustere ? "bg-stone-200 text-stone-600" : "bg-[oklch(0.2_0.03_270)] text-[oklch(0.65_0.01_85)]"}`}
                        >
                          {a}
                        </span>
                      ))}
                      {bottle.aromaProfile.length > 4 && <span className={`px-2 py-0.5 text-[10px] ${textMuted}`}>+{bottle.aromaProfile.length - 4}</span>}
                    </span>

                    <span className={`block mt-3 text-xs ${textMuted}`}>
                      {t(`Polish: ${bottle.polishRatio}%`, `精米歩合: ${bottle.polishRatio}%`)} · {t(`ABV: ${bottle.abv}%`, `度数: ${bottle.abv}%`)} ·{" "}
                      {bottle.priceRange}
                      {bottle.priceUS ? ` · $${bottle.priceUS}` : ""}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 right-0 size-0 border-b border-r transition-all duration-500 group-hover:size-8 ${isAustere ? "border-red-800/0 group-hover:border-red-800/40" : "border-[oklch(0.78_0.12_85/0)] group-hover:border-[oklch(0.78_0.12_85/0.4)]"}`}
                    />
                  </button>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className={`px-8 py-3 text-sm tracking-widest uppercase border transition-colors rounded-sm ${goldBorder} ${goldText} ${goldHover}`}
                  >
                    {t(`Load More (${filtered.length - visibleCount} remaining)`, `もっと見る（残り${filtered.length - visibleCount}銘柄）`)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Bottle detail */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogPortal>
          <DialogOverlay
            className={isAustere ? "bg-stone-900/60 backdrop-blur-sm" : "bg-[oklch(0.05_0.02_270/0.8)] backdrop-blur-sm"}
          />
          {selected && (
            <DialogPrimitive.Content
              aria-describedby={undefined}
              className={cn(
                portalClass,
                "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] overflow-y-auto border p-6 sm:p-8 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-[30px]",
                isAustere ? "bg-stone-50 border-stone-300" : "bg-[oklch(0.14_0.03_270)] border-[oklch(0.78_0.12_85/0.2)]",
              )}
            >
              <DialogPrimitive.Close
                aria-label={t("Close", "閉じる")}
                className={`absolute top-4 right-4 flex items-center justify-center transition-colors ${closeColor}`}
              >
                <X aria-hidden="true" size={20} />
              </DialogPrimitive.Close>

              <div className="hanko text-sm mb-4 inline-block">{lang === "ja" ? selected.typeJa : selected.type}</div>

              <DialogPrimitive.Title className={`font-sk-display text-3xl sm:text-4xl font-bold ${textMain}`}>
                {lang === "ja" ? selected.nameJa : selected.name}
              </DialogPrimitive.Title>
              <p className={`mt-1 text-sm ${textMuted}`}>
                {lang === "ja" ? selected.breweryJa : selected.brewery} · {lang === "ja" ? selected.prefectureJa : selected.prefecture}
              </p>

              {selected.qprTier && (
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 text-xs tracking-wider uppercase font-bold rounded-sm ${tierColors[selected.qprTier] || ""}`}>
                    QPR: {selected.qprTier}
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <ScoreBar label="EVI" value={selected.evi} tone="evi" />
                <ScoreBar label="EEI" value={selected.eei} tone="eei" />
                {selected.qualityScore != null && <ScoreBar label="QS" value={selected.qualityScore} tone="qs" maxVal={100} />}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t("Polish", "精米"), value: `${selected.polishRatio}%` },
                  { label: t("ABV", "度数"), value: `${selected.abv}%` },
                  { label: t("SMV", "日本酒度"), value: `${selected.smv > 0 ? "+" : ""}${selected.smv}` },
                  { label: t("Acidity", "酸度"), value: `${selected.acidity}` },
                ].map((stat) => (
                  <div key={stat.label} className={`p-3 text-center ${statBg}`}>
                    <div className={`text-[10px] tracking-[0.15em] uppercase ${textMuted}`}>{stat.label}</div>
                    <div className={`mt-1 font-mono text-lg font-bold ${goldText}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {(selected.priceUS || selected.usAvailability) && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {selected.priceUS ? (
                    <div className={`p-3 ${statBg}`}>
                      <div className={`text-[10px] tracking-[0.15em] uppercase ${textMuted}`}>{t("US Price (720ml)", "米国価格")}</div>
                      <div className={`mt-1 font-mono text-lg font-bold ${goldText}`}>${selected.priceUS}</div>
                      {selected.priceJapan ? (
                        <div className={`text-[10px] ${textMuted}`}>{t(`Japan: $${selected.priceJapan}`, `日本: $${selected.priceJapan}`)}</div>
                      ) : null}
                    </div>
                  ) : null}
                  {selected.usAvailability && (
                    <div className={`p-3 ${statBg}`}>
                      <div className={`text-[10px] tracking-[0.15em] uppercase ${textMuted}`}>{t("US Availability", "米国入手性")}</div>
                      <div className={`mt-1 text-sm font-medium capitalize ${textBody}`}>{selected.usAvailability}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className={`p-3 ${statBg}`}>
                  <div className={`text-[10px] tracking-[0.15em] uppercase ${textMuted}`}>{t("Rice", "米")}</div>
                  <div className={`mt-1 text-sm ${textBody}`}>{lang === "ja" ? selected.riceJa : selected.rice}</div>
                </div>
                <div className={`p-3 ${statBg}`}>
                  <div className={`text-[10px] tracking-[0.15em] uppercase ${textMuted}`}>{t("Serving", "提供温度")}</div>
                  <div className={`mt-1 text-sm ${textBody}`}>{lang === "ja" ? selected.servingTempJa : selected.servingTemp}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.aromaProfile.map((a) => (
                  <span key={a} className={`px-3 py-1 text-xs tracking-wider uppercase border rounded-sm ${goldBg} ${goldText} ${goldBorder}`}>
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <h3 className={`text-[10px] tracking-[0.15em] uppercase mb-2 font-sans ${textMuted}`}>{t("Flavor Notes", "味わいノート")}</h3>
                <p className={`font-sk-display italic text-lg ${textBody}`}>{lang === "ja" ? selected.flavorNotesJa : selected.flavorNotes}</p>
              </div>

              {selected.pairingEn && selected.pairingEn.length > 0 && (
                <div className="mt-4">
                  <h3 className={`text-[10px] tracking-[0.15em] uppercase mb-2 font-sans ${textMuted}`}>{t("Food Pairing", "料理ペアリング")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "ja" ? selected.pairingJa || selected.pairingEn : selected.pairingEn).map((p) => (
                      <span
                        key={p}
                        className={`px-2 py-1 text-xs rounded-sm ${isAustere ? "bg-stone-200 text-stone-700" : "bg-[oklch(0.2_0.03_270)] text-[oklch(0.75_0.01_85)]"}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className={`leading-relaxed ${textSoft}`}>{lang === "ja" ? selected.descriptionJa : selected.description}</p>
              </div>

              {selected.beginnerNote && (
                <div className={`mt-6 p-4 border-l-2 ${goldBorder} ${goldBg}`}>
                  <h3 className={`text-[10px] tracking-[0.15em] uppercase mb-2 font-sans ${goldText}`}>
                    {isBeginner ? t("Beginner's Take", "初心者向け") : t("Connoisseur's Note", "通のメモ")}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isAustere ? "text-stone-700" : "text-[oklch(0.8_0.01_85)]"}`}>
                    {isBeginner
                      ? lang === "ja"
                        ? selected.beginnerNoteJa
                        : selected.beginnerNote
                      : lang === "ja"
                        ? selected.connoisseurNoteJa
                        : selected.connoisseurNote}
                  </p>
                </div>
              )}

              {selected.labelKanji && (
                <div className="mt-4">
                  <h3 className={`text-[10px] tracking-[0.15em] uppercase mb-1 font-sans ${textMuted}`}>{t("Label Kanji", "ラベル漢字")}</h3>
                  <p className={`font-sk-jp text-2xl ${isAustere ? "text-stone-800" : "text-[oklch(0.90_0.01_85)]"}`}>{selected.labelKanji}</p>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {hasSakePage(selected.id) && (
                  <Link
                    href={sakeDetailPath(selected.id)}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-widest uppercase transition-all min-h-12 font-bold rounded-lg ${isAustere ? "bg-red-800 text-white hover:bg-red-900" : "bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)] hover:bg-[oklch(0.82_0.10_85)]"}`}
                  >
                    {t("View Full Details", "詳細を見る")}
                  </Link>
                )}
                <Link
                  href={sk(`/compare?ids=${encodeURIComponent(selected.id)}`)}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-widest uppercase border transition-all min-h-12 rounded-lg ${goldBorder} ${goldText} ${goldHover}`}
                >
                  <GitCompare aria-hidden="true" size={14} />
                  {t("Add to Compare", "比較に追加")}
                </Link>
              </div>
            </DialogPrimitive.Content>
          )}
        </DialogPortal>
      </Dialog>

      {/* Classification guide */}
      <section className={`py-16 border-t ${isAustere ? "border-stone-300" : "border-[oklch(0.78_0.12_85/0.1)]"}`}>
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`font-sk-display text-3xl font-bold mb-8 ${textMain}`}>{t("Sake Classification Guide", "日本酒分類ガイド")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${goldBorder}`}>
                  <th className={`text-left py-3 px-4 text-[10px] tracking-[0.15em] uppercase ${goldText}`}>{t("Type", "種類")}</th>
                  <th className={`text-left py-3 px-4 text-[10px] tracking-[0.15em] uppercase ${goldText}`}>{t("Polish", "精米")}</th>
                  <th className={`text-left py-3 px-4 text-[10px] tracking-[0.15em] uppercase ${goldText}`}>{t("Added Alcohol", "醸造アルコール")}</th>
                  <th className={`text-left py-3 px-4 text-[10px] tracking-[0.15em] uppercase ${goldText}`}>{t("Character", "特徴")}</th>
                </tr>
              </thead>
              <tbody>
                {sakeTypes.map((st) => (
                  <tr
                    key={st.name}
                    className={`border-b transition-colors ${isAustere ? "border-stone-200 hover:bg-stone-100" : "border-[oklch(0.2_0.03_270)] hover:bg-[oklch(0.78_0.12_85/0.03)]"}`}
                  >
                    <td className="py-3 px-4">
                      <div className={`font-medium ${isAustere ? "text-stone-800" : "text-[oklch(0.93_0.01_85)]"}`}>{lang === "ja" ? st.nameJa : st.name}</div>
                    </td>
                    <td className={`py-3 px-4 font-mono ${goldText}`}>{st.polish}</td>
                    <td className={`py-3 px-4 ${textSoft}`}>{st.addedAlcohol ? t("Yes", "あり") : t("No", "なし")}</td>
                    <td className={`py-3 px-4 ${textSoft}`}>{lang === "ja" ? st.descriptionJa : st.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
