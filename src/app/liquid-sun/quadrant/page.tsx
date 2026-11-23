import { Quadrant } from "@/components/liquidsun/pages/quadrant";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Quadrant.tsx and components/FlavorMatrix.tsx (2026-11-21).
const seo = {
  path: "/quadrant",
  title: "The Flavor Matrix | LiquidSun",
  description: "Map your palate. Find your soul. X-Axis: Terroir (Valley vs. Highlands) • Y-Axis: Intensity (Light vs. Rich)",
};

export const metadata = liquidsunMetadata(seo);

export default function QuadrantPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Quadrant />
    </>
  );
}
