"use client";

import { useState } from "react";
import { Info, ScatterChart, X } from "lucide-react";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { smvData, type SMVDataPoint } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/SMVMatrix.tsx (2026-11-26): the 4-quadrant SMV × acidity
// scatter plot with the category legend (hover/tap to highlight) and the detail panel. Dot and quadrant
// positions are computed from the data, so they stay runtime styles; the six category colors are
// precomposed class strings (the app used inline oklch colors). framer-motion in CSS: dots pop in
// (zoom + fade, staggered 0.04s each), scale 1.6x when selected and dim to 15% when another category
// is highlighted; the detail panel fades + slides 15px up.
// Changed (rule 20): hovering a legend entry highlights its category and clicking pins it (the app used
// one state for both, so on a desktop the click switched off the highlight the hover had just turned
// on, and on phones it couldn't be undone without tapping again); the panel's close button is a lucide X with a label (was a typed ✕), and each dot
// has an accessible name (the sake's name), since its hover tooltip isn't reachable by keyboard.

type Category = "daiginjo" | "junmai-daiginjo" | "ginjo" | "junmai" | "honjozo" | "yamahai";

const CATEGORIES: Record<Category, { label: string; swatch: string; dot: string; dotSelected: string; glow: string }> = {
  daiginjo: {
    label: "Daiginjo",
    swatch: "bg-[oklch(0.78_0.12_85)]",
    dot: "bg-[oklch(0.78_0.12_85)] border-[oklch(0.78_0.12_85)]",
    dotSelected: "bg-[oklch(0.78_0.12_85)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.78_0.12_85/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.78_0.12_85/0.3),transparent_70%)]",
  },
  "junmai-daiginjo": {
    label: "Junmai Daiginjo",
    swatch: "bg-[oklch(0.72_0.15_60)]",
    dot: "bg-[oklch(0.72_0.15_60)] border-[oklch(0.72_0.15_60)]",
    dotSelected: "bg-[oklch(0.72_0.15_60)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.72_0.15_60/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.72_0.15_60/0.3),transparent_70%)]",
  },
  ginjo: {
    label: "Ginjo",
    swatch: "bg-[oklch(0.65_0.18_150)]",
    dot: "bg-[oklch(0.65_0.18_150)] border-[oklch(0.65_0.18_150)]",
    dotSelected: "bg-[oklch(0.65_0.18_150)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.65_0.18_150/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.65_0.18_150/0.3),transparent_70%)]",
  },
  junmai: {
    label: "Junmai",
    swatch: "bg-[oklch(0.60_0.20_25)]",
    dot: "bg-[oklch(0.60_0.20_25)] border-[oklch(0.60_0.20_25)]",
    dotSelected: "bg-[oklch(0.60_0.20_25)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.60_0.20_25/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.60_0.20_25/0.3),transparent_70%)]",
  },
  honjozo: {
    label: "Honjozo",
    swatch: "bg-[oklch(0.65_0.15_200)]",
    dot: "bg-[oklch(0.65_0.15_200)] border-[oklch(0.65_0.15_200)]",
    dotSelected: "bg-[oklch(0.65_0.15_200)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.65_0.15_200/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.65_0.15_200/0.3),transparent_70%)]",
  },
  yamahai: {
    label: "Yamahai",
    swatch: "bg-[oklch(0.55_0.22_330)]",
    dot: "bg-[oklch(0.55_0.22_330)] border-[oklch(0.55_0.22_330)]",
    dotSelected: "bg-[oklch(0.55_0.22_330)] border-[oklch(0.96_0.01_85)] shadow-[0_0_12px_oklch(0.55_0.22_330/0.5)]",
    glow: "bg-[radial-gradient(circle,oklch(0.55_0.22_330/0.3),transparent_70%)]",
  },
};

const FALLBACK = CATEGORIES.daiginjo;
const categoryFor = (c: string) => CATEGORIES[c as Category] ?? FALLBACK;

// SMV (-8 to +8) → x (0% to 100%); acidity (0.6 to 2.6) → y (100% to 0%, high acidity at the top).
const smvToX = (smv: number) => ((smv + 8) / 16) * 100;
const acidToY = (acid: number) => 100 - ((acid - 0.6) / 2.0) * 100;
const centerX = smvToX(0);
const centerY = acidToY(1.4);

const STAT = "bg-[oklch(0.12_0.02_270)] p-4 border border-[oklch(0.78_0.12_85/0.08)]";
const STAT_LABEL = "font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1";
const QUADRANT_LABEL = "absolute font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight pointer-events-none";

export function SakeSmvMatrix() {
  const { t } = useLanguage();
  const { mode } = useMode();
  const [selected, setSelected] = useState<SMVDataPoint | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [pinnedCat, setPinnedCat] = useState<string | null>(null);
  const activeCat = hoveredCat ?? pinnedCat;

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-12 sm:py-20 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("The Hidden Geometry of Flavor", "味わいの隠れた幾何学")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <ScatterChart aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("SMV × Acidity Matrix", "日本酒度 × 酸度マトリクス")}
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t(
              "Sake Meter Value (SMV) measures density — negative is sweet, positive is dry. Cross it with acidity and hidden style families emerge from the data. Click any dot to explore.",
              "日本酒度は比重を測定 — マイナスは甘口、プラスは辛口。酸度と交差させると、データから隠れたスタイルファミリーが浮かび上がる。ドットをクリックして探索。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-8">
          {(Object.entries(CATEGORIES) as [Category, (typeof CATEGORIES)[Category]][]).map(([key, val]) => (
            <button
              type="button"
              key={key}
              aria-pressed={pinnedCat === key}
              onMouseEnter={() => setHoveredCat(key)}
              onMouseLeave={() => setHoveredCat(null)}
              onClick={() => setPinnedCat(pinnedCat === key ? null : key)}
              className={
                activeCat === key
                  ? "flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all duration-300 border-[oklch(0.78_0.12_85/0.5)] bg-[oklch(0.78_0.12_85/0.08)]"
                  : "flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all duration-300 border-[oklch(0.78_0.12_85/0.1)] hover:border-[oklch(0.78_0.12_85/0.3)]"
              }
            >
              <span className={`size-3 rounded-full ${val.swatch}`} />
              <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground">{val.label}</span>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative bg-[oklch(0.13_0.02_270)] border border-[oklch(0.78_0.12_85/0.12)] overflow-hidden">
          <div className="relative mx-10 sm:mx-14 my-10 sm:my-14 aspect-4/3">
            {/* Quadrant zones */}
            <div className="absolute inset-0">
              <div className="absolute left-0 top-0 bg-[oklch(0.55_0.22_330/0.06)]" style={{ width: `${centerX}%`, height: `${centerY}%` }} />
              <div className="absolute top-0 right-0 bg-[oklch(0.60_0.20_25/0.06)]" style={{ left: `${centerX}%`, height: `${centerY}%` }} />
              <div className="absolute left-0 bottom-0 bg-[oklch(0.65_0.18_150/0.06)]" style={{ top: `${centerY}%`, width: `${centerX}%` }} />
              <div className="absolute right-0 bottom-0 bg-[oklch(0.65_0.15_200/0.06)]" style={{ left: `${centerX}%`, top: `${centerY}%` }} />
            </div>

            {/* Minor grid */}
            {[-4, 4].map((smv) => (
              <div key={`v${smv}`} className="absolute top-0 bottom-0 w-px bg-[oklch(0.78_0.12_85/0.05)]" style={{ left: `${smvToX(smv)}%` }} />
            ))}
            {[1.0, 1.8].map((acid) => (
              <div key={`h${acid}`} className="absolute left-0 right-0 h-px bg-[oklch(0.78_0.12_85/0.05)]" style={{ top: `${acidToY(acid)}%` }} />
            ))}

            {/* Center axes */}
            <div className="absolute top-0 bottom-0 w-px bg-[oklch(0.78_0.12_85/0.2)]" style={{ left: `${centerX}%` }} />
            <div className="absolute left-0 right-0 h-px bg-[oklch(0.78_0.12_85/0.2)]" style={{ top: `${centerY}%` }} />

            {/* Quadrant labels */}
            <div className={`${QUADRANT_LABEL} top-[6%] left-[3%]`}>
              <span className="text-[oklch(0.55_0.22_330/0.6)]">{t("Sweet", "甘口")}</span>
              <br />
              <span className="text-[oklch(0.55_0.22_330/0.6)]">{t("& Rich", "& 濃醇")}</span>
            </div>
            <div className={`${QUADRANT_LABEL} text-right top-[6%] right-[3%]`}>
              <span className="text-[oklch(0.60_0.20_25/0.6)]">{t("Dry", "辛口")}</span>
              <br />
              <span className="text-[oklch(0.60_0.20_25/0.6)]">{t("& Rich", "& 濃醇")}</span>
            </div>
            <div className={`${QUADRANT_LABEL} bottom-[6%] left-[3%]`}>
              <span className="text-[oklch(0.65_0.18_150/0.6)]">{t("Sweet", "甘口")}</span>
              <br />
              <span className="text-[oklch(0.65_0.18_150/0.6)]">{t("& Light", "& 淡麗")}</span>
            </div>
            <div className={`${QUADRANT_LABEL} text-right bottom-[6%] right-[3%]`}>
              <span className="text-[oklch(0.65_0.15_200/0.6)]">{t("Dry", "辛口")}</span>
              <br />
              <span className="text-[oklch(0.65_0.15_200/0.6)]">{t("& Light", "& 淡麗")}</span>
            </div>

            {/* Data points */}
            {smvData.map((d, i) => {
              const isSelected = selected?.name === d.name;
              const isDimmed = activeCat !== null && d.category !== activeCat;
              const cat = categoryFor(d.category);
              return (
                <button
                  type="button"
                  key={d.name}
                  aria-label={t(d.name, d.nameJa)}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(isSelected ? null : d)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group flex items-center justify-center min-h-0 min-w-0 size-7 transition-[scale,opacity] duration-300 animate-in zoom-in-0 fade-in fill-mode-both ${isSelected ? "scale-160" : "scale-100"} ${isDimmed ? "opacity-15" : "opacity-100"}`}
                  style={{ left: `${smvToX(d.smv)}%`, top: `${acidToY(d.acidity)}%`, animationDelay: `${i * 0.04}s` }}
                >
                  {isSelected && <span aria-hidden="true" className={`absolute inset-0 rounded-full ${cat.glow}`} />}
                  <span
                    className={
                      isSelected
                        ? `relative size-3.5 sm:size-4 rounded-full border-2 transition-all duration-300 scale-125 shadow-lg ${cat.dotSelected}`
                        : `relative size-3.5 sm:size-4 rounded-full border-2 transition-all duration-300 group-hover:scale-150 ${cat.dot}`
                    }
                  />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[oklch(0.16_0.03_270)] border border-[oklch(0.78_0.12_85/0.2)] text-[9px] font-mono text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none">
                    {t(d.name, d.nameJa)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground uppercase whitespace-nowrap">
            {t("← Sweet — SMV — Dry →", "← 甘口 — 日本酒度 — 辛口 →")}
          </div>
          <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground uppercase whitespace-nowrap">
            {t("↑ High Acidity — Low ↓", "↑ 高酸度 — 低 ↓")}
          </div>

          {/* SMV ticks */}
          <div className="absolute bottom-6 left-10 sm:left-14 right-10 sm:right-14 flex justify-between">
            {[-6, -3, 0, 3, 6].map((v) => (
              <span key={v} className="font-mono text-[8px] text-muted-foreground/50">
                {v > 0 ? `+${v}` : v}
              </span>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="mt-6 bg-[oklch(0.15_0.025_270)] border border-[oklch(0.78_0.12_85/0.2)] overflow-hidden animate-in fade-in slide-in-from-bottom-[15px] duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-sk-serif text-2xl sm:text-3xl font-bold text-foreground">{t(selected.name, selected.nameJa)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground italic">{t(selected.style, selected.styleJa)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label={t("Close", "閉じる")}
                  className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={STAT}>
                  <p className={STAT_LABEL}>{t("SMV", "日本酒度")}</p>
                  <p className="font-sk-serif text-3xl font-bold text-[oklch(0.78_0.12_85)]">
                    {selected.smv > 0 ? "+" : ""}
                    {selected.smv}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {selected.smv < 0 ? t("Sweet", "甘口") : selected.smv > 3 ? t("Dry", "辛口") : t("Balanced", "バランス")}
                  </p>
                </div>
                <div className={STAT}>
                  <p className={STAT_LABEL}>{t("Acidity", "酸度")}</p>
                  <p className="font-sk-serif text-3xl font-bold text-[oklch(0.78_0.12_85)]">{selected.acidity}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {selected.acidity > 1.6
                      ? t("High — Rich body", "高 — 豊かなボディ")
                      : selected.acidity < 1.2
                        ? t("Low — Light body", "低 — 軽いボディ")
                        : t("Medium", "中程度")}
                  </p>
                </div>
                <div className={STAT}>
                  <p className={STAT_LABEL}>{t("Category", "カテゴリー")}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`size-3 rounded-full ${categoryFor(selected.category).swatch}`} />
                    <span className="font-mono text-sm text-foreground capitalize">{selected.category.replace("-", " ")}</span>
                  </div>
                </div>
                <div className={STAT}>
                  <p className={STAT_LABEL}>{t("Quadrant", "象限")}</p>
                  <p className="font-mono text-sm text-foreground mt-2">
                    {selected.smv < 0 && selected.acidity >= 1.4
                      ? t("Sweet & Rich", "甘口＆濃醇")
                      : selected.smv >= 0 && selected.acidity >= 1.4
                        ? t("Dry & Rich", "辛口＆濃醇")
                        : selected.smv < 0 && selected.acidity < 1.4
                          ? t("Sweet & Light", "甘口＆淡麗")
                          : t("Dry & Light", "辛口＆淡麗")}
                  </p>
                </div>
              </div>

              {mode === "connoisseur" && (
                <div className="mt-5 p-4 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.78_0.12_85/0.08)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Info aria-hidden="true" size={14} className="text-[oklch(0.78_0.12_85)]" />
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t("Connoisseur Note", "通の注釈")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      `SMV of ${selected.smv > 0 ? "+" : ""}${selected.smv} with acidity ${selected.acidity} places this sake in the ${selected.smv < 0 ? "sweet" : "dry"} spectrum with ${selected.acidity > 1.6 ? "rich, full-bodied" : selected.acidity < 1.2 ? "light, delicate" : "moderate"} mouthfeel. Remember: these numbers describe, they don't define. The same SMV can taste completely different depending on amino acid content, residual sugar type, and serving temperature.`,
                      `日本酒度${selected.smv > 0 ? "+" : ""}${selected.smv}、酸度${selected.acidity}は、この酒を${selected.smv < 0 ? "甘口" : "辛口"}スペクトラムに位置づけ、${selected.acidity > 1.6 ? "豊かでフルボディの" : selected.acidity < 1.2 ? "軽やかで繊細な" : "中程度の"}口当たりを持つ。覚えておくべきこと：数字は描写する。定義はしない。同じ日本酒度でも、アミノ酸含有量、残糖の種類、提供温度によってまったく異なる味わいになる。`,
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Closing quote */}
        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg sm:text-xl italic text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t(
              "\"Numbers describe. They don't define. The map is not the territory — but it reveals the terrain.\"",
              "「数字は描写する。定義はしない。地図は領土ではない — しかし地形を明らかにする。」",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
