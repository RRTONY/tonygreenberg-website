import { JaliscoMap } from "@/components/liquidsun/pages/jalisco-map";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/JaliscoMap.tsx (2026-11-21).
const seo = {
  path: "/jalisco-map",
  title: "The Terroir Map | LiquidSun",
  description: "Tequila is not a monolith. It is a tale of two soils. Hover over the map to discover the soul of each region.",
};

export const metadata = liquidsunMetadata(seo);

export default function JaliscoMapPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <JaliscoMap />
    </>
  );
}
