import { SakeDefects } from "@/components/sake/pages/defects";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Defects.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/defects",
  title: "Off-Flavors",
  description: "How to identify them, and why some \"defects\" are actually features. Kintsugi applied to flavor — the crack is where the gold enters.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeDefects />
    </>
  );
}
