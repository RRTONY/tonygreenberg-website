import { SakeRetailers } from "@/components/sake/pages/retailers";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Retailers.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/retailers",
  title: "Where to Buy",
  description: "The best sake retailers in the world — vetted, ranked, and organized by region. Every link supports this guide through our partnership program.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeRetailers />
    </>
  );
}
