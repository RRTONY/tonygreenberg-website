import { TasteQuiz } from "@/components/soulsmoke/pages/taste-quiz/taste-quiz";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// SoulSmoke taste quiz, ported from the SoulSmoke app's client/src/pages/TasteQuiz.tsx
// (2026-11-10). Title is the results heading; description is the results intro.
const seo = {
  path: "/taste-quiz",
  title: "Your Top 10 Quest List | SoulSmoke",
  description:
    "Based on your preferences, these are the bottles that will speak to your palate. Hunt them down, one by one.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeTasteQuizPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <TasteQuiz />
    </>
  );
}
