import { TheAgaves } from "@/components/liquidsun/pages/the-agaves";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TheAgaves.tsx (2026-11-21).
const seo = {
  path: "/the-agaves",
  title: "The Agaves | LiquidSun",
  description: "Botanical deep dive coming soon.",
};

export const metadata = liquidsunMetadata(seo);

export default function TheAgavesPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TheAgaves />
    </>
  );
}
