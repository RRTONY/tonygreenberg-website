"use client";

import { useState } from "react";
import { MapPin, Mountain, Users } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { villageBreweries } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Village.tsx (2026-11-26). Same copy and layout: pick a
// brewery card and its story opens under the grid; pick it again to close. framer-motion is
// tw-animate classes (cards stagger 0.08s, the panel fades in over 0.3s). Changed: every brewery's
// panel is in the page (only the chosen one shows), so the writing is in the server HTML; the cards
// say whether they're open (aria-expanded).
export function SakeVillage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">
            {t("The Soul of Japanese Craft", "日本の工芸の魂")}
          </p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Mountain aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Village Breweries", "里の蔵元")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Tiny 1-3 person operations in remote mountain villages. The breweries you'll never find on Google. Where the toji IS the owner IS the farmer.",
              "山奥の小さな村にある1〜3人の小さな蔵元。Googleでは見つからない蔵元。杜氏が蔵元であり農家でもある場所。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {villageBreweries.map((vb, i) => {
            const open = selected === vb.id;
            return (
              <button
                key={vb.id}
                type="button"
                aria-expanded={open}
                aria-controls={`sake-village-${vb.id}`}
                onClick={() => setSelected(open ? null : vb.id)}
                className={
                  open
                    ? "text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.06)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                    : "text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.3)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                }
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="flex items-center gap-2 mb-2">
                  <MapPin aria-hidden="true" size={12} className="text-[oklch(0.78_0.12_85)]" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)]">{t(vb.location, vb.locationJa)}</span>
                </span>
                <span className="block font-sk-serif text-xl font-bold text-foreground mb-1">{t(vb.name, vb.nameJa)}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users aria-hidden="true" size={11} />
                  <span>
                    {vb.people} {t("people", "人")}
                  </span>
                  <span aria-hidden="true" className="text-[oklch(0.28_0.04_270)]">
                    |
                  </span>
                  <span>{t(vb.toji, vb.tojiJa)}</span>
                </span>
              </button>
            );
          })}
        </div>

        {villageBreweries.map((vb) => (
          <div
            key={vb.id}
            id={`sake-village-${vb.id}`}
            hidden={selected !== vb.id}
            className="mt-6 bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.2)] p-6 sm:p-8 overflow-hidden animate-in fade-in duration-300"
          >
            <h2 className="font-sk-serif text-2xl font-bold text-foreground mb-4">{t(vb.name, vb.nameJa)}</h2>
            <p className="text-sm text-foreground leading-relaxed mb-5">{t(vb.story, vb.storyJa)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Signature Sake", "代表銘柄")}</p>
                <p className="text-sm text-foreground">{t(vb.signature, vb.signatureJa)}</p>
              </div>
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  {t("What Makes Them Special", "特別な理由")}
                </p>
                <p className="text-sm text-foreground">{t(vb.whyMatters, vb.whyMattersJa)}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The best sake is the one nobody\'s heard of."', "「最高の酒は誰も聞いたことのない酒。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
