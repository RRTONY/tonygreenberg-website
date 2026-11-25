import { SakeWineTranslation } from "@/components/sake/pages/wine-translation";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/WineTranslation.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/wine-translation",
  title: "Sake ↔ Wine",
  description: "Daiginjo ≈ Riesling Spätlese. Yamahai ≈ Natural Burgundy. Koshu ≈ Amontillado. A translation guide between two worlds.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeWineTranslation />
    </>
  );
}
