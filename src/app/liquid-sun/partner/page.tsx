import { Partner } from "@/components/liquidsun/pages/partner";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Partner.tsx (2026-11-21).
const seo = {
  path: "/partner",
  title: "Become a Partner | LiquidSun",
  description:
    "LiquidSun reaches the most discerning tequila enthusiasts on the internet. If your brand is additive-free and traditionally made, we want to amplify your story to the audience that matters most.",
};

export const metadata = liquidsunMetadata(seo);

export default function PartnerPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Partner />
    </>
  );
}
