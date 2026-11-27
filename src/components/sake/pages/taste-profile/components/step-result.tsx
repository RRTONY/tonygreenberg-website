"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { sakeDetailPath } from "@/lib/content/sake/nav";
import { tasteProfileCopy as c } from "@/components/sake/pages/taste-profile/data/taste-profile.data";
import type { TasteProfileState } from "@/components/sake/pages/taste-profile/hook/use-taste-profile";
import type { TasteLook } from "@/components/sake/pages/taste-profile/look";

// Step 2: the archetype, its styles and bottles, and Retake. A bottle links to its sake page only
// when it has one (data file `sakeId`); "View & Buy" ends in an icon instead of a typed arrow.
export function StepResult({ quiz, look }: { quiz: TasteProfileState; look: TasteLook }) {
  const { t } = useLanguage();
  const result = quiz.result;
  if (!result) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-600">
      <div className={`${look.cardBg} border ${look.goldBorder} rounded-sm p-8 md:p-12`}>
        <div className={`text-xs tracking-[0.3em] uppercase mb-4 ${look.gold}`}>{t(...c.yourArchetype)}</div>
        <h2 className={`text-4xl md:text-5xl font-light mb-2 ${look.gold}`}>{t(result.archetype, result.archetypeJa)}</h2>
        <p className={`text-lg leading-relaxed mb-8 ${look.textMain}`}>{t(result.description, result.descriptionJa)}</p>

        <div className="mb-8">
          <p className={`text-xs tracking-[0.2em] uppercase mb-3 ${look.gold}`}>{t(...c.yourStyles)}</p>
          <div className="flex flex-wrap gap-2">
            {result.styles.map((s) => (
              <span key={s} className={`px-3 py-1 text-xs border rounded-sm ${look.goldBorder} ${look.gold}`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className={`text-xs tracking-[0.2em] uppercase mb-4 ${look.gold}`}>{t(...c.bottles)}</p>
          <div className="space-y-4">
            {result.bottles.map((b) =>
              b.sakeId ? (
                <Link key={b.name} href={sakeDetailPath(b.sakeId)} className={look.bottle}>
                  <span className={`block font-sk-display text-lg font-light group-hover:underline ${look.gold}`}>{b.name}</span>
                  <span className={`block text-sm ${look.textMuted}`}>{t(b.why, b.whyJa)}</span>
                  <span className={`inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity ${look.gold}`}>
                    {t(...c.viewBuy)} <ArrowRight aria-hidden="true" className="size-3" />
                  </span>
                </Link>
              ) : (
                <div key={b.name} className={look.bottlePlain}>
                  <span className={`block font-sk-display text-lg font-light ${look.gold}`}>{b.name}</span>
                  <span className={`block text-sm ${look.textMuted}`}>{t(b.why, b.whyJa)}</span>
                </div>
              ),
            )}
          </div>
        </div>

        <button type="button" onClick={quiz.reset} className={`mt-10 flex items-center gap-2 text-sm hover:opacity-80 transition-opacity ${look.gold}`}>
          <RotateCcw aria-hidden="true" className="size-4" />
          {t(...c.retake)}
        </button>
      </div>
    </div>
  );
}
