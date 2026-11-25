import { SakeFushimi } from "@/components/sake/pages/fushimi";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Fushimi.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/fushimi",
  title: "Fushimi",
  description: "The second-largest sake district in Japan, hidden in southern Kyoto.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeFushimi />
    </>
  );
}
