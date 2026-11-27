import { Pilgrimage } from "@/components/liquidsun/pages/pilgrimage";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Pilgrimage.tsx (2026-11-21).
const seo = {
  path: "/pilgrimage",
  title: "The Pilgrimage | LiquidSun",
  description:
    "The soil speaks. Listen to the difference between the red clay of the Highlands and the volcanic ash of the Valley.",
};

export const metadata = liquidsunMetadata(seo);

export default function PilgrimagePage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Pilgrimage />
    </>
  );
}
