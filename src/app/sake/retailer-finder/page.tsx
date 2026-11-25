import { SakeRetailerFinder } from "@/components/sake/pages/retailer-finder";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/RetailerFinder.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/retailer-finder", title: "Retailer Finder", description: "Enter your ZIP code to find sake retailers near you — from specialty shops to Japanese grocery stores to online delivery." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeRetailerFinder />
    </>
  );
}
