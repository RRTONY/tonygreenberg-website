import { SakeMicroseasons } from "@/components/sake/pages/microseasons";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Microseasons.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
const seo = {
  path: "/microseasons",
  title: "72 Seasons",
  description: "Japan doesn't have 4 seasons. It has 72. Each five-day period carries its own poetry, its own food, and its own sake.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeMicroseasons />
    </>
  );
}
