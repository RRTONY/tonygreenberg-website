import { SakeQprRankings } from "@/components/sake/pages/qpr-rankings";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/QPRRankings.tsx (2026-11-26).
const seo = {
  path: "/qpr",
  title: "QPR Rankings",
  description:
    "The only number that matters when buying sake. Quality divided by price — because the best bottle is the one that gives you the most magic per dollar.",
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeQprRankings />
    </>
  );
}
