// One-time backfill: adds `pullQuote` to posts already migrated by
// migrate-blog-posts.ts (the `post` schema gained this field after the
// initial import). Idempotent — `.set()` is safe to re-run.
// Usage: pnpm tsx scripts/backfill-pull-quotes.ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

async function run() {
  const dataPath = path.join(__dirname, "../../client/src/data/blogData.json");
  const posts: { slug: string; pullQuote?: string }[] = JSON.parse(
    await readFile(dataPath, "utf8"),
  );

  let patched = 0;
  const tx = writeClient.transaction();
  for (const post of posts) {
    if (!post.pullQuote) continue;
    tx.patch(`post-${post.slug}`, (p) => p.set({ pullQuote: post.pullQuote }));
    patched += 1;
  }

  if (patched === 0) {
    console.log("No posts have a pullQuote — nothing to do.");
    return;
  }

  await tx.commit();
  console.log(`Patched pullQuote on ${patched} posts.`);
}

run();
