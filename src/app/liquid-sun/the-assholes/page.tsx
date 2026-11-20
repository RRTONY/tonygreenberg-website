import { TheAssholes } from "@/components/liquidsun/pages/the-assholes";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TheAssholes.tsx (2026-11-21).
const seo = {
  path: "/the-assholes",
  title: "The Assholes | LiquidSun",
  description: "\"The Wall of Shame. The Diffuser Den. The Additive Army.\"",
};

export const metadata = liquidsunMetadata(seo);

export default function TheAssholesPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TheAssholes />
    </>
  );
}
