"use client";

import { useState } from "react";
import { Sparkles, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { sakeDefects } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Defects.tsx (2026-11-26). Same copy and layout:
// crimson for defects, gold for "can be a feature"; each row opens its cause and note. framer-motion
// is tw-animate classes (rows stagger 0.08s, the detail fades in over 0.3s). Changed: every row's
// detail is in the page (shown when open), so the writing is in the server HTML; rows say whether
// they're open (aria-expanded); (rule 20) the small crimson label and badge text are lightened from
// oklch(0.45 0.18 25) to oklch(0.62 0.19 25) so they can be read on the dark cards (icons and
// borders keep the app's crimson).

const CRIMSON_TEXT = "text-[oklch(0.62_0.19_25)]";

export function SakeDefects() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className={`${CRIMSON_TEXT} font-mono text-xs tracking-[0.3em] uppercase mb-4`}>{t("The Dark Knowledge", "暗い知識")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">{t("Defects & Off-Flavors", "欠陥とオフフレーバー")}</h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              'How to identify them, and why some "defects" are actually features. Kintsugi applied to flavor — the crack is where the gold enters.',
              "見分け方、そしてなぜ一部の「欠陥」が実は特徴なのか。味わいに適用された金継ぎ — ひびこそ金が入る場所。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-3">
        {sakeDefects.map((d, i) => {
          const open = expanded === d.id;
          return (
            <div
              key={d.id}
              className="animate-in fade-in slide-in-from-bottom-3.75 duration-500 fill-mode-both"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`sake-defect-${d.id}`}
                onClick={() => setExpanded(open ? null : d.id)}
                className={
                  open
                    ? "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.78_0.12_85/0.4)] bg-[oklch(0.14_0.025_270)]"
                    : "w-full text-left p-5 border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] hover:border-[oklch(0.78_0.12_85/0.2)]"
                }
              >
                <span className="flex items-start gap-3">
                  <span className={d.isFeature ? "mt-1 p-1.5 text-[oklch(0.78_0.12_85)]" : "mt-1 p-1.5 text-[oklch(0.45_0.18_25)]"}>
                    {d.isFeature ? <Sparkles aria-hidden="true" size={16} /> : <TriangleAlert aria-hidden="true" size={16} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-sk-serif text-lg font-bold text-foreground">{t(d.name, d.nameJa)}</span>
                      <span
                        className={
                          d.isFeature
                            ? "font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]"
                            : "font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 border border-[oklch(0.45_0.18_25/0.3)] text-[oklch(0.62_0.19_25)]"
                        }
                      >
                        {d.isFeature ? t("Can be Feature", "特徴にもなる") : t("Defect", "欠陥")}
                      </span>
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t("Smells like: ", "匂い：")}
                      {t(d.smell, d.smellJa)}
                    </span>
                  </span>
                </span>
              </button>

              <div id={`sake-defect-${d.id}`} hidden={!open} className="overflow-hidden animate-in fade-in duration-300">
                <div className="p-5 bg-[oklch(0.14_0.025_270)] border-x border-b border-[oklch(0.78_0.12_85/0.12)] space-y-4">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t("Cause", "原因")}</p>
                    <p className="text-sm text-foreground">{t(d.cause, d.causeJa)}</p>
                  </div>
                  <div
                    className={
                      d.isFeature
                        ? "p-4 border border-[oklch(0.78_0.12_85/0.2)] bg-[oklch(0.78_0.12_85/0.03)]"
                        : "p-4 border border-[oklch(0.45_0.18_25/0.2)] bg-[oklch(0.45_0.18_25/0.03)]"
                    }
                  >
                    <p
                      className={
                        d.isFeature
                          ? "font-mono text-[9px] tracking-[0.2em] uppercase mb-1 text-[oklch(0.78_0.12_85)]"
                          : "font-mono text-[9px] tracking-[0.2em] uppercase mb-1 text-[oklch(0.62_0.19_25)]"
                      }
                    >
                      {d.isFeature ? t("When It's a Feature", "特徴になる時") : t("Always a Defect", "常に欠陥")}
                    </p>
                    <p className="text-sm text-foreground italic">{t(d.featureNote, d.featureNoteJa)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-12 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The line between defect and feature is intention."', "「欠陥と特徴の境界線は意図にある。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
