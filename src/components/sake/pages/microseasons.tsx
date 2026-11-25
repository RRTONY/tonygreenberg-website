"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ChevronDown, CloudRain, Leaf, Snowflake, Sun, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { microseasons } from "@/lib/content/sake/culture-data";

// Ported from the Sake app's client/src/pages/Microseasons.tsx (2026-11-26): the 72 microseasons
// with season filters (the current season pulses) and expandable cards (drink / eat / feel). Same
// copy and colors. Changed:
// - Season colors were inline styles from a config map; they're precomposed class strings here.
// - The current season is worked out in the browser only (useSyncExternalStore), so the server HTML
//   and the first render agree; the app read the date during render.
// - Each card's drink / eat / feel text is in the server HTML (hidden until opened) and the card is
//   a button with aria-expanded.
// - framer-motion: hero and filters fade up, cards stagger in (CSS).

type Season = "spring" | "summer" | "autumn" | "winter";
type SeasonFilter = "all" | Season;

const seasonConfig: Record<
  Season,
  { icon: LucideIcon; label: string; labelJa: string; text: string; activeBorder: string }
> = {
  spring: { icon: Leaf, label: "Spring", labelJa: "春", text: "text-[oklch(0.72_0.14_145)]", activeBorder: "border-[oklch(0.72_0.14_145)]" },
  summer: { icon: Sun, label: "Summer", labelJa: "夏", text: "text-[oklch(0.78_0.12_85)]", activeBorder: "border-[oklch(0.78_0.12_85)]" },
  autumn: { icon: CloudRain, label: "Autumn", labelJa: "秋", text: "text-[oklch(0.60_0.16_40)]", activeBorder: "border-[oklch(0.60_0.16_40)]" },
  winter: { icon: Snowflake, label: "Winter", labelJa: "冬", text: "text-[oklch(0.70_0.08_240)]", activeBorder: "border-[oklch(0.70_0.08_240)]" },
};

const SEASONS = Object.keys(seasonConfig) as Season[];

function seasonNow(): Season {
  const month = new Date().getMonth();
  return month >= 2 && month <= 4 ? "spring" : month >= 5 && month <= 7 ? "summer" : month >= 8 && month <= 10 ? "autumn" : "winter";
}

const noSubscribe = () => () => {};

export function SakeMicroseasons() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<SeasonFilter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const currentSeason = useSyncExternalStore<Season | null>(noSubscribe, seasonNow, () => null);

  const filtered = useMemo(() => (filter === "all" ? microseasons : microseasons.filter((m) => m.season === filter)), [filter]);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className="text-xs tracking-[0.3em] uppercase text-[oklch(0.78_0.12_85)] mb-4 font-mono">
              {t("七十二候 — The 72 Microseasons", "七十二候 — 72の微候")}
            </p>
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)] leading-tight">
              {t("What to Drink", "何を飲むか")} <span className="gold-shimmer">{t("Right Now", "今この瞬間")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[oklch(0.7_0.01_85)] text-lg leading-relaxed">
              {t(
                "Japan doesn't have 4 seasons. It has 72. Each five-day period carries its own poetry, its own food, and its own sake. This is the calendar your body already knows.",
                "日本には四季がない。七十二候がある。五日ごとの期間にそれぞれの詩、食、そして酒がある。あなたの体がすでに知っている暦。",
              )}
            </p>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2.5 duration-600 delay-300 fill-mode-both"
            role="group"
            aria-label={t("Season", "季節")}
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={
                filter === "all"
                  ? "px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.93_0.01_85)]"
                  : "px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 border-[oklch(0.28_0.04_270)] text-[oklch(0.6_0.02_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
              }
            >
              {t("All Seasons", "全季節")}
            </button>
            {SEASONS.map((s) => {
              const cfg = seasonConfig[s];
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFilter(s)}
                  aria-pressed={filter === s}
                  className={
                    filter === s
                      ? `px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 flex items-center gap-2 bg-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.93_0.01_85)] ${cfg.activeBorder}`
                      : "px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 flex items-center gap-2 text-[oklch(0.6_0.02_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                  }
                >
                  <cfg.icon aria-hidden="true" size={14} className={cfg.text} />
                  {t(cfg.label, cfg.labelJa)}
                  {s === currentSeason && (
                    <span className="size-1.5 rounded-full bg-[oklch(0.78_0.12_85)] animate-pulse" aria-label={t("Now", "今")} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Microseason cards */}
      <section className="pb-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {filtered.map((ms, i) => {
              const cfg = seasonConfig[ms.season as Season];
              const isExpanded = expanded === ms.id;
              const panelId = `microseason-${ms.id}`;
              return (
                <div
                  key={ms.id}
                  className="animate-in fade-in slide-in-from-bottom-2.5 duration-400 fill-mode-both"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : ms.id)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="w-full text-left"
                  >
                    <span
                      className={
                        isExpanded
                          ? "relative block p-5 border transition-all duration-500 bg-[oklch(0.16_0.03_270)] border-[oklch(0.78_0.12_85/0.3)]"
                          : "relative block p-5 border transition-all duration-500 bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.15)]"
                      }
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="flex items-start gap-4">
                          <span className="mt-1 shrink-0">
                            <cfg.icon aria-hidden="true" size={18} className={cfg.text} />
                          </span>
                          <span className="block">
                            <span className="flex items-center gap-3 flex-wrap">
                              <span className={`font-mono text-[10px] tracking-[0.15em] uppercase ${cfg.text}`}>{ms.dates}</span>
                              <span className="text-[oklch(0.5_0.02_270)] text-xs">{t(ms.period, ms.periodJa)}</span>
                            </span>
                            <span className="block mt-1 font-sk-serif text-xl font-semibold text-[oklch(0.93_0.01_85)]">{t(ms.name, ms.nameJa)}</span>
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          size={18}
                          className={
                            isExpanded
                              ? "shrink-0 text-[oklch(0.5_0.02_270)] transition-transform duration-300 rotate-180"
                              : "shrink-0 text-[oklch(0.5_0.02_270)] transition-transform duration-300"
                          }
                        />
                      </span>

                      <span id={panelId} hidden={!isExpanded} className="block animate-in fade-in duration-300">
                        <span className="mt-5 pt-5 border-t border-[oklch(0.28_0.04_270)] grid sm:grid-cols-3 gap-6">
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-2 font-mono">{t("Drink", "飲む")}</span>
                            <span className="block text-sm text-[oklch(0.85_0.01_85)] leading-relaxed">{t(ms.sake, ms.sakeJa)}</span>
                          </span>
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] uppercase text-[oklch(0.60_0.16_40)] mb-2 font-mono">{t("Eat", "食べる")}</span>
                            <span className="block text-sm text-[oklch(0.85_0.01_85)] leading-relaxed">{t(ms.food, ms.foodJa)}</span>
                          </span>
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] uppercase text-[oklch(0.70_0.08_240)] mb-2 font-mono">{t("Feel", "感じる")}</span>
                            <span className="block text-sm text-[oklch(0.75_0.01_85)] leading-relaxed italic">{t(ms.mood, ms.moodJa)}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-12 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sk-serif text-lg text-[oklch(0.78_0.12_85)] tracking-wider">酒</p>
          <p className="mt-2 text-xs text-[oklch(0.45_0.02_270)] tracking-[0.15em] uppercase">
            {t("Sake for Sake's Sake — A guide for the gloriously obsessed", "酒のためだけの酒 — 栄光ある執着者のためのガイド")}
          </p>
        </div>
      </div>
    </div>
  );
}
