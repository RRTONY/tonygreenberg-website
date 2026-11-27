import { SakeTerms } from "@/components/sake/pages/terms";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Terms.tsx (2026-11-26).
// The app showed its Terms page at /dmca too; the canonical points at /sake/terms so search
// engines treat it as one page. Title from the footer link.
const seo = { path: "/dmca", title: "DMCA", description: "Last updated: 2026. These terms govern your use of Sake for Sake's Sake™.", href: "/sake/terms" };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTerms />
    </>
  );
}
