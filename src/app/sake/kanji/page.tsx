import { SakeKanjiDecoder } from "@/components/sake/pages/kanji-decoder";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/KanjiDecoder.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/kanji",
  title: "Kanji Decoder",
  description: "Every sake label is a coded message. Rice type, polishing ratio, brewing method, yeast strain — it's all there in the kanji, if you know how to read it.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeKanjiDecoder />
    </>
  );
}
