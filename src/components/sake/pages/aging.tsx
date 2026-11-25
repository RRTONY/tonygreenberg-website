"use client";

import { useState } from "react";
import { Clock, Wine } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { agingStages } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/Aging.tsx (2026-11-26): the hero, the five-stage
// timeline (fresh to 40-year koshu) and the selected stage's detail, same copy and classes. The
// app's per-stage colors (an inline backgroundColor map) are a precomposed class map. framer-motion's
// AnimatePresence swap is the panel re-entering (fade + 20px rise, 0.4s) on each pick.
// Added: the stage buttons say which one is picked (aria-pressed) and have a name (the years label).

const STAGE_BG: Record<string, string> = {
  fresh: "bg-[oklch(0.9_0.02_150)]",
  "1year": "bg-[oklch(0.85_0.05_85)]",
  "3year": "bg-[oklch(0.75_0.1_85)]",
  "10year": "bg-[oklch(0.55_0.12_55)]",
  "40year": "bg-[oklch(0.3_0.08_30)]",
};

export function SakeAging() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(agingStages[0].id);
  const stage = agingStages.find((s) => s.id === selected) ?? agingStages[0];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("Japan's Best-Kept Secret", "日本の最も守られた秘密")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Clock aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Aging & Time", "熟成と時間")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "From crystal-clear shiboritate to near-black 40-year koshu. The philosophy of patience in a culture obsessed with freshness.",
              "水晶のように透明なしぼりたてから、ほぼ黒い40年古酒まで。新鮮さに執着する文化における忍耐の哲学。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {/* Timeline */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {agingStages.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                aria-pressed={selected === s.id}
                onClick={() => setSelected(s.id)}
                className="relative flex flex-col items-center group"
              >
                <span
                  aria-hidden="true"
                  className={
                    selected === s.id
                      ? `size-10 sm:size-14 rounded-full border-2 transition-all duration-500 scale-110 border-[oklch(0.78_0.12_85)] ${STAGE_BG[s.id] ?? ""}`
                      : `size-10 sm:size-14 rounded-full border-2 transition-all duration-500 border-[oklch(0.28_0.04_270)] group-hover:border-[oklch(0.78_0.12_85/0.5)] ${STAGE_BG[s.id] ?? ""}`
                  }
                />
                <span
                  className={
                    selected === s.id
                      ? "mt-2 font-mono text-[8px] sm:text-[9px] tracking-wider text-center transition-colors text-[oklch(0.78_0.12_85)]"
                      : "mt-2 font-mono text-[8px] sm:text-[9px] tracking-wider text-center transition-colors text-muted-foreground"
                  }
                >
                  {s.years}
                </span>
              </button>
              {i < agingStages.length - 1 && <div aria-hidden="true" className="w-6 sm:w-12 h-0.5 bg-[oklch(0.28_0.04_270)]" />}
            </div>
          ))}
        </div>

        {/* Stage detail */}
        <div
          key={stage.id}
          aria-live="polite"
          className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.15)] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-5 duration-400"
        >
          <div className="flex items-start gap-4 mb-6">
            <div aria-hidden="true" className={`size-6 rounded-full shrink-0 mt-1 ${STAGE_BG[stage.id] ?? ""}`} />
            <div>
              <p className="font-mono text-[oklch(0.78_0.12_85)] text-xs tracking-[0.2em] uppercase">{stage.years}</p>
              <h2 className="font-sk-serif text-2xl sm:text-3xl font-bold text-foreground">{t(stage.name, stage.nameJa)}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">{t("Color", "色")}</p>
              <p className="text-sm text-foreground">{t(stage.color, stage.colorJa)}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">{t("Flavor Profile", "味わいプロファイル")}</p>
              <p className="text-sm text-foreground">{t(stage.flavor, stage.flavorJa)}</p>
            </div>
          </div>

          <div className="border-t border-[oklch(0.78_0.12_85/0.1)] pt-5 mb-5">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-2">{t("Philosophy", "哲学")}</p>
            <p className="font-sk-serif text-lg font-semibold text-foreground italic">{t(stage.philosophy, stage.philosophyJa)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Wine aria-hidden="true" size={14} className="text-muted-foreground" />
            <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground uppercase">{t("Example", "例")}:</span>
            <span className="text-sm text-foreground">{t(stage.example, stage.exampleJa)}</span>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The sake has outlived its maker. It belongs to time now."', "「酒は造り手より長く生きた。今は時間のもの。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
