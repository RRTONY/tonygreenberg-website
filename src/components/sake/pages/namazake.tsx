"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Clock, Droplets, FlaskConical, Sparkles, Thermometer, Wine } from "lucide-react";
import { SoulPrint, TierBadge } from "@/components/sake/exv-visuals";
import { useLanguage, useMode } from "@/components/sake/sake-providers";
import { calculateEXV, exvDimensions, namazakeBottles, namazakeSubtypes, type EXVScore } from "@/lib/content/sake/exv-data";

// Ported from the Sake app's client/src/pages/Namazake.tsx (2026-11-26): the science, the three
// subtypes, the eight-bottle living collection with soul prints, the natural-wine bridge and the
// closing essay. Changed:
// - The per-look colors the app chose in JS are classes that switch with the Austere look.
// - The subtype panels and bottle details open and close as before, but their text is always in the
//   page (hidden until opened) so it's readable without scripts and by search engines; the bottle
//   cards open from a real button (keyboard and screen readers).
// - The app's tints like `${dim.color}11` appended hex alpha to an oklch() color, which browsers
//   reject, so those fills never showed; they're the intended faint tints now (color-mix) (rule 20).
//   The active filter's fill likewise.
// - The TierBadge's stray footer is gone (see exv-visuals.tsx); the page's footer comes from the layout.
// - Process arrows (Press → Hi-ire 1 → ...) and the ↔ in the translation table are the app's copy and stay.

const TP = "text-[oklch(0.93_0.01_85)] [.sake-austere_&]:text-[oklch(0.15_0.005_60)]";
const TS = "text-[oklch(0.6_0.01_85)] [.sake-austere_&]:text-[oklch(0.45_0.008_60)]";
const BC = "border-[oklch(0.78_0.12_85/0.15)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";
const CARD_BG = "bg-[oklch(0.12_0.02_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)]";
const DEEP_BG = "bg-[oklch(0.08_0.02_270)] [.sake-austere_&]:bg-[oklch(0.96_0.004_80)]";
const H2 = `font-sk-serif text-3xl font-bold mb-3 ${TP}`;
const EYEBROW = "font-mono text-[9px] tracking-[0.3em] uppercase text-(--sk-accent)";
const STRUCK = "px-2 py-1 border border-[oklch(0.65_0.25_25/0.5)] text-[oklch(0.65_0.25_25)] line-through";
const STEP = `px-2 py-1 border ${BC} ${TS}`;

const SUBTYPE_FILTERS = ["all", "namanama", "namachozo", "namazume"] as const;

export function SakeNamazake() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subtypeFilter, setSubtypeFilter] = useState<string>("all");
  const [expandedSubtype, setExpandedSubtype] = useState<string | null>(null);

  const filteredBottles = useMemo(
    () => (subtypeFilter === "all" ? namazakeBottles : namazakeBottles.filter((b) => b.subtype === subtypeFilter)),
    [subtypeFilter],
  );

  const filterLabel = (f: string) =>
    f === "all"
      ? t("All", "すべて")
      : f === "namanama"
        ? t("Nama-Nama 生生", "生生")
        : f === "namachozo"
          ? t("Nama-Chozo 生貯", "生貯蔵")
          : t("Namazume 生詰", "生詰め");

  return (
    <div className="min-h-screen pt-16 transition-colors duration-700 bg-[oklch(0.06_0.02_270)] [.sake-austere_&]:bg-[oklch(0.96_0.004_80)]">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_50%,color-mix(in_oklab,var(--sk-accent)_15%,transparent),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-[30px] duration-800 fill-mode-both">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 text-(--sk-accent)">{t("The Living Sake", "生きている酒")}</p>
            <h1 className={`font-sk-serif text-5xl md:text-7xl font-bold tracking-tight mb-4 ${TP}`}>{t("Namazake", "生酒")}</h1>
            <p className={`text-xl md:text-2xl font-light max-w-3xl leading-relaxed ${TS}`}>
              {t(
                "Unpasteurized. Unfiltered by convention. Still breathing when it touches your lips. The sake that refuses to be preserved — demanding instead that you be present.",
                "非火入れ。慣習に濾過されない。唇に触れる時まだ呼吸している。保存されることを拒む酒 — 代わりにあなたが今ここにいることを求める。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* The Science of Being Alive */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={H2}>{t("The Science of Being Alive", "生きていることの科学")}</h2>
          <div className="w-16 h-px mb-8 bg-(--sk-accent)" />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className={`text-sm leading-relaxed mb-4 ${TS}`}>
                {t(
                  'Most sake undergoes two rounds of pasteurization — called "hi-ire" (火入れ) — heating to approximately 65°C (150°F) for 30 minutes. The first round occurs after pressing, the second before bottling. This kills active enzymes, stabilizes flavor, and extends shelf life. It also kills something else: the living, breathing character of sake in its most raw state.',
                  "ほとんどの酒は「火入れ」と呼ばれる2回の殺菌を経る — 約65°C（150°F）で30分間加熱。1回目は搾り後、2回目は瓶詰め前。これは活性酵素を殺し、味を安定させ、保存期間を延ばす。しかし別のものも殺す：最も生の状態での酒の生きた、呼吸する性格を。",
                )}
              </p>
              <p className={`text-sm leading-relaxed ${TS}`}>
                {t(
                  "Namazake skips one or both of these rounds. The enzymes remain active. The sake continues to evolve in the bottle — fermenting, changing, aging in real time. It must be refrigerated below 5°C at all times. Bottles can literally explode from enzyme activity if stored warm. This is not a product. It's a living thing.",
                  "生酒はこの工程の一方または両方を省略する。酵素は活性のまま。酒は瓶の中で進化し続ける — 発酵し、変化し、リアルタイムで熟成する。常に5°C以下で冷蔵しなければならない。温かく保存すると酵素活性で瓶が文字通り爆発することがある。これは製品ではない。生き物だ。",
                )}
              </p>
            </div>
            <div className={`p-6 border ${CARD_BG} ${BC}`}>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">
                {t("The Cold Chain Commandments", "冷蔵チェーンの戒律")}
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: Thermometer, text: t("Store below 5°C (41°F) — always", "常に5°C（41°F）以下で保存") },
                  { icon: AlertTriangle, text: t("Never break the cold chain — brewery to glass", "コールドチェーンを切るな — 蔵からグラスまで") },
                  { icon: Clock, text: t("Drink within 2-6 months of bottling", "瓶詰めから2-6ヶ月以内に飲む") },
                  { icon: Sparkles, text: t("Keep away from light — UV destroys enzymes", "光を避けよ — UVが酵素を破壊する") },
                  { icon: FlaskConical, text: t("Expect change — the first and last pour will differ", "変化を期待せよ — 最初と最後の一杯は異なる") },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-(--sk-accent)" />
                    <span className={`text-xs leading-relaxed ${TS}`}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isConnoisseur && (
            <div className={`p-6 border mb-8 animate-in fade-in duration-500 ${CARD_BG} ${BC}`}>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3 text-(--sk-accent)">
                {t("Connoisseur: Enzyme Dynamics", "通：酵素動態")}
              </h3>
              <p className={`text-xs leading-relaxed ${TS}`}>
                {t(
                  "The key enzymes in namazake are amylase (converts starch to sugar) and protease (breaks down proteins). In pasteurized sake, these are denatured by heat. In namazake, they remain active, continuing to alter the flavor profile over time. This is why namazake tastes different at week 1 vs. week 12 — the enzyme activity creates a moving target. Some connoisseurs deliberately age namazake at controlled temperatures to explore these transformations, though this is considered heretical by purists who insist on drinking it as fresh as possible.",
                  "生酒の主要酵素はアミラーゼ（デンプンを糖に変換）とプロテアーゼ（タンパク質を分解）。火入れ酒ではこれらは熱で変性する。生酒では活性のまま残り、時間とともに味のプロファイルを変え続ける。1週目と12週目で味が異なるのはこのため — 酵素活性が動く標的を作る。一部の通は制御された温度で意図的に生酒を熟成させてこれらの変化を探求するが、できるだけ新鮮に飲むべきと主張する純粋主義者からは異端とされる。",
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* The Three Lives of Nama */}
      <section className={`py-20 ${DEEP_BG}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={H2}>{t("The Three Lives of Nama", "生の三つの命")}</h2>
          <div className="w-16 h-px mb-8 bg-(--sk-accent)" />
          <p className={`text-sm leading-relaxed mb-10 max-w-3xl ${TS}`}>
            {t(
              "Not all namazake is created equal. The three subtypes represent three different philosophies of how much wildness to preserve — from completely untamed to carefully curated rawness.",
              "すべての生酒が同じではない。三つのサブタイプは、どれだけの野性を保存するかについての三つの異なる哲学を表す — 完全に飼いならされていないものから、慎重にキュレーションされた生まで。",
            )}
          </p>

          <div className="space-y-4">
            {namazakeSubtypes.map((sub) => {
              const open = expandedSubtype === sub.key;
              const skipsFirst = sub.key === "namanama" || sub.key === "namachozo";
              const skipsSecond = sub.key === "namanama" || sub.key === "namazume";
              const panelId = `sk-nama-${sub.key}`;
              return (
                <div key={sub.key} className={`border overflow-hidden ${CARD_BG} ${BC}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setExpandedSubtype(open ? null : sub.key)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-sk-jp text-3xl font-bold text-(--sk-accent)">{sub.kanji}</span>
                      <span>
                        <span className={`font-sk-serif block text-lg font-semibold ${TP}`}>{t(sub.name, sub.nameJa)}</span>
                        <span className={`block text-xs mt-0.5 ${TS}`}>{t(sub.pasteurizationSkipped, sub.pasteurizationSkippedJa)}</span>
                      </span>
                    </span>
                    {open ? (
                      <ChevronUp aria-hidden="true" size={18} className="text-(--sk-accent)" />
                    ) : (
                      <ChevronDown aria-hidden="true" size={18} className={TS} />
                    )}
                  </button>
                  <div id={panelId} hidden={!open} className="animate-in fade-in duration-300">
                    <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`${EYEBROW} mb-2`}>{t("Character", "性格")}</h4>
                        <p className={`text-sm leading-relaxed mb-4 ${TS}`}>{t(sub.character, sub.characterJa)}</p>
                        <h4 className={`${EYEBROW} mb-2`}>{t("Analogy", "例え")}</h4>
                        <p className={`text-sm leading-relaxed italic ${TS}`}>{t(sub.analogy, sub.analogyJa)}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>{t("Shelf Life", "保存期間")}</h4>
                          <p className={`text-sm ${TS}`}>{t(sub.shelfLife, sub.shelfLifeJa)}</p>
                        </div>
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>{t("Best Season", "最適な季節")}</h4>
                          <p className={`text-sm ${TS}`}>{t(sub.bestSeason, sub.bestSeasonJa)}</p>
                        </div>
                        <div className="pt-2">
                          <h4 className={`${EYEBROW} mb-3`}>{t("Pasteurization Path", "火入れの経路")}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <span className={STEP}>{t("Press", "搾り")}</span>
                            <span className="text-(--sk-accent)">→</span>
                            <span className={skipsFirst ? STRUCK : STEP}>{t("Hi-ire 1", "火入れ1")}</span>
                            <span className="text-(--sk-accent)">→</span>
                            <span className={STEP}>{t("Age", "熟成")}</span>
                            <span className="text-(--sk-accent)">→</span>
                            <span className={skipsSecond ? STRUCK : STEP}>{t("Hi-ire 2", "火入れ2")}</span>
                            <span className="text-(--sk-accent)">→</span>
                            <span className={STEP}>{t("Bottle", "瓶詰め")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Living Collection */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={H2}>{t("The Living Collection", "生きたコレクション")}</h2>
          <div className="w-16 h-px mb-4 bg-(--sk-accent)" />
          <p className={`text-sm mb-8 max-w-3xl ${TS}`}>
            {t(
              "Eight bottles that define the namazake spectrum — from the pioneer that started it all to the most esoteric expression on earth. Each scored with the EXV system: seven emotional dimensions, one soul print.",
              "生酒のスペクトルを定義する8本 — すべてを始めたパイオニアから地球上最も秘教的な表現まで。各々EXVシステムで評価：7つの感情次元、1つの魂の指紋。",
            )}
          </p>

          <div className="flex gap-2 mb-8 flex-wrap" role="group" aria-label={t("Filter by subtype", "サブタイプで絞り込む")}>
            {SUBTYPE_FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                aria-pressed={subtypeFilter === f}
                onClick={() => setSubtypeFilter(f)}
                className={
                  subtypeFilter === f
                    ? "px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] uppercase border transition-all duration-300 border-(--sk-accent) text-(--sk-accent) bg-(--sk-accent)/7"
                    : `px-3 py-1.5 text-[10px] font-mono tracking-[0.15em] uppercase border transition-all duration-300 bg-transparent ${BC} ${TS}`
                }
              >
                {filterLabel(f)}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredBottles.map((bottle, i) => {
              const exvScore = calculateEXV(bottle.exv);
              const isSelected = selectedId === bottle.id;
              const detailId = `sk-nama-bottle-${bottle.id}`;
              return (
                <div
                  key={bottle.id}
                  className={
                    isSelected
                      ? `border transition-all duration-300 ring-1 ring-(--sk-accent) border-(--sk-accent) animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both ${CARD_BG}`
                      : `border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both ${CARD_BG} ${BC}`
                  }
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls={detailId}
                    onClick={() => setSelectedId(isSelected ? null : bottle.id)}
                    className="block w-full p-5 pb-0 text-left"
                  >
                    <span className="flex justify-between items-start mb-4 gap-3">
                      <span className="flex-1">
                        <span className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-1.5 py-0.5 border border-(--sk-accent) text-(--sk-accent)">
                            {bottle.subtype}
                          </span>
                          <span className={`text-[9px] font-mono ${TS}`}>{bottle.priceRange}</span>
                        </span>
                        <span className={`font-sk-serif block text-lg font-bold mt-2 ${TP}`}>{t(bottle.name, bottle.nameJa)}</span>
                        <span className={`block text-xs mt-1 ${TS}`}>
                          {t(bottle.brewery, bottle.breweryJa)} · {t(bottle.prefecture, bottle.prefectureJa)}
                        </span>
                      </span>
                      <TierBadge score={exvScore} />
                    </span>

                    <span className="flex gap-4 items-start">
                      <span className="flex-1">
                        <span className={`block text-xs leading-relaxed mb-3 ${TS}`}>{t(bottle.flavorProfile, bottle.flavorProfileJa)}</span>
                        <span className={`flex flex-wrap gap-x-4 text-[10px] ${TS}`}>
                          <span>
                            {t("Rice", "米")}: {t(bottle.rice, bottle.riceJa)}
                          </span>
                          <span>{bottle.polishRatio}%</span>
                          <span>{bottle.abv}%</span>
                        </span>
                      </span>
                      <span className="shrink-0">
                        <SoulPrint scores={bottle.exv} size={120} label={`${t(bottle.name, bottle.nameJa)}: EXV ${exvScore}`} />
                      </span>
                    </span>
                  </button>

                  <div id={detailId} hidden={!isSelected} className="px-5 animate-in fade-in duration-300">
                    <div className={`mt-5 pt-5 space-y-4 border-t ${BC}`}>
                      <div>
                        <h4 className={`${EYEBROW} mb-2`}>{t("The Story", "物語")}</h4>
                        <p className={`text-sm leading-relaxed ${TS}`}>{t(bottle.story, bottle.storyJa)}</p>
                      </div>
                      <div>
                        <h4 className={`${EYEBROW} mb-2`}>{t("Why This Matters", "なぜこれが重要か")}</h4>
                        <p className={`text-sm leading-relaxed italic ${TS}`}>{t(bottle.whyThisMatters, bottle.whyThisMattersJa)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>
                            <Thermometer aria-hidden="true" size={10} className="inline mr-1" />
                            {t("Temperature", "温度")}
                          </h4>
                          <p className={`text-xs ${TS}`}>{t(bottle.servingTemp, bottle.servingTempJa)}</p>
                        </div>
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>
                            <Wine aria-hidden="true" size={10} className="inline mr-1" />
                            {t("Vessel", "器")}
                          </h4>
                          <p className={`text-xs ${TS}`}>{t(bottle.vessel, bottle.vesselJa)}</p>
                        </div>
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>
                            <Droplets aria-hidden="true" size={10} className="inline mr-1" />
                            {t("Season", "季節")}
                          </h4>
                          <p className={`text-xs ${TS}`}>{t(bottle.season, bottle.seasonJa)}</p>
                        </div>
                        <div>
                          <h4 className={`${EYEBROW} mb-1`}>{t("Pairing", "ペアリング")}</h4>
                          <p className={`text-xs ${TS}`}>{t(bottle.pairingFood, bottle.pairingFoodJa)}</p>
                        </div>
                      </div>
                      <div className="pb-5">
                        <h4 className={`${EYEBROW} mb-3`}>{t("Soul Print Dimensions", "魂の指紋 次元")}</h4>
                        <div className="grid grid-cols-7 gap-1">
                          {exvDimensions.map((dim) => {
                            const val = bottle.exv[dim.key as keyof EXVScore];
                            return (
                              <div key={dim.key} className="text-center">
                                <div className="font-sk-jp text-lg font-bold" style={{ color: dim.color }}>
                                  {dim.kanji}
                                </div>
                                <div
                                  className="w-full h-16 relative mt-1"
                                  style={{ backgroundColor: `color-mix(in oklab, ${dim.color} 7%, transparent)` }}
                                >
                                  <div
                                    className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                                    style={{ height: `${val * 10}%`, backgroundColor: `color-mix(in oklab, ${dim.color} 27%, transparent)` }}
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold" style={{ color: dim.color }}>
                                    {val}
                                  </span>
                                </div>
                                <div className={`text-[8px] mt-1 font-mono ${TS}`}>{t(dim.name, dim.nameJa)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isSelected && <div className="h-5" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Natural Wine Bridge */}
      <section className={`py-20 ${DEEP_BG}`}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className={H2}>{t("The Natural Wine Bridge", "ナチュラルワインの架け橋")}</h2>
          <div className="w-16 h-px mb-8 bg-(--sk-accent)" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className={`text-sm leading-relaxed mb-4 ${TS}`}>
                {t(
                  "If you love natural wine, you already understand namazake — you just don't know it yet. The philosophy is identical: minimal intervention, living product, cold chain obsession, flavor that changes with every bottle. Namazake is the natural wine of Japan, predating the movement by centuries.",
                  "ナチュラルワインが好きなら、すでに生酒を理解している — まだ知らないだけ。哲学は同じ：最小限の介入、生きた製品、コールドチェーンへの執着、瓶ごとに変わる味。生酒は日本のナチュラルワインであり、その運動に何世紀も先行している。",
                )}
              </p>
              <p className={`text-sm leading-relaxed ${TS}`}>
                {t(
                  "The crossover pairings work beautifully: namazake with the same foods you'd pair with pét-nat or skin-contact whites. Fresh goat cheese, green salads, raw oysters, ceviche. The acidity and effervescence of nama-nama mirrors the zing of a good Beaujolais Nouveau.",
                  "クロスオーバーペアリングは美しく機能する：ペットナットやスキンコンタクト白ワインと合わせるのと同じ料理に生酒を。新鮮なシェーブルチーズ、グリーンサラダ、生牡蠣、セビーチェ。生生の酸味と発泡は良いボジョレーヌーボーの刺激を映す。",
                )}
              </p>
            </div>
            <div className={`p-6 border ${CARD_BG} ${BC}`}>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 text-(--sk-accent)">{t("Translation Table", "翻訳表")}</h3>
              <div className="space-y-3">
                {[
                  { wine: "Pét-Nat", sake: "Nama-Nama Nigori", why: t("Both fizzy, cloudy, alive", "両方泡立ち、濁り、生きている") },
                  { wine: "Beaujolais Nouveau", sake: "Hatsushibori Nama", why: t("Both celebrate the new vintage", "両方新しいヴィンテージを祝う") },
                  { wine: "Orange Wine", sake: "Yamahai Nama", why: t("Both funky, complex, polarizing", "両方ファンキー、複雑、分極的") },
                  { wine: "Skin-Contact White", sake: "Nama-Chozo Junmai", why: t("Both textured, savory, food-friendly", "両方テクスチャー、旨味、食事向き") },
                  { wine: "Vin Jaune", sake: "Koshu Nama (if you can find it)", why: t("Both oxidative, nutty, profound", "両方酸化的、ナッツ的、深遠") },
                ].map((row) => (
                  <div key={row.wine} className={`flex items-start gap-3 pb-2 border-b ${BC}`}>
                    <span className={`text-xs font-semibold shrink-0 w-28 ${TP}`}>{row.wine}</span>
                    <span className="shrink-0 text-(--sk-accent)">↔</span>
                    <div>
                      <span className={`text-xs font-semibold ${TP}`}>{row.sake}</span>
                      <p className={`text-[10px] mt-0.5 ${TS}`}>{row.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On Drinking Something Alive */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span aria-hidden="true" className="font-sk-jp text-6xl font-bold block mb-6 text-(--sk-accent)">
            生
          </span>
          <h2 className={`font-sk-serif text-2xl md:text-3xl font-bold mb-6 ${TP}`}>{t("On Drinking Something Alive", "生きたものを飲むということ")}</h2>
          <p className={`text-sm leading-loose mb-6 ${TS}`}>
            {t(
              "Every sip of namazake is an act of presence. The liquid is changing as you drink it — the enzymes working, the flavors shifting, the sake becoming something slightly different between the first pour and the last. You cannot save it for a special occasion. The special occasion is now. This is impermanence in a glass. This is ichi-go ichi-e distilled to its purest form. The sake will never taste exactly like this again. Neither will you.",
              "生酒の一口一口が存在の行為。液体は飲んでいる間に変化している — 酵素が働き、味が移り変わり、最初の一杯と最後の一杯の間で酒は少し異なるものになる。特別な機会のために取っておくことはできない。特別な機会は今。これはグラスの中の無常。これは一期一会を最も純粋な形に蒸留したもの。この酒は二度とまったく同じ味にはならない。あなたも。",
            )}
          </p>
          <div className="w-24 h-px mx-auto bg-(--sk-accent)" />
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
