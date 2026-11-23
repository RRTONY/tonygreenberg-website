import { aqueousJsonLd } from "@/lib/content/aqueous/structured-data";
import { aqueousTitle } from "@/lib/content/aqueous/seo";

// An Aqueous page's structured data, in the server HTML (see aqueousJsonLd). "<" is escaped so no
// text in the data can close the script tag. Takes the same `seo` object the page's metadata uses.
export function AqueousJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const json = JSON.stringify(aqueousJsonLd({ path, title: aqueousTitle(title), description })).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
