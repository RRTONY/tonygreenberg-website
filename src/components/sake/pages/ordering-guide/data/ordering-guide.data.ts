// Copy and look tokens for the Ordering Guide (/sake/ordering-guide), word for word from the Sake
// Manus app's client/src/pages/OrderingGuide.tsx. Each string is an [English, Japanese] pair for
// the app's t(). The questions themselves are the app's `orderingGuideQuestions`
// (src/lib/content/sake/supply-chain-engine.ts).

export type Copy = readonly [en: string, ja: string];

export const orderingGuideData = {
  hero: {
    eyebrow: ["Navigate the Sake World", "日本酒の世界を航海する"],
    titleLead: ["The Ordering", "注文の"],
    titleGold: ["Guide", "ガイド"],
    intro: [
      "Five questions. Your perfect sake. We'll match your mood, palate, budget, and carbon consciousness to the bottles that deserve your attention — and tell you which restaurants to trust.",
      "5つの質問。あなたの完璧な酒。気分、味覚、予算、炭素意識をあなたの注目に値する瓶にマッチング — そして信頼すべきレストランを教える。",
    ],
  },
  integrity: {
    title: ["Restaurant Integrity", "レストランの誠実度"],
    intro: [
      "Some restaurants use sake to educate and delight. Others use it to build margin. Here's how to tell the difference before you sit down.",
      "あるレストランは酒で教育し喜ばせる。他は利益を築くために使う。座る前にその違いを見分ける方法。",
    ],
    markup: ["markup", "マークアップ"],
    greenFlags: ["Green Flags", "グリーンフラグ"],
    redFlags: ["Red Flags", "レッドフラグ"],
    examples: ["Examples:", "例:"],
  },
  guide: {
    title: ["Find Your Sake", "あなたの酒を見つける"],
    intro: [
      "Five questions. We'll map your preferences to the bottles that match — sorted from lowest to highest carbon footprint, with full supply chain transparency.",
      "5つの質問。あなたの好みにマッチする瓶をマッピング — 最低から最高のカーボンフットプリント順、完全なサプライチェーン透明性付き。",
    ],
  },
  intro: {
    title: ["What Should You Drink Tonight?", "今夜何を飲むべき？"],
    body: [
      "Five questions about your mood, palate, budget, and values. We'll match you to the sake that deserves your attention — and show you exactly where every dollar goes.",
      "気分、味覚、予算、価値観について5つの質問。あなたの注目に値する酒にマッチング — すべてのドルの行き先を正確に表示。",
    ],
    begin: ["Begin", "始める"],
  },
  questions: {
    lowCarbon: ["Low carbon path", "低炭素パス"],
    moderateCarbon: ["Moderate carbon", "中程度の炭素"],
    higherCarbon: ["Higher carbon", "より高い炭素"],
  },
  result: {
    title: ["Your Sake Path", "あなたの酒の道"],
    startOver: ["Start Over", "やり直す"],
    consciousness: ["Your Carbon Consciousness", "あなたの炭素意識"],
    ecoWarrior: ["Eco-Warrior", "エコ戦士"],
    conscious: ["Conscious", "意識的"],
    experienceFirst: ["Experience-First", "体験優先"],
    usHeading: ["Lowest Carbon — American-Brewed", "最低炭素 — アメリカ醸造"],
    japanHeading: ["From Japan — Sorted by Carbon Footprint", "日本から — カーボンフットプリント順"],
    retail: ["retail", "小売"],
    integrity: ["integrity", "誠実度"],
    viewAndBuy: ["View & Buy", "詳細・購入"],
    findRetailer: ["Find Retailer", "販売店"],
    dollarMap: ["Dollar Map", "ドルマップ"],
    findRetailersNearYou: ["Find Retailers Near You", "近くの販売店を探す"],
    setDealAlerts: ["Set Deal Alerts", "セールアラートを設定"],
    dollarMaps: ["Dollar Maps", "ドルマップ"],
    qprRankings: ["QPR Rankings", "QPRランキング"],
  },
} as const satisfies Record<string, Record<string, Copy>>;

/** The page's own look tokens (OrderingGuide.tsx), full literal strings per look. */
export type GuideTone = {
  gold: string;
  goldHover: string;
  groupGoldHover: string;
  goldBg: string;
  goldBorder: string;
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textMuted: string;
  pageBg: string;
  optionBg: string;
  progressDone: string;
  progressNow: string;
  progressTodo: string;
};

export const KINTSUGI_TONE: GuideTone = {
  gold: "text-[#c9a227]",
  goldHover: "hover:text-[#c9a227]",
  groupGoldHover: "group-hover:text-[#c9a227]",
  goldBg: "bg-[#c9a227]/10",
  goldBorder: "border-[#c9a227]/30",
  cardBg: "bg-[#0d1321]/80",
  cardBorder: "border-[#1a2035]",
  textMain: "text-[#e8e2d6]",
  textMuted: "text-[#e8e2d6]/60",
  pageBg: "bg-[#0a0e1a]",
  optionBg: "bg-[oklch(0.12_0.025_270)]",
  progressDone: "bg-[#c9a227]",
  progressNow: "bg-[#c9a227]/50",
  progressTodo: "bg-white/10",
};

export const AUSTERE_TONE: GuideTone = {
  gold: "text-red-800",
  goldHover: "hover:text-red-800",
  groupGoldHover: "group-hover:text-red-800",
  goldBg: "bg-red-800/10",
  goldBorder: "border-red-800/30",
  cardBg: "bg-stone-100",
  cardBorder: "border-stone-300",
  textMain: "text-stone-900",
  textMuted: "text-stone-600",
  pageBg: "bg-stone-50",
  optionBg: "bg-[oklch(0.93_0.006_80)]",
  progressDone: "bg-red-800",
  progressNow: "bg-red-800/50",
  progressTodo: "bg-stone-300",
};

/** Integrity score colors (green ≥ 80, amber ≥ 50, red below), as the app computed them. */
export function integrityClasses(score: number) {
  if (score >= 80)
    return { text: "text-[#22c55e]", ring: "border-[#22c55e] text-[#22c55e]", chip: "text-[#22c55e] border-[#22c55e]/25 bg-[#22c55e]/6" };
  if (score >= 50)
    return { text: "text-[#eab308]", ring: "border-[#eab308] text-[#eab308]", chip: "text-[#eab308] border-[#eab308]/25 bg-[#eab308]/6" };
  return { text: "text-[#ef4444]", ring: "border-[#ef4444] text-[#ef4444]", chip: "text-[#ef4444] border-[#ef4444]/25 bg-[#ef4444]/6" };
}
