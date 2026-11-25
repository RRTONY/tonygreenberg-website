import { SakeTerroir } from "@/components/sake/pages/terroir";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Terroir.tsx (2026-11-26).
const seo = { path: "/terroir", title: "Terroir", description: "Select two prefectures and see how climate, water, rice, and tradition create fundamentally different sake from the same grade." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTerroir />
    </>
  );
}
