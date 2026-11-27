import { SakeMyReviews } from "@/components/sake/pages/my-reviews";
import { sakeMetadata } from "@/lib/content/sake/seo";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

// Ported from the Sake app's client/src/pages/MyReviews.tsx (2026-11-26). A member's own page, so it
// stays out of search (noindex) and the sitemap.
const seo = {
  path: "/my-reviews",
  title: "My Reviews",
  description: "Sign in to view and manage all your sake tasting notes in one place.",
  noindex: true,
};

export const metadata = sakeMetadata(seo);

export default function Page() {
  return (
    <>
      <SakeJsonLd {...seo} />
      <SakeMyReviews />
    </>
  );
}
