import { SakeProducers } from "@/components/sake/pages/producers";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Producers.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = { path: "/producers", title: "Producers", description: "Your sake has a soul. We want to tell its story. Join the most discerning sake platform in the world." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeProducers />
    </>
  );
}
