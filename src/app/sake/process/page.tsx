import { SakeProcess } from "@/components/sake/pages/process";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Process.tsx (2026-11-26).
const seo = { path: "/process", title: "Brewing Process", description: "Eight stages. Centuries of wisdom. A journey through the alchemy of rice, water, koji, and time." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeProcess />
    </>
  );
}
