import type { Metadata } from "next";
import { sanityFetch } from "@/lib/content/legacy-content-query-adapter";
import { postsBySlugsQuery } from "@/lib/content/legacy-content-query-tokens";
import { MIRROR_ARTICLE_SLUGS } from "@/lib/content/mirror-data";
import { TheMirrorQuiz } from "@/components/assessments/the-mirror-quiz";

// Legacy registered this exact component at both `/life-assessment` and
// `/the-mirror` (see `_legacy-manus-app/client/src/App.tsx` lines 488-489 —
// same `LifeAssessment` component, back to back). This app treats
// `/the-mirror` as canonical: it's the only path used by every real link to
// this assessment already built elsewhere in this migration
// (site-nav-data.ts's main nav, journey-tracker.tsx's JOURNEY_MAP,
// find-your-me.ts's DIRECTORY/ARCHETYPES, find-your-therapy-quiz.tsx's
// "Journey Continues" card) — `/life-assessment` has zero internal
// references anywhere in this codebase. `/life-assessment` (app/life-
// assessment/page.tsx) permanently redirects here.
export const metadata: Metadata = {
  title: "The Mirror",
  description:
    "A six-dimension life assessment. Eighteen questions mapping where you actually are across relationships, purpose, health, truth, tribe, and consciousness — and how fast you can close the gap.",
  alternates: { canonical: "/the-mirror" },
};

type PostLookup = { title: string; slug: string };

export default async function TheMirrorPage() {
  const posts = await sanityFetch<PostLookup[]>({
    query: postsBySlugsQuery,
    params: { slugs: MIRROR_ARTICLE_SLUGS },
    tags: ["post"],
  });
  const articleTitles = Object.fromEntries(posts.map((p) => [p.slug, p.title]));

  return <TheMirrorQuiz articleTitles={articleTitles} />;
}
