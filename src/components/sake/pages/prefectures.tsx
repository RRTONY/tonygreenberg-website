"use client";

import { useState } from "react";
import { Droplets, MapPin, Wine } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { sakeImages } from "@/lib/content/sake/images";
import { prefectures } from "@/lib/content/sake/sake-data";

// Ported from the Sake app's client/src/pages/Prefectures.tsx (2026-11-26): the simplified Japan
// map with prefecture markers and the expandable prefecture cards. Same copy and colors. Changed:
// - The hero photo ("sake-prefecture" on Manus) is gone; SakeImage shows its Sanity copy once
//   uploaded, the ink-wash stand-in until then.
// - Marker positions stay inline styles (runtime numbers from the data, the allowed exception).
// - Each prefecture's water, breweries and story are in the server HTML (hidden until opened); the
//   markers and cards say which prefecture they open (aria-label / aria-expanded).
// - framer-motion: hero fades up, cards stagger in (CSS).

// Approximate positions for prefecture markers on a simplified Japan map (the app's own values).
const prefPositions: Record<string, { x: number; y: number }> = {
  niigata: { x: 62, y: 28 },
  yamagata: { x: 68, y: 25 },
  hyogo: { x: 42, y: 52 },
  akita: { x: 66, y: 20 },
  fukui: { x: 48, y: 42 },
  nara: { x: 45, y: 55 },
  yamaguchi: { x: 28, y: 55 },
  saga: { x: 18, y: 62 },
  shizuoka: { x: 58, y: 48 },
  ishikawa: { x: 50, y: 38 },
};

export function SakePrefectures() {
  const { lang, t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const openFromMap = (id: string) => {
    setSelectedId(id);
    document.getElementById(`pref-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.prefecture} priority className="hero-image size-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.7)] to-[oklch(0.12_0.025_270)]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)]">
              {t("The", "")} <span className="gold-shimmer">{t("Prefectures", "産地マップ")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[oklch(0.65_0.01_85)] text-lg leading-relaxed">
              {t(
                "From Niigata's snow country to Saga's tropical warmth. Every prefecture tells a different story through its sake.",
                "新潟の雪国から佐賀の温暖な地まで。すべての県が日本酒を通じて異なる物語を語る。",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
            {/* Map */}
            <div className="relative">
              <div className="lg:sticky lg:top-24">
                <h2 className="font-sk-serif text-2xl font-bold text-[oklch(0.96_0.01_85)] mb-6">{t("Sake Regions of Japan", "日本の日本酒産地")}</h2>
                <div className="relative w-full aspect-3/4 bg-[oklch(0.14_0.03_270)] border border-[oklch(0.28_0.04_270)] overflow-hidden">
                  <svg viewBox="0 0 100 100" className="size-full opacity-10" aria-hidden="true">
                    <path
                      d="M15,65 Q20,55 25,50 Q30,45 35,40 Q40,35 45,32 Q50,30 55,28 Q60,25 65,22 Q70,20 72,18 L75,15 Q72,20 70,25 Q68,30 65,35 Q62,40 60,45 Q58,50 55,55 Q52,58 48,60 Q44,62 40,63 Q35,64 30,65 Q25,66 20,67 Z"
                      fill="oklch(0.78 0.12 85)"
                    />
                  </svg>
                  {prefectures.map((pref) => {
                    const pos = prefPositions[pref.id];
                    if (!pos) return null;
                    const isActive = selectedId === pref.id || hoveredId === pref.id;
                    const name = lang === "ja" ? pref.nameJa : pref.name;
                    return (
                      <button
                        type="button"
                        key={pref.id}
                        onClick={() => openFromMap(pref.id)}
                        onMouseEnter={() => setHoveredId(pref.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onFocus={() => setHoveredId(pref.id)}
                        onBlur={() => setHoveredId(null)}
                        aria-label={name}
                        className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group z-10"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        <span
                          className={
                            isActive
                              ? "relative flex items-center justify-center transition-all duration-300 scale-125"
                              : "relative flex items-center justify-center transition-all duration-300"
                          }
                        >
                          <span
                            className={
                              isActive
                                ? "size-3 rounded-full transition-all duration-300 bg-[oklch(0.78_0.12_85)] shadow-[0_0_12px_oklch(0.78_0.12_85/0.5)]"
                                : "size-3 rounded-full transition-all duration-300 bg-[oklch(0.78_0.12_85/0.5)]"
                            }
                          />
                          {isActive && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-[oklch(0.16_0.03_270)] border border-[oklch(0.78_0.12_85/0.3)] text-[10px] text-[oklch(0.93_0.01_85)]">
                              {name}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                  <div className="absolute bottom-3 right-3 text-[9px] tracking-[0.15em] uppercase text-[oklch(0.35_0.03_270)]">
                    {t("Interactive Map", "インタラクティブマップ")}
                  </div>
                </div>
                <p className="mt-3 text-xs text-[oklch(0.45_0.02_270)]">
                  {t("Click a marker to explore the prefecture's sake culture.", "マーカーをクリックして県の日本酒文化を探索。")}
                </p>
              </div>
            </div>

            {/* Prefecture cards */}
            <div className="space-y-4">
              {prefectures.map((pref, i) => {
                const isActive = selectedId === pref.id;
                const panelId = `pref-panel-${pref.id}`;
                return (
                  <div
                    key={pref.id}
                    id={`pref-${pref.id}`}
                    className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(isActive ? null : pref.id)}
                      onMouseEnter={() => setHoveredId(pref.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      className={
                        isActive
                          ? "w-full text-left p-5 border transition-all duration-500 bg-[oklch(0.18_0.03_270)] border-[oklch(0.78_0.12_85/0.4)]"
                          : "w-full text-left p-5 border transition-all duration-500 bg-[oklch(0.16_0.03_270)] border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.2)]"
                      }
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="block">
                          <span className="flex items-center gap-2 mb-1">
                            <MapPin aria-hidden="true" size={14} className="text-[oklch(0.78_0.12_85)]" />
                            <span className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{lang === "ja" ? pref.regionJa : pref.region}</span>
                          </span>
                          <span className="block font-sk-serif text-2xl font-bold text-[oklch(0.96_0.01_85)]">{lang === "ja" ? pref.nameJa : pref.name}</span>
                          <span className="block mt-1 text-sm text-[oklch(0.65_0.01_85)]">{lang === "ja" ? pref.styleJa : pref.style}</span>
                        </span>
                        <span className="block text-right shrink-0">
                          <span className="block font-mono text-2xl font-bold text-[oklch(0.78_0.12_85)]">{pref.breweryCount}</span>
                          <span className="block text-[9px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Breweries", "蔵元")}</span>
                        </span>
                      </span>

                      <span id={panelId} hidden={!isActive} className="block animate-in fade-in duration-300">
                        <span className="block mt-4 pt-4 border-t border-[oklch(0.78_0.12_85/0.1)] space-y-4">
                          <span className="flex flex-wrap items-center gap-2">
                            <Droplets aria-hidden="true" size={14} className="text-[oklch(0.55_0.18_25)]" />
                            <span className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Water", "水")}</span>
                            <span className="text-sm text-[oklch(0.85_0.01_85)]">{lang === "ja" ? pref.waterTypeJa : pref.waterType}</span>
                          </span>
                          <span className="block">
                            <span className="flex items-center gap-2 mb-2">
                              <Wine aria-hidden="true" size={14} className="text-[oklch(0.78_0.12_85)]" />
                              <span className="text-[10px] tracking-[0.15em] uppercase text-[oklch(0.55_0.02_270)]">{t("Famous Breweries", "有名な蔵元")}</span>
                            </span>
                            <span className="flex flex-wrap gap-2">
                              {pref.famousBreweries.map((b) => (
                                <span key={b} className="px-2 py-1 text-xs bg-[oklch(0.78_0.12_85/0.08)] border border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.78_0.12_85)]">
                                  {b}
                                </span>
                              ))}
                            </span>
                          </span>
                          <span className="block text-sm text-[oklch(0.7_0.01_85)] leading-relaxed">{lang === "ja" ? pref.descriptionJa : pref.description}</span>
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
