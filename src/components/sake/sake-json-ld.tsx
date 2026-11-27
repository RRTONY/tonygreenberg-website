import { sakeJsonLd, type SakeSeo } from "@/lib/content/sake/seo";

// A Sake page's structured data, in the server HTML. "<" is escaped so no text in the data can
// close the script tag. Takes the same `seo` object the page's metadata uses.
export function SakeJsonLd(seo: Pick<SakeSeo, "path" | "title" | "description" | "href">) {
  const json = JSON.stringify(sakeJsonLd(seo)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
