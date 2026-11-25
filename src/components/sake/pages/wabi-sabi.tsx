"use client";

import { useState } from "react";
import { useLanguage } from "@/components/sake/sake-providers";
import { Reveal } from "@/components/sake/motion";
import { SakeImage } from "@/components/sake/sake-image";
import { wabiSabiPrinciples } from "@/lib/content/sake/culture-data";
import { sakeImages } from "@/lib/content/sake/images";

// Ported from the Sake app's client/src/pages/WabiSabi.tsx (2026-11-26): the hero, the seven
// principles (each opens a tasting meditation and the sake that embodies it), the closing line and
// the page's own sign-off, same copy and classes. framer-motion entrances are tw-animate classes /
// <Reveal> (0.05s stagger kept). The hero photo (the app reused "sake-aroma") was deleted on Manus:
// ink-wash stand-in until a Sanity copy exists.
// Changed: each principle card was one <button> wrapping a heading and paragraphs (invalid HTML);
// the heading now holds the button and its overlay covers the card, so clicking anywhere still
// opens it. The meditation and example stay in the page HTML, hidden until opened.

export function SakeWabiSabi() {
  const { t } = useLanguage();
  const [activePrinciple, setActivePrinciple] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.aroma} priority className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.8)] via-[oklch(0.12_0.025_270/0.6)] to-[oklch(0.12_0.025_270)]" />
        </div>
        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className="text-xs tracking-[0.3em] uppercase text-[oklch(0.78_0.12_85)] mb-4 font-mono">{t("侘寂 — Wabi-Sabi", "侘寂 — わびさび")}</p>
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)] leading-tight">
              {t("Taste the", "味わえ、")} <span className="gold-shimmer">{t("Imperfection", "不完全を")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[oklch(0.7_0.01_85)] text-lg leading-relaxed">
              {t(
                'Not "rate this sake 92 points." Sit with its imperfection. The crack in the cup is where the gold enters. Seven principles for tasting with your soul, not your scorecard.',
                "「この日本酒を92点と評価する」のではない。その不完全さと共に座れ。杯のひびこそ金が入る場所。スコアカードではなく、魂で味わうための七つの原則。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Principles */}
      <section className="py-16 lg:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {wabiSabiPrinciples.map((p, i) => {
              const isActive = activePrinciple === p.id;
              const panelId = `sake-wabi-${p.id}`;
              return (
                <Reveal key={p.id} delay={i * 0.05} enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both">
                  <div
                    className={
                      isActive
                        ? "relative overflow-hidden border transition-all duration-500 bg-[oklch(0.16_0.03_270)] border-[oklch(0.78_0.12_85/0.4)]"
                        : "relative overflow-hidden border transition-all duration-500 bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.2)]"
                    }
                  >
                    <div className="p-6 flex items-start gap-6">
                      <div className="shrink-0 size-16 flex items-center justify-center border border-[oklch(0.78_0.12_85/0.2)]">
                        <span aria-hidden="true" className="font-sk-serif text-2xl font-bold text-[oklch(0.78_0.12_85)]">
                          {p.kanji.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-sk-serif text-xl sm:text-2xl font-bold text-[oklch(0.96_0.01_85)]">
                          <button
                            type="button"
                            aria-expanded={isActive}
                            aria-controls={panelId}
                            onClick={() => setActivePrinciple(isActive ? null : p.id)}
                            className="text-left after:absolute after:inset-0 after:content-['']"
                          >
                            {t(p.name, p.nameJa)}
                          </button>
                        </h3>
                        <p className="mt-2 text-sm text-[oklch(0.7_0.01_85)] leading-relaxed">{t(p.description, p.descriptionJa)}</p>
                      </div>
                    </div>

                    <div id={panelId} hidden={!isActive} className="animate-in fade-in duration-300">
                      <div className="px-6 pb-6 pt-2 border-t border-[oklch(0.28_0.04_270)]">
                        <div className="grid sm:grid-cols-2 gap-6 mt-4">
                          <div className="p-4 bg-[oklch(0.12_0.025_270)] border border-[oklch(0.78_0.12_85/0.15)]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-3 font-mono">
                              {t("Tasting Meditation", "テイスティング瞑想")}
                            </p>
                            <p className="text-sm text-[oklch(0.85_0.01_85)] leading-relaxed italic">&ldquo;{t(p.tastingPrompt, p.tastingPromptJa)}&rdquo;</p>
                          </div>

                          <div className="p-4 bg-[oklch(0.12_0.025_270)] border border-[oklch(0.45_0.18_25/0.15)]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-[oklch(0.45_0.18_25)] mb-3 font-mono">
                              {t("Embodied By", "体現する酒")}
                            </p>
                            <p className="text-sm text-[oklch(0.85_0.01_85)] leading-relaxed">{t(p.sakeExample, p.sakeExampleJa)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing meditation */}
      <section className="py-16 lg:py-24 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-200 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal enter="animate-in fade-in duration-1000 fill-mode-both">
            <p className="font-sk-serif text-3xl sm:text-4xl italic text-[oklch(0.78_0.12_85)] leading-relaxed">
              {t('"The crack in the cup is where the gold enters."', "「杯のひびこそ金が入る場所。」")}
            </p>
            <p className="mt-6 text-sm text-[oklch(0.5_0.02_270)] tracking-widest">
              {t("— Kintsugi philosophy, applied to tasting", "— 金継ぎの哲学、テイスティングに応用")}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="py-12 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p aria-hidden="true" className="font-sk-serif text-lg text-[oklch(0.78_0.12_85)] tracking-wider">
            酒
          </p>
          <p className="mt-2 text-xs text-[oklch(0.45_0.02_270)] tracking-[0.15em] uppercase">
            {t("Sake for Sake's Sake — A guide for the gloriously obsessed", "酒のためだけの酒 — 栄光ある執着者のためのガイド")}
          </p>
        </div>
      </div>
    </div>
  );
}
