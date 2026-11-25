"use client";

import { useState } from "react";
import { Flower2, Microscope } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { yeastStrains } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Yeast.tsx (2026-11-26). Same copy and layout: each
// strain opens its character, aroma and best use; wild yeasts are marked in crimson with a flower.
// framer-motion is tw-animate classes (rows stagger 0.08s, the detail fades in over 0.3s). Changed:
// every strain's detail is in the page (shown when open), so the writing is in the server HTML; rows
// say whether they're open (aria-expanded); (rule 20) the crimson strain number is lightened from
// oklch(0.45 0.18 25) to oklch(0.62 0.19 25) so it can be read on the dark cards.
export function SakeYeast() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("The Invisible Architect", "見えない建築家")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Microscope aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Yeast Strains", "酵母の世界")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Association No. 7, No. 9, No. 14, No. 18. Plus wild flower yeasts captured from petals and house yeasts living in brewery walls. Each strain is a personality.",
              "協会7号、9号、14号、18号。花びらから捕獲した野生花酵母と蔵の壁に住む蔵付き酵母。各株が一つの個性。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-3">
          {yeastStrains.map((ys, i) => {
            const open = selected === ys.id;
            return (
              <div
                key={ys.id}
                className="animate-in fade-in slide-in-from-bottom-3.75 duration-500 fill-mode-both"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`sake-yeast-${ys.id}`}
                  onClick={() => setSelected(open ? null : ys.id)}
                  className={
                    open
                      ? "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.06)]"
                      : "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                  }
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        ys.wild
                          ? "px-2 py-1 border text-xs font-mono tracking-wider border-[oklch(0.45_0.18_25/0.5)] text-[oklch(0.62_0.19_25)]"
                          : "px-2 py-1 border text-xs font-mono tracking-wider border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]"
                      }
                    >
                      {ys.wild && <Flower2 aria-hidden="true" size={12} className="inline mr-1" />}
                      {ys.number}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-sk-serif text-lg font-bold text-foreground">{t(ys.name, ys.nameJa)}</span>
                      <span className="block text-xs text-muted-foreground">{t(ys.origin, ys.originJa)}</span>
                    </span>
                  </span>
                </button>

                <div id={`sake-yeast-${ys.id}`} hidden={!open} className="overflow-hidden animate-in fade-in duration-300">
                  <div className="p-5 bg-[oklch(0.14_0.025_270)] border-x border-b border-[oklch(0.78_0.12_85/0.15)]">
                    <p className="text-sm text-foreground leading-relaxed mb-4">{t(ys.character, ys.characterJa)}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[oklch(0.16_0.03_270)] p-3 border border-[oklch(0.28_0.04_270)]">
                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Aroma", "香り")}</p>
                        <p className="text-sm text-foreground">{t(ys.aroma, ys.aromaJa)}</p>
                      </div>
                      <div className="bg-[oklch(0.16_0.03_270)] p-3 border border-[oklch(0.28_0.04_270)]">
                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Best For", "最適")}</p>
                        <p className="text-sm text-foreground">{t(ys.bestFor, ys.bestForJa)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The yeast that lives in the walls IS the brewery\'s soul."', "「壁に住む酵母こそ蔵の魂そのもの。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
