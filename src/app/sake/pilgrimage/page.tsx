import { SakePilgrimage } from "@/components/sake/pages/pilgrimage";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Pilgrimage.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/pilgrimage",
  title: "Pilgrimage",
  description: "Multi-day journeys through sake country. Each route includes transport, accommodation, and the bottles not on the regular menu.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakePilgrimage />
    </>
  );
}
