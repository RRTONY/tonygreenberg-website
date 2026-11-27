"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { pairingDishes, pairingMoods, pairingSakes, pairingSeasons, pairingVessels } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/IchigoIchie.tsx (2026-11-26): the hero, the "Summon a
// Moment" button and the revealed pairing (sake, dish, moment, vessel, mood, picked at random after
// a 1.2s pause), same copy. The app's per-look colors are --sk-* variables / `[.sake-austere_&]:`
// classes; framer-motion's staggered reveal is tw-animate classes (0.2s per line, closing line at 1.2s).
// Changed: while summoning, the button shows a spinner and "Summoning" without the trailing dots
// (house rule: no ellipsis loading text); the reveal is announced to screen readers (aria-live).

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Bilingual = { en: string; ja: string };
type Pairing = { sake: string; dish: Bilingual; season: Bilingual; vessel: Bilingual; mood: Bilingual };

const LABELS = [
  { key: "sake", en: "The Sake", ja: "酒" },
  { key: "dish", en: "The Dish", ja: "料理" },
  { key: "season", en: "The Moment", ja: "瞬間" },
  { key: "vessel", en: "The Vessel", ja: "器" },
  { key: "mood", en: "The Mood", ja: "心" },
] as const;

const FG = "text-[oklch(0.93_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_MUTED = "text-[oklch(0.65_0.02_270)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";

export function SakeIchigoIchie() {
  const { t } = useLanguage();
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const generate = useCallback(() => {
    setIsRevealing(true);
    setPairing(null);
    timer.current = setTimeout(() => {
      setPairing({
        sake: pick(pairingSakes),
        dish: pick(pairingDishes),
        season: pick(pairingSeasons),
        vessel: pick(pairingVessels),
        mood: pick(pairingMoods),
      });
      setIsRevealing(false);
    }, 1200);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background transition-colors duration-500">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">{t("One Moment, One Meeting", "一期一会")}</p>
          <h1 className={`font-sk-display font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-[0.2em]! text-4xl sm:text-6xl mb-6 ${FG}`}>
            {t("The Pairing Engine", "組み合わせの機械")}
          </h1>
          <p className={`max-w-xl mx-auto text-sm leading-relaxed ${FG_MUTED}`}>
            {t(
              "Every combination is unrepeatable. This sake, this dish, this season, this vessel, this mood — a moment that will never exist again. The anti-algorithm.",
              "すべての組み合わせは二度と繰り返されない。この酒、この料理、この季節、この器、この心 — 二度と存在しない瞬間。アンチアルゴリズム。",
            )}
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4">
        <button
          type="button"
          onClick={generate}
          disabled={isRevealing}
          className="w-full py-5 border-2 transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] border-[oklch(0.78_0.12_85/0.4)] bg-[oklch(0.78_0.12_85/0.05)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.4)] [.sake-austere_&]:bg-[oklch(0.52_0.19_30/0.05)]"
        >
          {isRevealing ? (
            <Loader2 aria-hidden="true" size={20} className="animate-spin text-(--sk-accent)" />
          ) : (
            <Sparkles aria-hidden="true" size={20} className="group-hover:scale-110 transition-transform text-(--sk-accent)" />
          )}
          <span className="font-sk-display text-xl tracking-wider font-semibold [.sake-austere_&]:font-normal text-(--sk-accent)">
            {isRevealing ? t("Summoning", "召喚中") : pairing ? t("Summon Another Moment", "別の瞬間を召喚") : t("Summon a Moment", "瞬間を召喚する")}
          </span>
        </button>

        <div aria-live="polite">
          {pairing && (
            <div key={pairing.sake + pairing.dish.en} className="mt-10 space-y-0 animate-in fade-in duration-600">
              {LABELS.map((label, i) => {
                const value = label.key === "sake" ? pairing.sake : t(pairing[label.key].en, pairing[label.key].ja);
                return (
                  <div
                    key={label.key}
                    style={{ animationDelay: `${i * 0.2}s` }}
                    className="border-b py-6 flex items-start gap-4 border-[oklch(0.78_0.12_85/0.12)] [.sake-austere_&]:border-[oklch(0.52_0.19_30/0.12)] animate-in fade-in slide-in-from-left-[30px] duration-500 fill-mode-both"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1 text-(--sk-accent)">{t(label.en, label.ja)}</p>
                      <p className={`font-sk-display font-semibold [.sake-austere_&]:font-normal text-xl sm:text-2xl leading-snug ${FG}`}>{value}</p>
                    </div>
                  </div>
                );
              })}
              <div className="pt-10 text-center animate-in fade-in duration-800 [animation-delay:1.2s] fill-mode-both">
                <div className="kintsugi-line mb-8" />
                <p className={`font-sk-display text-lg italic ${FG_MUTED}`}>
                  {t('"This combination will never exist again. Be here for it."', "「この組み合わせは二度と存在しない。その場にいよ。」")}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
