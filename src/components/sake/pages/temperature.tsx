"use client";

import { useState } from "react";
import { Thermometer } from "lucide-react";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { temperatureSpectrum } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/Temperature.tsx (2026-11-26): the hero, the cold-to-hot
// bar with a point per named temperature, the detail panel, and the full list shown while nothing
// is picked (with "best for" in Connoisseur mode), same copy and classes. framer-motion entrances
// are tw-animate classes (the list keeps its 0.05s stagger; the panel re-enters on each pick).
// Fixed (rule 20): at 375px the ten points (44px tap targets each) were wider than the screen and
// pushed the whole page sideways; the bar and its points now scroll inside their own box on phones.
// The points also say which one is picked (aria-pressed).

export function SakeTemperature() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const [selected, setSelected] = useState<string | null>(null);
  const active = temperatureSpectrum.find((tp) => tp.id === selected);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("The Hidden Variable", "隠れた変数")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Thermometer aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Temperature Spectrum", "温度のスペクトル")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "The same sake transforms at every degree. Japan names each temperature point — from snow-cold to flying hot. Click to explore.",
              "同じ酒が温度ごとに変容する。日本は各温度帯に名前をつけた — 雪冷えから飛び切り燗まで。クリックして探索。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {/* Temperature bar */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="relative min-w-xl">
            <div className="h-3 rounded-full bg-linear-to-r from-[oklch(0.55_0.15_240)] via-[oklch(0.78_0.12_85)] to-[oklch(0.55_0.2_25)]" />
            <div className="flex justify-between mt-4">
              {temperatureSpectrum.map((tp) => (
                <button
                  type="button"
                  key={tp.id}
                  aria-pressed={selected === tp.id}
                  onClick={() => setSelected(selected === tp.id ? null : tp.id)}
                  className="relative flex flex-col items-center group"
                >
                  <span
                    aria-hidden="true"
                    className={
                      selected === tp.id
                        ? "size-3 rounded-full border-2 transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85)] scale-150"
                        : "size-3 rounded-full border-2 transition-all duration-300 border-[oklch(0.5_0.05_270)] bg-[oklch(0.16_0.03_270)] group-hover:border-[oklch(0.78_0.12_85)]"
                    }
                  />
                  <span
                    className={
                      selected === tp.id
                        ? "mt-2 font-mono text-[9px] tracking-wider transition-colors text-[oklch(0.78_0.12_85)]"
                        : "mt-2 font-mono text-[9px] tracking-wider transition-colors text-muted-foreground"
                    }
                  >
                    {tp.temp}°C
                  </span>
                  <span
                    className={
                      selected === tp.id
                        ? "hidden sm:block font-mono text-[8px] tracking-wider transition-colors text-foreground"
                        : "hidden sm:block font-mono text-[8px] tracking-wider transition-colors text-muted-foreground/60"
                    }
                  >
                    {t(tp.name.split("(")[0].trim(), tp.nameJa.split("（")[0].trim())}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {active && (
          <div
            key={active.id}
            aria-live="polite"
            className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.2)] p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-sk-serif text-2xl font-bold text-foreground">{t(active.name, active.nameJa)}</h2>
                <span className="font-mono text-[oklch(0.78_0.12_85)] text-sm">{active.temp}°C</span>
              </div>
            </div>

            <p className="text-foreground text-sm leading-relaxed mb-6">{t(active.description, active.descriptionJa)}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {t("Aromas at this temperature", "この温度での香り")}
                </p>
                <p className="text-sm text-foreground">{t(active.aromas, active.aromasJa)}</p>
              </div>
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">{t("Best for", "最適な酒")}</p>
                <p className="text-sm text-foreground">{t(active.bestFor, active.bestForJa)}</p>
              </div>
            </div>
          </div>
        )}

        {/* All temperatures */}
        {!selected && (
          <div className="space-y-3">
            {temperatureSpectrum.map((tp, i) => (
              <button
                type="button"
                key={tp.id}
                onClick={() => setSelected(tp.id)}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="w-full text-left p-4 bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.3)] transition-all duration-300 flex items-center gap-4 animate-in fade-in slide-in-from-left-5 fill-mode-both"
              >
                <span className="font-mono text-[oklch(0.78_0.12_85)] text-sm w-12">{tp.temp}°C</span>
                <span className="flex-1">
                  <span className="block font-sk-serif text-lg font-semibold text-foreground">{t(tp.name, tp.nameJa)}</span>
                  {isConnoisseur && <span className="block text-xs text-muted-foreground mt-0.5">{t(tp.bestFor, tp.bestForJa)}</span>}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The same sake, nine different drinks."', "「同じ酒、九つの異なる飲み物。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
