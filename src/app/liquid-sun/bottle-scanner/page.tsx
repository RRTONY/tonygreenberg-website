import { BottleScanner } from "@/components/liquidsun/pages/bottle-scanner";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/BottleScanner.tsx (2026-11-21).
const seo = {
  path: "/bottle-scanner",
  title: "The Oracle | LiquidSun",
  description: "Upload a photo. Reveal the soul.",
};

export const metadata = liquidsunMetadata(seo);

export default function BottleScannerPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <BottleScanner />
    </>
  );
}
