import { SakeExvSystem } from "@/components/sake/pages/exv-system";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/EXVSystem.tsx (2026-11-26). Description: the page's own
// intro, cut at a sentence to fit 160 characters.
const seo = {
  path: "/exv",
  title: "EXV System",
  description: "Experience Value. Not what sake IS — what it DOES to you. Seven emotional dimensions. Six experiential tiers.",
};

export const metadata = sakeMetadata(seo);

export default function SakeExvPage() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeExvSystem />
    </>
  );
}
