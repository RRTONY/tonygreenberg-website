"use client";

import { useState } from "react";
import { Droplets, MapPin, Waves } from "lucide-react";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { AmbientSound } from "@/components/sake/ambient-sound";
import { waterSources } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/WaterAtlas.tsx (2026-11-26): the hero with the mountain
// spring soundscape, the water source picker, and the selected source (region, description,
// hardness bar, minerals in Connoisseur mode, sake style, breweries, spiritual significance), same
// copy. framer-motion's AnimatePresence swap is the panel re-entering on each pick; the hardness bar
// grows to its value (width is the one runtime style).
// Fixed (rule 20): the app wrote its per-look colors as inline styles with Tailwind-style underscores
// ('oklch(0.78_0.12_85)'), which browsers reject, so on live every accent, card color and the bar's
// gradient silently fell back to plain text color. They are real classes now, the intended
// Kintsugi value plus the Austere one behind `[.sake-austere_&]:`. Picker buttons say which source
// is chosen (aria-pressed).

const FG = "text-[oklch(0.93_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_MUTED = "text-[oklch(0.65_0.02_270)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";
const CARD = "bg-[oklch(0.16_0.03_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)]";
const CARD_BORDER = "border-[oklch(0.28_0.04_270)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";

export function SakeWater() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const [selected, setSelected] = useState(waterSources[0].id);
  const source = waterSources.find((s) => s.id === selected) ?? waterSources[0];
  const hardnessPct = Math.min((source.hardness / 200) * 100, 100);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background transition-colors duration-500">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <div className="flex justify-center mb-4">
            <AmbientSound type="stream" label={{ en: "Mountain spring", ja: "山の湧き水" }} />
          </div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">{t("The Invisible Terroir", "見えないテロワール")}</p>
          <h1 className={`font-sk-display font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-[0.2em]! text-4xl sm:text-6xl mb-6 ${FG}`}>
            <Droplets aria-hidden="true" className="inline-block mr-3 text-(--sk-accent)" size={36} />
            {t("Water Atlas", "水の地図")}
          </h1>
          <p className={`max-w-xl mx-auto text-sm leading-relaxed ${FG_MUTED}`}>
            {t(
              "Sake is 80% water. The invisible ingredient that shapes everything — softness, minerality, fermentation speed, and the soul of each region.",
              "日本酒の80%は水。すべてを形作る見えない材料 — 柔らかさ、ミネラル感、発酵速度、そして各地域の魂。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {waterSources.map((ws) => (
            <button
              type="button"
              key={ws.id}
              aria-pressed={selected === ws.id}
              onClick={() => setSelected(ws.id)}
              className={
                selected === ws.id
                  ? "px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-all duration-300 border-(--sk-accent) bg-(--sk-accent-soft) text-(--sk-accent)"
                  : `px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-all duration-300 bg-transparent ${CARD_BORDER} ${FG_MUTED}`
              }
            >
              {t(ws.name, ws.nameJa)}
            </button>
          ))}
        </div>

        <div key={source.id} aria-live="polite" className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-400">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin aria-hidden="true" size={14} className="text-(--sk-accent)" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-(--sk-accent)">{t(source.region, source.regionJa)}</span>
              </div>
              <h2 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-3xl mb-1 ${FG}`}>{t(source.name, source.nameJa)}</h2>
            </div>
            <p className={`text-sm leading-relaxed ${FG_MUTED}`}>{t(source.description, source.descriptionJa)}</p>

            <div className={`border p-5 ${CARD} ${CARD_BORDER}`}>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${FG_MUTED}`}>{t("Hardness", "硬度")}</span>
                <span className="font-mono text-sm text-(--sk-accent)">
                  {source.hardness} mg/L — {t(source.hardnessLabel, source.hardnessLabelJa)}
                </span>
              </div>
              <div
                role="meter"
                aria-label={t("Hardness", "硬度")}
                aria-valuemin={0}
                aria-valuemax={200}
                aria-valuenow={Math.min(source.hardness, 200)}
                className="h-2 rounded-full overflow-hidden bg-[oklch(0.2_0.03_270)] [.sake-austere_&]:bg-[oklch(0.88_0.005_80)]"
              >
                <div
                  style={{ width: `${hardnessPct}%` }}
                  className="h-full transition-[width] duration-800 delay-200 bg-linear-to-r from-[oklch(0.55_0.15_220)] via-[oklch(0.78_0.12_85)] to-[oklch(0.45_0.18_25)] [.sake-austere_&]:from-[oklch(0.55_0.008_60)] [.sake-austere_&]:via-[oklch(0.52_0.19_30)] [.sake-austere_&]:to-[oklch(0.35_0.01_60)]"
                />
              </div>
              <div className={`flex justify-between mt-1 text-[9px] font-mono tracking-wider ${FG_MUTED}`}>
                <span>{t("Ultra-Soft", "超軟水")}</span>
                <span>{t("Medium", "中程度")}</span>
                <span>{t("Hard", "硬水")}</span>
              </div>
            </div>

            {isConnoisseur && (
              <div className={`border p-5 ${CARD} ${CARD_BORDER}`}>
                <p className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-2 ${FG_MUTED}`}>{t("Mineral Profile", "ミネラルプロファイル")}</p>
                <p className={`text-sm ${FG}`}>{t(source.minerals, source.mineralsJa)}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`border p-6 ${CARD} border-[oklch(0.78_0.12_85/0.2)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.2)]`}>
              <Waves aria-hidden="true" size={16} className="mb-3 text-(--sk-accent)" />
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-(--sk-accent)">{t("Sake Style Produced", "生まれる酒のスタイル")}</p>
              <p className={`font-sk-display font-semibold text-lg leading-relaxed ${FG}`}>{t(source.sakeStyle, source.sakeStyleJa)}</p>
            </div>
            <div className={`border p-6 ${CARD} ${CARD_BORDER}`}>
              <p className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-2 ${FG_MUTED}`}>{t("Famous Breweries", "有名な蔵元")}</p>
              <p className={`text-sm ${FG}`}>{t(source.famousBreweries, source.famousBreweriesJa)}</p>
            </div>
            <div className="border p-6 bg-[oklch(0.14_0.025_270)] border-[oklch(0.45_0.18_25/0.3)] [.sake-austere_&]:bg-[oklch(0.93_0.006_80)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.3)]">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-[oklch(0.45_0.18_25)] [.sake-austere_&]:text-[oklch(0.52_0.19_30)]">
                {t("Spiritual Significance", "霊的な意味")}
              </p>
              <p className={`text-sm italic leading-relaxed ${FG}`}>{t(source.spiritual, source.spiritualJa)}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className={`font-sk-display text-lg italic ${FG_MUTED}`}>{t('"The water remembers what the mountain forgot."', "「水は山が忘れたことを覚えている。」")}</p>
        </div>
      </div>
    </div>
  );
}
