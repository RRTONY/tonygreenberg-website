import { BookOpen, Cherry, Coins, Compass, Droplet, Earth, Flower2, Gem, Sparkles, Sprout, Target, Zap, type LucideIcon } from "lucide-react";
import { qprSakeDatabase, type QPRSake } from "@/lib/content/sake/qpr-data";

// Questions, copy and matching for the homepage "60-Second Sake Match", ported from the Sake app's
// client/src/components/SakeQuizHero.tsx (QUIZ_QUESTIONS, getRecommendations). The option emoji the app
// showed as icons are lucide icons (rule 18): 🌸 Flower2, 🍯 Droplet, ⚡ Zap, 🍑 Cherry, 🌱 Sprout,
// 🧭 Compass, 🎯 Target, 🦄 Gem, 💰 Coins, 🌍 Earth, 📖 BookOpen, ✨ Sparkles.

export type QuizOption = { id: string; en: string; ja: string; icon: LucideIcon; tags: string[] };
export type QuizQuestion = { id: string; en: string; ja: string; options: QuizOption[] };

export const sakeQuizHeroData = {
  questions: [
    {
      id: "mood",
      en: "What are you in the mood for?",
      ja: "今の気分は？",
      options: [
        { id: "light", en: "Something light and refreshing", ja: "軽くて爽やかなもの", icon: Flower2, tags: ["light", "floral", "crisp"] },
        { id: "rich", en: "Something rich and complex", ja: "豊かで複雑なもの", icon: Droplet, tags: ["rich", "umami", "complex"] },
        { id: "bold", en: "Something bold and dry", ja: "力強く辛口なもの", icon: Zap, tags: ["dry", "bold", "mineral"] },
        { id: "sweet", en: "Something fruity and aromatic", ja: "フルーティーで芳醇なもの", icon: Cherry, tags: ["fruity", "aromatic", "sweet"] },
      ],
    },
    {
      id: "experience",
      en: "Your sake experience level?",
      ja: "日本酒の経験は？",
      options: [
        { id: "new", en: "Completely new to sake", ja: "日本酒は初めて", icon: Sprout, tags: ["beginner", "approachable"] },
        { id: "curious", en: "Had a few, want to explore", ja: "少し飲んだことがある", icon: Compass, tags: ["explorer", "mid-range"] },
        { id: "enthusiast", en: "I know my Junmai from Daiginjo", ja: "純米と大吟醸の違いがわかる", icon: Target, tags: ["enthusiast", "premium"] },
        { id: "obsessed", en: "Show me the unicorns", ja: "ユニコーンを見せて", icon: Gem, tags: ["connoisseur", "rare"] },
      ],
    },
    {
      id: "values",
      en: "What matters most to you?",
      ja: "最も大切なのは？",
      options: [
        { id: "value", en: "Best bang for my buck", ja: "コスパ最高", icon: Coins, tags: ["value", "qpr"] },
        { id: "local", en: "Low carbon footprint", ja: "カーボンフットプリントが低い", icon: Earth, tags: ["local", "sustainable"] },
        { id: "story", en: "The story behind the bottle", ja: "ボトルの背景にある物語", icon: BookOpen, tags: ["story", "craft"] },
        { id: "wow", en: 'Pure "wow" factor', ja: "純粋な「感動」", icon: Sparkles, tags: ["wow", "premium", "rare"] },
      ],
    },
  ] satisfies QuizQuestion[],
  intro: {
    badge: ["60-Second Sake Match", "60秒の日本酒マッチ"],
    title: ["Find Your Perfect Bottle", "あなたの完璧な一本を見つけよう"],
    body: [
      "Three questions. Three perfect bottles. No sommelier required. We match your mood, experience, and values to sake that will change how you think about this drink.",
      "3つの質問。3つの完璧なボトル。ソムリエは不要。あなたの気分、経験、価値観に合った日本酒をマッチングします。",
    ],
    start: ["Let's Go", "はじめよう"],
  },
  results: {
    badge: ["Your Perfect Match", "あなたの完璧なマッチ"],
    title: ["Your 3 Perfect Bottles", "あなたの3本の完璧なボトル"],
    body: ["Based on your answers, these are the bottles that will speak to your soul.", "あなたの回答に基づいて、魂に語りかけるボトルを選びました。"],
    viewBuy: ["View & Buy", "詳細・購入"],
    again: ["Try Again", "もう一度"],
    allQpr: ["See All QPR Rankings", "全QPRランキングを見る"],
  },
} as const;

/** The app's getRecommendations(): score every sake against the chosen tags, best three first. */
export function getRecommendations(answers: Record<string, string>, database: QPRSake[] = qprSakeDatabase): QPRSake[] {
  const allTags: string[] = [];
  sakeQuizHeroData.questions.forEach((q) => {
    const selected = q.options.find((o) => o.id === answers[q.id]);
    if (selected) allTags.push(...selected.tags);
  });
  const has = (tag: string) => allTags.includes(tag);

  const scored = database.map((sake) => {
    let score = 0;
    const sakeText = `${sake.flavorProfile.join(" ")} ${sake.aromaProfile.join(" ")} ${sake.type} ${sake.description}`.toLowerCase();

    // Mood
    if (has("light") && (sakeText.includes("clean") || sakeText.includes("crisp") || sakeText.includes("light"))) score += 3;
    if (has("rich") && (sakeText.includes("rich") || sakeText.includes("umami") || sakeText.includes("complex"))) score += 3;
    if (has("dry") && sake.smv > 3) score += 3;
    if (has("bold") && sake.acidity > 1.5) score += 2;
    if (has("fruity") && (sakeText.includes("fruit") || sakeText.includes("melon") || sakeText.includes("apple"))) score += 3;
    if (has("aromatic") && sake.type.includes("Ginjo")) score += 2;
    if (has("sweet") && sake.smv < 2) score += 2;
    if (has("floral") && (sakeText.includes("floral") || sakeText.includes("blossom"))) score += 2;

    // Experience
    if (has("beginner") && sake.priceUS < 35) score += 3;
    if (has("approachable") && sake.qprTier !== "overpriced") score += 2;
    if (has("explorer") && sake.priceUS >= 25 && sake.priceUS <= 60) score += 2;
    if (has("enthusiast") && sake.type.includes("Daiginjo")) score += 2;
    if (has("premium") && sake.qualityScore > 85) score += 2;
    if (has("connoisseur") && sake.usAvailability === "rare") score += 3;
    if (has("rare") && sake.qualityScore > 90) score += 3;

    // Values
    if (has("value") && sake.qprUS > 75) score += 4;
    if (has("qpr") && (sake.qprTier === "legendary" || sake.qprTier === "exceptional")) score += 3;
    if (has("local") && sake.prefecture.includes("USA")) score += 5;
    if (has("sustainable") && sake.priceUS < 40) score += 2;
    if (has("story") && sake.experienceScore > 85) score += 3;
    if (has("craft") && sake.usAvailability !== "widely") score += 2;
    if (has("wow") && sake.qualityScore > 88) score += 3;

    return { sake, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.sake);
}
