import { SakeKyoto } from "@/components/sake/pages/kyoto";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Kyoto.tsx (2026-11-26).
const seo = { path: "/kyoto", title: "Kyoto Backstreets", description: "Forget the golden pavilion. Behind Pontocho's lantern-lit doorways, beneath Fushimi's canal mist, inside machiya walls darkened by centuries of koji spores — this is where sake lives." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeKyoto />
    </>
  );
}
