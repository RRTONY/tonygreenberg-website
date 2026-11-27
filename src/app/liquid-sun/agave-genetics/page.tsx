import { AgaveGenetics } from "@/components/liquidsun/pages/agave-genetics";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/AgaveGenetics.tsx (2026-11-21).
const seo = {
  path: "/agave-genetics",
  title: "The Clone Wars | LiquidSun",
  description: "Why 99% of Tequila is genetically identical, and why that's a ticking time bomb.",
};

export const metadata = liquidsunMetadata(seo);

export default function AgaveGeneticsPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <AgaveGenetics />
    </>
  );
}
