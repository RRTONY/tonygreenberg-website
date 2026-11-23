import { Library } from "@/components/liquidsun/pages/library";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Library.tsx (2026-11-21).
const seo = {
  path: "/library",
  title: "The Library | LiquidSun",
  description: "Knowledge is the only additive we allow.",
};

export const metadata = liquidsunMetadata(seo);

export default function LibraryPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Library />
    </>
  );
}
