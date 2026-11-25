"use client";

import { Flower2, Home, Lightbulb, Music2, Thermometer, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { homeIzakayaElements } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/HomeIzakaya.tsx (2026-11-26). Same copy, step icons
// and layout; framer-motion entrances are tw-animate classes with the app's 0.1s stagger.

const STEP_ICONS: LucideIcon[] = [Lightbulb, Music2, UtensilsCrossed, Thermometer, Flower2, Home];

export function SakeHomeIzakaya() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("Bring Kyoto Home", "京都を家に")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Home aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Home Izakaya Builder", "自宅居酒屋ビルダー")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Transform your kitchen into a Kyoto backstreet bar. Lighting, music, vessels, temperature, food sequence, seasonal ikebana.",
              "キッチンを京都の裏路地バーに変える。照明、音楽、器、温度、料理の順序、季節の生け花。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {homeIzakayaElements.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? Home;
          return (
            <div
              key={step.id}
              className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-6 hover:border-[oklch(0.78_0.12_85/0.3)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]">
                  <Icon aria-hidden="true" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[oklch(0.78_0.12_85)] text-[10px] tracking-[0.2em] uppercase">
                      {t(`Step ${i + 1}`, `ステップ ${i + 1}`)}
                    </span>
                  </div>
                  <h2 className="font-sk-serif text-xl font-bold text-foreground mb-3">{t(step.title, step.titleJa)}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t(step.description, step.descriptionJa)}</p>
                  <div className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.1)] p-4">
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-1">{t("Tips", "ヒント")}</p>
                    <ul className="space-y-1">
                      {step.tips.map((tip, j) => (
                        <li key={tip} className="text-sm text-foreground flex items-start gap-2">
                          <span aria-hidden="true" className="text-[oklch(0.78_0.12_85)] mt-1">
                            •
                          </span>
                          {t(tip, step.tipsJa[j])}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-10 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The best izakaya is the one where nobody\'s watching."', "「最高の居酒屋は誰も見ていない場所。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
