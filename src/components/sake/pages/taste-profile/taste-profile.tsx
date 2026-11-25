"use client";

import { Palette } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { useTasteProfile } from "@/components/sake/pages/taste-profile/hook/use-taste-profile";
import { StepQuestion } from "@/components/sake/pages/taste-profile/components/step-question";
import { StepResult } from "@/components/sake/pages/taste-profile/components/step-result";
import { tasteProfileCopy as c } from "@/components/sake/pages/taste-profile/data/taste-profile.data";
import { tasteLooks } from "@/components/sake/pages/taste-profile/look";

// Ported from the Sake app's client/src/pages/TasteProfile.tsx (2026-11-26): seven questions that map
// your palate to one of four sake archetypes, with styles and bottles to try. Rebuilt as a step
// registry (CONTRIBUTING rule 19): this parent holds the glass hero, the registry and the shared state
// (hook/use-taste-profile.ts); archetypes and copy are in data/taste-profile.data.ts.
// Changed: the hero's background photo was on the Manus app's own image host (a cloudfront bucket),
// which this site never links to (zero Manus), and there's no copy of it yet, so the hero shows the
// section's ink-wash gradient behind the glass card until a picture is chosen. The glass card's
// blur and shadow, written as inline styles in the app, are Tailwind classes.

const STEPS = { 1: StepQuestion, 2: StepResult } as const;

export function SakeTasteProfile() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const look = isAustere ? tasteLooks.austere : tasteLooks.kintsugi;
  const quiz = useTasteProfile();
  const Step = STEPS[quiz.step];

  return (
    <div className={look.page}>
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div aria-hidden="true" className="sk-image-wash size-full" />
          <div className={look.heroOverlay} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center mt-24 mb-12 animate-in fade-in slide-in-from-bottom-[30px] zoom-in-95 duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] fill-mode-both">
          <div className={look.glass}>
            <p className={`text-sm tracking-[0.4em] uppercase mb-5 ${look.gold}`}>
              <Palette aria-hidden="true" className="size-4 inline mr-2" />
              {t(...c.eyebrow)}
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t(...c.titleA)}
              <br />
              <span className={look.gold}>{t(...c.titleB)}</span>
            </h1>
            <p className={`text-lg max-w-xl mx-auto leading-relaxed ${look.textMuted}`}>{t(...c.intro)}</p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        <Step quiz={quiz} look={look} />
      </section>
    </div>
  );
}
