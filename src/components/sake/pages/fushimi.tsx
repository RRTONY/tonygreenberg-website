"use client";

import { useState } from "react";
import { Building2, Droplets, MapPin } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { fushimiSpots } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Fushimi.tsx (2026-11-26). Same copy and layout: each
// spot opens its story and "Must Try" under it. framer-motion is tw-animate classes (rows stagger
// 0.08s, the detail fades in over 0.3s). Changed: every spot's detail is in the page (shown when
// open), so the writing is in the server HTML; the rows say whether they're open (aria-expanded).

const TYPE_JA: Record<string, string> = { brewery: "蔵元", walk: "散歩", shrine: "神社" };

export function SakeFushimi() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("Kyoto's Sake Heart", "京都の酒の心臓")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Building2 aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Fushimi Deep Dive", "伏見ディープダイブ")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              'The second-largest sake district in Japan, hidden in southern Kyoto. Blessed with gokōsui — "honorable fragrant water" — from underground springs that have flowed for millennia.',
              "日本第二の酒処、京都南部に隠れている。何千年も流れ続ける地下水脈からの「御香水」に恵まれた地。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-3">
          {fushimiSpots.map((spot, i) => {
            const open = selected === spot.id;
            const Icon = spot.type === "brewery" ? Building2 : spot.type === "shrine" ? Droplets : MapPin;
            return (
              <div
                key={spot.id}
                className="animate-in fade-in slide-in-from-bottom-3.75 duration-500 fill-mode-both"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`sake-fushimi-${spot.id}`}
                  onClick={() => setSelected(open ? null : spot.id)}
                  className={
                    open
                      ? "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.06)]"
                      : "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                  }
                >
                  <span className="flex items-start gap-4">
                    <span className="mt-1 p-2 border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]">
                      <Icon aria-hidden="true" size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)]">
                          {t(spot.type, TYPE_JA[spot.type] ?? "スポット")}
                        </span>
                      </span>
                      <span className="block font-sk-serif text-xl font-bold text-foreground mb-1">{t(spot.name, spot.nameJa)}</span>
                      <span className="block text-xs text-muted-foreground">{t(`Est. ${spot.founded}`, `創業 ${spot.founded}`)}</span>
                    </span>
                  </span>
                </button>

                <div id={`sake-fushimi-${spot.id}`} hidden={!open} className="overflow-hidden animate-in fade-in duration-300">
                  <div className="p-5 bg-[oklch(0.14_0.025_270)] border-x border-b border-[oklch(0.78_0.12_85/0.12)]">
                    <p className="text-sm text-foreground leading-relaxed mb-4">{t(spot.description, spot.descriptionJa)}</p>
                    <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-4">
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Must Try", "必飲")}</p>
                      <p className="text-sm text-[oklch(0.78_0.12_85)] italic">{t(spot.mustTry, spot.mustTryJa)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"Fushimi means \'hidden water.\' The name tells you everything."', "「伏見は「伏し水」を意味する。名前がすべてを物語る。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
