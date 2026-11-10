import { soulsmokeJsonLd } from "@/lib/content/soulsmoke/structured-data";

// A SoulSmoke page's structured data, in the server HTML (see soulsmokeJsonLd). "<" is escaped so
// no text in the data can close the script tag.
export function SoulsmokeJsonLd(props: { path: string; title: string; description: string }) {
  const json = JSON.stringify(soulsmokeJsonLd(props)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
