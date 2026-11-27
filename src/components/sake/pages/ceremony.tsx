"use client";

import { useState } from "react";
import {
  Amphora,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  GlassWater,
  Landmark,
  Leaf,
  Milk,
  Scroll,
  Sparkle,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { Reveal } from "@/components/sake/motion";
import { guidePalette } from "@/components/sake/page-palettes";
import { sacredCeremonies, traditionalCeremonySteps, viewingRituals } from "@/lib/content/sake/spiritual-data";

// Ported from the Sake app's client/src/pages/Ceremony.tsx (2026-11-26): the eight-step ceremony
// walkthrough, the "Sacred Ceremonies of Japan" list and the seasonal viewing rituals, same copy and
// colors (page-palettes.ts guidePalette). Changed:
// - The step buttons showed each step's emoji (🌿 🏺 🔥 ⛩️ 🫗 👄 🥂 🍶) and the step footer repeated it;
//   they're lucide icons now (rule 18), with the step name as the button's accessible label.
// - framer-motion: the step card slides in from the right on each change (exit animation dropped),
//   the ceremonies list fades in, rituals reveal on scroll.
// - The ceremonies list is in the server HTML even while closed (crawlable copy), just hidden.
// - The app's `hover:${gold}` on idle step buttons built a class from fragments, so it never worked;
//   it's a real hover color now.

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Leaf,
  2: Amphora,
  3: Flame,
  4: Landmark,
  5: GlassWater,
  6: Sparkle,
  7: Wine,
  8: Milk,
};

export function SakeCeremony() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const [activeStep, setActiveStep] = useState(0);
  const [showCeremonies, setShowCeremonies] = useState(false);
  const p = guidePalette(isAustere);

  const step = traditionalCeremonySteps[activeStep];
  const StepIcon = STEP_ICONS[step.order] ?? Leaf;
  const last = traditionalCeremonySteps.length - 1;

  return (
    <div className={`min-h-screen ${p.page}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0d1321]/95 to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`text-sm tracking-[0.4em] uppercase mb-4 ${p.gold}`}>{t("The Sacred Protocol", "聖なる作法")}</p>
            <h1 className={isAustere ? "text-5xl md:text-7xl font-light tracking-tight mb-6 font-serif" : "text-5xl md:text-7xl font-light tracking-tight mb-6"}>
              {t("The Traditional", "伝統の")}
              <br />
              <span className={p.gold}>{t("Sake Experience", "酒の体験")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${p.textMuted}`}>
              {t(
                "Eight steps from purification to return. A ceremony older than written history, refined over millennia, available to you tonight.",
                "祓いから帰還まで八つの段階。文字の歴史より古い儀式、千年にわたり磨かれ、今宵あなたに。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Ceremony steps */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="group" aria-label={t("Ceremony steps", "儀式の段階")}>
          {traditionalCeremonySteps.map((s, i) => {
            const Icon = STEP_ICONS[s.order] ?? Leaf;
            return (
              <button
                type="button"
                key={s.order}
                onClick={() => setActiveStep(i)}
                aria-label={t(s.nameEn, s.nameJa)}
                aria-current={i === activeStep ? "step" : undefined}
                className={
                  i === activeStep
                    ? `size-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 border scale-110 ${p.activePill}`
                    : `size-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 border ${p.idlePill}`
                }
              >
                <Icon aria-hidden="true" className="size-4" />
              </button>
            );
          })}
        </div>

        <div
          key={activeStep}
          className={`${p.card} border ${p.goldBorder} rounded-sm p-8 md:p-12 animate-in fade-in slide-in-from-right-[30px] duration-400 fill-mode-both`}
        >
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <div className={`text-xs tracking-[0.3em] uppercase mb-2 ${p.textMuted}`}>
                {t(`Step ${step.order} of 8`, `第${step.order}段 / 全八段`)}
              </div>
              <h2 className={`text-3xl md:text-4xl font-light mb-2 ${p.gold}`}>{t(step.nameEn, step.nameJa)}</h2>
              <div className={`text-sm ${p.textMuted}`}>{t(step.durationEn, step.durationJa)}</div>
            </div>
            <div className={`text-6xl opacity-20 ${p.gold}`} aria-hidden="true">
              {step.kanji}
            </div>
          </div>

          <p className={`text-lg leading-relaxed mb-8 ${p.textMain}`}>{t(step.descriptionEn, step.descriptionJa)}</p>

          {isConnoisseur && (
            <div className={`border-l-2 ${p.goldBorder} pl-6 mt-6 animate-in fade-in duration-500`}>
              <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${p.gold}`}>{t("Deep Note", "深層の注")}</p>
              <p className={`text-base leading-relaxed ${p.textMuted}`}>{t(step.deepNoteEn, step.deepNoteJa)}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mt-10 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className={
                activeStep === 0
                  ? "flex items-center gap-2 text-sm transition-colors opacity-30 cursor-not-allowed"
                  : `flex items-center gap-2 text-sm transition-colors hover:opacity-80 ${p.gold}`
              }
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              {t("Previous", "前へ")}
            </button>
            <div className={`flex items-center gap-1.5 text-sm ${p.textMuted}`}>
              <StepIcon aria-hidden="true" className="size-4" /> {step.kanji}
            </div>
            <button
              type="button"
              onClick={() => setActiveStep(Math.min(last, activeStep + 1))}
              disabled={activeStep === last}
              className={
                activeStep === last
                  ? "flex items-center gap-2 text-sm transition-colors opacity-30 cursor-not-allowed"
                  : `flex items-center gap-2 text-sm transition-colors hover:opacity-80 ${p.gold}`
              }
            >
              {t("Next", "次へ")}
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Sacred ceremonies */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <button
            type="button"
            onClick={() => setShowCeremonies((s) => !s)}
            aria-expanded={showCeremonies}
            aria-controls="sake-sacred-ceremonies"
            className={`flex items-center gap-3 mx-auto text-sm tracking-[0.3em] uppercase hover:opacity-80 transition-opacity ${p.gold}`}
          >
            <Scroll aria-hidden="true" className="size-4" />
            {t("Sacred Ceremonies of Japan", "日本の神聖な儀式")}
            <ChevronRight aria-hidden="true" className={showCeremonies ? "size-4 transition-transform rotate-90" : "size-4 transition-transform"} />
          </button>
        </div>

        <div id="sake-sacred-ceremonies" hidden={!showCeremonies} className="space-y-6 animate-in fade-in duration-500">
          {sacredCeremonies.map((ceremony, i) => (
            <div
              key={ceremony.nameEn}
              className={`${p.card} border ${p.goldBorder} rounded-sm p-8 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-6">
                <div className={`text-4xl opacity-30 shrink-0 ${p.gold}`} aria-hidden="true">
                  {ceremony.kanji}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-light mb-1 ${p.gold}`}>{t(ceremony.nameEn, ceremony.nameJa)}</h3>
                  <p className={`text-base leading-relaxed mb-4 ${p.textMain}`}>{t(ceremony.descriptionEn, ceremony.descriptionJa)}</p>
                  {isConnoisseur && (
                    <div className={`border-l-2 ${p.goldBorder} pl-4`}>
                      <p className={`text-sm leading-relaxed ${p.textMuted}`}>{t(ceremony.significanceEn, ceremony.significanceJa)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal viewing rituals */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <p className={`flex items-center justify-center text-xs tracking-[0.4em] uppercase mb-3 ${p.gold}`}>
            <Eye aria-hidden="true" className="size-4 inline mr-2" />
            {t("Seasonal Viewing Rituals", "季節の観賞の儀式")}
          </p>
          <p className={`text-sm max-w-xl mx-auto ${p.textMuted}`}>
            {t(
              "Four ways to drink with nature as your companion. Each season has its own sake, its own silence, its own kind of beauty.",
              "自然を伴侶として飲む四つの方法。各季節に固有の酒、固有の沈黙、固有の美がある。",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {viewingRituals.map((ritual, i) => (
            <Reveal
              key={ritual.nameEn}
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              delay={i * 0.1}
              className={`${p.card} border ${p.goldBorder} rounded-sm p-6 group transition-all`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" aria-hidden="true">
                  {ritual.kanji}
                </span>
                <div>
                  <h3 className={`text-lg font-light ${p.gold}`}>{t(ritual.nameEn, ritual.nameJa)}</h3>
                  <p className={`text-xs ${p.textMuted}`}>{t(ritual.seasonEn, ritual.seasonJa)}</p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${p.textMain}`}>{t(ritual.descriptionEn, ritual.descriptionJa)}</p>
              <div className={`text-xs border-t pt-3 mt-3 ${p.gold} ${p.goldBorder}`}>{t(ritual.sakeStyleEn, ritual.sakeStyleJa)}</div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
