import { SakeKurabito } from "@/components/sake/pages/kurabito";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Kurabito.tsx (2026-11-26).
const seo = { path: "/kurabito", title: "Kurabito Diaries", description: "They leave their families in October and return in March. Six months of silence, 4am wake-ups, and the slow transformation of rice into something sacred." };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeKurabito />
    </>
  );
}
