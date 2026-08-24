// One-time backfill: markdown-to-portable-text.ts had a bug where any
// "loose" markdown list item (an item followed by a body paragraph on the
// next line, e.g. five-cups' "Five Questions Worth Sitting With") produced
// an empty Portable Text block — marked wraps such an item's content in a
// "paragraph" token, but the converter only ever looked for a "text" token.
// Fixed in markdown-to-portable-text.ts; this re-generates `body` for every
// already-migrated post from the same source markdown and patches it in
// place. Idempotent — safe to re-run; only touches `body`, nothing else.
// Usage: pnpm tsx scripts/backfill-list-item-content.ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";
import { markdownToPortableText } from "./markdown-to-portable-text";

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

type LegacyPost = { slug: string; originalContent?: string; updatedContent?: string };

async function run() {
  const dataPath = path.join(__dirname, "../../client/src/data/blogData.json");
  const posts: LegacyPost[] = JSON.parse(await readFile(dataPath, "utf8"));

  const existing = await writeClient.fetch<{ _id: string; body: { listItem?: string; children: unknown[] }[] }[]>(
    `*[_type == "post"]{_id, body}`,
  );
  const existingBodies = new Map(existing.map((d) => [d._id, d.body]));

  let patched = 0;
  let fixedEmptyListItems = 0;
  const tx = writeClient.transaction();
  for (const post of posts) {
    const docId = `post-${post.slug}`;
    const oldBody = existingBodies.get(docId);
    if (!oldBody) continue;

    const hadEmptyListItem = oldBody.some((b) => b.listItem && b.children.length === 0);
    if (hadEmptyListItem) fixedEmptyListItems += 1;

    const body = markdownToPortableText(post.originalContent || post.updatedContent || "");
    tx.patch(docId, (p) => p.set({ body }));
    patched += 1;
  }

  await tx.commit();
  console.log(
    `Patched body on ${patched} posts (${fixedEmptyListItems} had at least one empty list item before this run).`,
  );
}

run();
