import { SakeQuiz } from "@/components/sake/pages/sake-quiz/sake-quiz";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SakeQuiz.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
// The quiz has no intro line, so the description is its own closing note (the result page).
const seo = {
  path: "/sake-quiz",
  title: "Your Profile",
  description: "This profile is a starting point, not a prison. The best sake drinkers are the ones who keep exploring beyond their comfort zone.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeQuiz />
    </>
  );
}
