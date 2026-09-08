import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

// `/life-assessment` and `/the-mirror` served the identical legacy
// component at two URLs (`_legacy-manus-app/client/src/App.tsx` lines
// 488-489: `<Route path="/life-assessment" component={LifeAssessment} />`
// immediately followed by `<Route path="/the-mirror" component={LifeAssessment} />`),
// with near-duplicate legacy SEO metadata for both ("The Mirror — Life
// Assessment", same description, in legacy's own server/seo-meta.ts). This
// migration picked `/the-mirror` as the one real page (app/the-mirror/
// page.tsx) because every internal link to this assessment already built
// elsewhere in this app already points there — see that route's own
// port-note comment for the full accounting. This route permanently
// redirects rather than duplicating the page, so the assessment isn't
// indexed as duplicate content under two URLs.
export const metadata: Metadata = {
  title: "The Mirror",
  description:
    "A six-dimension life assessment. Eighteen questions mapping where you actually are across relationships, purpose, health, truth, tribe, and consciousness.",
  alternates: { canonical: "/the-mirror" },
};

export default function LifeAssessmentPage() {
  permanentRedirect("/the-mirror");
}
