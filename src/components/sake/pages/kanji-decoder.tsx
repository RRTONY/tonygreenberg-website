"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/sake/sake-providers";
import { kanjiLabels } from "@/lib/content/sake/culture-data";

// Ported from the Sake app's client/src/pages/KanjiDecoder.tsx (2026-11-26): label kanji with
// category filters and expandable explanations, plus the four-step "How to Read a Sake Label".
// Same copy and colors. Changed:
// - The category colors were inline styles; they're precomposed class strings here (CATEGORY_CLASSES).
// - Each kanji's explanation is in the server HTML (hidden until opened); the card is a button with
//   aria-expanded.
// - framer-motion: hero fades up, cards stagger in (CSS).

const categories = [
  { key: "all", en: "All", ja: "すべて" },
  { key: "grade", en: "Grade", ja: "等級" },
  { key: "style", en: "Style", ja: "スタイル" },
  { key: "process", en: "Process", ja: "製法" },
  { key: "quality", en: "Quality", ja: "品質" },
  { key: "season", en: "Season", ja: "季節" },
];

const CATEGORY_CLASSES: Record<string, { text: string; activeBorder: string; badge: string }> = {
  grade: {
    text: "text-[oklch(0.78_0.12_85)]",
    activeBorder: "border-[oklch(0.78_0.12_85)]",
    badge: "text-[oklch(0.78_0.12_85)] border-[oklch(0.78_0.12_85/0.4)]",
  },
  style: {
    text: "text-[oklch(0.60_0.16_40)]",
    activeBorder: "border-[oklch(0.60_0.16_40)]",
    badge: "text-[oklch(0.60_0.16_40)] border-[oklch(0.60_0.16_40/0.4)]",
  },
  process: {
    text: "text-[oklch(0.70_0.08_240)]",
    activeBorder: "border-[oklch(0.70_0.08_240)]",
    badge: "text-[oklch(0.70_0.08_240)] border-[oklch(0.70_0.08_240/0.4)]",
  },
  quality: {
    text: "text-[oklch(0.72_0.14_145)]",
    activeBorder: "border-[oklch(0.72_0.14_145)]",
    badge: "text-[oklch(0.72_0.14_145)] border-[oklch(0.72_0.14_145/0.4)]",
  },
  season: {
    text: "text-[oklch(0.65_0.10_85)]",
    activeBorder: "border-[oklch(0.65_0.10_85)]",
    badge: "text-[oklch(0.65_0.10_85)] border-[oklch(0.65_0.10_85/0.4)]",
  },
};

export function SakeKanjiDecoder() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [activeKanji, setActiveKanji] = useState<string | null>(null);

  const filtered = useMemo(() => (filter === "all" ? kanjiLabels : kanjiLabels.filter((k) => k.category === filter)), [filter]);

  const steps = [
    {
      step: "01",
      en: "Find the Grade",
      ja: "等級を見つける",
      desc: t(
        "純米大吟醸, 吟醸, 本醸造 — this tells you the polishing and whether alcohol was added.",
        "純米大吟醸、吟醸、本醸造 — 精米歩合とアルコール添加の有無を示す。",
      ),
    },
    {
      step: "02",
      en: "Check the Rice",
      ja: "米を確認する",
      desc: t("Look for 山田錦, 雄町, 五百万石 — the rice variety shapes the character.", "山田錦、雄町、五百万石を探す — 米品種が個性を形作る。"),
    },
    {
      step: "03",
      en: "Read the Process",
      ja: "製法を読む",
      desc: t("生, 原酒, 無濾過 — these tell you what was NOT done. Often more important.", "生、原酒、無濾過 — 何をしなかったかを示す。しばしばより重要。"),
    },
    {
      step: "04",
      en: "Find the Season",
      ja: "季節を見つける",
      desc: t("ひやおろし, しぼりたて — seasonal releases connect you to the brewing calendar.", "ひやおろし、しぼりたて — 季節限定酒が醸造暦とあなたをつなぐ。"),
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <p className="text-xs tracking-[0.3em] uppercase text-[oklch(0.78_0.12_85)] mb-4 font-mono">{t("漢字解読 — Kanji Decoder", "漢字解読")}</p>
            <h1 className="font-sk-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.96_0.01_85)] leading-tight">
              {t("Read the", "ラベルを")} <span className="gold-shimmer">{t("Label", "読め")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[oklch(0.7_0.01_85)] text-lg leading-relaxed">
              {t(
                "Every sake label is a coded message. Rice type, polishing ratio, brewing method, yeast strain — it's all there in the kanji, if you know how to read it. This is your Rosetta Stone.",
                "すべての日本酒ラベルは暗号化されたメッセージ。米の種類、精米歩合、醸造方法、酵母株 — すべてが漢字に書かれている。これがあなたのロゼッタストーン。",
              )}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label={t("Category", "カテゴリー")}>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                aria-pressed={filter === cat.key}
                className={
                  filter === cat.key
                    ? "px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 bg-[oklch(0.78_0.12_85/0.15)] border-[oklch(0.78_0.12_85)] text-[oklch(0.93_0.01_85)]"
                    : "px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all duration-300 border-[oklch(0.28_0.04_270)] text-[oklch(0.6_0.02_270)] hover:border-[oklch(0.78_0.12_85/0.3)]"
                }
              >
                {t(cat.en, cat.ja)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Kanji grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((k, i) => {
              const isActive = activeKanji === k.id;
              const cat = CATEGORY_CLASSES[k.category] ?? CATEGORY_CLASSES.grade;
              const panelId = `kanji-${k.id}`;
              return (
                <div
                  key={k.id}
                  className="animate-in fade-in slide-in-from-bottom-2.5 duration-400 fill-mode-both"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveKanji(isActive ? null : k.id)}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    className="w-full text-left h-full"
                  >
                    <span
                      className={
                        isActive
                          ? `relative block h-full p-5 border transition-all duration-500 bg-[oklch(0.16_0.03_270)] ${cat.activeBorder}`
                          : "relative block h-full p-5 border transition-all duration-500 bg-[oklch(0.14_0.025_270)] border-[oklch(0.22_0.04_270)] hover:border-[oklch(0.78_0.12_85/0.2)]"
                      }
                    >
                      <span className="flex items-start gap-4">
                        <span className="shrink-0">
                          <span className={`font-sk-serif text-4xl font-bold ${cat.text}`}>{k.kanji}</span>
                        </span>
                        <span className="block flex-1 min-w-0">
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[oklch(0.93_0.01_85)]">{t(k.reading, k.readingJa)}</span>
                            <span className={`text-[9px] tracking-[0.15em] uppercase font-mono px-1.5 py-0.5 border ${cat.badge}`}>{k.category}</span>
                          </span>
                          <span className="block mt-1 text-sm text-[oklch(0.78_0.12_85)]">{t(k.meaning, k.meaningJa)}</span>
                        </span>
                      </span>

                      <span id={panelId} hidden={!isActive} className="block animate-in fade-in duration-300">
                        <span className="block mt-4 pt-4 border-t border-[oklch(0.28_0.04_270)] text-sm text-[oklch(0.75_0.01_85)] leading-relaxed">
                          {t(k.detail, k.detailJa)}
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

      {/* Label reading guide */}
      <section className="py-16 lg:py-20 border-t border-[oklch(0.78_0.12_85/0.1)]">
        <div className="max-w-250 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-sk-serif text-3xl font-bold text-[oklch(0.96_0.01_85)] mb-8 text-center">{t("How to Read a Sake Label", "日本酒ラベルの読み方")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((item) => (
              <div key={item.step} className="p-4 bg-[oklch(0.14_0.025_270)] border border-[oklch(0.22_0.04_270)]">
                <span className="font-mono text-xs text-[oklch(0.78_0.12_85)]">{item.step}</span>
                <h3 className="mt-2 font-sk-serif text-lg font-bold text-[oklch(0.93_0.01_85)]">{t(item.en, item.ja)}</h3>
                <p className="mt-2 text-xs text-[oklch(0.65_0.02_270)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
