"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Droplets, Flower2, Leaf, Snowflake, Sparkles, Sprout, Sun, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import { useLanguage } from "@/components/sake/sake-providers";
import { microseasons, type Microseason } from "@/lib/content/sake/culture-data";
import { sk } from "@/lib/content/sake/nav";

// The Sake app's SakeOfSeason (client/src/components/SakeOfSeason.tsx): picks today's microseason
// from the 16 in culture-data (day of the year mapped onto the list, the app's own formula) and shows
// what to drink, eat and feel. Changed:
// - Today's date only exists in the visitor's browser, so the card is filled in after the page loads
//   (useSyncExternalStore; the server and first paint keep its space empty) instead of the date the
//   page was built on.
// - The season emoji next to the label (🌸 ☀ 🍂 ❄ 🌿) are lucide icons (Flower2, Sun, Leaf, Snowflake,
//   Sprout; rule 18), and the
//   "All 72 Seasons →" arrow is an icon.
// - Colors the app picked in JS per look are classes; the per-season gradient is a fixed class map.

/** The app's getCurrentMicroseason(): day of year (1-365) scaled onto the list. */
export function microseasonIndexFor(now: Date) {
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.floor((dayOfYear / 365) * microseasons.length), microseasons.length - 1);
}

const SEASON_ICON: Record<string, LucideIcon> = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const SEASON_BG: Record<string, string> = {
  spring:
    "bg-linear-135 from-[oklch(0.14_0.03_330/0.5)] to-[oklch(0.12_0.025_270)] [.sake-austere_&]:bg-none [.sake-austere_&]:bg-[oklch(0.93_0.006_80)]",
  summer:
    "bg-linear-135 from-[oklch(0.14_0.03_150/0.5)] to-[oklch(0.12_0.025_270)] [.sake-austere_&]:bg-none [.sake-austere_&]:bg-[oklch(0.93_0.006_80)]",
  autumn:
    "bg-linear-135 from-[oklch(0.14_0.05_60/0.5)] to-[oklch(0.12_0.025_270)] [.sake-austere_&]:bg-none [.sake-austere_&]:bg-[oklch(0.93_0.006_80)]",
  winter:
    "bg-linear-135 from-[oklch(0.14_0.03_240/0.5)] to-[oklch(0.12_0.025_270)] [.sake-austere_&]:bg-none [.sake-austere_&]:bg-[oklch(0.93_0.006_80)]",
};
const DEFAULT_BG = "bg-[oklch(0.14_0.025_270)] [.sake-austere_&]:bg-[oklch(0.93_0.006_80)]";

const FG = "text-[oklch(0.96_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_SOFT = "text-[oklch(0.75_0.01_85)] [.sake-austere_&]:text-[oklch(0.35_0.01_60)]";
const FG_MUTED = "text-[oklch(0.55_0.02_270)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";

const noop = () => () => {};
const NO_SEASON = -1;

export function SakeOfSeason() {
  const { t } = useLanguage();
  const index = useSyncExternalStore(
    noop,
    () => microseasonIndexFor(new Date()),
    () => NO_SEASON,
  );
  if (index === NO_SEASON) return <div aria-hidden="true" className="min-h-80" />;
  return <SeasonCard season={microseasons[index]} t={t} />;
}

function SeasonCard({ season, t }: { season: Microseason; t: (en: string, ja: string) => string }) {
  const Icon = SEASON_ICON[season.season] ?? Sprout;
  return (
    <Reveal as="section" enter="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both" className="relative overflow-hidden">
      <div
        className={`border transition-colors duration-500 border-[oklch(0.78_0.12_85/0.15)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)] ${SEASON_BG[season.season] ?? DEFAULT_BG}`}
      >
        <div className="h-0.5 bg-(--sk-accent)" />

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar aria-hidden="true" size={14} className="text-(--sk-accent)" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-(--sk-accent)">{t("Sake of the Season", "季節の酒")}</span>
                <Icon aria-hidden="true" size={14} className="text-(--sk-accent)" />
              </div>
              <h3 className={`font-sk-display text-xl sm:text-2xl font-semibold [.sake-austere_&]:font-light ${FG}`}>
                {t(season.period, season.periodJa)}
              </h3>
              <p className={`text-sm mt-1 ${FG_SOFT}`}>{t(season.name, season.nameJa)}</p>
              <p className={`text-[11px] mt-1 tracking-wider ${FG_MUTED}`}>{season.dates}</p>
            </div>

            <Link
              href={sk("/microseasons")}
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-300 hover:scale-105 border-(--sk-accent-line) text-(--sk-accent)"
            >
              {t("All 72 Seasons", "七十二候を見る")}
              <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <SeasonFact icon={Droplets} label={t("Drink This", "今飲むべき酒")} text={t(season.sake, season.sakeJa)} />
            <SeasonFact icon={UtensilsCrossed} label={t("Eat This", "今食べるべきもの")} text={t(season.food, season.foodJa)} />
            <SeasonFact icon={Sparkles} label={t("Feel This", "今感じるべきこと")} text={t(season.mood, season.moodJa)} italic />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SeasonFact({ icon: Icon, label, text, italic = false }: { icon: LucideIcon; label: string; text: string; italic?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" size={13} className="text-(--sk-accent)" />
        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-(--sk-accent)">{label}</span>
      </div>
      <p className={italic ? `font-sk-display text-sm leading-relaxed italic ${FG_SOFT}` : `font-sk-display text-sm leading-relaxed ${FG_SOFT}`}>{text}</p>
    </div>
  );
}
