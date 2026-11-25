"use client";

import { useState } from "react";
import { Ban, Flame, Landmark, PartyPopper, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { sacredSake, type SacredSakeEntry } from "@/lib/content/sake/deep-data";

// Ported from the Sake app's client/src/pages/Sacred.tsx (2026-11-26). Same copy, icons and layout:
// each entry opens its longer story; "forbidden" entries are crimson. framer-motion is tw-animate
// classes (entries stagger 0.1s, the detail fades in over 0.3s). Changed: every entry's story is in
// the page (shown when open), so the writing is in the server HTML; entries say whether they're open
// (aria-expanded); (rule 20) small crimson text is lightened from oklch(0.45 0.18 25) to
// oklch(0.62 0.19 25) so it can be read on the dark cards (icons and borders keep the app's crimson).

const TYPE_ICONS: Record<SacredSakeEntry["type"], LucideIcon> = {
  origin: Flame,
  ritual: Landmark,
  forbidden: Ban,
  festival: PartyPopper,
};
const TYPE_LABELS: Record<SacredSakeEntry["type"], { en: string; ja: string }> = {
  origin: { en: "Origin", ja: "起源" },
  ritual: { en: "Ritual", ja: "儀式" },
  forbidden: { en: "Forbidden", ja: "禁忌" },
  festival: { en: "Festival", ja: "祭り" },
};

export function SakeSacred() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.62_0.19_25)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("The Forbidden Chapter", "禁じられた章")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">{t("Doburoku & Sacred Sake", "どぶろくと神酒")}</h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Before sake was an industry, it was a prayer. Before it was refined, it was raw. Before men brewed it, women did. This is the origin story modern marketing erased.",
              "日本酒が産業になる前、それは祈りだった。洗練される前、それは生だった。男が醸す前、女が醸した。これは現代のマーケティングが消した起源の物語。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {sacredSake.map((entry, i) => {
          const open = expanded === entry.id;
          const forbidden = entry.type === "forbidden";
          const Icon = TYPE_ICONS[entry.type];
          return (
            <div
              key={entry.id}
              className={
                open
                  ? "border transition-all duration-300 border-[oklch(0.45_0.18_25/0.5)] bg-[oklch(0.14_0.025_270)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  : "border transition-all duration-300 border-[oklch(0.28_0.04_270)] bg-[oklch(0.16_0.03_270)] animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              }
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`sake-sacred-${entry.id}`}
                onClick={() => setExpanded(open ? null : entry.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start gap-4"
              >
                <span
                  className={
                    forbidden
                      ? "mt-1 p-2 border border-[oklch(0.45_0.18_25/0.5)] text-[oklch(0.45_0.18_25)]"
                      : "mt-1 p-2 border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]"
                  }
                >
                  <Icon aria-hidden="true" size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2 mb-1">
                    <span
                      className={
                        forbidden
                          ? "font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.62_0.19_25)]"
                          : "font-mono text-[9px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)]"
                      }
                    >
                      {t(TYPE_LABELS[entry.type].en, TYPE_LABELS[entry.type].ja)}
                    </span>
                  </span>
                  <span className="block font-sk-serif text-xl font-bold text-foreground mb-2">{t(entry.name, entry.nameJa)}</span>
                  <span className="block text-sm text-muted-foreground leading-relaxed">{t(entry.description, entry.descriptionJa)}</span>
                </span>
              </button>

              <div id={`sake-sacred-${entry.id}`} hidden={!open} className="overflow-hidden animate-in fade-in duration-300">
                <div className="px-5 sm:px-6 pb-6 pt-0 ml-14">
                  <div className="border-t border-[oklch(0.78_0.12_85/0.1)] pt-4">
                    <p className="text-sm text-foreground leading-relaxed">{t(entry.detail, entry.detailJa)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-12 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The gods drank first. We drink what remains."', "「神が先に飲んだ。我々は残りを飲む。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
