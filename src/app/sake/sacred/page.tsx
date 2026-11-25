import { SakeSacred } from "@/components/sake/pages/sacred";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Sacred.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/sacred",
  title: "Sacred Sake",
  description: "Before sake was an industry, it was a prayer. Before it was refined, it was raw. Before men brewed it, women did.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSacred />
    </>
  );
}
