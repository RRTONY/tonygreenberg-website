import { LiquidsunHome } from "@/components/liquidsun/pages/home";
import { liquidsunMetadata } from "@/lib/content/liquidsun/seo";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

// LiquidSun home, ported from the LiquidSun app's client/src/pages/Home.tsx (2026-11-21).
// Title and description are the app's own (its index.html).
const seo = {
  path: "/",
  title: "LiquidSun — The Soul of Tequila | Additive-Free Curation",
  description:
    "LiquidSun curates the world's finest additive-free tequilas. Explore our Flavor Matrix, discover Gateway bottles from $30, and find your perfect pour from verified producers in Jalisco, Mexico.",
};

export const metadata = liquidsunMetadata(seo);

export default function LiquidsunHomePage() {
  return (
    <>
      <LiquidsunJsonLd {...seo} />
      <LiquidsunHome />
    </>
  );
}
