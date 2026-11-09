import { SacredKitchens } from "@/components/soulsmoke/pages/sacred-kitchens";
import { soulsmokeMetadata } from "@/lib/content/soulsmoke/seo";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

// Ported from the SoulSmoke app's client/src/pages/Restaurants.tsx (2026-11-10).
const seo = {
  path: "/sacred-kitchens",
  title: "Sacred Kitchens | SoulSmoke",
  description:
    "Mezcal is only half the story. These are the kitchens where the spirit of Oaxaca lives on the plate: the food experiences that touch the mind and touch the heart.",
};

export const metadata = soulsmokeMetadata(seo);

export default function SacredKitchensPage() {
  return (
    <>
      <SoulsmokeJsonLd {...seo} />
      <SacredKitchens />
    </>
  );
}
