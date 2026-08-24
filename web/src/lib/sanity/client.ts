import { createClient, type QueryParams } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
}

// Read-only client, safe to use in Server Components. No token — Sanity
// datasets are publicly readable by default, and this client never mutates.
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
  stega: false,
});

// Typed fetch wrapper with Next.js cache + tag-based revalidation. Use this
// instead of client.fetch() everywhere so Sanity-sourced pages can be
// revalidated on publish (see the Sanity webhook route, Phase 11) without a
// redeploy.
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags: ["sanity", ...tags],
    },
  });
}
