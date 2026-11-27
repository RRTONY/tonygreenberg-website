import { Encyclopedia } from "@/components/liquidsun/pages/encyclopedia";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Encyclopedia.tsx (2026-11-21).
const seo = {
  path: "/tequila-encyclopedia",
  title: "The Tequilas | LiquidSun",
  description: "A curated index of the spirits that matter. No diffusers. No additives. Just soul.",
};

export const metadata = liquidsunMetadata(seo);

export default function EncyclopediaPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Encyclopedia />
    </>
  );
}
