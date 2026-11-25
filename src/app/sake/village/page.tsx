import { SakeVillage } from "@/components/sake/pages/village";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Village.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/village",
  title: "Village Breweries",
  description: "Tiny 1-3 person operations in remote mountain villages. The breweries you'll never find on Google. Where the toji IS the owner IS the farmer.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeVillage />
    </>
  );
}
