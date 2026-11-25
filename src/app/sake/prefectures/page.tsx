import { SakePrefectures } from "@/components/sake/pages/prefectures";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Prefectures.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/prefectures",
  title: "Prefectures",
  description: "From Niigata's snow country to Saga's tropical warmth. Every prefecture tells a different story through its sake.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakePrefectures />
    </>
  );
}
