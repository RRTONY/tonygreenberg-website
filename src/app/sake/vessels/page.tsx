import { SakeVessels } from "@/components/sake/pages/vessels";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Vessels.tsx (2026-11-26).
const seo = {
  path: "/vessels",
  title: "Vessels",
  description:
    "The same sake in a different vessel is a different sake. Each cup changes the aroma, the temperature, the ritual, and the meaning.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeVessels />
    </>
  );
}
