"use client";

import type { ReactNode } from "react";
import { Compass, UtensilsCrossed } from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { restaurantIntegrityProfiles } from "@/lib/content/sake/supply-chain-engine";
import { RestaurantCard } from "./components/restaurant-card";
import { StepIntro } from "./components/step-intro";
import { StepQuestions } from "./components/step-questions";
import { StepResult } from "./components/step-result";
import { AUSTERE_TONE, KINTSUGI_TONE, orderingGuideData as copy, type GuideTone } from "./data/ordering-guide.data";
import { GUIDE_STEPS, useOrderingGuide, type OrderingGuideFlow } from "./hook/use-ordering-guide";

// Ported from the Sake Manus app's client/src/pages/OrderingGuide.tsx (2026-11-26): the Restaurant
// Integrity scorer and the five-question "Find Your Sake" guide. Built as a step registry
// (CONTRIBUTING rule 19): this parent holds the page chrome and `STEPS`, the flow's state is in
// hook/use-ordering-guide.ts, each step is components/step-*.tsx, copy is in data/. The page kept
// its own palette (#c9a227 gold on #0a0e1a, stone and red-800 in Austere), now as literal class sets
// in data/ (KINTSUGI_TONE / AUSTERE_TONE) instead of inline styles.

export type StepProps = { guide: OrderingGuideFlow; tone: GuideTone; t: (en: string, ja: string) => string };

const STEPS: Record<number, (props: StepProps) => ReactNode> = {
  [GUIDE_STEPS.intro]: StepIntro,
  [GUIDE_STEPS.questions]: StepQuestions,
  [GUIDE_STEPS.result]: StepResult,
};

export function SakeOrderingGuide() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const tone = isAustere ? AUSTERE_TONE : KINTSUGI_TONE;
  const guide = useOrderingGuide();
  const Step = STEPS[guide.step] ?? StepIntro;

  return (
    <div className={`min-h-screen ${tone.pageBg} transition-colors duration-500`}>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${tone.gold}`}>{t(...copy.hero.eyebrow)}</p>
            <h1 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-4xl sm:text-5xl lg:text-6xl leading-tight ${tone.textMain}`}>
              {t(...copy.hero.titleLead)} <span className="gold-shimmer">{t(...copy.hero.titleGold)}</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${tone.textMuted}`}>{t(...copy.hero.intro)}</p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Restaurant Integrity Scorer */}
      <section className="py-16 lg:py-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <div className="flex items-center gap-3 mb-2">
              <UtensilsCrossed aria-hidden="true" size={20} className={tone.gold} />
              <h2 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-3xl sm:text-4xl ${tone.textMain}`}>
                {t(...copy.integrity.title)}
              </h2>
            </div>
            <p className={`text-base mb-8 max-w-2xl ${tone.textMuted}`}>{t(...copy.integrity.intro)}</p>
          </Reveal>

          <div className="space-y-4">
            {restaurantIntegrityProfiles.map((profile, i) => (
              <RestaurantCard key={profile.type} profile={profile} index={i} tone={tone} t={t} />
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Interactive Ordering Guide */}
      <section className="py-16 lg:py-20">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <div className="flex items-center gap-3 mb-2">
              <Compass aria-hidden="true" size={20} className={tone.gold} />
              <h2 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-3xl sm:text-4xl ${tone.textMain}`}>
                {t(...copy.guide.title)}
              </h2>
            </div>
            <p className={`text-base mb-8 max-w-2xl ${tone.textMuted}`}>{t(...copy.guide.intro)}</p>
          </Reveal>

          <div className={`${tone.cardBg} border ${tone.cardBorder} p-6 sm:p-8 max-w-3xl mx-auto`} aria-live="polite">
            <Step guide={guide} tone={tone} t={t} />
          </div>
        </div>
      </section>
    </div>
  );
}
