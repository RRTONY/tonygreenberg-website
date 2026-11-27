"use client";

import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { AmbientSound } from "@/components/sake/ambient-sound";
import { kurabitoDiary } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/Kurabito.tsx (2026-11-26): the hero with the brewery
// soundscape, the eight diary entries (dots, the entry, Previous / Next) and the closing line, same
// copy. framer-motion's AnimatePresence swap is the entry sliding in from the right on each change.
// Fixed (rule 20): the app wrote its per-look colors as inline styles with Tailwind-style underscores
// ('oklch(0.78_0.12_85)'), which browsers reject, so on live the accents, card and dots fell back to
// plain colors; they are real classes now (Austere values behind `[.sake-austere_&]:`). The 10px
// timeline dots were stretched to 44px circles by the app's own tap-target rule; they are 44px
// targets (40px wide so all eight fit a phone) with the 10px dot inside, labelled with their entry, and the current one is marked.

const FG = "text-[oklch(0.93_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_MUTED = "text-[oklch(0.65_0.02_270)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";

export function SakeKurabito() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const entry = kurabitoDiary[current];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background transition-colors duration-500">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <div className="flex justify-center mb-4">
            <AmbientSound type="brewery" label={{ en: "Brewery at dawn", ja: "夜明けの蔵" }} />
          </div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">
            {t("A Brewing Season in Eight Entries", "八つの日記で綴る醸造の季節")}
          </p>
          <h1 className={`font-sk-display font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-[0.2em]! text-4xl sm:text-6xl mb-6 ${FG}`}>
            <BookOpen aria-hidden="true" className="inline-block mr-3 text-(--sk-accent)" size={36} />
            {t("Kurabito Diaries", "蔵人の日記")}
          </h1>
          <p className={`max-w-xl mx-auto text-sm leading-relaxed ${FG_MUTED}`}>
            {t(
              "They leave their families in October and return in March. Six months of silence, 4am wake-ups, and the slow transformation of rice into something sacred.",
              "10月に家族を残して出発し、3月に戻る。6ヶ月の沈黙、午前4時の起床、そして米が神聖なものへとゆっくり変容する日々。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4">
        {/* Timeline dots */}
        <div className="flex flex-wrap justify-center mb-10">
          {kurabitoDiary.map((d, i) => (
            <button
              type="button"
              key={i}
              aria-label={t(d.title, d.titleJa)}
              aria-current={i === current ? "step" : undefined}
              onClick={() => setCurrent(i)}
              className="flex items-center justify-center min-w-10 min-h-11"
            >
              <span
                aria-hidden="true"
                className={
                  i === current
                    ? "size-2.5 rounded-full transition-all duration-300 scale-125 bg-[oklch(0.78_0.12_85)] [.sake-austere_&]:bg-[oklch(0.52_0.19_30)]"
                    : i < current
                      ? "size-2.5 rounded-full transition-all duration-300 bg-[oklch(0.78_0.12_85/0.4)] [.sake-austere_&]:bg-[oklch(0.52_0.19_30/0.4)]"
                      : "size-2.5 rounded-full transition-all duration-300 bg-[oklch(0.28_0.04_270)] [.sake-austere_&]:bg-[oklch(0.82_0.008_80)]"
                }
              />
            </button>
          ))}
        </div>

        {/* Diary entry */}
        <div
          key={current}
          aria-live="polite"
          className="p-6 sm:p-10 border bg-[oklch(0.14_0.025_270)] border-[oklch(0.78_0.12_85/0.15)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.15)] animate-in fade-in slide-in-from-right-[30px] duration-400"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-(--sk-accent)">{t(entry.date, entry.dateJa)}</p>
              <p className={`font-mono text-[9px] tracking-[0.15em] uppercase mt-1 ${FG_MUTED}`}>{t(entry.role, entry.roleJa)}</p>
            </div>
            <span className={`font-mono text-[10px] ${FG_MUTED}`}>
              {current + 1} / {kurabitoDiary.length}
            </span>
          </div>

          <h2 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-2xl sm:text-3xl mb-6 ${FG}`}>{t(entry.title, entry.titleJa)}</h2>

          <p className={`font-sk-display text-sm sm:text-base leading-[1.9] font-light ${FG}`}>{t(entry.entry, entry.entryJa)}</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors disabled:opacity-30 ${FG_MUTED}`}
          >
            <ChevronLeft aria-hidden="true" size={16} />
            {t("Previous", "前へ")}
          </button>
          <button
            type="button"
            onClick={() => setCurrent(Math.min(kurabitoDiary.length - 1, current + 1))}
            disabled={current === kurabitoDiary.length - 1}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors disabled:opacity-30 ${FG_MUTED}`}
          >
            {t("Next", "次へ")}
            <ChevronRight aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className={`font-sk-display text-lg italic ${FG_MUTED}`}>{t('"I will be back in October."', "「10月にまた来る。」")}</p>
        </div>
      </div>
    </div>
  );
}
