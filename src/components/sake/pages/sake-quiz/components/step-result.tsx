"use client";

import Link from "next/link";
import { Amphora, ArrowRight, RotateCcw, Sparkles, Thermometer, Wine } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { ritualPalette } from "@/components/sake/page-palettes";
import type { SakeQuizState } from "@/components/sake/pages/sake-quiz/hook/use-sake-quiz";
import { profileFor, sakeQuizData } from "@/components/sake/pages/sake-quiz/data/sake-quiz.data";
import { sk } from "@/lib/content/sake/nav";

// Step 2 of "Your Sake Profile": the profile's kanji (in its own color, a runtime value from the
// data), name and description, styles, starter bottles, temperature and vessel, and the next steps.
// The app's 🍶 / 🌡️ / 🏺 before those lists are lucide icons (rule 18).

export function StepResult({ quiz }: { quiz: SakeQuizState }) {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const p = ritualPalette(isAustere);
  const profile = profileFor(quiz.answers);

  return (
    <div className="container max-w-3xl py-16 animate-in fade-in slide-in-from-bottom-5 duration-600 fill-mode-both">
      <div className="text-center mb-12">
        <span className={`text-xs tracking-[0.3em] uppercase ${p.gold}`}>{t(...sakeQuizData.resultEyebrow)}</span>
        <div className="text-8xl font-serif mt-4 mb-3" style={{ color: profile.color }} aria-hidden="true">
          {profile.kanji}
        </div>
        <h1 className={isAustere ? "font-light text-4xl md:text-5xl mb-2" : "font-serif text-4xl md:text-5xl mb-2"}>{t(profile.name, profile.nameJa)}</h1>
      </div>

      <div className={`p-8 rounded-xl mb-8 border ${p.panel} ${p.panelBorder}`}>
        <p className={isAustere ? `text-lg leading-relaxed font-light ${p.softText}` : `text-lg leading-relaxed font-serif italic ${p.softText}`}>
          {t(profile.description, profile.descriptionJa)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className={`p-6 rounded-xl border ${p.goldDimBg} ${p.goldMidBorder}`}>
          <h2 className={`flex items-center text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>
            <Wine aria-hidden="true" size={14} className="inline mr-2" />
            {t(...sakeQuizData.yourStyles)}
          </h2>
          <div className="space-y-2">
            {profile.topStyles.map((style, i) => (
              <div key={style} className="flex items-center gap-2">
                <span aria-hidden="true" className={`size-1.5 rounded-full ${p.goldBg}`} />
                <span className="text-sm font-medium">{t(style, profile.topStylesJa[i] ?? style)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${p.panel} ${p.panelBorder}`}>
          <h2 className={`flex items-center text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>
            <Sparkles aria-hidden="true" size={14} className="inline mr-2" />
            {t(...sakeQuizData.startHere)}
          </h2>
          <div className="space-y-2">
            {profile.bottles.map((bottle) => (
              <div key={bottle} className="flex items-center gap-2">
                <Wine aria-hidden="true" size={14} className={p.gold} />
                <span className="text-sm">{bottle}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${p.panel} ${p.panelBorder}`}>
          <h2 className={`flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>
            <Thermometer aria-hidden="true" size={14} /> {t(...sakeQuizData.yourTemperature)}
          </h2>
          <p className="text-sm">{t(profile.temperature, profile.temperatureJa)}</p>
        </div>

        <div className={`p-6 rounded-xl border ${p.panel} ${p.panelBorder}`}>
          <h2 className={`flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-3 ${p.gold}`}>
            <Amphora aria-hidden="true" size={14} /> {t(...sakeQuizData.yourVessel)}
          </h2>
          <p className="text-sm">{t(profile.vessel, profile.vesselJa)}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <button
          type="button"
          onClick={quiz.reset}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm border transition-colors ${p.goldBorder} ${p.gold}`}
        >
          <RotateCcw aria-hidden="true" size={14} /> {t(...sakeQuizData.takeAgain)}
        </button>
        <Link href={sk("/collection")} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm ${p.goldBg} ${p.onGold}`}>
          {t(...sakeQuizData.exploreCollection)} <ArrowRight aria-hidden="true" size={14} />
        </Link>
        <Link href={sk("/exv-builder")} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border ${p.goldBorder} ${p.gold}`}>
          {t(...sakeQuizData.buildExv)} <ArrowRight aria-hidden="true" size={14} />
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className={isAustere ? "text-xs italic max-w-lg mx-auto text-[#999]" : "text-xs italic max-w-lg mx-auto text-[#555]"}>{t(...sakeQuizData.closingNote)}</p>
      </div>
    </div>
  );
}
