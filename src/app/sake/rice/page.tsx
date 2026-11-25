import { SakeRice } from "@/components/sake/pages/rice";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Rice.tsx (2026-11-26).
const seo = { path: "/rice", title: "Rice Encyclopedia", description: "Every great sake begins with a grain of rice. These eight varieties represent centuries of cultivation, selection, and obsession." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeRice />
    </>
  );
}
