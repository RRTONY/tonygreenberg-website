import type { Metadata } from "next";
import { PostIntervention } from "@/components/post-intervention/post-intervention";
import { seoTitle } from "@/lib/seo-defaults";

export const metadata: Metadata = {
  // Through seoTitle so a long title drops " | Tony Greenberg" (CONTRIBUTING.md SEO rules).
  title: seoTitle("How Are You, Really? Post-Intervention Assessment"),
  description:
    "An anonymous check-in after a ceremony, retreat, breathwork or psychedelic session: Day 1, Day 3 or Day 7. Your experience shapes how the next person is guided.",
  alternates: { canonical: "/post-intervention" },
};

export default function PostInterventionPage() {
  return <PostIntervention />;
}
