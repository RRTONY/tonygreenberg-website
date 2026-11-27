import { SacredKitchens } from "@/components/liquidsun/pages/sacred-kitchens";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/SacredKitchens.tsx (2026-11-21).
const seo = {
  path: "/sacred-kitchens",
  title: "Sacred Kitchens | LiquidSun",
  description:
    "Where the spirit meets the soil. The best food in Jalisco isn't in restaurants—it's in the distilleries.",
};

export const metadata = liquidsunMetadata(seo);

export default function SacredKitchensPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <SacredKitchens />
    </>
  );
}
