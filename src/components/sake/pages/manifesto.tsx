"use client";

import { Flame } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { manifestoSections } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Manifesto.tsx (2026-11-26). Same copy and layout;
// framer-motion entrances are tw-animate classes (sections stagger 0.1s, the signature fades in at
// 1.5s). Changed (rule 20): the small crimson "A Declaration" label is lightened from
// oklch(0.45 0.18 25) to oklch(0.62 0.19 25) so it can be read on the near-black background.
export function SakeManifesto() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.62_0.19_25)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("A Declaration", "宣言")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Flame aria-hidden="true" className="inline-block mr-3 text-[oklch(0.45_0.18_25)]" size={36} />
            {t("The Anti-Score Manifesto", "アンチスコア宣言")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Why we reject 100-point scoring. Why EVI and EEI matter more than Parker points. The soul of this site distilled into words.",
              "なぜ100点評価を拒否するのか。なぜEVIとEEIがパーカーポイントより重要なのか。このサイトの魂を言葉に蒸留。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4">
        <article className="space-y-8">
          {manifestoSections.map((section, i) => (
            <div
              key={section.id}
              className="animate-in fade-in slide-in-from-bottom-3.75 duration-600 fill-mode-both"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h2 className="font-sk-serif text-2xl font-bold text-[oklch(0.78_0.12_85)] mb-4">{t(section.title, section.titleJa)}</h2>
              <p className="font-sk-serif text-base sm:text-lg text-foreground leading-[1.9] font-light">{t(section.body, section.bodyJa)}</p>
            </div>
          ))}
        </article>

        <div className="mt-16 text-center animate-in fade-in duration-800 delay-1500 fill-mode-both">
          <div className="kintsugi-line mb-8" />
          <div className="hanko text-xl mx-auto w-fit">酒</div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {t("Sake for Sake's Sake", "酒のための酒")}
          </p>
        </div>
      </div>
    </div>
  );
}
