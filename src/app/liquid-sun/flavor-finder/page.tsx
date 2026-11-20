import { FlavorFinder } from "@/components/liquidsun/pages/flavor-finder";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/FlavorFinder.tsx (2026-11-21).
const seo = {
  path: "/flavor-finder",
  title: "The Compass | LiquidSun",
  description: "Spin the wheel to align your palate with the terroir.",
};

export const metadata = liquidsunMetadata(seo);

export default function FlavorFinderPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <FlavorFinder />
    </>
  );
}
