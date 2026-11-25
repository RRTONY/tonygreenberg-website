import { SakeSommelierCard } from "@/components/sake/pages/sommelier-card/sommelier-card";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SommelierCard.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/sommelier-card", title: "Sommelier Card", description: "Discover your sake personality. Get a phrase to tell any sommelier exactly what you want — in English and Japanese." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSommelierCard />
    </>
  );
}
