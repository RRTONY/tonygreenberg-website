"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { riceVarieties } from "@/lib/content/sake/sake-data";
import { sakeImages } from "@/lib/content/sake/images";

// Ported from the Sake app's client/src/pages/Rice.tsx (2026-11-26): the hero, the eight rice cards
// and the detail panel, same copy and classes. framer-motion entrances are tw-animate classes (the
// cards keep the app's 0.06s stagger). The hero photo ("sake-rice") was deleted on Manus, so it is
// the shared ink-wash stand-in until a Sanity copy exists (src/lib/content/sake/images.ts).
// Fixed (rule 20): the detail panel is announced as a dialog, closes on Escape, and its close
// button has a label.

export function SakeRice() {
  const { lang, t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? riceVarieties.find((r) => r.id === selectedId) : null;

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.rice} priority className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.7)] to-[oklch(0.12_0.025_270)]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)]">
              {t("The", "")} <span className="gold-shimmer">{t("Rice", "米の世界")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[oklch(0.65_0.01_85)] text-lg leading-relaxed">
              {t(
                "Every great sake begins with a grain of rice. These eight varieties represent centuries of cultivation, selection, and obsession.",
                "すべての偉大な日本酒は一粒の米から始まる。この8品種は何世紀もの栽培、選抜、そして執念を表す。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Rice grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {riceVarieties.map((rice, i) => (
              <button
                type="button"
                key={rice.id}
                onClick={() => setSelectedId(rice.id)}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="text-left p-5 bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.3)] transition-all duration-500 group relative animate-in fade-in slide-in-from-bottom-5 fill-mode-both"
              >
                <div
                  aria-hidden="true"
                  className="absolute top-3 right-3 font-sk-serif text-3xl font-bold text-[oklch(0.78_0.12_85/0.1)] group-hover:text-[oklch(0.78_0.12_85/0.25)] transition-colors"
                >
                  {rice.nameJa.charAt(0)}
                </div>

                <h3 className="font-sk-serif text-xl font-bold text-[oklch(0.96_0.01_85)]">{lang === "ja" ? rice.nameJa : rice.name}</h3>
                <p className="mt-1 text-[10px] tracking-widest text-[oklch(0.55_0.02_270)]">{lang === "ja" ? rice.originJa : rice.origin}</p>

                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[oklch(0.5_0.02_270)]">{t("Shinpaku", "心白")}</span>
                    <p className="text-xs text-[oklch(0.7_0.01_85)]">{lang === "ja" ? rice.shinpakuSizeJa : rice.shinpakuSize}</p>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-[oklch(0.5_0.02_270)]">{t("Best For", "最適")}</span>
                    <p className="text-xs text-[oklch(0.78_0.12_85)]">{lang === "ja" ? rice.bestForJa : rice.bestFor}</p>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 w-0 h-0 border-b border-r border-[oklch(0.78_0.12_85/0)] group-hover:w-8 group-hover:h-8 group-hover:border-[oklch(0.78_0.12_85/0.4)] transition-all duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detail panel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-[oklch(0.05_0.02_270/0.8)] backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sake-rice-detail-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-[oklch(0.14_0.03_270)] border border-[oklch(0.78_0.12_85/0.2)] max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative animate-in fade-in zoom-in-95 slide-in-from-bottom-[30px] duration-300"
          >
            <button
              type="button"
              aria-label={t("Close", "閉じる")}
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 flex items-center justify-center text-[oklch(0.55_0.02_270)] hover:text-[oklch(0.85_0.01_85)] transition-colors"
            >
              <X aria-hidden="true" size={20} />
            </button>

            <div aria-hidden="true" className="font-sk-serif text-6xl font-bold text-[oklch(0.78_0.12_85/0.15)] mb-2">
              {selected.nameJa}
            </div>

            <h2 id="sake-rice-detail-title" className="font-sk-serif text-3xl font-bold text-[oklch(0.96_0.01_85)]">
              {lang === "ja" ? selected.nameJa : selected.name}
            </h2>
            <p className="mt-1 text-sm text-[oklch(0.55_0.02_270)]">{lang === "ja" ? selected.originJa : selected.origin}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 bg-[oklch(0.18_0.03_270)]">
                <div className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Shinpaku", "心白")}</div>
                <div className="mt-1 text-sm text-[oklch(0.85_0.01_85)]">{lang === "ja" ? selected.shinpakuSizeJa : selected.shinpakuSize}</div>
              </div>
              <div className="p-3 bg-[oklch(0.18_0.03_270)]">
                <div className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Polishability", "精米適性")}</div>
                <div className="mt-1 text-sm text-[oklch(0.85_0.01_85)]">{lang === "ja" ? selected.polishabilityJa : selected.polishability}</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[oklch(0.18_0.03_270)]">
              <div className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Best For", "最適")}</div>
              <div className="mt-1 text-sm text-[oklch(0.78_0.12_85)]">{lang === "ja" ? selected.bestForJa : selected.bestFor}</div>
            </div>

            <div className="mt-6">
              <h3 className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.78_0.12_85)] mb-2">{t("Characteristics", "特性")}</h3>
              <p className="text-[oklch(0.75_0.01_85)] leading-relaxed">{lang === "ja" ? selected.characteristicsJa : selected.characteristics}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.78_0.12_85)] mb-2">{t("History & Notes", "歴史とメモ")}</h3>
              <p className="text-[oklch(0.65_0.01_85)] leading-relaxed">{lang === "ja" ? selected.descriptionJa : selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
