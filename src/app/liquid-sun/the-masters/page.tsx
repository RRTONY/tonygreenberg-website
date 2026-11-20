import { TheMasters } from "@/components/liquidsun/pages/the-masters";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/TheMasters.tsx (2026-11-21).
const seo = {
  path: "/the-masters",
  title: "The Masters | LiquidSun",
  description: "The hands that touch the earth, the hearts that honor the plant. These are the guardians of the spirit.",
};

export const metadata = liquidsunMetadata(seo);

export default function TheMastersPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <TheMasters />
    </>
  );
}
