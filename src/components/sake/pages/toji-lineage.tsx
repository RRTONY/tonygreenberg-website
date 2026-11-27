"use client";

import { useState } from "react";
import { Crown, MapPin } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { tojiGuilds } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/TojiLineage.tsx (2026-11-26). Same copy and layout: a
// row of guild buttons and the chosen guild's philosophy, signature style, history and breweries.
// framer-motion's AnimatePresence swap is the panel's tw-animate entrance (fade + 20px rise over
// 0.4s) each time a guild is shown; the app's 0.4s exit fade before it is dropped. Changed: every
// guild's panel is in the page (only the chosen one shows), so all five are in the server HTML; the
// buttons say which is chosen (aria-pressed).
export function SakeTojiLineage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(tojiGuilds[0].id);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("Master Brewer Guilds", "杜氏の流派")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Crown aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("The Toji Lineage", "杜氏の系譜")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Five great guilds. Centuries of tradition. Each guild shaped a region's sake identity through philosophy, technique, and the water they mastered.",
              "五つの偉大な流派。何世紀もの伝統。各流派が哲学、技術、そして熟達した水を通じて地域の酒のアイデンティティを形作った。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tojiGuilds.map((g) => {
            const active = selected === g.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(g.id)}
                className={
                  active
                    ? "px-5 py-3 border transition-all duration-300 text-center border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.1)]"
                    : "px-5 py-3 border transition-all duration-300 text-center border-[oklch(0.28_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.4)]"
                }
              >
                <span
                  className={
                    active ? "font-sk-serif text-lg font-bold block text-[oklch(0.78_0.12_85)]" : "font-sk-serif text-lg font-bold block text-foreground"
                  }
                >
                  {t(g.name, g.nameJa)}
                </span>
                <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground uppercase">{t(g.region, g.regionJa)}</span>
              </button>
            );
          })}
        </div>

        {tojiGuilds.map((guild) => (
          <div
            key={guild.id}
            hidden={selected !== guild.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-400 fill-mode-both"
          >
            <h2 className="sr-only">{t(guild.name, guild.nameJa)}</h2>
            <div className="space-y-5">
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.78_0.12_85/0.2)] p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-3">{t("Philosophy", "哲学")}</p>
                <p className="font-sk-serif text-lg font-semibold text-foreground leading-relaxed">{t(guild.philosophy, guild.philosophyJa)}</p>
              </div>
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">{t("Signature Style", "代表的スタイル")}</p>
                <p className="text-sm text-foreground leading-relaxed">{t(guild.signature, guild.signatureJa)}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">{t("History", "歴史")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(guild.history, guild.historyJa)}</p>
              </div>
              <div className="bg-[oklch(0.16_0.03_270)] border border-[oklch(0.28_0.04_270)] p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  <MapPin aria-hidden="true" size={12} className="inline mr-1" />
                  {t("Famous Breweries", "有名な蔵元")}
                </p>
                <ul className="space-y-2">
                  {guild.famousBreweries.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-1 bg-[oklch(0.78_0.12_85)] rounded-full" />
                      <span className="text-sm text-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The toji carries the weight of every winter that came before."', "「杜氏はそれ以前のすべての冬の重みを背負う。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
