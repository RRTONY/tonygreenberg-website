import { SakeCompare } from "@/components/sake/pages/compare";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Compare.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/compare", title: "Compare Sakes", description: "Select 2 or 3 sakes to compare side-by-side. Scores, aroma profiles, pricing, and key attributes laid bare." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeCompare />
    </>
  );
}
