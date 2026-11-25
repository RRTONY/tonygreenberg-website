"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Amphora,
  ArrowRight,
  Atom,
  Beer,
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
  FlaskConical,
  GlassWater,
  Heart,
  Moon,
  Sparkles,
  Wine,
  Zap,
} from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { sk } from "@/lib/content/sake/nav";
import {
  alcoholComparisons,
  alteredStateAspects,
  aminoAcids,
  bioactiveCompounds,
  healthBenefits,
  longevityFacts,
  type AminoAcid,
  type BioactiveCompound,
} from "@/lib/content/sake/alchemy-data";

// Ported from the Sake Manus app's client/src/pages/LiquidAlchemy.tsx (2026-11-26): the science
// page (longevity stats, amino-acid bars, bioactive compounds, the seven benefits, the comparison
// table, 酔い and the proverb). The page had its own palette (#c9a227 gold on #0d1321, #c53d43 on
// paper in Austere) as inline styles; it's two literal class sets below (TONES). Changed:
// - The floating molecules were placed with Math.random() during render, which gives the server and
//   the browser different pages; their sizes and positions now come from a fixed seed (same look).
// - The clickable cards are buttons (keyboard and screen reader access) and say if they're open.
// - The table's 🍶🍷🍺🥃 header emoji are lucide icons (rule 18); the compound glyphs (✦ ☀ ♥ ◎ ...)
//   are typographic symbols in the data and stay, drawn as text, not color emoji.

type Tone = {
  page: string;
  gold: string;
  goldFill: string;
  goldBorder: string;
  dimBg: string;
  dimBorder: string;
  midBorder: string;
  idleCard: string;
  idleBorder: string;
  track: string;
  muted: string;
  muted2: string;
  body: string;
  bodySoft: string;
  faint: string;
  research: string;
  onGold: string;
  heroGlow: string;
  heading: string;
  quote: string;
};

const TONES: Record<"kintsugi" | "austere", Tone> = {
  kintsugi: {
    page: "bg-[#0d1321] text-[#e8e0d0]",
    gold: "text-[#c9a227]",
    goldFill: "bg-[#c9a227]",
    goldBorder: "border-[#c9a227]",
    dimBg: "bg-[#c9a227]/15",
    dimBorder: "border-[#c9a227]/15",
    midBorder: "border-[#c9a227]/30",
    idleCard: "bg-white/3",
    idleBorder: "border-white/6",
    track: "bg-white/6",
    muted: "text-[#8a8070]",
    muted2: "text-[#666]",
    body: "text-[#a09880]",
    bodySoft: "text-[#c0b8a8]",
    faint: "text-[#555]",
    research: "bg-black/20",
    onGold: "text-[#0d1321]",
    heroGlow: "bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.08)_0%,transparent_70%)]",
    heading: "font-serif",
    quote: "font-serif",
  },
  austere: {
    page: "bg-[#f5f0e8] text-[#2c2c2c]",
    gold: "text-[#c53d43]",
    goldFill: "bg-[#c53d43]",
    goldBorder: "border-[#c53d43]",
    dimBg: "bg-[#c53d43]/15",
    dimBorder: "border-[#c53d43]/15",
    midBorder: "border-[#c53d43]/30",
    idleCard: "bg-black/3",
    idleBorder: "border-black/6",
    track: "bg-black/6",
    muted: "text-[#666]",
    muted2: "text-[#888]",
    body: "text-[#555]",
    bodySoft: "text-[#555]",
    faint: "text-[#999]",
    research: "bg-black/4",
    onGold: "text-[#f5f0e8]",
    heroGlow: "bg-[radial-gradient(ellipse_at_center,rgba(197,61,67,0.08)_0%,transparent_70%)]",
    heading: "font-light",
    quote: "font-light",
  },
};

const CATEGORY_CHIP: Record<string, string> = {
  essential: "bg-[rgba(34,197,94,0.15)] text-[#22c55e]",
  conditional: "bg-[rgba(251,191,36,0.15)] text-[#fbbf24]",
};
const CATEGORY_CHIP_OTHER = "bg-[rgba(148,163,184,0.15)] text-[#94a3b8]";

const benefitIcons = [Sparkles, Moon, FlaskConical, Heart, Brain, Zap, Eye];
const MAX_AMINO = 60;

/** The app's floating molecules, from a fixed seed instead of Math.random() (same server and browser). */
const MOLECULES = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: 12 }, () => ({
    size: 4 + rand() * 8,
    opacity: 0.15 + rand() * 0.2,
    left: rand() * 100,
    top: rand() * 100,
    delay: rand() * 5,
    duration: 3 + rand() * 4,
  }));
})();

const upper = (amount: string) => parseFloat(amount.split("-")[1] || amount);

export function SakeLiquidAlchemy() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const c = TONES[isAustere ? "austere" : "kintsugi"];

  const [selectedAmino, setSelectedAmino] = useState<AminoAcid | null>(null);
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const [selectedCompound, setSelectedCompound] = useState<BioactiveCompound | null>(null);
  const [showAllComparisons, setShowAllComparisons] = useState(false);

  return (
    <div className={`min-h-screen ${c.page}`}>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 ${c.heroGlow}`} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {MOLECULES.map((m, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-pulse ${c.goldFill}`}
              style={{
                width: `${m.size}px`,
                height: `${m.size}px`,
                opacity: m.opacity,
                left: `${m.left}%`,
                top: `${m.top}%`,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.duration}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Atom aria-hidden="true" size={28} className={c.gold} />
            <span className={`text-sm tracking-[0.4em] uppercase ${c.gold}`}>{t("The Science of Sake", "酒の科学")}</span>
            <Atom aria-hidden="true" size={28} className={c.gold} />
          </div>
          <h1 className={`${c.heading} text-5xl md:text-7xl mb-6`}>
            {t("Liquid", "液体の")} <span className={c.gold}>{t("Alchemy", "錬金術")}</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${c.body}`}>
            {t(
              "Why sake is the most nutritionally complex, biochemically beneficial, and consciousness-friendly alcohol on earth. The case for sake as the supreme liquid for altered states.",
              "なぜ酒が地球上で最も栄養的に複雑で、生化学的に有益で、意識に優しいアルコールなのか。変性意識のための最高の液体としての酒の主張。",
            )}
          </p>
          <div className={`mt-8 flex flex-wrap items-center justify-center gap-2 text-xs tracking-widest uppercase ${c.gold}`}>
            <span>酒は百薬の長</span>
            <span className="mx-2">—</span>
            <span>{t('"Sake surpasses any medicine"', "「酒は百薬の長」")}</span>
          </div>
        </div>
      </section>

      {/* Longevity Stats Bar */}
      <section className={`py-12 border-y ${c.dimBorder}`}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {longevityFacts.map((fact) => (
              <div key={fact.stat} className="text-center">
                <div className={`text-2xl md:text-3xl font-serif font-bold mb-1 ${c.gold}`}>{fact.stat}</div>
                <div className={`text-xs leading-tight ${c.muted}`}>{t(fact.context, fact.contextJa)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amino Acid System */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <span className={`text-xs tracking-[0.3em] uppercase ${c.gold}`}>{t("The Amino Acid Advantage", "アミノ酸の優位性")}</span>
            <h2 className={`${c.heading} text-3xl md:text-4xl mt-3`}>{t("10x More Than Wine", "ワインの10倍")}</h2>
            <p className={`mt-4 max-w-2xl mx-auto ${c.muted}`}>
              {t(
                "Sake contains over 20 free amino acids — 10 times more than wine, 20 times more than beer, and infinitely more than spirits. Each one does something specific in your body.",
                "酒は20以上の遊離アミノ酸を含む — ワインの10倍、ビールの20倍、蒸留酒とは比較にならない。それぞれが体内で特定の役割を果たす。",
              )}
            </p>
          </div>

          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aminoAcids.map((aa) => {
                const isSelected = selectedAmino?.symbol === aa.symbol;
                const bars = [
                  { label: "Sake", value: upper(aa.sakeAmount), fill: `${c.goldFill} transition-all duration-700` },
                  { label: "Wine", value: upper(aa.wineAmount), fill: "bg-[#8b5cf6]" },
                  { label: "Beer", value: upper(aa.beerAmount), fill: "bg-[#f59e0b]" },
                ];
                return (
                  <button
                    type="button"
                    key={aa.symbol}
                    aria-expanded={isSelected}
                    onClick={() => setSelectedAmino(isSelected ? null : aa)}
                    className={
                      isSelected
                        ? `block w-full text-left p-4 rounded-lg transition-all duration-300 border ${c.dimBg} ${c.goldBorder}`
                        : `block w-full text-left p-4 rounded-lg transition-all duration-300 border border-transparent ${c.idleCard}`
                    }
                  >
                    <span className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-3">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${c.dimBg} ${c.gold}`}>{aa.symbol}</span>
                        <span className="font-medium text-sm">{t(aa.name, aa.nameJa)}</span>
                      </span>
                      <span className={`text-xs ${c.gold}`}>{aa.sakeAmount} mg</span>
                    </span>
                    <span className="block space-y-1">
                      {bars.map((bar) => (
                        <span key={bar.label} className="flex items-center gap-2">
                          <span className={`text-[10px] w-12 ${c.muted2}`}>{bar.label}</span>
                          <span className={`flex-1 h-2 rounded-full overflow-hidden ${c.track}`}>
                            <span
                              className={`block h-full rounded-full ${bar.fill}`}
                              style={{ width: `${(bar.value / MAX_AMINO) * 100}%` }}
                            />
                          </span>
                        </span>
                      ))}
                    </span>
                    {isSelected && (
                      <span className={`block mt-4 pt-4 border-t ${c.dimBorder}`}>
                        <span className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${CATEGORY_CHIP[aa.category] ?? CATEGORY_CHIP_OTHER}`}>{aa.category}</span>
                          <span className={`text-xs ${c.gold}`}>{t(aa.bodySystem, aa.bodySystemJa)}</span>
                        </span>
                        <span className={`block text-sm mb-2 ${c.body}`}>{t(aa.role, aa.roleJa)}</span>
                        <span className={`block text-sm ${c.gold}`}>{t(aa.benefit, aa.benefitJa)}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bioactive Compounds */}
      <section className={`py-20 border-t ${c.dimBorder}`}>
        <div className="container">
          <div className="text-center mb-16">
            <span className={`text-xs tracking-[0.3em] uppercase ${c.gold}`}>{t("Beyond Amino Acids", "アミノ酸を超えて")}</span>
            <h2 className={`${c.heading} text-3xl md:text-4xl mt-3`}>{t("The Bioactive Arsenal", "生理活性の武器庫")}</h2>
            <p className={`mt-4 max-w-2xl mx-auto ${c.muted}`}>
              {t(
                "Peptides, acids, and compounds that exist in sake and nowhere else. Each one a pharmaceutical-grade molecule delivered in a ceramic cup.",
                "ペプチド、酸、そして酒にしか存在しない化合物。それぞれがセラミックカップで届けられる医薬品グレードの分子。",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bioactiveCompounds.map((compound) => {
              const isSelected = selectedCompound?.name === compound.name;
              return (
                <button
                  type="button"
                  key={compound.name}
                  aria-expanded={isSelected}
                  onClick={() => setSelectedCompound(isSelected ? null : compound)}
                  className={
                    isSelected
                      ? `block w-full text-left p-5 rounded-lg transition-all duration-300 border ${c.dimBg} ${c.goldBorder}`
                      : `block w-full text-left p-5 rounded-lg transition-all duration-300 border ${c.idleCard} ${c.idleBorder}`
                  }
                >
                  <span aria-hidden="true" className="block text-2xl mb-3 [font-variant-emoji:text]">
                    {compound.icon}
                  </span>
                  <span className="block font-medium text-sm mb-1">{t(compound.name, compound.nameJa)}</span>
                  <span className={`block text-xs mb-2 ${c.muted2}`}>{t(compound.source, compound.sourceJa)}</span>
                  <span className={`block text-xs ${c.gold}`}>{t(compound.effect, compound.effectJa)}</span>
                  {isSelected && isConnoisseur && (
                    <span className={`block mt-3 pt-3 border-t ${c.dimBorder}`}>
                      <span className={`block text-xs leading-relaxed ${c.body}`}>{t(compound.science, compound.scienceJa)}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Seven Benefits */}
      <section className={`py-20 border-t ${c.dimBorder}`}>
        <div className="container">
          <div className="text-center mb-16">
            <span className={`text-xs tracking-[0.3em] uppercase ${c.gold}`}>{t("The Seven Gifts", "七つの恩恵")}</span>
            <h2 className={`${c.heading} text-3xl md:text-4xl mt-3`}>{t("How Sake Benefits You", "酒があなたにもたらすもの")}</h2>
          </div>

          <div className="space-y-4">
            {healthBenefits.map((benefit, i) => {
              const isExpanded = expandedBenefit === i;
              const Icon = benefitIcons[i] || Sparkles;
              const panelId = `alchemy-benefit-${i}`;
              return (
                <div
                  key={benefit.title}
                  className={
                    isExpanded
                      ? `rounded-lg overflow-hidden transition-all duration-500 border ${c.dimBg} ${c.midBorder}`
                      : `rounded-lg overflow-hidden transition-all duration-500 border border-transparent ${c.idleCard}`
                  }
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setExpandedBenefit(isExpanded ? null : i)}
                    className="w-full p-6 flex items-center gap-4 text-left"
                  >
                    <span className={`size-10 rounded-full flex items-center justify-center shrink-0 ${c.dimBg}`}>
                      <Icon aria-hidden="true" size={18} className={c.gold} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-serif text-lg">{t(benefit.title, benefit.titleJa)}</span>
                      <span className={`block text-sm ${c.muted}`}>{t(benefit.subtitle, benefit.subtitleJa)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      {benefit.compounds.slice(0, 2).map((compound) => (
                        <span key={compound} className={`text-[10px] px-2 py-0.5 rounded hidden md:inline ${c.dimBg} ${c.gold}`}>
                          {compound}
                        </span>
                      ))}
                      {isExpanded ? (
                        <ChevronUp aria-hidden="true" size={18} className={c.gold} />
                      ) : (
                        <ChevronDown aria-hidden="true" size={18} className={c.gold} />
                      )}
                    </span>
                  </button>
                  <div id={panelId} hidden={!isExpanded} className="px-6 pb-6 pt-0">
                    <div className="pl-14">
                      <p className={`text-sm leading-relaxed mb-4 ${c.bodySoft}`}>{t(benefit.description, benefit.descriptionJa)}</p>
                      {isConnoisseur && (
                        <div className={`p-3 rounded-lg text-xs ${c.research}`}>
                          <span className={`font-mono ${c.gold}`}>RESEARCH: </span>
                          <span className={c.muted}>{t(benefit.science, benefit.scienceJa)}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {benefit.compounds.map((compound) => (
                          <span key={compound} className={`text-[10px] px-2 py-1 rounded ${c.dimBg} ${c.gold}`}>
                            {compound}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alcohol Comparison Table */}
      <section className={`py-20 border-t ${c.dimBorder}`}>
        <div className="container">
          <div className="text-center mb-16">
            <span className={`text-xs tracking-[0.3em] uppercase ${c.gold}`}>{t("The Comparison", "比較")}</span>
            <h2 className={`${c.heading} text-3xl md:text-4xl mt-3`}>{t("Sake vs. Everything Else", "酒 vs. 他のすべて")}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${c.midBorder}`}>
                  <th className={`text-left py-3 px-4 font-medium ${c.gold}`}>{t("Category", "カテゴリー")}</th>
                  <th className={`text-center py-3 px-4 font-bold ${c.gold}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Amphora aria-hidden="true" className="size-[1em]" />
                      {t("Sake", "酒")}
                    </span>
                  </th>
                  <th className={`text-center py-3 px-4 ${c.muted2}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Wine aria-hidden="true" className="size-[1em]" />
                      {t("Wine", "ワイン")}
                    </span>
                  </th>
                  <th className={`text-center py-3 px-4 ${c.muted2}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Beer aria-hidden="true" className="size-[1em]" />
                      {t("Beer", "ビール")}
                    </span>
                  </th>
                  <th className={`text-center py-3 px-4 ${c.muted2}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <GlassWater aria-hidden="true" className="size-[1em]" />
                      {t("Spirits", "蒸留酒")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(showAllComparisons ? alcoholComparisons : alcoholComparisons.slice(0, 6)).map((row) => (
                  <tr key={row.category} className={`border-b ${c.idleBorder}`}>
                    <td className="py-3 px-4 font-medium text-xs">{t(row.category, row.categoryJa)}</td>
                    <td className={row.sakeWins ? `py-3 px-4 text-center text-xs font-medium ${c.gold}` : "py-3 px-4 text-center text-xs font-medium"}>
                      {row.sake} {row.sakeWins && "✦"}
                    </td>
                    <td className={`py-3 px-4 text-center text-xs ${c.muted2}`}>{row.wine}</td>
                    <td className={`py-3 px-4 text-center text-xs ${c.muted2}`}>{row.beer}</td>
                    <td className={`py-3 px-4 text-center text-xs ${c.muted2}`}>{row.spirits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllComparisons && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setShowAllComparisons(true)}
                className={`text-sm px-6 py-2 rounded-full border transition-colors ${c.goldBorder} ${c.gold}`}
              >
                {t("Show All Comparisons", "すべての比較を表示")}
              </button>
            </div>
          )}
          <div className={`mt-8 p-6 rounded-lg text-center border ${c.dimBg} ${c.midBorder}`}>
            <p className={`font-serif text-lg ${c.gold}`}>
              {t(
                "Sake wins 8 out of 10 categories. The two it doesn't win (calories, sugar) are marginal differences. In every category that matters for your body and mind — sake is supreme.",
                "酒は10カテゴリー中8つで勝利。勝てない2つ（カロリー、糖質）はわずかな差。体と心にとって重要なすべてのカテゴリーで — 酒が最高。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Altered States */}
      <section className={`py-20 border-t ${c.dimBorder}`}>
        <div className="container">
          <div className="text-center mb-16">
            <span className={`text-xs tracking-[0.3em] uppercase ${c.gold}`}>{t("The Altered State", "変性意識")}</span>
            <h2 className={`${c.heading} text-3xl md:text-4xl mt-3`}>
              {t("酔い — The Art of Harmonious Intoxication", "酔い — 調和のとれた酩酊の芸術")}
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${c.muted}`}>
              {t(
                "Every alcohol alters consciousness. Only sake does it with grace. The Japanese concept of 酔い (yoi) describes a specific quality of intoxication — warm, present, connected, clear. Not a failure state. An art form.",
                "すべてのアルコールは意識を変える。優雅にそれを行うのは酒だけ。日本の「酔い」の概念は、酩酊の特定の質を表す — 温かく、現在に存在し、つながり、明晰。失敗状態ではない。芸術形式。",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {alteredStateAspects.map((aspect, i) => (
              <div key={aspect.title} className={`p-6 rounded-lg text-center border ${c.idleCard} ${c.idleBorder}`}>
                <div className={`text-3xl font-serif mb-3 ${c.gold}`}>{["温", "明", "在", "結", "復"][i]}</div>
                <h3 className="font-medium text-sm mb-2">{t(aspect.title, aspect.titleJa)}</h3>
                <p className={`text-xs leading-relaxed mb-3 ${c.muted}`}>{t(aspect.description, aspect.descriptionJa)}</p>
                {isConnoisseur && (
                  <p className={`text-[10px] mt-2 pt-2 border-t ${c.dimBorder} ${c.gold}`}>{t(aspect.sakeAdvantage, aspect.sakeAdvantageJa)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Proverb */}
      <section className={`py-20 border-t ${c.dimBorder}`}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`text-6xl md:text-8xl font-serif mb-8 ${c.gold}`}>酒は百薬の長</div>
            <p className={`text-lg md:text-xl ${c.quote} mb-4`}>{t('"Sake surpasses any medicine"', "「酒は百薬の長」")}</p>
            <p className={`text-sm max-w-xl mx-auto leading-relaxed ${c.muted}`}>
              {t(
                "This isn't marketing. It's a proverb that has survived centuries because the people who drink sake — moderately, mindfully, in community — live longer, feel better, and age more gracefully than those who don't. The science is finally catching up to what Japan has known all along.",
                "これはマーケティングではない。酒を飲む人々 — 適度に、意識的に、コミュニティの中で — がそうでない人よりも長生きし、気分が良く、より優雅に年を重ねるために、何世紀も生き残ってきたことわざだ。科学はついに日本がずっと知っていたことに追いつきつつある。",
              )}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={sk("/namazake")}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-colors ${c.goldFill} ${c.onGold}`}
              >
                {t("Explore Namazake — Living Sake", "生酒を探求する")} <ArrowRight aria-hidden="true" size={14} />
              </Link>
              <Link
                href={sk("/exv")}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm border transition-colors ${c.goldBorder} ${c.gold}`}
              >
                {t("The EXV Rating System", "EXV評価システム")} <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className={`py-8 border-t ${c.dimBorder}`}>
        <div className="container">
          <p className={`text-[10px] text-center max-w-2xl mx-auto leading-relaxed ${c.faint}`}>
            {t(
              "This page presents scientific research on sake's biochemical properties for educational purposes. It is not medical advice. Excessive alcohol consumption is harmful regardless of the type. The benefits described apply to moderate consumption. Always drink responsibly.",
              "このページは教育目的で酒の生化学的特性に関する科学的研究を紹介しています。医学的アドバイスではありません。過度のアルコール摂取は種類に関係なく有害です。記載された利点は適度な摂取に適用されます。常に責任を持って飲酒してください。",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
