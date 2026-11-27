"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompare, Plus, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAesthetic, useLanguage, useSakePortalClass } from "@/components/sake/sake-providers";
import { unifiedSakeDatabase, type UnifiedSake } from "@/lib/content/sake/unified-sake-data";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";
import { cn } from "@/lib/utils";

// Ported from the Sake app's client/src/pages/Compare.tsx (2026-11-26): pick 2 or 3 sakes and compare
// EVI/EEI bars, aroma radars, quality scores and an attribute table; `?ids=a,b,c` preselects them.
// The three slot colors per look are precomposed class strings (SLOTS); the app's inline colors and
// framer-motion are classes (score bars slide in from the left, cards fade/zoom in).
// Fixed (rule 20):
// - The app's class names built from fragments (`grid-cols-${n}`, `hover:${textMain}`,
//   `hover:${goldText}`) never produced CSS: the aroma grid didn't lay out in columns and those hovers
//   did nothing. They're written out now.
// - Tinted chips and the "View" buttons appended a hex alpha to an oklch color (`oklch(...)22`), which
//   isn't valid CSS, so they had no background or border; they use a real 13%/27% tint now.
// - "View <sake>" links only appear for sakes that have a detail page (the QPR database); the app
//   linked every sake, and the ones only in the collection data went to a "not found" page.
// - The picker is the site's Dialog (focus trap, Escape, labelled); the table scrolls sideways inside
//   its box on phones; ?ids= is read without an effect so the page still renders on the server.

const MAX_COMPARE = 3;
const detailIds = new Set(qprSakeDatabase.map((s) => s.id));

const SLOTS = {
  kintsugi: [
    {
      color: "oklch(0.78 0.12 85)",
      border: "border-[oklch(0.78_0.12_85)]",
      dot: "bg-[oklch(0.78_0.12_85)]",
      text: "text-[oklch(0.78_0.12_85)]",
      chip: "bg-[oklch(0.78_0.12_85/0.13)] text-[oklch(0.78_0.12_85)]",
      view: "bg-[oklch(0.78_0.12_85/0.13)] text-[oklch(0.78_0.12_85)] border border-[oklch(0.78_0.12_85/0.27)]",
    },
    {
      color: "oklch(0.60 0.18 200)",
      border: "border-[oklch(0.60_0.18_200)]",
      dot: "bg-[oklch(0.60_0.18_200)]",
      text: "text-[oklch(0.60_0.18_200)]",
      chip: "bg-[oklch(0.60_0.18_200/0.13)] text-[oklch(0.60_0.18_200)]",
      view: "bg-[oklch(0.60_0.18_200/0.13)] text-[oklch(0.60_0.18_200)] border border-[oklch(0.60_0.18_200/0.27)]",
    },
    {
      color: "oklch(0.65 0.15 140)",
      border: "border-[oklch(0.65_0.15_140)]",
      dot: "bg-[oklch(0.65_0.15_140)]",
      text: "text-[oklch(0.65_0.15_140)]",
      chip: "bg-[oklch(0.65_0.15_140/0.13)] text-[oklch(0.65_0.15_140)]",
      view: "bg-[oklch(0.65_0.15_140/0.13)] text-[oklch(0.65_0.15_140)] border border-[oklch(0.65_0.15_140/0.27)]",
    },
  ],
  austere: [
    {
      color: "oklch(0.52 0.19 30)",
      border: "border-[oklch(0.52_0.19_30)]",
      dot: "bg-[oklch(0.52_0.19_30)]",
      text: "text-[oklch(0.52_0.19_30)]",
      chip: "bg-[oklch(0.52_0.19_30/0.13)] text-[oklch(0.52_0.19_30)]",
      view: "bg-[oklch(0.52_0.19_30/0.13)] text-[oklch(0.52_0.19_30)] border border-[oklch(0.52_0.19_30/0.27)]",
    },
    {
      color: "oklch(0.45 0.15 200)",
      border: "border-[oklch(0.45_0.15_200)]",
      dot: "bg-[oklch(0.45_0.15_200)]",
      text: "text-[oklch(0.45_0.15_200)]",
      chip: "bg-[oklch(0.45_0.15_200/0.13)] text-[oklch(0.45_0.15_200)]",
      view: "bg-[oklch(0.45_0.15_200/0.13)] text-[oklch(0.45_0.15_200)] border border-[oklch(0.45_0.15_200/0.27)]",
    },
    {
      color: "oklch(0.50 0.18 140)",
      border: "border-[oklch(0.50_0.18_140)]",
      dot: "bg-[oklch(0.50_0.18_140)]",
      text: "text-[oklch(0.50_0.18_140)]",
      chip: "bg-[oklch(0.50_0.18_140/0.13)] text-[oklch(0.50_0.18_140)]",
      view: "bg-[oklch(0.50_0.18_140/0.13)] text-[oklch(0.50_0.18_140)] border border-[oklch(0.50_0.18_140/0.27)]",
    },
  ],
} as const;

type Slot = (typeof SLOTS)["kintsugi"][number] | (typeof SLOTS)["austere"][number];

const LOOK = {
  kintsugi: {
    goldText: "text-[oklch(0.78_0.12_85)]",
    goldBorder: "border-[oklch(0.78_0.12_85/0.2)]",
    cardBg: "bg-[oklch(0.16_0.03_270)]",
    cardBorder: "border-[oklch(0.28_0.04_270)]",
    textMain: "text-[oklch(0.96_0.01_85)]",
    textMuted: "text-[oklch(0.55_0.02_270)]",
    textSoft: "text-[oklch(0.65_0.01_85)]",
    page: "min-h-screen bg-background pt-16",
    input: "bg-[oklch(0.2_0.03_270)] border-[oklch(0.28_0.04_270)] text-[oklch(0.85_0.01_85)]",
    h1: "font-sk-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[oklch(0.96_0.01_85)]",
    shimmer: "gold-shimmer",
    track: "bg-[oklch(0.2_0.03_270)]",
    mutedHover: "text-[oklch(0.55_0.02_270)] hover:text-[oklch(0.96_0.01_85)]",
    changeHover: "text-[oklch(0.55_0.02_270)] hover:text-[oklch(0.78_0.12_85)]",
    emptySlotHover: "hover:border-[oklch(0.78_0.12_85/0.4)]",
    rowBorder: "border-[oklch(0.2_0.03_270)]",
    rowAlt: "bg-[oklch(0.14_0.02_270)]",
    cell: "text-[oklch(0.85_0.01_85)]",
    browseHover: "hover:bg-[oklch(0.78_0.12_85/0.1)]",
    dialog: "bg-[oklch(0.14_0.03_270)] border-[oklch(0.78_0.12_85/0.2)]",
    dialogRule: "border-[oklch(0.28_0.04_270)]",
    pickSelected: "bg-[oklch(0.2_0.03_270)] opacity-50",
    pickHover: "hover:bg-[oklch(0.2_0.03_270)]",
    radarGrid: "#333",
    radarLabel: "#666",
  },
  austere: {
    goldText: "text-red-800",
    goldBorder: "border-red-800/30",
    cardBg: "bg-stone-100",
    cardBorder: "border-stone-300",
    textMain: "text-stone-900",
    textMuted: "text-stone-500",
    textSoft: "text-stone-700",
    page: "min-h-screen bg-stone-50 pt-16",
    input: "bg-white border-stone-300 text-stone-900",
    h1: "font-sk-display text-4xl sm:text-5xl lg:text-6xl font-light text-stone-900",
    shimmer: "text-red-800",
    track: "bg-stone-300",
    mutedHover: "text-stone-500 hover:text-stone-900",
    changeHover: "text-stone-500 hover:text-red-800",
    emptySlotHover: "hover:border-red-800/40",
    rowBorder: "border-stone-200",
    rowAlt: "bg-stone-50",
    cell: "text-stone-800",
    browseHover: "hover:bg-red-800/5",
    dialog: "bg-stone-50 border-stone-300",
    dialogRule: "border-[#d6d3d1]",
    pickSelected: "bg-stone-200 opacity-50",
    pickHover: "hover:bg-stone-200",
    radarGrid: "#d6d3d1",
    radarLabel: "#a8a29e",
  },
} as const;

type Look = (typeof LOOK)[keyof typeof LOOK];

/** Slot grid columns by how many sakes are chosen (the app's rule, written out). */
const SLOT_GRID = ["grid-cols-1 sm:grid-cols-3", "grid-cols-1 sm:grid-cols-3", "grid-cols-2 sm:grid-cols-3", "grid-cols-3"] as const;
/** Aroma radar columns: one per chosen sake. */
const AROMA_GRID: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-3" };

function ScoreBar({ value, maxVal = 10, slot, look }: { value: number; maxVal?: number; slot: Slot; look: Look }) {
  const pct = Math.min(100, (value / maxVal) * 100);
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${look.track}`}>
      <div
        className={`h-full rounded-full animate-in slide-in-from-left-full duration-800 ease-out ${slot.dot}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const ALL_AROMAS = ["floral", "fruity", "herbal", "earthy", "umami", "mineral", "spicy", "citrus"];

function AromaRadar({ aromas, color, look }: { aromas: string[]; color: string; look: Look }) {
  const present = new Set(aromas.map((a) => a.toLowerCase()));
  const cx = 60;
  const cy = 60;
  const r = 45;
  const angleOf = (i: number) => (Math.PI * 2 * i) / ALL_AROMAS.length - Math.PI / 2;
  return (
    <svg viewBox="0 0 120 120" className="w-full max-w-35 mx-auto" role="img" aria-label={aromas.join(", ")}>
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          key={scale}
          points={ALL_AROMAS.map((_, i) => `${cx + r * scale * Math.cos(angleOf(i))},${cy + r * scale * Math.sin(angleOf(i))}`).join(" ")}
          fill="none"
          stroke={look.radarGrid}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      <polygon
        points={ALL_AROMAS.map((a, i) => {
          const val = present.has(a) ? 1 : 0.1;
          return `${cx + r * val * Math.cos(angleOf(i))},${cy + r * val * Math.sin(angleOf(i))}`;
        }).join(" ")}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth="1.5"
      />
      {ALL_AROMAS.map((a, i) => (
        <text
          key={a}
          x={cx + (r + 12) * Math.cos(angleOf(i))}
          y={cy + (r + 12) * Math.sin(angleOf(i))}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="5"
          fill={present.has(a) ? color : look.radarLabel}
          fontWeight={present.has(a) ? "bold" : "normal"}
        >
          {a.slice(0, 4)}
        </text>
      ))}
    </svg>
  );
}

const noSubscribe = () => () => {};
const readIdsParam = () => new URLSearchParams(window.location.search).get("ids") ?? "";
const noIdsParam = () => "";

/** The `?ids=` list: known sake ids only, at most three (the app's rule). */
export function parseIds(param: string) {
  return param
    .split(",")
    .filter((id) => unifiedSakeDatabase.some((s) => s.id === id))
    .slice(0, MAX_COMPARE);
}

export function SakeCompare() {
  const { lang, t } = useLanguage();
  const { isAustere } = useAesthetic();
  const portalClass = useSakePortalClass();
  const look = isAustere ? LOOK.austere : LOOK.kintsugi;
  const slots = isAustere ? SLOTS.austere : SLOTS.kintsugi;

  const idsParam = useSyncExternalStore(noSubscribe, readIdsParam, noIdsParam);
  const urlIds = useMemo(() => parseIds(idsParam), [idsParam]);
  const [chosen, setChosen] = useState<string[] | null>(null);
  const selectedIds = chosen ?? urlIds;

  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);

  const selectedSakes = useMemo(
    () => selectedIds.map((id) => unifiedSakeDatabase.find((s) => s.id === id)).filter((s): s is UnifiedSake => s != null),
    [selectedIds],
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return unifiedSakeDatabase.slice(0, 20);
    const q = searchQuery.toLowerCase();
    return unifiedSakeDatabase
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameJa.includes(q) ||
          s.brewery.toLowerCase().includes(q) ||
          s.prefecture.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [searchQuery]);

  const addSake = (id: string) => {
    const next = [...selectedIds];
    next[slotIndex] = id;
    setChosen(next.filter(Boolean));
    setShowPicker(false);
    setSearchQuery("");
  };
  const removeSake = (index: number) => setChosen(selectedIds.filter((_, i) => i !== index));
  const openPicker = (index: number) => {
    setSlotIndex(index);
    setShowPicker(true);
    setSearchQuery("");
  };

  const comparisonRows = [
    { label: t("Type", "種類"), getValue: (s: UnifiedSake) => (lang === "ja" ? s.typeJa : s.type) },
    { label: t("Brewery", "蔵元"), getValue: (s: UnifiedSake) => (lang === "ja" ? s.breweryJa : s.brewery) },
    { label: t("Prefecture", "産地"), getValue: (s: UnifiedSake) => (lang === "ja" ? s.prefectureJa : s.prefecture) },
    { label: t("Rice", "米"), getValue: (s: UnifiedSake) => (lang === "ja" ? s.riceJa : s.rice) },
    { label: t("Polish Ratio", "精米歩合"), getValue: (s: UnifiedSake) => `${s.polishRatio}%` },
    { label: t("ABV", "度数"), getValue: (s: UnifiedSake) => `${s.abv}%` },
    { label: t("SMV", "日本酒度"), getValue: (s: UnifiedSake) => `${s.smv > 0 ? "+" : ""}${s.smv}` },
    { label: t("Acidity", "酸度"), getValue: (s: UnifiedSake) => `${s.acidity}` },
    { label: t("Serving Temp", "提供温度"), getValue: (s: UnifiedSake) => (lang === "ja" ? s.servingTempJa : s.servingTemp) },
    { label: t("Price Range", "価格帯"), getValue: (s: UnifiedSake) => (s.priceUS ? `$${s.priceUS} (${s.priceRange})` : s.priceRange) },
    { label: t("QPR Tier", "QPRティア"), getValue: (s: UnifiedSake) => (s.qprTier ? s.qprTier.charAt(0).toUpperCase() + s.qprTier.slice(1) : "—") },
    { label: t("US Availability", "米国入手性"), getValue: (s: UnifiedSake) => s.usAvailability || "—" },
  ];

  return (
    <div className={look.page}>
      {/* Header */}
      <section className="py-12 lg:py-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={sk("/collection")} className={`inline-flex items-center gap-2 text-sm mb-6 hover:underline ${look.goldText}`}>
            <ArrowLeft aria-hidden="true" size={14} />
            {t("Back to Collection", "コレクションに戻る")}
          </Link>
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className={look.h1}>
              <GitCompare aria-hidden="true" size={36} className={`inline mr-3 ${look.goldText}`} />
              {t("Compare", "比較")} <span className={look.shimmer}>{t("Sakes", "日本酒")}</span>
            </h1>
            <p className={`mt-3 max-w-xl text-lg ${look.textSoft}`}>
              {t(
                "Select 2 or 3 sakes to compare side-by-side. Scores, aroma profiles, pricing, and key attributes laid bare.",
                "2〜3銘柄を選んで並べて比較。スコア、香りプロファイル、価格、主要属性を一目で。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Slots */}
      <section className="pb-8">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-4 ${SLOT_GRID[selectedSakes.length]}`}>
            {selectedSakes.map((sake, i) => {
              const slot = slots[i];
              return (
                <div key={sake.id} className={`border-2 p-5 relative min-w-0 animate-in fade-in zoom-in-95 duration-300 ${look.cardBg} ${slot.border}`}>
                  <button
                    type="button"
                    onClick={() => removeSake(i)}
                    aria-label={t("Remove", "削除")}
                    title={t("Remove", "削除")}
                    className={`absolute top-1 right-1 flex items-center justify-center p-1 rounded-full transition-colors ${look.mutedHover}`}
                  >
                    <X aria-hidden="true" size={16} />
                  </button>
                  <div className={`size-3 rounded-full mb-3 ${slot.dot}`} />
                  <h3 className={`font-sk-display text-lg font-bold pr-8 ${look.textMain}`}>{lang === "ja" ? sake.nameJa : sake.name}</h3>
                  <p className={`mt-1 text-xs ${look.textMuted}`}>
                    {lang === "ja" ? sake.breweryJa : sake.brewery} · {lang === "ja" ? sake.prefectureJa : sake.prefecture}
                  </p>
                  <div className="mt-3 space-y-2">
                    {(["evi", "eei"] as const).map((key) => (
                      <div key={key}>
                        <div className="flex justify-between text-[10px] tracking-wider uppercase mb-1">
                          <span className={look.textMuted}>{key.toUpperCase()}</span>
                          <span className={`font-bold ${slot.text}`}>{sake[key].toFixed(1)}</span>
                        </div>
                        <ScoreBar value={sake[key]} slot={slot} look={look} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => openPicker(i)} className={`mt-3 w-full text-center text-xs transition-colors py-1 ${look.changeHover}`}>
                    {t("Change sake", "変更する")}
                  </button>
                </div>
              );
            })}

            {Array.from({ length: MAX_COMPARE - selectedSakes.length }, (_, i) => (
              <button
                type="button"
                key={`empty-${i}`}
                onClick={() => openPicker(selectedSakes.length + i)}
                className={`border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 min-h-50 transition-all duration-300 animate-in fade-in fill-mode-both ${look.cardBg} ${look.cardBorder} ${look.emptySlotHover}`}
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <Plus aria-hidden="true" size={32} className={look.textMuted} />
                <span className={`text-sm ${look.textMuted}`}>{t("Add sake to compare", "比較する日本酒を追加")}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      {selectedSakes.length >= 2 && (
        <section className="pb-16">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className={`border p-6 mb-6 ${look.cardBg} ${look.cardBorder}`}>
                <h2 className={`text-xs tracking-[0.15em] uppercase mb-4 font-bold ${look.goldText}`}>
                  {t("Aroma Profile Comparison", "香りプロファイル比較")}
                </h2>
                <div className={`grid gap-4 ${AROMA_GRID[selectedSakes.length] ?? "grid-cols-3"}`}>
                  {selectedSakes.map((sake, i) => (
                    <div key={sake.id} className="text-center min-w-0">
                      <AromaRadar aromas={sake.aromaProfile} color={slots[i].color} look={look} />
                      <p className={`mt-2 text-xs font-bold ${look.textMain}`}>{lang === "ja" ? sake.nameJa : sake.name}</p>
                      <div className="mt-1 flex flex-wrap justify-center gap-1">
                        {sake.aromaProfile.map((a) => (
                          <span key={a} className={`text-[9px] px-1.5 py-0.5 rounded-sm ${slots[i].chip}`}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`border p-6 mb-6 ${look.cardBg} ${look.cardBorder}`}>
                <h2 className={`text-xs tracking-[0.15em] uppercase mb-4 font-bold ${look.goldText}`}>{t("Score Comparison", "スコア比較")}</h2>
                {(["EVI", "EEI"] as const).map((metric) => {
                  const valueOf = (s: UnifiedSake) => (metric === "EVI" ? s.evi : s.eei);
                  const maxVal = Math.max(...selectedSakes.map(valueOf));
                  return (
                    <div key={metric} className="mb-4">
                      <div className={`text-[10px] tracking-[0.15em] uppercase mb-2 ${look.textMuted}`}>{metric}</div>
                      <div className="space-y-2">
                        {selectedSakes.map((sake, i) => (
                          <div key={sake.id} className="flex items-center gap-3">
                            <div className={`size-3 rounded-full shrink-0 ${slots[i].dot}`} />
                            <div className="flex-1">
                              <ScoreBar value={valueOf(sake)} slot={slots[i]} look={look} />
                            </div>
                            <span className={`font-mono text-sm font-bold w-10 text-right ${slots[i].text}`}>{valueOf(sake).toFixed(1)}</span>
                            {valueOf(sake) === maxVal && (
                              <span className={`text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5 rounded-sm ${slots[i].chip}`}>{t("BEST", "最高")}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {selectedSakes.some((s) => s.qualityScore != null) && (
                  <div className="mb-4">
                    <div className={`text-[10px] tracking-[0.15em] uppercase mb-2 ${look.textMuted}`}>{t("Quality Score", "品質スコア")}</div>
                    <div className="space-y-2">
                      {selectedSakes.map((sake, i) => (
                        <div key={sake.id} className="flex items-center gap-3">
                          <div className={`size-3 rounded-full shrink-0 ${slots[i].dot}`} />
                          <div className="flex-1">
                            <ScoreBar value={sake.qualityScore || 0} maxVal={100} slot={slots[i]} look={look} />
                          </div>
                          <span className={`font-mono text-sm font-bold w-10 text-right ${slots[i].text}`}>{sake.qualityScore || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`border overflow-x-auto ${look.cardBg} ${look.cardBorder}`}>
                <table className="w-full min-w-120 text-sm">
                  <thead>
                    <tr className={`border-b ${look.goldBorder}`}>
                      <th className={`text-left py-3 px-4 text-[10px] tracking-[0.15em] uppercase w-35 ${look.goldText}`}>{t("Attribute", "属性")}</th>
                      {selectedSakes.map((sake, i) => (
                        <th key={sake.id} className="py-3 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <div className={`size-2.5 rounded-full shrink-0 ${slots[i].dot}`} />
                            <span className={`text-xs font-bold truncate ${look.textMain}`}>{lang === "ja" ? sake.nameJa : sake.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, ri) => (
                      <tr key={row.label} className={ri % 2 === 0 ? `border-b ${look.rowBorder}` : `border-b ${look.rowBorder} ${look.rowAlt}`}>
                        <td className={`py-3 px-4 text-[10px] tracking-widest uppercase font-medium ${look.textMuted}`}>{row.label}</td>
                        {selectedSakes.map((sake) => (
                          <td key={sake.id} className={`py-3 px-4 text-sm ${look.cell}`}>
                            {row.getValue(sake)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className={`border-b ${look.rowBorder}`}>
                      <td className={`py-3 px-4 text-[10px] tracking-widest uppercase font-medium align-top ${look.textMuted}`}>{t("Flavor", "味わい")}</td>
                      {selectedSakes.map((sake) => (
                        <td key={sake.id} className={`py-3 px-4 text-sm italic ${look.textSoft}`}>
                          {lang === "ja" ? sake.flavorNotesJa : sake.flavorNotes}
                        </td>
                      ))}
                    </tr>
                    {selectedSakes.some((s) => s.pairingEn && s.pairingEn.length > 0) && (
                      <tr className={`border-b ${look.rowBorder}`}>
                        <td className={`py-3 px-4 text-[10px] tracking-widest uppercase font-medium align-top ${look.textMuted}`}>{t("Pairing", "ペアリング")}</td>
                        {selectedSakes.map((sake) => (
                          <td key={sake.id} className={`py-3 px-4 text-sm ${look.textSoft}`}>
                            {sake.pairingEn ? (lang === "ja" ? sake.pairingJa || sake.pairingEn : sake.pairingEn).join(", ") : "—"}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {selectedSakes.map((sake, i) =>
                  detailIds.has(sake.id) ? (
                    <Link
                      key={sake.id}
                      href={sakeDetailPath(sake.id)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-bold transition-all rounded-sm min-h-11 ${slots[i].view}`}
                    >
                      {t(`View ${lang === "ja" ? sake.nameJa : sake.name}`, `${sake.nameJa}を見る`)}
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedSakes.length < 2 && (
        <section className="pb-24">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`py-16 px-4 border ${look.cardBg} ${look.cardBorder}`}>
              <GitCompare aria-hidden="true" size={48} className={`mx-auto mb-4 ${look.textMuted}`} />
              <p className={`text-lg ${look.textMuted}`}>
                {t(
                  `Select at least 2 sakes to begin comparison. ${selectedSakes.length === 0 ? "Click the + buttons above." : "Add one more sake."}`,
                  `比較を開始するには2銘柄以上を選択してください。${selectedSakes.length === 0 ? "上の+ボタンをクリック。" : "もう1銘柄追加してください。"}`,
                )}
              </p>
              <Link
                href={sk("/collection")}
                className={`inline-flex items-center gap-2 mt-4 px-6 py-3 text-sm border transition-colors rounded-sm min-h-11 ${look.goldText} ${look.goldBorder} ${look.browseHover}`}
              >
                {t("Browse Collection", "コレクションを見る")}
              </Link>
            </div>
          </div>
        </section>
      )}

      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent
          showCloseButton={false}
          className={cn(portalClass, "p-0 gap-0 border max-w-lg sm:max-w-lg w-[calc(100%-2rem)] max-h-[70vh] overflow-hidden flex flex-col rounded-none", look.dialog)}
        >
          <DialogTitle className="sr-only">{t("Add sake to compare", "比較する日本酒を追加")}</DialogTitle>
          <DialogDescription className="sr-only">{t("Search sakes...", "日本酒を検索...")}</DialogDescription>
          <div className={`p-4 border-b ${look.dialogRule}`}>
            <div className="relative">
              <Search aria-hidden="true" size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${look.textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t("Search sakes...", "日本酒を検索...")}
                placeholder={t("Search sakes...", "日本酒を検索...")}
                className={`w-full pl-10 pr-4 py-3 text-sm border focus:outline-none rounded-sm ${look.input}`}
                autoFocus
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {searchResults.map((sake) => {
              const isSelected = selectedIds.includes(sake.id);
              return (
                <button
                  type="button"
                  key={sake.id}
                  onClick={() => !isSelected && addSake(sake.id)}
                  disabled={isSelected}
                  className={`w-full text-left p-3 rounded-sm transition-colors mb-1 min-h-12 ${isSelected ? look.pickSelected : look.pickHover}`}
                >
                  <span className={`block text-sm font-medium ${look.textMain}`}>
                    {lang === "ja" ? sake.nameJa : sake.name}
                    {isSelected && <span className={`ml-2 text-[10px] ${look.textMuted}`}>({t("already selected", "選択済み")})</span>}
                  </span>
                  <span className={`block text-xs mt-0.5 ${look.textMuted}`}>
                    {lang === "ja" ? sake.breweryJa : sake.brewery} · {lang === "ja" ? sake.prefectureJa : sake.prefecture} · {sake.type} · EEI{" "}
                    {sake.eei.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className={`p-3 border-t ${look.dialogRule}`}>
            <button type="button" onClick={() => setShowPicker(false)} className={`w-full py-2.5 text-sm transition-colors min-h-11 ${look.mutedHover}`}>
              {t("Cancel", "キャンセル")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
