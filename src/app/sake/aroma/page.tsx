import { SakeAroma } from "@/components/sake/pages/aroma";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Aroma.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/aroma",
  title: "Aroma Finder",
  description: "Select the aromas that speak to you. We'll find the bottles that match your nose.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeAroma />
    </>
  );
}
