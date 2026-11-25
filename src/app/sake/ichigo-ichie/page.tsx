import { SakeIchigoIchie } from "@/components/sake/pages/ichigo-ichie";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/IchigoIchie.tsx (2026-11-26).
const seo = { path: "/ichigo-ichie", title: "Ichi-go Ichi-e", description: "Every combination is unrepeatable. This sake, this dish, this season, this vessel, this mood — a moment that will never exist again. The anti-algorithm." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeIchigoIchie />
    </>
  );
}
