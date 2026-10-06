// One-off (2026-10-07): imports live's "Updated for today" version of each
// essay (legacy blogData.json `updatedContent`, checked against live the same
// day: 98-99% word overlap on a sample) into the post's `updatedBody` field,
// which turns on the "Original post / Updated for today" switch. Same
// converter as the original import. Skipped: posts whose two versions are
// identical, and posts whose updated text holds pictures (the converter
// can't carry them; those keep the original only). A stray header some
// texts open with (''' / TITLE: / DATE: lines, shown as text on live) is
// dropped. Written onto the published posts (owner's choice 2026-10-07) and
// onto a pending draft when there is one.
//
// Usage: pnpm tsx scripts/import-2026-10-07-updated-bodies.ts [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";
import { markdownToPortableText } from "./markdown-to-portable-text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const LEGACY = path.join(__dirname, "../_legacy-manus-app/client/src/data/blogData.json");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function stripHeader(md: string) {
  const lines = md.replace(/^\s+/, "").split("\n");
  let i = 0;
  if (/^('''|---|```)\s*$/.test(lines[0] ?? "")) i++;
  while (i < lines.length && (/^[A-Z][A-Z ]{1,20}:\s/.test(lines[i]) || lines[i].trim() === "")) i++;
  if (/^('''|---|```)\s*$/.test(lines[i] ?? "")) i++;
  return i > 0 ? lines.slice(i).join("\n") : md;
}

async function main() {
  const legacy = JSON.parse(fs.readFileSync(LEGACY, "utf8")) as { slug: string; originalContent?: string; updatedContent?: string }[];
  const docs = await client.fetch<{ _id: string; slug: string }[]>(`*[_type == "post" && defined(slug.current)]{ _id, "slug": slug.current }`);
  const idsBySlug = new Map<string, string[]>();
  for (const d of docs) idsBySlug.set(d.slug, [...(idsBySlug.get(d.slug) ?? []), d._id]);

  const tx = client.transaction();
  let count = 0;
  const skipped: Record<string, string[]> = { identical: [], pictures: [], notInSanity: [] };
  for (const post of legacy) {
    const original = post.originalContent ?? "";
    const updated = post.updatedContent ?? "";
    if (original.length <= 50 || updated.length <= 50) continue;
    if (original.trim() === updated.trim()) { skipped.identical.push(post.slug); continue; }
    if (updated.includes("![")) { skipped.pictures.push(post.slug); continue; }
    const ids = idsBySlug.get(post.slug);
    if (!ids) { skipped.notInSanity.push(post.slug); continue; }
    const updatedBody = markdownToPortableText(stripHeader(updated));
    for (const id of ids) tx.patch(id, (p) => p.set({ updatedBody }));
    count++;
  }
  console.log(`${count} essays get an updated version`);
  for (const [why, slugs] of Object.entries(skipped)) console.log(`skipped (${why}): ${slugs.length} ${slugs.join(", ")}`);
  if (DRY_RUN) return console.log("[dry-run] nothing written");
  const res = await tx.commit({ visibility: "async" });
  console.log(`committed ${res.transactionId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
