import { SakeValueMatrix } from "@/components/sake/pages/value-matrix";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/ValueMatrix.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/value-matrix",
  title: "Value Matrix",
  description: "The best sake experience isn't always the most expensive. This matrix maps experience quality against price — whether you're buying in the US or Japan.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeValueMatrix />
    </>
  );
}
