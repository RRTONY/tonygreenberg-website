"use client";

import { useState } from "react";
import { ArrowUp, Ban, Contrast, Droplets, Leaf, Lightbulb, Link2, Scissors, Thermometer, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { guidePalette } from "@/components/sake/page-palettes";
import { foodPairings, pairingPrinciples } from "@/lib/content/sake/education-data";

// Ported from the Sake app's client/src/pages/FoodPairing.tsx (2026-11-26): the six pairing
// principles, the sake-style tabs and each style's dishes with their match meter. Same copy and
// colors (page-palettes.ts guidePalette). Changed:
// - Each principle showed an emoji (💧 🌉 ⬆️ ✂️ ☯️ 🍂); they're lucide icons now (rule 18).
// - The principles are in the server HTML even while closed (crawlable copy), just hidden.
// - framer-motion: the style panel re-fades on each tab and the dishes stagger in (CSS).

const PRINCIPLE_ICONS: Record<string, LucideIcon> = {
  "Wash (洗)": Droplets,
  "Bridge (橋)": Link2,
  "Push (押)": ArrowUp,
  "Cut (切)": Scissors,
  "Contrast (対)": Contrast,
  "Season (季)": Leaf,
};

export function SakeFoodPairing() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const [activeStyle, setActiveStyle] = useState(0);
  const [showPrinciples, setShowPrinciples] = useState(false);
  const p = guidePalette(isAustere);

  const style = foodPairings[activeStyle];

  return (
    <div className={`min-h-screen ${p.page}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0d1321]/95 to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`flex items-center justify-center text-sm tracking-[0.4em] uppercase mb-4 ${p.gold}`}>
              <UtensilsCrossed aria-hidden="true" className="size-4 inline mr-2" />
              {t("The Art of Pairing", "合わせの芸術")}
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t("Sake ×", "酒 ×")}
              <br />
              <span className={p.gold}>{t("Food", "料理")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${p.textMuted}`}>
              {t(
                'In Japan, sake and food are not paired — they are married. The concept is "washoku" — harmony of food. Here is how to create that harmony.',
                "日本では、酒と料理はペアリングではなく——結婚する。その概念は「和食」——食の調和。ここにその調和の作り方がある。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Pairing principles */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <button
          type="button"
          onClick={() => setShowPrinciples((s) => !s)}
          aria-expanded={showPrinciples}
          aria-controls="sake-pairing-principles"
          className={`flex items-center gap-2 mx-auto text-sm tracking-[0.2em] uppercase hover:opacity-80 transition-opacity ${p.gold}`}
        >
          <Lightbulb aria-hidden="true" className="size-4" />
          {t("The 6 Principles of Sake Pairing", "酒の合わせ六原則")}
        </button>

        <div id="sake-pairing-principles" hidden={!showPrinciples} className="animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {pairingPrinciples.map((pr) => {
              const Icon = PRINCIPLE_ICONS[pr.nameEn] ?? Lightbulb;
              return (
                <div key={pr.nameEn} className={`${p.card} border ${p.goldBorder} rounded-sm p-5 text-center`}>
                  <Icon aria-hidden="true" className={`size-6 mx-auto mb-2 ${p.gold}`} />
                  <h3 className={`text-sm font-medium mb-1 ${p.gold}`}>{t(pr.nameEn, pr.nameJa)}</h3>
                  <p className={`text-xs leading-relaxed ${p.textMuted}`}>{t(pr.descriptionEn, pr.descriptionJa)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sake style tabs */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-3" role="group" aria-label={t("Sake style", "酒のスタイル")}>
          {foodPairings.map((fp, i) => (
            <button
              type="button"
              key={fp.sakeStyle}
              onClick={() => setActiveStyle(i)}
              aria-pressed={activeStyle === i}
              className={
                activeStyle === i
                  ? `px-4 py-2 text-xs tracking-[0.15em] uppercase border rounded-sm transition-all duration-300 ${p.activePill}`
                  : `px-4 py-2 text-xs tracking-[0.15em] uppercase border rounded-sm transition-all duration-300 ${p.idlePill}`
              }
            >
              {t(fp.sakeStyle, fp.sakeStyleJa)}
            </button>
          ))}
        </div>
      </section>

      {/* Active style */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div key={activeStyle} className="mt-8 animate-in fade-in duration-300">
          <div className={`${p.card} border ${p.goldBorder} rounded-sm p-8 mb-6`}>
            <h2 className={`text-2xl font-light mb-3 ${p.gold}`}>{t(style.sakeStyle, style.sakeStyleJa)}</h2>
            <p className={`text-base leading-relaxed mb-6 ${p.textMain}`}>{t(style.principle, style.principleJa)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-sm p-4 ${p.innerPanel}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer aria-hidden="true" className={`size-4 ${p.gold}`} />
                  <span className={`text-xs tracking-[0.2em] uppercase ${p.gold}`}>{t("Temperature", "温度")}</span>
                </div>
                <p className={`text-sm ${p.textMain}`}>{t(style.temperatureEn, style.temperatureJa)}</p>
              </div>
              <div className={`rounded-sm p-4 ${p.innerPanel}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Ban aria-hidden="true" className={`size-4 ${p.gold}`} />
                  <span className={`text-xs tracking-[0.2em] uppercase ${p.gold}`}>{t("Avoid", "避ける")}</span>
                </div>
                <p className={`text-sm ${p.textMain}`}>{t(style.avoidEn, style.avoidJa)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {style.pairings.map((dish, i) => (
              <div
                key={dish.dishEn}
                className={`${p.card} border ${p.goldBorder} rounded-sm p-6 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-light ${p.gold}`}>{t(dish.dishEn, dish.dishJa)}</h3>
                    <p className={`text-sm leading-relaxed mt-1 ${p.textMuted}`}>{t(dish.whyEn, dish.whyJa)}</p>
                  </div>
                  <div className="md:w-40 shrink-0">
                    <p className={`text-xs tracking-[0.15em] uppercase mb-1 ${p.textMuted}`}>{t("Match", "相性")}</p>
                    <div className={`h-2 rounded-full ${p.track}`}>
                      <div className={`h-full rounded-full transition-all duration-500 ${p.bar}`} style={{ width: `${dish.intensityMatch * 10}%` }} />
                    </div>
                    <p className={`text-xs mt-1 text-right ${p.gold}`}>{dish.intensityMatch}/10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isConnoisseur && (
            <div className={`mt-8 border-l-2 pl-6 animate-in fade-in duration-500 ${p.goldBorder}`}>
              <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${p.gold}`}>{t("Connoisseur Note", "通の注釈")}</p>
              <p className={`text-sm leading-relaxed ${p.textMuted}`}>
                {t(
                  `The key to pairing ${style.sakeStyle} is understanding its structural backbone — acidity, umami, and texture weight. Match these three pillars and the pairing will sing.`,
                  `${style.sakeStyleJa}のペアリングの鍵は、その構造的骨格——酸味、旨味、テクスチャーの重さを理解すること。この三本柱を合わせれば、ペアリングは歌う。`,
                )}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
