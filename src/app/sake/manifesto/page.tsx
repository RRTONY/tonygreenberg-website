import { SakeManifesto } from "@/components/sake/pages/manifesto";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Manifesto.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/manifesto",
  title: "Anti-Score Manifesto",
  description: "Why we reject 100-point scoring. Why EVI and EEI matter more than Parker points. The soul of this site distilled into words.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeManifesto />
    </>
  );
}
