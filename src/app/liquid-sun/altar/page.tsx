import { Altar } from "@/components/liquidsun/pages/altar";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Altar.tsx (2026-11-21).
const seo = {
  path: "/altar",
  title: "The Altar | LiquidSun",
  description: "Here lies the pinnacle of the spirit. Offerings to the gods of agave.",
};

export const metadata = liquidsunMetadata(seo);

export default function AltarPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Altar />
    </>
  );
}
