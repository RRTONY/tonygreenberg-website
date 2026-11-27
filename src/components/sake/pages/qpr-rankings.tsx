"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Bell,
  Camera,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Heart,
  Loader2,
  MapPin,
  Search,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useLanguage, useMember, useMode } from "@/components/sake/sake-providers";
import { useToolPalette } from "@/components/sake/tool-palette";
import { SakeImage } from "@/components/sake/sake-image";
import { getAllLivePrices, getMyFavorites, toggleFavorite } from "@/app/sake/actions";
import { getBottleImage } from "@/lib/content/sake/images";
import { qprFormula, qprSakeDatabase, type QPRSake } from "@/lib/content/sake/qpr-data";
import type { LivePriceSummary } from "@/lib/content/sake/live-prices";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/QPRRankings.tsx (2026-11-26): the sortable, filterable
// table of every sake in the QPR database, the "How QPR Works" explainer, links to the tools, each
// row's details (description, flavors, serving, rice, pairings, retailers, connoisseur numbers, the
// retailer price box, View & Buy, Dollar Map, Favorite) and the Juyondai Paradox.
// Changed:
// - Prices come from actions.ts getAllLivePrices once on load (the app polled every 60s, for numbers
//   that are now a fixed estimate until real prices are recorded). The box keeps the app's "LIVE
//   PRICES" label; whether to reword it is the owner's call.
// - Rows open from a button in the sake's cell (keyboard and screen readers; the app made the whole
//   <tr> clickable), with aria-expanded. Every row's details are in the server HTML, hidden until
//   opened, so they're readable by search engines. The details sit under the name instead of squeezed
//   beside it (the app put them inside the name's flex row).
// - The formula explainer follows the page language (the app switched it with the US/JP market toggle).
// - The 🇺🇸/🇯🇵 flags became "US"/"JP" text (rule 18); the bottle picture is SakeImage.
// - Favorite needs sign-in, as in the app (hidden when signed out); it saves on the server.
// - The search box's focus color follows the look; the app's hard-coded gold showed in Austere too.

type SortField = "qprUS" | "qprJapan" | "priceUS" | "qualityScore" | "experienceScore" | "name";
type SortDir = "asc" | "desc";

const TIERS: Record<string, { bg: string; text: string; bgAustere: string; textAustere: string; label: string; labelJa: string }> = {
  legendary: { bg: "bg-yellow-500/20", text: "text-yellow-400", bgAustere: "bg-red-900/10", textAustere: "text-red-900", label: "LEGENDARY", labelJa: "伝説級" },
  exceptional: { bg: "bg-amber-500/20", text: "text-amber-400", bgAustere: "bg-amber-900/10", textAustere: "text-amber-900", label: "EXCEPTIONAL", labelJa: "卓越" },
  excellent: { bg: "bg-green-500/20", text: "text-green-400", bgAustere: "bg-green-900/10", textAustere: "text-green-900", label: "EXCELLENT", labelJa: "優秀" },
  good: { bg: "bg-blue-500/20", text: "text-blue-400", bgAustere: "bg-blue-900/10", textAustere: "text-blue-900", label: "GOOD", labelJa: "良好" },
  fair: { bg: "bg-gray-500/20", text: "text-gray-400", bgAustere: "bg-gray-600/10", textAustere: "text-gray-600", label: "FAIR", labelJa: "普通" },
  overpriced: { bg: "bg-red-500/20", text: "text-red-400", bgAustere: "bg-red-800/10", textAustere: "text-red-800", label: "OVERPRICED", labelJa: "割高" },
};

const SAKE_TYPES = Array.from(new Set(qprSakeDatabase.map((s) => s.type)));

function qprColor(qpr: number, isAustere: boolean) {
  if (qpr >= 200) return "text-yellow-400";
  if (qpr >= 150) return isAustere ? "text-amber-800" : "text-amber-400";
  if (qpr >= 120) return "text-green-500";
  if (qpr >= 90) return "text-blue-400";
  if (qpr >= 60) return "text-gray-400";
  return "text-red-400";
}

export function SakeQprRankings() {
  const { t, lang } = useLanguage();
  const { isConnoisseur } = useMode();
  const { signedIn } = useMember();
  const k = useToolPalette();

  const [sortField, setSortField] = useState<SortField>("qprUS");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [market, setMarket] = useState<"us" | "japan">("us");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const [prices, setPrices] = useState<Record<string, LivePriceSummary>>({});
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [pendingFav, setPendingFav] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getAllLivePrices()
      .then((data) => live && setPrices(data.prices))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    getMyFavorites()
      .then((r) => live && r.ok && setFavoriteIds(new Set(r.data.map((f) => f.sakeId))))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [signedIn]);

  const onToggleFavorite = async (sakeId: string) => {
    if (!signedIn || pendingFav) return;
    setPendingFav(sakeId);
    const result = await toggleFavorite(sakeId);
    setPendingFav(null);
    if (result.ok) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (result.data.favorited) next.add(sakeId);
        else next.delete(sakeId);
        return next;
      });
    }
  };

  const filteredSorted = useMemo(() => {
    let list = [...qprSakeDatabase];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameJa.includes(q) ||
          s.brewery.toLowerCase().includes(q) ||
          s.breweryJa.includes(q) ||
          s.prefecture.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") list = list.filter((s) => s.type === typeFilter);
    if (tierFilter !== "all") list = list.filter((s) => s.qprTier === tierFilter);
    const value = (s: QPRSake): number | string => (sortField === "name" ? s.name : s[sortField]);
    list.sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (typeof va === "string" && typeof vb === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return list;
  }, [searchQuery, typeFilter, tierFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortIcon = (field: SortField) =>
    sortField !== field ? (
      <ArrowUpDown aria-hidden="true" size={12} className="opacity-30" />
    ) : sortDir === "desc" ? (
      <ChevronDown aria-hidden="true" size={12} />
    ) : (
      <ChevronUp aria-hidden="true" size={12} />
    );
  const ariaSort = (field: SortField) => (sortField === field ? (sortDir === "desc" ? "descending" : "ascending") : undefined);

  const formulaData = lang === "ja" ? qprFormula.ja : qprFormula.en;
  const qprField: SortField = market === "us" ? "qprUS" : "qprJapan";

  const tools = [
    { href: "/sake-scanner", icon: Camera, label: t("Sake Scanner", "酒スキャナー") },
    { href: "/menu-analyzer", icon: UtensilsCrossed, label: t("Menu Analyzer", "メニュー分析") },
    { href: "/sommelier-card", icon: CreditCard, label: t("Sommelier Card", "ソムリエカード") },
    { href: "/retailer-finder", icon: MapPin, label: t("Find Retailers", "販売店検索") },
    { href: "/deal-alerts", icon: Bell, label: t("Deal Alerts", "セールアラート") },
    { href: "/supply-chain", icon: DollarSign, label: t("Dollar Maps", "ドルマップ") },
  ];

  return (
    <div className={`min-h-screen ${k.pageBg} ${k.textMain}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div
            className={
              k.isAustere
                ? "absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,#8B000015_40px,transparent_41px)]"
                : "absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,#c9a22715_40px,transparent_41px)]"
            }
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${k.gold}`}>{t("Quality-Price Ratio", "品質価格比")}</p>
            <h1
              className={`font-sk-display text-5xl sm:text-6xl lg:text-7xl ${k.isAustere ? "font-light tracking-wider" : "font-bold"}`}
            >
              {t("QPR", "QPR")}{" "}
              <span className={k.isAustere ? k.gold : `${k.gold} gold-shimmer`}>{t("Rankings", "ランキング")}</span>
            </h1>
            <p className={`mt-6 max-w-2xl mx-auto text-lg ${k.textMuted}`}>
              {t(
                "The only number that matters when buying sake. Quality divided by price — because the best bottle is the one that gives you the most magic per dollar.",
                "日本酒を買う時に唯一重要な数字。品質を価格で割る — 最高の瓶は、1ドルあたり最も多くの魔法を与えてくれるもの。",
              )}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-in fade-in slide-in-from-bottom-2.5 duration-500 delay-300 fill-mode-both">
            {tools.map((item) => (
              <Link
                key={item.href}
                href={sk(item.href)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider border ${k.goldBorder} ${k.goldBg} ${k.gold} transition-all duration-300 ${k.hoverBg}`}
              >
                <item.icon aria-hidden="true" size={14} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Formula */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            aria-expanded={showFormula}
            aria-controls="sk-qpr-formula"
            onClick={() => setShowFormula((s) => !s)}
            className={`flex items-center gap-3 px-6 py-4 w-full border ${k.cardBorder} ${k.cardBg} transition-all duration-300`}
          >
            <TrendingUp aria-hidden="true" size={20} className={k.gold} />
            <span className="font-mono text-sm tracking-wider">{t("How QPR Works", "QPRの仕組み")}</span>
            <span className="ml-auto">{showFormula ? <ChevronUp aria-hidden="true" size={16} /> : <ChevronDown aria-hidden="true" size={16} />}</span>
          </button>
          <div
            id="sk-qpr-formula"
            hidden={!showFormula}
            className={`border border-t-0 ${k.cardBorder} ${k.cardBg} p-6 animate-in fade-in duration-300`}
          >
            <div className={`font-mono text-lg ${k.gold} mb-4`}>{formulaData.formula}</div>
            <p className={`${k.textMuted} mb-6 leading-relaxed`}>{formulaData.explanation}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formulaData.tiers.map((tier) => (
                <div key={tier.tier} className={`p-4 border ${k.cardBorder} rounded-sm`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="font-mono text-sm font-bold">{tier.tier}</span>
                    <span className={`text-xs ${k.textMuted}`}>({tier.range})</span>
                  </div>
                  <p className={`text-xs ${k.textMuted}`}>{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-50">
              <Search aria-hidden="true" size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${k.textMuted}`} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t("Search sake, brewery, prefecture...", "酒名、蔵元、県名で検索...")}
                placeholder={t("Search sake, brewery, prefecture...", "酒名、蔵元、県名で検索...")}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border ${k.inputBg} ${k.textMain} focus:outline-none ${k.focusGold} transition-colors`}
              />
            </div>
            <div className={`flex border ${k.cardBorder} overflow-hidden`} role="group" aria-label={t("Market", "市場")}>
              {(["us", "japan"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={market === m}
                  onClick={() => setMarket(m)}
                  className={`px-4 py-2.5 text-xs font-mono tracking-wider transition-all ${market === m ? `${k.goldBg} ${k.gold}` : k.textMuted}`}
                >
                  {m === "us" ? "US" : "JP"}
                </button>
              ))}
            </div>
            <select
              aria-label={t("All Types", "全タイプ")}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-3 py-2.5 text-xs border ${k.inputBg} ${k.textMain} focus:outline-none`}
            >
              <option value="all">{t("All Types", "全タイプ")}</option>
              {SAKE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              aria-label={t("All Tiers", "全ティア")}
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className={`px-3 py-2.5 text-xs border ${k.inputBg} ${k.textMain} focus:outline-none`}
            >
              <option value="all">{t("All Tiers", "全ティア")}</option>
              {Object.entries(TIERS).map(([tier, info]) => (
                <option key={tier} value={tier}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>
          <p className={`text-xs ${k.textMuted} mt-3`} aria-live="polite">
            {t(
              `Showing ${filteredSorted.length} of ${qprSakeDatabase.length} sake`,
              `${qprSakeDatabase.length}銘柄中${filteredSorted.length}銘柄を表示`,
            )}
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="py-4 px-4 pb-16">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${k.cardBorder}`}>
                <th scope="col" className="text-left py-3 px-2 font-mono text-xs tracking-wider">
                  #
                </th>
                <th scope="col" className="text-left py-3 px-2" aria-sort={ariaSort("name")}>
                  <button type="button" onClick={() => toggleSort("name")} className="flex items-center gap-1 font-mono text-xs tracking-wider">
                    {t("Sake", "銘柄")} {sortIcon("name")}
                  </button>
                </th>
                <th scope="col" className="text-left py-3 px-2 font-mono text-xs tracking-wider hidden md:table-cell">
                  {t("Type", "タイプ")}
                </th>
                <th scope="col" className="text-center py-3 px-2" aria-sort={ariaSort(qprField)}>
                  <button type="button" onClick={() => toggleSort(qprField)} className="flex items-center gap-1 font-mono text-xs tracking-wider mx-auto">
                    QPR {sortIcon(qprField)}
                  </button>
                </th>
                <th scope="col" className="text-center py-3 px-2 hidden sm:table-cell" aria-sort={ariaSort("qualityScore")}>
                  <button type="button" onClick={() => toggleSort("qualityScore")} className="flex items-center gap-1 font-mono text-xs tracking-wider mx-auto">
                    {t("Quality", "品質")} {sortIcon("qualityScore")}
                  </button>
                </th>
                <th scope="col" className="text-center py-3 px-2 hidden lg:table-cell" aria-sort={ariaSort("experienceScore")}>
                  <button type="button" onClick={() => toggleSort("experienceScore")} className="flex items-center gap-1 font-mono text-xs tracking-wider mx-auto">
                    EXV {sortIcon("experienceScore")}
                  </button>
                </th>
                <th scope="col" className="text-center py-3 px-2" aria-sort={ariaSort("priceUS")}>
                  <button type="button" onClick={() => toggleSort("priceUS")} className="flex items-center gap-1 font-mono text-xs tracking-wider mx-auto">
                    {t("Price", "価格")} {sortIcon("priceUS")}
                  </button>
                </th>
                <th scope="col" className="text-center py-3 px-2 font-mono text-xs tracking-wider hidden md:table-cell">
                  {t("Tier", "ティア")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSorted.map((sake, idx) => {
                const qpr = market === "us" ? sake.qprUS : sake.qprJapan;
                const price = market === "us" ? sake.priceUS : sake.priceJapan;
                const isExpanded = expandedId === sake.id;
                const tier = TIERS[sake.qprTier];
                const lp = prices[sake.id];
                const fav = favoriteIds.has(sake.id);
                const detailsId = `sk-qpr-${sake.id}`;
                return (
                    <tr
                      key={sake.id}
                      className={`border-b ${k.cardBorder} transition-all duration-200 ${k.hoverBg} animate-in fade-in fill-mode-both ${
                        isExpanded ? (k.isAustere ? "bg-stone-200" : "bg-[#1a2035]") : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className={`py-3 px-2 font-mono text-xs ${k.textMuted} align-top`}>{idx + 1}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <SakeImage
                            image={getBottleImage(sake.type)}
                            className="w-10 h-14 rounded object-cover shrink-0 hidden sm:block"
                            sizes="40px"
                          />
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={detailsId}
                            onClick={() => setExpandedId(isExpanded ? null : sake.id)}
                            className="text-left"
                          >
                            <span className="font-medium">{t(sake.name, sake.nameJa)}</span>
                            <span className={`block text-xs ${k.textMuted} mt-0.5`}>
                              {t(sake.brewery, sake.breweryJa)} · {t(sake.prefecture, sake.prefectureJa)}
                            </span>
                          </button>
                        </div>
                        <div id={detailsId} hidden={!isExpanded} className="mt-3 space-y-2 animate-in fade-in duration-300">
                          <p className={`text-xs leading-relaxed ${k.textMuted}`}>{t(sake.description, sake.descriptionJa)}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sake.flavorProfile.map((f) => (
                              <span key={f} className={`text-[10px] px-2 py-0.5 ${k.goldBg} ${k.gold} rounded-sm`}>
                                {f}
                              </span>
                            ))}
                          </div>
                          <div className={`text-xs ${k.textMuted} mt-2`}>
                            <span className="font-mono">{t("Serving:", "提供温度:")}</span> {t(sake.servingTemp, sake.servingTempJa)}
                          </div>
                          <div className={`text-xs ${k.textMuted}`}>
                            <span className="font-mono">{t("Rice:", "米:")}</span> {t(sake.riceVariety, sake.riceVarietyJa)} · {sake.ricePolishRatio}%{" "}
                            {t("polish", "精米")}
                          </div>
                          <div className={`text-xs ${k.textMuted}`}>
                            <span className="font-mono">{t("Pair with:", "ペアリング:")}</span> {t(sake.pairingEn.join(", "), sake.pairingJa.join("、"))}
                          </div>
                          <div className={`text-xs ${k.textMuted}`}>
                            <span className="font-mono">{t("Available at:", "販売店:")}</span> {sake.onlineRetailers.join(", ")}
                          </div>
                          {isConnoisseur && (
                            <div className={`text-xs ${k.textMuted} font-mono`}>
                              SMV: {sake.smv > 0 ? "+" : ""}
                              {sake.smv} · Acidity: {sake.acidity} · ABV: {sake.abv}%
                            </div>
                          )}

                          {lp && (
                            <div className={`mt-3 p-3 border ${k.cardBorder} rounded-sm`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Zap aria-hidden="true" size={12} className="text-green-500" />
                                <span className={`text-[10px] font-mono tracking-wider ${k.textMuted}`}>{t("LIVE PRICES", "ライブ価格")}</span>
                              </div>
                              {lp.lowestPrice ? (
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-green-500 font-mono font-bold">${lp.lowestPrice.toFixed(2)}</span>
                                  <span className={`text-[10px] ${k.textMuted}`}>
                                    {t("at", "")} {lp.lowestRetailer}
                                  </span>
                                  {lp.priceDiffPct < 0 && <span className="text-[10px] text-green-500 font-mono">{lp.priceDiffPct}%</span>}
                                  <span className={`text-[10px] ${k.textMuted}`}>
                                    · {lp.inStockCount} {t("retailers", "販売店")}
                                  </span>
                                </div>
                              ) : (
                                <span className={`text-[10px] ${k.textMuted}`}>{t("Out of stock", "在庫切れ")}</span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Link
                              href={sakeDetailPath(sake.id)}
                              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border ${k.goldBorder} ${k.gold} transition-all duration-300 hover:opacity-80 min-h-11`}
                            >
                              <ShoppingCart aria-hidden="true" size={14} />
                              {t("View & Buy", "詳細・購入")}
                            </Link>
                            <Link
                              href={sk(`/supply-chain?sake=${encodeURIComponent(sake.id)}`)}
                              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border ${k.cardBorder} ${k.textMuted} transition-all duration-300 hover:opacity-80 min-h-11`}
                            >
                              <DollarSign aria-hidden="true" size={14} />
                              {t("Dollar Map", "ドルマップ")}
                            </Link>
                            {signedIn && (
                              <button
                                type="button"
                                aria-pressed={fav}
                                disabled={pendingFav !== null}
                                onClick={() => void onToggleFavorite(sake.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border transition-all duration-300 min-h-11 ${
                                  fav ? "border-red-400/30 text-red-400" : `${k.cardBorder} ${k.textMuted}`
                                }`}
                              >
                                {pendingFav === sake.id ? (
                                  <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                                ) : (
                                  <Heart aria-hidden="true" size={14} className={fav ? "fill-red-400" : undefined} />
                                )}
                                {fav ? t("Favorited", "お気に入り済") : t("Favorite", "お気に入り")}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`py-3 px-2 text-xs ${k.textMuted} hidden md:table-cell align-top`}>{t(sake.type, sake.typeJa)}</td>
                      <td className="py-3 px-2 text-center align-top">
                        <span className={`font-mono text-lg font-bold ${qprColor(qpr, k.isAustere)}`}>{qpr}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono hidden sm:table-cell align-top">{sake.qualityScore}</td>
                      <td className="py-3 px-2 text-center font-mono hidden lg:table-cell align-top">{sake.experienceScore}</td>
                      <td className="py-3 px-2 text-center align-top">
                        <span className="font-mono">${price}</span>
                        {market === "us" && sake.priceJapan < sake.priceUS && <div className={`text-[10px] ${k.textMuted}`}>JP ${sake.priceJapan}</div>}
                      </td>
                      <td className="py-3 px-2 text-center hidden md:table-cell align-top">
                        {tier && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-wider rounded-sm ${
                              k.isAustere ? `${tier.bgAustere} ${tier.textAustere}` : `${tier.bg} ${tier.text}`
                            }`}
                          >
                            {t(tier.label, tier.labelJa)}
                          </span>
                        )}
                      </td>
                    </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSorted.length === 0 && (
            <div className={`text-center py-16 ${k.textMuted}`}>
              <p className="text-lg">{t("No sake match your filters", "フィルターに一致する酒がありません")}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setTierFilter("all");
                }}
                className={`mt-4 px-4 py-2 text-sm border ${k.goldBorder} ${k.gold}`}
              >
                {t("Clear Filters", "フィルターをクリア")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Key insight */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`p-8 border ${k.goldBorder} ${k.cardBg}`}>
            <h2 className={`font-sk-display text-xl font-bold ${k.gold} mb-4`}>{t("The Juyondai Paradox", "十四代のパラドックス")}</h2>
            <p className={`${k.textMuted} leading-relaxed text-sm`}>
              {t(
                "The same bottle of Juyondai Honmaru is the BEST QPR in Japan ($15 retail, QPR 470) and the WORST QPR in the US ($250+ speculator price, QPR 28). This single fact tells you everything about why QPR matters — and why knowing the market is the most valuable skill a sake drinker can have.",
                "十四代本丸の同じ瓶が、日本では最高のQPR（小売15ドル、QPR 470）であり、米国では最悪のQPR（投機価格250ドル以上、QPR 28）。この一つの事実が、QPRが重要な理由と、市場を知ることが酒飲みにとって最も価値あるスキルである理由の全てを物語る。",
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
