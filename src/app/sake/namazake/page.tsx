import { SakeNamazake } from "@/components/sake/pages/namazake";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Namazake.tsx (2026-11-26). Description: the page's own
// intro, cut at a sentence to fit 160 characters.
const seo = {
  path: "/namazake",
  title: "Namazake",
  description: "Unpasteurized. Unfiltered by convention. Still breathing when it touches your lips.",
};

export const metadata = sakeMetadata(seo);

export default function SakeNamazakePage() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeNamazake />
    </>
  );
}
