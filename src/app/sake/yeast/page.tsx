import { SakeYeast } from "@/components/sake/pages/yeast";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Yeast.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/yeast",
  title: "Yeast Strains",
  description: "Association No. 7, No. 9, No. 14, No. 18. Plus wild flower yeasts captured from petals and house yeasts living in brewery walls. Each strain is a personality.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeYeast />
    </>
  );
}
