import { SakeSpeaking } from "@/components/sake/pages/speaking";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SpeakingGuide.tsx (2026-11-26).
const seo = { path: "/speaking", title: "Speaking Guide", description: "The words you use shape the sake you taste. Master these terms and you'll hear what the brewer is saying through the glass." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSpeaking />
    </>
  );
}
