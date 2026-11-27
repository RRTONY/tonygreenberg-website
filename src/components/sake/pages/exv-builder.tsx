"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";
import { exvDimensions, exvTiers, type EXVDimension } from "@/lib/content/sake/experience-data";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/EXVBuilder.tsx (2026-11-26): the 7-dimension "Soul Print"
// scorer with its live heptagon radar chart. This page used its own hex palette (gold #c9a227 /
// vermillion #c53d43 on #0d1321 / #f5f0e8), so each look's classes are written out in full below
// instead of the app's inline styles. The dimension and score colors come from the data file, so
// they stay runtime styles (the slider fill and bar widths are runtime numbers too). The app's
// <style> tag for the slider thumb is Tailwind thumb variants here.
// Changed (rule 20): each dimension's header is a real button (keyboard and screen readers can open
// the guide question; the app's whole card was a mouse-only div), and the reset button has a label.

const LOOK = {
  kintsugi: {
    gold: "#c9a227",
    page: "min-h-screen pt-20 bg-[#0d1321] text-[#e8e0d0]",
    accentText: "text-[#c9a227]",
    h1: "font-serif text-4xl md:text-6xl mt-3 mb-4",
    intro: "max-w-xl mx-auto text-[#8a8070]",
    input:
      "w-full px-4 py-3 rounded-lg text-sm transition-colors bg-white/5 border border-white/10 text-[#e8e0d0] placeholder:text-[#8a8070]",
    cardActive: "p-4 rounded-lg transition-all duration-300 cursor-pointer border bg-[rgba(201,162,39,0.15)] border-[#c9a227]",
    cardIdle: "p-4 rounded-lg transition-all duration-300 cursor-pointer border bg-transparent border-transparent",
    range:
      "w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a227] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0d1321] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c9a227] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0d1321] [&::-moz-range-thumb]:cursor-pointer",
    rangeTrack: "rgba(255,255,255,0.1)",
    tick: "text-[10px] text-[#555]",
    guideBorder: "mt-3 pt-3 border-t border-[rgba(201,162,39,0.15)]",
    guide: "text-xs italic text-[#a09880]",
    guideMore: "text-xs mt-2 text-[#666]",
    reveal:
      "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors bg-[#c9a227] text-[#0d1321]",
    resetBtn: "flex items-center justify-center px-4 py-3 rounded-lg text-sm border transition-colors border-[#c9a227] text-[#c9a227]",
    panel: "p-6 rounded-xl bg-white/3 border border-white/6",
    sub: "text-xs tracking-widest uppercase mt-1 text-[#666]",
    tierBox: "mt-6 p-4 rounded-lg text-center bg-[rgba(201,162,39,0.15)]",
    tierText: "text-xs mt-2 text-[#8a8070]",
    rowName: "text-[#a09880]",
    barTrack: "w-20 h-1 rounded-full overflow-hidden bg-white/6",
    closing: "mt-6 pt-4 border-t text-center border-[rgba(201,162,39,0.15)]",
    closingText: "text-xs italic text-[#8a8070]",
    learn: "inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full border transition-colors border-[#c9a227] text-[#c9a227]",
    gridStroke: "rgba(255,255,255,0.08)",
    axisStroke: "rgba(255,255,255,0.06)",
    dotStroke: "#0d1321",
  },
  austere: {
    gold: "#c53d43",
    page: "min-h-screen pt-20 bg-[#f5f0e8] text-[#2c2c2c]",
    accentText: "text-[#c53d43]",
    h1: "font-light text-4xl md:text-6xl mt-3 mb-4",
    intro: "max-w-xl mx-auto text-[#666]",
    input:
      "w-full px-4 py-3 rounded-lg text-sm transition-colors bg-black/4 border border-black/10 text-[#2c2c2c] placeholder:text-[#888]",
    cardActive: "p-4 rounded-lg transition-all duration-300 cursor-pointer border bg-[rgba(197,61,67,0.15)] border-[#c53d43]",
    cardIdle: "p-4 rounded-lg transition-all duration-300 cursor-pointer border bg-transparent border-transparent",
    range:
      "w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c53d43] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#f5f0e8] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c53d43] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#f5f0e8] [&::-moz-range-thumb]:cursor-pointer",
    rangeTrack: "rgba(0,0,0,0.1)",
    tick: "text-[10px] text-[#999]",
    guideBorder: "mt-3 pt-3 border-t border-[rgba(197,61,67,0.15)]",
    guide: "text-xs italic text-[#666]",
    guideMore: "text-xs mt-2 text-[#888]",
    reveal:
      "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors bg-[#c53d43] text-[#f5f0e8]",
    resetBtn: "flex items-center justify-center px-4 py-3 rounded-lg text-sm border transition-colors border-[#c53d43] text-[#c53d43]",
    panel: "p-6 rounded-xl bg-black/3 border border-black/6",
    sub: "text-xs tracking-widest uppercase mt-1 text-[#888]",
    tierBox: "mt-6 p-4 rounded-lg text-center bg-[rgba(197,61,67,0.15)]",
    tierText: "text-xs mt-2 text-[#666]",
    rowName: "text-[#555]",
    barTrack: "w-20 h-1 rounded-full overflow-hidden bg-black/6",
    closing: "mt-6 pt-4 border-t text-center border-[rgba(197,61,67,0.15)]",
    closingText: "text-xs italic text-[#666]",
    learn: "inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full border transition-colors border-[#c53d43] text-[#c53d43]",
    gridStroke: "rgba(0,0,0,0.08)",
    axisStroke: "rgba(0,0,0,0.06)",
    dotStroke: "#f5f0e8",
  },
} as const;

type Look = (typeof LOOK)[keyof typeof LOOK];

function RadarChart({ scores, dimensions, look, size = 320 }: { scores: number[]; dimensions: EXVDimension[]; look: Look; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.4;
  const levels = [2, 4, 6, 8, 10];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 7 - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  const getLevelPath = (level: number) =>
    Array.from({ length: 7 }, (_, i) => getPoint(i, level))
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z";
  const scorePath =
    scores
      .map((s, i) => {
        const p = getPoint(i, s);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-100 mx-auto" role="img" aria-label="Soul Print radar chart">
      {levels.map((level) => (
        <path key={level} d={getLevelPath(level)} fill="none" stroke={look.gridStroke} strokeWidth={level === 10 ? 1.5 : 0.5} />
      ))}
      {dimensions.map((dim, i) => {
        const p = getPoint(i, 10);
        return <line key={dim.key} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={look.axisStroke} strokeWidth={0.5} />;
      })}
      <path d={scorePath} fill={`${look.gold}20`} stroke={look.gold} strokeWidth={2} />
      {scores.map((s, i) => {
        const p = getPoint(i, s);
        return <circle key={dimensions[i]?.key ?? i} cx={p.x} cy={p.y} r={4} fill={look.gold} stroke={look.dotStroke} strokeWidth={2} />;
      })}
      {dimensions.map((dim, i) => {
        const p = getPoint(i, 12);
        return (
          <text key={dim.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={look.gold} fontSize={11} fontWeight={600}>
            {dim.kanji}
          </text>
        );
      })}
    </svg>
  );
}

const START = () => Array<number>(7).fill(5);

export function SakeExvBuilder() {
  const { t } = useLanguage();
  const { isConnoisseur } = useMode();
  const { isAustere } = useAesthetic();
  const look = isAustere ? LOOK.austere : LOOK.kintsugi;

  const [scores, setScores] = useState<number[]>(START);
  const [sakeName, setSakeName] = useState("");
  const [activeDim, setActiveDim] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totalScore = useMemo(() => scores.reduce((a, b) => a + b, 0), [scores]);
  const tier = useMemo(
    () => exvTiers.find((x) => totalScore >= x.range[0] && totalScore <= x.range[1]) || exvTiers[5],
    [totalScore],
  );

  const updateScore = (index: number, value: number) => setScores((prev) => prev.map((s, i) => (i === index ? value : s)));
  const reset = () => {
    setScores(START());
    setSakeName("");
    setShowResult(false);
    setActiveDim(null);
  };
  const toggle = (i: number) => setActiveDim((cur) => (cur === i ? null : i));

  return (
    <div className={look.page}>
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container">
          <span className={`text-xs tracking-[0.3em] uppercase ${look.accentText}`}>{t("Interactive Tool", "インタラクティブツール")}</span>
          <h1 className={look.h1}>
            {t("Build Your", "あなたの")} <span className={look.accentText}>{t("Soul Print", "魂の指紋")}</span>
          </h1>
          <p className={look.intro}>
            {t(
              "Score any sake across 7 emotional dimensions. Watch your soul print emerge. No two are alike.",
              "7つの感情的次元で酒を評価する。あなたの魂の指紋が現れるのを見る。同じものは二つとない。",
            )}
          </p>
        </div>
      </section>

      <div className="container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: sliders */}
          <div>
            <div className="mb-8">
              <label htmlFor="exv-sake-name" className={`text-xs tracking-[0.2em] uppercase mb-2 block ${look.accentText}`}>
                {t("Sake Name (optional)", "酒の名前（任意）")}
              </label>
              <input
                id="exv-sake-name"
                type="text"
                value={sakeName}
                onChange={(e) => setSakeName(e.target.value)}
                placeholder={t("e.g., Dassai 23", "例：獺祭 二割三分")}
                className={look.input}
              />
            </div>

            <div className="space-y-6">
              {exvDimensions.map((dim, i) => {
                const open = activeDim === i;
                return (
                  <div key={dim.key} className={open ? look.cardActive : look.cardIdle} onClick={() => toggle(i)}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(i);
                      }}
                      className="w-full flex items-center justify-between mb-2 text-left min-h-0"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl font-serif" style={{ color: dim.color }}>
                          {dim.kanji}
                        </span>
                        <span className="font-medium text-sm">{t(dim.name, dim.nameJa)}</span>
                      </span>
                      <span className={`text-lg font-mono font-bold ${look.accentText}`}>{scores[i]}</span>
                    </button>

                    <div className="relative mt-2">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={scores[i]}
                        aria-label={t(dim.name, dim.nameJa)}
                        onChange={(e) => updateScore(i, parseInt(e.target.value, 10))}
                        onClick={(e) => e.stopPropagation()}
                        className={look.range}
                        style={{
                          background: `linear-gradient(to right, ${dim.color} 0%, ${dim.color} ${scores[i] * 10}%, ${look.rangeTrack} ${scores[i] * 10}%, ${look.rangeTrack} 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className={look.tick}>{t(dim.lowLabel, dim.lowLabelJa)}</span>
                        <span className={look.tick}>{t(dim.highLabel, dim.highLabelJa)}</span>
                      </div>
                    </div>

                    {open && (
                      <div className={look.guideBorder}>
                        <p className={look.guide}>{t(dim.guideQuestion, dim.guideQuestionJa)}</p>
                        {isConnoisseur && <p className={look.guideMore}>{t(dim.description, dim.descriptionJa)}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setShowResult(true)} className={look.reveal}>
                <Sparkles aria-hidden="true" size={16} />
                {t("Reveal Soul Print", "魂の指紋を表示")}
              </button>
              <button type="button" onClick={reset} aria-label={t("Reset", "リセット")} className={look.resetBtn}>
                <RotateCcw aria-hidden="true" size={16} />
              </button>
            </div>
          </div>

          {/* Right: radar + result */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className={look.panel}>
              {sakeName && (
                <div className="text-center mb-4">
                  <span className={`font-serif text-xl ${look.accentText}`}>{sakeName}</span>
                </div>
              )}

              <RadarChart scores={scores} dimensions={exvDimensions} look={look} />

              <div className="text-center mt-6">
                <div className={`text-5xl font-serif font-bold ${look.accentText}`}>{totalScore}</div>
                <div className={look.sub}>{t("of 70 possible", "/70")}</div>
              </div>

              {showResult && (
                <div className={look.tierBox}>
                  <div className="text-3xl font-serif mb-1" style={{ color: tier.color }}>
                    {tier.kanji}
                  </div>
                  <div className="font-medium" style={{ color: tier.color }}>
                    {tier.name} — {tier.nameJa}
                  </div>
                  <p className={look.tierText}>{t(tier.description, tier.descriptionJa)}</p>
                </div>
              )}

              {showResult && (
                <div className="mt-6 space-y-2">
                  {exvDimensions.map((dim, i) => (
                    <div key={dim.key} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span style={{ color: dim.color }}>{dim.kanji}</span>
                        <span className={look.rowName}>{t(dim.name, dim.nameJa)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={look.barTrack}>
                          <div className="h-full rounded-full" style={{ width: `${scores[i] * 10}%`, background: dim.color }} />
                        </div>
                        <span className="font-mono w-4 text-right" style={{ color: dim.color }}>
                          {scores[i]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showResult && (
                <div className={look.closing}>
                  <p className={look.closingText}>
                    {t(
                      "The shape is the rating. No two soul prints are identical. This is yours.",
                      "形が評価。二つと同じ魂の指紋はない。これがあなたのもの。",
                    )}
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <Link href={sk("/exv")} className={look.learn}>
                      {t("Learn the EXV System", "EXVシステムを学ぶ")} <ArrowRight aria-hidden="true" size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
