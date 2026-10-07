import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { deleteHighlight } from "./actions";
import { postHref } from "@/lib/content/post-redirects";

// "Your Commonplace Book": passages a member saved while reading (select text
// in any essay). Ported from legacy client/src/pages/MyHighlights.tsx; live
// shows the same signed-out copy (checked 2026-10-06). Grouped by essay,
// newest first, with the essay's real title from Sanity.
export const metadata: Metadata = {
  title: "Your Commonplace Book",
  description: "Your saved passages from across the site.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/my-highlights" },
};

type Highlight = { id: number; post_slug: string; text: string; created_at: string };

export default async function MyHighlightsPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAF7] px-6 py-24 text-center">
        <h1 className="font-heading text-[2.2rem] text-[#0A0A10]">Your Commonplace Book</h1>
        <p className="mx-auto mt-3 max-w-125 text-base/[1.7] text-[#666]">
          Sign in to save and revisit your favorite passages from across the site.
        </p>
        <Link
          href="/login?next=/my-highlights"
          className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#0A0A10] px-8 font-mono text-[0.8rem] tracking-[0.12em] text-brand-gold-light uppercase"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.from("highlights").select("id, post_slug, text, created_at").order("created_at", { ascending: false });
  const highlights = (data ?? []) as Highlight[];
  const slugs = [...new Set(highlights.map((h) => h.post_slug))];
  const posts = slugs.length
    ? await sanityFetch<{ title: string; slug: string }[]>({ query: postsBySlugsQuery, params: { slugs }, tags: ["post"] })
    : [];
  const titleBySlug = Object.fromEntries(posts.map((p) => [p.slug, p.title]));

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-6 py-16">
      <div className="mx-auto max-w-175">
        <p className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">Your Commonplace Book</p>
        <h1 className="mb-2 font-heading text-[2.2rem] text-[#0A0A10]">Saved Passages</h1>
        <p className="mb-10 font-mono text-xs text-[#767676]">
          {highlights.length} {highlights.length === 1 ? "passage" : "passages"} saved from {slugs.length} {slugs.length === 1 ? "essay" : "essays"}
        </p>

        {highlights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E0DCD4] px-5 py-16 text-center text-[1.05rem] text-[#767676]">
            No highlights yet. Select text in any essay to save it here.
          </div>
        ) : (
          slugs.map((slug) => (
            <section key={slug} className="mb-10">
              <h2>
                <Link href={postHref(slug)} className="font-heading text-xl text-[#0A0A10] underline-offset-4 hover:underline">
                  {titleBySlug[slug] ?? slug.replace(/-/g, " ")}
                </Link>
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {highlights
                  .filter((h) => h.post_slug === slug)
                  .map((h) => (
                    <div key={h.id} className="relative rounded-r-lg border-l-3 border-brand-gold-light bg-white py-4 pr-12 pl-5">
                      <p className="font-heading text-[1.05rem]/[1.7] text-[#2C1810] italic">&ldquo;{h.text}&rdquo;</p>
                      <form action={deleteHighlight} className="absolute top-2 right-2">
                        <input type="hidden" name="id" value={h.id} />
                        <button type="submit" aria-label="Remove highlight" className="flex size-9 items-center justify-center text-[#999] hover:text-[#8B0000]">
                          <X aria-hidden="true" className="size-4" />
                        </button>
                      </form>
                    </div>
                  ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
