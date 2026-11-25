import { SakeMenuAnalyzer } from "@/components/sake/pages/menu-analyzer";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/MenuAnalyzer.tsx (2026-11-26).
const seo = {
  path: "/menu-analyzer",
  title: "Menu Analyzer",
  description:
    "Enter sake names and prices from any restaurant menu. We'll calculate the markup, compare to retail, and tell you which bottle is the best value on the menu.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeMenuAnalyzer />
    </>
  );
}
