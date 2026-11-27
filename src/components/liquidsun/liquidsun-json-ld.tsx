import { liquidsunJsonLd } from "@/lib/content/liquidsun/structured-data";

// A LiquidSun page's structured data, in the server HTML (see liquidsunJsonLd). "<" is escaped so
// no text in the data can close the script tag.
export function LiquidsunJsonLd(props: { path: string; title: string; description: string }) {
  const json = JSON.stringify(liquidsunJsonLd(props)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
