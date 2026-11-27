import { BookOpen, Cherry, Flame, Mountain, type LucideIcon } from "lucide-react";

// The Sake app's SommelierCard quiz questions and page copy (client/src/pages/SommelierCard.tsx),
// word for word, each as [English, Japanese] for useLanguage().t. The four profiles themselves
// (name, phrase, preferences, top bottles) are the app's `sommelierProfiles` in
// src/lib/content/sake/qpr-data.ts; their emoji icons (🏔️ 🌋 🍑 📚) are lucide icons here (rule 18).

export type ProfileId = "purist" | "adventurer" | "hedonist" | "scholar";
export type Pair = readonly [en: string, ja: string];

export type QuizAnswerOption = { id: string; text: Pair; profile: ProfileId };
export type QuizQuestion = { id: number; text: Pair; answers: QuizAnswerOption[] };

export const profileIcons: Record<string, LucideIcon> = {
  purist: Mountain,
  adventurer: Flame,
  hedonist: Cherry,
  scholar: BookOpen,
};

export const sommelierCardData = {
  questions: [
    {
      id: 1,
      text: ["You're at a restaurant. What do you reach for first?", "レストランにいます。最初に何に手を伸ばす？"],
      answers: [
        { id: "a", text: ["The wine list — something crisp and mineral", "ワインリスト — キレのあるミネラル系"], profile: "purist" },
        { id: "b", text: ["Whatever the chef recommends — surprise me", "シェフのおすすめ — 驚かせて"], profile: "adventurer" },
        { id: "c", text: ["A cocktail — something beautiful and aromatic", "カクテル — 美しく芳醇なもの"], profile: "hedonist" },
        { id: "d", text: ["I ask about the origin and production method", "産地と製法について聞く"], profile: "scholar" },
      ],
    },
    {
      id: 2,
      text: ["Which word resonates most with how you experience flavor?", "味わいの体験に最も共鳴する言葉は？"],
      answers: [
        { id: "a", text: ["Precision", "精密"], profile: "purist" },
        { id: "b", text: ["Chaos", "混沌"], profile: "adventurer" },
        { id: "c", text: ["Pleasure", "快楽"], profile: "hedonist" },
        { id: "d", text: ["Understanding", "理解"], profile: "scholar" },
      ],
    },
    {
      id: 3,
      text: ["Your ideal sake temperature?", "理想の日本酒の温度は？"],
      answers: [
        { id: "a", text: ["Perfectly chilled — like a mountain stream", "完璧に冷やした — 山の渓流のように"], profile: "purist" },
        { id: "b", text: ["Warm — I want to feel the rice and earth", "温かい — 米と大地を感じたい"], profile: "adventurer" },
        { id: "c", text: ["Ice cold — maximum refreshment", "キンキンに冷やした — 最大のリフレッシュ"], profile: "hedonist" },
        { id: "d", text: ["Depends on the style — each sake has its ideal point", "スタイルによる — 各酒に理想の温度がある"], profile: "scholar" },
      ],
    },
    {
      id: 4,
      text: ["You find a sake you've never heard of. Your reaction?", "聞いたことのない酒を見つけた。あなたの反応は？"],
      answers: [
        { id: "a", text: ["Check the specs first — polish ratio, SMV, acidity", "まずスペックを確認 — 精米歩合、日本酒度、酸度"], profile: "purist" },
        { id: "b", text: ["Order it immediately — the unknown is the point", "すぐに注文 — 未知こそが目的"], profile: "adventurer" },
        { id: "c", text: ["Look at the label design — if it's beautiful, I'm in", "ラベルデザインを見る — 美しければ、飲む"], profile: "hedonist" },
        { id: "d", text: ["Research the brewery and prefecture on my phone", "スマホで蔵元と県を調べる"], profile: "scholar" },
      ],
    },
    {
      id: 5,
      text: ["What matters most in a sake experience?", "日本酒体験で最も大切なことは？"],
      answers: [
        { id: "a", text: ["Balance and finish — the aftertaste tells the truth", "バランスと余韻 — 後味が真実を語る"], profile: "purist" },
        { id: "b", text: ["Uniqueness — I want something I've never tasted before", "独自性 — 今まで味わったことのないものが欲しい"], profile: "adventurer" },
        { id: "c", text: ["Aroma — the first smell should make me close my eyes", "香り — 最初の匂いで目を閉じたくなるもの"], profile: "hedonist" },
        { id: "d", text: ["Story — I want to taste the place and the people", "物語 — 場所と人を味わいたい"], profile: "scholar" },
      ],
    },
  ] satisfies QuizQuestion[],
  copy: {
    eyebrow: ["Your Sake Identity", "あなたの酒のアイデンティティ"],
    titleA: ["Sommelier", "ソムリエ"],
    titleB: ["Card", "カード"],
    intro: [
      "Discover your sake personality. Get a phrase to tell any sommelier exactly what you want — in English and Japanese.",
      "自分の酒の個性を発見。ソムリエに正確に何が欲しいか伝えるフレーズを — 英語と日本語で。",
    ],
    brand: ["Sake for Sake's Sake", "酒のための酒"],
    cardLabel: ["Sommelier Card", "ソムリエカード"],
    sayThis: ["SAY THIS TO YOUR SOMMELIER", "ソムリエにこう言え"],
    copied: ["Copied!", "コピー済み！"],
    copy: ["Copy", "コピー"],
    preferred: ["PREFERRED", "好み"],
    flavors: ["FLAVORS", "味わい"],
    avoid: ["AVOID", "避ける"],
    temp: ["TEMP", "温度"],
    topBottles: ["YOUR TOP BOTTLES", "あなたのトップボトル"],
    namePlaceholder: ["Your name (optional)", "名前（任意）"],
    retake: ["Retake Quiz", "クイズをやり直す"],
    allProfiles: ["All Sake Personalities", "全ての酒の個性"],
    you: ["You", "あなた"],
  },
} as const;

/** "Question 2 of 5" / "質問 2 / 5". */
export const questionCounter = (n: number, total: number): Pair => [`Question ${n} of ${total}`, `質問 ${n} / ${total}`];
