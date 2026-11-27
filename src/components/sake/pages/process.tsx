"use client";

import { useState } from "react";
import { Amphora, Bubbles, ChevronDown, Cog, Dna, Droplets, Flame, Sprout, Wine, type LucideIcon } from "lucide-react";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { brewingSteps } from "@/lib/content/sake/sake-data";
import { sakeImages } from "@/lib/content/sake/images";

// Ported from the Sake app's client/src/pages/Process.tsx (2026-11-26): the hero, the eight-step
// timeline and each step's expanding detail (the deep dive in Connoisseur mode), same copy and
// classes. framer-motion entrances are tw-animate classes (0.08s stagger kept). The hero photo
// ("sake-brewing") was deleted on Manus: ink-wash stand-in until a Sanity copy exists.
// Changed: the steps' emoji icons (⚙️ 💧 ♨️ 🍄 🧬 🫧 🏺 🍶, rule 18) are lucide icons; the card is no
// longer one big <button> wrapping paragraphs (invalid HTML) but a card whose header is the
// button (aria-expanded), and the detail stays in the page HTML, hidden until opened.

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Cog,
  2: Droplets,
  3: Flame,
  4: Sprout,
  5: Dna,
  6: Bubbles,
  7: Amphora,
  8: Wine,
};

export function SakeProcess() {
  const { lang, t } = useLanguage();
  const { isConnoisseur } = useMode();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.brewing} priority className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.7)] to-[oklch(0.12_0.025_270)]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)]">
              {t("The Sacred", "聖なる")} <span className="gold-shimmer">{t("Process", "工程")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[oklch(0.65_0.01_85)] text-lg leading-relaxed">
              {t(
                "Eight stages. Centuries of wisdom. A journey through the alchemy of rice, water, koji, and time.",
                "8つの段階。何世紀もの知恵。米、水、麹、そして時間の錬金術の旅。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-linear-to-b from-[oklch(0.78_0.12_85/0.3)] via-[oklch(0.78_0.12_85/0.15)] to-transparent"
            />

            <ol className="space-y-2">
              {brewingSteps.map((step, i) => {
                const isExpanded = expandedId === step.id;
                const Icon = STEP_ICONS[step.id] ?? Cog;
                const panelId = `sake-step-${step.id}`;
                return (
                  <li
                    key={step.id}
                    style={{ animationDelay: `${i * 0.08}s` }}
                    className="relative pl-16 sm:pl-20 animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both"
                  >
                    <div
                      aria-hidden="true"
                      className={
                        isExpanded
                          ? "absolute left-4 sm:left-6 top-6 size-4 rounded-full border-2 transition-colors duration-300 bg-[oklch(0.78_0.12_85)] border-[oklch(0.78_0.12_85)]"
                          : "absolute left-4 sm:left-6 top-6 size-4 rounded-full border-2 transition-colors duration-300 bg-[oklch(0.16_0.03_270)] border-[oklch(0.78_0.12_85/0.4)]"
                      }
                    />

                    <div
                      className={
                        isExpanded
                          ? "w-full text-left transition-all duration-500 border bg-[oklch(0.16_0.03_270)] border-[oklch(0.78_0.12_85/0.3)]"
                          : "w-full text-left transition-all duration-500 border bg-[oklch(0.14_0.025_270)] border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.2)]"
                      }
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        onClick={() => setExpandedId(isExpanded ? null : step.id)}
                        className="w-full text-left p-5 sm:p-6"
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span className="flex-1 block">
                            <span className="flex items-center gap-3 mb-1">
                              <Icon aria-hidden="true" className="size-6 text-[oklch(0.78_0.12_85)]" />
                              <span className="font-mono text-[10px] tracking-[0.15em] text-[oklch(0.78_0.12_85)]">
                                {t(`STEP ${step.id}`, `第${step.id}工程`)}
                              </span>
                            </span>
                            <span className="block font-sk-serif text-2xl font-bold text-[oklch(0.96_0.01_85)]">
                              {lang === "ja" ? step.nameJa : step.name}
                            </span>
                            <span className="block mt-0.5 text-xs italic text-[oklch(0.65_0.01_85)] font-sk-serif">
                              {lang === "ja" ? step.subtitleJa : step.subtitle}
                            </span>
                            <span className="block mt-2 text-sm text-[oklch(0.65_0.01_85)] leading-relaxed">
                              {lang === "ja" ? step.descriptionJa : step.description}
                            </span>
                          </span>
                          <span className="flex flex-col items-end gap-1 shrink-0">
                            <span className="font-mono text-[10px] text-[oklch(0.55_0.02_270)]">
                              {lang === "ja" ? step.durationJa : step.duration}
                            </span>
                            <ChevronDown
                              aria-hidden="true"
                              size={16}
                              className={
                                isExpanded
                                  ? "text-[oklch(0.55_0.02_270)] transition-transform duration-300 rotate-180"
                                  : "text-[oklch(0.55_0.02_270)] transition-transform duration-300"
                              }
                            />
                          </span>
                        </span>
                      </button>

                      <div id={panelId} hidden={!isExpanded} className="px-5 sm:px-6 pb-5 sm:pb-6 animate-in fade-in duration-300">
                        <div className="pt-4 border-t border-[oklch(0.78_0.12_85/0.1)]">
                          <p className="text-sm text-[oklch(0.75_0.01_85)] leading-relaxed">
                            {isConnoisseur
                              ? lang === "ja"
                                ? step.detailedDescriptionJa
                                : step.detailedDescription
                              : lang === "ja"
                                ? step.descriptionJa
                                : step.description}
                          </p>
                          {!isConnoisseur && (
                            <p className="mt-3 text-xs text-[oklch(0.55_0.02_270)] italic">
                              {t("Switch to Connoisseur mode for the deep dive.", "通モードに切り替えると詳細が表示されます。")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
