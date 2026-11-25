import { SakeScanner } from "@/components/sake/pages/sake-scanner";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SakeScanner.tsx (2026-11-26).
const seo = {
  path: "/sake-scanner",
  title: "Sake Scanner",
  description:
    "Snap a photo of any sake label. Our AI identifies the bottle, estimates pricing, and tells you exactly what you're looking at.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeScanner />
    </>
  );
}
