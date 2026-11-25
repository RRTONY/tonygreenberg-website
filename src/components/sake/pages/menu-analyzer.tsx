"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calculator,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Loader2,
  MessageCircle,
  Plus,
  Tag,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { useToolPalette } from "@/components/sake/tool-palette";
import { qprSakeDatabase, restaurantMarkupGuide } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath } from "@/lib/content/sake/nav";
import type { MenuAnalysis } from "@/lib/content/sake/scanner";

// Ported from the Sake app's client/src/pages/MenuAnalyzer.tsx (2026-11-26): quick retail lookup,
// the markup guide, menu rows analysed one by one or all together (now /api/sake/menu-analyzer, Claude,
// with the app's prompt), and the best value on the menu.
// Changed (rule 18 and 20): the tips' emoji (🎯 🏷️ 📊 💬) and the trophy (🏆) are lucide icons, the
// 🇺🇸/🇯🇵 flags next to prices are "US"/"JP", the typed → is an arrow icon; the markup guide is in the
// page's HTML even when closed (hidden, not removed) and follows the EN/JP switch (the app always showed
// its English guide although the Japanese one was in its data); the guide's color dots use a class per
// color; inputs have labels for screen readers.

type MenuItem = {
  id: string;
  sakeName: string;
  menuPrice: number;
  servingSize: string;
  analysis?: MenuAnalysis;
  isAnalyzing?: boolean;
  error?: string;
};

const servingSizes = [
  { value: "90ml ochoko", label: "90ml Ochoko (お猪口)" },
  { value: "180ml glass", label: "180ml Glass (一合)" },
  { value: "300ml tokkuri", label: "300ml Tokkuri (徳利)" },
  { value: "720ml bottle", label: "720ml Bottle (四合瓶)" },
  { value: "1800ml ishobin", label: "1800ml Ishobin (一升瓶)" },
];

const verdictConfig: Record<string, { color: string; icon: LucideIcon; label: string; labelJa: string }> = {
  incredible_deal: { color: "text-yellow-400", icon: TrendingUp, label: "INCREDIBLE DEAL", labelJa: "信じられないお得" },
  great_value: { color: "text-green-400", icon: TrendingUp, label: "GREAT VALUE", labelJa: "素晴らしい価値" },
  standard: { color: "text-blue-400", icon: DollarSign, label: "STANDARD", labelJa: "標準" },
  premium: { color: "text-orange-400", icon: TrendingDown, label: "PREMIUM MARKUP", labelJa: "プレミアム" },
  tourist_trap: { color: "text-red-400", icon: AlertTriangle, label: "TOURIST TRAP", labelJa: "観光客罠" },
};

/** The guide's tier colors (restaurantMarkupGuide), as classes. */
const TIER_DOT: Record<string, string> = {
  "#FFD700": "bg-[#FFD700]",
  "#C9A227": "bg-[#C9A227]",
  "#6B8E6B": "bg-[#6B8E6B]",
  "#8B8B8B": "bg-[#8B8B8B]",
  "#8B4513": "bg-[#8B4513]",
};
const TIER_TEXT: Record<string, string> = {
  "#FFD700": "text-[#FFD700]",
  "#C9A227": "text-[#C9A227]",
  "#6B8E6B": "text-[#6B8E6B]",
  "#8B8B8B": "text-[#8B8B8B]",
  "#8B4513": "text-[#8B4513]",
};

const TIPS: { icon: LucideIcon; en: string; ja: string }[] = [
  {
    icon: Target,
    en: "Order by the glass first. If you like it, upgrade to a tokkuri — the per-mL price usually drops.",
    ja: "まずグラスで注文。気に入ったら徳利にアップグレード — mLあたりの価格は通常下がる。",
  },
  {
    icon: Tag,
    en: "House sake (店の酒) is often the best QPR. Restaurants negotiate bulk pricing on their house pour.",
    ja: "店の酒は多くの場合最高のQPR。レストランはハウスポアの大量購入価格を交渉している。",
  },
  {
    icon: BarChart3,
    en: "Junmai and Tokubetsu Junmai usually have the lowest markup. Daiginjo gets the highest premium.",
    ja: "純米と特別純米は通常最も低いマークアップ。大吟醸が最も高いプレミアム。",
  },
  {
    icon: MessageCircle,
    en: 'Ask the sommelier: "What\'s drinking well tonight?" This signals you trust their palate and they\'ll often steer you to the best value.',
    ja: "ソムリエに聞く：「今夜のおすすめは？」これはあなたが彼らの味覚を信頼していることを示し、最高の価値に導いてくれることが多い。",
  },
];

async function requestAnalysis(item: MenuItem): Promise<MenuAnalysis> {
  const res = await fetch("/api/sake/menu-analyzer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sakeName: item.sakeName, menuPrice: item.menuPrice, servingSize: item.servingSize }),
  });
  const body = (await res.json().catch(() => ({}))) as { analysis?: MenuAnalysis; message?: string };
  if (!res.ok || !body.analysis) throw new Error(body.message || "Failed to analyze menu item. Please try again.");
  return body.analysis;
}

export function SakeMenuAnalyzer() {
  const { t, lang } = useLanguage();
  const { isConnoisseur } = useMode();
  const k = useToolPalette();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([{ id: "1", sakeName: "", menuPrice: 0, servingSize: "300ml tokkuri" }]);
  const [showGuide, setShowGuide] = useState(false);
  const [quickLookup, setQuickLookup] = useState("");

  const quickResults = useMemo(() => {
    if (!quickLookup.trim()) return [];
    const q = quickLookup.toLowerCase();
    return qprSakeDatabase
      .filter((s) => s.name.toLowerCase().includes(q) || s.nameJa.includes(q) || s.brewery.toLowerCase().includes(q))
      .slice(0, 5);
  }, [quickLookup]);

  const addItem = () => setMenuItems((prev) => [...prev, { id: String(Date.now()), sakeName: "", menuPrice: 0, servingSize: "300ml tokkuri" }]);
  const removeItem = (id: string) => setMenuItems((prev) => prev.filter((item) => item.id !== id));
  const updateItem = (id: string, patch: Partial<Pick<MenuItem, "sakeName" | "menuPrice" | "servingSize">>) =>
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const analyzeItem = async (item: MenuItem) => {
    if (!item.sakeName || !item.menuPrice) return;
    setMenuItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isAnalyzing: true, error: undefined } : i)));
    try {
      const analysis = await requestAnalysis(item);
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, analysis, isAnalyzing: false } : i)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze menu item. Please try again.";
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, error: message, isAnalyzing: false } : i)));
    }
  };

  const analyzeAll = async () => {
    for (const item of menuItems.filter((i) => i.sakeName && i.menuPrice > 0 && !i.analysis)) await analyzeItem(item);
  };

  const guideData = lang === "ja" ? restaurantMarkupGuide.ja : restaurantMarkupGuide.en;

  const bestValue = useMemo(() => {
    const analyzed = menuItems.filter((i): i is MenuItem & { analysis: MenuAnalysis } => Boolean(i.analysis));
    if (analyzed.length < 2) return null;
    return analyzed.reduce((best, item) => (item.analysis.markupMultiple < best.analysis.markupMultiple ? item : best));
  }, [menuItems]);

  const card = `border ${k.cardBorder} ${k.cardBg}`;
  const input = `w-full border ${k.inputBg} ${k.textMain} focus:outline-none`;

  return (
    <div className={`min-h-screen ${k.pageBg} ${k.textMain}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${k.gold}`}>{t("Restaurant Intelligence", "レストラン・インテリジェンス")}</p>
            <h1 className="font-sk-display text-5xl sm:text-6xl lg:text-7xl font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-wider">
              {t("Menu", "メニュー")} <span className={k.isAustere ? k.gold : `${k.gold} gold-shimmer`}>{t("Analyzer", "アナライザー")}</span>
            </h1>
            <p className={`mt-6 max-w-2xl mx-auto text-lg ${k.textMuted}`}>
              {t(
                "Enter sake names and prices from any restaurant menu. We'll calculate the markup, compare to retail, and tell you which bottle is the best value on the menu.",
                "レストランメニューから酒名と価格を入力。マークアップを計算し、小売価格と比較し、メニューで最も価値のあるボトルを教えます。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Quick lookup */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`p-6 ${card}`}>
            <h2 className={`text-sm font-mono mb-3 flex items-center gap-2 ${k.gold}`}>
              <Wine aria-hidden="true" size={14} /> {t("Quick Retail Price Lookup", "小売価格クイック検索")}
            </h2>
            <input
              type="text"
              value={quickLookup}
              onChange={(e) => setQuickLookup(e.target.value)}
              aria-label={t("Quick Retail Price Lookup", "小売価格クイック検索")}
              placeholder={t("Type a sake name to see retail price...", "酒名を入力して小売価格を確認...")}
              className={`px-4 py-2.5 text-sm transition-colors ${input} ${k.focusGold}`}
            />
            {quickResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {quickResults.map((sake) => (
                  <Link
                    key={sake.id}
                    href={sakeDetailPath(sake.id)}
                    className={`flex flex-wrap items-center justify-between gap-2 p-3 border text-sm hover:bg-[oklch(0.78_0.12_85/0.05)] transition-colors rounded group ${k.cardBorder}`}
                  >
                    <div>
                      <span className="font-medium">{t(sake.name, sake.nameJa)}</span>
                      <span className={`ml-2 text-xs ${k.textMuted}`}>{sake.type}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      <span>US ${sake.priceUS}</span>
                      <span>JP ${sake.priceJapan}</span>
                      <span className={k.gold}>QPR {sake.qprUS}</span>
                      <ArrowRight aria-hidden="true" className={`size-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${k.gold}`} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Markup guide */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            aria-expanded={showGuide}
            aria-controls="sake-markup-guide"
            onClick={() => setShowGuide((s) => !s)}
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-300 ${card}`}
          >
            <Calculator aria-hidden="true" size={18} className={k.gold} />
            <span className="font-mono text-sm tracking-wider">{t("Markup Guide", "マークアップガイド")}</span>
            <span className="ml-auto">{showGuide ? <ChevronUp aria-hidden="true" size={16} /> : <ChevronDown aria-hidden="true" size={16} />}</span>
          </button>
          <div id="sake-markup-guide" hidden={!showGuide} className={`border border-t-0 p-6 animate-in fade-in ${k.cardBorder} ${k.cardBg}`}>
            <p className={`text-sm mb-4 leading-relaxed ${k.textMuted}`}>{guideData.explanation}</p>
            <div className="space-y-2">
              {guideData.tiers.map((tier) => (
                <div key={tier.markup} className={`flex items-center gap-3 p-3 border ${k.cardBorder}`}>
                  <div className={`size-3 rounded-full shrink-0 ${TIER_DOT[tier.color] ?? "bg-current"}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold">{tier.markup}</span>
                      <span className={`text-xs font-mono ${TIER_TEXT[tier.color] ?? ""}`}>{tier.verdict}</span>
                    </div>
                    <p className={`text-xs ${k.textMuted}`}>{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu items */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className={`font-sk-display text-lg font-bold ${k.gold}`}>{t("Enter Menu Items", "メニュー項目を入力")}</h2>
            <div className="flex gap-2">
              <button type="button" onClick={addItem} className={`flex items-center gap-1 px-3 py-1.5 text-xs border ${k.goldBorder} ${k.gold}`}>
                <Plus aria-hidden="true" size={12} /> {t("Add Item", "追加")}
              </button>
              <button
                type="button"
                onClick={() => void analyzeAll()}
                className={`flex items-center gap-1 px-4 py-1.5 text-xs border tracking-wider ${k.goldBg} ${k.goldBorder} ${k.gold}`}
              >
                <Calculator aria-hidden="true" size={12} /> {t("Analyze All", "全て分析")}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {menuItems.map((item, idx) => {
              const vc = item.analysis ? (verdictConfig[item.analysis.verdict] ?? verdictConfig.standard) : null;
              return (
                <div key={item.id} className={`p-5 animate-in fade-in slide-in-from-bottom-2.5 duration-300 ${card}`}>
                  <div className="flex items-start gap-3">
                    <span className={`font-mono text-xs mt-3 ${k.textMuted}`}>#{idx + 1}</span>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={item.sakeName}
                          onChange={(e) => updateItem(item.id, { sakeName: e.target.value })}
                          aria-label={t("Sake name", "酒名")}
                          placeholder={t("Sake name (e.g., Dassai 23)", "酒名（例：獺祭 二割三分）")}
                          maxLength={120}
                          className={`px-3 py-2 text-sm ${input}`}
                        />
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span aria-hidden="true" className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${k.textMuted}`}>
                              $
                            </span>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={item.menuPrice || ""}
                              onChange={(e) => updateItem(item.id, { menuPrice: parseFloat(e.target.value) || 0 })}
                              aria-label={t("Menu price", "メニュー価格")}
                              placeholder="0"
                              className={`pl-7 pr-3 py-2 text-sm ${input}`}
                            />
                          </div>
                          <select
                            value={item.servingSize}
                            onChange={(e) => updateItem(item.id, { servingSize: e.target.value })}
                            aria-label={t("Serving size", "提供サイズ")}
                            className={`px-2 py-2 text-xs border focus:outline-none ${k.inputBg} ${k.textMain}`}
                          >
                            {servingSizes.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void analyzeItem(item)}
                            disabled={!item.sakeName || !item.menuPrice || item.isAnalyzing}
                            className={`flex items-center gap-1 px-4 py-2 text-xs border disabled:opacity-30 transition-opacity ${k.goldBorder} ${k.gold}`}
                          >
                            {item.isAnalyzing ? <Loader2 aria-hidden="true" size={12} className="animate-spin" /> : <Calculator aria-hidden="true" size={12} />}
                            {t("Analyze", "分析")}
                          </button>
                          {menuItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={t("Remove item", "項目を削除")}
                              className={`flex items-center justify-center px-2 py-2 text-xs hover:text-red-400 transition-colors ${k.textMuted}`}
                            >
                              <Trash2 aria-hidden="true" size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {item.analysis && vc && (
                        <div className={`p-4 border mt-3 animate-in fade-in slide-in-from-bottom-1 duration-300 ${k.goldBorder} ${k.goldBg}`}>
                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className={`flex items-center gap-2 font-mono text-sm font-bold ${vc.color}`}>
                              <vc.icon aria-hidden="true" size={16} />
                              {t(vc.label, vc.labelJa)}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
                              <span>
                                {t("Markup:", "マークアップ:")} <strong className={k.gold}>{item.analysis.markupMultiple.toFixed(1)}x</strong>
                              </span>
                              <span>
                                {t("Retail:", "小売:")} <strong>${item.analysis.retailPriceUS}</strong> (720ml)
                              </span>
                              <span className={k.textMuted}>
                                {t("Type:", "タイプ:")} {item.analysis.sakeType}
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs leading-relaxed ${k.textMuted}`}>{item.analysis.explanation}</p>
                          {isConnoisseur && (
                            <div className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono ${k.cardBorder} ${k.textMuted}`}>
                              <div>
                                {t("$/mL menu:", "$/mL メニュー:")} ${item.analysis.pricePerML.toFixed(3)}
                              </div>
                              <div>
                                {t("$/mL retail:", "$/mL 小売:")} ${item.analysis.retailPerML.toFixed(3)}
                              </div>
                              <div>
                                {t("Quality:", "品質:")} {item.analysis.qualityTier}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {item.error && (
                        <div role="alert" className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                          {item.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {bestValue && (
            <div className={`mt-8 p-6 border-2 text-center animate-in fade-in slide-in-from-bottom-2.5 duration-300 ${k.goldBorder} ${k.goldBg}`}>
              <div className={`inline-flex items-center gap-1.5 text-xs font-mono tracking-wider mb-2 ${k.gold}`}>
                <Trophy aria-hidden="true" className="size-3.5" /> {t("BEST VALUE ON THIS MENU", "このメニューで最もお得")}
              </div>
              <div className={`font-sk-display text-2xl font-bold ${k.gold}`}>{bestValue.sakeName}</div>
              <div className={`text-sm mt-2 font-mono ${k.textMuted}`}>
                {bestValue.analysis.markupMultiple.toFixed(1)}x {t("markup", "マークアップ")} · ${bestValue.menuPrice} {t("for", "")}{" "}
                {bestValue.servingSize}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Strategy tips */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-sk-display text-xl font-bold mb-6 text-center ${k.gold}`}>{t("Restaurant Sake Strategy", "レストラン日本酒戦略")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.en} className={`p-5 ${card}`}>
                <tip.icon aria-hidden="true" className={`size-6 mb-3 ${k.gold}`} />
                <p className={`text-sm leading-relaxed ${k.textMuted}`}>{t(tip.en, tip.ja)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
