import { Evolution } from "@/components/liquidsun/pages/evolution";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Evolution.tsx (2026-11-21).
const seo = {
  path: "/evolution",
  title: "The Evolution | LiquidSun",
  description: "From sacred sap to industrial commodity, and back to art. The history of Tequila is a war between efficiency and soul.",
};

export const metadata = liquidsunMetadata(seo);

export default function EvolutionPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Evolution />
    </>
  );
}
