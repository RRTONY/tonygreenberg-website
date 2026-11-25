"use client";

import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { useSommelierCard } from "@/components/sake/pages/sommelier-card/hook/use-sommelier-card";
import { StepQuiz } from "@/components/sake/pages/sommelier-card/components/step-quiz";
import { StepResult } from "@/components/sake/pages/sommelier-card/components/step-result";
import { sommelierCardData } from "@/components/sake/pages/sommelier-card/data/sommelier-card.data";
import { sommelierLooks } from "@/components/sake/pages/sommelier-card/look";

// Ported from the Sake app's client/src/pages/SommelierCard.tsx (2026-11-26): a five-question quiz that
// matches one of four sake personalities and builds a card with a phrase to say to a sommelier.
// Rebuilt as a step registry (CONTRIBUTING rule 19): this parent holds the hero, the registry and the
// shared state (hook/use-sommelier-card.ts); questions and copy are in data/sommelier-card.data.ts.
// The app's AnimatePresence swap is the steps' own enter classes. The app imported a "Download"
// icon and a card ref for a download it never built; neither is carried over.

const STEPS = { 1: StepQuiz, 2: StepResult } as const;
const c = sommelierCardData.copy;

export function SakeSommelierCard() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const look = isAustere ? sommelierLooks.austere : sommelierLooks.kintsugi;
  const card = useSommelierCard();
  const Step = STEPS[card.step];

  return (
    <div className={look.page}>
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${look.gold}`}>{t(...c.eyebrow)}</p>
            <h1 className={look.h1}>
              {t(...c.titleA)} <span className={look.shimmer}>{t(...c.titleB)}</span>
            </h1>
            <p className={`mt-6 max-w-xl mx-auto text-lg ${look.textMuted}`}>{t(...c.intro)}</p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Step card={card} look={look} />
        </div>
      </section>
    </div>
  );
}
