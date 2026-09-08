import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { ALL_ARTICLE_SLUGS } from "@/lib/content/find-your-me";
import { FindYourMeQuiz } from "@/components/assessments/find-your-me-quiz";

export const metadata: Metadata = {
  title: "Find My to Find Your We",
  description: "A five-question mirror that reveals who you are — and routes you to the people, ideas, and practices that will change everything.",
  alternates: { canonical: "/find-your-me" },
};

type PostLookup = { title: string; slug: string };

export default async function FindYourMePage() {
  const posts = await sanityFetch<PostLookup[]>({
    query: postsBySlugsQuery,
    params: { slugs: ALL_ARTICLE_SLUGS },
    tags: ["post"],
  });
  const articleTitles = Object.fromEntries(posts.map((p) => [p.slug, p.title]));

  return <FindYourMeQuiz articleTitles={articleTitles} />;
}
