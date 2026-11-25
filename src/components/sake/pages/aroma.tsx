"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { SakeCard } from "@/components/sake/sake-card";
import { sakeImages } from "@/lib/content/sake/images";
import { aromaFamilies, sakeBottles } from "@/lib/content/sake/sake-data";

// Ported from the Sake app's client/src/pages/Aroma.tsx (2026-11-26): pick aromas from the six
// families and see the bottles that match, best match first. Same copy and colors. Changed:
// - The hero photo ("sake-aroma" on Manus) is gone; SakeImage shows its Sanity copy once uploaded,
//   the ink-wash stand-in until then.
// - The app put the aroma buttons inside the family button (a button in a button, which browsers and
//   screen readers can't handle); the family name is its own toggle button now and the aromas sit
//   below it in the same card.
// - The "×" typed after each picked aroma is a lucide X (rule 18).
// - Each family's dot color comes from the data (a runtime value, the allowed inline style).
// - framer-motion: hero fades up, cards and matches stagger in (CSS).

export function SakeAroma() {
  const { lang, t } = useLanguage();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);

  const toggleAroma = (aroma: string) =>
    setSelectedAromas((prev) => (prev.includes(aroma) ? prev.filter((a) => a !== aroma) : [...prev, aroma]));

  const matchedSakes = useMemo(() => {
    if (selectedAromas.length === 0) return [];
    return sakeBottles
      .map((bottle) => {
        const matchCount = bottle.aromaProfile.filter((a) =>
          selectedAromas.some((sa) => a.toLowerCase().includes(sa.toLowerCase()) || sa.toLowerCase().includes(a.toLowerCase())),
        ).length;
        return { bottle, matchCount };
      })
      .filter((m) => m.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [selectedAromas]);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.aroma} priority className="hero-image size-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.7)] to-[oklch(0.12_0.025_270)]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)]">
              {t("Aroma", "香りの")} <span className="gold-shimmer">{t("Finder", "探索")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[oklch(0.65_0.01_85)] text-lg leading-relaxed">
              {t(
                "Select the aromas that speak to you. We'll find the bottles that match your nose.",
                "あなたに語りかける香りを選んでください。あなたの鼻に合う瓶を見つけます。",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Aroma families */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {aromaFamilies.map((family, i) => {
              const open = selectedFamily === family.id;
              const panelId = `aroma-family-${family.id}`;
              return (
                <div
                  key={family.id}
                  className={
                    open
                      ? "text-left border transition-all duration-500 group bg-[oklch(0.18_0.03_270)] border-[oklch(0.78_0.12_85/0.4)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                      : "text-left border transition-all duration-500 group bg-[oklch(0.16_0.03_270)] border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.2)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  }
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFamily(open ? null : family.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="block w-full text-left p-5"
                  >
                    <span className="flex items-center gap-3 mb-2">
                      <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: family.color }} />
                      <span className="font-sk-serif text-xl font-bold text-[oklch(0.96_0.01_85)]">{lang === "ja" ? family.nameJa : family.name}</span>
                    </span>
                    <span className="block text-xs text-[oklch(0.6_0.01_85)] leading-relaxed">{lang === "ja" ? family.descriptionJa : family.description}</span>
                  </button>

                  <div id={panelId} hidden={!open} className="px-5 pb-5 animate-in fade-in duration-300">
                    <div className="pt-4 border-t border-[oklch(0.78_0.12_85/0.1)] flex flex-wrap gap-2">
                      {family.aromas.map((aroma) => {
                        const isSelected = selectedAromas.includes(aroma.name.toLowerCase());
                        return (
                          <button
                            type="button"
                            key={aroma.name}
                            onClick={() => toggleAroma(aroma.name.toLowerCase())}
                            aria-pressed={isSelected}
                            className={
                              isSelected
                                ? "px-3 py-1.5 text-xs tracking-wider transition-all duration-300 border bg-[oklch(0.78_0.12_85/0.2)] border-[oklch(0.78_0.12_85/0.5)] text-[oklch(0.78_0.12_85)]"
                                : "px-3 py-1.5 text-xs tracking-wider transition-all duration-300 border bg-transparent border-[oklch(0.3_0.03_270)] text-[oklch(0.65_0.01_85)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                            }
                          >
                            {lang === "ja" ? aroma.nameJa : aroma.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected aromas */}
          {selectedAromas.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-2.5 duration-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Your aromas:", "あなたの香り:")}</span>
                {selectedAromas.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAroma(a)}
                    aria-label={t(`Remove ${a}`, `${a}を外す`)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[oklch(0.78_0.12_85/0.15)] border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)] hover:bg-[oklch(0.78_0.12_85/0.25)] transition-colors capitalize"
                  >
                    {a}
                    <X aria-hidden="true" className="size-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAromas([])}
                  className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)] hover:text-[oklch(0.78_0.12_85)] transition-colors ml-2"
                >
                  {t("Clear all", "すべてクリア")}
                </button>
              </div>
            </div>
          )}

          {/* Matched sakes */}
          {matchedSakes.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="kintsugi-line mb-8" />
              <h2 className="font-sk-serif text-3xl font-bold text-[oklch(0.96_0.01_85)] mb-6" aria-live="polite">
                {t(`${matchedSakes.length} Bottles Match Your Nose`, `${matchedSakes.length}本があなたの鼻に合います`)}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedSakes.map(({ bottle, matchCount }, i) => (
                  <div
                    key={bottle.id}
                    className="animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <SakeCard
                      id={bottle.id}
                      name={bottle.name}
                      nameJa={bottle.nameJa}
                      brewery={bottle.brewery}
                      breweryJa={bottle.breweryJa}
                      type={bottle.type}
                      flavorNotes={bottle.flavorNotes}
                      flavorNotesJa={bottle.flavorNotesJa}
                      aromas={bottle.aromaProfile}
                      highlightedAromas={selectedAromas}
                      matchLabel={`${matchCount}/${selectedAromas.length}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedAromas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[oklch(0.5_0.02_270)] text-sm">{t("Select an aroma family above to begin exploring.", "上のアロマファミリーを選んで探索を始めましょう。")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
