import { quizQuestions, sakeProfiles, type SakeProfile } from "@/lib/content/sake/experience-data";

// "Your Sake Profile" quiz (the Sake app's client/src/pages/SakeQuiz.tsx): the questions and the four
// profiles live in the shared experience-data.ts (as in the app); this file holds the flow's own copy
// (English, Japanese) and the scoring the app did in the page.

export const sakeQuizQuestions = quizQuestions;
export const SAKE_QUIZ_TOTAL = quizQuestions.length;
/** The app waited 400ms after a pick before moving on, so the picked answer shows as selected. */
export const ANSWER_DELAY_MS = 400;

type Copy = [en: string, ja: string];

export const sakeQuizData = {
  questionOf: (n: number, total: number): Copy => [`Question ${n} of ${total}`, `質問 ${n} / ${total}`],
  startOver: ["Start Over", "やり直す"] as Copy,
  previous: ["Previous question", "前の質問"] as Copy,
  resultEyebrow: ["Your Sake Soul", "あなたの酒の魂"] as Copy,
  yourStyles: ["Your Styles", "あなたのスタイル"] as Copy,
  startHere: ["Start Here", "ここから始める"] as Copy,
  yourTemperature: ["Your Temperature", "あなたの温度"] as Copy,
  yourVessel: ["Your Vessel", "あなたの器"] as Copy,
  takeAgain: ["Take Again", "もう一度"] as Copy,
  exploreCollection: ["Explore the Collection", "コレクションを探求"] as Copy,
  buildExv: ["Build Your EXV", "EXVを作る"] as Copy,
  closingNote: [
    "This profile is a starting point, not a prison. The best sake drinkers are the ones who keep exploring beyond their comfort zone. Your soul print will evolve with every bottle.",
    "このプロフィールは出発点であり、牢獄ではない。最高の酒飲みは、快適ゾーンの向こう側を探求し続ける人。あなたの魂の指紋はすべての瓶とともに進化する。",
  ] as Copy,
};

/** The app's scoring: tally every answer's scores, fold them into four profiles, take the top one. */
export function profileFor(answers: number[]): SakeProfile {
  const totals: Record<string, number> = {};
  answers.forEach((ansIdx, qIdx) => {
    const option = quizQuestions[qIdx]?.options[ansIdx];
    if (!option) return;
    for (const [key, val] of Object.entries(option.scores)) totals[key] = (totals[key] || 0) + val;
  });
  const s = (k: string) => totals[k] || 0;
  const profileScores: Record<string, number> = {
    refined: s("refined") + s("daiginjo") + s("mineral"),
    rich: s("rich") + s("aged") + s("umami") + s("junmai"),
    funky: s("funky") + s("nama") + s("natural"),
    aromatic: s("aromatic") + s("sweet") + s("light") + s("dry"),
  };
  const topKey = Object.entries(profileScores).sort((a, b) => b[1] - a[1])[0][0];
  return sakeProfiles.find((p) => p.key === topKey) || sakeProfiles[0];
}
