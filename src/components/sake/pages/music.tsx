"use client";

import { useState } from "react";
import { Headphones, Music2 } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { musicPairings } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/Music.tsx (2026-11-26). Same copy and layout: pick a
// pairing card and its "why" panel opens under the grid; pick it again to close. framer-motion is
// tw-animate classes (cards stagger 0.08s, the panel fades in over 0.3s). Changed: every pairing's
// panel is in the page (only the chosen one shows), so the writing is in the server HTML for
// search engines; the cards say whether they're open (aria-expanded).
export function SakeMusic() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("The Ear Changes the Tongue", "耳が舌を変える")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Music2 aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Sake × Music", "日本酒 × 音楽")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Daiginjo with Ryuichi Sakamoto. Nigori with Boris. Koshu with Coltrane. Curated cross-sensory pairings where sound meets liquid.",
              "大吟醸と坂本龍一。にごりとボリス。古酒とコルトレーン。音と液体が出会うクロスセンサリーペアリング。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {musicPairings.map((mp, i) => {
            const open = selected === mp.id;
            return (
              <button
                key={mp.id}
                type="button"
                aria-expanded={open}
                aria-controls={`sake-music-${mp.id}`}
                onClick={() => setSelected(open ? null : mp.id)}
                className={
                  open
                    ? "text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.08)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                    : "text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.3)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                }
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="flex items-center gap-2 mb-2">
                  <Headphones aria-hidden="true" size={14} className="text-[oklch(0.78_0.12_85)]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)]">
                    {t(mp.sakeStyle, mp.sakeStyleJa)}
                  </span>
                </span>
                <span className="block font-sk-serif text-lg font-bold text-foreground mb-1">{mp.artist}</span>
                <span className="block text-xs text-muted-foreground italic">{mp.track}</span>
                <span className="block text-[10px] font-mono text-muted-foreground/70 mt-2 tracking-wider uppercase">{mp.genre}</span>
              </button>
            );
          })}
        </div>

        {musicPairings.map((mp) => (
          <div
            key={mp.id}
            id={`sake-music-${mp.id}`}
            hidden={selected !== mp.id}
            className="mt-6 bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.2)] p-6 sm:p-8 overflow-hidden animate-in fade-in duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[oklch(0.78_0.12_85)] text-xs tracking-[0.15em] uppercase">
                {t(mp.sakeStyle, mp.sakeStyleJa)} × {mp.artist}
              </span>
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-4">{t(mp.why, mp.whyJa)}</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t("Mood", "気分")}:</span>
              <span className="text-sm italic text-[oklch(0.78_0.12_85)]">{t(mp.mood, mp.moodJa)}</span>
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"Close your eyes. The first note changes the first sip."', "「目を閉じよ。最初の音が最初の一口を変える。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
