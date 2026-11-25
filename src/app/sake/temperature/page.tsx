import { SakeTemperature } from "@/components/sake/pages/temperature";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Temperature.tsx (2026-11-26).
const seo = { path: "/temperature", title: "Temperature", description: "The same sake transforms at every degree. Japan names each temperature point — from snow-cold to flying hot. Click to explore." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeTemperature />
    </>
  );
}
