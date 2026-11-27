import { ScienceOfSpirit } from "@/components/liquidsun/pages/science-of-spirit";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/ScienceOfSpirit.tsx (2026-11-21).
const seo = {
  path: "/science-of-spirit",
  title: "Science of Spirit | LiquidSun",
  description: "It's not magic. It's biochemistry. And if you cheat the chemistry, you cheat the soul.",
};

export const metadata = liquidsunMetadata(seo);

export default function ScienceOfSpiritPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <ScienceOfSpirit />
    </>
  );
}
