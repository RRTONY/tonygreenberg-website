import { SakeTerms } from "@/components/sake/pages/terms";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Terms.tsx (2026-11-26).
const seo = { path: "/terms", title: "Terms of Use", description: "Last updated: 2026. These terms govern your use of Sake for Sake's Sake™." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTerms />
    </>
  );
}
