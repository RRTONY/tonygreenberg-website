import { SakeHomeIzakaya } from "@/components/sake/pages/home-izakaya";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/HomeIzakaya.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/home-izakaya",
  title: "Home Izakaya",
  description: "Transform your kitchen into a Kyoto backstreet bar. Lighting, music, vessels, temperature, food sequence, seasonal ikebana.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeHomeIzakaya />
    </>
  );
}
