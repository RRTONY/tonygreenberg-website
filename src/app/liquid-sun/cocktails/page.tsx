import { Cocktails } from "@/components/liquidsun/pages/cocktails";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// Ported from the LiquidSun app's client/src/pages/Cocktails.tsx (2026-11-21).
// Its H1 is "The Altar" in the app (same as /altar); the title uses the menu label "Cocktails"
// so the two pages don't share a title.
const seo = {
  path: "/cocktails",
  title: "Cocktails | LiquidSun",
  description: "We do not mask the spirit. We elevate it. These are the vessels.",
};

export const metadata = liquidsunMetadata(seo);

export default function CocktailsPage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <Cocktails />
    </>
  );
}
