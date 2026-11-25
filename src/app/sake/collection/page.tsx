import { SakeCollection } from "@/components/sake/pages/collection";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";
import { unifiedSakeDatabase } from "@/lib/content/sake/unified-sake-data";

// Ported from the Sake app's client/src/pages/Collection.tsx (2026-11-26). Description: the page's own
// intro line, cut at a word to fit 160 characters.
const seo = {
  path: "/collection",
  title: "Collection",
  description: `${unifiedSakeDatabase.length} bottles that define what sake can be. Each scored by our Extraordinary Value Index (EVI) and Extraordinary Experience Index (EEI).`,
};

export const metadata = sakeMetadata(seo);

export default function SakeCollectionPage() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeCollection />
    </>
  );
}
