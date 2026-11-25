import { SakeTojiLineage } from "@/components/sake/pages/toji-lineage";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/TojiLineage.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/toji",
  title: "Toji Lineage",
  description: "Five great guilds. Centuries of tradition. Each guild shaped a region's sake identity through philosophy, technique, and the water they mastered.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTojiLineage />
    </>
  );
}
