import { SakeFavorites } from "@/components/sake/pages/favorites";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/Favorites.tsx (2026-11-26). Title: the page's menu name;
// description: its own intro line.
// A visitor's own saved list, kept in their browser: noindex, and left out of the sitemap.
const seo = { path: "/favorites", title: "Favorites", description: "Every bottle remembered, every page bookmarked, every moment saved. Your personal map through the world of sake.", noindex: true };

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeFavorites />
    </>
  );
}
