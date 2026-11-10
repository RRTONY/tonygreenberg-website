import { gemsparkJsonLd, type GemSparkVersion } from "@/lib/content/gemspark/structured-data";

// A GemSpark page's structured data, in the server HTML (see gemsparkJsonLd). "<" is escaped so
// no text in the data can close the script tag.
export function GemsparkJsonLd(props: { version: GemSparkVersion; headline: string; description: string }) {
  const json = JSON.stringify(gemsparkJsonLd(props)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
