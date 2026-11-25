"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Star,
  Store,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { usRetailers } from "@/lib/content/sake/qpr-data";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/RetailerFinder.tsx (2026-11-26): ZIP code → states →
// the retailers serving them (local stores first, then by rating), type and price filters, expandable
// retailer cards and the buying tips. A `?sake=` link (from the Ordering Guide and QPR pages) shows the
// "Looking for" banner. The app's style tokens per look are full class strings (LOOK).
// Changed (rule 20): the ?sake= value is read without an effect (useSyncExternalStore), so the page
// still renders on the server; the banner's Clear button had a broken hover class
// (`hover:${gold}`, never generated) and now has a real one; the search button and filters have
// accessible names/states; the tip emoji (🏪 📦 🌡️ 📅) are lucide icons (rule 18).

// US state mapping from ZIP prefix (the app's table).
const zipToState: Record<string, string[]> = {
  "0": ["CT", "MA", "ME", "NH", "NJ", "NY", "PR", "RI", "VT", "VI"],
  "1": ["DE", "NY", "PA"],
  "2": ["DC", "MD", "NC", "SC", "VA", "WV"],
  "3": ["AL", "FL", "GA", "MS", "TN"],
  "4": ["IN", "KY", "MI", "OH"],
  "5": ["IA", "MN", "MT", "ND", "SD", "WI"],
  "6": ["IL", "KS", "MO", "NE"],
  "7": ["AR", "LA", "OK", "TX"],
  "8": ["AZ", "CO", "ID", "NM", "NV", "UT", "WY"],
  "9": ["AK", "CA", "HI", "OR", "WA"],
  "100": ["NY"],
  "101": ["NY"],
  "102": ["NY"],
  "103": ["NY"],
  "104": ["NY"],
  "110": ["NY"],
  "111": ["NY"],
  "112": ["NY"],
  "113": ["NY"],
  "114": ["NY"],
  "900": ["CA"],
  "901": ["CA"],
  "902": ["CA"],
  "903": ["CA"],
  "904": ["CA"],
  "905": ["CA"],
  "906": ["CA"],
  "907": ["CA"],
  "908": ["CA"],
  "909": ["CA"],
  "910": ["CA"],
  "911": ["CA"],
  "912": ["CA"],
  "913": ["CA"],
  "914": ["CA"],
  "917": ["CA"],
  "918": ["CA"],
  "94": ["CA"],
};

/** Most specific prefix first (3 digits, then 2, then 1), as in the app. */
export function getStatesFromZip(zip: string): string[] {
  if (!zip) return [];
  return zipToState[zip.substring(0, 3)] || zipToState[zip.substring(0, 2)] || zipToState[zip.substring(0, 1)] || [];
}

const priceLevelLabels: Record<string, { en: string; ja: string; icon: string }> = {
  budget: { en: "Budget-Friendly", ja: "お手頃", icon: "$" },
  mid: { en: "Mid-Range", ja: "中価格帯", icon: "$$" },
  premium: { en: "Premium", ja: "プレミアム", icon: "$$$" },
  luxury: { en: "Luxury", ja: "ラグジュアリー", icon: "$$$$" },
};

const tips: { icon: LucideIcon; en: string; ja: string }[] = [
  {
    icon: Store,
    en: "Japanese grocery stores (Mitsuwa, Marukai, H Mart) often have the lowest prices — 20-30% below specialty shops.",
    ja: "日本食料品店（ミツワ、マルカイ、Hマート）は多くの場合最も安い — 専門店より20-30%安い。",
  },
  {
    icon: Package,
    en: "Online retailers like Tippsy and Sake Social offer curated selections and education. Worth the slight premium for discovery.",
    ja: "TippsyやSake Socialなどのオンライン販売店は厳選されたセレクションと教育を提供。発見のためのわずかなプレミアムの価値あり。",
  },
  {
    icon: Thermometer,
    en: "Check storage conditions. Sake should be refrigerated or in a cool, dark place. Avoid bottles in direct sunlight.",
    ja: "保管条件を確認。日本酒は冷蔵または涼しく暗い場所に。直射日光の瓶は避ける。",
  },
  {
    icon: CalendarDays,
    en: "Check the bottling date. Most sake is best within 1-2 years. Namazake (unpasteurized) should be consumed within months.",
    ja: "瓶詰め日を確認。ほとんどの日本酒は1-2年以内が最適。生酒は数ヶ月以内に消費すべき。",
  },
];

const LOOK = {
  kintsugi: {
    gold: "text-[#c9a227]",
    goldBg: "bg-[#c9a227]/10",
    goldBorder: "border-[#c9a227]/30",
    cardBg: "bg-[#0d1321]/80",
    cardBorder: "border-[#1a2035]",
    textMain: "text-[#e8e2d6]",
    textMuted: "text-[#e8e2d6]/60",
    page: "min-h-screen bg-[#0a0e1a] text-[#e8e2d6]",
    input: "bg-[#0d1321] border-[#1a2035]",
    hoverBg: "hover:bg-[#1a2035]",
    h1: "font-sk-display text-5xl sm:text-6xl lg:text-7xl font-bold",
    shimmer: "text-[#c9a227] gold-shimmer",
    starOn: "text-[#c9a227] fill-[#c9a227]",
    iconIdle: "bg-[#1a2035]",
    clear: "text-xs transition-colors px-3 py-1 border text-[#e8e2d6]/60 hover:text-[#c9a227] border-[#1a2035]",
    filterOn: "bg-[#c9a227]/10 text-[#c9a227]",
  },
  austere: {
    gold: "text-red-800",
    goldBg: "bg-red-800/10",
    goldBorder: "border-red-800/30",
    cardBg: "bg-stone-100",
    cardBorder: "border-stone-300",
    textMain: "text-stone-900",
    textMuted: "text-stone-600",
    page: "min-h-screen bg-stone-50 text-stone-900",
    input: "bg-white border-stone-300",
    hoverBg: "hover:bg-stone-200",
    h1: "font-sk-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-wider",
    shimmer: "text-red-800",
    starOn: "text-red-800 fill-red-800",
    iconIdle: "bg-stone-200",
    clear: "text-xs transition-colors px-3 py-1 border text-stone-600 hover:text-red-800 border-stone-300",
    filterOn: "bg-red-800/10 text-red-800",
  },
} as const;

const noSubscribe = () => () => {};
const readSakeParam = () => new URLSearchParams(window.location.search).get("sake") ?? "";
const noSakeParam = () => "";

const typeIcon = (type: string): ReactNode => {
  switch (type) {
    case "online":
      return <Globe aria-hidden="true" size={14} />;
    case "physical":
      return <Store aria-hidden="true" size={14} />;
    case "both":
      return <ShoppingBag aria-hidden="true" size={14} />;
    default:
      return <Package aria-hidden="true" size={14} />;
  }
};

export function SakeRetailerFinder() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const look = isAustere ? LOOK.austere : LOOK.kintsugi;

  const [zipCode, setZipCode] = useState("");
  const [searched, setSearched] = useState(false);
  const urlSake = useSyncExternalStore(noSubscribe, readSakeParam, noSakeParam);
  const [sakeCleared, setSakeCleared] = useState(false);
  const sakeQuery = sakeCleared ? "" : urlSake;
  const [typeFilter, setTypeFilter] = useState<"all" | "online" | "physical" | "both">("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const userStates = useMemo(() => getStatesFromZip(zipCode), [zipCode]);

  const filteredRetailers = useMemo(() => {
    let list = [...usRetailers];
    if (searched && zipCode.length >= 1) {
      list = list.filter((r) => {
        if (r.states.includes("ALL")) return true;
        if (userStates.some((s) => r.states.includes(s))) return true;
        if (r.zipRanges) return r.zipRanges.some((prefix) => zipCode.startsWith(prefix));
        return false;
      });
      list.sort((a, b) => {
        const aLocal = a.type !== "online" && userStates.some((s) => a.states.includes(s));
        const bLocal = b.type !== "online" && userStates.some((s) => b.states.includes(s));
        if (aLocal && !bLocal) return -1;
        if (!aLocal && bLocal) return 1;
        return b.rating - a.rating;
      });
    }
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter);
    if (priceFilter !== "all") list = list.filter((r) => r.priceLevel === priceFilter);
    return list;
  }, [searched, zipCode, userStates, typeFilter, priceFilter]);

  const handleSearch = () => {
    if (zipCode.length >= 1) setSearched(true);
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "online":
        return t("Online", "オンライン");
      case "physical":
        return t("Physical Store", "実店舗");
      case "both":
        return t("Online + Store", "オンライン＋実店舗");
      default:
        return type;
    }
  };

  return (
    <div className={look.page}>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${look.gold}`}>{t("Find Sake Near You", "あなたの近くの日本酒を見つける")}</p>
            <h1 className={look.h1}>
              {t("Retailer", "販売店")} <span className={look.shimmer}>{t("Finder", "ファインダー")}</span>
            </h1>
            <p className={`mt-6 max-w-xl mx-auto text-lg ${look.textMuted}`}>
              {t(
                "Enter your ZIP code to find sake retailers near you — from specialty shops to Japanese grocery stores to online delivery.",
                "ZIPコードを入力して近くの日本酒販売店を見つける — 専門店から日本食料品店、オンライン配達まで。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {sakeQuery && (
        <section className="py-6 px-4">
          <div className="max-w-2xl mx-auto">
            <div
              className={`p-4 border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2.5 duration-300 ${look.goldBorder} ${look.goldBg}`}
            >
              <div className="min-w-0">
                <div className={`text-xs font-mono tracking-wider mb-1 ${look.gold}`}>{t("LOOKING FOR", "探しているのは")}</div>
                <div className={`text-lg font-bold ${look.textMain}`}>{sakeQuery}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSakeCleared(true);
                  window.history.replaceState({}, "", sk("/retailer-finder"));
                }}
                className={look.clear}
              >
                {t("Clear", "クリア")}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`p-6 sm:p-8 border ${look.cardBorder} ${look.cardBg}`}>
            <div className="flex gap-3">
              <div className="relative flex-1 min-w-0">
                <MapPin aria-hidden="true" size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${look.gold}`} />
                <input
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setZipCode(val);
                    if (val.length < 1) setSearched(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  aria-label={t("ZIP code", "ZIPコード")}
                  placeholder={t("Enter ZIP code (e.g., 10001)", "ZIPコードを入力（例：10001）")}
                  className={`w-full pl-10 pr-4 py-3 text-lg border focus:outline-none focus:border-[#c9a227]/50 transition-colors font-mono ${look.input} ${look.textMain}`}
                  maxLength={5}
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                aria-label={t("Search", "検索")}
                className={`flex items-center justify-center px-6 py-3 border font-mono text-sm tracking-wider ${look.goldBg} ${look.goldBorder} ${look.gold}`}
              >
                <Search aria-hidden="true" size={18} />
              </button>
            </div>
            {searched && userStates.length > 0 && (
              <div className={`mt-3 text-xs ${look.textMuted}`}>
                {t(`Showing retailers serving: ${userStates.join(", ")}`, `対象地域: ${userStates.join(", ")}`)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3">
          <div className={`flex flex-wrap border overflow-hidden ${look.cardBorder}`} role="group" aria-label={t("Store type", "店舗タイプ")}>
            {(["all", "online", "physical", "both"] as const).map((type) => (
              <button
                type="button"
                key={type}
                aria-pressed={typeFilter === type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 text-xs font-mono tracking-wider transition-all flex items-center gap-1 ${typeFilter === type ? look.filterOn : look.textMuted}`}
              >
                {type !== "all" && typeIcon(type)}
                {type === "all" ? t("All", "全て") : typeLabel(type)}
              </button>
            ))}
          </div>

          <div className={`flex flex-wrap border overflow-hidden ${look.cardBorder}`} role="group" aria-label={t("Price level", "価格帯")}>
            {["all", "budget", "mid", "premium", "luxury"].map((level) => (
              <button
                type="button"
                key={level}
                aria-pressed={priceFilter === level}
                aria-label={level === "all" ? undefined : t(priceLevelLabels[level].en, priceLevelLabels[level].ja)}
                onClick={() => setPriceFilter(level)}
                className={`px-3 py-2 text-xs font-mono tracking-wider transition-all ${priceFilter === level ? look.filterOn : look.textMuted}`}
              >
                {level === "all" ? t("All Prices", "全価格帯") : priceLevelLabels[level]?.icon || level}
              </button>
            ))}
          </div>

          <span className={`text-xs self-center ml-auto ${look.textMuted}`}>
            {t(`${filteredRetailers.length} retailers`, `${filteredRetailers.length}店舗`)}
          </span>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredRetailers.map((retailer, idx) => {
            const isLocal = searched && retailer.type !== "online" && userStates.some((s) => retailer.states.includes(s));
            const isExpanded = expandedId === retailer.id;
            return (
              <div
                key={retailer.id}
                className={`border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2.5 duration-300 fill-mode-both ${isLocal ? look.goldBorder : look.cardBorder} ${look.cardBg}`}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : retailer.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  <span className={`shrink-0 size-10 rounded-full flex items-center justify-center ${isLocal ? look.goldBg : look.iconIdle}`}>
                    {typeIcon(retailer.type)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{retailer.name}</span>
                      {isLocal && <span className={`text-[10px] font-mono px-2 py-0.5 ${look.gold} ${look.goldBg}`}>{t("NEAR YOU", "近く")}</span>}
                      <span className={`text-[10px] font-mono px-2 py-0.5 border ${look.textMuted} ${look.cardBorder}`}>{typeLabel(retailer.type)}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5" aria-label={`${retailer.rating} / 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} aria-hidden="true" size={10} className={i < retailer.rating ? look.starOn : look.textMuted} />
                        ))}
                      </span>
                      <span className={`text-xs ${look.textMuted}`}>{priceLevelLabels[retailer.priceLevel]?.icon}</span>
                      {retailer.city && (
                        <span className={`text-xs ${look.textMuted}`}>
                          {retailer.city}, {retailer.state}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className={`shrink-0 ${look.textMuted}`}>
                    {isExpanded ? <ChevronUp aria-hidden="true" size={16} /> : <ChevronDown aria-hidden="true" size={16} />}
                  </span>
                </button>

                {isExpanded && (
                  <div className={`px-5 pb-5 pt-0 border-t ml-0 sm:ml-14 animate-in fade-in duration-300 ${look.cardBorder}`}>
                    <p className={`text-sm leading-relaxed mt-4 mb-4 ${look.textMuted}`}>{t(retailer.description, retailer.descriptionJa)}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {retailer.specialties.map((s) => (
                        <span key={s} className={`text-[10px] px-2 py-1 ${look.goldBg} ${look.gold}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className={`text-xs mb-3 ${look.textMuted}`}>
                      <span className="font-mono">{t("Serves:", "対象地域:")}</span>{" "}
                      {retailer.states.includes("ALL") ? t("Nationwide", "全国") : retailer.states.join(", ")}
                    </div>
                    {retailer.url && (
                      <a
                        href={retailer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs border transition-all duration-300 ${look.goldBorder} ${look.gold} ${look.hoverBg}`}
                        data-affiliate={retailer.affiliateReady ? "ready" : "none"}
                      >
                        <ExternalLink aria-hidden="true" size={12} />
                        {t("Visit Website", "ウェブサイトを訪問")}
                      </a>
                    )}
                    {retailer.affiliateReady && <span className={`ml-3 text-[10px] font-mono ${look.textMuted}`}>{t("Partner retailer", "パートナー販売店")}</span>}
                  </div>
                )}
              </div>
            );
          })}

          {filteredRetailers.length === 0 && (
            <div className={`text-center py-16 ${look.textMuted}`}>
              <MapPin aria-hidden="true" size={32} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t("No retailers found for this area", "この地域の販売店が見つかりません")}</p>
              <p className="text-sm mt-2">{t("Try a different ZIP code or check our online retailers", "別のZIPコードを試すか、オンライン販売店をチェック")}</p>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter("online");
                  setSearched(false);
                }}
                className={`mt-4 px-4 py-2 text-sm border ${look.goldBorder} ${look.gold}`}
              >
                {t("Show Online Retailers", "オンライン販売店を表示")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Buying tips */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-sk-display text-xl font-bold mb-6 text-center ${look.gold}`}>{t("Sake Buying Tips", "日本酒購入のヒント")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div key={tip.en} className={`p-5 border ${look.cardBorder} ${look.cardBg}`}>
                <tip.icon aria-hidden="true" className={`size-6 mb-3 ${look.gold}`} />
                <p className={`text-sm leading-relaxed ${look.textMuted}`}>{t(tip.en, tip.ja)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
