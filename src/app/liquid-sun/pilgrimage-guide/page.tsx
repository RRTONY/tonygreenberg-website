import { PilgrimageGuide } from "@/components/liquidsun/pages/pilgrimage-guide";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/PilgrimageGuide.tsx (2026-11-21).
// Its H1 is "The Pilgrimage", like the /pilgrimage map page; the title uses the menu label
// "Pilgrimage Guide" so the two pages don't share a title.
const seo = {
  path: "/pilgrimage-guide",
  title: "Pilgrimage Guide | LiquidSun",
  description: "It is not a vacation. It is a mission. The path to the source requires respect, stamina, and a designated driver.",
};

export const metadata = liquidsunMetadata(seo);

export default function PilgrimageGuidePage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <PilgrimageGuide />
    </>
  );
}
