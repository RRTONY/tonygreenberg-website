"use client";

import { useState } from "react";
import { Clock, Eye, MapPin } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { AmbientSound } from "@/components/sake/ambient-sound";
import { Reveal } from "@/components/sake/motion";
import { SakeImage } from "@/components/sake/sake-image";
import { kyotoSpots } from "@/lib/content/sake/culture-data";
import { sakeImages } from "@/lib/content/sake/images";

// Ported from the Sake app's client/src/pages/Kyoto.tsx (2026-11-26): the hero with the rain
// soundscape, the backstreet spots (each opens its secret), the closing line and the page's own
// sign-off, same copy. The app picked every color in JS per look (Kintsugi / Austere); each pair is
// one literal class string here with the Austere value behind `[.sake-austere_&]:`. framer-motion
// entrances are tw-animate classes / <Reveal> (0.05s stagger kept). The hero photo (the app reused
// "sake-prefecture") was deleted on Manus: ink-wash stand-in until a Sanity copy exists.
// Changed: each spot card was one <button> wrapping a heading and paragraphs (invalid HTML); the
// heading now holds the button and its overlay covers the card, so clicking anywhere still opens
// it. The secret stays in the page HTML, hidden until opened.

const FG = "text-[oklch(0.96_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_SOFT = "text-[oklch(0.7_0.01_85)] [.sake-austere_&]:text-[oklch(0.35_0.01_60)]";
const FG_MUTED = "text-[oklch(0.6_0.02_270)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";
const SECRET = "text-[oklch(0.45_0.18_25)] [.sake-austere_&]:text-[oklch(0.52_0.19_30)]";
const RULE = "border-[oklch(0.78_0.12_85/0.1)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";

export function SakeKyoto() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-20 transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {isAustere ? (
          <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.92_0.006_80)] to-[oklch(0.95_0.008_80)]" />
        ) : (
          <div className="absolute inset-0">
            <SakeImage image={sakeImages.prefecture} priority className="w-full h-full object-cover opacity-15 hero-image" />
            <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.025_270/0.7)] via-[oklch(0.12_0.025_270/0.5)] to-[oklch(0.12_0.025_270)]" />
          </div>
        )}
        <div className="relative z-10 max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <p className="text-xs tracking-[0.3em] uppercase font-mono text-(--sk-accent)">
                {t("裏路地案内 — Kyoto Backstreets", "裏路地案内 — 京都の裏通り")}
              </p>
              <AmbientSound type="rain" label={{ en: "Rain on Kyoto tiles", ja: "京都の瓦に降る雨" }} />
            </div>
            <h1 className={`font-sk-display font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-[0.2em]! text-5xl sm:text-6xl lg:text-7xl leading-tight ${FG}`}>
              {t("The Kyoto They", "観光客が")} <span className="gold-shimmer">{t("Don't Show You", "知らない京都")}</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${FG_SOFT}`}>
              {t(
                "Forget the golden pavilion. Behind Pontocho's lantern-lit doorways, beneath Fushimi's canal mist, inside machiya walls darkened by centuries of koji spores — this is where sake lives.",
                "金閣寺は忘れろ。先斗町の提灯に照らされた入口の奥、伏見の運河の霧の下、何世紀もの麹菌の胞子で黒ずんだ町家の壁の中 — ここが日本酒の住む場所。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Spots */}
      <section className="py-16 lg:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-5">
            {kyotoSpots.map((spot, i) => {
              const isActive = activeSpot === spot.id;
              const panelId = `sake-kyoto-${spot.id}`;
              return (
                <Reveal key={spot.id} delay={i * 0.05} enter="animate-in fade-in slide-in-from-bottom-[15px] duration-500 fill-mode-both">
                  <div
                    className={
                      isActive
                        ? "relative h-full p-6 border transition-all duration-500 bg-[oklch(0.16_0.03_270)] border-[oklch(0.78_0.12_85/0.4)] [.sake-austere_&]:bg-[oklch(0.9_0.008_80)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.4)]"
                        : "relative h-full p-6 border transition-all duration-500 bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]"
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin aria-hidden="true" size={14} className="text-(--sk-accent)" />
                      <span className={`text-[10px] tracking-[0.15em] uppercase font-mono ${FG_MUTED}`}>{t(spot.area, spot.areaJa)}</span>
                      <span aria-hidden="true" className="text-[oklch(0.35_0.04_270)] [.sake-austere_&]:text-[oklch(0.75_0.005_60)]">
                        ·
                      </span>
                      <span className="text-[10px] tracking-[0.15em] uppercase font-mono text-(--sk-accent)">{t(spot.type, spot.typeJa)}</span>
                    </div>
                    <h3 className={`font-sk-display font-bold [.sake-austere_&]:font-light text-xl sm:text-2xl ${FG}`}>
                      <button
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        onClick={() => setActiveSpot(isActive ? null : spot.id)}
                        className="text-left after:absolute after:inset-0 after:content-['']"
                      >
                        {t(spot.name, spot.nameJa)}
                      </button>
                    </h3>
                    <p className={`mt-3 text-sm leading-relaxed ${FG_SOFT}`}>{t(spot.description, spot.descriptionJa)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock aria-hidden="true" size={12} className={FG_MUTED} />
                      <span className={`text-xs ${FG_MUTED}`}>{t(spot.bestTime, spot.bestTimeJa)}</span>
                    </div>
                    <div id={panelId} hidden={!isActive} className="animate-in fade-in duration-300">
                      <div className="mt-5 pt-5 border-t border-[oklch(0.28_0.04_270)] [.sake-austere_&]:border-[oklch(0.75_0.005_60)]">
                        <div className="flex items-start gap-3">
                          <Eye aria-hidden="true" size={14} className={`mt-0.5 shrink-0 ${SECRET}`} />
                          <div>
                            <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 font-mono ${SECRET}`}>{t("The Secret", "秘密")}</p>
                            <p className={`text-sm leading-relaxed italic ${FG}`}>{t(spot.secret, spot.secretJa)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div
                        aria-hidden="true"
                        className="absolute top-0 right-0 size-8 border-t-2 border-r-2 transition-all duration-500 border-[oklch(0.78_0.12_85/0.4)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.4)]"
                      />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className={`py-16 lg:py-20 border-t ${RULE}`}>
        <div className="max-w-200 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal enter="animate-in fade-in duration-1000 fill-mode-both">
            <p className="font-sk-display text-3xl sm:text-4xl italic leading-relaxed text-(--sk-accent)">
              {t('"The less signage, the better the sake."', "「看板が少ないほど、日本酒は良い。」")}
            </p>
            <p className={`mt-6 text-sm tracking-widest ${FG_MUTED}`}>{t("— An unwritten rule of Kyoto drinking", "— 京都の飲み方の不文律")}</p>
          </Reveal>
        </div>
      </section>

      <div className={`py-12 border-t ${RULE}`}>
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p aria-hidden="true" className="font-sk-display text-lg tracking-wider text-(--sk-accent)">
            酒
          </p>
          <p className={`mt-2 text-xs tracking-[0.15em] uppercase ${FG_MUTED}`}>
            {t("Sake for Sake's Sake — A guide for the gloriously obsessed", "酒のためだけの酒 — 栄光ある執着者のためのガイド")}
          </p>
        </div>
      </div>
    </div>
  );
}
