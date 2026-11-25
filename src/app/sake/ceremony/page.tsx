import { SakeCeremony } from "@/components/sake/pages/ceremony";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Ceremony.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/ceremony",
  title: "Ceremony",
  description: "Eight steps from purification to return. A ceremony older than written history, refined over millennia, available to you tonight.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeCeremony />
    </>
  );
}
