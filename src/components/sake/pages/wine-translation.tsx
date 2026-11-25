"use client";

import { useState } from "react";
import { ArrowRightLeft, Wine } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { wineTranslations } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/WineTranslation.tsx (2026-11-26). Same copy and
// layout: each sake ↔ wine pair opens its shared traits and key difference. framer-motion is
// tw-animate classes (rows stagger 0.06s, the detail fades in over 0.3s). Changed: every pair's
// detail is in the page (shown when open), so the writing is in the server HTML; the rows say
// whether they're open (aria-expanded).
export function SakeWineTranslation() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("For Wine People Crossing Over", "ワイン愛好家のための架け橋")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Wine aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Sake ↔ Wine", "日本酒 ↔ ワイン")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Daiginjo ≈ Riesling Spätlese. Yamahai ≈ Natural Burgundy. Koshu ≈ Amontillado. A translation guide between two worlds.",
              "大吟醸 ≈ リースリング・シュペートレーゼ。山廃 ≈ ナチュラルブルゴーニュ。古酒 ≈ アモンティリャード。二つの世界の翻訳ガイド。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-3">
          {wineTranslations.map((wt, i) => {
            const open = selected === wt.id;
            return (
              <div
                key={wt.id}
                className="animate-in fade-in slide-in-from-bottom-3.75 duration-500 fill-mode-both"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`sake-wine-${wt.id}`}
                  onClick={() => setSelected(open ? null : wt.id)}
                  className={
                    open
                      ? "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.06)]"
                      : "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                  }
                >
                  <span className="flex items-center gap-4">
                    <span className="flex-1 min-w-0 text-right">
                      <span className="block font-sk-serif text-lg font-bold text-foreground">{t(wt.sakeStyle, wt.sakeStyleJa)}</span>
                      <span className="block text-[10px] font-mono text-muted-foreground tracking-wider uppercase">{t("Sake", "日本酒")}</span>
                    </span>
                    <ArrowRightLeft aria-hidden="true" size={16} className="text-[oklch(0.78_0.12_85)] shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block font-sk-serif text-lg font-bold text-foreground">{t(wt.wineEquivalent, wt.wineEquivalentJa)}</span>
                      <span className="block text-[10px] font-mono text-muted-foreground tracking-wider uppercase">{t("Wine", "ワイン")}</span>
                    </span>
                  </span>
                </button>

                <div id={`sake-wine-${wt.id}`} hidden={!open} className="overflow-hidden animate-in fade-in duration-300">
                  <div className="p-5 bg-[oklch(0.14_0.025_270)] border-x border-b border-[oklch(0.78_0.12_85/0.12)] space-y-3">
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Shared Traits", "共通の特徴")}</p>
                      <p className="text-sm text-foreground">{t(wt.sharedTraits, wt.sharedTraitsJa)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-1">
                        {t("Key Difference", "重要な違い")}
                      </p>
                      <p className="text-sm text-foreground italic">{t(wt.keyDifference, wt.keyDifferenceJa)}</p>
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
            {t('"Translation is always a betrayal. But it\'s the only bridge we have."', "「翻訳は常に裏切り。しかしそれが唯一の架け橋。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
