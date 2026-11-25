"use client";

import { useState } from "react";
import { Calendar, MapPin, Route } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { pilgrimageRoutes } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Pilgrimage.tsx (2026-11-26). Same copy and layout: a
// row of route buttons and the chosen route's days, season, description and numbered stops.
// framer-motion's AnimatePresence swap is the panel's tw-animate entrance (fade + 20px rise over
// 0.4s), with the stops sliding in from the left 0.1s apart; the app's exit fade before it is
// dropped. Changed: every route's panel is in the page (only the chosen one shows), so all routes are
// in the server HTML; the buttons say which is chosen (aria-pressed).
export function SakePilgrimage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(pilgrimageRoutes[0].id);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("Walk the Sake Road", "酒の道を歩く")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <Route aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Pilgrimage Routes", "巡礼の道")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Multi-day journeys through sake country. Each route includes transport, accommodation, and the bottles not on the regular menu.",
              "酒の国を巡る数日間の旅。各ルートには交通、宿泊、そして通常メニューにない酒を含む。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {pilgrimageRoutes.map((r) => {
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(r.id)}
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
                  {t(r.name, r.nameJa)}
                </span>
                <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground uppercase">
                  {r.days} {t("days", "日間")}
                </span>
              </button>
            );
          })}
        </div>

        {pilgrimageRoutes.map((route) => (
          <div key={route.id} hidden={selected !== route.id} className="animate-in fade-in slide-in-from-bottom-5 duration-400 fill-mode-both">
            <div className="bg-[oklch(0.14_0.025_270)] border border-[oklch(0.78_0.12_85/0.15)] p-6 sm:p-8 mb-6">
              <h2 className="sr-only">{t(route.name, route.nameJa)}</h2>
              <div className="flex items-center gap-3 mb-4">
                <Calendar aria-hidden="true" size={14} className="text-[oklch(0.78_0.12_85)] shrink-0" />
                <span className="font-mono text-[oklch(0.78_0.12_85)] text-xs tracking-[0.2em] uppercase">
                  {route.days} {t("days", "日間")} — {t(route.bestSeason, route.bestSeasonJa)}
                </span>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{t(route.description, route.descriptionJa)}</p>
            </div>

            <ol className="space-y-4">
              {route.stops.map((stop, i) => (
                <li
                  key={stop.name}
                  className="flex gap-4 animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="size-8 rounded-full border-2 border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.1)] flex items-center justify-center">
                      <span className="font-mono text-[oklch(0.78_0.12_85)] text-xs">{i + 1}</span>
                    </div>
                    {i < route.stops.length - 1 && <div aria-hidden="true" className="w-0.5 flex-1 bg-[oklch(0.78_0.12_85/0.15)] mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin aria-hidden="true" size={12} className="text-[oklch(0.78_0.12_85)]" />
                      <span className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground uppercase">
                        {t(`Stop ${i + 1}`, `ストップ ${i + 1}`)}
                      </span>
                    </div>
                    <h3 className="font-sk-serif text-xl font-bold text-foreground mb-2">{t(stop.name, stop.nameJa)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(stop.note, stop.noteJa)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The pilgrimage is the sake. The sake is the pilgrimage."', "「巡礼が酒であり、酒が巡礼である。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
