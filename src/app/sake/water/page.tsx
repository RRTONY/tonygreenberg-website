import { SakeWater } from "@/components/sake/pages/water";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/WaterAtlas.tsx (2026-11-26).
const seo = { path: "/water", title: "Water Atlas", description: "Sake is 80% water. The invisible ingredient that shapes everything — softness, minerality, fermentation speed, and the soul of each region." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeWater />
    </>
  );
}
