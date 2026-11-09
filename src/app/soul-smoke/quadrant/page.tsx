import { MezcalQuadrant } from "@/components/soulsmoke/pages/mezcal-quadrant";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/MezcalQuadrant.tsx (2026-11-10).
// Title is the page's H1, description its intro line.
const seo = {
  path: "/quadrant",
  title: "The Mezcal Quadrant | SoulSmoke",
  description: "80 bottles plotted across three dimensions. Click any point to reveal the full story.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SoulsmokeQuadrantPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <MezcalQuadrant />
    </>
  );
}
