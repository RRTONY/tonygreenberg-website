import { SakeMusic } from "@/components/sake/pages/music";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Music.tsx (2026-11-26). Title: the page's menu name;
// description: the page's own intro line (the app had no per-page SEO).
const seo = {
  path: "/music",
  title: "Music Pairing",
  description: "Daiginjo with Ryuichi Sakamoto. Nigori with Boris. Koshu with Coltrane. Curated cross-sensory pairings where sound meets liquid.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeMusic />
    </>
  );
}
