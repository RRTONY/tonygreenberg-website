"use client";

import { useMemo, useState } from "react";
import { DollarSign, Lightbulb, Plane, TrendingUp } from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { guidePalette } from "@/components/sake/page-palettes";
import { valueMatrix } from "@/lib/content/sake/education-data";

// Ported from the Sake app's client/src/pages/ValueMatrix.tsx (2026-11-26): experience per dollar,
// with the US / Japan price switch and the three sorts. Same copy and colors (page-palettes.ts
// guidePalette). Changed:
// - The 🇺🇸 / 🇯🇵 flags inside the price buttons and the 💡 before the price tip were emoji used as
//   icons; the buttons read "US Prices" / "Japan Prices" and the tip has a lucide lightbulb (rule 18).
// - framer-motion: the hero fades up and the cards stagger in (CSS).
// - The switch rows wrap on phones and the buttons expose their pressed state.

const availOrder = { easy: 3, moderate: 2, hard: 1, impossible: 0 } as const;

export function SakeValueMatrix() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const [location, setLocation] = useState<"us" | "japan">("us");
  const [sortBy, setSortBy] = useState<"value" | "exv" | "availability">("value");
  const p = guidePalette(isAustere);

  const sorted = useMemo(
    () =>
      [...valueMatrix].sort((a, b) => {
        switch (sortBy) {
          case "value":
            return b.valueRatio - a.valueRatio;
          case "exv":
            return b.exvScore - a.exvScore;
          case "availability": {
            const avA = location === "us" ? availOrder[a.availabilityUS] : availOrder[a.availabilityJapan];
            const avB = location === "us" ? availOrder[b.availabilityUS] : availOrder[b.availabilityJapan];
            return avB - avA;
          }
          default:
            return 0;
        }
      }),
    [sortBy, location],
  );

  const availLabel = (avail: string) => {
    switch (avail) {
      case "easy":
        return { text: t("Easy", "容易"), color: "text-green-500" };
      case "moderate":
        return { text: t("Moderate", "普通"), color: p.gold };
      case "hard":
        return { text: t("Hard", "困難"), color: "text-orange-500" };
      case "impossible":
        return { text: t("Unicorn", "ユニコーン"), color: "text-red-500" };
      default:
        return { text: avail, color: p.textMuted };
    }
  };

  const toggle = (active: boolean) =>
    active
      ? `px-4 py-2 text-xs tracking-[0.15em] transition-all ${p.goldBg} ${p.gold}`
      : `px-4 py-2 text-xs tracking-[0.15em] transition-all ${p.textMuted}`;

  return (
    <div className={`min-h-screen ${p.page}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {!isAustere && <div className="absolute inset-0 bg-linear-to-b from-[#0d1321] via-[#0d1321]/95 to-[#0a0e1a]" />}
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className={`flex items-center justify-center text-sm tracking-[0.4em] uppercase mb-4 ${p.gold}`}>
              <TrendingUp aria-hidden="true" className="size-4 inline mr-2" />
              {t("Maximum Experience Per Dollar", "一ドルあたりの最大体験")}
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              {t("Value", "価値の")}
              <br />
              <span className={p.gold}>{t("Matrix", "マトリックス")}</span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${p.textMuted}`}>
              {t(
                "The best sake experience isn't always the most expensive. This matrix maps experience quality against price — whether you're buying in the US or Japan.",
                "最高の酒体験が必ずしも最も高価とは限らない。このマトリックスは体験の質を価格に対してマッピングする——米国でも日本でも。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <Plane aria-hidden="true" className={`size-4 ${p.textMuted}`} />
            <div className={`flex border rounded-sm overflow-hidden ${p.goldBorder}`} role="group" aria-label={t("Prices", "価格")}>
              <button type="button" onClick={() => setLocation("us")} aria-pressed={location === "us"} className={toggle(location === "us")}>
                {t("US Prices", "米国価格")}
              </button>
              <button type="button" onClick={() => setLocation("japan")} aria-pressed={location === "japan"} className={toggle(location === "japan")}>
                {t("Japan Prices", "日本価格")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign aria-hidden="true" className={`size-4 ${p.textMuted}`} />
            <div className={`flex flex-wrap border rounded-sm overflow-hidden ${p.goldBorder}`} role="group" aria-label={t("Sort", "並べ替え")}>
              {(["value", "exv", "availability"] as const).map((s) => (
                <button type="button" key={s} onClick={() => setSortBy(s)} aria-pressed={sortBy === s} className={toggle(sortBy === s)}>
                  {s === "value" ? t("Best Value", "最高の価値") : s === "exv" ? t("Best EXV", "最高EXV") : t("Easiest to Find", "最も見つけやすい")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Matrix cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {sorted.map((item, i) => {
            const price = location === "us" ? item.priceUS : item.priceJapan;
            const availInfo = availLabel(location === "us" ? item.availabilityUS : item.availabilityJapan);
            return (
              <div
                key={item.nameEn}
                className={`${p.card} border ${p.goldBorder} rounded-sm p-6 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`size-10 rounded-full border flex items-center justify-center shrink-0 text-sm ${p.goldBorder} ${p.gold}`}>{i + 1}</div>

                  <div className="flex-1">
                    <h3 className={`text-lg font-light ${p.gold}`}>{t(item.nameEn, item.nameJa)}</h3>
                    <p className={`text-xs ${p.textMuted}`}>
                      {item.brewery} · {item.style}
                    </p>
                    <p className={`text-sm mt-1 ${p.textMuted}`}>{t(item.whyEn, item.whyJa)}</p>
                    {isConnoisseur && <p className={`text-xs mt-1 italic ${p.textMuted}`}>{t(item.flavorEn, item.flavorJa)}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className={`text-xs ${p.textMuted}`}>{t("Price", "価格")}</p>
                      <p className={`text-base font-light ${p.textMain}`}>{price}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs ${p.textMuted}`}>EXV</p>
                      <p className={`text-lg font-light ${p.gold}`}>{item.exvScore}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs ${p.textMuted}`}>{t("Value", "価値")}</p>
                      <div className="flex items-center gap-1">
                        <p className={`text-lg font-light ${p.gold}`}>{item.valueRatio}</p>
                        <div
                          className={
                            isAustere
                              ? "w-12 h-2 rounded-full overflow-hidden bg-[oklch(0.52_0.19_30/0.125)]"
                              : "w-12 h-2 rounded-full overflow-hidden bg-[oklch(0.78_0.12_85/0.125)]"
                          }
                        >
                          <div className={`h-full rounded-full ${p.bar}`} style={{ width: `${Math.min(100, item.valueRatio * 10)}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs ${p.textMuted}`}>{t("Find", "入手")}</p>
                      <p className={`text-xs font-medium ${availInfo.color}`}>{availInfo.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-8 ${p.card} border ${p.goldBorder} rounded-sm p-6 text-center`}>
          <p className={`text-sm ${p.textMuted}`}>
            <Lightbulb aria-hidden="true" className={`inline size-4 mr-1.5 -mt-0.5 ${p.gold}`} />
            {t(
              "On average, sake costs 40-60% less in Japan than in the US. If you're planning a trip, budget ¥2,000-5,000 ($15-35) per bottle for exceptional quality that would cost $40-80 stateside.",
              "平均して、日本の酒は米国より40-60%安い。旅行を計画しているなら、米国で$40-80する卓越した品質のために一本¥2,000-5,000を予算に。",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
