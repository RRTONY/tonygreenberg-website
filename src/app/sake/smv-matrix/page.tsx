import { SakeSmvMatrix } from "@/components/sake/pages/smv-matrix";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/SMVMatrix.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/smv-matrix", title: "SMV Matrix", description: "Sake Meter Value (SMV) measures density — negative is sweet, positive is dry. Cross it with acidity and hidden style families emerge from the data." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeSmvMatrix />
    </>
  );
}
