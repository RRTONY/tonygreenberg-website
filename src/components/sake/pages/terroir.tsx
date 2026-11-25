"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { prefectureTerroirs } from "@/lib/content/sake/deep-data2";

// Ported from the Sake app's client/src/pages/Terroir.tsx (2026-11-26): the hero, the two prefecture
// pickers and the side-by-side comparison (climate, water, rice, style, keywords), same copy and
// classes. The hero's framer-motion entrance is a tw-animate class.
// Added: the pickers say which prefecture is chosen (aria-pressed) and each picker row is a labelled group.

const FIELDS = [
  { key: "climate", keyJa: "climateJa", en: "Climate", ja: "気候" },
  { key: "water", keyJa: "waterJa", en: "Water", ja: "水" },
  { key: "rice", keyJa: "riceJa", en: "Rice", ja: "米" },
  { key: "style", keyJa: "styleJa", en: "Sake Style", ja: "酒のスタイル" },
] as const;

const PICK_ON = "px-3 py-1.5 text-xs font-mono tracking-wider border transition-all border-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.1)] text-[oklch(0.78_0.12_85)]";
const PICK_OFF = "px-3 py-1.5 text-xs font-mono tracking-wider border transition-all border-[oklch(0.28_0.04_270)] text-muted-foreground hover:border-[oklch(0.78_0.12_85/0.4)]";

export function SakeTerroir() {
  const { t } = useLanguage();
  const [leftId, setLeftId] = useState(prefectureTerroirs[0].id);
  const [rightId, setRightId] = useState(prefectureTerroirs[1].id);
  const left = prefectureTerroirs.find((td) => td.id === leftId) ?? prefectureTerroirs[0];
  const right = prefectureTerroirs.find((td) => td.id === rightId) ?? prefectureTerroirs[1];

  const picker = (label: string, value: string, set: (id: string) => void) => (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[oklch(0.78_0.12_85)] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {prefectureTerroirs.map((td) => (
          <button type="button" key={td.id} aria-pressed={value === td.id} onClick={() => set(td.id)} className={value === td.id ? PICK_ON : PICK_OFF}>
            {t(td.name, td.nameJa)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background">
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
          <p className="text-[oklch(0.78_0.12_85)] font-mono text-xs tracking-[0.3em] uppercase mb-4">{t("Same Grade, Different Soul", "同じ等級、異なる魂")}</p>
          <h1 className="font-sk-serif text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <ArrowLeftRight aria-hidden="true" className="inline-block mr-3 text-[oklch(0.78_0.12_85)]" size={36} />
            {t("Terroir Comparison", "テロワール比較")}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm leading-relaxed">
            {t(
              "Select two prefectures and see how climate, water, rice, and tradition create fundamentally different sake from the same grade.",
              "二つの県を選び、気候、水、米、伝統がどのように同じ等級から根本的に異なる酒を生み出すかを見る。",
            )}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {picker(t("Prefecture A", "県 A"), leftId, setLeftId)}
          {picker(t("Prefecture B", "県 B"), rightId, setRightId)}
        </div>

        {/* Comparison */}
        <div className="border border-[oklch(0.78_0.12_85/0.15)]">
          <div className="grid grid-cols-3 bg-[oklch(0.14_0.025_270)]">
            <div className="p-4 text-center border-r border-[oklch(0.78_0.12_85/0.1)]">
              <span className="font-sk-serif text-xl font-bold text-[oklch(0.78_0.12_85)]">{t(left.name, left.nameJa)}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <ArrowLeftRight aria-hidden="true" size={16} className="text-muted-foreground" />
            </div>
            <div className="p-4 text-center border-l border-[oklch(0.78_0.12_85/0.1)]">
              <span className="font-sk-serif text-xl font-bold text-[oklch(0.78_0.12_85)]">{t(right.name, right.nameJa)}</span>
            </div>
          </div>

          {FIELDS.map((field, i) => (
            <div key={field.key} className={i < FIELDS.length - 1 ? "grid grid-cols-3 border-b border-[oklch(0.78_0.12_85/0.08)]" : "grid grid-cols-3"}>
              <div className="p-4 text-sm text-foreground border-r border-[oklch(0.78_0.12_85/0.08)]">{t(left[field.key], left[field.keyJa])}</div>
              <div className="p-4 flex items-center justify-center bg-[oklch(0.14_0.025_270)]">
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t(field.en, field.ja)}</span>
              </div>
              <div className="p-4 text-sm text-foreground border-l border-[oklch(0.78_0.12_85/0.08)]">{t(right[field.key], right[field.keyJa])}</div>
            </div>
          ))}

          <div className="grid grid-cols-3 border-t border-[oklch(0.78_0.12_85/0.08)]">
            <div className="p-4 border-r border-[oklch(0.78_0.12_85/0.08)]">
              <div className="flex flex-wrap gap-1">
                {left.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 text-[9px] font-mono border border-[oklch(0.78_0.12_85/0.2)] text-[oklch(0.78_0.12_85)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 flex items-center justify-center bg-[oklch(0.14_0.025_270)]">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t("Keywords", "キーワード")}</span>
            </div>
            <div className="p-4 border-l border-[oklch(0.78_0.12_85/0.08)]">
              <div className="flex flex-wrap gap-1">
                {right.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 text-[9px] font-mono border border-[oklch(0.78_0.12_85/0.2)] text-[oklch(0.78_0.12_85)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="kintsugi-line mb-8" />
          <p className="font-sk-serif text-lg italic text-muted-foreground">
            {t('"The label says Junmai Daiginjo. The land says everything else."', "「ラベルには純米大吟醸と書いてある。土地がそれ以外のすべてを語る。」")}
          </p>
        </div>
      </div>
    </div>
  );
}
