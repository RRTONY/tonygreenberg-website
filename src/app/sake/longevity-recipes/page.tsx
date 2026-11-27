import { SakeLongevityRecipes } from "@/components/sake/pages/longevity-recipes";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/LongevityRecipes.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/longevity-recipes",
  title: "Longevity Recipes",
  description: "Sake isn't just for drinking. The koji fermentation that creates sake also creates the most nutritionally dense ingredients in Japanese cuisine.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeLongevityRecipes />
    </>
  );
}
