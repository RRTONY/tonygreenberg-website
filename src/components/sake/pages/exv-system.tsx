"use client";

import { useState } from "react";
import { LargeRadar } from "@/components/sake/exv-visuals";
import { useLanguage } from "@/components/sake/sake-providers";
import { calculateEXV, exvDimensions, exvTiers, getEXVTier, namazakeBottles, type EXVDimension, type EXVScore } from "@/lib/content/sake/exv-data";

// Ported from the Sake app's client/src/pages/EXVSystem.tsx (2026-11-26): the problem with points, the
// interactive seven-dimension radar, the six tiers, the namazake ranking and the closing manifesto.
// Changed:
// - Per-look colors are classes; dimension and tier colors come from exv-data, so those stay inline.
//   The app's `${tier.color}22` track tint appended hex alpha to an oklch() color (invalid, so it never
//   showed); it's the intended faint tint now (color-mix) (rule 20).
// - The dimension cards and radar points are buttons/focusable: keyboard focus shows a dimension the
//   way hovering does. The tier rows open from a real button, and each tier's description is always in
//   the page (hidden until opened).
// - The "→" bullets in "What Points Miss" are the app's copy and stay. The app rendered GlobalFooter
//   here; the layout renders it now.

const TP = "text-[oklch(0.93_0.01_85)] [.sake-austere_&]:text-[oklch(0.15_0.005_60)]";
const TS = "text-[oklch(0.6_0.01_85)] [.sake-austere_&]:text-[oklch(0.45_0.008_60)]";
const BC = "border-[oklch(0.78_0.12_85/0.15)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";
const CARD_BG = "bg-[oklch(0.12_0.02_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)]";
const DEEP_BG = "bg-[oklch(0.08_0.02_270)] [.sake-austere_&]:bg-[oklch(0.96_0.004_80)]";
const H2 = `font-sk-serif text-3xl font-bold mb-3 ${TP}`;

/** The demo soul print (the app's demoScores: Tamagawa "Time Machine" 1712). */
export const demoScores: EXVScore = { shogeki: 10, yoin: 9, monogatari: 10, hakanasa: 7, basho: 9, chowa: 6, ifu: 10 };

export function SakeExvSystem() {
  const { t } = useLanguage();
  const [hoveredDim, setHoveredDim] = useState<EXVDimension | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const ranked = [...namazakeBottles].sort((a, b) => calculateEXV(b.exv) - calculateEXV(a.exv));

  return (
    <div className="min-h-screen pt-16 transition-colors duration-700 bg-[oklch(0.06_0.02_270)] [.sake-austere_&]:bg-[oklch(0.96_0.004_80)]">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_70%_40%,color-mix(in_oklab,var(--sk-accent)_15%,transparent),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-[30px] duration-800 fill-mode-both">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 text-(--sk-accent)">{t("A New Way to Feel Sake", "酒を感じる新しい方法")}</p>
            <h1 className={`font-sk-serif text-5xl md:text-7xl font-bold tracking-tight mb-4 ${TP}`}>{t("The EXV System", "EXVシステム")}</h1>
            <p className={`text-lg md:text-xl font-light max-w-3xl leading-relaxed ${TS}`}>
              {t(
                "Experience Value. Not what sake IS — what it DOES to you. Seven emotional dimensions. Six experiential tiers. One soul print that captures the shape of an encounter.",
                "体験価値。酒が何であるかではなく、酒があなたに何をするか。7つの感情次元。6つの体験段階。出会いの形を捉える一つの魂の指紋。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* The Problem with Points */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className={`font-sk-serif text-2xl font-bold mb-3 ${TP}`}>{t("The Problem with Points", "点数の問題")}</h2>
          <div className="w-16 h-px mb-6 bg-(--sk-accent)" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className={`text-sm leading-relaxed mb-4 ${TS}`}>
                {t(
                  "A 92-point sake tells you nothing about how it will make you feel. It doesn't tell you that the toji left his corporate job to save his dying village's brewery. It doesn't tell you that the water comes from a 300-year-old well behind a Shinto shrine. It doesn't tell you that this particular bottle will taste different next week because it's alive.",
                  "92点の酒は、それがどう感じさせるかについて何も教えない。杜氏が死にゆく村の蔵を救うために会社を辞めたことを教えない。水が神社の裏の300年の井戸から来ることを教えない。この瓶が生きているから来週は味が違うことを教えない。",
                )}
              </p>
              <p className={`text-sm leading-relaxed ${TS}`}>
                {t(
                  "Points flatten the multidimensional into the linear. They reduce a symphony to a decibel reading. The EXV system doesn't replace technical evaluation — it adds the dimension that matters most: the human experience.",
                  "点数は多次元を一次元に平坦化する。交響曲をデシベル値に還元する。EXVシステムは技術的評価を置き換えない — 最も重要な次元を加える：人間の体験。",
                )}
              </p>
            </div>
            <div className={`p-6 border ${CARD_BG} ${BC}`}>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">{t("What Points Miss", "点数が見逃すもの")}</h3>
              <div className={`space-y-3 text-xs ${TS}`}>
                <p>
                  →{" "}
                  {t(
                    "A ¥500 cup sake at a train station at midnight after a long day can score higher than a ¥50,000 daiginjo at a formal dinner",
                    "長い一日の後、深夜の駅で飲む500円のカップ酒は、正式な夕食会の5万円の大吟醸より高得点になりうる",
                  )}
                </p>
                <p>
                  →{" "}
                  {t(
                    "Context is not noise — it's signal. The EXV system treats where, when, who, and why as fundamental inputs",
                    "文脈はノイズではない — シグナルだ。EXVシステムは場所、時間、誰と、なぜを基本的な入力として扱う",
                  )}
                </p>
                <p>
                  →{" "}
                  {t(
                    "A sake you'll never find again scores higher on Ephemerality than one always on the shelf",
                    "二度と見つからない酒は、常に棚にある酒より儚さで高得点",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Dimensions */}
      <section className={`py-20 ${DEEP_BG}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={H2}>{t("Seven Dimensions of Experience", "体験の七次元")}</h2>
          <div className="w-16 h-px mb-8 bg-(--sk-accent)" />

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex justify-center lg:sticky lg:top-24 shrink-0 w-full lg:w-auto">
              <LargeRadar scores={demoScores} size={360} interactive onHover={setHoveredDim} />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div aria-live="polite">
                {hoveredDim ? (
                  <div
                    key={hoveredDim.key}
                    className={`p-6 border animate-in fade-in slide-in-from-right-2.5 duration-300 ${CARD_BG}`}
                    style={{ borderColor: hoveredDim.color }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-sk-jp text-4xl font-bold" style={{ color: hoveredDim.color }}>
                        {hoveredDim.kanji}
                      </span>
                      <div>
                        <h3 className={`font-sk-serif text-xl font-bold ${TP}`}>{t(hoveredDim.name, hoveredDim.nameJa)}</h3>
                        <p className="text-xs italic" style={{ color: hoveredDim.color }}>
                          {t(hoveredDim.question, hoveredDim.questionJa)}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${TS}`}>{t(hoveredDim.description, hoveredDim.descriptionJa)}</p>
                    <div className="flex justify-between gap-4 text-[10px] font-mono tracking-wider">
                      <span className={TS}>0 — {t(hoveredDim.lowLabel, hoveredDim.lowLabelJa)}</span>
                      <span className="text-right" style={{ color: hoveredDim.color }}>
                        10 — {t(hoveredDim.highLabel, hoveredDim.highLabelJa)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key="default" className={`p-6 border animate-in fade-in duration-300 ${CARD_BG} ${BC}`}>
                    <p className={`text-sm italic ${TS}`}>
                      {t(
                        "Hover over a dimension on the radar chart to explore it. Each dimension measures a different facet of the emotional experience — not the technical quality.",
                        "レーダーチャートの次元にホバーして探索。各次元は感情体験の異なる側面を測定する — 技術的品質ではなく。",
                      )}
                    </p>
                    <p className="text-xs mt-3 font-mono text-(--sk-accent)">{t('Demo: Tamagawa "Time Machine" 1712', "デモ：玉川 タイムマシン 1712")}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {exvDimensions.map((dim) => {
                  const active = hoveredDim?.key === dim.key;
                  return (
                    <button
                      type="button"
                      key={dim.key}
                      className={active ? `p-3 border text-left transition-all duration-200 ${CARD_BG}` : `p-3 border text-left transition-all duration-200 ${CARD_BG} ${BC}`}
                      style={active ? { borderColor: dim.color } : undefined}
                      onMouseEnter={() => setHoveredDim(dim)}
                      onMouseLeave={() => setHoveredDim(null)}
                      onFocus={() => setHoveredDim(dim)}
                      onBlur={() => setHoveredDim(null)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-sk-jp text-lg font-bold" style={{ color: dim.color }}>
                          {dim.kanji}
                        </span>
                        <span>
                          <span className={`text-xs font-semibold ${TP}`}>{t(dim.name, dim.nameJa)}</span>
                          <span className={`block text-[10px] mt-0.5 italic ${TS}`}>{t(dim.question, dim.questionJa)}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Tiers */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={H2}>{t("Six Tiers of Experience", "体験の六段階")}</h2>
          <div className="w-16 h-px mb-4 bg-(--sk-accent)" />
          <p className={`text-sm mb-10 max-w-3xl ${TS}`}>
            {t(
              "The weighted sum of all seven dimensions produces a single EXV score (0-100). Awe counts double. Ephemerality counts 1.5x. Because the rarest feelings deserve the most weight.",
              "7つの次元の加重合計が単一のEXVスコア（0-100）を生む。畏怖は2倍。儚さは1.5倍。最も稀な感情は最も重い重みに値するから。",
            )}
          </p>

          <div className="space-y-3">
            {exvTiers.map((tier, i) => {
              const open = selectedTier === i;
              const panelId = `sk-exv-tier-${i}`;
              return (
                <div
                  key={tier.name}
                  className={
                    open
                      ? `border transition-all duration-300 animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both ${CARD_BG}`
                      : `border transition-all duration-300 animate-in fade-in slide-in-from-left-5 duration-500 fill-mode-both ${CARD_BG} ${BC}`
                  }
                  style={open ? { borderColor: tier.color, animationDelay: `${i * 0.1}s` } : { animationDelay: `${i * 0.1}s` }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setSelectedTier(open ? null : i)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                  >
                    <span className="font-sk-jp text-4xl font-bold shrink-0 w-14 text-center" style={{ color: tier.color }}>
                      {tier.kanji}
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-x-3">
                        <span className={`font-sk-serif text-lg font-bold ${TP}`}>{t(tier.name, tier.nameJa)}</span>
                        <span className="text-xs font-mono" style={{ color: tier.color }}>
                          {tier.range[0]}-{tier.range[1]}
                        </span>
                      </span>
                      <span className="block text-xs mt-0.5 italic" style={{ color: tier.color }}>
                        {t(tier.meaning, tier.meaningJa)}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden sm:block w-32 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: `color-mix(in oklab, ${tier.color} 13%, transparent)` }}
                    >
                      <span className="block h-full rounded-full" style={{ width: `${tier.range[1]}%`, backgroundColor: tier.color }} />
                    </span>
                  </button>
                  <div id={panelId} hidden={!open} className="animate-in fade-in duration-300">
                    <div className="px-5 pb-5 ml-14">
                      <p className={`text-sm leading-relaxed ${TS}`}>{t(tier.description, tier.descriptionJa)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXV in Action */}
      <section className={`py-20 ${DEEP_BG}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={H2}>{t("EXV in Action", "EXVの実践")}</h2>
          <div className="w-16 h-px mb-4 bg-(--sk-accent)" />
          <p className={`text-sm mb-8 max-w-3xl ${TS}`}>
            {t(
              'The namazake collection ranked by EXV score. Notice how the shape of each soul print tells a different story — the highest-scoring sake isn\'t the "best" in any conventional sense. It\'s the most profound experience.',
              "生酒コレクションをEXVスコアでランキング。各魂の指紋の形が異なる物語を語ることに注目 — 最高得点の酒は従来の意味で「最良」ではない。最も深い体験なのだ。",
            )}
          </p>

          <ol className="space-y-4">
            {ranked.map((bottle, i) => {
              const score = calculateEXV(bottle.exv);
              const tier = getEXVTier(score);
              return (
                <li
                  key={bottle.id}
                  className={`flex items-center gap-4 p-4 border animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both ${CARD_BG} ${BC}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-2xl font-bold shrink-0 w-8 text-center font-mono text-(--sk-accent)">{i + 1}</span>
                  <span className="font-sk-jp text-2xl font-bold shrink-0" style={{ color: tier.color }}>
                    {tier.kanji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-sk-serif text-sm font-bold truncate ${TP}`}>{t(bottle.name, bottle.nameJa)}</h3>
                    <p className={`text-[10px] mt-0.5 ${TS}`}>
                      {t(bottle.brewery, bottle.breweryJa)} · {t(bottle.prefecture, bottle.prefectureJa)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-mono" style={{ color: tier.color }}>
                      {score}
                    </span>
                    <p className={`text-[9px] font-mono tracking-wider uppercase ${TS}`}>{tier.name}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* The Shape IS the Rating */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span aria-hidden="true" className="font-sk-jp text-6xl font-bold block mb-6 text-(--sk-accent)">
            験
          </span>
          <h2 className={`font-sk-serif text-2xl md:text-3xl font-bold mb-6 ${TP}`}>{t("The Shape IS the Rating", "形こそが評価")}</h2>
          <p className={`text-sm leading-loose mb-4 ${TS}`}>
            {t(
              "In the EXV system, you don't need to read the number. You read the shape. A tall, spiky soul print means a sake of extreme highs and lows — polarizing, unforgettable, probably controversial. A round, full soul print means a sake of deep harmony — balanced, complete, quietly profound. Neither is better. They're different experiences for different humans in different moments.",
              "EXVシステムでは、数字を読む必要はない。形を読む。背が高く尖った魂の指紋は、極端な高低を持つ酒を意味する — 分極的、忘れられない、おそらく議論を呼ぶ。丸く満ちた魂の指紋は、深い調和の酒を意味する — バランスが取れ、完全で、静かに深遠。どちらが良いわけではない。異なる瞬間の異なる人間のための異なる体験。",
            )}
          </p>
          <p className={`text-sm leading-loose ${TS}`}>
            {t(
              "This is sake for sake's sake. Not for scores. Not for medals. Not for Instagram. For the irreducible, unrepeatable experience of being alive and tasting something that makes you more so.",
              "これは酒のための酒。点数のためではない。メダルのためではない。インスタグラムのためではない。生きていること、そしてそれをより強く感じさせる何かを味わうという、還元不可能で繰り返せない体験のために。",
            )}
          </p>
          <div className="w-24 h-px mx-auto mt-8 bg-(--sk-accent)" />
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
